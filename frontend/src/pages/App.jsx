
// frontend/src/pages/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../Contexts/AuthContext.jsx'; // Explicit .js extension
import PrivateRoute from '../components/common/PrivateRoute.jsx'; // Explicit .js extension

// Pages
import LoginPage from './LoginPage.jsx'; // Explicit .jsx extension
import RegisterPage from './RegisterPage.jsx'; // Explicit .jsx extension
import DashboardPage from './DashboardPage.jsx'; // Explicit .jsx extension
import MedicalRecordPage from './MedicalRecordPage.jsx'; // Explicit .jsx extension
import AppointmentsPage from './AppointmentsPage.jsx'; // Explicit .jsx extension
import ProfilePage from './ProfilePage.jsx'; // Explicit .jsx extension
import NotFoundPage from './NotFoundPage.jsx'; // Explicit .jsx extension

// Styles globaux
import '../styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/medical-record" element={<MedicalRecordPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Page 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
