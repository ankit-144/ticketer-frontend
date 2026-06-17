import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/');
      } else if (user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkStyle = (path) => ({
    color: location.pathname.includes(path) ? 'var(--accent)' : 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: location.pathname.includes(path) ? 'bold' : 'normal',
    marginRight: '20px'
  });

  if (loading || !user) {
    return <div className="center" style={{ height: '100vh' }}>Loading...</div>;
  }

  return (
    <>
      <header>
        <div className="header-content">
          <Link to="/admin/theaters" className="logo">Admin Dashboard</Link>
          <nav>
            <span style={{ marginRight: '20px', color: 'var(--text-secondary)' }}>Welcome, {user.name || user.email}</span>
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
