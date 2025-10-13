package Ass9;

import java.util.*;

class Process {
    int id;
    boolean active;

    public Process(int id) {
        this.id = id;
        this.active = true;
    }


}

class RingElection {
    private Process[] processes;
    private int numProcesses;

    public RingElection(Process[] processes) {
        this.processes = processes;
        this.numProcesses = processes.length;
    }

    public void performElection(int initiatorIndex) {
        int n = numProcesses;
        boolean[] received = new boolean[n];
        int current = initiatorIndex;
        int maxId = processes[initiatorIndex].id;
        int start = initiatorIndex;

        System.out.println("\nRing Election started by Process " + processes[initiatorIndex].id);

        do {
            int next = (current + 1) % n;
            while (!processes[next].active) {
                next = (next + 1) % n;
            }
            System.out.println("Process " + processes[current].id + " passes message to " + processes[next].id);
            if (processes[next].id > maxId)
                maxId = processes[next].id;
            current = next;
        } while (current != start);

        System.out.println("Process " + maxId + " is elected as Leader!\n");
    }
}

class BullyElection {
    private Process[] processes;
    private int numProcesses;

    public BullyElection(Process[] processes) {
        this.processes = processes;
        this.numProcesses = processes.length;
    }

    public void performElection(int initiatorIndex) {
        System.out.println("\nBully Election started by Process " + processes[initiatorIndex].id);
        int initiatorId = processes[initiatorIndex].id;
        int leaderId = -1;

        for (Process p : processes) {
            if (p.active && p.id > initiatorId) {
                System.out.println("Process " + initiatorId + " sends ELECTION to " + p.id);
            }
        }

        for (Process p : processes) {
            if (p.active && p.id > initiatorId) {
                System.out.println("Process " + p.id + " sends OK to " + initiatorId);
                performElection(Arrays.asList(processes).indexOf(p));
                return;
            }
        }

        leaderId = initiatorId;
        System.out.println("Process " + leaderId + " is elected as Leader!\n");
        for (Process p : processes) {
            if (p.active && p.id != leaderId)
                System.out.println("Process " + leaderId + " sends COORDINATOR to " + p.id);
        }
    }
}

public class Election {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Enter number of processes:");
        int num = sc.nextInt();

        Process[] processes = new Process[num];
        System.out.println("Enter unique ID for each process (integer):");
        for (int i = 0; i < num; i++) {
            processes[i] = new Process(sc.nextInt());
        }

        while (true) {
            System.out.println("\nSelect Election Algorithm:");
            System.out.println("1. Ring Election");
            System.out.println("2. Bully Election");
            System.out.println("3. Exit");
            int choice = sc.nextInt();

            if (choice == 3) break;

            System.out.println("Enter process id to initiate election:");
            int initId = sc.nextInt();
            int initiatorIndex = -1;
            for (int i = 0; i < num; i++) {
                if (processes[i].id == initId && processes[i].active) {
                    initiatorIndex = i;
                    break;
                }
            }
            if (initiatorIndex == -1) {
                System.out.println("Invalid initiator process or process not active.");
                continue;
            }

            System.out.println("Do you want to simulate process failure? (yes=1 / no=0)");
            int fail = sc.nextInt();
            if (fail == 1) {
                System.out.println("Enter process id to fail:");
                int failId = sc.nextInt();
                for (Process p : processes) {
                    if (p.id == failId) {
                        p.active = false;
                        System.out.println("Process " + failId + " marked as failed.");
                    }
                }
            }

            if (choice == 1) {
                new RingElection(processes).performElection(initiatorIndex);
            } else if (choice == 2) {
                new BullyElection(processes).performElection(initiatorIndex);
            }
        }
        sc.close();
        System.out.println("Simulation ended.");
    }
}

/*
Test Input: Basic Election (No Failures)

    Number of processes: 5

    Process IDs: 10 20 30 40 50

    Select Algorithm: 1 (Ring) or 2 (Bully)

    Initiator Process ID: 20

    Simulate Failure: 0


    Basic Election with 1 failure
    Number of processes: 5

    Process IDs: 10 20 30 40 50

    Select Algorithm: 1 (Ring) or 2 (Bully)

    Initiator Process ID: 20

    Simulate Failure: 1 with ID 50

 */
