package RR;

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
    boolean isCompleted = false;

    Process(int pid, int arrivalTime, int burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of processes: ");
        int n = sc.nextInt();

        System.out.print("Enter time quantum: ");
        int quantum = sc.nextInt();

        List<Process> processes = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            System.out.print("Enter arrival time for Process P" + (i + 1) + ": ");
            int at = sc.nextInt();
            System.out.print("Enter burst time for Process P" + (i + 1) + ": ");
            int bt = sc.nextInt();
            processes.add(new Process(i + 1, at, bt));
        }

        // Sort by arrival time
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        Queue<Process> readyQueue = new LinkedList<>();
        int time = 0, completed = 0;
        boolean[] added = new boolean[n];

        System.out.println("\n--- Round Robin Scheduling Runtime Simulation ---\n");

        while (completed < n) {
            // Add arrived processes to readyQueue
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (!added[i] && p.arrivalTime <= time) {
                    readyQueue.add(p);
                    added[i] = true;
                }
            }

            if (readyQueue.isEmpty()) {
                System.out.println("Time " + time + ": CPU is IDLE.");
                time++;
                Thread.sleep(500);
                continue;
            }

            Process current = readyQueue.poll();

            if (current.startTime == -1) {
                current.startTime = time;
            }

            int execTime = Math.min(quantum, current.remainingTime);
            System.out.println(
                    "Time " + time + ": Process P" + current.pid + " started/resumed for " + execTime + " unit(s).");

            for (int t = 0; t < execTime; t++) {
                // Simulate CPU for each unit of time
                System.out.print("Time " + (time + t) + ": ");
                for (Process p : processes) {
                    if (p == current) {
                        System.out.print("[P" + p.pid + ": RUNNING] ");
                    } else if (!p.isCompleted && p.arrivalTime <= (time + t)) {
                        System.out.print("[P" + p.pid + ": WAITING] ");
                    } else {
                        System.out.print("[P" + p.pid + ": IDLE] ");
                    }
                }
                System.out.println();
                Thread.sleep(500);
            }

            time += execTime;
            current.remainingTime -= execTime;

            // Check again for new arrivals during execution
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (!added[i] && p.arrivalTime <= time) {
                    readyQueue.add(p);
                    added[i] = true;
                }
            }

            if (current.remainingTime == 0) {
                current.isCompleted = true;
                current.completionTime = time;
                current.turnaroundTime = current.completionTime - current.arrivalTime;
                current.waitingTime = current.turnaroundTime - current.burstTime;
                System.out.println("Time " + time + ": Process P" + current.pid + " completed.\n");
                completed++;
            } else {
                readyQueue.add(current); // Not finished, requeue it
            }
        }

        System.out.println("--- Summary ---");
        System.out.printf("%-6s %-12s %-10s %-10s %-15s %-15s %-10s\n", "PID", "Arrival", "Burst", "Start",
                "Completion", "Turnaround", "Waiting");
        for (Process p : processes) {
            System.out.printf("P%-5d %-12d %-10d %-10d %-15d %-15d %-10d\n",
                    p.pid, p.arrivalTime, p.burstTime, p.startTime, p.completionTime, p.turnaroundTime, p.waitingTime);
        }

        sc.close();
    }
}

/*
 * Enter number of processes: 4
 * Enter time quantum: 2
 * 
 * Process P1 - Arrival: 0, Burst: 5
 * Process P2 - Arrival: 1, Burst: 3
 * Process P3 - Arrival: 2, Burst: 1
 * Process P4 - Arrival: 4, Burst: 2
 * 
 */
