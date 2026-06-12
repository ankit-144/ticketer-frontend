import React, { useState, useEffect } from 'react';
import { fetchMovies, fetchShowsForMovie, addShow, updateShow, deleteShow } from '../../api';
import PlayCard from '../../components/PlayCard';
import Modal from '../../components/Modal';

const ShowsAdminView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableScreens, setAvailableScreens] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ movie_id: '', screen_id: '', start_time: '', end_time: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMovies().then(data => {
      setMovies(data || []);
      if (data && data.length > 0) setSelectedMovieId(data[0].id);
    });
    
    // Fetch all screens for dropdown
    const adminId = localStorage.getItem('admin_id');
    if (adminId) {
      import('../../api').then(({ listTheatersByAdmin }) => {
        listTheatersByAdmin(adminId).then(theaters => {
          if (!theaters) return;
          const screens = theaters.flatMap(t => {
            if (!t.screens) return [];
            return t.screens.map(s => ({ ...s, theaterName: t.name }));
          });
          setAvailableScreens(screens);
        }).catch(console.error);
      });
    }
  }, []);

  const fetchShows = (movieId) => {
    if (!movieId) return;
    setLoading(true);
    import('../../api').then(({ fetchShowsForMovie }) => {
      fetchShowsForMovie(movieId)
        .then(data => setShows(data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  };

  useEffect(() => {
    fetchShows(selectedMovieId);
  }, [selectedMovieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { addShow, updateShow } = await import('../../api');
      const data = { ...formData };
      
      if (!data.start_time || !data.end_time || !data.screen_id) {
        alert("Screen, Start Time, and End Time are required!");
        return;
      }
      
      data.start_time = new Date(data.start_time).toISOString();
      data.end_time = new Date(data.end_time).toISOString();

      if (editingId) await updateShow(editingId, data);
      else await addShow(data);
      setModalOpen(false);
      fetchShows(selectedMovieId);
    } catch (err) { alert("Error saving show"); }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ movie_id: selectedMovieId, screen_id: '', start_time: '', end_time: '' });
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s.id);
    const localStart = s.start_time ? new Date(s.start_time).toISOString().slice(0, 16) : '';
    const localEnd = s.end_time ? new Date(s.end_time).toISOString().slice(0, 16) : '';
    setFormData({ movie_id: s.movie_id, screen_id: s.screen_id, start_time: localStart, end_time: localEnd });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this show?')) {
      try { 
        const { deleteShow } = await import('../../api');
        await deleteShow(id); 
        fetchShows(selectedMovieId); 
      } catch (e) { alert("Delete failed"); }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h2>Manage Shows for: </h2>
          <select className="form-input" value={selectedMovieId} onChange={e => setSelectedMovieId(e.target.value)}>
            {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <button className="btn" onClick={openAddModal}>Add Show</button>
      </div>

      {loading ? <div className="center"><div className="loader"></div></div> : (
        <div className="grid">
          {shows.map(s => {
            const screen = availableScreens.find(scr => scr.id === s.screen_id);
            const screenInfo = screen ? `${screen.theaterName} - ${screen.name}` : `Screen ID: ${s.screen_id}`;
            
            return (
              <PlayCard
                key={s.id}
                title={new Date(s.start_time).toLocaleString()}
                subtitle={`Ends: ${new Date(s.end_time || s.start_time).toLocaleString()}`}
                details={[screenInfo]}
                onEdit={() => openEditModal(s)}
                onDelete={() => handleDelete(s.id)}
              />
            );
          })}
          {shows.length === 0 && <p>No shows found for this movie.</p>}
        </div>
      )}

      {modalOpen && (
        <Modal title={editingId ? 'Edit Show' : 'Add Show'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Screen <span style={{color:'var(--danger)'}}>*</span></label>
              <select className="form-input" required value={formData.screen_id} onChange={e => setFormData({...formData, screen_id: e.target.value})}>
                <option value="" disabled>Select a screen</option>
                {availableScreens.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.theaterName})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time <span style={{color:'var(--danger)'}}>*</span></label>
              <input type="datetime-local" className="form-input" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Time <span style={{color:'var(--danger)'}}>*</span></label>
              <input type="datetime-local" className="form-input" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ShowsAdminView;
