# SIMS — Role-Based Feature Reference

> **Student Information Management System**  
> Complete breakdown of what each role can access and do.

---

## Role Overview

| Icon | Role | Code | Description |
|------|------|------|-------------|
| 🛡️ | **Admin** | `role = 0` | Full system control — manage everything |
| 👨‍🏫 | **Teacher** | `role = 1` | Manage students, grades, attendance, enrollments |
| 🎓 | **Student** | `role = 2` | View own performance, attendance, and search |

---

## 1. 📊 Dashboard (`/`)

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| Total Students count | ✅ | ✅ | ✅ |
| Active Students count | ✅ | ✅ | ✅ |
| Total Courses count | ✅ | ✅ | ✅ |
| Enrollment count | ✅ | ✅ | ✅ |
| Top Performing Students list | ✅ | ✅ | ❌ |
| Quick Action — Add Student | ✅ | ✅ | ❌ |
| Quick Action — Add Course | ✅ | ✅ | ❌ |
| Quick Action — New Enrollment | ✅ | ✅ | ❌ |
| Quick Action — Mark Attendance | ✅ | ✅ | ❌ |
| Quick Action — Record Grade | ✅ | ✅ | ❌ |
| Quick Action — Smart Search | ✅ | ✅ | ✅ |

**Student sees:** Just the 4 stat cards (counts) and the Smart Search quick action. No top performers or management actions.

---

## 2. 👥 Students (`/students`)

**Sidebar visibility:** 🛡️ Admin ✅ | 👨‍🏫 Teacher ✅ | 🎓 Student ❌ (hidden)

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| View full student list | ✅ | ✅ | 🚫 Page hidden |
| Search students by name/ID/email/phone | ✅ | ✅ | 🚫 |
| Add new student | ✅ | ✅ | 🚫 |
| Edit student details | ✅ | ✅ | 🚫 |
| **Delete student** | ✅ | ❌ | 🚫 |

> ⚠️ **Teacher** can add and edit students but should NOT be able to delete. Delete is Admin-only for safety.

---

## 3. 📚 Courses (`/courses`)

**Sidebar visibility:** 🛡️ Admin ✅ | 👨‍🏫 Teacher ✅ | 🎓 Student ❌ (hidden)

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| View all courses | ✅ | ✅ | 🚫 Page hidden |
| Add course | ✅ | ❌ | 🚫 |
| Edit course | ✅ | ❌ | 🚫 |
| Delete course | ✅ | ❌ | 🚫 |

> ⚠️ **Teacher** can see courses but cannot modify them (add/edit/delete). Read-only view.

---

## 4. 📋 Enrollments (`/enrollments`)

**Sidebar visibility:** 🛡️ Admin ✅ | 👨‍🏫 Teacher ✅ | 🎓 Student ❌ (hidden)

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| View all enrollments | ✅ | ✅ | 🚫 Page hidden |
| Enroll student in course | ✅ | ✅ | 🚫 |
| Mark enrollment as Completed | ✅ | ✅ | 🚫 |
| **Delete enrollment** | ✅ | ❌ | 🚫 |

> ⚠️ **Teacher** can create enrollments and mark them completed, but cannot permanently delete them.

---

## 5. 🏆 Performance / Grades (`/grades`)

**Sidebar label:** Admin/Teacher → "Performance" | Student → **"My Grades"**

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| View ALL students' grades | ✅ | ✅ | ❌ |
| View OWN grades only | 🚫 | 🚫 | ✅ |
| Record new grade | ✅ | ✅ | ❌ |
| Edit grade | ✅ | ✅ | ❌ |
| **Delete grade** | ✅ | ❌ | ❌ |

> 🎓 **Student** only sees their own grades. The page shows a filtered view based on their email/ID.
> 👨‍🏫 **Teacher** can add and edit grades for any student, but cannot delete.

---

## 6. ✅ Attendance (`/attendance`)

