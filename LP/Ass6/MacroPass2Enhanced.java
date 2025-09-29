import java.io.*;
import java.util.*;

public class MacroPass2Enhanced {

    static class MNTEntry {
        String name;
        int mdtIndex;
        int pntabIndex;
        int kpdtIndex;
        int ppCount;
        int kpCount;
        MNTEntry(String n, int mdtIdx, int pntabIdx, int kpdtIdx, int pp, int kp) {
            name = n; mdtIndex = mdtIdx; pntabIndex = pntabIdx;
            kpdtIndex = kpdtIdx; ppCount = pp; kpCount = kp;
        }
    }

    Map<String, MNTEntry> mnt = new HashMap<>();         
    List<String> mdt = new ArrayList<>();                
    List<String> pntab = new ArrayList<>();              
    List<String> kpdtab = new ArrayList<>();   

    public void run(String intermediatePath,
                    String mdtPath,
                    String mntPath,
                    String pntabPath,
                    String kpdtPath,
                    String outputPath) throws IOException {
        loadMNT(mntPath);
        loadMDT(mdtPath);
        loadPNTAB(pntabPath);
        loadKPDTAB(kpdtPath);

        BufferedReader in = new BufferedReader(new FileReader(intermediatePath));
        BufferedWriter out = new BufferedWriter(new FileWriter(outputPath));

        String line;
        while ((line = in.readLine()) != null) {
            String trimmed = line.trim();
            if (trimmed.isEmpty() || trimmed.startsWith(";") || trimmed.startsWith("//") || trimmed.startsWith("#")) {
                out.write(line);
                out.newLine();
                continue;
            }
            String[] tokens = trimmed.split("\\s+|,", 2); 
            String macroName = tokens[0];
            if (mnt.containsKey(macroName)) {
                String argsPart = tokens.length > 1 ? tokens[1].trim() : "";
                List<String> actualArgs = new ArrayList<>();
                if (!argsPart.isEmpty()) {
                    actualArgs.addAll(Arrays.asList(argsPart.split("\\s*,\\s*")));
                }
                expandMacro(macroName, actualArgs, out);
            } else {
                out.write(line);
                out.newLine();
            }
        }
        in.close();
        out.close();
        System.out.println("Macro expansion complete. Output: " + outputPath);
    }

    private void expandMacro(String macroName, List<String> actualArgs, BufferedWriter out) throws IOException {
        MNTEntry entry = mnt.get(macroName);

        List<String> paramValues = new ArrayList<>();


        int pIdx = entry.pntabIndex;
        for (int i = 0; i < entry.ppCount; i++) {
            if (i < actualArgs.size() && !actualArgs.get(i).contains("=")) {
                paramValues.add(actualArgs.get(i));
            } else {
                paramValues.add("");
            }
        }

        Map<String, String> defaultKwValues = new HashMap<>();
        if (entry.kpCount > 0 && entry.kpdtIndex >= 0) {
            for (int i = 0; i < entry.kpCount; i++) {
                String kentry = kpdtab.get(entry.kpdtIndex + i); 
                int eq = kentry.indexOf('=');
                if (eq >= 0) {
                    defaultKwValues.put(kentry.substring(0, eq), kentry.substring(eq + 1));
                }
            }
        }

        for (int i = 0; i < entry.kpCount; i++) {
            String param = pntab.get(pIdx + entry.ppCount + i);
            paramValues.add(defaultKwValues.getOrDefault(param, ""));
        }

        for (String act : actualArgs) {
            if (act.contains("=")) {
                int eq = act.indexOf('=');
                String kname = act.substring(0, eq).replace("&", "").trim();
                String kval = act.substring(eq + 1).trim();
                for (int j = 0; j < entry.kpCount; j++) {
                    String pname = pntab.get(pIdx + entry.ppCount + j);
                    if (pname.equalsIgnoreCase(kname)) {
                        paramValues.set(entry.ppCount + j, kval);
                        break;
                    }
                }
            }
        }

        int mdtIdx = entry.mdtIndex;
        while (mdtIdx < mdt.size()) {
            String raw = mdt.get(mdtIdx);
            String t = raw.trim();
            if (t.equalsIgnoreCase("MEND") || t.toUpperCase().startsWith("MEND")) break;
            String expanded = raw;
            for (int i = 0; i < entry.ppCount + entry.kpCount; i++) {
                String repl = paramValues.get(i);
                expanded = expanded.replaceAll("\\(P," + (i + 1) + "\\)", repl);
            }
            out.write(expanded);
            out.newLine();
            mdtIdx++;
        }
    }

    private void loadMNT(String mntPath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(mntPath));
        String line;
        reader.readLine();
        while ((line = reader.readLine()) != null) {
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split("\\s+");
            if (parts.length < 6) continue;
            MNTEntry e = new MNTEntry(parts[0], Integer.parseInt(parts[1]),
                    Integer.parseInt(parts[2]), Integer.parseInt(parts[3]),
                    Integer.parseInt(parts[4]), Integer.parseInt(parts[5]));
            mnt.put(e.name, e);
        }
        reader.close();
    }

    private void loadMDT(String mdtPath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(mdtPath));
        reader.readLine();
        String line;
        while ((line = reader.readLine()) != null) {
            String[] parts = line.split("\t", 2);
            if (parts.length == 2) {
                mdt.add(parts[1]);
            }
        }
        reader.close();
    }

    private void loadPNTAB(String pntabPath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(pntabPath));
        reader.readLine();
        String line;
        while ((line = reader.readLine()) != null && !line.contains("Macro -> PNTAB")) {
            String[] parts = line.split("\\s+");
            if (parts.length >= 2) {
                pntab.add(parts[1].replace("&",""));
            }
        }
        reader.close();
    }

    private void loadKPDTAB(String kpdtabPath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(kpdtabPath));
        reader.readLine();
        String line;
        while ((line = reader.readLine()) != null) {
            String[] parts = line.split("\\s+",2);
            if (parts.length == 2) kpdtab.add(parts[1]);
        }
        reader.close();
    }

    public static void main(String[] args) {

        String intermediateFile = "intermediate.asm";
        String mdtFile = "MDT.txt";
        String mntFile = "MNT.txt";
        String pntabFile = "PNTAB.txt";
        String kpdtabFile = "KPDTAB.txt";
        String outputFile = "expanded.asm";

        MacroPass2Enhanced pass2 = new MacroPass2Enhanced();
        try {
            pass2.run(intermediateFile, mdtFile, mntFile, pntabFile, kpdtabFile, outputFile);
        } catch (IOException e) {
            System.err.println("Error in Pass 2: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
