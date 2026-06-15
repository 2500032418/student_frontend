import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const ROLE_LABELS = {
  '0': 'Administrator',
  '1': 'Teacher',
  '2': 'Student',
};

const ROLE_ICONS = {
  '0': '🛡️',
  '1': '👨‍🏫',
  '2': '🎓',
};

function Sidebar() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const userRole = localStorage.getItem('userRole') || '1';
  const studentId = localStorage.getItem('studentId') || null;
  const roleLabel = ROLE_LABELS[userRole] || 'User';
  const roleIcon = ROLE_ICONS[userRole] || '👤';

  function handleLogout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentId');
    navigate('/login');
  }

  const isAdmin = userRole === '0';
  const isTeacher = userRole === '1';
  const isStudent = userRole === '2';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SIMS</h2>
        <span>Student Information System</span>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {userEmail.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{userEmail}</span>
          <span className="sidebar-user-role">
            <span className="role-badge">{roleIcon} {roleLabel}</span>
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard - Everyone */}
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        {/* Students - Admin & Teacher only */}
        {(isAdmin || isTeacher) && (
          <NavLink to="/students" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">👥</span>
            <span>Students</span>
          </NavLink>
        )}

        {/* Courses - Admin & Teacher only */}
        {(isAdmin || isTeacher) && (
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📚</span>
            <span>Courses</span>
          </NavLink>
        )}

        {/* Enrollments - Admin & Teacher only */}
        {(isAdmin || isTeacher) && (
          <NavLink to="/enrollments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📋</span>
            <span>Enrollments</span>
          </NavLink>
        )}

        {/* Grades - Students see only their own via studentId query param */}
        <NavLink
          to={isStudent && studentId ? `/grades?studentId=${studentId}` : '/grades'}
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">🏆</span>
          <span>{isStudent ? 'My Grades' : 'Performance'}</span>
        </NavLink>

        {/* Attendance - Students see only their own via studentId query param */}
        <NavLink
          to={isStudent && studentId ? `/attendance?studentId=${studentId}` : '/attendance'}
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">✅</span>
          <span>{isStudent ? 'My Attendance' : 'Attendance'}</span>
        </NavLink>

        {/* Reports - Admin & Teacher only */}
        {(isAdmin || isTeacher) && (
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📈</span>
            <span>Reports</span>
          </NavLink>
        )}

        {/* Smart Search - Admin & Teacher only */}
        {(isAdmin || isTeacher) && (
          <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">🔍</span>
            <span>Smart Search</span>
          </NavLink>
        )}

        {/* Announcements - Everyone */}
        <NavLink to="/announcements" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📢</span>
          <span>Announcements</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
