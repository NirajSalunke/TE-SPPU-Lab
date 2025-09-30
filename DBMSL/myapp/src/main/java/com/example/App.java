package com.example;

import java.util.Scanner;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

public class App {

    public static MongoClient mongoClient;
    public static MongoDatabase db;

    public static void print(String s) {
        System.out.println(s);
    }

    public static boolean checker(int choice, int given) {
        return choice == given;
    }

    public static void createConnection() throws Exception {
        mongoClient = MongoClients.create("mongodb://te31463:te31463@10.10.8.119:27017/te31463_db");
        db = mongoClient.getDatabase("te31463_db");
        System.out.println("Connected to database: " + db.getName());
        try {
            db.createCollection("Employees");
        } catch (Exception ignored) {
        }
        System.out.println("Connected to collection: " + db.getCollection("Employees").toString());
    }

    public static void getData(Scanner sc) {
        MongoCollection<Document> collection = db.getCollection("Employees");

        try (MongoCursor<Document> cursor = collection.find().iterator();) {
            print("------ All Employees ------");
            boolean empty = true;
            while (cursor.hasNext()) {
                Document doc = cursor.next();
                int id = doc.getInteger("id");
                String name = doc.getString("name");
                print("ID: " + id + ", Name: " + name);
                empty = false;
            }
            if (empty) {
                print("No employees found.");
            }
        }
    }

    public static void insertData(Scanner sc) {
        MongoCollection<Document> collection = db.getCollection("Employees");
        print("Enter Employee ID (integer): ");
        int id = sc.nextInt();
        sc.nextLine();
        print("Enter Employee Name: ");
        String name = sc.nextLine();

        Document doc = new Document("id", id).append("name", name);
        collection.insertOne(doc);
        print("Employee inserted successfully.");
    }

    public static void updateData(Scanner sc) {
        MongoCollection<Document> collection = db.getCollection("Employees");
        print("Enter Employee ID to update: ");
        int id = sc.nextInt();
        sc.nextLine();

        print("Enter new Employee Name: ");
        String newName = sc.nextLine();
        
        UpdateResult result = collection.updateOne(Filters.eq("id", id), new Document("$set", new Document("name", newName)));
        if (result.getMatchedCount() > 0) {
            print("Employee updated successfully.");
        } else {
            print("Employee with ID " + id + " not found.");
        }
    }

    public static void deleteData(Scanner sc) {
        MongoCollection<Document> collection = db.getCollection("Employees");
        print("Enter Employee ID to delete: ");
        int id = sc.nextInt();

        DeleteResult result = collection.deleteOne(Filters.eq("id", id));
        if (result.getDeletedCount() > 0) {
            print("Employee deleted successfully.");
        } else {
            print("Employee with ID " + id + " not found.");
        }
    }

    public static void main(String[] args) {
        try {
            createConnection();
        } catch (Exception e) {
            System.out.println("Not able to Connect to Database");
            return;
        }
        try (Scanner sc = new Scanner(System.in)) {
            while (true) {
                print("----------Menu-----------");
                print("1. Get Employee Data");
                print("2. Insert Employee Data");
                print("3. Update Employee Data");
                print("4. Delete Employee Data");
                print("5. Exit");
                int choice = sc.nextInt();
                if (checker(choice, 1)) {
                    getData(sc);
                } else if (checker(choice, 2)) {
                    insertData(sc);
                } else if (checker(choice, 3)) {
                    updateData(sc);
                } else if (checker(choice, 4)) {
                    deleteData(sc);
                } else if (checker(choice, 5)) {
                    mongoClient.close();
                    print("bye");
                    break;
                } else {
                    print("Invalid Option.");
                }
            }
        }
    }
}
