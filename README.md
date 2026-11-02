# Student Grade Management System (SGMS)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An enterprise-grade, responsive, and secure academic management web application built from scratch for higher education institutions. **SGMS** streamlines student admissions, faculty course assignment, internal and external examination grading, automated GPA/CGPA calculations, and publication of official PDF statements of marks.

---

## Key Highlights

* **Role-Based Access Control (RBAC):** Three distinct portals for **Admin**, **Faculty**, and **Student**, enforced at both frontend routing and Spring Security method levels (`@PreAuthorize`).
* **Dynamic Grading Engine:** Computes internal assessments (out of 50) and final examinations (out of 50), calculates percentages, maps 10-point letter grades (`O`, `A+`, `A`, `B+`, `B`, `C`, `F`), and determines credit-weighted SGPA and CGPA.
* **Strict Academic Privacy:** Students only have access to their own officially published grades; drafts and unpublished marks are concealed.
* **Audit Trail & Authorized Corrections:** Once published, grades cannot be silently modified by faculty. Any administrative change is permanently recorded in the immutable audit log with justification remarks.
* **Official PDF Report Cards:** One-click generation of publication-ready student report cards with institutional header, subject credits, examination breakdowns, and cumulative CGPA.
* **CSV Export:** Faculty and administrators can export marks rosters to standard CSV format.
* **Zero-Config Local Deployment:** Runs with built-in persistent H2 or connects effortlessly to MySQL via standard environment variables.
* **Cloud Ready:** Designed for free-tier cloud deployment across Vercel/GitHub Pages (frontend), Render/Koyeb/Railway (backend), and Aiven/TiDB Cloud (database).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (SPA)                        │
│  React 18 • Vite • Tailwind CSS • Lucide Icons • Recharts   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot Backend                      │
│   Spring Security (BCrypt & JWT) • Spring Data JPA • REST   │
│   Grade Calculation Service • OpenPDF Engine • Audit Trail  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JDBC (SSL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Relational Database                    │
│   MySQL 8.0+ / H2 (Multi-environment & Test Configuration)  │
└─────────────────────────────────────────────────────────────┘
```

---

## Color Palette & Visual Identity

The design adheres strictly to a vibrant, modern education SaaS theme:

* **Primary Indigo:** `#4F46E5`
* **Deep Navy:** `#172554`
* **Electric Blue:** `#3B82F6`
* **Royal Purple:** `#7C3AED`
* **Teal Accent:** `#14B8A6`
* **Coral Rose:** `#FB7185`
* **Soft Amber:** `#FBBF24`
* **Background Surface:** `#F8FAFC`
* **Card Containers:** `#FFFFFF`
* **Primary Text:** `#0F172A`
* **Muted Secondary:** `#64748B`

---

## Role Capabilities

### 1. Administrator (`ROLE_ADMIN`)
* **Dashboard Overview:** Real-time metrics for total students, faculty members, course subjects, active enrollments, grade distributions, and recent audit activity.
* **Student Management:** Full CRUD operations, search by roll number or name, filter by department, semester, and academic year, and toggle account activation.
* **Faculty Management:** Add and edit teaching staff, assign/reassign faculty to course subjects, and activate/deactivate accounts.
* **Subject Management:** Create subjects with configurable credits (0.5 to 10), assign departments and semesters, and review enrolled student rosters.
* **Academic Setup:** Configure academic departments, progression terms (Semesters 1-8), and annual sessions.
* **Grade Review & Override:** Review faculty submissions and authorize grade corrections with mandatory audit justification notes.
* **Result Publication:** Publish or unpublish semester or subject results with a single click.
* **Report Generation:** Download official PDF report cards for any student and export subject scores to CSV.

### 2. Faculty (`ROLE_FACULTY`)
* **Teaching Dashboard:** Overview of assigned subjects, enrolled student count, and grading status.
* **Assessment Marks Entry:** Tabular marks entry table with student roll numbers, live calculation of total marks, percentage, and letter grades.
* **Drafts & Submissions:** Save progress as drafts without freezing, or submit final marks for administrative review and publication.
* **Subject Analytics:** Interactive grade distribution charts (Recharts) and pass rate attainment metrics.
* **CSV Export:** Export student marks for departmental records.

### 3. Student (`ROLE_STUDENT`)
* **Personalized Dashboard:** Immediate visibility into enrolled subjects, current semester status, latest SGPA, and cumulative CGPA.
* **Statement of Marks:** Term-wise scorecard displaying subject credits, internal scores (50), external scores (50), total (100), and letter grades.
* **Privacy Boundary:** Strictly prevents viewing another student's results or unpublished draft scores.
* **PDF Report Card:** Download official, print-ready PDF statements of marks.
* **Academic Profile:** View registered profile details, roll number, department, and session.

---

## Pre-Configured Demo Accounts

For immediate evaluation, the database is pre-seeded with sample accounts:

| Role | Username / Identifier | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | Institutional Administrator |
| **Faculty** | `prof.sharma` | `Faculty@123` | Dr. Rajesh Sharma (HOD, Computer Science) |
| **Faculty** | `prof.patel` | `Faculty@123` | Prof. Anita Patel (Associate Professor) |
| **Student** | `CS2024001` | `Student@123` | Alex Chen (Sem 1, High Distinction) |
| **Student** | `CS2024002` | `Student@123` | Priya Sharma (Sem 1, Excellent) |

> **Convenience Feature:** Click any of the **Quick Demo Account** pills on the Login Page to automatically populate credentials.

---

## Quick Start Guide

### Prerequisites
* **Java 21 LTS**
* **Apache Maven 3.8+**
* **Node.js 18+** & **npm**

### 1. Run the Backend
```bash
cd backend
mvn spring-boot:run
```
The backend initializes on `http://localhost:8080/api`. The built-in database automatically creates all tables and seeds the demo dataset.

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your web browser.

---

## Running Automated Tests

To run the backend test suite (including marks calculation, weighted SGPA, unpublished restrictions, and Spring Security):
```bash
cd backend
mvn test
```

To build the production frontend bundle:
```bash
cd frontend
npm run build
```

---

## Project Structure

```
sgms/
├── backend/
│   ├── pom.xml                        # Maven dependencies (Spring Boot, Security, JPA, OpenPDF)
│   ├── .env.example                   # Environment configuration template
│   └── src/
│       ├── main/
│       │   ├── java/com/sgms/
│       │   │   ├── SgmsApplication.java
│       │   │   ├── config/            # SecurityConfig, JwtTokenProvider, DataInitializer
│       │   │   ├── controller/        # Auth, Admin, Faculty, Student, Report, Health
│       │   │   ├── dto/               # Requests and Responses
│       │   │   ├── entity/            # User, Student, Faculty, Subject, GradeRecord, etc.
│       │   │   ├── exception/         # GlobalExceptionHandler
│       │   │   ├── repository/        # Spring Data JPA Repositories
│       │   │   └── service/           # Grading, Auth, Admin, Faculty, Student, PDF
│       │   └── resources/             # application.yml, application-mysql.yml
│       └── test/                      # JUnit 5 & Spring Boot Test suites
├── frontend/
│   ├── package.json                   # React, Vite, Tailwind, Recharts, Lucide
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── context/AuthContext.jsx    # Authentication & JWT state
│       ├── services/                  # api, auth, admin, faculty, student, report
│       ├── layouts/                   # DashboardLayout (collapsible sidebar), ProtectedRoute
│       ├── components/                # StatCard, Badge, Modal, LoadingSpinner
│       └── pages/
│           ├── LandingPage.jsx        # Public institutional landing page
│           ├── LoginPage.jsx          # Split-screen login with demo buttons
│           ├── NotFoundPage.jsx       # 404 handler
│           ├── admin/                 # Dashboard, Students, Faculty, Subjects, Academic, Grades, Reports
│           ├── faculty/               # Dashboard, Marks Entry, Analytics
│           └── student/               # Dashboard, Results, Profile
├── database/
│   ├── migrations/V1__init_schema.sql # Standard MySQL schema
│   └── sample_data.sql                # Seed data script
├── docs/
│   ├── SETUP.md                       # Installation and configuration guide
│   ├── API.md                         # Complete REST API reference
│   └── DEPLOYMENT.md                  # Free-tier cloud deployment instructions
├── README.md
└── .gitignore
```

---

## License

This project is licensed under the MIT License.

