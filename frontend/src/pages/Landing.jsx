import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        navigate('/admin/theaters');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = (role) => {
    window.location.href = `/auth/google/login?role=${role}`;
  };

  if (loading) {
    return <div className="center" style={{ height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="center" style={{ height: '100vh', flexDirection: 'column' }}>
      <h1 className="logo" style={{ fontSize: '3rem', marginBottom: '3rem' }}>TicketMasterpiece</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <button 
          className="btn" 
          style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
          onClick={() => handleLogin('admin')}
        >
          Login as Admin
        </button>
        <button 
          className="btn btn-outline" 
          style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
          onClick={() => handleLogin('user')}
        >
          Login as User
        </button>
      </div>
    </div>
  );
};

export default Landing;
