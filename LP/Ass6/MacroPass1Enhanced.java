import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;


public class MacroPass1Enhanced {

    static class MNTEntry {
        String name;
        int mdtIndex;   // index into MDT where macro body starts (0-based)
        int pntabIndex; // starting index into PNTAB (0-based)
        int kpdtIndex;  // starting index into KPDTAB (0-based) or -1 if none
        int ppCount;    // number of positional params
        int kpCount;    // number of keyword params

        MNTEntry(String name, int mdtIndex, int pntabIndex, int kpdtIndex, int ppCount, int kpCount) {
            this.name = name;
            this.mdtIndex = mdtIndex;
            this.pntabIndex = pntabIndex;
            this.kpdtIndex = kpdtIndex;
            this.ppCount = ppCount;
            this.kpCount = kpCount;
        }

        @Override
        public String toString() {
            return String.format("%s\t%d\t%d\t%d\t%d\t%d", name, mdtIndex, pntabIndex,
                    (kpdtIndex >= 0 ? kpdtIndex : -1), ppCount, kpCount);
        }
    }

    private static final Pattern TOKEN_SPLIT = Pattern.compile("\\s+");

    // Global tables
    private final Map<String, MNTEntry> mnt = new LinkedHashMap<>();
    private final List<String> mdt = new ArrayList<>();
    private final List<String> pntab = new ArrayList<>();   // entries: paramName (macro-local order appended)
    private final List<String> kpdtab = new ArrayList<>(); // entries: "paramName=defaultValue"

    // For debug/ease: map macro -> its param list (local order, positional then keyword)
    private final Map<String, List<String>> macroParams = new LinkedHashMap<>();

