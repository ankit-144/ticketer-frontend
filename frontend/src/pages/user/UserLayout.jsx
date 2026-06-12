import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user_id');
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
          <Link to="/user/dashboard" className="logo">TicketMasterpiece</Link>
          <nav>
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
