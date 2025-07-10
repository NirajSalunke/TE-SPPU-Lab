package LP.Ass1;

import java.util.ArrayList;
import java.util.Scanner;

class Main {

    enum WorkerStatus {
        WAITING,
        WORKING,
        DONE
    }

    static class Mutex {
        private boolean locked = false;

        public synchronized void lock() throws InterruptedException {
            while (locked) {
                wait();
            }
            locked = true;
        }

        public synchronized void unlock() {
            locked = false;
            notify();
        }
    }

    static class Semaphore {
        private int permits;

        public Semaphore(int permits) {
            this.permits = permits;
        }

        public synchronized void acquire() throws InterruptedException {
            while (permits == 0) {
                wait();
            }
            permits--;
        }

        public synchronized void release() {
            permits++;
            notify();
        }
    }

    static class WorkerUsingMutex extends Thread {
        private static final Mutex lock = new Mutex();
        private volatile WorkerStatus status = WorkerStatus.WAITING;

        public WorkerUsingMutex(String name) {
            super(name);
        }

        public WorkerStatus getStatus() {
            return status;
        }

        private void performWork() throws InterruptedException {
            status = WorkerStatus.WORKING;
            for (int i = 0; i < 3; i++) {
                Thread.sleep(1000);
            }
            status = WorkerStatus.DONE;
        }

        public void run() {
            try {
                status = WorkerStatus.WAITING;
                lock.lock();
                try {
                    performWork();
                } finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                System.out.println(getName() + " interrupted");
            }
        }
    }

    static class WorkerUsingSema extends Thread {
        private static final Semaphore lock = new Semaphore(3);
        private volatile WorkerStatus status = WorkerStatus.WAITING;

        public WorkerUsingSema(String name) {
            super(name);
        }

        public WorkerStatus getStatus() {
            return status;
        }

        private void performWork() throws InterruptedException {
            status = WorkerStatus.WORKING;
            for (int i = 0; i < 3; i++) {
                Thread.sleep(1000);
            }
            status = WorkerStatus.DONE;
        }

        public void run() {
            try {
                status = WorkerStatus.WAITING;
                lock.acquire();
                try {
                    performWork();
                } finally {
                    lock.release();
                }
            } catch (InterruptedException e) {
                System.out.println(getName() + " interrupted");
            }
        }
    }

    public static void monitorStatus(ArrayList<WorkerUsingMutex> workers) throws InterruptedException {
        boolean allDone = false;
        while (!allDone) {
            allDone = true;
            System.out.println("Mutex Workers status update:");
            for (WorkerUsingMutex worker : workers) {
                WorkerStatus s = worker.getStatus();
                System.out.printf("%s: %s\n", worker.getName(), s);
                if (s != WorkerStatus.DONE) {
                    allDone = false;
                }
            }
            System.out.println("-----");
            Thread.sleep(1000);
        }
    }

    public static void monitorStatusSema(ArrayList<WorkerUsingSema> workers) throws InterruptedException {
        boolean allDone = false;
        while (!allDone) {
            allDone = true;
            System.out.println("Semaphore Workers status update:");
            for (WorkerUsingSema worker : workers) {
                WorkerStatus s = worker.getStatus();
                System.out.printf("%s: %s\n", worker.getName(), s);
                if (s != WorkerStatus.DONE) {
                    allDone = false;
                }
            }
            System.out.println("-----");
            Thread.sleep(1000);
        }
    }

    public static void MutexDemons(int num) {
        ArrayList<WorkerUsingMutex> workers = new ArrayList<>();

        for (int i = 1; i <= num; i++) {
            workers.add(new WorkerUsingMutex("Worker-" + i));
        }

        for (WorkerUsingMutex worker : workers) {
            worker.start();
        }

        try {
            monitorStatus(workers);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        for (WorkerUsingMutex worker : workers) {
            try {
                worker.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void SemaphoreDemons(int num) {
        ArrayList<WorkerUsingSema> workers = new ArrayList<>();

        for (int i = 1; i <= num; i++) {
            workers.add(new WorkerUsingSema("Worker-" + i));
        }

        for (WorkerUsingSema worker : workers) {
            worker.start();
        }

        try {
            monitorStatusSema(workers);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        for (WorkerUsingSema worker : workers) {
            try {
                worker.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        try {
            Scanner sc = new Scanner(System.in);

            System.out.println("Enter number of Workers:- ");
            int num = sc.nextInt();

            while (true) {
                System.out.println("----Menu---");
                System.out.println("1. Using Mutex (1 worker allowed to use single Resource.)");
                System.out.println("2. Using Semaphores (3 workers allowed to use single Resource.)");
                System.out.println("3. Exit");
                System.out.println("----------");
                int choice = sc.nextInt();
                if (choice == 1) {
                    MutexDemons(num);
                } else if (choice == 2) {
                    SemaphoreDemons(num);
                } else if (choice == 3)
                    break;
                else {
                    System.out.println("Invalid choice, try again");
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