    public void process(Path sourcePath) throws IOException {
        List<String> lines = Files.readAllLines(sourcePath);
        String base = getBaseName(sourcePath.getFileName().toString());

        Path intermediatePath = Paths.get("intermediate_" + base + ".txt");

        try (BufferedWriter interm = Files.newBufferedWriter(intermediatePath)) {
            int idx = 0;
            while (idx < lines.size()) {
                String raw = lines.get(idx);
                String line = raw.trim();

                if (line.isEmpty()) {
                    interm.write(raw);
                    interm.newLine();
                    idx++;
                    continue;
                }
                if (isComment(line)) {
                    interm.write(raw);
                    interm.newLine();
                    idx++;
                    continue;
                }

                String upper = line.toUpperCase();
                int macroTokenPos = indexOfToken(upper, "MACRO");

                if (macroTokenPos >= 0) {
                    // handle macro header
                    String headerLine = null;
                    // if name present before MACRO or params after MACRO on same line
                    String[] tokens = TOKEN_SPLIT.split(line);

                    if (macroTokenPos > 0 && tokens.length > macroTokenPos + 1) {
                        // e.g. "INCR MACRO &A,&B" or "INCR MACRO"
                        // if tokens beyond MACRO, they are params; combine tokens[0] + rest
                        StringBuilder sb = new StringBuilder();
                        sb.append(tokens[0]); // macro name
                        // append possible params after MACRO
                        for (int t = macroTokenPos + 1; t < tokens.length; t++) {
                            if (sb.length() > 0) sb.append(' ');
                            sb.append(tokens[t]);
                        }
                        headerLine = sb.toString();
                        idx++; // consumed this line
                    } else if (macroTokenPos > 0) {
                        // "NAME MACRO" and no params on same line -> header might be next line or there might be no params
                        // read next non-empty non-comment line as header (parameters + possibly label/opcode)
                        idx++;
                        while (idx < lines.size() && lines.get(idx).trim().isEmpty()) idx++;
                        if (idx >= lines.size()) throw new IOException("Unexpected EOF after MACRO token");
                        headerLine = lines.get(idx).trim();
                        idx++;
                    } else {
                        // "MACRO" alone -> next non-empty non-comment line is header
                        idx++;
                        while (idx < lines.size() && lines.get(idx).trim().isEmpty()) idx++;
                        if (idx >= lines.size()) throw new IOException("Unexpected EOF after MACRO token");
                        headerLine = lines.get(idx).trim();
                        idx++;
                    }

                    // parse headerLine: first token = macroName, rest = params part (if any)
                    String[] headerTokens = TOKEN_SPLIT.split(headerLine, 2);
                    String macroName = headerTokens[0];
                    String paramsPart = (headerTokens.length > 1) ? headerTokens[1].trim() : "";

                    // Some sources may place params after opcode label/opcode conventions, but we'll assume header format: NAME [params]
                    // Parse params into positional and keyword
                    ParsedParams parsed = parseFormalParamsWithDefaults(paramsPart);

                    // Record PNTAB start index
                    int pntabStart = pntab.size();
                    // Append param names to PNTAB: positional first, then keyword
                    List<String> localParamOrder = new ArrayList<>();
                    for (String p : parsed.positional) {
                        pntab.add(p);
                        localParamOrder.add(p);
                    }
                    for (String p : parsed.keywordNames) {
                        pntab.add(p);
                        localParamOrder.add(p);
                    }

                    int kpdtStart = -1;
                    if (!parsed.keywordNames.isEmpty()) {
                        kpdtStart = kpdtab.size();
                        // for each keyword, store "param=default" (keep raw default token)
                        for (int i = 0; i < parsed.keywordNames.size(); i++) {
                            String kn = parsed.keywordNames.get(i);
                            String def = parsed.keywordDefaults.get(i);
                            kpdtab.add(kn + "=" + def);
                        }
                    }

                    // MDT index where this macro's body will start
                    int mdtStart = mdt.size();

                    // Add MNT entry
                    MNTEntry e = new MNTEntry(macroName, mdtStart, pntabStart, kpdtStart,
                            parsed.positional.size(), parsed.keywordNames.size());
                    mnt.put(macroName, e);
                    macroParams.put(macroName, Collections.unmodifiableList(localParamOrder));

                    // Read macro body lines until MEND
                    while (idx < lines.size()) {
                        String bodyRaw = lines.get(idx);
                        String bodyTrim = bodyRaw.trim();

                        // replace occurrences of &param with (P,i) where i is 1-based index in localParamOrder
                        String processed = replaceParamsWithPositional(bodyRaw, localParamOrder);

                        mdt.add(processed);
                        idx++;

                        if (bodyTrim.equalsIgnoreCase("MEND") || bodyTrim.toUpperCase().startsWith("MEND ")) {
                            break;
                        }
                    }
                    // do NOT write the macro definition to intermediate
                    continue;
                }

                // not a macro directive: write to intermediate unchanged
                interm.write(raw);
                interm.newLine();
                idx++;
            } // end while
        } // close intermediate writer

        // write the tables with the requested filenames
        writeMNT(sourcePath, mnt);
        writeMDT(sourcePath, mdt);
        writePNTAB(sourcePath, pntab, mnt);
        writeKPDTAB(sourcePath, kpdtab);
        System.out.println("Pass-1 complete. Files created for: " + getBaseName(sourcePath.getFileName().toString()));
    }

    // helper: parse formal params that may include keyword defaults
    private static class ParsedParams {
        List<String> positional = new ArrayList<>();
        List<String> keywordNames = new ArrayList<>();
        List<String> keywordDefaults = new ArrayList<>();
    }

    private static ParsedParams parseFormalParamsWithDefaults(String paramsPart) {
        ParsedParams res = new ParsedParams();
        if (paramsPart == null || paramsPart.isBlank()) return res;
        // split by comma (commonly used)
        String[] parts = paramsPart.split(",");
        for (String raw : parts) {
            String p = raw.trim();
            if (p.isEmpty()) continue;
            // Remove leading '&' if present
            if (p.startsWith("&")) p = p.substring(1);
            // If contains '=' -> keyword param with default
            int eq = p.indexOf('=');
            if (eq >= 0) {
                String name = p.substring(0, eq).trim();
                String def = p.substring(eq + 1).trim();
                // strip quotes if present or leave as-is (we keep default token)
                if (name.startsWith("&")) name = name.substring(1);
                res.keywordNames.add(name);
                res.keywordDefaults.add(def);
            } else {
                res.positional.add(p);
            }
        }
        return res;
    }

