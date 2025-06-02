// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
  // Enregistrer un nouvel utilisateur
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Connecter un utilisateur
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Déconnecter un utilisateur
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Vérifier le token
  verifyToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valid;
    } catch (error) {
      // Si le token est invalide, déconnecter l'utilisateur
      authService.logout();
      return false;
    }
  }
};

export default authService;






