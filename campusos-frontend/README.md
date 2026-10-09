# CampusOS Frontend 🌐

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

CampusOS Frontend is an ultra-modern, Apple-grade university ERP web client built with React 18, TypeScript, Tailwind CSS, TanStack Query, and Zustand. Engineered with frosted glassmorphism, responsive data visualizations, and real-time WebSocket notifications.

---

## ✨ Design Principles & System Aesthetics

- **Apple-Grade Visual Language**: Frosted glass cards (`backdrop-blur-2xl`), subtle hairline borders, ambient light blooms, and Apple typography.
- **Flawless Dark Mode**: Seamless toggle between light mode (`#fbfbfd`) and OLED dark mode (`#000000`) with persistent theme storage.
- **Fluid Micro-Interactions**: Framer Motion animated modal backdrops and floating toast transitions.
- **Phosphor Duotone Iconography**: Cohesive two-tone iconography across navigation and data cards.
- **Real-Time Responsiveness**: Instant STOMP WebSocket broadcasts for campus announcements.

---

## 🛠️ Tech Stack

- **Core**: React 18.3.1, TypeScript 5.6, Vite 5.4
- **Styling**: Tailwind CSS 3.4 with custom Apple design tokens
- **Data Fetching & Cache**: TanStack React Query v5
- **State Management**: Zustand
- **Routing**: React Router v6 with role-based route protection
- **Animations**: Framer Motion
- **Charts & Visualizations**: Recharts
- **Icons**: Phosphor Icons (Duotone) & Lucide React
- **HTTP Client**: Axios with JWT interceptors, automatic token refresh, and rate-limit handling
- **Real-Time Client**: `@stomp/stompjs` + SockJS
- **Testing**: Vitest, React Testing Library, JSDOM

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v24 LTS tested)
- **CampusOS Backend**: Running on `http://localhost:8080`

### Installation & Launch

```bash
# Install dependencies
npm install

# Start development server with proxy to backend :8080
npm run dev
```

The application opens at `http://localhost:5173`.

### Production Build & Testing

```bash
# Run unit & component test suites
npm run test

# Compile TypeScript and bundle production assets
npm run build
```

---

## 🧭 Functional Modules

### 1. Unified Authentication & Access Control
- Apple-grade sign-in screen with **One-Click Demo Pills** for instant switching between roles.
- Two-step password reset token request and confirmation modal.
- Protected routes checking JWT access token validity and role authorization (`ROLE_ADMIN`, `ROLE_FACULTY`, `ROLE_STUDENT`).

### 2. Role-Based Dashboards
- **Administrative Console**: KPI stat cards (10k Students, 12 Faculty, 5 Departments, Active Courses, Pending Fees), 14-day aggregated attendance area chart, and quick management links.
- **Faculty Command Center**: Today's scheduled lectures, live attendance status, assigned course cards.
- **Student Workspace**: Identity banner, personal attendance meter with shortage alerts, CGPA card, pending fee dues alert, and marksheet download.

### 3. Academics & Timetable Matrix
- **Course Catalog**: Filterable course directory with search and credit specifications.
- **Academic Departments**: Department chair profiles and descriptions.
- **Timetable Matrix**: Weekly class grid with **Automated Clash Detection** alerts if rooms or faculty are double-booked.

### 4. Attendance Management
- **Daily Attendance Register**: Fast student roster with 1-click status toggles (Present, Absent, Late) and bulk actions.
- **Student Attendance Profile**: Subject-wise percentage bars and overall attendance status.
- **Shortage Alerts Registry**: Filterable table identifying students with attendance `< 75%`.

### 5. Examinations & Marksheets
- **Exam Schedule**: Semester assessment timelines and exam creation.
- **Marks Registry**: Faculty marks entry with maximum marks constraint and automated letter grades.
- **Academic Transcripts**: SGPA/CGPA cards, subject grade details, and **Official Async PDF Marksheet Download**.

### 6. Fees & Payment Portal
- **Fee Structures**: Institutional tuition tariff creator and batch cohort assigner.
- **Student Fee Portal**: Outstanding invoices, **Simulated Razorpay Sandbox Checkout Modal**, HMAC signature verification, and digital payment receipts.

### 7. Campus Bulletin & Real-Time Announcements
- Category and audience-targeted notice board (`ALL`, `STUDENT`, `FACULTY`).
- Live WebSocket STOMP listener dispatching instant floating toast notifications when notices are published.

---

## 🔑 Demo Logins

| Persona | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@campusos.edu` | `Admin@123` |
| **Faculty Member** | `faculty1@campusos.edu` | `Faculty@123` |
| **Enrolled Student** | `student00001@campusos.edu` | `Student@123` |
