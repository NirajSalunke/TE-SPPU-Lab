package testcases.pass1;
import java.io.*;
import java.util.*;

public class Pass1Assembler {

    private static final Map<String, Integer> OP_TAB = new HashMap<>();
    private static final Map<String, Integer> AD_TAB = new HashMap<>();
    private static final Map<String, Integer> DL_TAB = new HashMap<>();
    private static final Map<String, Integer> REG_TAB = new HashMap<>();

    private final Map<String, Integer> symtab = new LinkedHashMap<>(); // symbol -> address (null if undefined yet)
    private final List<Literal> littab = new ArrayList<>();
    private final List<String> intermediateCode = new ArrayList<>();

    private int LC = 0;
    private boolean started = false;

    private static class Literal {
        String literal;
        Integer address;

        Literal(String lit) {
            this.literal = lit;
            this.address = null;
        }

        @Override
        public String toString() {
            return literal + " -> " + (address == null ? "-" : address);
        }
    }

    static {
        OP_TAB.put("STOP", 0);
        OP_TAB.put("ADD", 1);
        OP_TAB.put("SUB", 2);
        OP_TAB.put("MULT", 3);
        OP_TAB.put("MOVER", 4);
        OP_TAB.put("MOVEM", 5);
        OP_TAB.put("COMP", 6);
        OP_TAB.put("BC", 7);
        OP_TAB.put("DIV", 8);
        OP_TAB.put("READ", 9);
        OP_TAB.put("PRINT", 10);

        AD_TAB.put("START", 1);
        AD_TAB.put("END", 2);
        AD_TAB.put("ORIGIN", 3);
        AD_TAB.put("EQU", 4);
        AD_TAB.put("LTORG", 5);

        DL_TAB.put("DC", 1);
        DL_TAB.put("DS", 2);

        REG_TAB.put("AREG", 1);
        REG_TAB.put("BREG", 2);
        REG_TAB.put("CREG", 3);
        REG_TAB.put("DREG", 4);
    }

    private static final Set<String> DIRECTIVES = new HashSet<>(
            Arrays.asList("START", "END", "LTORG", "DS", "DC", "ORIGIN", "EQU"));

