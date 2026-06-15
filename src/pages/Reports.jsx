import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getDashboardSummary, getAllStudentsReports } from '../services/api';

function Reports() {
  const userRole = localStorage.getItem('userRole') || '1';
  if (userRole === '2') {
    return <Navigate to="/" replace />;
  }

  const [summary, setSummary] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [dRes, rRes] = await Promise.all([
        getDashboardSummary(), getAllStudentsReports()
      ]);
      if (dRes.code === 200) setSummary(dRes.data);
      if (rRes.code === 200) setAllReports(rRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="page-loading">Loading reports...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Complete student performance overview</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card stat-students">
          <div className="stat-info">
            <span className="stat-number">{summary?.totalStudents || 0}</span>
            <span className="stat-label">Total Students</span>
          </div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-info">
            <span className="stat-number">{summary?.activeStudents || 0}</span>
            <span className="stat-label">Active Students</span>
          </div>
        </div>
        <div className="stat-card stat-courses">
          <div className="stat-info">
            <span className="stat-number">{summary?.totalCourses || 0}</span>
            <span className="stat-label">Courses</span>
          </div>
        </div>
        <div className="stat-card stat-enrollments">
          <div className="stat-info">
            <span className="stat-number">{summary?.totalEnrollments || 0}</span>
            <span className="stat-label">Enrollments</span>
          </div>
        </div>
      </div>

      {/* All Students Report Table */}
      <div className="dash-section">
        <h2>All Students Report</h2>
        {allReports.length === 0 ? (
          <p className="text-muted">No student data available.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>Student ID</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>Name</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>Email</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>Attendance %</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>Avg Score %</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>GPA</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #e0e0e0' }}>Courses</th>
                </tr>
              </thead>
              <tbody>
                {allReports.map((r, idx) => {
                  const s = r.student || {};
                  const att = r.attendance || {};
                  const perf = r.performance || {};
                  return (
                    <tr key={s.id || idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 12px' }}>{s.studentId || '-'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.firstName || ''} {s.lastName || ''}</td>
                      <td style={{ padding: '10px 12px' }}>{s.email || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          color: att.percentage >= 75 ? '#2e7d32' : att.percentage >= 50 ? '#e65100' : '#c62828',
                          fontWeight: 600
                        }}>
                          {att.percentage || 0}%
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          color: perf.averagePercentage >= 75 ? '#2e7d32' : perf.averagePercentage >= 50 ? '#e65100' : '#c62828',
                          fontWeight: 600
                        }}>
                          {perf.averagePercentage || 0}%
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{perf.gpa || 0}</td>
                      <td style={{ padding: '10px 12px' }}>{r.enrolledCourses || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
