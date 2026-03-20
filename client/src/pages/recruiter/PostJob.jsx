import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', jobType: 'Full-time', location: '',
    salary: { min: '', max: '', currency: 'INR' },
    openings: 1, deadline: '', requirements: [''], skills: [''],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        salary: { min: Number(form.salary.min) || 0, max: Number(form.salary.max) || 0, currency: form.salary.currency },
        requirements: form.requirements.filter(Boolean),
        skills: form.skills.filter(Boolean),
      };
      await api.post('/jobs', payload);
      toast.success('Job posted!');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
  const removeItem = (field, i) => setForm({ ...form, [field]: form[field].filter((_, idx) => idx !== i) });
  const updateItem = (field, i, val) => {
    const arr = [...form[field]]; arr[i] = val; setForm({ ...form, [field]: arr });
  };

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Post a New Job</h1><p>Fill in the details to publish a job listing</p></div></div>
      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
        <div className="grid-2" style={{ gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Job Title *</label>
            <input className="form-input" placeholder="e.g., Software Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Job Type *</label>
            <select className="form-select" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option><option>Contract</option>
            </select></div>
          <div className="form-group"><label className="form-label">Location *</label>
            <input className="form-input" placeholder="City, State" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Openings</label>
            <input className="form-input" type="number" min={1} value={form.openings} onChange={(e) => setForm({ ...form, openings: Number(e.target.value) })} /></div>
          <div className="form-group"><label className="form-label">Min Salary (₹)</label>
            <input className="form-input" type="number" placeholder="e.g., 500000" value={form.salary.min} onChange={(e) => setForm({ ...form, salary: { ...form.salary, min: e.target.value } })} /></div>
          <div className="form-group"><label className="form-label">Max Salary (₹)</label>
            <input className="form-input" type="number" placeholder="e.g., 1200000" value={form.salary.max} onChange={(e) => setForm({ ...form, salary: { ...form.salary, max: e.target.value } })} /></div>
        </div>
        <div className="form-group"><label className="form-label">Deadline *</label>
          <input className="form-input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Description *</label>
          <textarea className="form-textarea" rows={6} placeholder="Describe the role, responsibilities..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required minLength={20} /></div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Requirements</label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => addItem('requirements')}><Plus size={14} /> Add</button>
          </div>
          {form.requirements.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input className="form-input" placeholder="Requirement" value={r} onChange={(e) => updateItem('requirements', i, e.target.value)} />
              <button type="button" className="btn-ghost" style={{ color: 'var(--danger)', padding: '0.25rem' }} onClick={() => removeItem('requirements', i)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Skills</label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => addItem('skills')}><Plus size={14} /> Add</button>
          </div>
          {form.skills.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input className="form-input" placeholder="Skill" value={s} onChange={(e) => updateItem('skills', i, e.target.value)} />
              <button type="button" className="btn-ghost" style={{ color: 'var(--danger)', padding: '0.25rem' }} onClick={() => removeItem('skills', i)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="submit-job">
            {loading ? 'Publishing...' : 'Publish Job'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
