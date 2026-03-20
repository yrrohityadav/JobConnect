import { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { profile, setProfile } = useAuth();
  const [form, setForm] = useState({
    bio: '', skills: [], location: '', linkedIn: '', github: '', portfolio: '',
    education: [], experience: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile?.profile) {
      setForm({
        bio: profile.profile.bio || '',
        skills: profile.profile.skills || [],
        location: profile.profile.location || '',
        linkedIn: profile.profile.linkedIn || '',
        github: profile.profile.github || '',
        portfolio: profile.profile.portfolio || '',
        education: profile.profile.education || [],
        experience: profile.profile.experience || [],
      });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/students/profile', form);
      setProfile(data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    setUploading(true);
    try {
      await api.post('/students/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

  const addEducation = () => setForm({ ...form, education: [...form.education, { degree: '', institution: '', year: '', cgpa: '' }] });
  const removeEducation = (i) => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });
  const updateEducation = (i, field, val) => {
    const edu = [...form.education];
    edu[i][field] = field === 'year' || field === 'cgpa' ? Number(val) || '' : val;
    setForm({ ...form, education: edu });
  };

  const addExperience = () => setForm({ ...form, experience: [...form.experience, { title: '', company: '', duration: '', description: '' }] });
  const removeExperience = (i) => setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });
  const updateExperience = (i, field, val) => {
    const exp = [...form.experience];
    exp[i][field] = val;
    setForm({ ...form, experience: exp });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>My Profile</h1><p>Complete your profile to stand out to recruiters</p></div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column */}
          <div>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>About</h3>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" rows={4} placeholder="Tell recruiters about yourself..."
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="City, State" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Skills</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input className="form-input" placeholder="Add a skill" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <button type="button" className="btn btn-secondary" onClick={addSkill}><Plus size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {form.skills.map((s) => (
                  <span key={s} className="skill-chip" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    onClick={() => removeSkill(s)}>{s} ×</span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Links</h3>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" placeholder="https://linkedin.com/in/..." value={form.linkedIn}
                  onChange={(e) => setForm({ ...form, linkedIn: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" placeholder="https://github.com/..." value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio URL</label>
                <input className="form-input" placeholder="https://yoursite.com" value={form.portfolio}
                  onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>Resume</h3>
              {profile?.resume?.url && (
                <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Current: <a href={profile.resume.url} target="_blank" rel="noreferrer">View Resume</a>
                </p>
              )}
              <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload PDF'}
                <input type="file" accept=".pdf" onChange={handleResume} hidden />
              </label>
            </div>

            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--text-heading)' }}>Education</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addEducation}><Plus size={16} /> Add</button>
              </div>
              {form.education.map((edu, i) => (
                <div key={i} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '0.75rem', position: 'relative' }}>
                  <button type="button" className="btn-ghost" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem', color: 'var(--danger)' }}
                    onClick={() => removeEducation(i)}><Trash2 size={14} /></button>
                  <div className="form-group"><input className="form-input" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} /></div>
                  <div className="form-group"><input className="form-input" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input className="form-input" placeholder="Year" type="number" value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} />
                    <input className="form-input" placeholder="CGPA" type="number" step="0.1" value={edu.cgpa} onChange={(e) => updateEducation(i, 'cgpa', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--text-heading)' }}>Experience</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addExperience}><Plus size={16} /> Add</button>
              </div>
              {form.experience.map((exp, i) => (
                <div key={i} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '0.75rem', position: 'relative' }}>
                  <button type="button" className="btn-ghost" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem', color: 'var(--danger)' }}
                    onClick={() => removeExperience(i)}><Trash2 size={14} /></button>
                  <div className="form-group"><input className="form-input" placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} /></div>
                  <div className="form-group"><input className="form-input" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} /></div>
                  <div className="form-group"><input className="form-input" placeholder="Duration (e.g., 6 months)" value={exp.duration} onChange={(e) => updateExperience(i, 'duration', e.target.value)} /></div>
                  <textarea className="form-textarea" rows={2} placeholder="Description" value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="save-profile">
            <Save size={16} /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
