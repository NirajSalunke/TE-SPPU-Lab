import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

/**
 * TwoPassAssembler.java
 *
 * Usage:
 *   javac TwoPassAssembler.java
 *   java TwoPassAssembler sample.asm
 *
 * Output files:
 *   intermediate.txt
 *   literals.txt
 *   pool.txt
 *   symboltable.txt
 *   machinecode.txt
 */
public class TwoPassAssembler {

    // Maps & lists for symbol/literal tables
    static class Symbol {
        String name;
        int address;
        int index;
        Symbol(String n, int idx) { name = n; address = -1; index = idx; }
    }
    static class Literal {
        String literal; // e.g. =5 or = '5' stored as raw (without =)
        int address;
        int index;
        Literal(String l, int idx) { literal = l; address = -1; index = idx; }
    }

    static Map<String,Integer> isOpcode = new HashMap<>(); // Imperative statements
    static Map<String,Integer> adOpcode = new HashMap<>(); // Assembler directives
    static Map<String,Integer> dlOpcode = new HashMap<>(); // Declaratives
    static Map<String,Integer> regCode = new HashMap<>();

    static List<Symbol> symTable = new ArrayList<>();
    static Map<String, Symbol> symMap = new HashMap<>(); // name -> Symbol

    static List<Literal> litTable = new ArrayList<>();
    static Map<String, Literal> litMap = new HashMap<>(); // literalValue -> Literal

    static List<Integer> poolTable = new ArrayList<>(); // starting indices (1-based) of literal pools

