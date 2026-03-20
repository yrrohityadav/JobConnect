import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';

export default function Layout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="app-layout">
        {user && <Sidebar open={sidebarOpen} />}
        <main className={`main-content ${!user ? 'no-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
