import java.util.*;
import java.util.concurrent.Semaphore;

public class Main {

    enum Status {
        WAITING,
        READING,
        READ_COMPLETE,
        WRITING,
        WRITE_COMPLETE
    }

    static class Database {
        private int readerCount = 0;
        private int data = 0;
        private Semaphore mutex = new Semaphore(1);
        private Semaphore writeLock = new Semaphore(1);

        public void read(int readerId, Reader reader) throws InterruptedException {
            reader.status = Status.WAITING;

            mutex.acquire();
            readerCount++;

            if (readerCount == 1) {
                writeLock.acquire();
            }

            mutex.release();
            reader.status = Status.READING;
            Thread.sleep(3000);
            mutex.acquire();
            readerCount--;

            if (readerCount == 0) {
                writeLock.release();
            }
            mutex.release();

            reader.status = Status.READ_COMPLETE;
        }

        public void write(int writerId, Writer writer, int newData) throws InterruptedException {
            writer.status = Status.WAITING;
            writeLock.acquire();
            writer.status = Status.WRITING;
            data = newData;
            Thread.sleep(3000);
            writeLock.release();
            writer.status = Status.WRITE_COMPLETE;
        }
    }

    static class Reader extends Thread {
        Database db;
        int id;
        volatile Status status = Status.WAITING;

        public Reader(Database db, int id) {
            this.db = db;
            this.id = id;
        }

        @Override
        public void run() {
            try {
                db.read(id, this);
            } catch (InterruptedException e) {
                System.out.println("Error in Reader " + id + ":- " + e.getMessage());
            }
        }
    }

    static class Writer extends Thread {
        Database db;
        int id;
        int newData;
        volatile Status status = Status.WAITING;

        public Writer(Database db, int id, int newData) {
            this.db = db;
            this.id = id;
            this.newData = newData;
        }

        @Override
        public void run() {
            try {
                db.write(id, this, newData);
            } catch (InterruptedException e) {
                System.out.println("Error in Writer " + id + ":- " + e.getMessage());
            }
        }
    }

    public static void main(String[] args) {
        try (Scanner sc = new Scanner(System.in)) {
            System.out.println("Enter sequence (R for Reader, W for Writer):");
            System.out.println("Example: R R R W R W");
            String seq = sc.nextLine().toUpperCase();

            String[] operations = seq.split(" ");

            Database db = new Database();

            List<Reader> readers = new ArrayList<>();
            List<Writer> writers = new ArrayList<>();

            int readerCount = 0;
            int writerCount = 0;

            for (String op : operations) {
                if (op.equals("R")) {
                    readerCount++;
                    Reader r = new Reader(db, readerCount);
                    readers.add(r);
                } else if (op.equals("W")) {
                    writerCount++;
                    Writer w = new Writer(db, writerCount, writerCount * 100);
                    writers.add(w);
                }
            }

            System.out.println("\n--- Starting Readers-Writers Problem ---\n");

            for (Reader r : readers) {
                r.start();
            }
            for (Writer w : writers) {
                w.start();
            }

            try {
                boolean allDone = false;
                while (!allDone) {
                    allDone = true;
                    System.out.println("Readers-Writers status update:");
                    for (Reader r : readers) {
                        System.out.printf("Reader-%d: %s\n", r.id, r.status);
                        if (r.status != Status.READ_COMPLETE) {
                            allDone = false;
                        }
                    }

                    for (Writer w : writers) {
                        System.out.printf("Writer-%d: %s\n", w.id, w.status);
                        if (w.status != Status.WRITE_COMPLETE) {
                            allDone = false;
                        }
                    }

                    System.out.println("-----");
                    Thread.sleep(1000);

                }
            } catch (Exception e) {
            }
            for (Reader r : readers) {
                try {
                    r.join();
                } catch (InterruptedException e) {
                    System.out.println("Error in working Reader " + r.id + " " + e.getMessage());
                }
            }

            for (Writer w : writers) {
                try {
                    w.join();
                } catch (InterruptedException e) {
                    System.out.println("Error in working writer " + w.id + " " + e.getMessage());
                }
            }

        } catch (Exception e) {
            System.out.println("Error:- " + e.getMessage());
        }
    }
}
