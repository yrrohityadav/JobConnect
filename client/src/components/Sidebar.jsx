import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, Briefcase, FileText, Bookmark,
  Building2, PlusCircle, ClipboardList, Users, ShieldCheck, BarChart3
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
  { to: '/student/jobs', icon: Briefcase, label: 'Browse Jobs' },
  { to: '/student/applications', icon: FileText, label: 'My Applications' },
  { to: '/student/saved-jobs', icon: Bookmark, label: 'Saved Jobs' },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/company', icon: Building2, label: 'Company Profile' },
  { to: '/recruiter/post-job', icon: PlusCircle, label: 'Post a Job' },
  { to: '/recruiter/jobs', icon: ClipboardList, label: 'Manage Jobs' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
  { to: '/admin/approvals', icon: ShieldCheck, label: 'Recruiter Approvals' },
];

export default function Sidebar({ open }) {
  const { user } = useAuth();

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'recruiter' ? recruiterLinks
    : studentLinks;

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-section-label">
        {user?.role === 'admin' ? 'Administration' : user?.role === 'recruiter' ? 'Recruiter Panel' : 'Student Panel'}
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar {
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          padding: 1.5rem 0.75rem;
          overflow-y: auto;
          z-index: 90;
          transition: var(--transition);
        }
        .sidebar-section-label {
          padding: 0 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.875rem;
          font-weight: 450;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          text-decoration: none;
        }
        .sidebar-link:hover {
          color: var(--text-primary);
          background: rgba(124, 58, 237, 0.08);
        }
        .sidebar-link.active {
          color: white;
          background: var(--accent-gradient);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
