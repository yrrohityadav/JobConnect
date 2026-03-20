import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CompanyProfile() {
  const { profile, setProfile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.company?.name || '',
    description: profile?.company?.description || '',
    industry: profile?.company?.industry || '',
    size: profile?.company?.size || '',
    website: profile?.company?.website || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/recruiters/profile', { company: form });
      setProfile(data.data);
      toast.success('Company profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('logo', file);
    try {
      await api.post('/recruiters/logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Logo uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Company Profile</h1><p>Tell candidates about your company</p></div></div>
      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <form className="card" onSubmit={handleSave}>
          <div className="form-group"><label className="form-label">Company Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Industry</label>
            <input className="form-input" placeholder="e.g., Technology, Finance" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Company Size</label>
            <select className="form-select" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
              <option value="">Select size</option>
              <option value="1-10">1-10</option><option value="11-50">11-50</option>
              <option value="51-200">51-200</option><option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option><option value="1000+">1000+</option>
            </select></div>
          <div className="form-group"><label className="form-label">Website</label>
            <input className="form-input" placeholder="https://yourcompany.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Description</label>
            <textarea className="form-textarea" rows={4} placeholder="About your company..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} /></div>
          <button type="submit" className="btn btn-primary" disabled={loading} id="save-company"><Save size={16} /> {loading ? 'Saving...' : 'Save'}</button>
        </form>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Company Logo</h3>
          {profile?.company?.logo?.url && (
            <img src={profile.company.logo.url} alt="Logo" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }} />
          )}
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Upload Logo
            <input type="file" accept="image/*" onChange={handleLogo} hidden />
          </label>
        </div>
      </div>
    </div>
  );
}
