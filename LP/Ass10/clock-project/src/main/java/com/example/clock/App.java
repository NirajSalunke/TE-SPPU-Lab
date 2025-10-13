package com.example.clock;

import java.util.Scanner;

public class App {

    public static void main(String[] args) throws InterruptedException {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\nSelect simulation mode:");
            System.out.println("1. NTP time synchronization");
            System.out.println("2. Lamport clock simulation");
            System.out.println("3. Exit");
            System.out.print("Enter choice (1, 2, or 3): ");

            int choice = scanner.nextInt();

            switch (choice) {
                case 1:
                    Clock ntpClock = new Clock("NTP Client");
                    ntpClock.syncWithNtp();
                    ntpClock.displayCurrentTime();
                    break;

                case 2:
                    Clock processA = new Clock("Process A");
                    Clock processB = new Clock("Process B");

                    System.out.println("\nStarting Lamport clock simulation for two processes...\n");

                    processA.tick();

                    int msgTimestamp = processA.getLamportTime();
                    System.out.println("Process A sends message with timestamp " + msgTimestamp + "\n");

                    Thread.sleep(1000);

                    processB.update(msgTimestamp, "Process A");

                    processB.tick();

                    msgTimestamp = processB.getLamportTime();
                    System.out.println("Process B sends message with timestamp " + msgTimestamp + "\n");

                    Thread.sleep(1000);

                    processA.update(msgTimestamp, "Process B");

                    processA.tick();

                    System.out.println("\nSimulation completed.");
                    break;

                case 3:
                    System.out.println("Exiting program. Goodbye!");
                    scanner.close();
                    return;

                default:
                    System.out.println("Invalid choice. Please enter 1, 2, or 3.");
            }
        }
    }
}

// mvn clean compile
// mvn exec:java -Dexec.mainClass="com.example.clock.App"