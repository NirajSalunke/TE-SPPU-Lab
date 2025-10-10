import java.io.*;
import java.net.*;

public class Server {
    final static int PORT = 1234;

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(PORT);
        System.out.println("Server started...");
        Socket clientSocket = serverSocket.accept();
        System.out.println("Client connected.");

        DataInputStream in = new DataInputStream(clientSocket.getInputStream());
        DataOutputStream out = new DataOutputStream(clientSocket.getOutputStream());
        BufferedReader consoleInput = new BufferedReader(new InputStreamReader(System.in));

        Thread receiveMsg = new Thread(() -> {
            while (true) {
                try {
                    String msgReceived = in.readUTF();
                    System.out.println("Client: " + msgReceived);
                    if (msgReceived.equalsIgnoreCase("exit")) {
                        System.out.println("Client disconnected.");
                        break;
                    }
                } catch (IOException e) {
                    break;
                }
            }
        });

        Thread sendMsg = new Thread(() -> {
            while (true) {
                try {
                    String msgToSend = consoleInput.readLine();
                    out.writeUTF(msgToSend);
                    out.flush();
                    if (msgToSend.equalsIgnoreCase("exit")) {
                        System.out.println("Server terminated chat.");
                        break;
                    }
                } catch (IOException e) {
                    break;
                }
            }
        });

        receiveMsg.start();
        sendMsg.start();

        try {
            receiveMsg.join();
            sendMsg.join();
        } catch (InterruptedException e) {
        }

        in.close();
        out.close();
        clientSocket.close();
        serverSocket.close();
        consoleInput.close();
    }
}
