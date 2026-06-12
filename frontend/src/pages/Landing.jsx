import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="center" style={{ height: '100vh', flexDirection: 'column' }}>
      <h1 className="logo" style={{ fontSize: '3rem', marginBottom: '3rem' }}>TicketMasterpiece</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <button 
          className="btn" 
          style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
          onClick={() => {
            const adminId = prompt("Enter your Admin ID:");
            if (adminId) {
              localStorage.setItem('admin_id', adminId);
              navigate('/admin/theaters');
            }
          }}
        >
          Enter as Admin
        </button>
        <button 
          className="btn btn-outline" 
          style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
          onClick={() => {
            const userId = prompt("Enter your User ID:");
            if (userId) {
              localStorage.setItem('user_id', userId);
              navigate('/user/dashboard');
            }
          }}
        >
          Enter as User
        </button>
      </div>
    </div>
  );
};

export default Landing;
