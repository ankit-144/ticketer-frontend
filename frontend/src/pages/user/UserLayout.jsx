import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
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
          <Link to="/user/dashboard" className="logo">TicketMasterpiece</Link>
          <nav>
            <span style={{ marginRight: '20px', color: 'var(--text-secondary)' }}>Welcome, {user.name || user.email}</span>
            <Link to="/user/dashboard" style={navLinkStyle('/user/dashboard')}>Dashboard</Link>
            <Link to="/user/movies" style={navLinkStyle('/user/movies')}>Browse Movies</Link>
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

export default UserLayout;
