import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTheatersByAdmin, addTheater, updateTheater, deleteTheater } from '../../api';
import { useAuth } from '../../components/AuthContext';
import PlayCard from '../../components/PlayCard';
import Modal from '../../components/Modal';

const TheatersView = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  
  const { user } = useAuth();
  const adminId = user?.id || 'admin-123';
  const navigate = useNavigate();

  const fetchList = () => {
    setLoading(true);
    listTheatersByAdmin(adminId)
      .then(data => setTheaters(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (adminId) fetchList();
  }, [adminId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTheater(editingId, { admin_id: adminId, ...formData });
      } else {
        await addTheater({ admin_id: adminId, ...formData });
      }
      setModalOpen(false);
      setFormData({ name: '', location: '' });
      setEditingId(null);
      fetchList();
    } catch (err) {
      alert("Error saving theater");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', location: '' });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingId(t.id);
    setFormData({ name: t.name, location: t.location });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this theater?')) {
      try {
        await deleteTheater(id);
        fetchList();
      } catch (e) { alert("Delete failed"); }
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Theaters</h2>
        <button className="btn" onClick={openAddModal}>Add Theater</button>
      </div>

      <div className="grid">
        {theaters.map(t => (
          <PlayCard
            key={t.id}
            image="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80"
            title={t.name}
            subtitle={t.location}
            onEdit={() => openEditModal(t)}
            onDelete={() => handleDelete(t.id)}
            onClick={() => navigate(`/admin/theaters/${t.id}/screens`)}
          />
        ))}
        {theaters.length === 0 && <p>No theaters found.</p>}
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit Theater' : 'Add Theater'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-input" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TheatersView;
