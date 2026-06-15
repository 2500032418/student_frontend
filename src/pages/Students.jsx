import { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent, searchStudents, getDepartments } from '../services/api';
import DataTable from '../components/DataTable';
import './PageStyles.css';

function Students() {
  // Role guard: Students cannot access this page
  const userRole = localStorage.getItem('userRole') || '1';
  const userEmail = localStorage.getItem('userEmail') || 'User';
  if (userRole === '2') {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Students</h1>
            <p>Manage student records</p>
          </div>
        </div>
        <div className="student-welcome-card">
          <div className="welcome-avatar">{userEmail.charAt(0).toUpperCase()}</div>
          <div className="welcome-text">
            <h2>Welcome, {userEmail.split('@')[0]}!</h2>
            <p>You are logged in as a Student. The Students section is only accessible to Administrators and Teachers. Please visit <strong>My Grades</strong> or <strong>My Attendance</strong> to view your academic records.</p>
          </div>
        </div>
      </div>
    );
  }

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', studentId: '', email: '', phone: '',
    address: '', dateOfBirth: '', department: { id: '' }
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sRes, dRes] = await Promise.all([getStudents(), getDepartments()]);
      if (sRes.code === 200) setStudents(sRes.data);
      if (dRes.code === 200) setDepartments(dRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(q) {
    setSearchQuery(q);
    if (!q.trim()) {
      const res = await getStudents();
      if (res.code === 200) setStudents(res.data);
      return;
    }
    const res = await searchStudents(q);
    if (res.code === 200) setStudents(res.data);
  }

  function openCreate() {
    setEditing(null);
    setForm({ firstName: '', lastName: '', studentId: '', email: '', phone: '', address: '', dateOfBirth: '', department: { id: '' } });
    setShowForm(true);
  }

  function openEdit(student) {
    setEditing(student);
    setForm({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      studentId: student.studentId || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      dateOfBirth: student.dateOfBirth || '',
      department: student.department ? { id: student.department.id } : { id: '' }
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      department: form.department.id ? { id: parseInt(form.department.id) } : null
    };
    try {
      let res;
      if (editing) {
        res = await updateStudent(editing.id, payload);
      } else {
        res = await createStudent(payload);
      }
      if (res.code !== 200) {
        alert('Error: ' + (res.message || 'Failed to save student'));
        return;
      }
      setShowForm(false);
      setEditing(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleDelete(student) {
    if (window.confirm(`Delete student ${student.firstName} ${student.lastName}?`)) {
      await deleteStudent(student.id);
      loadData();
    }
  }

  const columns = [
    { key: 'studentId', label: 'Student ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department', render: (r) => r.department?.name || '-' },
    { key: 'status', label: 'Status', render: (r) => r.status === 1 ? 'Active' : 'Inactive' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage student records</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn btn-primary" onClick={openCreate}>+ Add Student</button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No students found. Add your first student!"
      />

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student ID *</label>
                  <input required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>First Name *</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
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
                <div className="form-group">
                  <label>Address</label>
                  <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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

export default Students;