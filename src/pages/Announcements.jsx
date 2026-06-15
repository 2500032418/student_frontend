import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api';
import './Announcements.css';

function Announcements() {
  const userRole = localStorage.getItem('userRole') || '1';
  const isAdminOrTeacher = userRole === '0' || userRole === '1';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'all' });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const res = await getAnnouncements();
      if (res.code === 200) setAnnouncements(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: '', message: '', targetRole: 'all' });
    setShowForm(true);
  }

  function openEdit(announcement) {
    setEditing(announcement);
    setForm({
      title: announcement.title || '',
      message: announcement.message || '',
      targetRole: announcement.targetRole || 'all',
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (editing) {
        res = await updateAnnouncement(editing._id, form);
      } else {
        res = await createAnnouncement(form);
      }
      if (res.code !== 200) {
        alert('Error: ' + (res.message || 'Failed to save announcement'));
        return;
      }
      setShowForm(false);
      setEditing(null);
      loadAnnouncements();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleDelete(announcement) {
    if (window.confirm(`Delete announcement "${announcement.title}"?`)) {
      await deleteAnnouncement(announcement._id);
      loadAnnouncements();
    }
  }

  const roleLabels = { all: 'Everyone', admin: 'Admins', teacher: 'Teachers', student: 'Students' };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Manage system announcements</p>
        </div>
        {isAdminOrTeacher && (
          <div className="header-actions">
            <button className="btn btn-primary" onClick={openCreate}>+ New Announcement</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="page-loading">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <h3>No Announcements Yet</h3>
          <p>There are no announcements to display.</p>
          {isAdminOrTeacher && (
            <button className="btn btn-primary" onClick={openCreate}>Create the First Announcement</button>
          )}
        </div>
      ) : (
        <div className="announcement-list">
          {announcements.map((a) => (
            <div key={a._id} className="announcement-card">
              <div className="announcement-header">
                <h3>{a.title}</h3>
                <span className="role-tag">{roleLabels[a.targetRole] || a.targetRole}</span>
              </div>
              <p className="announcement-message">{a.message}</p>
              <div className="announcement-footer">
                <span className="announcement-meta">
                  By {a.createdBy} &middot; {new Date(a.createdAt).toLocaleDateString()}
                </span>
                {isAdminOrTeacher && (
                  <div className="announcement-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(a)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Title *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" />
                </div>
                <div className="form-group full-width">
                  <label>Message *</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your announcement..." rows={5} />
                </div>
                <div className="form-group full-width">
                  <label>Target Audience</label>
                  <select value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}>
                    <option value="all">Everyone</option>
                    <option value="admin">Administrators Only</option>
                    <option value="teacher">Teachers Only</option>
                    <option value="student">Students Only</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
