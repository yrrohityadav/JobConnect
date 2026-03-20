import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, IndianRupee, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function JobCard({ job, onSave, onUnsave, isSaved = false, showActions = true }) {
  const company = job.postedBy?.company || {};
  const salaryText = job.salary?.max
    ? `₹${(job.salary.min / 1000).toFixed(0)}K – ₹${(job.salary.max / 1000).toFixed(0)}K`
    : 'Not disclosed';

  return (
    <div className="job-card card">
      <div className="job-card-header">
        <div className="job-company-logo">
          {company.logo?.url
            ? <img src={company.logo.url} alt={company.name} />
            : <span>{company.name?.charAt(0) || 'C'}</span>
          }
        </div>
        <div className="job-company-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company-name">{company.name || 'Company'}</p>
        </div>
        {showActions && (
          <button
            className="btn-ghost job-save-btn"
            onClick={() => isSaved ? onUnsave?.(job._id) : onSave?.(job._id)}
            title={isSaved ? 'Unsave' : 'Save job'}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      <div className="job-card-tags">
        <span className="job-tag"><Briefcase size={13} /> {job.jobType}</span>
        <span className="job-tag"><MapPin size={13} /> {job.location}</span>
        <span className="job-tag"><IndianRupee size={13} /> {salaryText}</span>
      </div>

      <p className="job-card-desc">{job.description?.substring(0, 140)}...</p>

      {job.skills?.length > 0 && (
        <div className="job-card-skills">
          {job.skills.slice(0, 4).map((s, i) => (
            <span key={i} className="skill-chip">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="skill-chip">+{job.skills.length - 4}</span>}
        </div>
      )}

      <div className="job-card-footer">
        <div className="job-meta">
          <span><Clock size={13} /> {format(new Date(job.deadline), 'dd MMM yyyy')}</span>
          <span><Eye size={13} /> {job.views || 0} views</span>
        </div>
        <Link to={`/student/jobs/${job._id}`} className="btn btn-primary btn-sm" id={`view-job-${job._id}`}>
          View Details
        </Link>
      </div>

      <style>{`
        .job-card { display: flex; flex-direction: column; gap: 1rem; }
        .job-card-header { display: flex; align-items: flex-start; gap: 0.75rem; }
        .job-company-logo {
          width: 44px; height: 44px; border-radius: 10px;
          background: var(--accent-gradient); display: flex;
          align-items: center; justify-content: center;
          font-size: 1.25rem; font-weight: 700; color: white;
          overflow: hidden; flex-shrink: 0;
        }
        .job-company-logo img { width: 100%; height: 100%; object-fit: cover; }
        .job-company-info { flex: 1; }
        .job-title { font-size: 1rem; font-weight: 600; color: var(--text-heading); line-height: 1.3; }
        .job-company-name { font-size: 0.813rem; color: var(--text-muted); margin-top: 2px; }
        .job-save-btn { padding: 0.375rem; color: var(--text-muted); }
        .job-save-btn:hover { color: var(--accent-primary); }
        .job-card-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .job-tag {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.75rem; color: var(--text-secondary);
          background: rgba(255,255,255,0.04); padding: 0.25rem 0.625rem;
          border-radius: 100px;
        }
        .job-card-desc { font-size: 0.813rem; color: var(--text-secondary); line-height: 1.5; }
        .job-card-skills { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .skill-chip {
          font-size: 0.6875rem; padding: 0.2rem 0.5rem;
          background: rgba(124, 58, 237, 0.12); color: #a78bfa;
          border-radius: 4px; font-weight: 500;
        }
        .job-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 0.75rem; border-top: 1px solid var(--border-color);
        }
        .job-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); }
        .job-meta span { display: inline-flex; align-items: center; gap: 0.25rem; }
      `}</style>
    </div>
  );
}
