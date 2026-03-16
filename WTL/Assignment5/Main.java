package ass5;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.sql.*;
import ass5.models.*;

@WebServlet("/books")
public class Main extends HttpServlet {
	
	Connection conn;
	String url = "jdbc:mysql://10.10.8.119:3306/te31463_db";
    String username = "te31463";
    String password = "te31463";
    
    
    public void setConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException e) {
            System.out.println("Driver not found: " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }	
    }
    	
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
    	setConnection();
    	List<Book> listOfBooks = new ArrayList<>();
    	
    	
    	try {	
    		
    		Statement s = conn.createStatement();
    		ResultSet rs = s.executeQuery("SELECT * FROM books");
    		
    		while(rs.next()) {
    			Book curr 	= new Book(rs.getInt("bookId"),
                        rs.getString("bookTitle"),
                        rs.getString("bookAuthor"),
                        rs.getDouble("bookPrice"),
                        rs.getInt("quantity"));
    			
    			listOfBooks.add(curr);	
        	}
    	} catch(SQLException e) {
    		System.out.println("SQL queery failed");
    		System.out.println(e.getMessage());
    	}
    	
    	request.setAttribute("listOfBooks", listOfBooks);
    	RequestDispatcher rd = request.getRequestDispatcher("index.jsp");
    	rd.forward(request, response);

    }
}
