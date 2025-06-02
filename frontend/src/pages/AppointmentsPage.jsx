
// client/src/pages/AppointmentsPage.jsx
import React from 'react';
import AppointmentCalendar from '../components/Calendar/AppointmentCalendar';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  return (
    <div className="appointments-page">
      <header className="page-header">
        <h1>Mes Rendez-vous</h1>
        <p>Gérez vos rendez-vous médicaux</p>
      </header>
      <AppointmentCalendar />
    </div>
  );
};

export default AppointmentsPage;
