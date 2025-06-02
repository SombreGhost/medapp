// client/src/components/Dashboard/DashboardLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  IoGridOutline, 
  IoFolderOutline, 
  IoCalendarOutline, 
  IoPersonOutline,
  IoNotificationsOutline,
  IoLogOutOutline
} from 'react-icons/io5';
import authService from '../../services/authService';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [userName, setUserName] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return user.fullName || 'Utilisateur';
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="app-name">Med APP</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <IoGridOutline className="nav-icon" />
            <span>Mon Dashboard</span>
          </NavLink>
          
          <NavLink to="/medical-record" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <IoFolderOutline className="nav-icon" />
            <span>Mon Dossier Medical</span>
          </NavLink>
          
          <NavLink to="/appointments" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <IoCalendarOutline className="nav-icon" />
            <span>Mes Rendez-vous</span>
          </NavLink>
          
          <NavLink to="/profile" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            <IoPersonOutline className="nav-icon" />
            <span>Mon Compte</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <IoLogOutOutline className="nav-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="main-header">
          <div className="user-greeting">
            <p>Salut, <strong>{userName}</strong> !</p>
          </div>
          <div className="header-actions">
            <button className="notification-button">
              <IoNotificationsOutline />
            </button>
          </div>
        </header>
        
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;