import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, ShieldCheck, BarChart3 } from 'lucide-react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get('/admin/stats'); setStats(data.data); } catch { /* */ }
      setLoading(false);
    }; fetch();
  }, []);

  if (loading) return <div className="loader-container"><div className="loader" /></div>;
  if (!stats) return null;

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Admin Dashboard</h1><p>Platform overview and management</p></div></div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon"><Users size={22} /></div><div className="stat-info"><h3>{stats.totalUsers}</h3><p>Total Users</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}><Briefcase size={22} /></div><div className="stat-info"><h3>{stats.totalJobs}</h3><p>Total Jobs</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}><FileText size={22} /></div><div className="stat-info"><h3>{stats.totalApplications}</h3><p>Applications</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}><ShieldCheck size={22} /></div><div className="stat-info"><h3>{stats.pendingRecruiters}</h3><p>Pending Approvals</p></div></div>
      </div>

      <div className="grid-2" style={{ gap: '1.25rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Users by Role</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div><p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-heading)' }}>{stats.usersByRole?.students || 0}</p><p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Students</p></div>
            <div><p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-heading)' }}>{stats.usersByRole?.recruiters || 0}</p><p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Recruiters</p></div>
            <div><p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-heading)' }}>{stats.usersByRole?.admins || 0}</p><p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Admins</p></div>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Jobs by Status</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div><p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{stats.jobsByStatus?.open || 0}</p><p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Open</p></div>
            <div><p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>{stats.jobsByStatus?.closed || 0}</p><p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Closed</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
