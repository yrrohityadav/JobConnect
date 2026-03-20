import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card card-glass" style={{ textAlign: 'center' }}>
        {status === 'loading' && <div className="loader" style={{ margin: '2rem auto' }} />}
        {status === 'success' && (
          <>
            <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.5rem', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>Email Verified!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your account is now active.</p>
            <Link to="/login" className="btn btn-primary btn-lg" id="verify-login">Sign In</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={56} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.5rem', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>Verification Failed</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Invalid or expired verification link.</p>
            <Link to="/register" className="btn btn-secondary btn-lg" id="verify-register">Register Again</Link>
          </>
        )}
      </div>
      <style>{`
        .auth-page { min-height: calc(100vh - var(--navbar-height)); display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .auth-card { width: 100%; max-width: 440px; padding: 2.5rem; }
      `}</style>
    </div>
  );
}
