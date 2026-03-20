import { useState, useEffect } from 'react';
import { Trash2, Search, Users } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.data.users);
    } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/admin/users/${id}`); setUsers(users.filter((u) => u._id !== id)); toast.success('User deleted'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><div><h1>Manage Users</h1><p>{users.length} users on the platform</p></div></div>

      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} />
        </div>
        <select className="form-select" style={{ width: 160 }} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); }}>
          <option value="">All Roles</option><option value="student">Student</option><option value="recruiter">Recruiter</option><option value="admin">Admin</option>
        </select>
        <button className="btn btn-primary" onClick={fetchUsers}>Search</button>
      </div>

      {loading ? <div className="loader-container"><div className="loader" /></div> : users.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>No users found</h3></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{u.name}</td>
                  <td style={{ fontSize: '0.813rem' }}>{u.email}</td>
                  <td><span className="badge" style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', textTransform: 'capitalize' }}>{u.role}</span></td>
                  <td>{u.isVerified ? '✅' : '❌'}</td>
                  <td style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => deleteUser(u._id)}><Trash2 size={14} /></button>
                    )}
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
