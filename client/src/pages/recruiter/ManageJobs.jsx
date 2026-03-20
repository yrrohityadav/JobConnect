import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ClipboardList } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get('/recruiters/jobs'); setJobs(data.data); } catch { /* */ }
      setLoading(false);
    }; fetch();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try { await api.delete(`/jobs/${id}`); setJobs(jobs.filter((j) => j._id !== id)); toast.success('Job deleted'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loader-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Manage Jobs</h1><p>{jobs.length} jobs posted</p></div>
        <Link to="/recruiter/post-job" className="btn btn-primary">Post New Job</Link></div>

      {jobs.length === 0 ? (
        <div className="empty-state"><ClipboardList size={48} /><h3>No jobs posted yet</h3></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Title</th><th>Type</th><th>Location</th><th>Status</th><th>Applicants</th><th>Actions</th></tr></thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{job.title}</td>
                  <td>{job.jobType}</td>
                  <td>{job.location}</td>
                  <td><span className={`badge badge-${job.status}`}>{job.status}</span></td>
                  <td>{job.applicants?.length || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-ghost btn-sm">Applicants</Link>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => deleteJob(job._id)}><Trash2 size={14} /></button>
                    </div>
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
