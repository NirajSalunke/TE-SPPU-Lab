package all;

import java.util.*;

class Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int remainingTime;
    int startTime = -1;
    int completionTime = 0;
    int waitingTime = 0;
    int turnaroundTime = 0;
    int allocatedBlock = -1;
    boolean isCompleted = false;
    boolean isAllocated = false;
    int memoryRequired;

    Process(int pid, int arrivalTime, int burstTime, int memoryRequired) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.memoryRequired = memoryRequired;
    }
}

public class MemoryAllocationSimulation {

    enum Strategy {
        FIRST_FIT,
        NEXT_FIT,
        WORST_FIT,
        BEST_FIT
    }

    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);

        // Input phase
        System.out.print("Enter number of memory blocks: ");
        int m = sc.nextInt();
        int[] memoryBlocks = new int[m];
        for (int i = 0; i < m; i++) {
            System.out.print("Enter size of memory block " + (i + 1) + ": ");
            memoryBlocks[i] = sc.nextInt();
        }

        System.out.print("Enter number of processes: ");
        int n = sc.nextInt();
        List<Process> processes = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            System.out.print("Enter arrival time for Process P" + (i + 1) + ": ");
            int at = sc.nextInt();
            System.out.print("Enter burst time for Process P" + (i + 1) + ": ");
            int bt = sc.nextInt();
            System.out.print("Enter memory required for Process P" + (i + 1) + ": ");
            int mem = sc.nextInt();
            processes.add(new Process(i + 1, at, bt, mem));
        }
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        while (true) {
            // Strategy selection
            System.out.println("\nChoose allocation strategy:");
            System.out.println("1. First Fit");
            System.out.println("2. Next Fit");
            System.out.println("3. Worst Fit");
            System.out.println("4. Best Fit");
            System.out.println("5. Exit");
            System.out.print("Enter choice [1-5]: ");
            int choice = sc.nextInt();
            if (choice == 5) {
                // System.out.println("Exiting simulation. Goodbye!");
                break;
            }
            Strategy strat;
            switch (choice) {
                case 1: strat = Strategy.FIRST_FIT; break;
                case 2: strat = Strategy.NEXT_FIT; break;
                case 3: strat = Strategy.WORST_FIT; break;
                case 4: strat = Strategy.BEST_FIT; break;
                default:
                    System.out.println("Invalid choice, please try again.");
                    continue;
            }
            // Reset process states
            for (Process p : processes) {
                p.remainingTime = p.burstTime;
                p.startTime = -1;
                p.completionTime = 0;
                p.waitingTime = 0;
                p.turnaroundTime = 0;
                p.allocatedBlock = -1;
                p.isCompleted = false;
                p.isAllocated = false;
            }
            // Simulate
            simulate(processes, memoryBlocks, strat);
        }
        sc.close();
    }

    private static void simulate(List<Process> processes, int[] memoryBlocks, Strategy strat)
            throws InterruptedException {
        int time = 0, completed = 0;
        boolean[] blockOccupied = new boolean[memoryBlocks.length];
        int nextFitPointer = 0;

        System.out.println("\n--- " + strat.toString().replace('_',' ') + " Simulation ---\n");

        while (completed < processes.size()) {
            // Allocation phase
            for (Process p : processes) {
                if (p.arrivalTime <= time && !p.isAllocated && !p.isCompleted) {
                    int chosenBlock = -1;
                    switch (strat) {
                        case FIRST_FIT:
                            for (int i = 0; i < memoryBlocks.length; i++) {
                                if (!blockOccupied[i] && memoryBlocks[i] >= p.memoryRequired) {
                                    chosenBlock = i;
                                    break;
                                }
                            }
                            break;
                        case NEXT_FIT:
                            int count = 0, idx = nextFitPointer;
                            while (count < memoryBlocks.length) {
                                if (!blockOccupied[idx] && memoryBlocks[idx] >= p.memoryRequired) {
                                    chosenBlock = idx;
                                    break;
                                }
                                idx = (idx + 1) % memoryBlocks.length;
                                count++;
                            }
                            if (chosenBlock != -1) {
                                nextFitPointer = (chosenBlock + 1) % memoryBlocks.length;
                            }
                            break;
                        case WORST_FIT:
                            int maxSize = -1;
                            for (int i = 0; i < memoryBlocks.length; i++) {
                                if (!blockOccupied[i] && memoryBlocks[i] >= p.memoryRequired
                                        && memoryBlocks[i] > maxSize) {
                                    maxSize = memoryBlocks[i];
                                    chosenBlock = i;
                                }
                            }
                            break;
                        case BEST_FIT:
                            int minSize = Integer.MAX_VALUE;
                            for (int i = 0; i < memoryBlocks.length; i++) {
                                if (!blockOccupied[i] && memoryBlocks[i] >= p.memoryRequired
                                        && memoryBlocks[i] < minSize) {
                                    minSize = memoryBlocks[i];
                                    chosenBlock = i;
                                }
                            }
                            break;
                    }
                    if (chosenBlock != -1) {
                        blockOccupied[chosenBlock] = true;
                        p.allocatedBlock = chosenBlock;
                        p.isAllocated = true;
                        System.out.println("Time " + time + ": P" + p.pid +
                                           " allocated to Block " + (chosenBlock + 1));
                    } else {
                        System.out.println("Time " + time + ": P" + p.pid + " waiting for memory.");
                    }
                }
            }

            boolean ran = false;
            for (Process p : processes) {
                if (p.isAllocated && !p.isCompleted) {
                    if (p.startTime == -1) {
                        p.startTime = time;
                        System.out.println("Time " + time + ": P" + p.pid + " started.");
                    }
                    System.out.print("Time " + time + ": ");
                    for (Process q : processes) {
                        if (q.arrivalTime <= time && !q.isCompleted) {
                            if (q == p)      System.out.print("[P" + q.pid + ": RUNNING] ");
                            else if (!q.isAllocated)
                                              System.out.print("[P" + q.pid + ": WAITING for memory] ");
                            else            System.out.print("[P" + q.pid + ": WAITING for CPU] ");
                        }
                    }
                    System.out.println();
                    p.remainingTime--;
                    ran = true;
                    if (p.remainingTime == 0) {
                        p.isCompleted = true;
                        p.completionTime = time + 1;
                        p.turnaroundTime = p.completionTime - p.arrivalTime;
                        p.waitingTime = p.turnaroundTime - p.burstTime;
                        blockOccupied[p.allocatedBlock] = false;
                        System.out.println("Time " + (time + 1) +
                                           ": P" + p.pid + " completed. Block " +
                                           (p.allocatedBlock + 1) + " released.\n");
                        completed++;
                    }
                    break;
                }
            }
            if (!ran) {
                System.out.println("Time " + time + ": CPU is IDLE.");
            }
            Thread.sleep(500);
            time++;
        }

        System.out.println("--- Summary ---");
        System.out.printf("%-6s %-8s %-8s %-12s %-8s %-12s %-8s\n",
                          "PID", "Arrival", "Burst", "MemReq", "Start", "Turnaround", "Waiting");
        for (Process p : processes) {
            System.out.printf("P%-5d %-8d %-8d %-12d %-8d %-12d %-8d\n",
                              p.pid, p.arrivalTime, p.burstTime,
                              p.memoryRequired, p.startTime,
                              p.turnaroundTime, p.waitingTime);
        }
    }
}


/*
Blocks: [100, 300, 200, 400]
| PID | Arrival | Burst | MemReq |

|-----|---------|-------|--------|
| P1  | 0       | 2     | 120    |
| P2  | 0       | 3     | 280    |
| P3  | 1       | 1     | 100    |
| P4  | 2       | 2     | 350    |


 */
