import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShowsForMovie, fetchMovie, getScreen, getTheater } from '../../api';

const UserShows = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      try {
        setLoading(true);
        const movieData = await fetchMovie(movieId);
        setMovie(movieData);

        const rawShows = await fetchShowsForMovie(movieId);
        if (rawShows) {
          // Hydrate each show with screen and theater details
          const hydratedShows = await Promise.all(rawShows.map(async (show) => {
            try {
              const screen = await getScreen(show.screen_id);
              const theater = await getTheater(screen.theater_id);
              return {
                ...show,
                screenName: screen.name,
                theaterName: theater.name
              };
            } catch (err) {
              console.error("Failed to hydrate show", show.id, err);
              return {
                ...show,
                screenName: 'Unknown Screen',
                theaterName: 'Unknown Theater'
              };
            }
          }));
          setShows(hydratedShows);
        } else {
          setShows([]);
        }
      } catch (err) {
        console.error("Error loading shows", err);
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, [movieId]);

  if (loading) return <div className="center"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => navigate('/user/movies')}>&larr; Back</button>
        <h2>{movie ? movie.title : 'Select Show'}</h2>
      </div>
      <div className="grid">
        {shows.map(show => {
          const startTime = new Date(show.start_time).toLocaleString();
          return (
            <div key={show.id} className="card" onClick={() => navigate(`/user/shows/${show.id}/seats`)} style={{ cursor: 'pointer' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{startTime}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{show.theaterName}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{show.screenName}</p>
              <p style={{marginTop: 'auto', color: 'var(--accent)', fontWeight: 600}}>Select Seats &rarr;</p>
            </div>
          );
        })}
        {shows.length === 0 && <p>No shows available for this movie.</p>}
      </div>
    </div>
  );
};

export default UserShows;
