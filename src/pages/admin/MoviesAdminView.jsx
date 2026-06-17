import React, { useState, useEffect } from 'react';
import { fetchMovies, addMovie, updateMovie, deleteMovie } from '../../api';
import PlayCard from '../../components/PlayCard';
import Modal from '../../components/Modal';

const MoviesAdminView = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', duration: 120, genre: '', release_date: '', base_price: 10.00 });
  const [editingId, setEditingId] = useState(null);

  const fetchList = () => {
    setLoading(true);
    fetchMovies()
      .then(data => setMovies(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        ...formData, 
        duration: parseInt(formData.duration, 10),
        // Truncate base_price to 2 decimal places explicitly
        base_price: parseFloat(Number(formData.base_price).toFixed(2))
      };
      
      // Ensure release_date is formatted to RFC3339; throw error if not present since it's NOT NULL
      if (!data.release_date) {
        alert("Release date is required!");
        return;
      }
      data.release_date = new Date(data.release_date).toISOString();

      if (editingId) await updateMovie(editingId, data);
      else await addMovie(data);
      setModalOpen(false);
      fetchList();
    } catch (err) { alert("Error saving movie"); }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', duration: 120, genre: '', release_date: '', base_price: 10.00 });
    setModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingId(m.id);
    const releaseDateStr = m.release_date ? new Date(m.release_date).toISOString().slice(0, 16) : '';
    setFormData({ 
      title: m.title || '', 
      description: m.description || '', 
      duration: m.duration || 120, 
      genre: m.genre || '', 
      release_date: releaseDateStr, 
      base_price: m.base_price || 0 
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this movie?')) {
      try { await deleteMovie(id); fetchList(); } catch (e) { alert("Delete failed"); }
    }
  };

  if (loading) return <div className="center"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Movies</h2>
        <button className="btn" onClick={openAddModal}>Add Movie</button>
      </div>

      <div className="grid">
        {movies.map(m => (
          <PlayCard
            key={m.id}
            image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80"
            title={m.title}
            subtitle={`${m.duration} mins${m.genre ? ` • ${m.genre}` : ''}`}
            details={[m.description, `Base Price: $${m.base_price.toFixed(2)}`]}
            onEdit={() => openEditModal(m)}
            onDelete={() => handleDelete(m.id)}
          />
        ))}
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit Movie' : 'Add Movie'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {!editingId && (
              <div className="form-group">
                <label>Title <span style={{color:'var(--danger)'}}>*</span></label>
                <input className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
            )}
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Duration (mins) <span style={{color:'var(--danger)'}}>*</span></label>
              <input type="number" className="form-input" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <input className="form-input" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Release Date <span style={{color:'var(--danger)'}}>*</span></label>
              <input type="datetime-local" className="form-input" required value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Base Price <span style={{color:'var(--danger)'}}>*</span></label>
              <input type="number" step="0.01" className="form-input" required value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MoviesAdminView;
