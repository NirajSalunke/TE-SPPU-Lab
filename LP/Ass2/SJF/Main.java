package SJF;

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
        List<Process> processes = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            System.out.print("Enter arrival time for Process P" + (i + 1) + ": ");
            int at = sc.nextInt();
            System.out.print("Enter burst time for Process P" + (i + 1) + ": ");
            int bt = sc.nextInt();
            processes.add(new Process(i + 1, at, bt));
        }

        // Sort by arrival time initially
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        int time = 0;
        int completed = 0;
        Process current = null;

        System.out.println("\n--- SJF Preemptive (SRTF) Runtime Simulation ---\n");

        while (completed < n) {
            Process shortest = null;
            int minRemaining = Integer.MAX_VALUE;

            // Find process with shortest remaining time at current time
            for (Process p : processes) {
                if (!p.isCompleted && p.arrivalTime <= time && p.remainingTime < minRemaining) {
                    minRemaining = p.remainingTime;
                    shortest = p;
                }
            }

            if (shortest == null) {
                System.out.println("Time " + time + ": CPU is IDLE.");
                time++;
                Thread.sleep(500);
                continue;
            }

            // If process changes (preemption)
            if (current != shortest) {
                current = shortest;
                if (current.startTime == -1) {
                    current.startTime = time;
                }
                System.out.println("Time " + time + ": Process P" + current.pid + " started/resumed.");
            }

            // Run process for 1 time unit
            System.out.print("Time " + time + ": ");
            for (Process p : processes) {
                if (p == current) {
                    System.out.print("[P" + p.pid + ": RUNNING] ");
                } else if (!p.isCompleted && p.arrivalTime <= time) {
                    System.out.print("[P" + p.pid + ": WAITING] ");
                } else {
                    System.out.print("[P" + p.pid + ": IDLE] ");
                }
            }
            System.out.println();

            current.remainingTime--;
            time++;

            // Check if current process is finished
            if (current.remainingTime == 0) {
                current.isCompleted = true;
                current.completionTime = time;
                current.turnaroundTime = current.completionTime - current.arrivalTime;
                current.waitingTime = current.turnaroundTime - current.burstTime;
                System.out.println("Time " + time + ": Process P" + current.pid + " completed.\n");
                completed++;
                current = null;  // Reset current process to pick next
            }

            Thread.sleep(500);
        }

        System.out.println("--- Summary ---");
        System.out.printf("%-6s %-12s %-10s %-15s %-15s %-15s\n", "PID", "Arrival", "Burst", "Start", "Turnaround",
                "Waiting");
        for (Process p : processes) {
            System.out.printf("P%-5d %-12d %-10d %-15d %-15d %-15d\n",
                    p.pid, p.arrivalTime, p.burstTime, p.startTime, p.turnaroundTime, p.waitingTime);
        }

        sc.close();
    }
}


/*
Premptive SJF
Number of processes: 4

P1: Arrival time = 0, Burst time = 7  
P2: Arrival time = 2, Burst time = 4  
P3: Arrival time = 4, Burst time = 1  
P4: Arrival time = 5, Burst time = 4

 */
