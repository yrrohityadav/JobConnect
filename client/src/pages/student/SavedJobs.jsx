import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import api from '../../api/axios';
import JobCard from '../../components/JobCard';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const { data } = await api.get('/students/saved-jobs');
      setJobs(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchSaved(); }, []);

  const unsaveJob = async (jobId) => {
    try {
      await api.delete(`/students/saved-jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
      toast.success('Removed from saved');
    } catch { /* ignore */ }
  };

  if (loading) return <div className="loader-container"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Saved Jobs</h1><p>{jobs.length} jobs saved</p></div></div>

      {jobs.length === 0 ? (
        <div className="empty-state"><Bookmark size={48} /><h3>No saved jobs</h3><p>Save jobs while browsing to review them later</p></div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isSaved={true} onUnsave={unsaveJob} />
          ))}
        </div>
      )}
    </div>
  );
}
