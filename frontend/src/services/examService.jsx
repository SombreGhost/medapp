
// frontend/src/services/examService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/exams';

const mockExams = [
  {
    id: 1,
    date: '2025-03-10',
    type: 'Bilan sanguin',
    description: 'Contrôle annuel - Dr. Ndiaye',
    doctor: 'Dr. Aissatou Ndiaye',
    location: 'Hôpital Principal, Dakar',
  },
  {
    id: 2,
    date: '2025-02-15',
    type: 'Échographie',
    description: 'Suivi prénatal - Dr. Sow',
    doctor: 'Dr. Ibrahima Sow',
    location: 'Clinique de la Paix, Saint-Louis',
  },
  {
    id: 3,
    date: '2025-01-20',
    type: 'Radiographie',
    description: 'Examen thoracique - Dr. Diallo',
    doctor: 'Dr. Mariama Diallo',
    location: 'Centre Médical de Thiès, Thiès',
  },
];

const getUserExams = async () => {
  try {
    const response = await axios.get(`${API_URL}/user-exams`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exams:', error);
    return mockExams;
  }
};

export default {
  getUserExams,
};
