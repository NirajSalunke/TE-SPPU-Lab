import java.util.*;

public class MemoryAllocation {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of memory blocks: ");
        int numBlocks = sc.nextInt();
        int[] blockSize = new int[numBlocks];

        for (int i = 0; i < numBlocks; i++) {
            System.out.print("Enter size of block " + (i + 1) + ": ");
            blockSize[i] = sc.nextInt();
        }

        System.out.print("Enter number of processes: ");
        int numProcesses = sc.nextInt();
        int[] processSize = new int[numProcesses];

        for (int i = 0; i < numProcesses; i++) {
            System.out.print("Enter memory required for process P" + (i + 1) + ": ");
            processSize[i] = sc.nextInt();
        }

        while (true) {
            System.out.println("\n=== Memory Allocation Strategies ===");
            System.out.println("1. First Fit");
            System.out.println("2. Best Fit");
            System.out.println("3. Worst Fit");
            System.out.println("4. Next Fit");
            System.out.println("5. Exit");
            System.out.print("Enter choice: ");
            int choice = sc.nextInt();

            if (choice == 5)
                break;

            // Create fresh copy of blocks for each simulation
            int[] blocks = blockSize.clone();
            int[] allocation = new int[numProcesses];
            Arrays.fill(allocation, -1);

            switch (choice) {
                case 1:
                    firstFit(blocks, processSize, allocation);
                    break;
                case 2:
                    bestFit(blocks, processSize, allocation);
                    break;
                case 3:
                    worstFit(blocks, processSize, allocation);
                    break;
                case 4:
                    nextFit(blocks, processSize, allocation);
                    break;
                default:
                    System.out.println("Invalid choice!");
                    continue;
            }

            displayResults(processSize, blockSize, blocks, allocation);
        }
        sc.close();
    }

    // First Fit: Allocate first block that is large enough
    static void firstFit(int[] blocks, int[] process, int[] allocation) {
        for (int i = 0; i < process.length; i++) {
            for (int j = 0; j < blocks.length; j++) {
                if (blocks[j] >= process[i]) {
                    allocation[i] = j;
                    blocks[j] -= process[i];
                    break;
                }
            }
        }
    }

    static void bestFit(int[] blocks, int[] process, int[] allocation) {
        for (int i = 0; i < process.length; i++) {
            int bestIdx = -1;
            int minSize = Integer.MAX_VALUE;

            for (int j = 0; j < blocks.length; j++) {
                if (blocks[j] >= process[i] && blocks[j] < minSize) {
                    bestIdx = j;
                    minSize = blocks[j];
                }
            }

            if (bestIdx != -1) {
                allocation[i] = bestIdx;
                blocks[bestIdx] -= process[i];
            }
        }
    }

    // Worst Fit: Allocate largest available block
    static void worstFit(int[] blocks, int[] process, int[] allocation) {
        for (int i = 0; i < process.length; i++) {
            int worstIdx = -1;
            int maxSize = -1;

            for (int j = 0; j < blocks.length; j++) {
                if (blocks[j] >= process[i] && blocks[j] > maxSize) {
                    worstIdx = j;
                    maxSize = blocks[j];
                }
            }

            if (worstIdx != -1) {
                allocation[i] = worstIdx;
                blocks[worstIdx] -= process[i];
            }
        }
    }

    static void nextFit(int[] blocks, int[] process, int[] allocation) {
        int j = 0;

        for (int i = 0; i < process.length; i++) {
            int count = 0;

            while (count < blocks.length) {
                if (blocks[j] >= process[i]) {
                    allocation[i] = j;
                    blocks[j] -= process[i];
                    j = (j + 1) % blocks.length;
                    break;
                }
                j = (j + 1) % blocks.length;
                count++;
            }
        }
    }

    // Display allocation results
    static void displayResults(int[] process, int[] originalBlocks,
            int[] remainingBlocks, int[] allocation) {
        System.out.println("\n=== Allocation Results ===");
        System.out.printf("%-10s %-15s %-15s %-15s\n",
                "Process", "Size", "Block No.", "Remaining");
        System.out.println("----------------------------------------------------------");

        for (int i = 0; i < process.length; i++) {
            if (allocation[i] != -1) {
                System.out.printf("P%-9d %-15d %-15d %-15d\n",
                        (i + 1),
                        process[i],
                        (allocation[i] + 1),
                        remainingBlocks[allocation[i]]);
            } else {
                System.out.printf("P%-9d %-15d %-15s %-15s\n",
                        (i + 1),
                        process[i],
                        "Not Allocated",
                        "-");
            }
        }

        System.out.println("\n=== Memory Block Status ===");
        System.out.printf("%-10s %-15s %-15s\n", "Block", "Original", "Remaining");
        System.out.println("------------------------------------------");

        for (int i = 0; i < originalBlocks.length; i++) {
            System.out.printf("%-10d %-15d %-15d\n",
                    (i + 1),
                    originalBlocks[i],
                    remainingBlocks[i]);
        }
    }
}
