package com.example;

import java.sql.*;
import java.util.Scanner;

public class App {
    private static final String URL = "jdbc:mysql://localhost:3306/testdb";
    private static final String USER = "javauser";
    private static final String PASS = "Password@123";

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean running = true;

        while (running) {
            System.out.println("\n--- MENU ---");
            System.out.println("1. SELECT (show all employees)");
            System.out.println("2. INSERT (add employee)");
            System.out.println("3. UPDATE (update employee)");
            System.out.println("4. DELETE (delete employee)");
            System.out.println("0. EXIT");
            System.out.print("Choose: ");
            int choice = -1;
            try {
                choice = Integer.parseInt(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input, try again.");
                continue;
            }

            switch (choice) {
                case 1:
                    doSelect();
                    break;
                case 2:
                    doInsert(sc);
                    break;
                case 3:
                    doUpdate(sc);
                    break;
                case 4:
                    doDelete(sc);
                    break;
                case 0:
                    System.out.println("Exiting...bye!");
                    running = false;
                    break;
                default:
                    System.out.println("Unknown choice.");
            }
        }

        sc.close();
    }

    private static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }

    private static void doSelect() {
        String sql = "SELECT id, name, department, salary FROM employees";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            System.out.println("\nID | NAME | DEPT | SALARY");
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String dept = rs.getString("department");
                double sal = rs.getDouble("salary");
                System.out.printf("%d | %s | %s | %.2f%n", id, name, dept, sal);
            }
        } catch (SQLException e) {
            System.err.println("Error in SELECT: " + e.getMessage());
        }
    }

    private static void doInsert(Scanner sc) {
        System.out.print("Enter name: ");
        String name = sc.nextLine().trim();
        System.out.print("Enter department: ");
        String dept = sc.nextLine().trim();
        System.out.print("Enter salary: ");
        double salary;
        try {
            salary = Double.parseDouble(sc.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Invalid salary. Insert canceled.");
            return;
        }

        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, name);
            ps.setString(2, dept);
            ps.setDouble(3, salary);

            int rows = ps.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        System.out.println("Inserted with id = " + keys.getInt(1));
                    }
                }
            } else {
                System.out.println("Insert failed.");
            }
        } catch (SQLException e) {
            System.err.println("Error in INSERT: " + e.getMessage());
        }
    }

    private static void doUpdate(Scanner sc) {
        System.out.print("Enter employee id to update: ");
        int id;
        try {
            id = Integer.parseInt(sc.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Invalid id. Update canceled.");
            return;
        }

        System.out.print("New name (leave blank to skip): ");
        String newName = sc.nextLine().trim();
        System.out.print("New department (leave blank to skip): ");
        String newDept = sc.nextLine().trim();
        System.out.print("New salary (leave blank to skip): ");
        String salaryInput = sc.nextLine().trim();

        // Build dynamic update (simple)
        StringBuilder sb = new StringBuilder("UPDATE employees SET ");
        boolean first = true;
        if (!newName.isEmpty()) {
            sb.append("name = ?");
            first = false;
        }
        if (!newDept.isEmpty()) {
            if (!first) sb.append(", ");
            sb.append("department = ?");
            first = false;
        }
        Double newSalary = null;
        if (!salaryInput.isEmpty()) {
            try {
                newSalary = Double.parseDouble(salaryInput);
            } catch (NumberFormatException e) {
                System.out.println("Invalid salary. Update canceled.");
                return;
            }
            if (!first) sb.append(", ");
            sb.append("salary = ?");
            first = false;
        }

        if (first) {
            // nothing changed
            System.out.println("Nothing to update.");
            return;
        }

        sb.append(" WHERE id = ?");

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sb.toString())) {

            int idx = 1;
            if (!newName.isEmpty()) {
                ps.setString(idx++, newName);
            }
            if (!newDept.isEmpty()) {
                ps.setString(idx++, newDept);
            }
            if (newSalary != null) {
                ps.setDouble(idx++, newSalary);
            }
            ps.setInt(idx, id);

            int rows = ps.executeUpdate();
            System.out.println(rows + " row(s) updated.");
        } catch (SQLException e) {
            System.err.println("Error in UPDATE: " + e.getMessage());
        }
    }

    private static void doDelete(Scanner sc) {
        System.out.print("Enter employee id to delete: ");
        int id;
        try {
            id = Integer.parseInt(sc.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Invalid id. Delete canceled.");
            return;
        }

        String sql = "DELETE FROM employees WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            System.out.println(rows + " row(s) deleted.");
        } catch (SQLException e) {
            System.err.println("Error in DELETE: " + e.getMessage());
        }
    }
}
