// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import ExamsList from '../components/Exams/ExamList';
import AppointmentCalendar from '../components/Calendar/AppointmentCalendar';
import DoctorMap from '../components/Map/DoctorMap';
import appointmentService from '../services/appointmentService';
import examService from '../services/examService';
import { useAuth } from '../Contexts/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer les rendez-vous à venir
        const appointments = await appointmentService.getUserAppointments();
        
        // Filtrer pour n'avoir que les rendez-vous à venir
        const today = new Date();
        const upcoming = appointments
          .filter(app => new Date(app.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3); // Limiter aux 3 prochains
        
        setUpcomingAppointments(upcoming);
        
        // Récupérer les examens récents
        const exams = await examService.getUserExams();
        
        // Trier par date décroissante
        const recent = exams
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3); // Limiter aux 3 plus récents
        
        setRecentExams(recent);
      } catch (err) {
        setError('Impossible de charger les données du tableau de bord');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <div className="dashboard-loading">Chargement du tableau de bord...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <h1>Bienvenue, {user.fullName}</h1>
        <p>Voici un aperçu de votre santé et de vos rendez-vous</p>
      </header>
      
      <div className="dashboard-grid">
        {/* Section des rendez-vous à venir */}
        <section className="dashboard-section upcoming-appointments">
          <h2>Prochains rendez-vous</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-date">
                    {formatDate(appointment.date)} à {appointment.time}
                  </div>
                  <h3 className="appointment-doctor">{appointment.doctorName}</h3>
                  <div className="appointment-specialty">{appointment.specialty}</div>
                  <div className="appointment-location">{appointment.establishment}</div>
                  <div className={`appointment-status status-${appointment.status}`}>
                    {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">Aucun rendez-vous à venir</p>
          )}
          <a href="/appointments" className="view-all-link">Voir tous mes rendez-vous</a>
        </section>
        
        {/* Section des examens récents */}
        <section className="dashboard-section recent-exams">
          <h2>Examens récents</h2>
          {recentExams.length > 0 ? (
            <div className="exams-list">
              {recentExams.map(exam => (
                <div key={exam.id} className="exam-card mini">
                  <div className="exam-date">{formatDate(exam.date)}</div>
                  <h3 className="exam-type">{exam.type}</h3>
                  <div className="exam-description">{exam.description}</div>
                  <div className="exam-results">
                    <strong>Résultat:</strong> {exam.results}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">Aucun examen récent</p>
          )}
          <a href="/medical-record" className="view-all-link">Voir mon dossier médical complet</a>
        </section>

        {/* Calendrier des rendez-vous */}
        <section className="dashboard-section calendar-section">
          <h2>Calendrier des rendez-vous</h2>
          <AppointmentCalendar />
        </section>
        
        {/* Carte des médecins et établissements */}
        <section className="dashboard-section map-section">
          <h2>Trouver un médecin ou un établissement</h2>
          <DoctorMap />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;