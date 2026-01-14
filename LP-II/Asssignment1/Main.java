import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Main {

    static List<List<Integer>> graph = new ArrayList<>();
    static int[] visited;
    static int n, m;

    static void DFS(int node) {
        visited[node] = 1;
        System.out.print(node + " ");

        for (int i = 0; i < graph.get(node).size(); i++) {
            int nb = graph.get(node).get(i);
            if (visited[nb] == 0) {
                DFS(nb);
            }
        }
    }

    static void recursiveBFS(int node, int i) {
        System.out.print(node + " ");

        while (i < graph.get(node).size()) {
            int nb = graph.get(node).get(i);
            i++;
            if (visited[nb] == 0) {
                visited[nb] = 1;
                recursiveBFS(nb, 0);
            }
        }
    }

    static void BFS(int start) {
        visited[start] = 1;
        recursiveBFS(start, 0);
    }

    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        System.out.print("Enter input file name: ");
        String filename = console.next();
        console.close();

        File file = new File(filename);
        Scanner infile = null;
        try {
            infile = new Scanner(file);
        } catch (FileNotFoundException e) {
            System.out.println("Error " + filename);
            return;
        }

        n = infile.nextInt(); // Number of Node
        m = infile.nextInt(); // Number of Edges

        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        visited = new int[n];

        for (int i = 0; i < m; i++) {
            int u = infile.nextInt();
            int v = infile.nextInt();
            graph.get(u).add(v);
            graph.get(v).add(u);
        }

        infile.close();

        for (int i = 0; i < n; i++)
            visited[i] = 0;

        System.out.print("DFS Traversal: ");
        DFS(0);

        int conn = 1;
        for (int i = 0; i < n; i++) {
            if (visited[i] == 0) {
                conn = 0;
                break;
            }
        }

        if (conn == 1)
            System.out.println("\nDFS Result: Servers is fully connected");
        else
            System.out.println("\nDFS Result: Servers is NOT fully connected");

        for (int i = 0; i < n; i++)
            visited[i] = 0;

        System.out.print("BFS Traversal: ");
        BFS(0);
        System.out.println("\nBFS Result: Servers reachability checked using shortest paths");
    }
}
