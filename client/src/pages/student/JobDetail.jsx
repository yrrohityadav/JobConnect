import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Calendar, Eye, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      toast.success('Application submitted!');
      setShowApplyModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="loader" /></div>;
  if (!job) return <div className="page-container"><div className="empty-state"><h3>Job not found</h3></div></div>;

  const company = job.postedBy?.company || {};
  const salary = job.salary?.max ? `₹${(job.salary.min/1000).toFixed(0)}K – ₹${(job.salary.max/1000).toFixed(0)}K` : 'Not disclosed';

  return (
    <div className="page-container">
      <Link to="/student/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="job-company-logo" style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                {company.logo?.url ? <img src={company.logo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} /> : company.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-heading)' }}>{job.title}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{company.name}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <span className="job-tag"><Briefcase size={14} /> {job.jobType}</span>
              <span className="job-tag"><MapPin size={14} /> {job.location}</span>
              <span className="job-tag"><IndianRupee size={14} /> {salary}</span>
              <span className="job-tag"><Calendar size={14} /> Deadline: {format(new Date(job.deadline), 'dd MMM yyyy')}</span>
              <span className="job-tag"><Eye size={14} /> {job.views} views</span>
              <span className="job-tag"><Users size={14} /> {job.openings} openings</span>
            </div>

            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-heading)' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.938rem' }}>{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-heading)' }}>Requirements</h3>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.938rem' }}>
                {job.requirements.map((r, i) => <li key={i} style={{ marginBottom: '0.375rem' }}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Apply Now</h3>
            {job.skills?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Required Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {job.skills.map((s, i) => <span key={i} className="skill-chip">{s}</span>)}
                </div>
              </div>
            )}
            <span className={`badge badge-${job.status}`} style={{ marginBottom: '1rem', display: 'inline-flex' }}>{job.status}</span>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowApplyModal(true)} id="apply-btn"
              disabled={job.status !== 'open'}>
              {job.status === 'open' ? 'Apply for this Job' : 'Applications Closed'}
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply to {job.title}</h2>
              <button className="btn-ghost" onClick={() => setShowApplyModal(false)} style={{ padding: '0.25rem' }}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Cover Letter (optional)</label>
              <textarea className="form-textarea" rows={6} placeholder="Tell the recruiter why you're a great fit..."
                value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} maxLength={2000} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying} id="confirm-apply">
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .job-tag { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.813rem; color: var(--text-secondary);
          background: rgba(255,255,255,0.04); padding: 0.375rem 0.75rem; border-radius: 100px; }
        .skill-chip { font-size: 0.75rem; padding: 0.25rem 0.625rem; background: rgba(124,58,237,0.12);
          color: #a78bfa; border-radius: 4px; font-weight: 500; }
      `}</style>
    </div>
  );
}
