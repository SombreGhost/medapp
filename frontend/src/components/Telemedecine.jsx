import React from 'react';
import './Telemedicine.css';

// Composant pour gérer les téléconsultations
const Telemedicine = () => {
  // Liste statique des médecins disponibles pour la téléconsultation
  const doctors = [
    {
      name: 'Dr. Khadija Mbaye',
      specialty: 'Cardiologue',
      location: 'Hôpital Général de Grand Yoff, Dakar',
      available: true,
    },
    {
      name: 'Dr. Samba Thiam',
      specialty: 'Pédiatre',
      location: 'Clinique Nabil Choucair, Dakar',
      available: false,
    },
    {
      name: 'Dr. Fatimata Sy',
      specialty: 'Gynécologue',
      location: 'Hôpital de Pikine, Dakar',
      available: true,
    },
  ];

  // Gère le démarrage d'une consultation vidéo (placeholder)
  const handleStartConsultation = (doctor) => {
    if (doctor.available) {
      alert(`Démarrage de la consultation vidéo avec ${doctor.name} (${doctor.location}).`);
    } else {
      alert(`${doctor.name} n'est pas disponible pour une consultation actuellement.`);
    }
  };

  return (
    <div className="telemedicine">
      <h2 className="section-title">Téléconsultation</h2>
      <p className="telemedicine-info">
        Sélectionnez un médecin pour démarrer une consultation vidéo.
      </p>
      <ul className="doctor-list">
        {doctors.map((doctor, index) => (
          <li key={index} className="doctor-item">
            <div className="doctor-details">
              <strong>{doctor.name}</strong><br />
              Spécialité: {doctor.specialty}<br />
              Lieu: {doctor.location}<br />
              Statut: {doctor.available ? 'Disponible' : 'Indisponible'}
            </div>
            <button
              onClick={() => handleStartConsultation(doctor)}
              disabled={!doctor.available}
              className={doctor.available ? 'consult-button' : 'consult-button disabled'}
            >
              Démarrer la Consultation
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Telemedicine;
