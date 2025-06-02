import axios from 'axios';

// URL de base pour le serveur Orthanc (à ajuster selon l'environnement)
const ORTHANC_URL = 'http://localhost:8042'; // Utilise localhost pour NAT ou l'IP de la VM (ex. 192.168.1.100)

// Instance Axios pour interagir avec l'API REST d'Orthanc
const orthancApi = axios.create({
  baseURL: ORTHANC_URL,
});

// Récupère la liste des IDs des études DICOM depuis Orthanc
export const getStudies = async () => {
  try {
    const response = await orthancApi.get('/studies');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des études:', error);
    return [];
  }
};

// Récupère les détails d'une étude spécifique via son ID
export const getStudyDetails = async (studyId) => {
  try {
    const response = await orthancApi.get(`/studies/${studyId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'étude:', error);
    return null;
  }
};

// Upload un fichier DICOM vers Orthanc
export const uploadDicomFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await orthancApi.post('/instances', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier DICOM:', error);
    throw error;
  }
};

// Supprime une étude DICOM via son ID
export const deleteStudy = async (studyId) => {
  try {
    await orthancApi.delete(`/studies/${studyId}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étude:', error);
    throw error;
  }
};