import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../../api';

const UserMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies()
      .then(data => setMovies(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center"><div className="loader"></div></div>;

  return (
    <div>
      <h2>Now Showing</h2>
      <div className="grid">
        {movies.map(movie => (
          <div key={movie.id} className="card" onClick={() => navigate(`/user/movies/${movie.id}/shows`)}>
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" alt={movie.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
            <h3>{movie.title}</h3>
            <p style={{marginTop: 'auto', color: 'var(--accent)', fontWeight: 600}}>View Shows &rarr;</p>
          </div>
        ))}
        {movies.length === 0 && <p>No movies available right now.</p>}
      </div>
    </div>
  );
};

export default UserMovies;
