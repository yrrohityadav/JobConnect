import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, Eye } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/recruiters/jobs');
        setJobs(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0);
  const openJobs = jobs.filter((j) => j.status === 'open').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>Welcome, {user?.name?.split(' ')[0]}! 👋</h1><p>Manage your job postings and applicants</p></div>
        <Link to="/recruiter/post-job" className="btn btn-primary" id="post-job-btn"><PlusCircle size={16} /> Post New Job</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon"><Briefcase size={22} /></div><div className="stat-info"><h3>{jobs.length}</h3><p>Total Jobs</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}><Eye size={22} /></div><div className="stat-info"><h3>{openJobs}</h3><p>Open Positions</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}><Users size={22} /></div><div className="stat-info"><h3>{totalApplicants}</h3><p>Total Applicants</p></div></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-heading)' }}>Your Jobs</h2>
          <Link to="/recruiter/jobs" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {loading ? <div className="loader-container"><div className="loader" /></div> : jobs.length === 0 ? (
          <div className="empty-state"><Briefcase size={48} /><h3>No jobs posted</h3><p>Post your first job to start receiving applications</p></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Applicants</th><th>Views</th><th>Actions</th></tr></thead>
              <tbody>
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job._id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{job.title}</td>
                    <td>{job.jobType}</td>
                    <td><span className={`badge badge-${job.status}`}>{job.status}</span></td>
                    <td>{job.applicants?.length || 0}</td>
                    <td>{job.views}</td>
                    <td><Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-ghost btn-sm">View</Link></td>
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
