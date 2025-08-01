package wf;

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

public class WorstFitSimulation {

    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of memory blocks: ");
        int m = sc.nextInt();
        int[] memoryBlocks = new int[m];
        boolean[] blockOccupied = new boolean[m];
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

        int time = 0;
        int completed = 0;

        System.out.println("\n--- Worst Fit Memory Allocation Runtime Simulation ---\n");

        while (completed < n) {

            // 1. Try allocating memory to all waiting processes using Worst Fit
            for (Process p : processes) {
                if (p.arrivalTime <= time && !p.isAllocated && !p.isCompleted) {
                    int worstFitIndex = -1;
                    int maxBlockSize = -1;

                    for (int i = 0; i < memoryBlocks.length; i++) {
                        if (!blockOccupied[i] && memoryBlocks[i] >= p.memoryRequired) {
                            if (memoryBlocks[i] > maxBlockSize) {
                                maxBlockSize = memoryBlocks[i];
                                worstFitIndex = i;
                            }
                        }
                    }

                    if (worstFitIndex != -1) {
                        blockOccupied[worstFitIndex] = true;
                        p.allocatedBlock = worstFitIndex;
                        p.isAllocated = true;
                        System.out.println("Time " + time + ": Process P" + p.pid + " allocated to Block " + (worstFitIndex + 1));
                    } else {
                        System.out.println("Time " + time + ": Process P" + p.pid + " waiting for memory.");
                    }
                }
            }

            // 2. Run the first allocated and not completed process
            boolean runningProcessFound = false;
            for (Process p : processes) {
                if (p.isAllocated && !p.isCompleted) {
                    if (p.startTime == -1) {
                        p.startTime = time;
                        System.out.println("Time " + time + ": Process P" + p.pid + " started.");
                    }

                    System.out.print("Time " + time + ": ");
                    boolean anyProcessPrinted = false;

                    for (Process q : processes) {
                        if (!q.isCompleted && q.arrivalTime <= time) {
                            if (q == p) {
                                System.out.print("[P" + q.pid + ": RUNNING] ");
                            } else if (!q.isAllocated) {
                                System.out.print("[P" + q.pid + ": WAITING for memory] ");
                            } else if (q.isAllocated && !q.isCompleted && q != p) {
                                System.out.print("[P" + q.pid + ": WAITING for CPU] ");
                            }
                            anyProcessPrinted = true;
                        }
                    }

                    if (!anyProcessPrinted) {
                        System.out.print("No active processes.");
                    }
                    System.out.println();

                    p.remainingTime--;
                    runningProcessFound = true;

                    if (p.remainingTime == 0) {
                        p.isCompleted = true;
                        p.completionTime = time + 1;
                        p.turnaroundTime = p.completionTime - p.arrivalTime;
                        p.waitingTime = p.turnaroundTime - p.burstTime;
                        blockOccupied[p.allocatedBlock] = false; // RELEASE MEMORY
                        System.out.println("Time " + (time + 1) + ": Process P" + p.pid + " completed. Block "
                                + (p.allocatedBlock + 1) + " released.\n");
                        completed++;
                    }
                    break;
                }
            }

            if (!runningProcessFound) {
                System.out.println("Time " + time + ": CPU is IDLE.");
            }

            Thread.sleep(500);
            time++;
        }

        // Summary
        System.out.println("--- Summary ---");
        System.out.printf("%-6s %-12s %-10s %-15s %-15s %-15s %-15s\n", "PID", "Arrival", "Burst", "MemoryReq", "Start",
                "Turnaround", "Waiting");
        for (Process p : processes) {
            System.out.printf("P%-5d %-12d %-10d %-15d %-15d %-15d %-15d\n",
                    p.pid, p.arrivalTime, p.burstTime, p.memoryRequired, p.startTime, p.turnaroundTime, p.waitingTime);
        }

        sc.close();
    }
}
