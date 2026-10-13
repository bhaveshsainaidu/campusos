# CampusOS — Enterprise Campus Management Operating System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

> **CampusOS** is a modern, high-performance Full-Stack ERP and Campus Management Platform designed for educational institutions. It features an Apple-grade fluid interface, instantaneous STOMP WebSocket broadcasts, role-based access control (Admin, Faculty, Student), attendance tracking with shortage alerts, exam scheduling, PDF marksheet generation, fee management with Razorpay sandbox integration, and timetable clash detection.

---

## ⚡ 1-Click Quickstart (Zero Configuration)

CampusOS comes with an automated, single-click launcher and setup utility. Anyone downloading the ZIP archive or cloning the repository can start the entire stack instantly without complex manual setup.

### Option A: Windows (Double-Click)
1. Double-click **`start.bat`** (or execute `.\start.bat` in Command Prompt / PowerShell).
2. The script will automatically:
   - Verify Java 17+ and Node.js.
   - Initialize frontend dependencies (`npm install`) if not present.
   - Boot MySQL (if local server is present) and run Spring Boot migrations.
   - Start the Vite frontend server.
   - Automatically launch your default browser to **`http://localhost:5173`**.
3. To stop all services at any time, double-click **`stop.bat`**.

---

### Option B: Cross-Platform Universal Java Runner (Windows / macOS / Linux)
Because CampusOS is built on Java, a single source file `CampusOSSetup.java` handles setup, health checks, dependency resolution, process management, and browser launching across all platforms:

```bash
# 1. Start everything (Backend + Frontend + Open Browser)
java CampusOSSetup.java --start

# 2. Check health of MySQL, Backend, and Frontend
java CampusOSSetup.java --status

# 3. Stop all running CampusOS services
java CampusOSSetup.java --stop

# 4. Interactive menu
java CampusOSSetup.java
```

---

### Option C: Linux / macOS
```bash
chmod +x *.sh
./start.sh    # Launches services and opens browser
./stop.sh     # Stops all services cleanly
```

---

## 🔐 Demo Credentials (Clean Baseline State)

The system seeds foundational departments, faculty members, courses, and demo students with **zero preloaded attendance records, zero fee dues, and zero dummy notices**. This gives administrators, teachers, and students a clean canvas to perform real-time live operations.

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campusos.edu` | `Admin@123` | Institutional dashboard, student/faculty management, fee structure assignment, timetable scheduling, system-wide notices. |
| **Faculty** | `faculty1@campusos.edu` | `Faculty@123` | Assigned classes, live attendance marking, student shortage alerts, marks entry. |
| **Student** | `student00001@campusos.edu` | `Student@123` | Personal dashboard, attendance percentage, fee invoice payments (Razorpay sandbox), downloadable PDF marksheets. |

*(Additional demo students: `student00002@campusos.edu` through `student00010@campusos.edu` with password `Student@123`)*

---

## 🌟 Real-Time Features & Walkthrough

### 1. Attendance Marking & Shortage Tracking (<75%)
- **Faculty Workflow**: Log in as `faculty1@campusos.edu` ➔ Navigate to **Attendance** ➔ Select a course session ➔ Click to mark students **Present**, **Late**, or **Absent** ➔ Click **Submit Attendance**.
- **Student Workflow**: Log in as `student00001@campusos.edu` ➔ Live attendance percentage dynamically updates. If attendance drops below 75%, a prominent shortage warning alert is triggered.

### 2. Live Notice Push (STOMP WebSockets)
- Publish notices by audience: `ALL`, `STUDENT`, `FACULTY`, or by `DEPARTMENT`.
- When an admin posts a notice, connected student and faculty browser clients receive instantaneous real-time desktop toast notifications via SockJS & STOMP WebSockets without refreshing the page.

### 3. Student Fee Payments (Razorpay Sandbox)
- **Admin**: Create fee structures (e.g. Tuition, Lab, Sports) and assign them to batches or individual students.
- **Student**: View pending invoices with due dates, click **Pay Now** to open the integrated payment gateway modal, test sandbox checkout, and generate verified receipts with transaction reference IDs.

### 4. Exam Schedule, SGPA/CGPA & PDF Marksheets
- Schedule midterm and end-term examinations with date, time, and room allocations.
- Faculty enters component marks (Midterm, Final, Assignments).
- Backend computes GPA and generates downloadable, official, branded PDF marksheets with university headers and student roll numbers via iText.

### 5. Timetable Clash Detection
- Intelligent scheduling engine ensures room allocations and faculty assignments cannot double-book time slots across overlapping batches.

---

## 🏗️ Technical Architecture

```
fsj/
├── CampusOSSetup.java      # Single-file Java turnkey orchestrator & CLI
├── start.bat / stop.bat    # Windows 1-click launch and termination scripts
├── setup.bat               # Windows dependency installation & build script
├── start.sh / stop.sh      # Linux/macOS launcher and stopper scripts
├── setup.sh                # Linux/macOS setup script
│
├── campusos-backend/       # Spring Boot 3.3.4 REST API & WebSocket Server
│   ├── mvnw / mvnw.cmd     # Embedded Maven wrapper (zero Maven install required)
│   ├── src/main/java/      # Domain modules (auth, student, attendance, fees, exams, notices)
│   ├── src/main/resources/ # application.yml & Flyway SQL schema migrations
│   └── pom.xml
│
└── campusos-frontend/      # React 18 + Vite + TypeScript Single Page Application
    ├── src/
    │   ├── api/            # Axios HTTP client with automatic JWT token refresh
    │   ├── components/     # UI primitives & STOMP WebSocket client
    │   ├── pages/          # Screens: Auth, Dashboard, Attendance, Fees, Exams, Timetable, Notices
    │   └── store/          # Zustand state stores (auth, theme, notices)
    ├── vite.config.ts
    └── package.json
