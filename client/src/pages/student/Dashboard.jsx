import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Bookmark, TrendingUp } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ applications: 0, savedJobs: 0 });
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/students/saved-jobs'),
        ]);
        setRecentApps(appsRes.data.data?.slice(0, 5) || []);
        setStats({
          applications: appsRes.data.data?.length || 0,
          savedJobs: savedRes.data.data?.length || 0,
        });
      } catch { /* ignore */ }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's what's happening with your job search</p>
        </div>
        <Link to="/student/jobs" className="btn btn-primary" id="browse-jobs-btn">
          <Briefcase size={16} /> Browse Jobs
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FileText size={22} /></div>
          <div className="stat-info"><h3>{stats.applications}</h3><p>Applications</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}><Bookmark size={22} /></div>
          <div className="stat-info"><h3>{stats.savedJobs}</h3><p>Saved Jobs</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}><TrendingUp size={22} /></div>
          <div className="stat-info"><h3>{profile?.profileCompletion || 0}%</h3><p>Profile Complete</p></div>
        </div>
      </div>

      {/* Profile completion prompt */}
      {(profile?.profileCompletion || 0) < 80 && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-heading)', marginBottom: '0.25rem' }}>Complete Your Profile</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>A complete profile increases your chances of getting hired by 3x.</p>
            </div>
            <Link to="/student/profile" className="btn btn-secondary btn-sm">Update Profile</Link>
          </div>
          <div style={{ marginTop: '0.75rem', height: '6px', background: 'var(--bg-primary)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ width: `${profile?.profileCompletion || 0}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '100px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-heading)' }}>Recent Applications</h2>
          <Link to="/student/applications" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No applications yet</h3>
            <p>Start browsing jobs and submit your first application!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{app.job?.title || 'N/A'}</td>
                    <td>{app.job?.postedBy?.company?.name || 'N/A'}</td>
                    <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.813rem' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
