import { useState, useEffect } from 'react';
import { createBulkAttendance, getStudents, getCourses, getAttendanceByStudent, getAttendanceSummary } from '../services/api';
import './PageStyles.css';
import './Dashboard.css';

function Attendance() {
  const userRole = localStorage.getItem('userRole') || '1';
  const isStudent = userRole === '2';
  const searchParams = new URLSearchParams(window.location.search);
  const studentId = searchParams.get('studentId');

  const [courses, setCourses] = useState([]);
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [presentMap, setPresentMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectAllPresent, setSelectAllPresent] = useState(false);

  const [myRecords, setMyRecords] = useState([]);
  const [mySummary, setMySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isStudent && studentId) {
      loadStudentAttendance();
    } else if (!isStudent) {
      loadStudents();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadStudentAttendance() {
    try {
      const [recRes, sumRes] = await Promise.all([
        getAttendanceByStudent(studentId),
        getAttendanceSummary(studentId),
      ]);
      if (recRes.code === 200) setMyRecords(recRes.data || []);
      if (sumRes.code === 200) setMySummary(sumRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    try {
      const [cRes, sRes] = await Promise.all([getCourses(), getStudents()]);
      if (cRes.code === 200) setCourses(cRes.data);
      if (sRes.code === 200) {
        setAttendanceStudents(sRes.data);
        const map = {};
        sRes.data.forEach(s => map[s.id] = false);
        setPresentMap(map);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function togglePresent(studentId) {
    setPresentMap(prev => {
      const next = { ...prev, [studentId]: !prev[studentId] };
      return next;
    });
  }

  function handleSelectAllPresent() {
    const newVal = !selectAllPresent;
    setSelectAllPresent(newVal);
    const map = {};
    attendanceStudents.forEach(s => map[s.id] = newVal);
    setPresentMap(map);
  }

  async function handleSave() {
    if (attendanceStudents.length === 0 || courses.length === 0) return;
    setSaving(true);
    setMessage('');
    try {
      const courseId = courses[0].id;
      const recordsToSave = attendanceStudents
        .filter(s => presentMap[s.id])
        .map(s => ({ studentId: s.id, courseId, status: 1 }));
      const res = await createBulkAttendance(recordsToSave);
      if (res.code === 200) {
        setMessage('Save attendance successfully');
      } else {
        setMessage('Error: ' + (res.message || 'Save failed'));
      }
    } catch (e) {
      setMessage('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  const absentCount = attendanceStudents.filter(s => !presentMap[s.id]).length;

  const statusLabel = (status) => {
    switch (status) {
      case 0: return 'Absent';
      case 1: return 'Present';
      case 2: return 'Late';
      case 3: return 'Excused';
      default: return 'Unknown';
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case 0: return 'badge-absent';
      case 1: return 'badge-present';
      case 2: return 'badge-late';
      case 3: return 'badge-excused';
      default: return '';
    }
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  if (isStudent) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>My Attendance</h1>
            <p>View your attendance records</p>
          </div>
        </div>

        {mySummary && (
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card stat-students">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-number">{mySummary.totalClasses || 0}</span>
                <span className="stat-label">Total Classes</span>
              </div>
            </div>
            <div className="stat-card stat-active">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-number">{mySummary.present || 0}</span>
                <span className="stat-label">Present</span>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#fff3e0' }}>
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <span className="stat-number">{mySummary.absent || 0}</span>
                <span className="stat-label">Absent</span>
              </div>
            </div>
            <div className="stat-card" style={{ background: mySummary.percentage >= 75 ? '#e8f5e9' : '#ffebee' }}>
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-number">{mySummary.percentage || 0}%</span>
                <span className="stat-label">Attendance Rate</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>Course</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRecords.length === 0 && (
                <tr><td colSpan="3" style={{ padding: 24, textAlign: 'center', color: '#888' }}>No attendance records found.</td></tr>
              )}
              {myRecords.map((rec) => (
                <tr key={rec.id}>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>{rec.date}</td>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>{rec.course?.name || '-'}</td>
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <span className={`grade-badge ${statusClass(rec.status)}`}>
                      {statusLabel(rec.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Student Attendance</h1>
          <p>Mark present / absent for all students</p>
        </div>
      </div>

      <div className="dash-section">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
          background: '#f5f5f5', borderRadius: '8px 8px 0 0',
          border: '1px solid #e0e0e0', borderBottom: 'none'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '1rem' }}>
            <input type="checkbox" checked={selectAllPresent} onChange={handleSelectAllPresent} style={{ width: 20, height: 20 }} />
            <strong>Select All Present</strong>
          </label>
          <span style={{
            marginLeft: 'auto', fontWeight: 600, fontSize: '0.95rem',
            color: absentCount > 0 ? '#e65100' : '#2e7d32'
          }}>
            {attendanceStudents.length - absentCount} Present &middot; {absentCount} Absent
          </span>
        </div>

        <div style={{
          maxHeight: 400, overflowY: 'auto',
          border: '1px solid #e0e0e0', borderRadius: '0 0 8px 8px',
          marginBottom: 16
        }}>
          {attendanceStudents.length === 0 && (
            <div style={{ padding: 20, color: '#888', textAlign: 'center' }}>No students found.</div>
          )}
          {attendanceStudents.map((s) => (
            <div key={s.id} onClick={() => togglePresent(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
              borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
              background: presentMap[s.id] ? '#ffffff' : '#fce4ec',
              transition: 'background 0.15s'
            }}>
              <span style={{ fontWeight: 500, minWidth: 200 }}>{s.firstName} {s.lastName}</span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{s.studentId}</span>
              <span style={{ flex: 1 }} />
              <input type="checkbox" checked={!!presentMap[s.id]} readOnly style={{ width: 20, height: 20, cursor: 'pointer' }} />
            </div>
          ))}
        </div>

        {message && (
          <p style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 6, fontWeight: 500,
            color: message.startsWith('Error') ? '#c62828' : '#2e7d32',
            background: message.startsWith('Error') ? '#ffebee' : '#e8f5e9'
          }}>{message}</p>
        )}

        <button className="btn btn-primary" onClick={handleSave} disabled={saving || attendanceStudents.length === 0}>
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
}

export default Attendance;
