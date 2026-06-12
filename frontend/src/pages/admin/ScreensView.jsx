import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScreens, addScreen, updateScreen, deleteScreen } from '../../api';
import PlayCard from '../../components/PlayCard';
import Modal from '../../components/Modal';

const ScreensView = () => {
  const { theaterId } = useParams();
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchList = () => {
    setLoading(true);
    getScreens(theaterId)
      .then(data => setScreens(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, [theaterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateScreen(editingId, formData);
      } else {
        await addScreen(theaterId, formData);
      }
      setModalOpen(false);
      setFormData({ name: '' });
      setEditingId(null);
      fetchList();
    } catch (err) {
      alert("Error saving screen");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '' });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingId(t.id);
    setFormData({ name: t.name });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this screen?')) {
      try {
        await deleteScreen(theaterId, id);
        fetchList();
      } catch (e) { alert("Delete failed"); }
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/theaters')}>&larr; Back</button>
          <h2>Screens</h2>
        </div>
        <button className="btn" onClick={openAddModal}>Add Screen</button>
      </div>

      <div className="grid">
        {screens.map(s => (
          <PlayCard
            key={s.id}
            title={s.name}
            onEdit={() => openEditModal(s)}
            onDelete={() => handleDelete(s.id)}
            onClick={() => navigate(`/admin/screens/${s.id}/seats`)}
          />
        ))}
        {screens.length === 0 && <p>No screens found.</p>}
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit Screen' : 'Add Screen'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" required value={formData.name} onChange={e => setFormData({name: e.target.value})} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ScreensView;
