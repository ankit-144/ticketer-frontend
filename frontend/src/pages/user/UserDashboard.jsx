import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelBooking, fetchUserBookings, getShow, fetchMovie, fetchAvailableSeats } from '../../api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id') || 'user-123';
      const rawBookings = await fetchUserBookings(userId);
      
      // Hydrate bookings with movie titles and seat labels
      const hydratedBookings = await Promise.all(rawBookings.map(async (b) => {
        try {
          const show = await getShow(b.show_id);
          const movie = await fetchMovie(show.movie_id);
          const allSeats = await fetchAvailableSeats(b.show_id);
          
          // Map raw ShowSeat IDs to readable seat labels (Row-Number)
          const readableSeats = b.seat_ids.map(seatId => {
            const seatObj = allSeats.find(s => s.id === seatId);
            return seatObj ? `${seatObj.row}-${seatObj.number}` : seatId;
          });

          return {
            id: b.id,
            showTitle: movie.title,
            time: show.start_time,
            seats: readableSeats,
            amount: b.price,
            status: b.status.toLowerCase()
          };
        } catch (e) {
          console.error("Hydration failed for booking", b.id, e);
          return {
            id: b.id,
            showTitle: "Unknown Show",
            time: b.created_at,
            seats: b.seat_ids,
            amount: b.price,
            status: b.status.toLowerCase()
          };
        }
      }));

      setBookings(hydratedBookings);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        alert('Booking cancelled successfully.');
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      } catch (err) {
        alert('Failed to cancel booking.');
      }
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
          <h3>No bookings found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't booked any tickets yet.</p>
          <button className="btn" onClick={() => navigate('/user/movies')}>Browse Movies</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(b => (
            <div key={b.id} style={{ 
              background: 'var(--card-bg)', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: `4px solid ${b.status === 'confirmed' ? 'var(--success)' : b.status === 'cancelled' ? 'var(--danger)' : 'var(--text-muted)'}`
            }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{b.showTitle}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  {new Date(b.time).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.9rem' }}>Seats: {b.seats.join(', ')}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>${b.amount.toFixed(2)}</p>
                <p style={{ 
                  textTransform: 'capitalize', 
                  fontSize: '0.8rem',
                  color: b.status === 'confirmed' ? 'var(--success)' : b.status === 'cancelled' ? 'var(--danger)' : 'var(--text-muted)',
                  marginBottom: '1rem'
                }}>{b.status}</p>
                {b.status === 'confirmed' && (
                  <button className="btn danger" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => handleCancel(b.id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
