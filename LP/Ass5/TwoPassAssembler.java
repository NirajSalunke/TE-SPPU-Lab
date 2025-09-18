
import java.io.*;
import java.util.*;

public class TwoPassAssembler {

    static class OpTabEntry {
        String type;
        String opcode;

        OpTabEntry(String type, String opcode) {
            this.type = type;
            this.opcode = opcode;
        }
    }

    static class SymTabEntry {
        String symbol;
        int address;

        SymTabEntry(String symbol, int address) {
            this.symbol = symbol;
            this.address = address;
        }
    }

    static class LitTabEntry {
        String literal;
        int address;

        LitTabEntry(String literal, int address) {
            this.literal = literal;
            this.address = address;
        }
    }

    static class IntermediateCodeEntry {
        int address;
        String type;
        String opcode;
        String operand1;
        String operand2;

        IntermediateCodeEntry(int address, String type, String opcode, String operand1, String operand2) {
            this.address = address;
            this.type = type;
            this.opcode = opcode;
            this.operand1 = operand1;
            this.operand2 = operand2;
        }
    }

    // Tables
    static Map<String, OpTabEntry> optab = new HashMap<>();
    static List<SymTabEntry> symtab = new ArrayList<>();
    static List<LitTabEntry> littab = new ArrayList<>();
    static List<Integer> pooltab = new ArrayList<>();
    static Map<String, Integer> registers = new HashMap<>();
    static Map<String, Integer> conditionCodes = new HashMap<>();

