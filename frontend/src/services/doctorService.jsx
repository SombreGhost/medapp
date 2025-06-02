
// client/src/services/doctorService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const doctorService = {
  getAllDoctors: async () => {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
  },
  getAllEstablishments: async () => {
    const response = await axios.get(`${API_URL}/establishments`);
    return response.data;
  },
  search: async (query, type = 'all') => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query, type }
    });
    return response.data;
  }
};

export default doctorService;