**Sidebar label:** Admin/Teacher → "Attendance" | Student → **"My Attendance"**

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| View ALL attendance records | ✅ | ✅ | ❌ |
| View OWN attendance only | 🚫 | 🚫 | ✅ |
| Mark attendance (Present/Absent/Late/Excused) | ✅ | ✅ | ❌ |
| Edit attendance status | ✅ | ✅ | ❌ |
| **Delete attendance record** | ✅ | ❌ | ❌ |

> 🎓 **Student** only sees their own attendance with a summary percentage.
> 👨‍🏫 **Teacher** can mark and edit attendance for any student.

---

## 7. 📈 Reports (`/reports`)

**Sidebar visibility:** 🛡️ Admin ✅ | 👨‍🏫 Teacher ✅ | 🎓 Student ❌ (hidden)

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| Dashboard summary stats | ✅ | ✅ | 🚫 Page hidden |
| Generate Student Report | ✅ | ✅ | 🚫 |
| Generate Course Report | ✅ | ✅ | 🚫 |

> Reports contain sensitive aggregate data and are hidden from Students entirely.

---

## 8. 🔍 Smart Search (`/search`)

**Sidebar visibility:** 🛡️ Admin ✅ | 👨‍🏫 Teacher ✅ | 🎓 Student ❌ (hidden)

| Feature | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| Search students by keyword | ✅ | ✅ | 🚫 Page hidden |
| Search courses by keyword | ✅ | ✅ | 🚫 |
| View Intelligent Insights | ✅ | ✅ | 🚫 |

> 🎓 **Students** no longer have access to Smart Search. It is restricted to Admin and Teacher only.

---

## 9. 👤 Sidebar (Common)

| Element | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|---------|:---------:|:-----------:|:----------:|
| User avatar (first letter of email) | ✅ | ✅ | ✅ |
| Email display | ✅ | ✅ | ✅ |
| Role badge | 🛡️ **Administrator** | 👨‍🏫 **Teacher** | 🎓 **Student** |
| Dashboard link | ✅ | ✅ | ✅ |
| Students link | ✅ | ✅ | ❌ |
| Courses link | ✅ | ✅ | ❌ |
| Enrollments link | ✅ | ✅ | ❌ |
| Performance/Grades link | ✅ | ✅ | ✅ (as "My Grades") |
| Attendance link | ✅ | ✅ | ✅ (as "My Attendance") |
| Reports link | ✅ | ✅ | ❌ |
| Smart Search link | ✅ | ✅ | ❌ |
| Sign Out button | ✅ | ✅ | ✅ |

---

## Summary Matrix

| Page | 🛡️ Admin | 👨‍🏫 Teacher | 🎓 Student |
|------|:---------:|:-----------:|:----------:|
| **Dashboard** | Full | Full | Limited (counts only) |
| **Students** | Full CRUD | Add/Edit, No Delete | ❌ Hidden |
| **Courses** | Full CRUD | Read-only | ❌ Hidden |
| **Enrollments** | Full CRUD | Add/Complete, No Delete | ❌ Hidden |
| **Grades** | Full CRUD | Add/Edit, No Delete | View own only |
| **Attendance** | Full CRUD | Mark/Edit, No Delete | View own only |
| **Reports** | Full | Full | ❌ Hidden |
| **Smart Search** | Full with insights | Full with insights | ❌ Hidden |

---

## Current Implementation Status

| Layer | Status |
|-------|--------|
| ✅ **Sidebar hiding** | Students don't see restricted menu items |
| ✅ **Login role validation** | Backend checks selected role matches DB role |
| ✅ **Signup role selection** | Users pick Teacher or Student on registration |
| ✅ **Page-level guards** | Implemented — students are redirected to Dashboard if they try restricted pages by URL |
| ⚠️ **Backend role filters** | APIs return all data regardless of role |

---

## To Add Full Security (Future)

1. ✅ **Page-level guards** — Implemented. Students are redirected to Dashboard if they navigate to restricted pages.
2. ⏳ **Backend role filters** — Add Spring Security or a filter that restricts API data by role
3. ⏳ **Student-specific APIs** — Return only grade/attendance data for the logged-in student

---

*Document generated for SIMS — Student Information Management System*
