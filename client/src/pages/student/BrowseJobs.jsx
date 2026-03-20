import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import JobCard from '../../components/JobCard';
import toast from 'react-hot-toast';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (jobType) params.jobType = jobType;
      const { data } = await api.get('/jobs', { params });
      setJobs(data.data.jobs);
      setPagination(data.data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const fetchSaved = async () => {
    try {
      const { data } = await api.get('/students/saved-jobs');
      setSavedIds(data.data.map((j) => j._id));
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchJobs(); fetchSaved(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const saveJob = async (jobId) => {
    try {
      await api.post(`/students/saved-jobs/${jobId}`);
      setSavedIds([...savedIds, jobId]);
      toast.success('Job saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      await api.delete(`/students/saved-jobs/${jobId}`);
      setSavedIds(savedIds.filter((id) => id !== jobId));
      toast.success('Removed from saved');
    } catch { /* ignore */ }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>Browse Jobs</h1><p>{pagination.total} jobs available</p></div>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Search jobs by title, skills..."
            value={search} onChange={(e) => setSearch(e.target.value)} id="job-search" />
        </div>
        <select className="form-select" style={{ width: '180px' }} value={jobType} onChange={(e) => setJobType(e.target.value)} id="job-type-filter">
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
        <button type="submit" className="btn btn-primary" id="job-search-btn"><Filter size={16} /> Search</button>
      </form>

      {loading ? (
        <div className="loader-container"><div className="loader" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <Search size={48} />
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} isSaved={savedIds.includes(job._id)} onSave={saveJob} onUnsave={unsaveJob} />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Page {page} of {pagination.pages}
              </span>
              <button className="btn btn-secondary btn-sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
