
// frontend/src/services/appointmentService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

const mockAppointments = [
  {
    id: 1,
    date: '2025-04-20',
    time: '10:00',
    doctor: 'Dr. Cheikh Fall',
    location: 'Hôpital Fann, Dakar',
    reason: 'Consultation générale',
  },
  {
    id: 2,
    date: '2025-04-25',
    time: '14:30',
    doctor: 'Dr. Aminata Sarr',
    location: 'Centre de Santé de Ziguinchor, Casamance',
    reason: 'Suivi pédiatrique',
  },
  {
    id: 3,
    date: '2025-05-01',
    time: '09:00',
    doctor: 'Dr. Ousmane Diop',
    location: 'Polyclinique de Kaolack, Kaolack',
    reason: 'Examen dentaire',
  },
];

const getUserAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/user-appointments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return mockAppointments;
  }
};

const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    const newAppointment = { ...appointmentData, id: mockAppointments.length + 1 };
    mockAppointments.push(newAppointment);
    return newAppointment;
  }
};

const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    const index = mockAppointments.findIndex((appt) => appt.id === id);
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...appointmentData };
      return mockAppointments[index];
    }
    throw new Error('Appointment not found');
  }
};

const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    const index = mockAppointments.findIndex((appt) => appt.id === id);
    if (index !== -1) {
      mockAppointments.splice(index, 1);
      return { message: 'Appointment deleted' };
    }
    throw new Error('Appointment not found');
  }
};

export default {
  getUserAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
