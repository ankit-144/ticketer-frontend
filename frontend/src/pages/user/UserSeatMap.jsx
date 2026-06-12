import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAvailableSeats, initiateBooking, getShow, getSeats } from '../../api';

const UserSeatMap = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadSeatMap = async () => {
      try {
        setLoading(true);
        const showData = await getShow(showId);
        setShow(showData);

        const [showSeatsData, physicalSeatsData] = await Promise.all([
          fetchAvailableSeats(showId).catch(() => []),
          getSeats(showData.screen_id).catch(() => [])
        ]);

        // Merge physical seat properties (row, number, type) into the show seat objects
        const hydratedSeats = showSeatsData.map(showSeat => {
          const physicalSeat = physicalSeatsData.find(s => s.id === showSeat.seat_id);
          return {
            ...showSeat,
            row: physicalSeat ? physicalSeat.row : 'A',
            number: physicalSeat ? physicalSeat.number : 0,
            type: physicalSeat ? physicalSeat.type : 'NORMAL'
          };
        }).filter(s => s.status === 'AVAILABLE'); // Only keep available seats

        setSeats(hydratedSeats);
      } catch (err) {
        console.error("Failed to load seat map data", err);
      } finally {
        setLoading(false);
      }
    };

    loadSeatMap();
  }, [showId]);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) return;
    setBookingLoading(true);
    try {
      const userId = localStorage.getItem('user_id') || 'user-123';
      const booking = await initiateBooking(showId, selectedSeats, userId);
      // The pricing service on the backend calculated the true price
      navigate(`/user/payment/${booking.id}`, { state: { amount: booking.price, seats: selectedSeats } });
    } catch (err) {
      alert('Failed to initiate booking. Seats might be unavailable.');
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;

  const rows = seats.reduce((acc, seat) => {
    const row = seat.row || 'A';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>&larr; Back</button>
        <h2>Select Your Seats</h2>
      </div>

      <div className="screen"></div>

      <div className="seats-grid">
        {Object.keys(rows).sort().map(row => (
          <div key={row} className="seat-row">
            {rows[row].sort((a, b) => a.number - b.number).map(seat => {
              const isSelected = selectedSeats.includes(seat.id);
              let typeClass = '';
              if (seat.type === 'VIP') typeClass = 'vip';
              if (seat.type === 'PREMIUM') typeClass = 'premium';

              let className = `seat available ${typeClass}`;
              if (isSelected) className += ' selected';

              return (
                <div
                  key={seat.id}
                  className={className}
                  onClick={() => toggleSeat(seat)}
                  title={`Seat ${seat.row}-${seat.number} (${seat.type})`}
                >
                  {seat.number}
                </div>
              );
            })}
          </div>
        ))}
        {seats.length === 0 && <p style={{ textAlign: 'center', width: '100%', marginTop: '2rem' }}>No seats available.</p>}
      </div>

      <div className="legend">
        <div className="legend-item"><div className="legend-box available"></div> Regular</div>
        <div className="legend-item"><div className="legend-box available premium"></div> Premium</div>
        <div className="legend-item"><div className="legend-box available vip"></div> VIP</div>
        <div className="legend-item"><div className="legend-box selected"></div> Selected</div>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Ready to Book?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{selectedSeats.length} seats selected</p>
        </div>
        <button
          className="btn"
          disabled={selectedSeats.length === 0 || bookingLoading}
          onClick={handleBook}
        >
          {bookingLoading ? 'Processing...' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};

export default UserSeatMap;
