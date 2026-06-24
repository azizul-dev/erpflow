import api from '../utils/api.js';

const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

const register = async (name, email, password, role) => {
  const response = await api.post('/api/auth/register', { name, email, password, role });
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

const authService = {
  login,
  register,
  getProfile,
};

export default authService;
