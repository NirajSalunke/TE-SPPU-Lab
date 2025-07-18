
package SchedulingSimulator;

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

public class SchedulingSimulator {

    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("\n=== CPU Scheduling Simulator ===");
            System.out.println("1. First-Come, First-Served (FCFS)");
            System.out.println("2. Preemptive Priority Scheduling");
            System.out.println("3. Round Robin");
            System.out.println("4. Preemptive SJF (SRTF)");
            System.out.println("5. Exit");
            System.out.print("Choose an algorithm (1-5): ");
            int choice = sc.nextInt();

            if (choice == 5) {
                System.out.println("Exiting...");
                break;
            }

            System.out.print("Enter number of processes: ");
            int n = sc.nextInt();

            List<Process> processes = new ArrayList<>();

            for (int i = 0; i < n; i++) {
                System.out.print("Enter arrival time for Process P" + (i + 1) + ": ");
                int at = sc.nextInt();
                System.out.print("Enter burst time for Process P" + (i + 1) + ": ");
                int bt = sc.nextInt();
                int pr = 0;
                if (choice == 2) {
                    System.out.print("Enter priority for Process P" + (i + 1) + " (lower number = higher priority): ");
                    pr = sc.nextInt();
                }
                processes.add(new Process(i + 1, at, bt, pr));
            }

            if (choice == 1) {
                simulateFCFS(processes);
            } else if (choice == 2) {
                simulatePriority(processes);
            } else if (choice == 3) {
                System.out.print("Enter time quantum: ");
                int quantum = sc.nextInt();
                simulateRoundRobin(processes, quantum);
            } else if (choice == 4) {
                simulateSJF(processes);
            } else {
                System.out.println("Invalid choice.");
            }
        }

        sc.close();
    }

    private static void simulateFCFS(List<Process> processes) throws InterruptedException {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));
        int time = 0, completed = 0, index = 0;

        System.out.println("\n--- FCFS Runtime Simulation ---\n");

        while (completed < processes.size()) {
            boolean found = false;

            while (index < processes.size() && processes.get(index).arrivalTime <= time && processes.get(index).isCompleted) {
                index++;
            }

            if (index < processes.size() && processes.get(index).arrivalTime <= time) {
                Process current = processes.get(index);
                found = true;

                if (current.startTime == -1) {
                    current.startTime = time;
                    System.out.println("Time " + time + ": Process P" + current.pid + " started.");
                }

                current.remainingTime--;
                printStates(processes, current, time);

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

        printSummary(processes, false);
    }

    private static void simulatePriority(List<Process> processes) throws InterruptedException {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));
        int time = 0, completed = 0;
        Process current = null;

        System.out.println("\n--- Preemptive Priority Scheduling Simulation ---\n");

        while (completed < processes.size()) {
            Process highest = null;
            int highestPriority = Integer.MAX_VALUE;

            for (Process p : processes) {
                if (!p.isCompleted && p.arrivalTime <= time && p.priority < highestPriority) {
                    highestPriority = p.priority;
                    highest = p;
                }
            }

            if (highest == null) {
                System.out.println("Time " + time + ": CPU is IDLE.");
                time++;
                Thread.sleep(500);
                continue;
            }

            if (current != highest) {
                current = highest;
                if (current.startTime == -1)
                    current.startTime = time;
                System.out.println("Time " + time + ": Process P" + current.pid + " started/resumed.");
            }

            printStates(processes, current, time);
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

        printSummary(processes, true);
    }

    private static void simulateRoundRobin(List<Process> processes, int quantum) throws InterruptedException {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));
        Queue<Process> queue = new LinkedList<>();
        int time = 0, completed = 0;
        boolean[] added = new boolean[processes.size()];

        System.out.println("\n--- Round Robin Scheduling Simulation ---\n");

        while (completed < processes.size()) {
            for (int i = 0; i < processes.size(); i++) {
                if (!added[i] && processes.get(i).arrivalTime <= time) {
                    queue.add(processes.get(i));
                    added[i] = true;
                }
            }

            if (queue.isEmpty()) {
                System.out.println("Time " + time + ": CPU is IDLE.");
                time++;
                Thread.sleep(500);
                continue;
            }

            Process current = queue.poll();
            if (current.startTime == -1)
                current.startTime = time;

            int exec = Math.min(quantum, current.remainingTime);
            System.out.println("Time " + time + ": Process P" + current.pid + " executing for " + exec + " unit(s).");

            for (int i = 0; i < exec; i++) {
                printStates(processes, current, time + i);
                Thread.sleep(500);
            }

            time += exec;
            current.remainingTime -= exec;

            for (int i = 0; i < processes.size(); i++) {
                if (!added[i] && processes.get(i).arrivalTime <= time) {
                    queue.add(processes.get(i));
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
                queue.add(current);
            }
        }

        printSummary(processes, false);
    }

    private static void simulateSJF(List<Process> processes) throws InterruptedException {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));
        int time = 0, completed = 0;
        Process current = null;

        System.out.println("\n--- Preemptive SJF (SRTF) Scheduling Simulation ---\n");

        while (completed < processes.size()) {
            Process shortest = null;
            int minRemaining = Integer.MAX_VALUE;

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

            if (current != shortest) {
                current = shortest;
                if (current.startTime == -1)
                    current.startTime = time;
                System.out.println("Time " + time + ": Process P" + current.pid + " started/resumed.");
            }

            printStates(processes, current, time);
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

        printSummary(processes, false);
    }


    private static void printStates(List<Process> processes, Process current, int time) {
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
    }

    private static void printSummary(List<Process> processes, boolean showPriority) {
        System.out.println("--- Summary ---");
        if (showPriority) {
            System.out.printf("%-6s %-10s %-10s %-10s %-10s %-12s %-10s\n", "PID", "Arrival", "Burst", "Priority", "Start", "Turnaround", "Waiting");
            for (Process p : processes) {
                System.out.printf("P%-5d %-10d %-10d %-10d %-10d %-12d %-10d\n",
                        p.pid, p.arrivalTime, p.burstTime, p.priority, p.startTime, p.turnaroundTime, p.waitingTime);
            }
        } else {
            System.out.printf("%-6s %-10s %-10s %-10s %-12s %-10s\n", "PID", "Arrival", "Burst", "Start", "Turnaround", "Waiting");
            for (Process p : processes) {
                System.out.printf("P%-5d %-10d %-10d %-10d %-12d %-10d\n",
                        p.pid, p.arrivalTime, p.burstTime, p.startTime, p.turnaroundTime, p.waitingTime);
            }
        }
    }
}
