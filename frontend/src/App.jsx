import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';

import Landing from './pages/Landing';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import TheatersView from './pages/admin/TheatersView';
import ScreensView from './pages/admin/ScreensView';
import SeatsView from './pages/admin/SeatsView';
import MoviesAdminView from './pages/admin/MoviesAdminView';
import ShowsAdminView from './pages/admin/ShowsAdminView';

// User Pages
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserMovies from './pages/user/UserMovies';
import UserShows from './pages/user/UserShows';
import UserSeatMap from './pages/user/UserSeatMap';
import PaymentPage from './pages/user/PaymentPage';
import ThankYouPage from './pages/user/ThankYouPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="theaters" />} />
          <Route path="theaters" element={<TheatersView />} />
          <Route path="theaters/:theaterId/screens" element={<ScreensView />} />
          <Route path="screens/:screenId/seats" element={<SeatsView />} />
          <Route path="movies" element={<MoviesAdminView />} />
          <Route path="shows" element={<ShowsAdminView />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="movies" element={<UserMovies />} />
          <Route path="movies/:movieId/shows" element={<UserShows />} />
          <Route path="shows/:showId/seats" element={<UserSeatMap />} />
          <Route path="payment/:bookingId" element={<PaymentPage />} />
          <Route path="thank-you" element={<ThankYouPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
