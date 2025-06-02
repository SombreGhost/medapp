
// frontend/src/components/Auth/AuthForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import authService from '../../services/authService';
import './AuthForm.css';

const AuthForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
        <p>
          {isLogin ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte'}
        </p>
      </div>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="fullName">Nom complet</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Ex: Ndeye Fatou Sarr"
                value={formData.fullName}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date de naissance</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ex: prenom.nom@senemedical.sn"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S’inscrire'}
        </button>
      </form>
      <div className="auth-switch">
        <p>
          {isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?'}
          <button
            onClick={() => navigate(isLogin ? '/register' : '/login')}
            className="switch-button"
          >
            {isLogin ? 'S’inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