    // Replace &param in a line with (P,i) where i is 1-based index within localParamOrder
    private static String replaceParamsWithPositional(String originalLine, List<String> localParams) {
        String result = originalLine;
        // order matters: longer param names first (to avoid partial matches)
        List<String> sorted = new ArrayList<>(localParams);
        sorted.sort((a, b) -> Integer.compare(b.length(), a.length()));

        for (String param : sorted) {
            // regex to match &param (word boundary)
            String regex = "(?i)\\&" + Pattern.quote(param) + "\\b";
            int pos = localParams.indexOf(param);
            String repl = "(P," + (pos + 1) + ")";
            result = result.replaceAll(regex, Matcher.quoteReplacement(repl));
        }
        return result;
    }

    // write MNT_<base>.txt
    private void writeMNT(Path sourcePath, Map<String, MNTEntry> mnt) throws IOException {
        String base = getBaseName(sourcePath.getFileName().toString());
        Path p = Paths.get("MNT_" + base + ".txt");
        try (BufferedWriter w = Files.newBufferedWriter(p)) {
            w.write("Name\tMDT_Index\tPNTAB_Index\tKPDTAB_Index\tPP_Count\tKP_Count");
            w.newLine();
            for (MNTEntry e : mnt.values()) {
                w.write(e.toString());
                w.newLine();
            }
        }
    }

    // write MDT_<base>.txt
    private void writeMDT(Path sourcePath, List<String> mdt) throws IOException {
        String base = getBaseName(sourcePath.getFileName().toString());
        Path p = Paths.get("MDT_" + base + ".txt");
        try (BufferedWriter w = Files.newBufferedWriter(p)) {
            w.write("Index\tDefinition");
            w.newLine();
            for (int i = 0; i < mdt.size(); i++) {
                w.write(i + "\t" + mdt.get(i));
                w.newLine();
            }
        }
    }

    // write PNTAB_<base>.txt (global table listing param entries in order)
    private void writePNTAB(Path sourcePath, List<String> pntab, Map<String, MNTEntry> mnt) throws IOException {
        String base = getBaseName(sourcePath.getFileName().toString());
        Path p = Paths.get("PNTAB_" + base + ".txt");
        try (BufferedWriter w = Files.newBufferedWriter(p)) {
            w.write("Index\tParamName");
            w.newLine();
            for (int i = 0; i < pntab.size(); i++) {
                w.write(i + "\t" + pntab.get(i));
                w.newLine();
            }
            // Also append a summarised mapping macro -> pntab start and count (for convenience)
            w.newLine();
            w.write("----- Macro -> PNTAB mapping -----");
            w.newLine();
            for (MNTEntry e : mnt.values()) {
                w.write(String.format("%s : start=%d count=%d", e.name, e.pntabIndex, e.ppCount + e.kpCount));
                w.newLine();
            }
        }
    }

    // write KPDTAB_<base>.txt
    private void writeKPDTAB(Path sourcePath, List<String> kpdtab) throws IOException {
        String base = getBaseName(sourcePath.getFileName().toString());
        Path p = Paths.get("KPDTAB_" + base + ".txt");
        try (BufferedWriter w = Files.newBufferedWriter(p)) {
            w.write("Index\tParam=Default");
            w.newLine();
            for (int i = 0; i < kpdtab.size(); i++) {
                w.write(i + "\t" + kpdtab.get(i));
                w.newLine();
            }
        }
    }

    // small helpers
    private static boolean isComment(String t) {
        return t.startsWith(";") || t.startsWith("//") || t.startsWith("#");
    }

    private static int indexOfToken(String lineUpper, String tokenUpper) {
        String[] tokens = TOKEN_SPLIT.split(lineUpper);
        for (int i = 0; i < tokens.length; i++) {
            if (tokens[i].equalsIgnoreCase(tokenUpper)) return i;
        }
        return -1;
    }

    private static String getBaseName(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot >= 0) return filename.substring(0, dot);
        return filename;
    }

    // main
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java MacroPass1Enhanced <source-file>");
            return;
        }
        Path source = Paths.get(args[0]);
        if (!Files.exists(source)) {
            System.err.println("Source file not found: " + source);
            return;
        }
        MacroPass1Enhanced p1 = new MacroPass1Enhanced();
        try {
            p1.process(source);
        } catch (IOException ex) {
            System.err.println("Error during Pass-1: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
