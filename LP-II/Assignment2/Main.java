import java.util.*;

public class Main {
    
    static class Node implements Comparable<Node> {
        int[][] board;
        Node parent;
        int g; // cost from start
        int h; // Manhattan dist
        int zeroRow, zeroCol; // position of zero tile
        
        public Node(int[][] board, Node parent, int g) {
            this.board = new int[3][3];
            for (int i = 0; i < 3; i++) {
                this.board[i] = board[i].clone();
            }
            this.parent = parent;
            this.g = g;
            this.h = calculateManhattan();
            findZero();
        }
        
        private void findZero() {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] == 0) {
                        zeroRow = i;
                        zeroCol = j;
                        return;
                    }
                }
            }
        }
        
       
        private int calculateManhattan() {
            int distance = 0;
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    int value = board[i][j];
                    if (value != 0) {
                        int targetRow = (value - 1) / 3;
                        int targetCol = (value - 1) % 3;
                        distance += Math.abs(i - targetRow) + Math.abs(j - targetCol);
                    }
                }
            }
            return distance;
        }
        
    
        public int getF() {
            return g + h;
        }
        
        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.getF(), other.getF());
        }
        
        public String boardToString() {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    sb.append(board[i][j]);
                }
            }
            return sb.toString();
        }
        
       
        public boolean isGoal() {
            int[][] goal = {{1, 2, 3}, {4, 5, 6}, {7, 8, 0}};
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] != goal[i][j]) return false;
                }
            }
            return true;
        }
        

        public void printBoard() {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] == 0) {
                        System.out.print("  ");
                    } else {
                        System.out.print(board[i][j] + " ");
                    }
                }
                System.out.println();
            }
            System.out.println();
        }
    }
    

    public static List<Node> getNeighbors(Node node) {
        List<Node> neighbors = new ArrayList<>();
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}; // up, down, left, right
        
        for (int[] dir : directions) {
            int newRow = node.zeroRow + dir[0];
            int newCol = node.zeroCol + dir[1];
            
            // Check if move is valid
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                int[][] newBoard = new int[3][3];
                for (int i = 0; i < 3; i++) {
                    newBoard[i] = node.board[i].clone();
                }
                
                // Swap empty tile with adjacent tile
                newBoard[node.zeroRow][node.zeroCol] = newBoard[newRow][newCol];
                newBoard[newRow][newCol] = 0;
                
                neighbors.add(new Node(newBoard, node, node.g + 1));
            }
        }
        return neighbors;
    }
    

    public static Node solve(int[][] initial) {
        PriorityQueue<Node> openList = new PriorityQueue<>();
        Set<String> closedList = new HashSet<>();
        
        Node startNode = new Node(initial, null, 0);
        openList.add(startNode);
        
        int nodesExplored = 0;
        
        while (!openList.isEmpty()) {
            Node current = openList.poll();
            nodesExplored++;
            
            // Check if goal reached
            if (current.isGoal()) {
                System.out.println("Solution found! Nodes explored: " + nodesExplored);
                return current;
            }
            
            closedList.add(current.boardToString());
            
            // Generate and process neighbors
            for (Node neighbor : getNeighbors(current)) {
                String neighborKey = neighbor.boardToString();
                if (!closedList.contains(neighborKey)) {
                    openList.add(neighbor);
                }
            }
        }
        
        return null; // No solution found
    }
    

    public static void printSolution(Node goalNode) {
        List<Node> path = new ArrayList<>();
        Node current = goalNode;
        
        while (current != null) {
            path.add(current);
            current = current.parent;
        }
        
        Collections.reverse(path);
        
        System.out.println("Solution in " + (path.size() - 1) + " moves:");
        System.out.println("=====================================");
        
        for (int i = 0; i < path.size(); i++) {
            System.out.println("Step " + i + ":");
            path.get(i).printBoard();
        }
    }
    
    public static void main(String[] args) {
        int[][] initial = {
            {8, 7, 1},
            {2, 5, 4},
            {3, 0, 6}
        };
        
        System.out.println("8-Puzzle Solver using A* Algorithm");
        System.out.println("=====================================\n");
        System.out.println("Initial State:");
        new Node(initial, null, 0).printBoard();
        
        
        long startTime = System.currentTimeMillis();
        Node solution = solve(initial);
        long endTime = System.currentTimeMillis();
        
        if (solution != null) {
            printSolution(solution);
            System.out.println("Time taken: " + (endTime - startTime) + " ms");
        } else {
            System.out.println("No solution exists!");
        }
    }
}
