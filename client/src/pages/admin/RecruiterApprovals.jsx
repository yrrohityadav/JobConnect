import { useState, useEffect } from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function RecruiterApprovals() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get('/admin/recruiters/pending'); setRecruiters(data.data); } catch { /* */ }
      setLoading(false);
    }; fetch();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/admin/recruiters/${id}/approve`);
      setRecruiters(recruiters.filter((r) => r._id !== id));
      toast.success('Recruiter approved!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loader-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Recruiter Approvals</h1><p>{recruiters.length} pending approvals</p></div></div>

      {recruiters.length === 0 ? (
        <div className="empty-state"><ShieldCheck size={48} /><h3>No pending approvals</h3><p>All recruiter accounts have been reviewed</p></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>
              {recruiters.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{r.user?.name || 'N/A'}</td>
                  <td style={{ fontSize: '0.813rem' }}>{r.user?.email || 'N/A'}</td>
                  <td>{r.company?.name || 'N/A'}</td>
                  <td style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => approve(r._id)}>
                      <CheckCircle size={14} /> Approve
                    </button>
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
