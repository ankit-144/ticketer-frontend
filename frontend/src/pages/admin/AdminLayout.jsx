import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_id');
    navigate('/');
  };

  const navLinkStyle = (path) => ({
    color: location.pathname.includes(path) ? 'var(--accent)' : 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: location.pathname.includes(path) ? 'bold' : 'normal',
    marginRight: '20px'
  });

  return (
    <>
      <header>
        <div className="header-content">
          <Link to="/admin/theaters" className="logo">Admin Dashboard</Link>
          <nav>
            <Link to="/admin/theaters" style={navLinkStyle('/admin/theaters')}>Theaters</Link>
            <Link to="/admin/movies" style={navLinkStyle('/admin/movies')}>Movies</Link>
            <Link to="/admin/shows" style={navLinkStyle('/admin/shows')}>Shows</Link>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
