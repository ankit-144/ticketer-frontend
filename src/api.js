const API_BASE = '/api';

// Helper function to include credentials in all requests
const fetchAuth = async (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};

export const fetchMe = async () => {
  const res = await fetch('/auth/me', { credentials: 'include' });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Logout failed');
  return res.json();
};

export const fetchMovies = async () => {
  const res = await fetchAuth(`${API_BASE}/movies`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
};

export const fetchMovie = async (id) => {
  const res = await fetchAuth(`${API_BASE}/movies/${id}`);
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
};

export const fetchShowsForMovie = async (movieId) => {
  const res = await fetchAuth(`${API_BASE}/movies/${movieId}/shows`);
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
};

export const fetchAvailableSeats = async (showId) => {
  const res = await fetchAuth(`${API_BASE}/shows/${showId}/seats`);
  if (!res.ok) throw new Error('Failed to fetch seats');
  return res.json();
};

export const initiateBooking = async (showId, seatIds, userId) => {
  const res = await fetchAuth(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      show_id: showId,
      seat_ids: seatIds,
      user_id: userId
    })
  });
  if (!res.ok) throw new Error('Failed to initiate booking');
  return res.json();
};

export const confirmBooking = async (bookingId) => {
  const res = await fetchAuth(`${API_BASE}/bookings/${bookingId}/confirm`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to confirm booking');
  return res.json();
};

export const cancelBooking = async (bookingId) => {
  const res = await fetchAuth(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to cancel booking');
  return res.json();
};

export const revertBooking = async (bookingId) => {
  const res = await fetchAuth(`${API_BASE}/bookings/${bookingId}/revert`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to revert booking');
  return res.json();
};

export const fetchUserBookings = async (userId) => {
  const res = await fetchAuth(`${API_BASE}/bookings?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user bookings');
  return res.json();
};

// --- Theater Endpoints ---
export const addTheater = async (data) => {
  const res = await fetchAuth(`${API_BASE}/admin/theaters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add theater');
  return res.json();
};

export const listTheatersByAdmin = async (adminId) => {
  const res = await fetchAuth(`${API_BASE}/admin/theaters?admin_id=${adminId}`);
  if (!res.ok) throw new Error('Failed to list theaters');
  return res.json();
};

export const getTheater = async (id) => {
  const res = await fetchAuth(`${API_BASE}/theaters/${id}`);
  if (!res.ok) throw new Error('Failed to get theater');
  return res.json();
};

export const updateTheater = async (id, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/theaters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update theater');
  return res.json();
};

export const deleteTheater = async (id) => {
  const res = await fetchAuth(`${API_BASE}/admin/theaters/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete theater');
  return res.status === 204 ? null : res.json();
};

// --- Screen Endpoints ---
export const addScreen = async (theaterId, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/theaters/${theaterId}/screens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add screen');
  return res.json();
};

export const getScreens = async (theaterId) => {
  const res = await fetchAuth(`${API_BASE}/theaters/${theaterId}/screens`);
  if (!res.ok) throw new Error('Failed to get screens');
  return res.json();
};

export const getScreen = async (id) => {
  const res = await fetchAuth(`${API_BASE}/screens/${id}`);
  if (!res.ok) throw new Error('Failed to get screen');
  return res.json();
};

export const updateScreen = async (screenId, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/screens/${screenId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update screen');
  return res.json();
};

export const deleteScreen = async (theaterId, screenId) => {
  const res = await fetchAuth(`${API_BASE}/admin/theaters/${theaterId}/screens/${screenId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete screen');
  return res.status === 204 ? null : res.json();
};

// --- Seat Endpoints ---
export const addSeat = async (screenId, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/screens/${screenId}/seats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add seat');
  return res.json();
};

export const getSeats = async (screenId) => {
  const res = await fetchAuth(`${API_BASE}/screens/${screenId}/seats`);
  if (!res.ok) throw new Error('Failed to get seats');
  return res.json();
};

export const updateSeat = async (seatId, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/seats/${seatId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update seat');
  return res.json();
};

export const deleteSeat = async (screenId, seatId) => {
  const res = await fetchAuth(`${API_BASE}/admin/screens/${screenId}/seats/${seatId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete seat');
  return res.status === 204 ? null : res.json();
};

// --- Movie Endpoints ---
export const addMovie = async (data) => {
  const res = await fetchAuth(`${API_BASE}/admin/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add movie');
  return res.json();
};

export const updateMovie = async (id, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update movie');
  return res.json();
};

export const deleteMovie = async (id) => {
  const res = await fetchAuth(`${API_BASE}/admin/movies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete movie');
  return res.status === 204 ? null : res.json();
};

// --- Show Endpoints ---
export const addShow = async (data) => {
  const res = await fetchAuth(`${API_BASE}/admin/shows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add show');
  return res.json();
};

export const getShow = async (id) => {
  const res = await fetchAuth(`${API_BASE}/shows/${id}`);
  if (!res.ok) throw new Error('Failed to get show');
  return res.json();
};

export const getShowsByTheater = async (theaterId) => {
  const res = await fetchAuth(`${API_BASE}/theaters/${theaterId}/shows`);
  if (!res.ok) throw new Error('Failed to get shows by theater');
  return res.json();
};

export const updateShow = async (id, data) => {
  const res = await fetchAuth(`${API_BASE}/admin/shows/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update show');
  return res.json();
};

export const deleteShow = async (id) => {
  const res = await fetchAuth(`${API_BASE}/admin/shows/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete show');
  return res.status === 204 ? null : res.json();
};
