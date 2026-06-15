const GATEWAY_BASE = 'https://student-project-backend-3tem.onrender.com';

async function request(url, options = {}) {
  const token = localStorage.getItem('jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${GATEWAY_BASE}${url}`, {
    ...options,
    headers,
  });
  return response.json();
}

async function authRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${GATEWAY_BASE}${url}`, {
    ...options,
    headers,
  });
  return response.json();
}

// Students
export const getStudents = () => request('/api/students');
export const getStudent = (id) => request(`/api/students/${id}`);
export const createStudent = (data) => request('/api/students', { method: 'POST', body: JSON.stringify(data) });
export const updateStudent = (id, data) => request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStudent = (id) => request(`/api/students/${id}`, { method: 'DELETE' });
export const searchStudents = (q) => request(`/api/students/search?q=${encodeURIComponent(q)}`);

// Courses
export const getCourses = () => request('/api/courses');
export const getCourse = (id) => request(`/api/courses/${id}`);
export const createCourse = (data) => request('/api/courses', { method: 'POST', body: JSON.stringify(data) });
export const updateCourse = (id, data) => request(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCourse = (id) => request(`/api/courses/${id}`, { method: 'DELETE' });
export const searchCourses = (q) => request(`/api/courses/search?q=${encodeURIComponent(q)}`);

// Departments
export const getDepartments = () => request('/api/departments');
export const createDepartment = (data) => request('/api/departments', { method: 'POST', body: JSON.stringify(data) });

// Enrollments
export const getEnrollments = () => request('/api/enrollments');
export const createEnrollment = (data) => request('/api/enrollments', { method: 'POST', body: JSON.stringify(data) });
export const updateEnrollmentStatus = (id, status) => request(`/api/enrollments/${id}/status?status=${status}`, { method: 'PUT' });
export const deleteEnrollment = (id) => request(`/api/enrollments/${id}`, { method: 'DELETE' });
export const getEnrollmentsByStudent = (studentId) => request(`/api/enrollments/student/${studentId}`);
export const getEnrollmentsByCourse = (courseId) => request(`/api/enrollments/course/${courseId}`);

// Grades
export const getGrades = () => request('/api/grades');
export const createGrade = (data) => request('/api/grades', { method: 'POST', body: JSON.stringify(data) });
export const updateGrade = (id, data) => request(`/api/grades/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGrade = (id) => request(`/api/grades/${id}`, { method: 'DELETE' });
export const getGradesByStudent = (studentId) => request(`/api/grades/student/${studentId}`);
export const getStudentPerformanceSummary = (studentId) => request(`/api/grades/student/${studentId}/summary`);

// Attendance
export const getAttendanceRecords = () => request('/api/attendance');
export const createAttendance = (data) => request('/api/attendance', { method: 'POST', body: JSON.stringify(data) });
export const createBulkAttendance = (records) => request('/api/attendance/bulk', { method: 'POST', body: JSON.stringify(records) });
export const updateAttendance = (id, data) => request(`/api/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAttendance = (id) => request(`/api/attendance/${id}`, { method: 'DELETE' });
export const getAttendanceByStudent = (studentId) => request(`/api/attendance/student/${studentId}`);
export const getAttendanceSummary = (studentId) => request(`/api/attendance/student/${studentId}/summary`);

// Reports
export const getDashboardSummary = () => request('/api/reports/dashboard');
export const getStudentReport = (studentId) => request(`/api/reports/student/${studentId}`);
export const getCourseReport = (courseId) => request(`/api/reports/course/${courseId}`);
export const getAllStudentsReports = () => request('/api/reports/all-students');

// Search
export const contextualSearch = (q) => request(`/api/search?q=${encodeURIComponent(q)}`);

// Semantic / Vector Search (MongoDB Vector Search)
export const semanticSearch = (q, limit = 10) => request(`/api/vector/search?q=${encodeURIComponent(q)}&limit=${limit}`);
export const indexStudent = (data) => request('/api/vector/index', { method: 'POST', body: JSON.stringify(data) });

// Auth
export const signin = (username, password, role) =>
  authRequest('/user/signin', {
    method: 'POST',
    body: JSON.stringify(role !== undefined ? { username, password, role } : { username, password }),
  });

export const signup = (data) =>
  authRequest('/user/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Announcements (via Node.js backend through gateway)
export const getAnnouncements = () => request('/api/announcements');
export const getAnnouncement = (id) => request(`/api/announcements/${id}`);
export const getAnnouncementsByRole = (role) => request(`/api/announcements/role/${role}`);
export const createAnnouncement = (data) => request('/api/announcements', { method: 'POST', body: JSON.stringify(data) });
export const updateAnnouncement = (id, data) => request(`/api/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAnnouncement = (id) => request(`/api/announcements/${id}`, { method: 'DELETE' });

export default {
  getStudents, getStudent, createStudent, updateStudent, deleteStudent, searchStudents,
  getCourses, getCourse, createCourse, updateCourse, deleteCourse, searchCourses,
  getDepartments, createDepartment,
  getEnrollments, createEnrollment, updateEnrollmentStatus, deleteEnrollment,
  getEnrollmentsByStudent, getEnrollmentsByCourse,
  getGrades, createGrade, updateGrade, deleteGrade, getGradesByStudent, getStudentPerformanceSummary,
  getAttendanceRecords, createAttendance, createBulkAttendance, updateAttendance, deleteAttendance,
  getAttendanceByStudent, getAttendanceSummary,
  getDashboardSummary, getStudentReport, getCourseReport, getAllStudentsReports,
  contextualSearch, semanticSearch, indexStudent,
  signin, signup,
  getAnnouncements, getAnnouncement, getAnnouncementsByRole, createAnnouncement, updateAnnouncement, deleteAnnouncement,
};
