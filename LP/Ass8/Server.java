package Ass8;

import java.io.*;
import java.net.*;

public class Server {
    final static int PORT = 1234;

    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server started and waiting for client...");

            try (Socket socket = serverSocket.accept();
                 DataInputStream in = new DataInputStream(socket.getInputStream());
                 DataOutputStream out = new DataOutputStream(socket.getOutputStream())) {

                System.out.println("Client connected.");

                while (true) {

                    int num1 = in.readInt();
                    int num2 = in.readInt();

                    System.out.println("Received numbers: " + num1 + ", " + num2);

                    int result = add(num1, num2);

                    out.writeInt(result);
                    out.flush();

                    System.out.println("Sent result: " + result);

                    if (num1 == -1 && num2 == -1) {
                        System.out.println("Terminating connection.");
                        break;
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
