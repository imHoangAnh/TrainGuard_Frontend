import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TrainDetails from './pages/TrainDetails';
import LoginPage from './pages/LoginPage';
import DevicesPage from './pages/DevicesPage';
import UsersPage from './pages/UsersPage';
import AdminLayout from './components/AdminLayout';

export default function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-rail-darker text-rail-text font-sans selection:bg-rail-primary/30">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/train/:id" element={<TrainDetails />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
