// frontend/src/components/DicomStudies.jsx
import React, { useState, useEffect } from 'react';
import { getStudies, getStudyDetails, uploadDicomFile, deleteStudy } from '../services/orthancService.jsx';
import './DicomStudies.css';

// Composant pour afficher, uploader et gérer les études DICOM (imagerie médicale)
const DicomStudies = () => {
  // États pour gérer les études, le chargement, la traçabilité et l'upload
  const [studies, setStudies] = useState([]); // Liste des études DICOM
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [traceabilityLog, setTraceabilityLog] = useState([]); // Journal des actions utilisateur
  const [file, setFile] = useState(null); // Fichier DICOM sélectionné pour l'upload
  const [uploadError, setUploadError] = useState(''); // Message d'erreur pour l'upload

  // Message de débogage pour vérifier que le composant est rendu
  console.log('DicomStudies : Composant rendu');

  // Chargement des études au montage du composant et après chaque action
  const fetchStudies = async () => {
    console.log('DicomStudies : Tentative de récupération des études');
    try {
      // Récupère la liste des IDs des études depuis Orthanc
      const studyIds = await getStudies();
      console.log('DicomStudies : Études récupérées', studyIds);
      if (studyIds.length === 0) {
        // Si aucune étude n'est trouvée, utilise des données statiques (fallback)
        setStudies([
          {
            id: 'fallback-1',
            patientName: 'Fatou Diagne',
            studyDate: '20250415',
            studyDescription: 'Radio Thorax',
          },
        ]);
        setLoading(false);
        return;
      }

      // Récupère les détails de chaque étude
      const studyDetails = await Promise.all(
        studyIds.map(async (id) => {
          const details = await getStudyDetails(id);
          return {
            id,
            patientName: details?.PatientName || 'Inconnu',
            studyDate: details?.StudyDate || 'Inconnu',
            studyDescription: details?.StudyDescription || 'Inconnu',
          };
        })
      );
      setStudies(studyDetails);
      setLoading(false);
    } catch (err) {
      console.error('DicomStudies : Erreur lors de la récupération des études', err);
      // En cas d'erreur (ex. Orthanc indisponible), utilise le fallback
      setStudies([
        {
          id: 'fallback-1',
          patientName: 'Fatou Diagne',
          studyDate: '20250415',
          studyDescription: 'Radio Thorax',
        },
      ]);
      setLoading(false);
    }
  };

  // Charge les études au montage du composant
  useEffect(() => {
    fetchStudies();
  }, []);

  // Gère la sélection d'un fichier DICOM
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError('');
  };

  // Gère l'upload d'un fichier DICOM vers Orthanc
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Veuillez sélectionner un fichier DICOM.');
      return;
    }

    try {
      await uploadDicomFile(file);
      const logEntry = {
        timestamp: new Date().toLocaleString('fr-FR'),
        action: `Upload d'une nouvelle étude DICOM: ${file.name}`,
      };
      setTraceabilityLog([...traceabilityLog, logEntry]);
      setFile(null);
      setUploadError('');
      // Rafraîchit la liste des études après l'upload
      setLoading(true);
      await fetchStudies();
    } catch (err) {
      setUploadError('Erreur lors de l\'upload du fichier. Vérifiez que le fichier est un DICOM valide.');
    }
  };

  // Gère l'action de consultation d'une étude (traçabilité)
  const handleViewStudy = (study) => {
    const logEntry = {
      timestamp: new Date().toLocaleString('fr-FR'),
      action: `Consultation de l'étude de ${study.patientName}`,
    };
    setTraceabilityLog([...traceabilityLog, logEntry]);
    alert(`Consultation de l'étude: ${study.studyDescription} pour ${study.patientName}`);
  };

  // Gère la suppression d'une étude
  const handleDeleteStudy = async (studyId) => {
    if (studyId.startsWith('fallback')) {
      alert('Cette étude est une donnée statique et ne peut pas être supprimée.');
      return;
    }

    try {
      await deleteStudy(studyId);
      const logEntry = {
        timestamp: new Date().toLocaleString('fr-FR'),
        action: `Suppression de l'étude avec l'ID ${studyId}`,
      };
      setTraceabilityLog([...traceabilityLog, logEntry]);
      // Rafraîchit la liste des études après la suppression
      setLoading(true);
      await fetchStudies();
    } catch (err) {
      alert('Erreur lors de la suppression de l\'étude.');
    }
  };

  // Affiche un indicateur de chargement pendant la récupération des données
  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="dicom-studies">
      <h2 className="section-title">Études DICOM</h2>

      {/* Formulaire pour uploader un fichier DICOM */}
      <div className="upload-section">
        <h3>Uploader une nouvelle étude DICOM</h3>
        <form onSubmit={handleFileUpload} className="upload-form">
          <input
            type="file"
            accept=".dcm"
            onChange={handleFileChange}
            className="file-input"
          />
          <button type="submit" className="upload-button">
            Uploader
          </button>
        </form>
        {uploadError && <p className="error-message">{uploadError}</p>}
      </div>

      {/* Liste des études DICOM */}
      {studies.length === 0 ? (
        <p className="no-studies">Aucune étude DICOM disponible.</p>
      ) : (
        <ul className="studies-list">
          {studies.map((study) => (
            <li key={study.id} className="study-item">
              <div className="study-details">
                <strong>Patient:</strong> {study.patientName}<br />
                <strong>Date:</strong> {study.studyDate}<br />
                <strong>Description:</strong> {study.studyDescription}<br />
              </div>
              <div className="study-actions">
                <button onClick={() => handleViewStudy(study)} className="view-button">
                  Voir l'Étude
                </button>
                <button onClick={() => handleDeleteStudy(study.id)} className="delete-button">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Section pour afficher le journal de traçabilité */}
      <div className="traceability-log">
        <h3>Traçabilité des Actions</h3>
        {traceabilityLog.length === 0 ? (
          <p>Aucune action enregistrée.</p>
        ) : (
          <ul>
            {traceabilityLog.map((log, index) => (
              <li key={index}>
                {log.timestamp} - {log.action}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DicomStudies;