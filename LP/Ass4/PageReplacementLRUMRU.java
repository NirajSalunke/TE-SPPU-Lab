package Ass4;

import java.util.*;

public class PageReplacementLRUMRU {

    enum Strategy {
        LRU,
        MRU,
        FIFO
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
            System.out.println("3. FIFO");
            System.out.println("4. Exit");
            System.out.print("Enter choice [1-4]: ");
            int choice = sc.nextInt();
            if (choice == 4) break;

            Strategy strat;
            switch (choice) {
                case 1: strat = Strategy.LRU; break;
                case 2: strat = Strategy.MRU; break;
                case 3: strat = Strategy.FIFO; break;
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
        Queue<Integer> fifoQueue = new LinkedList<>();
        Map<Integer, Integer> frequency = new HashMap<>(); // track frequency of each page

        int pageFaults = 0, hits = 0;

        System.out.println("\n--- " + strat.toString() + " Page Replacement Simulation ---\n");
        System.out.printf("%-10s %-25s %-30s %-20s %-12s\n",
                "Reference", "Frames", "Frequencies", "Action", "Status");

        for (int page : referenceString) {
            frequency.put(page, frequency.getOrDefault(page, 0) + 1); // update frequency

            if (frameList.contains(page)) {
                hits++;
                String action = "Page HIT";

                if (strat == Strategy.LRU || strat == Strategy.MRU) {
                    // Move page to end (most recent) for recency tracking
                    frameList.remove((Integer) page);
                    frameList.add(page);
                }
                // FIFO does not update order on hit

                System.out.printf("%-10d %-25s %-30s %-20s %-12s\n",
                        page, frameList, getFrameFrequencies(frameList, frequency), action, "HIT");

            } else {
                pageFaults++;
                String action;

                if (frameList.size() < frames) {
                    frameList.add(page);
                    fifoQueue.add(page);
                    action = "Added " + page + " (empty slot)";
                } else {
                    int victim;
                    if (strat == Strategy.LRU) {
                        victim = frameList.get(0); // least recently used
                        frameList.remove(0);
                        frameList.add(page);
                        action = "Replaced (LRU) " + victim + " with " + page;
                    } else if (strat == Strategy.MRU) {
                        victim = frameList.get(frameList.size() - 1); // most recently used
                        frameList.remove(frameList.size() - 1);
                        frameList.add(page);
                        action = "Replaced (MRU) " + victim + " with " + page;
                    } else { // FIFO
                        victim = fifoQueue.poll();
                        frameList.remove((Integer) victim);
                        frameList.add(page);
                        fifoQueue.add(page);
                        action = "Replaced (FIFO) " + victim + " with " + page;
                    }
                }

                System.out.printf("%-10d %-25s %-30s %-20s %-12s\n",
                        page, frameList, getFrameFrequencies(frameList, frequency), action, "FAULT");
            }
        }

        System.out.println("\n--- Summary ---");
        System.out.println("Total Page Faults: " + pageFaults);
        System.out.println("Total Hits: " + hits);
        double hitRatio = (double) hits / referenceString.length;
        double faultRatio = (double) pageFaults / referenceString.length;
        System.out.printf("Hit Ratio: %.2f | Fault Ratio: %.2f\n", hitRatio, faultRatio);
    }

    // Helper to print frequencies of only the pages in current frames
    private static String getFrameFrequencies(List<Integer> frameList, Map<Integer, Integer> frequency) {
        Map<Integer, Integer> freqInFrame = new LinkedHashMap<>();
        for (int f : frameList) {
            freqInFrame.put(f, frequency.getOrDefault(f, 0));
        }
        return freqInFrame.toString();
    }
}

/*
Sample Input:
--------------
Enter number of frames: 3
Enter length of reference string: 10
Enter reference string (space separated):
1 2 3 2 4 1 5 2 4 3

Sample Output (snippet):
Reference  Frames                    Frequencies                    Action               Status
1          [1]                       {1=1}                          Added 1 (empty slot) FAULT
2          [1, 2]                    {1=1, 2=1}                     Added 2 (empty slot) FAULT
3          [1, 2, 3]                 {1=1, 2=1, 3=1}                Added 3 (empty slot) FAULT
2          [1, 3, 2]                 {1=1, 3=1, 2=2}                Page HIT             HIT
4          [3, 2, 4]                 {3=1, 2=2, 4=1}                Replaced (LRU) 1...  FAULT
*/
