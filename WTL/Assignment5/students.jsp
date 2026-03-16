<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Students List</title>
    <style>
        body  { font-family: Arial, sans-serif; padding: 30px; background: #f4f4f4; }
        h2    { color: #333; }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th { background-color: #2196F3; color: white; padding: 12px 16px; text-align: left; }
        td { padding: 10px 16px; border-bottom: 1px solid #eee; }
        tr:hover td { background-color: #f0f8ff; }
        .error { color: red; font-weight: bold; }
    </style>
</head>
<body>

<h2>🎓 Students List</h2>

<%
    String url      = "jdbc:mysql://10.10.8.119:3306/te31463_db";
    String username = "te31463";
    String password = "te31463";

    Connection conn = null;
    Statement  stmt = null;
    ResultSet  rs   = null;

    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        conn = DriverManager.getConnection(url, username, password);
        stmt = conn.createStatement();
        rs   = stmt.executeQuery("SELECT * FROM students");
%>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Marks</th>
            </tr>
        </thead>
        <tbody>
            <% while (rs.next()) { %>
            <tr>
                <td><%= rs.getInt("id") %></td>
                <td><%= rs.getString("name") %></td>
                <td><%= rs.getString("email") %></td>
                <td><%= rs.getString("department") %></td>
                <td><%= rs.getInt("marks") %></td>
            </tr>
            <% } %>
        </tbody>
    </table>

<%
    } catch (ClassNotFoundException e) {
        out.println("<p class='error'>Driver Error: " + e.getMessage() + "</p>");
    } catch (SQLException e) {
        out.println("<p class='error'>SQL Error: " + e.getMessage() + "</p>");
    } finally {
        if (rs   != null) try { rs.close();   } catch (SQLException e) {}
        if (stmt != null) try { stmt.close(); } catch (SQLException e) {}
        if (conn != null) try { conn.close(); } catch (SQLException e) {}
    }
%>

</body>
</html>
