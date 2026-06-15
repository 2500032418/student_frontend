import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import './Auth.css';

const SIGNUP_ROLES = [
  { value: '1', label: 'Teacher', icon: '👨‍🏫', desc: 'Manage grades, attendance & courses' },
  { value: '2', label: 'Student', icon: '🎓', desc: 'View performance, attendance & reports' },
];

function Signup() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '2',  // Default to Student
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await signup({
        fullname: form.fullname,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: parseInt(form.role),
      });

      if (res.code === 200) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.15)" />
                <path d="M14 34V18l10-6 10 6v16l-10 6-10-6z" stroke="white" strokeWidth="2" fill="none" />
                <path d="M14 18l10 6 10-6" stroke="white" strokeWidth="2" fill="none" />
                <path d="M24 24v10" stroke="white" strokeWidth="2" />
                <circle cx="24" cy="18" r="2" fill="white" />
              </svg>
            </div>
            <h1>SIMS</h1>
            <p className="brand-subtitle">Student Information<br />Management System</p>
            <div className="brand-quote">
              "Empowering education through intelligent student management."
            </div>
          </div>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Create Account</h2>
              <p>Register to access the student management system</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}

              {/* Role Selector */}
              <div className="af-group">
                <label>I am registering as a</label>
                <div className="role-selector">
                  {SIGNUP_ROLES.map((r) => (
                    <button
                      type="button"
                      key={r.value}
                      className={`role-option ${form.role === r.value ? 'role-active' : ''}`}
                      onClick={() => handleChange('role', r.value)}
                    >
                      <span className="role-option-icon">{r.icon}</span>
                      <span className="role-option-label">{r.label}</span>
                      <span className="role-option-desc">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="af-group">
                <label htmlFor="fullname">Full Name</label>
                <div className="af-input-wrapper">
                  <span className="af-input-icon">👤</span>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    value={form.fullname}
                    onChange={(e) => handleChange('fullname', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="af-group">
                <label htmlFor="email">Email Address</label>
                <div className="af-input-wrapper">
                  <span className="af-input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="af-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="af-input-wrapper">
                  <span className="af-input-icon">📱</span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="af-group">
                <label htmlFor="password">Password</label>
                <div className="af-input-wrapper">
                  <span className="af-input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="af-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="af-input-wrapper">
                  <span className="af-input-icon">🔐</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Creating account...
                  </span>
                ) : (
                  `Sign Up as ${SIGNUP_ROLES.find(r => r.value === form.role)?.label || 'User'}`
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
