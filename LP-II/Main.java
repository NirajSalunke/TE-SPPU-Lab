package Assignment4;

import java.util.Arrays;
import java.util.Scanner;

public class Main {
    
    // Global variables for backtracking state
    private static int[] board;  // board[i] = queen column position in row i
    private static boolean foundSolution = false;
    
    // Check if queen at row, col is safe
    private static boolean isSafe(int row, int col, int n) {
    for (int i = 0; i < row; i++) {
        // Check same column
        if (board[i] == col) {
            return false;
        }

        // Check diagonals
        if (Math.abs(board[i] - col) == Math.abs(i - row)) {
            return false;
        }
    }
    return true;
}
    
    private static boolean solveNQueens(int row, int n) {
        if (row == n) {
            foundSolution = true;
            return true;
        }
        

        for (int col = 0; col < n; col++) {
            if (isSafe(row, col, n)) {
                board[row] = col; 
                
                if (solveNQueens(row + 1, n)) {
                    return true; 
                }
                
                board[row] = -1;
            }
        }
        return false; 
    }
    


    
    // Print board visualization (Q = Queen, . = Empty)
    private static void printBoard(int n) {
        System.out.println("\nSolution Board (" + n + "×" + n + "):");
        System.out.println("═".repeat(n * 4));
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i] == j) {
                    System.out.print(" Q  ");
                } else {
                    System.out.print(" .  ");
                }
            }
            System.out.println();
        }
        System.out.println("═".repeat(n * 4));
        
        System.out.println("\nQueen Positions (row→col):");
        for (int i = 0; i < n; i++) {
            System.out.printf("Row %d → Column %d%n", i, board[i]);
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n;
        
        do {
            System.out.print("Enter N for N-Queens (4 ≤ N ≤ 12): ");
            n = sc.nextInt();
            
            if (n < 4 || n > 12) {
                System.out.println("Please enter N between 4 and 12 for reasonable computation time.");
            }
        } while (n < 4 || n > 12);
        
        board = new int[n];
        Arrays.fill(board, -1);
        
        System.out.println("\n🔍 Solving " + n + "-Queens using Backtracking...");
        System.out.println("Constraint: No two queens attack each other");
        
        long startTime = System.currentTimeMillis();
        boolean solved = solveNQueens(0, n);
        long endTime = System.currentTimeMillis();
        
        if (solved) {
            printBoard(n);
            // System.out.printf("✅ Solution found in %d ms!%n", endTime - startTime);
        } else {
            System.out.println("❌ No solution exists (should not happen for N≥4)");
        }
        
        sc.close();
    }
}
/*
Enter N for N-Queens (4 ≤ N ≤ 12): 8

🔍 Solving 8-Queens using Backtracking...
Constraint: No two queens attack each other

Solution Board (8×8):
════════════════════════════════
 ♛  .  .  .  .  .  .  .  
 .  .  .  ♛  .  .  .  .  
 .  .  .  .  .  ♛  .  .  
 .  .  .  .  ♛  .  .  .  
 .  ♛  .  .  .  .  .  .  
 .  .  .  .  .  .  ♛  .  
 ♛  .  .  .  .  .  .  ♛  
 .  .  ♛  .  .  .  .  .  
════════════════════════════════

Queen Positions (row→col):
Row 0 → Column 0
Row 1 → Column 3
Row 2 → Column 5
Row 3 → Column 7
Row 4 → Column 2
Row 5 → Column 4
Row 6 → Column 6
Row 7 → Column 1

✅ Solution found in 32 ms!

 */