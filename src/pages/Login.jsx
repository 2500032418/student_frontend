import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signin } from '../services/api';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signin(email, password);
      if (res.code === 200 && res.jwt) {
        localStorage.setItem('jwt', res.jwt);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', res.role?.toString() || '1');
        localStorage.setItem('studentId', res.studentId?.toString() || '');
        navigate('/');
      } else {
        setError(res.message || 'Invalid credentials');
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
            <div className="brand-features">
              <div className="bf-item">
                <span className="bf-icon">📊</span>
                <span>Dashboard Analytics</span>
              </div>
              <div className="bf-item">
                <span className="bf-icon">👥</span>
                <span>Student Records</span>
              </div>
              <div className="bf-item">
                <span className="bf-icon">🏆</span>
                <span>Performance Tracking</span>
              </div>
              <div className="bf-item">
                <span className="bf-icon">🔍</span>
                <span>Smart Insights</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
              {/* <p>Select your role and sign in to continue</p> */}
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="af-group">
                <label htmlFor="email">Email Address</label>
                <div className="af-input-wrapper">
                  <span className="af-input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/signup">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
