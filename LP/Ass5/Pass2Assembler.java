import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class Pass2Assembler {

    private static final String IC_FILE = "IC.txt";
    private static final String SYM_FILE = "SYM.txt";
    private static final String LIT_FILE = "LIT.txt";
    private static final String OUT_FILE = "machine_code.txt";

    public static void main(String[] args) {
        try {
            List<String> icLines = Files.readAllLines(Paths.get(IC_FILE));
            List<String> symLines = Files.readAllLines(Paths.get(SYM_FILE));
            List<String> litLines = Files.readAllLines(Paths.get(LIT_FILE));

            List<Integer> symAddrs = parseAddrColumn(symLines);
            List<Integer> litAddrs = parseAddrColumn(litLines);

            List<String> output = new ArrayList<>();
            int LC = 0;

            Pattern paren = Pattern.compile("\\(([^)]+)\\)");
            Pattern plusPat = Pattern.compile("\\+\\s*(\\d+)");

            for (String raw : icLines) {
                String line = raw.trim();
                if (line.isEmpty()) continue;

                Matcher m = paren.matcher(line);
                List<String> tokens = new ArrayList<>();
                while (m.find()) tokens.add(m.group(1).trim());

                Matcher pm = plusPat.matcher(line);
                int offset = pm.find() ? Integer.parseInt(pm.group(1)) : 0;

                if (tokens.isEmpty()) continue;

                String first = tokens.get(0);
                String[] fp = first.split("\\s*,\\s*");
                String type = fp[0];
                String code = fp.length > 1 ? fp[1] : "";

                switch (type) {
                    case "AD": // Assembler Directives
                        if ("01".equals(code)) {
                            // START (C,value)
                            Integer start = findConstant(tokens);
                            if (start != null) LC = start;
                        } else if ("03".equals(code)) {
                            // ORIGIN (S,index)+offset
                            if (tokens.size() >= 2 && tokens.get(1).startsWith("S,")) {
                                int idx = parseIndex(tokens.get(1).substring(2));
                                int symAddr = getAddr(symAddrs, idx);
                                LC = symAddr + offset;
                            }
                        } else if ("02".equals(code)) {
                            // END -> no-op
                        }
                        break;

                    case "DL": // Declaratives DC/DS
                        if ("01".equals(code)) { // DC (C,value)
                            Integer c = findConstant(tokens);
                            int val = (c == null) ? 0 : c;
                            // opcode 00, reg 0, value is val
                            output.add(String.format("%03d : %02d %d %03d", LC, 0, 0, val));
                            LC += 1;
                        } else if ("02".equals(code)) { // DS (C,count)
                            Integer cnt = findConstant(tokens);
                            int n = (cnt == null) ? 0 : cnt;
                            for (int i = 0; i < n; i++) {
                                output.add(String.format("%03d : %02d %d %03d", LC, 0, 0, 0));
                                LC += 1;
                            }
                        }
                        break;

                    case "IS": // Imperative statements -> generate instruction word
                        String opcode = code;
                        int reg = 0;
                        int addr = 0;

                        // find register token (plain number)
                        for (int i = 1; i < tokens.size(); i++) {
                            String t = tokens.get(i);
                            if (t.matches("\\d+")) {
                                reg = Integer.parseInt(t);
                                // don't break — operand might still be later
                            }
                        }
                        // find operand token (S, L, or C)
                        String operand = null;
                        for (int i = 1; i < tokens.size(); i++) {
                            String t = tokens.get(i);
                            if (t.startsWith("S,") || t.startsWith("L,") || t.startsWith("C,")) {
                                operand = t;
                                break;
                            }
                        }
                        if (operand == null && tokens.size() >= 3) {
                            String t = tokens.get(2);
                            if (t.startsWith("S,") || t.startsWith("L,") || t.startsWith("C,")) operand = t;
                        }
                        if (operand != null) {
                            if (operand.startsWith("S,")) {
                                int idx = parseIndex(operand.substring(2));
                                addr = getAddr(symAddrs, idx);
                            } else if (operand.startsWith("L,")) {
                                int idx = parseIndex(operand.substring(2));
                                addr = getAddr(litAddrs, idx);
                            } else if (operand.startsWith("C,")) {
                                addr = Integer.parseInt(operand.substring(2));
                            }
                        }

                        // STOP (IS,00) special-case: no operand
                        if ("00".equals(opcode)) {
                            addr = 0;
                            reg = 0;
                        }

                        int opNum = 0;
                        try { opNum = Integer.parseInt(opcode); } catch (NumberFormatException ignored) {}
                        output.add(String.format("%03d : %02d %d %03d", LC, opNum, reg, addr));
                        LC += 1;
                        break;

                    default:
                        // unknown - ignore
                        break;
                }
            }

            Files.write(Paths.get(OUT_FILE), output, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("Generated " + OUT_FILE + " (" + output.size() + " lines).");
            // print sample
            for (int i = 0; i < Math.min(20, output.size()); i++) System.out.println(output.get(i));

        } catch (IOException ex) {
            System.err.println("I/O error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }

    private static List<Integer> parseAddrColumn(List<String> lines) {
        List<Integer> out = new ArrayList<>();
        for (String raw : lines) {
            String line = raw.trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split("\\s+");
            String last = parts[parts.length - 1];
            try {
                out.add(Integer.parseInt(last));
            } catch (NumberFormatException e) {
                Matcher m = Pattern.compile("(-?\\d+)").matcher(last);
                if (m.find()) out.add(Integer.parseInt(m.group(1)));
                else out.add(0);
            }
        }
        return out;
    }

    private static Integer findConstant(List<String> tokens) {
        for (String t : tokens) {
            if (t.startsWith("C,")) {
                try { return Integer.parseInt(t.substring(2)); } catch (NumberFormatException ignored) {}
            } else if (t.matches("\\d+")) {
                try { return Integer.parseInt(t); } catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }

    private static int parseIndex(String s) {
        s = s.trim();
        try { return Integer.parseInt(s); } catch (NumberFormatException e) {
            Matcher m = Pattern.compile("(\\d+)").matcher(s);
            if (m.find()) return Integer.parseInt(m.group(1));
        }
        return 0;
    }

    private static int getAddr(List<Integer> list, int idx1) {
        if (idx1 <= 0 || idx1 > list.size()) {
            System.err.println("Warning: reference to index " + idx1 + " out of range (size=" + list.size() + "). Using 0.");
            return 0;
        }
        return list.get(idx1 - 1);
    }
}
