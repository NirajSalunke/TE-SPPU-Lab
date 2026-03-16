<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List, ass5.models.Book" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Book List</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 30px; background: #f4f4f4; }
        h2   { color: #333; }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        th {
            background-color: #4CAF50;
            color: white;
            padding: 12px 16px;
            text-align: left;
        }
        td   { padding: 10px 16px; border-bottom: 1px solid #eee; }
        tr:hover td { background-color: #f9f9f9; }
        .badge {
            background: #e0f7e9;
            color: #2e7d32;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.85em;
        }
    </style>
</head>
<body>

<h2> Book List</h2>

<%
    List<Book> listOfBooks = (List<Book>) request.getAttribute("listOfBooks");
%>

<% if (listOfBooks == null || listOfBooks.isEmpty()) { %>
    <p>No books found.</p>
<% } else { %>
    <table>
        <thead>
            <tr>
                <th>#ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            <% for (Book bk : listOfBooks) { %>
            <tr>
                <td><%= bk.getBookId() %></td>
                <td><%= bk.getBookTitle() %></td>
                <td><%= bk.getBookAuthor() %></td>
                <td>₹<%= bk.getBookPrice() %></td>
                <td><span class="badge"><%= bk.getQuantity() %></span></td>
            </tr>
            <% } %>
        </tbody>
    </table>
<% } %>

</body>
</html>
