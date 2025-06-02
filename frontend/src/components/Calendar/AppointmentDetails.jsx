// client/src/components/Calendar/AppointmentDetails.jsx
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './AppointmentDetails.css';

const AppointmentDetails = ({ appointments }) => {
  return (
    <div className="appointment-details">
      {appointments.map((appointment, index) => (
        <div key={index} className="appointment-detail-card">
          <p className="appointment-time">
            {appointment.time}
          </p>
          <p className="appointment-doctor">
            <strong>{appointment.doctorName}</strong>
          </p>
          <p className="appointment-specialty">
            {appointment.specialty}
          </p>
          <p className="appointment-location">
            {appointment.establishment}
          </p>
          {appointment.notes && (
            <p className="appointment-notes">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentDetails;
