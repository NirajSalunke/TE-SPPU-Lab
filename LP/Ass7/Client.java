import java.io.*;
import java.net.*;
import java.util.Scanner;

public class Client {
    final static int SERVER_PORT = 1234;

    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        InetAddress ip = InetAddress.getByName("localhost");
        Socket socket = new Socket(ip, SERVER_PORT);

        DataInputStream in = new DataInputStream(socket.getInputStream());
        DataOutputStream out = new DataOutputStream(socket.getOutputStream());

        Thread sendMsg = new Thread(() -> {
            while (true) {
                String msg = scanner.nextLine();
                try {
                    out.writeUTF(msg);
                    if (msg.equalsIgnoreCase("exit"))
                        break;
                } catch (IOException e) {
                    break;
                }
            }
        });

        Thread receiveMsg = new Thread(() -> {
            while (true) {
                try {
                    String msg = in.readUTF();
                    System.out.println("Server: " + msg);
                    if (msg.equalsIgnoreCase("exit"))
                        break;
                } catch (IOException e) {
                    break;
                }
            }
        });

        sendMsg.start();
        receiveMsg.start();

        try {
            sendMsg.join();
            receiveMsg.join();
        } catch (InterruptedException e) {
        }

        scanner.close();
        socket.close();
        in.close();
        out.close();
    }
}
