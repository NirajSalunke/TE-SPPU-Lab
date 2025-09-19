import java.util.*;

public class LinkStateRouting {

    public static void dijkstra(int[][] graph, int source, int numRouters) {
        int[] dist = new int[numRouters];
        boolean[] visited = new boolean[numRouters];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        for (int count = 0; count < numRouters - 1; count++) {
            int u = minDistance(dist, visited, numRouters);
            visited[u] = true;

            for (int v = 0; v < numRouters; v++) {
                if (!visited[v] && graph[u][v] != Integer.MAX_VALUE && dist[u] != Integer.MAX_VALUE
                        && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                }
            }
        }

        System.out.println("Router " + (source + 1) + " Shortest Path:");
        for (int i = 0; i < numRouters; i++) {
            System.out.println("To Router " + (i + 1) + ": " + (dist[i] == Integer.MAX_VALUE ? "Unreachable" : dist[i]));
        }
        System.out.println();
    }

    public static int minDistance(int[] dist, boolean[] visited, int numRouters) {
        int min = Integer.MAX_VALUE;
        int minIndex = -1;

        for (int v = 0; v < numRouters; v++) {
            if (!visited[v] && dist[v] <= min) {
                min = dist[v];
                minIndex = v;
            }
        }

        return minIndex;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the number of routers: ");
        int numRouters = sc.nextInt();

        int[][] graph = new int[numRouters][numRouters];

        System.out.println("Enter the distance matrix (enter -1 for no direct connection):");
        for (int i = 0; i < numRouters; i++) {
            for (int j = 0; j < numRouters; j++) {
                int distance = sc.nextInt();
                if (distance == -1) {
                    graph[i][j] = Integer.MAX_VALUE;
                } else {
                    graph[i][j] = distance;
                }
            }
        }

        for (int i = 0; i < numRouters; i++) {
            dijkstra(graph, i, numRouters);
        }

        sc.close();
    }
}
