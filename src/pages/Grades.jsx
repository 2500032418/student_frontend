import { useState, useEffect } from 'react';
import { getGrades, getGradesByStudent, createGrade, updateGrade, deleteGrade, getEnrollments, getEnrollmentsByStudent, getStudents, getCourses } from '../services/api';
import DataTable from '../components/DataTable';

function Grades() {
  const userRole = localStorage.getItem('userRole') || '1';
  const isStudent = userRole === '2';
  const searchParams = new URLSearchParams(window.location.search);
  const studentId = searchParams.get('studentId');

  const [grades, setGrades] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ enrollment: { id: '' }, examType: 'MIDTERM', score: '', totalScore: 100, remarks: '' });
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const calls = isStudent && studentId
        ? [getGradesByStudent(studentId), getEnrollmentsByStudent(studentId), getStudents(), getCourses()]
        : [getGrades(), getEnrollments(), getStudents(), getCourses()];
      const [gRes, eRes, sRes, cRes] = await Promise.all(calls);
      if (gRes.code === 200) setGrades(gRes.data);
      if (eRes.code === 200) setEnrollments(eRes.data);
      if (sRes.code === 200) setStudents(sRes.data);
      if (cRes.code === 200) setCourses(cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function getStudentEnrollments() {
    if (!selectedStudent) return enrollments;
    return enrollments.filter(e => e.student?.id === parseInt(selectedStudent));
  }

  function openCreate() {
    setEditing(null);
    setSelectedStudent('');
    setForm({ enrollment: { id: '' }, examType: 'MIDTERM', score: '', totalScore: 100, remarks: '' });
    setShowForm(true);
  }

  function openEdit(grade) {
    setEditing(grade);
    setSelectedStudent(grade.enrollment?.student?.id?.toString() || '');
    setForm({
      enrollment: grade.enrollment ? { id: grade.enrollment.id } : { id: '' },
      examType: grade.examType || 'MIDTERM',
      score: grade.score?.toString() || '',
      totalScore: grade.totalScore?.toString() || '100',
      remarks: grade.remarks || ''
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      enrollment: { id: parseInt(form.enrollment.id) },
      examType: form.examType,
      score: parseFloat(form.score),
      totalScore: parseFloat(form.totalScore),
      remarks: form.remarks
    };
    if (editing) {
      await updateGrade(editing.id, payload);
    } else {
      await createGrade(payload);
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  }

  async function handleDelete(grade) {
    if (window.confirm('Delete this grade record?')) {
      await deleteGrade(grade.id);
      loadData();
    }
  }

  const columns = [
    { key: 'enrollment', label: 'Student', render: (r) => r.enrollment?.student ? `${r.enrollment.student.firstName} ${r.enrollment.student.lastName}` : '-' },
    { key: 'enrollment', label: 'Course', render: (r) => r.enrollment?.course?.name || '-' },
    { key: 'examType', label: 'Exam Type' },
    { key: 'score', label: 'Score', render: (r) => `${r.score}/${r.totalScore}` },
    { key: 'percentage', label: '%', render: (r) => `${Math.round(r.percentage * 100) / 100}%` },
    { key: 'grade', label: 'Grade', render: (r) => <span className={`grade-badge grade-${r.grade?.toLowerCase()}`}>{r.grade || '-'}</span> },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Grades & Performance</h1>
          <p>Track and manage academic performance</p>
        </div>
        <div className="header-actions">
          {!isStudent && (
            <button className="btn btn-primary" onClick={openCreate}>+ Record Grade</button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={grades}
        loading={loading}
        onEdit={isStudent ? null : openEdit}
        onDelete={isStudent ? null : handleDelete}
        emptyMessage="No grade records yet."
      />

      {!isStudent && showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Grade' : 'Record Grade'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student</label>
                  <select value={selectedStudent} onChange={(e) => { setSelectedStudent(e.target.value); setForm({ ...form, enrollment: { id: '' } }); }}>
                    <option value="">All Students</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Enrollment (Course) *</label>
                  <select required value={form.enrollment.id} onChange={(e) => setForm({ ...form, enrollment: { id: e.target.value } })}>
                    <option value="">Select Course</option>
                    {getStudentEnrollments().filter(e => e.status === 1).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.course?.name} - {e.student?.firstName} {e.student?.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Exam Type *</label>
                  <select required value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
                    <option value="MIDTERM">Midterm</option>
                    <option value="FINAL">Final</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="ASSIGNMENT">Assignment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Score *</label>
                  <input type="number" step="0.1" min="0" required value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Total Score *</label>
                  <input type="number" step="0.1" min="1" required value={form.totalScore} onChange={(e) => setForm({ ...form, totalScore: e.target.value })} />
                </div>
                <div className="form-group full-width">
                  <label>Remarks</label>
                  <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grades;