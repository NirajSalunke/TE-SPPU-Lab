package all;

import java.util.*;

public class PageReplacementLRUMRU {

    enum Strategy {
        LRU,
        MRU
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of frames: ");
        int frames = sc.nextInt();

        System.out.print("Enter length of reference string: ");
        int n = sc.nextInt();

        int[] referenceString = new int[n];
        System.out.println("Enter reference string (space separated): ");
        for (int i = 0; i < n; i++) {
            referenceString[i] = sc.nextInt();
        }

        while (true) {
            System.out.println("\nChoose Page Replacement Strategy:");
            System.out.println("1. LRU");
            System.out.println("2. MRU");
            System.out.println("3. Exit");
            System.out.print("Enter choice [1-3]: ");
            int choice = sc.nextInt();
            if (choice == 3) break;

            Strategy strat;
            switch (choice) {
                case 1: strat = Strategy.LRU; break;
                case 2: strat = Strategy.MRU; break;
                default:
                    System.out.println("Invalid choice!");
                    continue;
            }

            simulate(referenceString, frames, strat);
        }

        sc.close();
    }

    private static void simulate(int[] referenceString, int frames, Strategy strat) {
        List<Integer> frameList = new ArrayList<>();
        int pageFaults = 0, hits = 0;

        System.out.println("\n--- " + strat.toString() + " Page Replacement Simulation ---\n");
        System.out.printf("%-10s %-25s %-20s %-12s\n", "Reference", "Frames", "Action", "Status");

        for (int page : referenceString) {
            if (frameList.contains(page)) {
                hits++;
                frameList.remove((Integer) page);
                frameList.add(page);

                System.out.printf("%-10d %-25s %-20s %-12s\n",
                        page, frameList, "Page HIT", "HIT");

            } else {
                pageFaults++;
                String action;

                if (frameList.size() < frames) {
                    frameList.add(page);
                    action = "Added " + page + " (empty slot)";
                } else {
                    int victimIndex;
                    if (strat == Strategy.LRU) {
                        victimIndex = 0;
                    } else {
                        victimIndex = frameList.size() - 1; 
                    }
                    int victim = frameList.get(victimIndex);
                    frameList.remove(victimIndex);
                    frameList.add(page);
                    action = "Replaced " + victim + " with " + page;
                }

                System.out.printf("%-10d %-25s %-20s %-12s\n",
                        page, frameList, action, "FAULT");
            }
        }

        System.out.println("\n--- Summary ---");
        System.out.println("Total Page Faults: " + pageFaults);
        System.out.println("Total Hits: " + hits);
        double hitRatio = (double) hits / referenceString.length;
        double faultRatio = (double) pageFaults / referenceString.length;
        System.out.printf("Hit Ratio: %.2f | Fault Ratio: %.2f\n", hitRatio, faultRatio);
    }
}
