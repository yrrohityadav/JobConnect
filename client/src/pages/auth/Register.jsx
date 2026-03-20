import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', companyName: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card-glass">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join JobConnect and start your journey</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={16} className="input-icon" />
              <input type="text" className="form-input input-with-icon" placeholder="Your full name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required id="reg-name" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input type="email" className="form-input input-with-icon" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required id="reg-email" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input type={showPass ? 'text' : 'password'} className="form-input input-with-icon"
                placeholder="Minimum 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required minLength={6} id="reg-password" />
              <button type="button" className="input-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className="role-selector">
              <button type="button" className={`role-option ${form.role === 'student' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'student' })} id="reg-role-student">
                <User size={18} /> Student
              </button>
              <button type="button" className={`role-option ${form.role === 'recruiter' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'recruiter' })} id="reg-role-recruiter">
                <Building2 size={18} /> Recruiter
              </button>
            </div>
          </div>
          {form.role === 'recruiter' && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <div className="input-icon-wrapper">
                <Building2 size={16} className="input-icon" />
                <input type="text" className="form-input input-with-icon" placeholder="Your company"
                  value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required id="reg-company" />
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="reg-submit">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>

      <style>{`
        .role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .role-option {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.75rem; border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm); background: var(--bg-input);
          color: var(--text-secondary); cursor: pointer; font-size: 0.875rem;
          font-family: 'Inter', sans-serif; font-weight: 500;
          transition: var(--transition-fast);
        }
        .role-option:hover { border-color: var(--border-accent); }
        .role-option.active {
          border-color: var(--accent-primary); color: var(--accent-primary);
          background: rgba(124, 58, 237, 0.08);
        }
        .auth-page {
          min-height: calc(100vh - var(--navbar-height));
          display: flex; align-items: center; justify-content: center; padding: 2rem;
        }
        .auth-card { width: 100%; max-width: 440px; padding: 2.5rem; }
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
        .auth-submit { width: 100%; margin-top: 0.5rem; }
        .auth-switch { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); }
        .auth-switch a { color: var(--accent-primary); font-weight: 500; }
      `}</style>
    </div>
  );
}
