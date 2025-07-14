package FCFS;

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

        // Sort by arrival time
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        int time = 0;
        int completed = 0;
        int index = 0;

        System.out.println("\n--- FCFS Runtime Simulation ---\n");

        while (completed < n) {
            boolean found = false;

            while (index < n && processes.get(index).arrivalTime <= time && processes.get(index).isCompleted) {
                index++;
            }

            if (index < n && processes.get(index).arrivalTime <= time) {
                Process current = processes.get(index);
                found = true;

                if (current.startTime == -1) {
                    current.startTime = time;
                    System.out.println("Time " + time + ": Process P" + current.pid + " started.");
                }

                current.remainingTime--;
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

                if (current.remainingTime == 0) {
                    current.isCompleted = true;
                    current.completionTime = time + 1;
                    current.turnaroundTime = current.completionTime - current.arrivalTime;
                    current.waitingTime = current.turnaroundTime - current.burstTime;
                    System.out.println("Time " + (time + 1) + ": Process P" + current.pid + " completed.\n");
                    completed++;
                    index++;
                }

            } else {
                System.out.println("Time " + time + ": CPU is IDLE.");
            }

            Thread.sleep(500);
            time++;
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

Number of processes: 3

P1: Arrival time = 0, Burst time = 2  
P2: Arrival time = 5, Burst time = 3  
P3: Arrival time = 6, Burst time = 1

 */
