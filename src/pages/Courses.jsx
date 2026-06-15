import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getCourses, createCourse, updateCourse, deleteCourse, getDepartments } from '../services/api';
import DataTable from '../components/DataTable';

function Courses() {
  // Role guard: Students cannot access this page
  const userRole = localStorage.getItem('userRole') || '1';
  if (userRole === '2') {
    return <Navigate to="/" replace />;
  }

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', credits: 3, description: '', department: { id: '' } });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [cRes, dRes] = await Promise.all([getCourses(), getDepartments()]);
      if (cRes.code === 200) setCourses(cRes.data);
      if (dRes.code === 200) setDepartments(dRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: '', code: '', credits: 3, description: '', department: { id: '' } });
    setShowForm(true);
  }

  function openEdit(course) {
    setEditing(course);
    setForm({
      name: course.name || '',
      code: course.code || '',
      credits: course.credits || 3,
      description: course.description || '',
      department: course.department ? { id: course.department.id } : { id: '' }
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, credits: parseInt(form.credits), department: form.department.id ? { id: parseInt(form.department.id) } : null };
    if (editing) {
      await updateCourse(editing.id, payload);
    } else {
      await createCourse(payload);
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  }

  async function handleDelete(course) {
    if (window.confirm(`Delete course ${course.name}?`)) {
      await deleteCourse(course.id);
      loadData();
    }
  }

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Course Name' },
    { key: 'credits', label: 'Credits' },
    { key: 'department', label: 'Department', render: (r) => r.department?.name || '-' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p>Manage course catalog</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreate}>+ Add Course</button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No courses found."
      />

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Code *</label>
                  <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Course Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Credits</label>
                  <input type="number" min="1" max="10" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select value={form.department.id} onChange={(e) => setForm({ ...form, department: { id: e.target.value } })}>
                    <option value="">-- Select Department --</option>
                    {departments.length === 0 && (
                      <option value="" disabled>No departments available. Add one first.</option>
                    )}
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code || ''})</option>
                    ))}
                  </select>
                  {departments.length === 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#e65100', marginTop: 4 }}>
                      ⚠️ No departments found. Add departments in pgAdmin first.
                    </span>
                  )}
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
