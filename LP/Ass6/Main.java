import java.util.*;

public class Main {
    static class MNTEntry {
        String name;
        int mdtPtr;

        public MNTEntry(String name, int mdPtr) {
            this.name = name;
            this.mdtPtr = mdPtr;
        }
    }

    List<MNTEntry> mnt = new ArrayList<>();
    List<String> mdt = new ArrayList<>();
    Map<String, Integer> ala = new LinkedHashMap<>();

    public void pass1(List<String> lines) {
        boolean inMacro = false;
        int mdtIdx = 0;

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i).trim();

            if (line.startsWith("MACRO")) {
                inMacro = true;
                ala.clear();
                String proto = lines.get(++i).trim();
                String[] parts = proto.split(" ");
                String macroName = parts[0];

                int alaIdx = 1;

                if (parts.length > 1) {
                    String[] args = proto.substring(proto.indexOf(' ') + 1).split(",");
                    for (String arg : args) {
                        arg = arg.trim().replace("&", "");
                        if (arg.contains("=")) {
                            arg = arg.substring(0, arg.indexOf("="));
                        }
                        ala.put(arg, alaIdx++);
                    }
                }

                mnt.add(new MNTEntry(macroName, mdt.size()));
                mdt.add(proto);
                continue;
            }

            if (line.equals("MEND")) {
                inMacro = false;
                mdt.add("MEND");
                continue;
            }

            if (inMacro) {
                for (String arg : ala.keySet()) {
                    line = line.replace("&" + arg, "#" + ala.get(arg));
                }
                mdt.add(line);
            }
        }
    }

    public void printTables() {
        System.out.println("MNT:- ");
        for (MNTEntry e : mnt) {
            System.out.println(e.name + " " + e.mdtPtr);
        }
        System.out.println("\nMDT:");
        for (int i = 0; i < mdt.size(); i++) {
            System.out.println(i + ": " + mdt.get(i));
        }

        System.out.println("\nSample ALA for last macro:");
        for (String k : ala.keySet()) {
            System.out.println(k + " = #" + ala.get(k));
        }
    }

    public static void main(String[] args) {
        List<String> code = Arrays.asList("MACRO",
                "ONE &O,&N,&E=AREG",
                "MOVER &E,&O",
                "ADD &E,&N",
                "MOVEM &E,&O",
                "MEND",
                "MACRO",
                "TWO &T,&W,&O=DREG",
                "MOVER &O,&T",
                "ADD &O,&W",
                "MOVEM &O,&T",
                "MEND");
        MacroProcessorPass1 p = new MacroProcessorPass1();

        p.pass1(code);
        p.printTables();
    }
}
