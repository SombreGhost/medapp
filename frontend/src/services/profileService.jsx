
// frontend/src/services/profileService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

const mockProfile = {
  fullName: 'Sokhna Diop',
  email: 'sokhna.diop@senemedical.sn',
  dateOfBirth: '1992-03-12',
  phone: '+221 77 123 4567',
  address: '123 Rue de la Paix, Médina, Dakar',
};

const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return mockProfile;
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return profileData;
  }
};

export default {
  getUserProfile,
  updateProfile,
};
