package Ass8;

import java.io.*;
import java.net.*;
import java.util.Scanner;

public class Client {
    final static int PORT = 1234;

    public static void main(String[] args) {
        try (Socket socket = new Socket("localhost", PORT);
             DataInputStream in = new DataInputStream(socket.getInputStream());
             DataOutputStream out = new DataOutputStream(socket.getOutputStream());
             Scanner scanner = new Scanner(System.in)) {

            System.out.println("Connected to server.");

            while (true) {
                System.out.print("Enter first integer (-1 to exit): ");
                int num1 = scanner.nextInt();
                System.out.print("Enter second integer (-1 to exit): ");
                int num2 = scanner.nextInt();

                out.writeInt(num1);
                out.writeInt(num2);
                out.flush();

                if (num1 == -1 && num2 == -1) {
                    System.out.println("Exiting.");
                    break;
                }
                
                int result = in.readInt();
                System.out.println("Result from server: " + result);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
