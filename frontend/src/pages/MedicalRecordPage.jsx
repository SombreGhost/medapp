// client/src/pages/MedicalRecordPage.jsx
import React from 'react';
import ExamsList from '../components/Exams/ExamList';
import './MedicalRecordPage.css';

const MedicalRecordPage = () => {
  return (
    <div className="medical-record-page">
      <header className="page-header">
        <h1>Mon Dossier Médical</h1>
        <p>Consultez l'historique de vos examens médicaux</p>
      </header>
      <ExamsList />
    </div>
  );
};

export default MedicalRecordPage;
