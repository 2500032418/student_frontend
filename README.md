# Student Information Management System (SIMS)

A full-stack web application to manage student academic information including performance tracking, attendance management, records storage/retrieval, summary reporting, and contextual smart search.

## Tech Stack

- **Backend:** Java 17, Spring Boot 4.0.5, Spring Data JPA, PostgreSQL
- **Frontend:** React 19, Vite 8, React Router DOM
- **Auth:** JWT (jjwt), Spring Security (via interceptor)

---

## Prerequisites

- Java 17+
- Node.js 20+
- PostgreSQL 15+
- Maven (bundled via `mvnw`)

---

## PostgreSQL Setup

Run these commands in order to set up the database:

### 1. Start PostgreSQL Service

```bash
# Windows (run PowerShell as Admin)
net start postgresql-x64-15

# Or via pg_ctl
pg_ctl start -D "C:\Program Files\PostgreSQL\15\data"
```

### 2. Access PostgreSQL Shell

```bash
psql -U postgres
```

*(Enter password `root` when prompted)*

### 3. Create the Database

```sql
CREATE DATABASE "SaiNIikhil";
```

### 4. Verify Database Created

```sql
\l
```

*(Look for `SaiNIikhil` in the list)*

### 5. Connect to the Database

```sql
\c "SaiNIikhil";
```

### 6. Create Application User (if needed)

```sql
CREATE USER postgres WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE "SaiNIikhil" TO postgres;
```

### 7. Verify Connection Works

```sql
SELECT current_database();
```

*(Should return `SaiNIikhil`)*

### 8. Exit PostgreSQL Shell

```sql
\q
```

### Troubleshooting

**Check PostgreSQL status:**
```bash
pg_isready -U postgres
```

**List all running PostgreSQL services:**
```bash
Get-Service postgres*
```

**Reset password if needed:**
```bash
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'root';"
```

---

## Seeding Dummy Users (Hardcoded via SQL)

After creating the database and starting the backend once (so JPA creates the tables), run these SQL commands to insert dummy users:

### 1. Start Backend Once (Creates Tables)

```bash
cd Backend/CoreServices2
.\mvnw spring-boot:run
```

Wait until you see logs like `Created table "users"`, `Created table "student"`, etc., then stop the server with `Ctrl+C`.

### 2. Insert Dummy Users into PostgreSQL

Open a new terminal and run:

```bash
psql -U postgres -d "SaiNIikhil"
```

Then paste and run:

```sql
-- ========================================
-- DUMMY USERS FOR SIMS
-- Password is stored as plain text (no hashing)
-- role: 0 = Admin, 1 = Regular User
-- status: 1 = Active
-- ========================================

-- Admin Users (role=0)
INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Sai Nikhil', '+1 234 567 8900', 'sai.nikhil@example.com', 'admin123', 0, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Admin User', '+1 234 567 8901', 'admin@sims.com', 'admin123', 0, 1);

-- Regular / Staff Users (role=1)
INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('John Smith', '+1 234 567 8902', 'john.smith@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Sarah Johnson', '+1 234 567 8903', 'sarah.j@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Michael Brown', '+1 234 567 8904', 'michael.b@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Emily Davis', '+1 234 567 8905', 'emily.d@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('David Wilson', '+1 234 567 8906', 'david.w@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Lisa Anderson', '+1 234 567 8907', 'lisa.a@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Robert Taylor', '+1 234 567 8908', 'robert.t@example.com', 'password123', 1, 1);

INSERT INTO users (fullname, phone, email, password, role, status) VALUES
('Jennifer Thomas', '+1 234 567 8909', 'jennifer.t@example.com', 'password123', 1, 1);
```

### 3. Verify Users Were Inserted

```sql
SELECT id, fullname, email, 
       CASE WHEN role = 0 THEN 'Admin' ELSE 'User' END AS role_type,
       CASE WHEN status = 1 THEN 'Active' ELSE 'Inactive' END AS status
FROM users ORDER BY id;
```

### 4. Exit PostgreSQL

```sql
\q
```

### 5. Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `sai.nikhil@example.com` | `admin123` | **Admin** |
| `admin@sims.com` | `admin123` | **Admin** |
| `john.smith@example.com` | `password123` | User |
| `sarah.j@example.com` | `password123` | User |
| Any of the above user emails | `password123` | User |

### 6. Restart the Backend

```bash
.\mvnw spring-boot:run
```

Then open **http://localhost:5173** and log in with any of the above credentials.

---

## Running the Application

### Backend (Spring Boot)

```bash
cd Backend/CoreServices2
.\mvnw spring-boot:run
```

The backend starts at **http://localhost:8001**

### Frontend (React + Vite)

```bash
cd Frounted/Student_management
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | All students |
| POST | `/api/students` | Create student |
| GET | `/api/students/{id}` | Single student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |
| GET | `/api/students/search?q=` | Search students |
| GET | `/api/courses` | All courses |
| POST | `/api/courses` | Create course |
| GET | `/api/departments` | All departments |
| POST | `/api/departments` | Create department |
| GET | `/api/enrollments` | All enrollments |
| POST | `/api/enrollments` | Create enrollment |
| GET | `/api/grades` | All grades |
| POST | `/api/grades` | Record grade |
| GET | `/api/attendance` | All attendance records |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/reports/dashboard` | Dashboard summary |
| GET | `/api/reports/student/{id}` | Student report |
| GET | `/api/reports/course/{id}` | Course report |
| GET | `/api/search?q=` | Contextual smart search |

## Smart Search Examples

| Query | Insight Generated |
|-------|-------------------|
| `low attendance` | Students below 75% attendance |
| `top performers` | Ranked performance list |
| `course statistics` | Enrollment per course |
| `grade summary` | Average percentages per student |
| `system overview` | Total counts for all entities |

## Database Tables (Auto-Created by JPA)

- `users` — Authentication
- `department` — Academic departments
- `student` — Student profiles
- `course` — Course catalog
- `enrollment` — Student-course links
- `grade` — Exam scores and letter grades
- `attendance` — Daily attendance records
