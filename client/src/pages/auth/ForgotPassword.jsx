import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, Lock } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=OTP+new password
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: form.email });
      toast.success('If this email exists, an OTP has been sent.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', form);
      toast.success('Password reset successfully! Please login.');
      setStep(1);
      setForm({ email: '', otp: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card-glass">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>{step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}</p>
        </div>
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input type="email" className="form-input input-with-icon" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required id="forgot-email" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="forgot-submit">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label className="form-label">OTP Code</label>
              <div className="input-icon-wrapper">
                <KeyRound size={16} className="input-icon" />
                <input type="text" className="form-input input-with-icon" placeholder="6-digit OTP"
                  value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })}
                  required maxLength={6} id="forgot-otp" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input type="password" className="form-input input-with-icon" placeholder="Min 6 characters"
                  value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  required minLength={6} id="forgot-newpass" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="forgot-reset">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <p className="auth-switch"><Link to="/login">Back to Login</Link></p>
      </div>
      <style>{`
        .auth-page { min-height: calc(100vh - var(--navbar-height)); display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .auth-card { width: 100%; max-width: 440px; padding: 2.5rem; }
        .auth-header { text-align: center; margin-bottom: 2rem; }
        .auth-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.375rem; }
        .auth-header p { color: var(--text-secondary); font-size: 0.938rem; }
        .input-icon-wrapper { position: relative; }
        .input-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .input-with-icon { padding-left: 2.5rem; }
        .auth-submit { width: 100%; }
        .auth-switch { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); }
        .auth-switch a { color: var(--accent-primary); font-weight: 500; }
      `}</style>
    </div>
  );
}
