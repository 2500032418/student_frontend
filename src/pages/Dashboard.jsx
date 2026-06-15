import { useState, useEffect } from 'react';
import { getDashboardSummary, getEnrollmentsByStudent } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const userRole = localStorage.getItem('userRole') || '1';
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const studentId = localStorage.getItem('studentId');
  const isStudent = userRole === '2';

  const [data, setData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      if (isStudent && studentId) {
        const [dashRes, enrollRes] = await Promise.all([
          getDashboardSummary(),
          getEnrollmentsByStudent(studentId),
        ]);
        if (dashRes.code === 200) setData(dashRes.data);
        if (enrollRes.code === 200) setEnrolledCourses(enrollRes.data);
      } else {
        const res = await getDashboardSummary();
        if (res.code === 200) setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Student Information Management System Overview</p>
      </div>

      {/* Student: Welcome card + enrolled courses */}
      {isStudent && (
        <>
          <div className="student-welcome-card">
            <div className="welcome-avatar">{userEmail.charAt(0).toUpperCase()}</div>
            <div className="welcome-text">
              <h2>Welcome, {userEmail.split('@')[0]}!</h2>
              <p>You are enrolled in <strong>{enrolledCourses.length}</strong> course{enrolledCourses.length !== 1 ? 's' : ''}. Use the sidebar to check your <strong>Grades</strong> and <strong>Attendance</strong>.</p>
            </div>
          </div>

          {enrolledCourses.length > 0 && (
            <div className="dashboard-sections" style={{ marginBottom: 24 }}>
              <div className="dash-section">
                <h2>My Enrolled Courses</h2>
                <div className="enrolled-courses-list">
                  {enrolledCourses.map((e) => (
                    <div key={e.id} className="enrolled-course-item">
                      <div className="enrolled-course-icon">📚</div>
                      <div className="enrolled-course-info">
                        <span className="enrolled-course-name">{e.course?.name || 'Course'}</span>
                        <span className="enrolled-course-code">{e.course?.code || ''}</span>
                      </div>
                      <span className="enrolled-course-status">
                        {e.status === 1 ? 'Active' : 'Completed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Admin/Teacher: Stats grid */}
      {!isStudent && (
        <div className="stats-grid">
          <div className="stat-card stat-students">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-number">{data?.totalStudents || 0}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>
          <div className="stat-card stat-active">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-number">{data?.activeStudents || 0}</span>
              <span className="stat-label">Active Students</span>
            </div>
          </div>
          <div className="stat-card stat-courses">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <span className="stat-number">{data?.totalCourses || 0}</span>
              <span className="stat-label">Total Courses</span>
            </div>
          </div>
          <div className="stat-card stat-enrollments">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <span className="stat-number">{data?.totalEnrollments || 0}</span>
              <span className="stat-label">Enrollments</span>
            </div>
          </div>
        </div>
      )}

      {!isStudent && (
        <div className="dashboard-sections">
          <div className="dash-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <a href="/students" className="action-card">
                <span className="action-icon">➕</span>
                <span>Add Student</span>
              </a>
              <a href="/courses" className="action-card">
                <span className="action-icon">➕</span>
                <span>Add Course</span>
              </a>
              <a href="/enrollments" className="action-card">
                <span className="action-icon">📋</span>
                <span>New Enrollment</span>
              </a>
              <a href="/attendance" className="action-card">
                <span className="action-icon">✅</span>
                <span>Mark Attendance</span>
              </a>
              <a href="/grades" className="action-card">
                <span className="action-icon">🏆</span>
                <span>Record Grade</span>
              </a>
              <a href="/search" className="action-card">
                <span className="action-icon">🔍</span>
                <span>Smart Search</span>
              </a>
            </div>
          </div>

          {data?.topStudents && data.topStudents.length > 0 && (
            <div className="dash-section">
              <h2>Top Performing Students</h2>
              <div className="top-students-list">
                {data.topStudents.slice(0, 5).map((row, i) => (
                  <div key={i} className="top-student-item">
                    <span className="top-rank">#{i + 1}</span>
                    <span className="top-name">Student ID: {row[0]}</span>
                    <span className="top-score">
                      {Math.round(parseFloat(row[1]) * 100) / 100}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;