```

### Backend Stack
- **Framework**: Spring Boot 3.3.4, Java 21 LTS
- **Security**: Spring Security 6 with stateless JWT Bearer tokens and HTTP-only rotating refresh tokens
- **Persistence**: Spring Data JPA / Hibernate with MySQL 8 InnoDB dialect
- **Database Migrations**: Flyway
- **Real-time**: Spring STOMP over SockJS (`/ws-campus`)
- **Rate Limiting**: Bucket4j (20 auth requests per minute)
- **PDF Generation**: iText 7 Core

### Frontend Stack
- **Library**: React 18.3.1 with TypeScript
- **Bundler & Tooling**: Vite 5.4
- **Styling**: Tailwind CSS with Apple-grade light / dark themes
- **State Management**: TanStack React Query v5 & Zustand
- **Icons & Animation**: Lucide React, Phosphor Icons, Framer Motion
- **Charts**: Recharts

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user and receive JWT access + refresh token |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile & role |
| `GET` | `/api/v1/dashboard/{role}` | Role-tailored KPIs (Admin, Faculty, Student) |
| `GET` | `/api/v1/students` | Paginated and filtered student roster |
| `POST` | `/api/v1/attendance/sessions` | Create class session and record attendance |
| `GET` | `/api/v1/attendance/my` | Retrieve authenticated student's attendance records |
| `GET` | `/api/v1/fees/my` | Student invoices, payment status, and due dates |
| `POST` | `/api/v1/fees/pay` | Create Razorpay order and process sandbox payment |
| `POST` | `/api/v1/notices` | Publish institutional notice (triggers WebSocket broadcast) |
| `GET` | `/api/v1/exams/{id}/marksheet/pdf` | Generate and download official marksheet PDF |
| `GET` | `/actuator/health` | Spring Boot health check |

---

## ⚙️ Environment Variables (Optional)

Default settings run out-of-the-box with local MySQL (`root` / `campusos` on port `3306`). To customize:

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:mysql://localhost:3306/campusos` | JDBC Database URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `campusos` | Database password |
| `JWT_SECRET` | `(pre-configured 256-bit secret)` | HMAC SHA-256 signing key |
| `PORT` | `8080` | Spring Boot HTTP port |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed frontend origins (e.g. `https://campusos.vercel.app,http://localhost:5173`) |

---

## 🚀 Deploying to Vercel & Cloud Architecture

CampusOS consists of a decoupled architecture:
1. **Frontend (`campusos-frontend`)**: React 18 + Vite SPA ready for instant zero-configuration deployment to **Vercel**.
2. **Backend (`campusos-backend`)**: Spring Boot 3.3.4 + MySQL service best hosted on a container / JVM platform (e.g., **Render**, **Railway**, **Fly.io**, **AWS**, or **VPS**).

### Deploying the Frontend to Vercel

#### Option 1: Import directly from GitHub (Recommended)
1. In your [Vercel Dashboard](https://vercel.com/dashboard), click **Add New...** ➔ **Project** and import your CampusOS repository.
2. In the project configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `campusos-frontend` (or leave default `./` since root `vercel.json` is configured)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://campusos-api.up.railway.app`)
   - `VITE_WS_URL`: (Optional) Custom WebSocket URL if different from `${VITE_API_URL}/ws/campusos`
4. Click **Deploy**. Vercel will build and serve your app with full client-side SPA routing (`vercel.json` rewrite included).

#### Option 2: Deploy using Vercel CLI
```bash
# Navigate to frontend and deploy
cd campusos-frontend
vercel
```

### Backend CORS Configuration
When running the backend in production, make sure to set the `CORS_ORIGINS` environment variable to include your Vercel URL:
```env
CORS_ORIGINS=https://your-campusos-app.vercel.app,http://localhost:5173
```

---

## 📄 License
CampusOS is open-source software licensed under the MIT License.