    public static void main(String[] args) {
        String sourceFile = args.length > 0 ? args[0] : "sample.asm";
        Pass1Assembler asm = new Pass1Assembler();
        try {
            asm.runPass1(sourceFile);
            System.out.println("Pass-1 completed. Outputs: IC.txt, SYMTAB.txt, LITTAB.txt");
        } catch (IOException e) {
            System.err.println("Error running Pass1: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void runPass1(String sourceFile) throws IOException {
        System.out.println("Source File:- " + sourceFile);
        System.out.println("OP_TAB: " + OP_TAB);
        System.out.println("AD_TAB: " + AD_TAB);
        System.out.println("DL_TAB: " + DL_TAB);
        System.out.println("REG_TAB: " + REG_TAB);
        System.out.println("DIRECTIVES: " + DIRECTIVES);

        try (BufferedReader br = new BufferedReader(new FileReader(sourceFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith(";") || line.startsWith("#")) {
                    continue; // skip blank or comment
                }
                processLine(line);
            }
        }

        // On end of file, assign remaining literals
        assignLiterals();

        // Write outputs
        writeIC();
        writeSymbolTable();
        writeLiteralTable();

        // Print summaries
        System.out.println("\nIntermediate Code:");
        intermediateCode.forEach(System.out::println);

        System.out.println("\nSYMTAB:");
        printSymtab();

        System.out.println("\nLITTAB:");
        printLittab();
    }

    private void processLine(String line) {
        // Split tokens by whitespace but keep operands after opcode intact
        // Expected forms:
        // [LABEL] OPCODE [OPERANDS...]
        String[] tokens = line.split("\\s+");
        int idx = 0;
        String label = null;
        String opcode;
        String operandsPart = "";

        // Determine if first token is a label:
        if (!isMnemonic(tokens[0])) {
            // treat as label
            label = tokens[0];
            idx++;
            if (idx >= tokens.length) {
                // only a label on line -> nothing to do
                symtab.putIfAbsent(label, LC);
                return;
            }
        }

        opcode = tokens[idx++];
        if (idx < tokens.length) {
            // join remaining tokens as operands (there might be spaces)
            StringBuilder sb = new StringBuilder();
            for (int i = idx; i < tokens.length; i++) {
                if (i > idx) sb.append(" ");
                sb.append(tokens[i]);
            }
            operandsPart = sb.toString().trim();
        }

        if (label != null) {
            // define label with current LC (unless it's defined by EQU later)
            // If label already exists with null address (forward ref), set address now.
            if (!symtab.containsKey(label)) {
                symtab.put(label, LC);
            } else if (symtab.get(label) == null) {
                symtab.put(label, LC);
            } else {
                // label already defined earlier — duplicate definition (warn).
                System.err.println("Warning: label '" + label + "' redefined at LC=" + LC + ". Previous address=" + symtab.get(label));
                symtab.put(label, LC);
            }
        }

        String opUpper = opcode.toUpperCase();

        // Handle Assembler Directives (AD)
        if (AD_TAB.containsKey(opUpper)) {
            handleAD(opUpper, operandsPart);
            return;
        }

        // Handle Declarative Statements (DL) - DS, DC
        if (DL_TAB.containsKey(opUpper)) {
            handleDL(opUpper, operandsPart, label);
            return;
        }

        // Handle machine instruction (IS)
        if (OP_TAB.containsKey(opUpper)) {
            handleIS(opUpper, operandsPart);
            return;
        }

        // Unknown mnemonic: just warn
        System.err.println("Warning: Unknown opcode/directive '" + opcode + "' in line: " + line);
    }

    private boolean isMnemonic(String token) {
        String t = token.toUpperCase();
        return OP_TAB.containsKey(t) || AD_TAB.containsKey(t) || DL_TAB.containsKey(t) || REG_TAB.containsKey(t) || DIRECTIVES.contains(t);
    }

    private void handleAD(String directive, String operandsPart) {
        int code = AD_TAB.get(directive);
        switch (directive) {
            case "START": {
                int startAddr = 0;
                if (operandsPart != null && !operandsPart.isEmpty()) {
                    try {
                        startAddr = Integer.parseInt(operandsPart.trim());
                    } catch (NumberFormatException e) {
                        // if operand is expression or symbol, attempt evaluate
                        startAddr = evaluateExpression(operandsPart.trim());
                    }
                }
                LC = startAddr;
                started = true;
                // IC entry: (AD,1) (C,startAddr)
                intermediateCode.add(String.format("(AD,%d) (C,%d)", code, startAddr));
                break;
            }
            case "END": {
                // assign literals at end
                intermediateCode.add(String.format("(AD,%d)", code));
                assignLiterals();
                break;
            }
            case "LTORG": {
                intermediateCode.add(String.format("(AD,%d)", code));
                assignLiterals();
                break;
            }
            case "ORIGIN": {
                // ORIGIN operand sets LC
                if (operandsPart == null || operandsPart.isEmpty()) {
                    System.err.println("Warning: ORIGIN without operand.");
                } else {
                    int newLC = evaluateExpression(operandsPart.trim());
                    intermediateCode.add(String.format("(AD,%d) (C,%d)", code, newLC));
                    LC = newLC;
                }
                break;
            }
            case "EQU": {
                // EQU is used as label EQU expr
                // For simplicity, this is expected to be processed with label already captured earlier
                // The line with EQU should have had a label captured in processLine method
                // But we need to find the last label in symtab that has address equal to LC maybe?
                // Better approach: the caller sets label before calling handleAD, so we need to set symtab in processLine before calling this.
                // Here we just emit IC and evaluate expression for label (if label used).
                intermediateCode.add(String.format("(AD,%d) (C,%s)", code, operandsPart == null ? "" : operandsPart));
                // To actually set the label's address, we must parse the original line where label was set.
                // However, in processLine we already set label address to LC; typical EQU sets symbol to expression not LC.
                // So we need to find the last symbol defined at current LC and update it to expression value.
                // Simpler: search for any symbol whose address == LC (recent label) and update it.
                int value = evaluateExpression(operandsPart == null ? "" : operandsPart.trim());
                // find most recently added symbol with address == LC (or null)
                String recent = null;
                for (String s : symtab.keySet()) {
                    Integer addr = symtab.get(s);
                    if (addr != null && addr.equals(LC)) {
                        recent = s; // may overwrite but ok, we want last one
                    } else if (addr == null) {
                        // prefer null address if label was put but not yet assigned
                        recent = s;
                    }
                }
                if (recent != null) {
                    symtab.put(recent, value);
                } else {
                    System.err.println("Warning: EQU found but no label to assign. Expression value=" + value);
                }
                break;
            }
            default:
                intermediateCode.add(String.format("(AD,%d)", code));
        }
    }

    private void handleDL(String directive, String operandsPart, String label) {
        int code = DL_TAB.get(directive);
        switch (directive) {
            case "DC": {
                // Define constant: label DC value
                int val = 0;
                if (operandsPart != null && !operandsPart.isEmpty()) {
                    String op = operandsPart.trim();
                    // remove quotes if present
                    if ((op.startsWith("'") && op.endsWith("'")) || (op.startsWith("\"") && op.endsWith("\""))) {
                        op = op.substring(1, op.length() - 1);
                    }
                    try {
                        val = Integer.parseInt(op);
                    } catch (NumberFormatException e) {
                        val = evaluateExpression(op);
                    }
                }
                // Label must be present to attach DC. If label null, we can still emit DC.
                if (label != null) {
                    symtab.put(label, LC);
                }
                intermediateCode.add(String.format("(DL,%d) (C,%d)", code, val));
                LC += 1; // DC allocates 1 word
                break;
            }
            case "DS": {
                // Define storage: label DS n
                int size = 0;
                if (operandsPart != null && !operandsPart.isEmpty()) {
                    try {
                        size = Integer.parseInt(operandsPart.trim());
                    } catch (NumberFormatException e) {
                        size = evaluateExpression(operandsPart.trim());
                    }
                } else {
                    System.err.println("Warning: DS without size; assuming 1");
                    size = 1;
                }
                if (label != null) {
                    symtab.put(label, LC);
                }
                intermediateCode.add(String.format("(DL,%d) (C,%d)", code, size));
                LC += size;
                break;
            }
            default:
                System.err.println("Unhandled DL: " + directive);
        }
    }

    private void handleIS(String opcode, String operandsPart) {
        int opCodeNum = OP_TAB.get(opcode);
        // split operands by comma, but allow spaces
        String[] ops = new String[0];
        if (operandsPart != null && !operandsPart.isEmpty()) {
            // remove spaces around commas
            operandsPart = operandsPart.replaceAll("\\s*,\\s*", ",");
            ops = operandsPart.split(",");
        }

        StringBuilder ic = new StringBuilder();
        ic.append(String.format("(IS,%d)", opCodeNum));

        // Many instructions have register then operand; some (READ/PRINT) have single symbol; BC has single operand (label)
        if (ops.length == 0) {
            // no operands
            intermediateCode.add(ic.toString());
            LC += 1;
            return;
        }

        // if first operand is a register
        String first = ops[0].trim();
        if (REG_TAB.containsKey(first.toUpperCase())) {
            ic.append(String.format(" (R,%d)", REG_TAB.get(first.toUpperCase())));
            // second operand expected (literal / symbol / constant)
            if (ops.length >= 2) {
                String second = ops[1].trim();
                appendAddressingForOperand(ic, second);
            } else {
                // no second operand
                ic.append(" (C,0)");
            }
        } else {
            // first operand is not register -> could be symbol/literal/constant (e.g., READ X or BC LABEL)
            // some instructions might still accept 2 operands without registers; we handle generic single operand case
            appendAddressingForOperand(ic, first);
            // if second operand exists (rare), handle it
            if (ops.length >= 2) {
                String second = ops[1].trim();
                appendAddressingForOperand(ic, second);
            }
        }

        intermediateCode.add(ic.toString());
        LC += 1;
    }

    private void appendAddressingForOperand(StringBuilder ic, String operand) {
        if (operand == null || operand.isEmpty()) {
            ic.append(" (C,0)");
            return;
        }
        // literal
        if (operand.startsWith("=")) {
            int litIndex = addLiteral(operand);
            ic.append(String.format(" (L,%d)", litIndex));
            return;
        }

        // constant numeric e.g. 5 or '5'
        String op = operand;
        if ((op.startsWith("'") && op.endsWith("'")) || (op.startsWith("\"") && op.endsWith("\""))) {
            op = op.substring(1, op.length() - 1);
        }

        try {
            int val = Integer.parseInt(op);
            ic.append(String.format(" (C,%d)", val));
            return;
        } catch (NumberFormatException ignored) {
        }

        // otherwise treat as symbol
        int symIndex = addSymbolIfNeeded(op);
        ic.append(String.format(" (S,%d)", symIndex));
    }

    private int addSymbolIfNeeded(String sym) {
        if (!symtab.containsKey(sym)) {
            symtab.put(sym, null); // forward reference
        }
        return getSymbolIndex(sym);
    }

    private int addLiteral(String lit) {
        // if literal already exists, return its index
        for (int i = 0; i < littab.size(); i++) {
            if (littab.get(i).literal.equals(lit)) return i + 1;
        }
        littab.add(new Literal(lit));
        return littab.size();
    }

    private void assignLiterals() {
        for (Literal lit : littab) {
            if (lit.address == null) {
                lit.address = LC;
                LC += 1;
            }
        }
    }

    private int evaluateExpression(String expr) {
        if (expr == null || expr.trim().isEmpty()) return 0;
        String e = expr.trim();
        // support expressions like NUM or SYMBOL or SYMBOL+NUM or SYMBOL-NUM or NUM+NUM
        // find + or - left-to-right (one operator supported)
        int plus = e.indexOf('+');
        int minus = e.indexOf('-', 1); // allow leading minus? use indexFrom 1
        if (plus >= 0) {
            String left = e.substring(0, plus).trim();
            String right = e.substring(plus + 1).trim();
            int l = valueOfToken(left);
            int r = valueOfToken(right);
            return l + r;
        } else if (minus >= 0) {
            String left = e.substring(0, minus).trim();
            String right = e.substring(minus + 1).trim();
            int l = valueOfToken(left);
            int r = valueOfToken(right);
            return l - r;
        } else {
            return valueOfToken(e);
        }
    }

    private int valueOfToken(String token) {
        if (token == null || token.isEmpty()) return 0;
        token = token.trim();
        // handle quoted numbers '5'
        if ((token.startsWith("'") && token.endsWith("'")) || (token.startsWith("\"") && token.endsWith("\""))) {
            token = token.substring(1, token.length() - 1);
        }
        try {
            return Integer.parseInt(token);
        } catch (NumberFormatException e) {
            // symbol: if exists in symtab with address, return that, else 0 with warning
            if (symtab.containsKey(token) && symtab.get(token) != null) {
                return symtab.get(token);
            } else {
                System.err.println("Warning: symbol '" + token + "' used in expression but has no address yet. Assuming 0.");
                // ensure symbol is present as forward reference
                symtab.putIfAbsent(token, null);
                return 0;
            }
        }
    }

    private void writeIC() throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("IC_2.txt"))) {
            for (String s : intermediateCode) {
                bw.write(s);
                bw.newLine();
            }
        }
    }

    private void writeSymbolTable() throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("SYMTAB_2.txt"))) {
            int idx = 1;
            for (Map.Entry<String, Integer> e : symtab.entrySet()) {
                String name = e.getKey();
                Integer addr = e.getValue();
                bw.write(String.format("%d\t%s\t%s", idx++, name, addr == null ? "-" : addr.toString()));
                bw.newLine();
            }
        }
    }

    private void writeLiteralTable() throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("LITTAB_2.txt"))) {
            int idx = 1;
            for (Literal l : littab) {
                bw.write(String.format("%d\t%s\t%s", idx++, l.literal, l.address == null ? "-" : l.address.toString()));
                bw.newLine();
            }
        }
    }

    private int getSymbolIndex(String sym) {
        int idx = 1;
        for (String s : symtab.keySet()) {
            if (s.equals(sym)) return idx;
            idx++;
        }
        // should not reach here because caller ensures symbol exists
        return -1;
    }

    private void printSymtab() {
        int idx = 1;
        for (Map.Entry<String, Integer> e : symtab.entrySet()) {
            System.out.println(idx++ + "\t" + e.getKey() + "\t" + (e.getValue() == null ? "-" : e.getValue()));
        }
    }

    private void printLittab() {
        int idx = 1;
        for (Literal l : littab) {
            System.out.println(idx++ + "\t" + l.literal + "\t" + (l.address == null ? "-" : l.address));
        }
    }
}
