import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DoctorMap from '../components/Map/DoctorMap.jsx';
import DicomStudies from '../components/DicomStudies.jsx';
import Telemedicine from '../components/Telemedicine.jsx';
import './Dashboard.css';

// Composant principal du tableau de bord utilisateur
const Dashboard = () => {
  // Récupère les informations de l'utilisateur connecté via le contexte d'authentification
  const { user } = useAuth();

  // Liste statique des rendez-vous (à remplacer par une API plus tard)
  const appointments = [
    { id: 1, doctor: 'Dr. Cheikh Fall', specialty: 'Généraliste', location: 'Hôpital Fann, Dakar', date: '20 Avril 2025', time: '10:00' },
    { id: 2, doctor: 'Dr. Aissatou Ndiaye', specialty: 'Gynécologue', location: 'Hôpital Principal, Dakar', date: '25 Avril 2025', time: '14:30' },
    { id: 3, doctor: 'Dr. Mamadou Ba', specialty: 'Dentiste', location: 'Centre de Santé de Thiès, Thiès', date: '1 Mai 2025', time: '09:00' },
    { id: 4, doctor: 'Dr. Fatou Sow', specialty: 'Cardiologue', location: 'Clinique Madeleine, Dakar', date: '5 Mai 2025', time: '11:00' },
  ];

  // Gestion de la pagination pour les rendez-vous
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 2; // Nombre de rendez-vous par page
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  // Calcule les rendez-vous à afficher sur la page actuelle
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const currentAppointments = appointments.slice(startIndex, startIndex + appointmentsPerPage);

  // Fonctions pour naviguer entre les pages
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="dashboard">
      {/* Titre avec salutation personnalisée en wolof */}
      <h1 className="dashboard-title">
        Jamm ak Jamm, {user.name} !
      </h1>

      {/* Section des rendez-vous avec pagination */}
      <div className="appointments-section">
        <h2 className="section-title">Prochains Rendez-vous</h2>
        {appointments.length === 0 ? (
          <p className="no-appointments">Aucun rendez-vous à venir.</p>
        ) : (
          <>
            <div className="appointments-list">
              {currentAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <h3>{appointment.doctor}</h3>
                  <p>Spécialité: {appointment.specialty}</p>
                  <p>Lieu: {appointment.location}</p>
                  <p>Date: {appointment.date} à {appointment.time}</p>
                </div>
              ))}
            </div>
            {/* Contrôles de pagination */}
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Précédent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Suivant
              </button>
            </div>
          </>
        )}
      </div>

      {/* Sections pour la téléconsultation, les études DICOM et la carte */}
      <Telemedicine />
      <DicomStudies />
      <DoctorMap />
    </div>
  );
};

export default Dashboard;