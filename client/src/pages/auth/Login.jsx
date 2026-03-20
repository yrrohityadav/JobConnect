import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card-glass">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input input-with-icon"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                id="login-email"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input input-with-icon"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                id="login-password"
              />
              <button type="button" className="input-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="auth-forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - var(--navbar-height));
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
        }
        .auth-card {
          width: 100%; max-width: 440px; padding: 2.5rem;
        }
        .auth-header { text-align: center; margin-bottom: 2rem; }
        .auth-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.375rem; }
        .auth-header p { color: var(--text-secondary); font-size: 0.938rem; }
        .input-icon-wrapper { position: relative; }
        .input-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .input-with-icon { padding-left: 2.5rem; }
        .input-toggle {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.25rem;
        }
        .auth-forgot { text-align: right; margin-bottom: 1.5rem; }
        .auth-forgot a { font-size: 0.813rem; color: var(--accent-secondary); }
        .auth-submit { width: 100%; }
        .auth-switch { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); }
        .auth-switch a { color: var(--accent-primary); font-weight: 500; }
      `}</style>
    </div>
  );
}
