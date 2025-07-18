package PQ;

import java.util.*;

class Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int remainingTime;
    int priority;
    int startTime = -1;
    int completionTime = 0;
    int waitingTime = 0;
    int turnaroundTime = 0;
    boolean isCompleted = false;

    Process(int pid, int arrivalTime, int burstTime, int priority) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority;
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
            System.out.print("Enter priority for Process P" + (i + 1) + " (lower number means higher priority): ");
            int pr = sc.nextInt();
            processes.add(new Process(i + 1, at, bt, pr));
        }

        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        int time = 0;
        int completed = 0;
        Process current = null;

        System.out.println("\n--- Preemptive Priority Scheduling Runtime Simulation ---\n");

        while (completed < n) {
            Process highestPriorityProcess = null;
            int highestPriority = Integer.MAX_VALUE;

            for (Process p : processes) {
                if (!p.isCompleted && p.arrivalTime <= time) {
                    if (p.priority < highestPriority || 
                       (p.priority == highestPriority && p.arrivalTime < (highestPriorityProcess != null ? highestPriorityProcess.arrivalTime : Integer.MAX_VALUE))) {
                        highestPriority = p.priority;
                        highestPriorityProcess = p;
                    }
                }
            }

            if (highestPriorityProcess == null) {
                System.out.println("Time " + time + ": CPU is IDLE.");
                time++;
                Thread.sleep(500);
                continue;
            }

            if (current != highestPriorityProcess) {
                current = highestPriorityProcess;
                if (current.startTime == -1) {
                    current.startTime = time;
                }
                System.out.println("Time " + time + ": Process P" + current.pid + " started/resumed.");
            }

            System.out.print("Time " + time + ": ");
            for (Process p : processes) {
                if (p == current) {
                    System.out.print("[P" + p.pid + ": RUNNING, Pri=" + p.priority + "] ");
                } else if (!p.isCompleted && p.arrivalTime <= time) {
                    System.out.print("[P" + p.pid + ": WAITING, Pri=" + p.priority + "] ");
                } else {
                    System.out.print("[P" + p.pid + ": IDLE] ");
                }
            }
            System.out.println();

            current.remainingTime--;
            time++;

            if (current.remainingTime == 0) {
                current.isCompleted = true;
                current.completionTime = time;
                current.turnaroundTime = current.completionTime - current.arrivalTime;
                current.waitingTime = current.turnaroundTime - current.burstTime;
                System.out.println("Time " + time + ": Process P" + current.pid + " completed.\n");
                completed++;
                current = null; 
            }

            Thread.sleep(500);
        }

        System.out.println("--- Summary ---");
        System.out.printf("%-6s %-12s %-10s %-10s %-15s %-15s %-10s\n", "PID", "Arrival", "Burst", "Priority", "Start", "Turnaround", "Waiting");
        for (Process p : processes) {
            System.out.printf("P%-5d %-12d %-10d %-10d %-15d %-15d %-10d\n",
                    p.pid, p.arrivalTime, p.burstTime, p.priority, p.startTime, p.turnaroundTime, p.waitingTime);
        }

        sc.close();
    }
}

/*
| Process | Arrival Time | Burst Time | Priority (Lower is Higher) |
| ------- | ------------ | ---------- | -------------------------- |
| P1      | 0            | 7          | 2                          |
| P2      | 2            | 4          | 1                          |
| P3      | 4            | 1          | 3                          |
| P4      | 5            | 4          | 2                          |
*/
