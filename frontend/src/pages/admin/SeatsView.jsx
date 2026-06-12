import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeats, addSeat, updateSeat, deleteSeat } from '../../api';
import Modal from '../../components/Modal';

const SeatsView = () => {
  const { screenId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ row: '', number: '', type: 'NORMAL' });

  const fetchList = () => {
    setLoading(true);
    getSeats(screenId)
      .then(data => setSeats(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, [screenId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData, number: parseInt(formData.number, 10) };
      if (editingId) {
        await updateSeat(editingId, dataToSubmit);
      } else {
        await addSeat(screenId, dataToSubmit);
      }
      setModalOpen(false);
      fetchList();
    } catch (err) {
      alert("Error saving seat");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ row: '', number: '', type: 'NORMAL' });
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s.id);
    setFormData({ row: s.row, number: s.number, type: s.type });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this seat?')) {
      try {
        await deleteSeat(screenId, id);
        fetchList();
      } catch (e) { alert("Delete failed"); }
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;

  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    const row = seat.row || 'A';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>&larr; Back</button>
          <h2>Manage Seats</h2>
        </div>
        <button className="btn" onClick={openAddModal}>Add Seat</button>
      </div>

      <div className="screen"></div>
      
      <div className="seats-grid">
        {Object.keys(rows).sort().map(row => (
          <div key={row} className="seat-row">
            {rows[row].sort((a,b) => a.number - b.number).map(seat => {
              const typeClass = seat.type ? seat.type.toLowerCase() : 'normal';
              let className = `seat ${typeClass}`;
              return (
                <div 
                  key={seat.id} 
                  className={className}
                  onClick={() => openEditModal(seat)}
                  title={`ID: ${seat.id}\nRow: ${seat.row}\nNumber: ${seat.number}\nType: ${seat.type}`}
                >
                  {seat.number}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item"><div className="legend-box normal"></div> Regular</div>
        <div className="legend-item"><div className="legend-box premium"></div> Premium</div>
        <div className="legend-item"><div className="legend-box vip"></div> VIP</div>
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit Seat' : 'Add Seat'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Row</label>
              <input className="form-input" required value={formData.row} onChange={e => setFormData({...formData, row: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Seat Number</label>
              <input type="number" className="form-input" required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="NORMAL">Regular</option>
                <option value="PREMIUM">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            {editingId && (
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
                <button type="button" className="btn btn-outline" style={{borderColor: 'var(--danger)', color: 'var(--danger)'}} onClick={() => handleDelete(editingId)}>Delete Seat</button>
                <button className="btn" type="submit">Update</button>
              </div>
            )}
            {!editingId && <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SeatsView;