    static List<String> intermediateLines = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            System.out.println("Usage: java TwoPassAssembler sample.asm");
            System.exit(1);
        }
        String asmFile = args[0];
        initOpcodes();

        // Pass I
        passOne(asmFile);

        // Dump symbol/literal/pool/intermediate files
        writeIntermediate();
        writeSymbolTable();
        writeLiterals();
        writePools();

        // Pass II
        passTwo();

        System.out.println("Assembling completed. Output files:");
        System.out.println(" - intermediate.txt");
        System.out.println(" - symboltable.txt");
        System.out.println(" - literals.txt");
        System.out.println(" - pool.txt");
        System.out.println(" - machinecode.txt");
    }

    static void initOpcodes() {
        // Imperative statements (IS) - mapping to opcode numbers
        isOpcode.put("STOP", 0);
        isOpcode.put("ADD", 1);
        isOpcode.put("SUB", 2);
        isOpcode.put("MULT", 3);
        isOpcode.put("MOVER", 4);
        isOpcode.put("MOVEM", 5);
        isOpcode.put("BC", 6);
        isOpcode.put("COMP", 7);
        isOpcode.put("DIV", 8);
        isOpcode.put("READ", 9);
        isOpcode.put("PRINT", 10);

        // Assembler directives (AD)
        adOpcode.put("START", 1);
        adOpcode.put("END", 2);
        adOpcode.put("ORIGIN", 3);
        adOpcode.put("LTORG", 4);
        adOpcode.put("EQU", 5);

        // Declaratives (DL)
        dlOpcode.put("DC", 1);
        dlOpcode.put("DS", 2);

        // Registers
        regCode.put("AREG", 1);
        regCode.put("BREG", 2);
        regCode.put("CREG", 3);
        regCode.put("DREG", 4);
    }

    static void passOne(String asmFile) throws Exception {
        List<String> lines = Files.readAllLines(Paths.get(asmFile));
        int LC = 0;
        boolean startSeen = false;

        // literal pool for current segment: store literal strings (without '=')
        List<String> currentPool = new ArrayList<>();

        for (String rawLine : lines) {
            String line = rawLine.trim();
            if (line.isEmpty() || line.startsWith(";") || line.startsWith("#")) continue;

            // remove comments inline (after ;)
            int cidx = line.indexOf(';');
            if (cidx != -1) line = line.substring(0, cidx).trim();
            if (line.isEmpty()) continue;

            // Tokenize: split by whitespace but keep commas separated
            // We will identify label if first token looks like label
            String[] tokens = line.split("\\s+");
            int tokIdx = 0;

            String label = null;
            String op = null;
            String operandPart = "";

            // Identify label: if first token ends with ":" or if token is not an opcode/AD/DL and second token exists and is opcode
            if (tokens.length > 1 && tokens[0].endsWith(":")) {
                label = tokens[0].substring(0, tokens[0].length()-1);
                tokIdx = 1;
            } else if (tokens.length > 1 && !isOpcode.containsKey(tokens[0].toUpperCase())
                       && !adOpcode.containsKey(tokens[0].toUpperCase())
                       && !dlOpcode.containsKey(tokens[0].toUpperCase())) {
                // treat as label (no colon) if second token is an opcode/directive
                label = tokens[0];
                tokIdx = 1;
            }

            if (tokIdx < tokens.length) {
                op = tokens[tokIdx].toUpperCase();
                tokIdx++;
            } else continue;

            // rest tokens are operands (could be separated by commas). Reconstruct operands
            if (tokIdx < tokens.length) {
                StringBuilder sb = new StringBuilder();
                for (int i = tokIdx; i < tokens.length; i++) {
                    if (i > tokIdx) sb.append(" ");
                    sb.append(tokens[i]);
                }
                operandPart = sb.toString();
            }

            // If START directive
            if (adOpcode.containsKey(op) && op.equals("START")) {
                int startAddr = 0;
                if (!operandPart.isEmpty()) {
                    String v = operandPart.trim().split(",")[0];
                    try { startAddr = Integer.parseInt(v); } catch (Exception e) { startAddr = 0; }
                }
                LC = startAddr;
                startSeen = true;
                intermediateLines.add(String.format("%d (AD,%02d) (C,%d)", LC, adOpcode.get(op), LC));
                continue;
            }

            // If there's label, insert into symbol table with current LC
            if (label != null) {
                addOrUpdateSymbol(label, LC);
            }

            // AD handling except START above
            if (adOpcode.containsKey(op)) {
                if (op.equals("LTORG")) {
                    // Assign addresses to literals in currentPool
                    if (!currentPool.isEmpty()) {
                        int poolStartIndex = litTable.size() + 1; // 1-based
                        poolTable.add(poolStartIndex);
                        for (String lit : currentPool) {
                            Literal l = litMap.get(lit);
                            if (l.address == -1) {
                                l.address = LC;
                                LC++;
                                // already in litTable
                            }
                        }
                        currentPool.clear();
                    }
                    intermediateLines.add(String.format("%d (AD,%02d)", LC, adOpcode.get(op)));
                    continue;
                } else if (op.equals("END")) {
                    // assign any remaining literals
                    if (!currentPool.isEmpty()) {
                        int poolStartIndex = litTable.size() + 1;
                        poolTable.add(poolStartIndex);
                        for (String lit : currentPool) {
                            Literal l = litMap.get(lit);
                            if (l.address == -1) {
                                l.address = LC;
                                LC++;
                            }
                        }
                        currentPool.clear();
                    }
                    intermediateLines.add(String.format("%d (AD,%02d)", LC, adOpcode.get(op)));
                    break; // end of assembly
                } else if (op.equals("ORIGIN")) {
                    // ORIGIN <expr> (simple form: ORIGIN label or ORIGIN constant)
                    String expr = operandPart.trim();
                    int val = LC;
                    try {
                        val = Integer.parseInt(expr);
                    } catch (Exception e) {
                        Symbol s = symMap.get(expr);
                        if (s != null && s.address != -1) val = s.address;
                    }
                    LC = val;
                    intermediateLines.add(String.format("%d (AD,%02d) (C,%d)", LC, adOpcode.get(op), LC));
                    continue;
                } else if (op.equals("EQU")) {
                    // label EQU expression -> set label's address
                    String expr = operandPart.trim();
                    int val = 0;
                    try { val = Integer.parseInt(expr); } catch(Exception e) {
                        Symbol s = symMap.get(expr);
                        if (s != null) val = s.address;
                    }
                    if (label != null) {
                        addOrUpdateSymbol(label, val);
                    }
                    intermediateLines.add(String.format("%d (AD,%02d) %s (C,%d)", LC, adOpcode.get(op), label==null?"":label, val));
                    continue;
                } else {
                    // general AD
                    intermediateLines.add(String.format("%d (AD,%02d)", LC, adOpcode.get(op)));
                    continue;
                }
            }

            // DL handling
            if (dlOpcode.containsKey(op)) {
                if (op.equals("DC")) {
                    // DC <const>
                    String valtok = operandPart.trim();
                    int val = 0;
                    try { val = Integer.parseInt(valtok); } catch(Exception e) {}
                    intermediateLines.add(String.format("%d (DL,%02d) (C,%d)", LC, dlOpcode.get(op), val));
                    LC += 1; // allocate one word containing value
                    continue;
                } else if (op.equals("DS")) {
                    String valtok = operandPart.trim();
                    int count = 0;
                    try { count = Integer.parseInt(valtok); } catch(Exception e) {}
                    intermediateLines.add(String.format("%d (DL,%02d) (C,%d)", LC, dlOpcode.get(op), count));
                    LC += count;
                    continue;
                }
            }

            // Imperative statements (IS)
            if (isOpcode.containsKey(op)) {
                int opcodeNum = isOpcode.get(op);
                // parse operands separated by commas
                List<String> operands = new ArrayList<>();
                if (!operandPart.isEmpty()) {
                    String[] ops = operandPart.split(",");
                    for (String o: ops) {
                        operands.add(o.trim());
                    }
                }

                // For operands produce tokens like (R,1) (S,idx) (L,idx) (C,val)
                StringBuilder sb = new StringBuilder();
                sb.append(String.format("%d (IS,%02d)", LC, opcodeNum));
                for (String operand : operands) {
                    if (regCode.containsKey(operand.toUpperCase())) {
                        sb.append(" (R,").append(regCode.get(operand.toUpperCase())).append(")");
                    } else if (operand.startsWith("=")) {
                        // literal
                        String litVal = operand.substring(1).trim(); // keep raw literal text such as 5 or '5'
                        // unify: remove quotes if present
                        if ((litVal.startsWith("'") && litVal.endsWith("'")) || (litVal.startsWith("\"") && litVal.endsWith("\""))) {
                            litVal = litVal.substring(1, litVal.length()-1);
                        }
                        // add to literal table if not present
                        if (!litMap.containsKey(litVal)) {
                            Literal l = new Literal(litVal, litTable.size()+1);
                            litTable.add(l);
                            litMap.put(litVal, l);
                        }
                        Literal l = litMap.get(litVal);
                        sb.append(" (L,").append(l.index).append(")");
                        if (!currentPool.contains(litVal)) currentPool.add(litVal);
                    } else {
                        // symbol or constant numeric
                        if (operand.matches("^-?\\d+$")) {
                            sb.append(" (C,").append(operand).append(")");
                        } else {
                            // symbol: if not in table add with address -1
                            if (!symMap.containsKey(operand)) {
                                Symbol s = new Symbol(operand, symTable.size()+1);
                                symTable.add(s);
                                symMap.put(operand, s);
                            }
                            Symbol s = symMap.get(operand);
                            sb.append(" (S,").append(s.index).append(")");
                        }
                    }
                }

                intermediateLines.add(sb.toString());
                LC += 1;
                continue;
            }

            // Unknown op — just write it as comment in intermediate
            intermediateLines.add(String.format("%d (??) %s", LC, line));
        }

        // End of file: make sure any unassigned literals assigned if not done (just in case)
        // (This should be handled at END or LTORG segments.)
        // assign any remaining unassigned to next addresses (if any)
        boolean anyUnassigned = false;
        for (Literal l : litTable) {
            if (l.address == -1) { anyUnassigned = true; break; }
        }
        if (anyUnassigned) {
            int nextAddr = findNextLCFromIntermediate();
            if (!poolTable.contains(litTable.size()==0?0:1)) {
                // assume pool start at first unassigned lit index
                poolTable.add( (litTable.size()>0) ? 1 : 0 );
            }
            for (Literal l : litTable) {
                if (l.address == -1) {
                    l.address = nextAddr++;
                }
            }
        }
    }

    static void addOrUpdateSymbol(String name, int address) {
        if (!symMap.containsKey(name)) {
            Symbol s = new Symbol(name, symTable.size()+1);
            s.address = address;
            symTable.add(s);
            symMap.put(name, s);
        } else {
            Symbol s = symMap.get(name);
            s.address = address;
        }
    }

    static int findNextLCFromIntermediate() {
        // attempt to parse last LC from intermediateLines
        if (intermediateLines.isEmpty()) return 0;
        String last = intermediateLines.get(intermediateLines.size()-1);
        try {
            String[] parts = last.trim().split("\\s+");
            return Integer.parseInt(parts[0]) + 1;
        } catch (Exception e) { return 0; }
    }

    static void writeIntermediate() throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(Paths.get("intermediate.txt"))) {
            for (String s : intermediateLines) bw.write(s + System.lineSeparator());
        }
    }
    static void writeSymbolTable() throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(Paths.get("symboltable.txt"))) {
            bw.write("Index\tSymbol\tAddress\n");
            for (Symbol s : symTable) {
                bw.write(s.index + "\t" + s.name + "\t" + s.address + "\n");
            }
        }
    }
    static void writeLiterals() throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(Paths.get("literals.txt"))) {
            bw.write("Index\tLiteral\tAddress\n");
            for (Literal l : litTable) {
                bw.write(l.index + "\t" + l.literal + "\t" + l.address + "\n");
            }
        }
    }
    static void writePools() throws IOException {
        try (BufferedWriter bw = Files.newBufferedWriter(Paths.get("pool.txt"))) {
            bw.write("PoolNo\tStartLiteralIndex\n");
            for (int i = 0; i < poolTable.size(); i++) {
                bw.write((i+1) + "\t" + poolTable.get(i) + "\n");
            }
        }
    }

    // Pass Two: read intermediate.txt, resolve addresses and create machinecode.txt
    static void passTwo() throws Exception {
        List<String> lines = Files.readAllLines(Paths.get("intermediate.txt"));
        try (BufferedWriter bw = Files.newBufferedWriter(Paths.get("machinecode.txt"))) {
            // machine code format: LC OPCODE R/M MEMADDR or for data words: LC -- -- value
            for (String rawLine : lines) {
                String line = rawLine.trim();
                if (line.isEmpty()) continue;
                // parse leading LC
                Matcher m = Pattern.compile("^(\\d+)\\s+(.*)$").matcher(line);
                if (!m.find()) continue;
                int LC = Integer.parseInt(m.group(1));
                String rest = m.group(2).trim();

                // If AD or comment: skip unless it's END/START
                if (rest.startsWith("(AD,")) {
                    // optionally write nothing or special record
                    // we'll skip writing code for AD
                    continue;
                }
                if (rest.startsWith("(DL,")) {
                    // For DC: format (DL,01) (C,val) -> generate a data word
                    Matcher mm = Pattern.compile("\\(DL,(\\d{2})\\).*\\(C,(-?\\d+)\\)").matcher(rest);
                    if (mm.find()) {
                        int dl = Integer.parseInt(mm.group(1));
                        int val = Integer.parseInt(mm.group(2));
                        if (dl == dlOpcode.get("DC")) {
                            bw.write(String.format("%d\t--\t--\t%d\n", LC, val));
                        } else if (dl == dlOpcode.get("DS")) {
                            // reserved; we may write zeros or just blank; we'll write reserved lines as zeros
                            Matcher mm2 = Pattern.compile("\\(DL,\\d{2}\\)\\s*\\(C,(\\d+)\\)").matcher(rest);
                            int cnt = mm2.find() ? Integer.parseInt(mm2.group(1)) : 0;
                            for (int i = 0; i < cnt; i++) {
                                bw.write(String.format("%d\t--\t--\t0\n", LC + i));
                            }
                        }
                    }
                    continue;
                }
                if (rest.startsWith("(IS,")) {
                    // general: (IS,opcode) optionally (R,n) (S,idx) (L,idx) (C,val)
                    Matcher ism = Pattern.compile("\\(IS,(\\d{2})\\)(.*)$").matcher(rest);
                    if (ism.find()) {
                        int opcodeNum = Integer.parseInt(ism.group(1));
                        String operands = ism.group(2).trim();

                        int r = 0;
                        int mem = 0;
                        boolean memSet = false;
                        // find first (R,n)
                        Matcher rm = Pattern.compile("\\(R,(\\d+)\\)").matcher(operands);
                        if (rm.find()) {
                            r = Integer.parseInt(rm.group(1));
                        }
                        // find S or L or C
                        Matcher sm = Pattern.compile("\\(S,(\\d+)\\)").matcher(operands);
                        if (sm.find()) {
                            int sidx = Integer.parseInt(sm.group(1));
                            Symbol s = symTable.get(sidx-1);
                            mem = s.address;
                            memSet = true;
                        } else {
                            Matcher lm = Pattern.compile("\\(L,(\\d+)\\)").matcher(operands);
                            if (lm.find()) {
                                int lidx = Integer.parseInt(lm.group(1));
                                Literal l = litTable.get(lidx-1);
                                mem = l.address;
                                memSet = true;
                            } else {
                                Matcher cm = Pattern.compile("\\(C,(-?\\d+)\\)").matcher(operands);
                                if (cm.find()) {
                                    mem = Integer.parseInt(cm.group(1));
                                    memSet = true;
                                }
                            }
                        }
                        if (!memSet) mem = 0;
                        bw.write(String.format("%d\t%02d\t%02d\t%d\n", LC, opcodeNum, r, mem));
                    }
                } else {
                    // unknown or comments - skip
                }
            }
        }
    }
}
