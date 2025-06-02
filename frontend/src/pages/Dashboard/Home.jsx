// client/src/pages/Dashboard/Home.jsx
import React, { useState, useEffect } from 'react';
import ExamsList from '../../components/Exams/ExamsList';
import AppointmentCalendar from '../../components/Calendar/AppointmentCalendar';
import DoctorMap from '../../components/Map/DoctorMap';
import examService from '../../services/examService';
import appointmentService from '../../services/appointmentService';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || {};
  });
  const [recentExams, setRecentExams] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer les examens récents
        const examsData = await examService.getUserExams();
        setRecentExams(examsData.slice(0, 5)); // Afficher les 5 derniers

        // Récupérer les rendez-vous à venir
        const appointmentsData = await appointmentService.getUserAppointments();
        
        // Filtrer et trier les rendez-vous à venir
        const today = new Date();
        const upcoming = appointmentsData
          .filter(app => new Date(app.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3); // Afficher les 3 prochains
        
        setUpcomingAppointments(upcoming);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Chargement du tableau de bord...</div>;

  return (
    <div className="dashboard-home">
      <header className="welcome-header">
      <h1>Jamm ak Jamm, {user?.fullName || 'Utilisateur'} !</h1>
      <p>Bienvenue sur votre tableau de bord médical. Gérer vos rendez-vous, consulter vos dossiers médicaux et plus encore.</p>
        <p className="current-date">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        {/* Section des examens récents */}
        <section className="dashboard-section">
          <h2>Vos examens récents</h2>
          {recentExams.length > 0 ? (
            <div className="recent-exams">
              {recentExams.map(exam => (
                <div key={exam.id} className="recent-exam-card">
                  <div className="exam-date">
                    {new Date(exam.date).toLocaleDateString('fr-FR')}
                  </div>
                  <h3 className="exam-type">{exam.type}</h3>
                  <p className="exam-description">{exam.description}</p>
                </div>
              ))}
              <button className="view-all-button">Voir tous les examens</button>
            </div>
          ) : (
            <p className="no-data">Aucun examen récent</p>
          )}
        </section>

        {/* Section du calendrier */}
        <section className="dashboard-section calendar-section">
          <h2>Vos rendez-vous</h2>
          <AppointmentCalendar />
        </section>

        {/* Section des prochains rendez-vous */}
        <section className="dashboard-section">
          <h2>Prochains rendez-vous</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="upcoming-appointments">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-date">
                    {new Date(appointment.date).toLocaleDateString('fr-FR')}
                    <span className="appointment-time">{appointment.time}</span>
                  </div>
                  <h3 className="doctor-name">{appointment.doctorName}</h3>
                  <p className="appointment-specialty">{appointment.specialty}</p>
                  <p className="appointment-location">{appointment.establishment}</p>
                </div>
              ))}
              <button className="view-all-button">Gérer mes rendez-vous</button>
            </div>
          ) : (
            <p className="no-data">Aucun rendez-vous à venir</p>
          )}
        </section>

        {/* Section de la carte et recherche */}
        <section className="dashboard-section map-section">
          <h2>Trouver un professionnel de santé</h2>
          <DoctorMap />
        </section>
      </div>
    </div>
  );
};

export default Home;