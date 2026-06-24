import api from '../utils/api.js';

const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard');
  return response.data;
};

export const dashboardService = {
  getDashboardStats,
};
export default dashboardService;
