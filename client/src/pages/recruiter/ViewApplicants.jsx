import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ViewApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get(`/applications/job/${jobId}`); setApplicants(data.data); } catch { /* */ }
      setLoading(false);
    }; fetch();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setApplicants(applicants.map((a) => a._id === appId ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loader-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <Link to="/recruiter/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}><ArrowLeft size={16} /> Back to Jobs</Link>
      <div className="page-header"><div><h1>Applicants</h1><p>{applicants.length} applications received</p></div></div>

      {applicants.length === 0 ? (
        <div className="empty-state"><FileText size={48} /><h3>No applicants yet</h3></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Skills</th><th>Resume</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{app.applicant?.user?.name || 'N/A'}</td>
                  <td style={{ fontSize: '0.813rem' }}>{app.applicant?.user?.email || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(app.applicant?.profile?.skills || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-chip" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', borderRadius: 4 }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>{app.resumeSnapshot ? <a href={app.resumeSnapshot} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={14} /> View</a> : '—'}</td>
                  <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  <td>
                    <select className="form-select" style={{ width: 'auto', padding: '0.375rem 0.5rem', fontSize: '0.75rem' }}
                      value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}>
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="offered">Offered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
