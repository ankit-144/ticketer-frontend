import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { confirmBooking, revertBooking } from '../../api';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, seats } = location.state || { amount: 0, seats: [] };
  
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      await confirmBooking(bookingId);
      navigate('/user/thank-you', { state: { bookingId, amount, seats } });
    } catch (err) {
      alert('Failed to confirm booking.');
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    if (confirm("Are you sure you want to cancel this transaction?")) {
      setLoading(true);
      try {
        await revertBooking(bookingId);
        navigate(-1); 
      } catch (err) {
        alert('Failed to revert booking.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="center" style={{ flexDirection: 'column', height: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2>Payment Details</h2>
        <p style={{ margin: '1rem 0' }}>You are paying for {seats.length} seats: <strong>{seats.join(', ')}</strong></p>
        <h1 style={{ color: 'var(--accent)', margin: '2rem 0' }}>${amount.toFixed(2)}</h1>
        
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Select Payment Method:</p>
          <div className="form-group">
            <select className="form-input">
              <option>Credit Card (**** 1234)</option>
              <option>PayPal</option>
              <option>Apple Pay</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleRevert} disabled={loading}>
            Revert
          </button>
          <button className="btn" onClick={handleBook} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm & Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
