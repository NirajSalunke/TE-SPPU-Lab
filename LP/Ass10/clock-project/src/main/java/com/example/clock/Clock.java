package com.example.clock;

import java.net.InetAddress;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.apache.commons.net.ntp.NTPUDPClient;
import org.apache.commons.net.ntp.TimeInfo;

public class Clock {

    private String processName;
    private int lamportTime = 0;
    private static final String[] NTP_SERVERS = {
            "time.google.com",
            "time.windows.com",
            "pool.ntp.org"
    };
    private long ntpOffset = 0;

    public Clock(String processName) {
        this.processName = processName;
    }

    public void syncWithNtp() {
        System.out.println(processName + ": Starting NTP synchronization...");

        for (String server : NTP_SERVERS) {
            try {
                System.out.println("Querying NTP server: " + server);
                NTPUDPClient client = new NTPUDPClient();
                client.setDefaultTimeout(5000);
                InetAddress hostAddr = InetAddress.getByName(server);

                TimeInfo info = client.getTime(hostAddr);
                info.computeDetails();
                Long offset = info.getOffset();
                if (offset != null) {
                    ntpOffset = offset;
                    System.out.println("Server: " + server + " reports offset: " + offset + " ms");
                    break;
                }
                client.close();
            } catch (Exception e) {
                System.out.println("Failed to query server " + server + ". Trying next...");
            }
        }

        if (ntpOffset == 0) {
            System.out.println("Failed to get NTP offset from all servers. Using local system time.");
        } else {
            System.out.println(processName + ": NTP synchronization successful! Offset = " + ntpOffset + " ms");
        }
    }

    public long getCurrentTimeMillis() {
        long adjustedTime = System.currentTimeMillis() + ntpOffset;
        System.out.println(processName + ": Adjusted current time: " + adjustedTime + " ms");
        return adjustedTime;
    }


    public synchronized void tick() {
        lamportTime++;
        System.out.println(processName + " local event -> Lamport time: " + lamportTime);
    }

    public void displayCurrentTime() {
        long adjustedTimeMillis = System.currentTimeMillis() + ntpOffset;
        Instant instant = Instant.ofEpochMilli(adjustedTimeMillis);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                .withZone(ZoneId.systemDefault());

        String formattedTime = formatter.format(instant);
        System.out.println(processName + ": Adjusted current time: " + formattedTime + " (local timezone)");
    }

    public synchronized void update(int receivedTime, String sender) {
        lamportTime = Math.max(lamportTime, receivedTime) + 1;
        System.out.println(processName + " received message from " + sender + " with timestamp " +
                receivedTime + " -> updated Lamport time: " + lamportTime);
    }

    public synchronized int getLamportTime() {
        return lamportTime;
    }
}
