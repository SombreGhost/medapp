// client/src/components/Calendar/AppointmentCalendar.jsx
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import appointmentService from '../../services/appointmentService';
import AppointmentDetails from './AppointmentDetails';
import AppointmentForm from './AppointmentForm';
import './AppointmentCalendar.css';

const AppointmentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Récupérer les rendez-vous
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getUserAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  // Navigation dans le calendrier
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Obtenir les jours du mois actuel
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Obtenir le jour de la semaine pour le premier jour du mois (0 = dimanche, 1 = lundi, etc.)
  const startDay = getDay(monthStart);
  
  // Obtenir les rendez-vous pour une date spécifique
  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => isSameDay(new Date(app.date), date));
  };
  
  // Vérifier si une date a des rendez-vous
  const hasAppointments = (date) => {
    return getAppointmentsForDate(date).length > 0;
  };
  
  // Obtenir la couleur en fonction de la spécialité
  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Pédiatrie': 'bg-blue-500',
      'Cardiologie': 'bg-orange-500',
      'Gynécologie': 'bg-green-500',
      'Endocrinologie': 'bg-red-500',
      'Neurologie': 'bg-purple-500',
      'Dermatologie': 'bg-teal-500',
      'Ophtalmologie': 'bg-amber-700',
      'Radiologie': 'bg-gray-500'
    };
    return colors[specialty] || 'bg-blue-500';
  };
  
  // Gérer la sélection d'une date
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (!hasAppointments(date)) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  };
  
  // Fermer le panneau de détails/formulaire
  const handleClosePanel = () => {
    setSelectedDate(null);
    setShowForm(false);
  };
  
  // Ajouter un nouveau rendez-vous
  const handleAddAppointment = async (newAppointment) => {
    try {
      const addedAppointment = await appointmentService.addAppointment(newAppointment);
      setAppointments([...appointments, addedAppointment]);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', error);
    }
  };

  if (loading) return <div className="loading">Chargement du calendrier...</div>;

  // Jours de la semaine
  const weekdays = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth} className="month-nav-button">&lt;</button>
        <h2 className="current-month">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
        <button onClick={nextMonth} className="month-nav-button">&gt;</button>
      </div>
      
      <div className="calendar-grid">
        {/* En-têtes des jours de la semaine */}
        {weekdays.map((day, index) => (
          <div key={index} className="weekday-header">{day}</div>
        ))}
        
        {/* Jours du calendrier */}
        {monthDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const hasApps = dayAppointments.length > 0;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          // Déterminer la couleur de la date s'il y a des rendez-vous
          let dateClass = "calendar-day";
          if (hasApps) {
            const specialty = dayAppointments[0].specialty;
            dateClass += ` has-appointments ${getSpecialtyColor(specialty)}`;
          }
          if (isSelected) dateClass += " selected";
          
          return (
            <div 
              key={index} 
              className={dateClass}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
      
      {/* Afficher les détails du rendez-vous ou le formulaire */}
      {selectedDate && (
        <div className="appointment-panel">
          <button className="close-panel" onClick={handleClosePanel}>×</button>
          <h3 className="panel-date">{format(selectedDate, 'd MMMM yyyy', { locale: fr })}</h3>
          
          {showForm ? (
            <AppointmentForm 
              date={selectedDate} 
              onAddAppointment={handleAddAppointment} 
            />
          ) : (
            <AppointmentDetails 
              appointments={getAppointmentsForDate(selectedDate)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;