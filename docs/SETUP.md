# SGMS Local Setup & Installation Guide

This guide walks through setting up and running the **Student Grade Management System (SGMS)** locally on Windows, macOS, or Linux.

---

## 1. System Prerequisites

Ensure you have the following installed on your machine:

| Component | Minimum Version | Verified Version | Check Command |
| :--- | :--- | :--- | :--- |
| **Java Development Kit** | JDK 21 LTS | OpenJDK 21.0.12 | `java -version` |
| **Apache Maven** | 3.8+ | 3.9.6 | `mvn -version` |
| **Node.js** | 18.x LTS+ | 24.x | `node -v` |
| **npm** | 9.x+ | 11.x | `npm -v` |
| **Database** | MySQL 8.0+ *(Optional: Built-in H2 runs out-of-the-box)* | MySQL 8.0 / H2 | `mysql --version` |

---

## 2. Quick Start (Zero-Configuration with Built-in Database)

SGMS is architected to run immediately without requiring a pre-installed MySQL database instance:

### Step 2.1: Run the Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

* The backend will start on `http://localhost:8080/api`.
* On the first run, `DataInitializer` automatically provisions default departments, semesters, subjects, and demo accounts for all three roles.

### Step 2.2: Run the React Frontend

Open a new terminal tab/window:

```bash
cd frontend
npm install
npm run dev
```

* The frontend will start on `http://localhost:5173`.
* Open your browser and navigate to `http://localhost:5173`.

---

## 3. Running with MySQL Database (Production or Local MySQL)

If you prefer to connect SGMS to a local or cloud MySQL instance:

### Step 3.1: Create MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS sgms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3.2: Configure Environment Variables

In `backend/.env` (or set environment variables in your terminal):

```env
SPRING_PROFILES_ACTIVE=mysql
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/sgms_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password_here
```

Then start the backend:

```bash
cd backend
mvn spring-boot:run
```

---

## 4. Default Demo Accounts

Use these pre-seeded accounts to explore the respective role workflows:

| Role | Username / Identifier | Password | Access Rights & Purpose |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `Admin@123` | Institutional setup, manage users, review marks, authorize corrections, publish official semester statements |
| **FACULTY** | `prof.sharma` | `Faculty@123` | Assigned to CS101 & CS103; input internal and external assessment marks, save drafts, view class grade analytics |
| **FACULTY** | `prof.patel` | `Faculty@123` | Assigned to CS102 & CS104; enter marks, view subject rosters |
| **STUDENT** | `CS2024001` | `Student@123` | Alex Chen (Sem 1); view published grades, credit points, term SGPA, and download PDF Report Card |
| **STUDENT** | `CS2024002` | `Student@123` | Priya Sharma (Sem 1); view term statement |

> **Note on Login Screen:** Click any of the **Quick Demo Account** pills on the login page to automatically fill credentials.

---

## 5. Running Automated Backend Tests

Execute the full automated test suite (including boundary checks for marks calculation, credit-weighted SGPA, incomplete semester handling, and Spring Security context):

```bash
cd backend
mvn test
```

