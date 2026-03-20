import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../../api/axios';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/applications/my');
        setApps(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="loader-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>My Applications</h1><p>{apps.length} applications submitted</p></div></div>

      {apps.length === 0 ? (
        <div className="empty-state"><FileText size={48} /><h3>No applications yet</h3><p>Browse jobs and start applying!</p></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Job Title</th><th>Company</th><th>Type</th><th>Status</th><th>Applied</th></tr></thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{app.job?.title || 'N/A'}</td>
                  <td>{app.job?.postedBy?.company?.name || 'N/A'}</td>
                  <td>{app.job?.jobType || 'N/A'}</td>
                  <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.813rem' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
