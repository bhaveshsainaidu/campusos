import java.io.*;
import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

/**
 * CampusOS - One-Click Turnkey Setup & Runtime Orchestrator
 *
 * Runs on Java 17+ with zero external dependencies.
 *
 * Usage:
 *   java CampusOSSetup.java          (Interactive menu)
 *   java CampusOSSetup.java --setup  (Install dependencies & build)
 *   java CampusOSSetup.java --start  (Start backend + frontend + open browser)
 *   java CampusOSSetup.java --stop   (Stop running services)
 *   java CampusOSSetup.java --status (Check health of all services)
 */
public class CampusOSSetup {

    private static final String RESET = "\u001B[0m";
    private static final String GREEN = "\u001B[32m";
    private static final String BLUE = "\u001B[34m";
    private static final String CYAN = "\u001B[36m";
    private static final String YELLOW = "\u001B[33m";
    private static final String RED = "\u001B[31m";
    private static final String BOLD = "\u001B[1m";

    private static final boolean IS_WINDOWS = System.getProperty("os.name").toLowerCase().contains("win");
    private static final Path ROOT_DIR = Paths.get(".").toAbsolutePath().normalize();
    private static final Path BACKEND_DIR = ROOT_DIR.resolve("campusos-backend");
    private static final Path FRONTEND_DIR = ROOT_DIR.resolve("campusos-frontend");

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();

    public static void main(String[] args) {
        printBanner();

        if (args.length > 0) {
            switch (args[0].toLowerCase()) {
                case "--setup":
                case "-s":
                    runSetup();
                    return;
                case "--start":
                case "-u":
                    runStart();
                    return;
                case "--stop":
                case "-d":
                    runStop();
                    return;
                case "--status":
                case "-c":
                    runStatus();
                    return;
                case "--help":
                case "-h":
                    printHelp();
                    return;
                default:
                    System.out.println(RED + "Unknown flag: " + args[0] + RESET);
                    printHelp();
                    return;
            }
        }

        runInteractiveMenu();
    }

    private static void printBanner() {
        System.out.println(CYAN + BOLD + """
        =============================================================================
         ____                                    ___  ____  
        / ___|__ _ _ __ ___  _ __  _   _ ___    / _ \\/ ___| 
       | |   / _` | '_ ` _ \\| '_ \\| | | / __|  | | | \\___ \\ 
       | |__| (_| | | | | | | |_) | |_| \\__ \\  | |_| |___) |
        \\____\\__,_|_| |_| |_| .__/ \\__,_|___/   \\___/|____/ 
                            |_|                              
                 Enterprise Campus Management Operating System
        =============================================================================
        """ + RESET);
    }

