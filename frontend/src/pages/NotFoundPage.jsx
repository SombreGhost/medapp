
// client/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Non Trouvée</h1>
      <p>Désolé, la page que vous cherchez n'existe pas.</p>
      <Link to="/dashboard" className="back-link">
        Retour au tableau de bord
      </Link>
    </div>
  );
};

export default NotFoundPage;