    // Assembler state
    static int locationCounter = 0;
    static List<String> intermediateCode = new ArrayList<>();
    static List<IntermediateCodeEntry> icTable = new ArrayList<>();
    static List<String> machineCode = new ArrayList<>();

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Usage: java TwoPassAssembler <input_file.asm>");
            System.exit(1);
        }

        String inputFile = args[0];
        String baseName = inputFile.replaceAll("\\.asm$", "");

        // Initialize tables
        initializeTables();

        try {
            System.out.println("Starting Pass-I of Two-Pass Assembler...");
            // Pass I
            passI(inputFile);

            System.out.println("Starting Pass-II of Two-Pass Assembler...");
            // Pass II
            passII();

            // Create output directory
            File outputDir = new File(baseName);
            if (!outputDir.exists()) {
                outputDir.mkdirs();
            }

            // Generate output files
            generateIntermediateFile(baseName);
            generateSymbolFile(baseName);
            generateLiteralFile(baseName);
            generatePoolFile(baseName);
            generateMachineCodeFile(baseName);

            System.out.println("Two-pass assembler completed successfully!");
            System.out.println("Output files generated in: " + baseName + "/");
            System.out.println("Files created:");
            System.out.println("- intermediate.txt");
            System.out.println("- symbol.txt");
            System.out.println("- literal.txt");
            System.out.println("- pool.txt");
            System.out.println("- machinecode.txt");

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    static void initializeTables() {
        // Initialize Operation Table (OPTAB)
        optab.put("STOP", new OpTabEntry("IS", "00"));
        optab.put("ADD", new OpTabEntry("IS", "01"));
        optab.put("SUB", new OpTabEntry("IS", "02"));
        optab.put("MULT", new OpTabEntry("IS", "03"));
        optab.put("MOVER", new OpTabEntry("IS", "04"));
        optab.put("MOVEM", new OpTabEntry("IS", "05"));
        optab.put("COMP", new OpTabEntry("IS", "06"));
        optab.put("BC", new OpTabEntry("IS", "07"));
        optab.put("DIV", new OpTabEntry("IS", "08"));
        optab.put("READ", new OpTabEntry("IS", "09"));
        optab.put("PRINT", new OpTabEntry("IS", "10"));

        optab.put("START", new OpTabEntry("AD", "01"));
        optab.put("END", new OpTabEntry("AD", "02"));
        optab.put("ORIGIN", new OpTabEntry("AD", "03"));
        optab.put("EQU", new OpTabEntry("AD", "04"));
        optab.put("LTORG", new OpTabEntry("AD", "05"));

        optab.put("DC", new OpTabEntry("DL", "01"));
        optab.put("DS", new OpTabEntry("DL", "02"));

        // Initialize Registers
        registers.put("AREG", 1);
        registers.put("BREG", 2);
        registers.put("CREG", 3);
        registers.put("DREG", 4);

        // Initialize Condition Codes
        conditionCodes.put("LT", 1);
        conditionCodes.put("LE", 2);
        conditionCodes.put("EQ", 3);
        conditionCodes.put("GT", 4);
        conditionCodes.put("GE", 5);
        conditionCodes.put("ANY", 6);

        // Initialize first pool
        pooltab.add(1);
    }

    static void passI(String filename) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filename));
        String line;

        while ((line = reader.readLine()) != null) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith(";")) {
                continue;
            }

            processLine(line);
        }

        reader.close();
        System.out.println("Pass-I completed successfully!");
    }

    static void processLine(String line) {
        // Parse the line - handle multiple spaces/tabs
        String[] parts = line.split("\\s+");
        String label = "";
        String opcode = "";
        String operand1 = "";
        String operand2 = "";

        int index = 0;

        // Check if first token is a label (not an opcode)
        if (parts.length > 0 && !optab.containsKey(parts[0])) {
            label = parts[0];
            index = 1;
        }

        // Get opcode
        if (index < parts.length) {
            opcode = parts[index++];
        }

        // Get operands
        if (index < parts.length) {
            operand1 = parts[index++];
        }
        if (index < parts.length) {
            operand2 = parts[index++];
        }

        // Process based on opcode
        OpTabEntry opEntry = optab.get(opcode);
        if (opEntry == null) {
            System.err.println("Unknown opcode: " + opcode + " in line: " + line);
            return;
        }

        processStatement(label, opcode, operand1, operand2, opEntry);
    }

    static void processStatement(String label, String opcode, String operand1, String operand2, OpTabEntry opEntry) {
        switch (opEntry.type) {
            case "IS":
                processInstructionStatement(label, opcode, operand1, operand2, opEntry);
                break;
            case "AD":
                processAssemblerDirective(label, opcode, operand1, operand2, opEntry);
                break;
            case "DL":
                processDeclarativeStatement(label, opcode, operand1, operand2, opEntry);
                break;
        }
    }

    static void processInstructionStatement(String label, String opcode, String operand1, String operand2,
            OpTabEntry opEntry) {
        // Add label to symbol table if present
        if (!label.isEmpty()) {
            addToSymbolTable(label, locationCounter);
        }

        StringBuilder icLine = new StringBuilder();
        icLine.append(locationCounter).append("\t(").append(opEntry.type).append(",").append(opEntry.opcode)
                .append(")");

        String op1 = "";
        String op2 = "";

        // Process operand1
        if (!operand1.isEmpty()) {
            if (registers.containsKey(operand1)) {
                icLine.append("\t").append(registers.get(operand1));
                op1 = String.valueOf(registers.get(operand1));
            } else if (conditionCodes.containsKey(operand1)) {
                icLine.append("\t").append(conditionCodes.get(operand1));
                op1 = String.valueOf(conditionCodes.get(operand1));
            } else {
                int symIndex = getSymbolIndex(operand1);
                icLine.append("\t(S,").append(String.format("%02d", symIndex)).append(")");
                op1 = "(S," + String.format("%02d", symIndex) + ")";
            }
        }

        // Process operand2
        if (!operand2.isEmpty()) {
            if (isNumeric(operand2)) {
                // It's a literal
                int litIndex = addLiteral(operand2);
                icLine.append("\t(L,").append(String.format("%02d", litIndex)).append(")");
                op2 = "(L," + String.format("%02d", litIndex) + ")";
            } else if (registers.containsKey(operand2)) {
                icLine.append("\t").append(registers.get(operand2));
                op2 = String.valueOf(registers.get(operand2));
            } else {
                int symIndex = getSymbolIndex(operand2);
                icLine.append("\t(S,").append(String.format("%02d", symIndex)).append(")");
                op2 = "(S," + String.format("%02d", symIndex) + ")";
            }
        }

        intermediateCode.add(icLine.toString());
        icTable.add(new IntermediateCodeEntry(locationCounter, opEntry.type, opEntry.opcode, op1, op2));
        locationCounter++;
    }

    static void processAssemblerDirective(String label, String opcode, String operand1, String operand2,
            OpTabEntry opEntry) {
        StringBuilder icLine = new StringBuilder();

        switch (opcode) {
            case "START":
                locationCounter = Integer.parseInt(operand1);
                icLine.append("\t(").append(opEntry.type).append(",").append(opEntry.opcode).append(")\t(C,")
                        .append(operand1).append(")");
                intermediateCode.add(icLine.toString());
                icTable.add(new IntermediateCodeEntry(-1, opEntry.type, opEntry.opcode, "(C," + operand1 + ")", ""));
                break;

            case "END":
                // Process any remaining literals
                processRemainingLiterals();
                icLine.append("\t(").append(opEntry.type).append(",").append(opEntry.opcode).append(")");
                intermediateCode.add(icLine.toString());
                icTable.add(new IntermediateCodeEntry(-1, opEntry.type, opEntry.opcode, "", ""));
                break;

            case "ORIGIN":
                // Handle ORIGIN with expressions like LOOP+2
                if (operand1.contains("+")) {
                    String[] parts = operand1.split("\\+");
                    String symbol = parts[0];
                    int offset = Integer.parseInt(parts[1]);
                    SymTabEntry entry = findSymbol(symbol);
                    if (entry != null && entry.address != -1) {
                        locationCounter = entry.address + offset;
                    }
                    icLine.append("\t(").append(opEntry.type).append(",").append(opEntry.opcode).append(")\t(S,")
                            .append(String.format("%02d", getSymbolIndex(symbol))).append(")");
                } else if (isNumeric(operand1)) {
                    locationCounter = Integer.parseInt(operand1);
                    icLine.append("\t(").append(opEntry.type).append(",").append(opEntry.opcode).append(")\t(C,")
                            .append(operand1).append(")");
                } else {
                    SymTabEntry entry = findSymbol(operand1);
                    if (entry != null && entry.address != -1) {
                        locationCounter = entry.address;
                    }
                    icLine.append("\t(").append(opEntry.type).append(",").append(opEntry.opcode).append(")\t(S,")
                            .append(String.format("%02d", getSymbolIndex(operand1))).append(")");
                }
                intermediateCode.add(icLine.toString());
                break;

            case "EQU":
                if (!label.isEmpty()) {
                    SymTabEntry targetEntry = findSymbol(operand1);
                    if (targetEntry != null) {
                        addToSymbolTable(label, targetEntry.address);
                    } else {
                        // Forward reference - will be resolved later
                        addToSymbolTable(label, -1);
                    }
                }
                // EQU doesn't generate intermediate code line
                break;

            case "LTORG":
                processLiterals();
                break;
        }
    }

    static void processDeclarativeStatement(String label, String opcode, String operand1, String operand2,
            OpTabEntry opEntry) {
        if (!label.isEmpty()) {
            addToSymbolTable(label, locationCounter);
        }

        StringBuilder icLine = new StringBuilder();
        icLine.append(locationCounter).append("\t(").append(opEntry.type).append(",").append(opEntry.opcode)
                .append(")\t(C,").append(operand1).append(")");
        intermediateCode.add(icLine.toString());
        icTable.add(
                new IntermediateCodeEntry(locationCounter, opEntry.type, opEntry.opcode, "(C," + operand1 + ")", ""));

        if (opcode.equals("DS")) {
            locationCounter += Integer.parseInt(operand1);
        } else {
            locationCounter++;
        }
    }

    static void processLiterals() {
        for (LitTabEntry entry : littab) {
            if (entry.address == -1) {
                entry.address = locationCounter;
                String icLine = locationCounter + "\t(DL,01)\t(C," + entry.literal + ")";
                intermediateCode.add(icLine);
                icTable.add(new IntermediateCodeEntry(locationCounter, "DL", "01", "(C," + entry.literal + ")", ""));
                locationCounter++;
            }
        }

        // Add new pool entry
        if (!littab.isEmpty()) {
            pooltab.add(littab.size() + 1);
        }
    }

    static void processRemainingLiterals() {
        for (LitTabEntry entry : littab) {
            if (entry.address == -1) {
                entry.address = locationCounter;
                String icLine = locationCounter + "\t(DL,01)\t(C," + entry.literal + ")";
                intermediateCode.add(icLine);
                icTable.add(new IntermediateCodeEntry(locationCounter, "DL", "01", "(C," + entry.literal + ")", ""));
                locationCounter++;
            }
        }
    }

    // PASS II Implementation
    static void passII() {
        System.out.println("Processing intermediate code to generate machine code...");

        for (IntermediateCodeEntry ic : icTable) {
            if (ic.address == -1)
                continue; // Skip AD directives

            String mcLine = "";

            if (ic.type.equals("IS")) {
                // Generate machine code for instruction statements
                mcLine = generateInstructionMachineCode(ic);
            } else if (ic.type.equals("DL")) {
                // Generate machine code for declarative statements
                mcLine = generateDeclarativeMachineCode(ic);
            }

            if (!mcLine.isEmpty()) {
                machineCode.add(String.format("%03d\t%s", ic.address, mcLine));
            }
        }

        System.out.println("Pass-II completed successfully!");
    }

    static String generateInstructionMachineCode(IntermediateCodeEntry ic) {
        StringBuilder mc = new StringBuilder();

        // Add opcode
        mc.append(ic.opcode);

        // Process operand 1
        String op1Address = resolveOperand(ic.operand1);
        if (!op1Address.isEmpty()) {
            mc.append(" ").append(String.format("%03d", Integer.parseInt(op1Address)));
        } else {
            mc.append(" 000");
        }

        // Process operand 2
        String op2Address = resolveOperand(ic.operand2);
        if (!op2Address.isEmpty()) {
            mc.append(" ").append(String.format("%03d", Integer.parseInt(op2Address)));
        } else {
            mc.append(" 000");
        }

        return mc.toString();
    }

    static String generateDeclarativeMachineCode(IntermediateCodeEntry ic) {
        if (ic.operand1.startsWith("(C,")) {
            // Extract constant value
            String constant = ic.operand1.substring(3, ic.operand1.length() - 1);
            return "00 000 " + String.format("%03d", Integer.parseInt(constant));
        }
        return "";
    }

    static String resolveOperand(String operand) {
        if (operand.isEmpty())
            return "";

        if (operand.matches("\\d+")) {
            // Simple register number
            return operand;
        }

        if (operand.startsWith("(S,")) {
            // Symbol reference
            int symIndex = Integer.parseInt(operand.substring(3, operand.length() - 1));
            if (symIndex <= symtab.size()) {
                SymTabEntry entry = symtab.get(symIndex - 1);
                return String.valueOf(entry.address);
            }
        }

        if (operand.startsWith("(L,")) {
            // Literal reference
            int litIndex = Integer.parseInt(operand.substring(3, operand.length() - 1));
            if (litIndex <= littab.size()) {
                LitTabEntry entry = littab.get(litIndex - 1);
                return String.valueOf(entry.address);
            }
        }

        if (operand.startsWith("(C,")) {
            // Constant
            return operand.substring(3, operand.length() - 1);
        }

        return "";
    }

    static int addLiteral(String literal) {
        // Check if literal already exists
        for (int i = 0; i < littab.size(); i++) {
            if (littab.get(i).literal.equals(literal)) {
                return i + 1;
            }
        }

        // Add new literal
        littab.add(new LitTabEntry(literal, -1));
        return littab.size();
    }

    static void addToSymbolTable(String symbol, int address) {
        // Check if symbol already exists
        for (SymTabEntry entry : symtab) {
            if (entry.symbol.equals(symbol)) {
                if (address != -1) {
                    entry.address = address;
                }
                return;
            }
        }

        // Add new symbol
        symtab.add(new SymTabEntry(symbol, address));
    }

    static SymTabEntry findSymbol(String symbol) {
        for (SymTabEntry entry : symtab) {
            if (entry.symbol.equals(symbol)) {
                return entry;
            }
        }
        return null;
    }

    static int getSymbolIndex(String symbol) {
        for (int i = 0; i < symtab.size(); i++) {
            if (symtab.get(i).symbol.equals(symbol)) {
                return i + 1;
            }
        }

        // Symbol not found, add it with undefined address
        symtab.add(new SymTabEntry(symbol, -1));
        return symtab.size();
    }

    static boolean isNumeric(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    static void generateIntermediateFile(String baseName) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(baseName + "/intermediate.txt"));
        for (String line : intermediateCode) {
            writer.println(line);
        }
        writer.close();
    }

    static void generateSymbolFile(String baseName) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(baseName + "/symbol.txt"));
        writer.println("Symbol\tAddress");
        for (SymTabEntry entry : symtab) {
            if (entry.address != -1) {
                writer.println(entry.symbol + "\t" + entry.address);
            }
        }
        writer.close();
    }

    static void generateLiteralFile(String baseName) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(baseName + "/literal.txt"));
        writer.println("Literal\tAddress");
        for (LitTabEntry entry : littab) {
            if (entry.address != -1) {
                writer.println(entry.literal + "\t" + entry.address);
            }
        }
        writer.close();
    }

    static void generatePoolFile(String baseName) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(baseName + "/pool.txt"));
        writer.println("Pool\tLiteral No.");
        for (int i = 0; i < pooltab.size(); i++) {
            writer.println((i + 1) + "\t" + pooltab.get(i));
        }
        writer.close();
    }

    static void generateMachineCodeFile(String baseName) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(baseName + "/machinecode.txt"));
        writer.println("Address\tMachine Code");
        for (String line : machineCode) {
            writer.println(line);
        }
        writer.close();
    }
}
