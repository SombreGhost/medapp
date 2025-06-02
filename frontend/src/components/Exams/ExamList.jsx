// client/src/components/Exams/ExamsList.jsx
import React, { useState, useEffect } from 'react';
import examService from '../../services/examService';
import './ExamList.css';

const ExamCard = ({ exam }) => {
  // Déterminer la couleur en fonction du type d'examen
  const getColorClass = (type) => {
    const colors = {
      'Pédiatrie': 'exam-blue',
      'Cardiologie': 'exam-orange',
      'Gynécologie': 'exam-green',
      'Endocrinologie': 'exam-red',
      'Neurologie': 'exam-purple',
      'Dermatologie': 'exam-teal',
      'Ophtalmologie': 'exam-brown',
      'Radiologie': 'exam-gray'
    };
    return colors[type] || 'exam-blue';
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('fr', { month: 'long' }).format(date);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className={`exam-card ${getColorClass(exam.type)}`}>
      <div className="exam-date">{formatDate(exam.date)}</div>
      <h3 className="exam-type">{exam.type}</h3>
      <p className="exam-description">{exam.description}</p>
    </div>
  );
};

const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await examService.getUserExams();
        setExams(data);
      } catch (err) {
        setError('Impossible de récupérer les examens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <div className="loading">Chargement des examens...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="exams-container">
      <h2 className="section-title">Examens</h2>
      <div className="exams-list">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))
        ) : (
          <p className="no-exams">Aucun examen trouvé</p>
        )}
      </div>
    </div>
  );
};

export default ExamsList;