// client/src/components/Calendar/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import doctorService from '../../services/doctorService';
import './AppointmentForm.css';

const AppointmentForm = ({ date, onAddAppointment }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    time: '09:00',
    notes: '',
    specialty: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des médecins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(doc => doc.id === formData.doctorId);
    if (!selectedDoctor) return;

    const newAppointment = {
      doctorId: formData.doctorId,
      date: format(date, 'yyyy-MM-dd'),
      time: formData.time,
      notes: formData.notes,
      specialty: formData.specialty || selectedDoctor.specialty,
    };
    onAddAppointment(newAppointment);
  };

  if (loading) return <div>Chargement des médecins...</div>;

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <div className="form-group">
        <label htmlFor="doctorId">Médecin</label>
        <select
          id="doctorId"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner un médecin</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="time">Heure</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="specialty">Spécialité (optionnel)</label>
        <input
          type="text"
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-button">
        Ajouter le rendez-vous
      </button>
    </form>
  );
};

export default AppointmentForm;
