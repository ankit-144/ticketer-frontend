import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, seats } = location.state || {};

  return (
    <div className="center" style={{ flexDirection: 'column', height: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center', borderColor: 'var(--success)' }}>
        <h1 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Booking Confirmed!</h1>
        <p>Thank you for your purchase.</p>
        
        <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginTop: '2rem', textAlign: 'left' }}>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Seats:</strong> {seats?.join(', ')}</p>
          <p><strong>Amount Paid:</strong> ${amount?.toFixed(2)}</p>
        </div>

        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/user/dashboard')}>
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
