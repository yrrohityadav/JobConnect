import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <button className="btn-ghost navbar-toggle" onClick={onToggleSidebar} id="sidebar-toggle">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">J</span>
          <span className="brand-text">JobConnect</span>
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to={`/${user.role}/dashboard`} className="btn-ghost btn-sm" id="nav-notifications">
              <Bell size={18} />
            </Link>
            <div className="navbar-dropdown">
              <button
                className="navbar-user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="nav-user-menu"
              >
                <div className="navbar-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="navbar-user-name">{user.name}</span>
                <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu" onClick={() => setDropdownOpen(false)}>
                  <Link to={`/${user.role}/dashboard`} className="dropdown-item">
                    <User size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item dropdown-danger" id="nav-logout">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Get Started</Link>
          </div>
        )}
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--navbar-height);
          background: rgba(15, 15, 26, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 100;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .navbar-toggle {
          display: none;
          padding: 0.5rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-heading);
        }
        .brand-icon {
          width: 32px;
          height: 32px;
          background: var(--accent-gradient);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          font-weight: 800;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .navbar-auth {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .navbar-dropdown {
          position: relative;
        }
        .navbar-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 0.375rem 0.75rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
        }
        .navbar-user-btn:hover {
          border-color: var(--border-accent);
        }
        .navbar-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }
        .navbar-user-name {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          min-width: 180px;
          padding: 0.5rem;
          animation: slideUp 0.2s ease;
          z-index: 200;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--text-primary);
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: 'Inter', sans-serif;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: rgba(124, 58, 237, 0.1);
          color: var(--accent-primary);
        }
        .dropdown-danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
        }
        @media (max-width: 768px) {
          .navbar-toggle { display: flex; }
          .navbar-user-name { display: none; }
        }
      `}</style>
    </nav>
  );
}
