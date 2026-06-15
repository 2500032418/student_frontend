import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getEnrollments, createEnrollment, updateEnrollmentStatus, deleteEnrollment, getStudents, getCourses } from '../services/api';
import DataTable from '../components/DataTable';

function Enrollments() {
  // Role guard: Students cannot access this page
  const userRole = localStorage.getItem('userRole') || '1';
  if (userRole === '2') {
    return <Navigate to="/" replace />;
  }

  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: '', courseId: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [eRes, sRes, cRes] = await Promise.all([getEnrollments(), getStudents(), getCourses()]);
      if (eRes.code === 200) setEnrollments(eRes.data);
      if (sRes.code === 200) setStudents(sRes.data.filter(s => s.status === 1));
      if (cRes.code === 200) setCourses(cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await createEnrollment({ studentId: parseInt(form.studentId), courseId: parseInt(form.courseId) });
    if (res && res.code === 200) {
      setShowForm(false);
      setForm({ studentId: '', courseId: '' });
      loadData();
    }
  }

  async function handleComplete(enrollment) {
    const res = await updateEnrollmentStatus(enrollment.id, 0);
    if (res && res.code === 200) loadData();
  }

  async function handleDelete(enrollment) {
    if (window.confirm('Remove this enrollment?')) {
      const res = await deleteEnrollment(enrollment.id);
      if (res && res.code === 200) loadData();
    }
  }

  const columns = [
    { key: 'student', label: 'Student', render: (r) => r.student ? `${r.student.firstName} ${r.student.lastName}` : '-' },
    { key: 'course', label: 'Course', render: (r) => r.course?.name || '-' },
    { key: 'enrollmentDate', label: 'Enrolled Date', render: (r) => r.enrollmentDate ? new Date(r.enrollmentDate).toLocaleDateString() : '-' },
    { key: 'status', label: 'Status', render: (r) => r.status === 1 ? 'Active' : r.status === 0 ? 'Completed' : 'Dropped' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Enrollments</h1>
          <p>Manage student course enrollments</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Enrollment</button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enrollments}
        loading={loading}
        onEdit={(r) => r.status === 1 ? handleComplete(r) : null}
        onDelete={handleDelete}
        emptyMessage="No enrollments yet."
      />

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Enrollment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student *</label>
                  <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Course *</label>
                  <select required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Enroll</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enrollments;
