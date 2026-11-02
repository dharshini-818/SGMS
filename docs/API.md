# SGMS REST API Documentation

The Student Grade Management System backend exposes RESTful endpoints secured via **JWT (JSON Web Tokens)** with Spring Security method-level authorization (`@PreAuthorize`).

**Base URL:** `http://localhost:8080/api`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates via username, email, or student roll number. Returns JWT token, user details, and role. |
| `GET` | `/auth/me` | Authenticated | Retrieves current authenticated principal details. |

### Sample Login Request:
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

### Sample Login Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "email": "admin@sgms.edu",
    "role": "ROLE_ADMIN",
    "entityId": null,
    "identifier": null
  }
}
```

---

## 2. Administrator Endpoints (`/api/admin`)
*Requires `ROLE_ADMIN` authority in the Bearer token.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Returns summary cards (total students, faculties, subjects, enrollments), grade distribution, and recent audit activities. |
| `GET` | `/admin/students` | Paginated search & filter for students by department, semester, and academic session. |
| `GET` | `/admin/students/{id}` | Fetches detailed profile of a student. |
| `POST` | `/admin/students` | Registers student, generates credentials, and auto-enrolls into current semester courses. |
| `PUT` | `/admin/students/{id}` | Updates student profile information. |
| `PATCH` | `/admin/students/{id}/status` | Toggles student active/inactive status. |
| `DELETE` | `/admin/students/{id}` | Deletes a student with cascaded cleanup. |
| `GET` | `/admin/faculties` | Paginated list of faculty members. |
| `POST` | `/admin/faculties` | Registers a faculty member with employee ID and department. |
| `PUT` | `/admin/faculties/{id}` | Updates faculty details. |
| `PATCH` | `/admin/faculties/{id}/status` | Toggles faculty account status. |
| `GET` | `/admin/subjects` | Lists subjects with assigned faculty and enrolled count. |
| `POST` | `/admin/subjects` | Creates course subject with credit allocation. |
| `PUT` | `/admin/subjects/{id}` | Updates course subject. |
| `POST` | `/admin/subjects/{id}/assign-faculty` | Assigns or reassigns teaching faculty to subject. |
| `GET` | `/admin/departments` | Lists all departments. |
| `POST` | `/admin/departments` | Creates a new department. |
| `GET` | `/admin/semesters` | Lists all semesters. |
| `GET` | `/admin/academic-years` | Lists all academic sessions. |
| `GET` | `/admin/grades` | Audits marks entered by faculty across subjects and semesters. |
| `PUT` | `/admin/grades/{id}/correct` | Authorizes an administrative mark correction with mandatory justification and audit logging. |
| `POST` | `/admin/results/publish` | Formally publishes or unpublishes semester or subject results. |

---

## 3. Faculty Endpoints (`/api/faculty`)
*Requires `ROLE_FACULTY` or `ROLE_ADMIN`.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/faculty/subjects` | Retrieves course subjects assigned to the calling faculty member. |
| `GET` | `/faculty/subjects/{id}/roster` | Retrieves enrolled student list for the subject with current draft or submitted marks. |
| `POST` | `/faculty/marks/save` | Saves marks as a draft or submits them for review. Validates internal (0-50) and external (0-50). |
| `GET` | `/faculty/subjects/{id}/analytics` | Computes average score, pass rate, and grade distribution for the subject. |

### Sample Marks Entry Payload:
```json
{
  "subjectId": 1,
  "academicYearId": 2,
  "draft": true,
  "marksList": [
    {
      "enrollmentId": 1,
      "internalMarks": 45.0,
      "externalMarks": 47.0,
      "remarks": "Excellent lab and theory performance"
    }
  ]
}
```

---

## 4. Student Endpoints (`/api/student`)
*Accessible by students for their own records (`ROLE_STUDENT`).*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/student/profile` | Returns authenticated student profile, department, and current semester. |
| `GET` | `/student/semesters` | Returns all semesters in which the student has course enrollments. |
| `GET` | `/student/results/{semesterId}` | Returns published statement of marks and term SGPA. Unpublished scores are concealed. |
| `GET` | `/student/results/cumulative` | Returns cumulative GPA (CGPA) and historical semester statements. |

---

## 5. Reports & Document Export (`/api/reports`)

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/student/{stuId}/semester/{semId}/pdf` | Student (own) / Admin | Generates and streams official PDF Statement of Marks with institutional header and SGPA. |
| `GET` | `/reports/subject/{subId}/csv` | Assigned Faculty / Admin | Exports comprehensive tabular marks roster to standard CSV format. |

---

## 6. Health & Status (`/api/health`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Returns application health status, database connection state, and uptime timestamp. |