    private static void runInteractiveMenu() {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("\n" + BOLD + "Select an option:" + RESET);
            System.out.println("  [" + GREEN + "1" + RESET + "] Start CampusOS (Backend + Frontend + Open Browser)");
            System.out.println("  [" + GREEN + "2" + RESET + "] Check Health & Service Status");
            System.out.println("  [" + GREEN + "3" + RESET + "] Full Setup (Install Frontend & Backend Dependencies)");
            System.out.println("  [" + RED + "4" + RESET + "] Stop Running CampusOS Services");
            System.out.println("  [" + YELLOW + "5" + RESET + "] Show Demo Credentials");
            System.out.println("  [" + "0" + "] Exit");
            System.out.print("\nEnter choice (0-5): ");

            String input = scanner.hasNextLine() ? scanner.nextLine().trim() : "0";
            switch (input) {
                case "1":
                    runStart();
                    return;
                case "2":
                    runStatus();
                    break;
                case "3":
                    runSetup();
                    break;
                case "4":
                    runStop();
                    break;
                case "5":
                    printCredentials();
                    break;
                case "0":
                case "exit":
                case "q":
                    System.out.println("Exiting CampusOS Setup. Goodbye!");
                    return;
                default:
                    System.out.println(RED + "Invalid option. Please try again." + RESET);
            }
        }
    }

    private static void printHelp() {
        System.out.println("""
        Usage: java CampusOSSetup.java [option]

        Options:
          --start,  -u    Launch Backend, Frontend, and open browser at http://localhost:5173
          --status, -c    Check health status of MySQL, Backend (:8080), and Frontend (:5173)
          --setup,  -s    Run npm install and Maven build
          --stop,   -d    Stop processes on ports 8080 and 5173
          --help,   -h    Display this help message
        """);
    }

    public static void runStatus() {
        System.out.println("\n" + BOLD + ">>> Checking System Status..." + RESET);

        boolean mysqlUp = isPortOpen("127.0.0.1", 3306);
        System.out.printf("  MySQL (3306):     %s\n", mysqlUp ? GREEN + "[UP]" + RESET : RED + "[DOWN - required]" + RESET);

        boolean backendUp = checkHttpHealth("http://localhost:8080/actuator/health");
        System.out.printf("  Backend (8080):   %s\n", backendUp ? GREEN + "[UP - Ready]" + RESET : YELLOW + "[DOWN]" + RESET);

        boolean frontendUp = isPortOpen("127.0.0.1", 5173);
        System.out.printf("  Frontend (5173):  %s\n", frontendUp ? GREEN + "[UP - Ready]" + RESET : YELLOW + "[DOWN]" + RESET);

        if (backendUp && frontendUp) {
            System.out.println("\n" + GREEN + BOLD + "All systems operational! Web UI is available at: http://localhost:5173" + RESET);
        }
    }

    public static void runSetup() {
        System.out.println("\n" + BOLD + ">>> Running CampusOS Full Setup..." + RESET);

        // 1. Check prerequisites
        checkJavaVersion();
        String npmCmd = findExecutable("npm", "npm.cmd");
        if (npmCmd == null) {
            System.out.println(RED + "Node.js/npm not found in PATH! Please install Node.js 18+ from https://nodejs.org/" + RESET);
            return;
        }

        // 2. Setup frontend
        System.out.println("\n" + CYAN + "[1/2] Installing frontend dependencies (npm install)..." + RESET);
        runCommand(FRONTEND_DIR, npmCmd, "install");

        // 3. Setup backend
        System.out.println("\n" + CYAN + "[2/2] Compiling backend (Maven)..." + RESET);
        String mvnCmd = findMaven();
        runCommand(BACKEND_DIR, mvnCmd, "compile");

        System.out.println("\n" + GREEN + BOLD + "Setup completed successfully! Run with: java CampusOSSetup.java --start" + RESET);
    }

    public static void runStart() {
        System.out.println("\n" + BOLD + ">>> Launching CampusOS..." + RESET);

        // Check MySQL
        if (!isPortOpen("127.0.0.1", 3306)) {
            System.out.println(YELLOW + "MySQL is not listening on port 3306." + RESET);
            // Attempt to start local dev mysql if present
            Path localMysql = Paths.get("C:/dev/mysql/bin/mysqld.exe");
            if (Files.exists(localMysql)) {
                System.out.println("Starting local MySQL from C:/dev/mysql...");
                startBackgroundProcess(ROOT_DIR, localMysql.toString(), "--defaults-file=C:/dev/mysql/my.ini", "--console");
                sleep(2500);
            } else {
                System.out.println(RED + "Please ensure MySQL 8 is running with user 'root' and database 'campusos' created." + RESET);
            }
        }

        // Check if frontend dependencies exist
        if (!Files.exists(FRONTEND_DIR.resolve("node_modules"))) {
            System.out.println(CYAN + "Frontend node_modules missing. Running npm install..." + RESET);
            String npmCmd = findExecutable("npm", "npm.cmd");
            if (npmCmd != null) {
                runCommand(FRONTEND_DIR, npmCmd, "install");
            }
        }

        // Start Backend if not already running
        if (!isPortOpen("127.0.0.1", 8080)) {
            System.out.println(CYAN + "Starting Spring Boot Backend on port 8080..." + RESET);
            String mvnCmd = findMaven();
            if (mvnCmd != null) {
                startBackgroundProcess(BACKEND_DIR, mvnCmd, "spring-boot:run");
            } else {
                System.out.println(RED + "Maven executable not found!" + RESET);
                return;
            }
        } else {
            System.out.println(GREEN + "Backend is already running on port 8080." + RESET);
        }

        // Start Frontend if not already running
        if (!isPortOpen("127.0.0.1", 5173)) {
            System.out.println(CYAN + "Starting Vite Frontend on port 5173..." + RESET);
            String npmCmd = findExecutable("npm", "npm.cmd");
            if (npmCmd != null) {
                startBackgroundProcess(FRONTEND_DIR, npmCmd, "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173");
            } else {
                System.out.println(RED + "npm executable not found!" + RESET);
                return;
            }
        } else {
            System.out.println(GREEN + "Frontend is already running on port 5173." + RESET);
        }

        // Wait for both to be fully healthy
        System.out.println("\n" + CYAN + "Waiting for services to become ready..." + RESET);
        boolean backendReady = waitForHttp("http://localhost:8080/actuator/health", 45);
        boolean frontendReady = waitForPort("127.0.0.1", 5173, 20);

        if (backendReady && frontendReady) {
            System.out.println("\n" + GREEN + BOLD + "=============================================================================" + RESET);
            System.out.println(GREEN + BOLD + "  CAMPUSOS IS ONLINE! Access the application at:" + RESET);
            System.out.println(CYAN + BOLD + "  👉  http://localhost:5173" + RESET);
            System.out.println(GREEN + BOLD + "=============================================================================" + RESET);

            printCredentials();

            // Auto open browser
            openBrowser("http://localhost:5173");
        } else {
            System.out.println(YELLOW + "Startup in progress. Check: http://localhost:5173 in a few seconds." + RESET);
        }
    }

    public static void runStop() {
        System.out.println("\n" + BOLD + ">>> Stopping CampusOS Services..." + RESET);
        killPort(8080);
        killPort(5173);
        System.out.println(GREEN + "Services stopped successfully." + RESET);
    }

    private static void printCredentials() {
        System.out.println("\n" + BOLD + "Demo Accounts (Clean Baseline - Ready for live operations):" + RESET);
        System.out.println("  " + BOLD + "ADMIN:   " + RESET + "admin@campusos.edu    | Password: " + BOLD + "Admin@123" + RESET + "   (Full Management & Dashboards)");
        System.out.println("  " + BOLD + "FACULTY: " + RESET + "faculty1@campusos.edu  | Password: " + BOLD + "Faculty@123" + RESET + " (Mark Attendance, Enter Marks)");
        System.out.println("  " + BOLD + "STUDENT: " + RESET + "student00001@campusos.edu | Password: " + BOLD + "Student@123" + RESET + " (View Attendance, Pay Fees, Marksheet)");
    }

    private static void checkJavaVersion() {
        String version = System.getProperty("java.version");
        System.out.println("  Java version: " + version);
    }

    private static String findMaven() {
        // Priority 1: Maven wrapper inside campusos-backend
        Path mvnw = IS_WINDOWS ? BACKEND_DIR.resolve("mvnw.cmd") : BACKEND_DIR.resolve("mvnw");
        if (Files.exists(mvnw)) {
            return mvnw.toAbsolutePath().toString();
        }
        // Priority 2: Local dev maven
        Path devMaven = Paths.get("C:/dev/apache-maven-3.9.9/bin/mvn.cmd");
        if (Files.exists(devMaven)) {
            return devMaven.toAbsolutePath().toString();
        }
        // Priority 3: System PATH
        String sysMvn = findExecutable("mvn", "mvn.cmd");
        if (sysMvn != null) {
            return sysMvn;
        }
        return null;
    }

    private static String findExecutable(String unixName, String winName) {
        String name = IS_WINDOWS ? winName : unixName;
        String pathEnv = System.getenv("PATH");
        if (pathEnv != null) {
            for (String dir : pathEnv.split(File.pathSeparator)) {
                Path p = Paths.get(dir).resolve(name);
                if (Files.isExecutable(p)) {
                    return p.toString();
                }
            }
        }
        return name; // fallback to invoke directly
    }

    private static boolean isPortOpen(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 600);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean checkHttpHealth(String url) {
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(2))
                    .GET().build();
            HttpResponse<String> resp = HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofString());
            return resp.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean waitForHttp(String url, int maxSeconds) {
        System.out.print("  Connecting to backend: ");
        for (int i = 0; i < maxSeconds; i++) {
            if (checkHttpHealth(url)) {
                System.out.println(GREEN + " Ready!" + RESET);
                return true;
            }
            System.out.print(".");
            sleep(1000);
        }
        System.out.println(YELLOW + " Timed out waiting." + RESET);
        return false;
    }

    private static boolean waitForPort(String host, int port, int maxSeconds) {
        System.out.print("  Connecting to frontend: ");
        for (int i = 0; i < maxSeconds; i++) {
            if (isPortOpen(host, port)) {
                System.out.println(GREEN + " Ready!" + RESET);
                return true;
            }
            System.out.print(".");
            sleep(1000);
        }
        System.out.println(YELLOW + " Timed out waiting." + RESET);
        return false;
    }

    private static void openBrowser(String url) {
        try {
            if (java.awt.Desktop.isDesktopSupported() && java.awt.Desktop.getDesktop().isSupported(java.awt.Desktop.Action.BROWSE)) {
                java.awt.Desktop.getDesktop().browse(new URI(url));
            } else if (IS_WINDOWS) {
                Runtime.getRuntime().exec(new String[]{"rundll32", "url.dll,FileProtocolHandler", url});
            } else {
                Runtime.getRuntime().exec(new String[]{"xdg-open", url});
            }
        } catch (Exception e) {
            System.out.println("Open your browser and visit: " + url);
        }
    }

    private static void killPort(int port) {
        try {
            if (IS_WINDOWS) {
                Process p = new ProcessBuilder("cmd.exe", "/c", "netstat -ano | findstr :" + port).start();
                BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String line;
                Set<String> pids = new HashSet<>();
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.contains("LISTENING")) {
                        String[] parts = line.split("\\s+");
                        if (parts.length >= 5) {
                            pids.add(parts[parts.length - 1]);
                        }
                    }
                }
                for (String pid : pids) {
                    new ProcessBuilder("taskkill", "/F", "/PID", pid).start().waitFor();
                    System.out.println("  Terminated PID " + pid + " on port " + port);
                }
            } else {
                new ProcessBuilder("bash", "-c", "lsof -ti:" + port + " | xargs kill -9").start().waitFor();
            }
        } catch (Exception e) {
            System.err.println("Failed to terminate port " + port + ": " + e.getMessage());
        }
    }

    private static void runCommand(Path workingDir, String... cmd) {
        try {
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.directory(workingDir.toFile());
            pb.inheritIO();
            Process p = pb.start();
            int exit = p.waitFor();
            if (exit != 0) {
                System.out.println(RED + "Command failed with exit code: " + exit + RESET);
            }
        } catch (Exception e) {
            System.err.println("Error running command: " + e.getMessage());
        }
    }

    private static void startBackgroundProcess(Path workingDir, String... cmd) {
        try {
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.directory(workingDir.toFile());
            pb.redirectErrorStream(true);
            pb.redirectOutput(ProcessBuilder.Redirect.appendTo(ROOT_DIR.resolve("campusos.log").toFile()));
            pb.start();
        } catch (Exception e) {
            System.err.println("Error launching process: " + e.getMessage());
        }
    }

    private static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ignored) {}
    }
}
