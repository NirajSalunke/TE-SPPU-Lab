import java.util.Arrays;
import java.util.Scanner;

public class Main {

    // ============================================================
    //  I. SELECTION SORT
    // ============================================================
    static void selectionSort(int[] arr) {
        int n = arr.length;
        System.out.println("\n--- Selection Sort Steps ---");
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx])
                    minIdx = j;
            }
            // Swap minimum element with first unsorted element
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
            System.out.println("Pass " + (i + 1) + ": " + Arrays.toString(arr));
        }
    }

    // ============================================================
    //  II. MINIMUM SPANNING TREE — Prim's Algorithm
    // ============================================================
    static int minKey(int[] key, boolean[] mstSet, int V) {
        int min = Integer.MAX_VALUE, minIdx = -1;
        for (int v = 0; v < V; v++) {
            if (!mstSet[v] && key[v] < min) {
                min = key[v];
                minIdx = v;
            }
        }
        return minIdx;
    }

    static void primMST(int[][] graph, int V) {
        int[] parent = new int[V];
        int[] key    = new int[V];
        boolean[] mstSet = new boolean[V];

        Arrays.fill(key, Integer.MAX_VALUE);
        key[0]    = 0;
        parent[0] = -1; // root has no parent

        for (int count = 0; count < V - 1; count++) {
            int u = minKey(key, mstSet, V);
            mstSet[u] = true;
            for (int v = 0; v < V; v++) {
                if (graph[u][v] != 0 && !mstSet[v] && graph[u][v] < key[v]) {
                    parent[v] = u;
                    key[v]    = graph[u][v];
                }
            }
        }

        System.out.println("\nEdge       Weight");
        System.out.println("------------------");
        int totalWeight = 0;
        for (int i = 1; i < V; i++) {
            System.out.printf(" %d  -  %d     %d%n", parent[i], i, graph[i][parent[i]]);
            totalWeight += graph[i][parent[i]];
        }
        System.out.println("------------------");
        System.out.println("Total MST Weight: " + totalWeight);
    }

    // ============================================================
    //  III. SINGLE-SOURCE SHORTEST PATH — Dijkstra's Algorithm
    // ============================================================
    static int minDist(int[] dist, boolean[] visited, int V) {
        int min = Integer.MAX_VALUE, minIdx = -1;
        for (int v = 0; v < V; v++) {
            if (!visited[v] && dist[v] <= min) {
                min    = dist[v];
                minIdx = v;
            }
        }
        return minIdx;
    }

    static void printPath(int[] prev, int v) {
        if (prev[v] == -1) { System.out.print(v); return; }
        printPath(prev, prev[v]);
        System.out.print(" -> " + v);
    }

    static void dijkstra(int[][] graph, int src, int V) {
        int[]     dist    = new int[V];
        boolean[] visited = new boolean[V];
        int[]     prev    = new int[V];

        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(prev, -1);
        dist[src] = 0;

        for (int count = 0; count < V - 1; count++) {
            int u = minDist(dist, visited, V);
            visited[u] = true;
            for (int v = 0; v < V; v++) {
                if (!visited[v] && graph[u][v] != 0
                        && dist[u] != Integer.MAX_VALUE
                        && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                    prev[v] = u;
                }
            }
        }

        System.out.printf("%n%-8s %-15s %s%n", "Vertex", "Distance(src=" + src + ")", "Path");
        System.out.println("-------------------------------------------");
        for (int i = 0; i < V; i++) {
            System.out.printf("%-8d %-15d ", i, dist[i]);
            printPath(prev, i);
            System.out.println();
        }
    }

    // ============================================================
    //  MENU-DRIVEN MAIN
    // ============================================================
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice;

        do {
            System.out.println("\n╔══════════════════════════════════════╗");
            System.out.println("║      GREEDY ALGORITHMS — MENU        ║");
            System.out.println("╠══════════════════════════════════════╣");
            System.out.println("║  1. Selection Sort                   ║");
            System.out.println("║  2. Minimum Spanning Tree (Prim's)   ║");
            System.out.println("║  3. Single-Source Shortest Path      ║");
            System.out.println("║     (Dijkstra's Algorithm)           ║");
            System.out.println("║  0. Exit                             ║");
            System.out.println("╚══════════════════════════════════════╝");
            System.out.print("Enter your choice: ");
            choice = sc.nextInt();

            switch (choice) {

                case 1: {
                    System.out.print("Enter number of elements: ");
                    int n = sc.nextInt();
                    int[] arr = new int[n];
                    System.out.print("Enter elements: ");
                    for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

                    System.out.println("Before Sort: " + Arrays.toString(arr));
                    selectionSort(arr);
                    System.out.println("After Sort:  " + Arrays.toString(arr));
                    break;
                }

                case 2: {
                    System.out.print("Enter number of vertices: ");
                    int V = sc.nextInt();
                    int[][] graph = new int[V][V];
                    System.out.println("Enter " + V + "x" + V + " adjacency matrix:");
                    for (int i = 0; i < V; i++)
                        for (int j = 0; j < V; j++)
                            graph[i][j] = sc.nextInt();

                    System.out.println("\nPrim's Minimum Spanning Tree:");
                    primMST(graph, V);
                    break;
                }

                case 3: {
                    System.out.print("Enter number of vertices: ");
                    int V = sc.nextInt();
                    int[][] graph = new int[V][V];
                    System.out.println("Enter " + V + "x" + V + " adjacency matrix:");
                    for (int i = 0; i < V; i++)
                        for (int j = 0; j < V; j++)
                            graph[i][j] = sc.nextInt();

                    System.out.print("Enter source vertex (0 to " + (V - 1) + "): ");
                    int src = sc.nextInt();

                    System.out.println("\nDijkstra's Single-Source Shortest Paths:");
                    dijkstra(graph, src, V);
                    break;
                }

                case 0:
                    System.out.println("Exiting program. Goodbye!");
                    break;

                default:
                    System.out.println("Invalid choice! Please enter 0–3.");
            }

        } while (choice != 0);

        sc.close();
    }
}
/*
Option 1 — Selection Sort
Enter number of elements: 5
Enter elements: 64 25 12 22 11

Option 2 — Prim's MST
Enter number of vertices: 5
Enter adjacency matrix (5x5):
0 2 0 6 0
2 0 3 8 5
0 3 0 0 7
6 8 0 0 9
0 5 7 9 0

Option 3 — Dijkstra's SSSP

Enter number of vertices: 5
Enter adjacency matrix (5x5):
0 10 0 0 5
0  0 1 0 2
0  0 0 4 0
7  0 6 0 0
0  3 9 2 0
Enter source vertex: 0
*/
