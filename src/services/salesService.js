import api from '../utils/api.js';

const getSales = async () => {
  const response = await api.get('/api/sales');
  return response.data;
};

const getSaleById = async (id) => {
  const response = await api.get(`/api/sales/${id}`);
  return response.data;
};

const createSale = async (saleData) => {
  const response = await api.post('/api/sales', saleData);
  return response.data;
};

const updateSale = async (id, saleData) => {
  const response = await api.put(`/api/sales/${id}`, saleData);
  return response.data;
};

const deleteSale = async (id) => {
  const response = await api.delete(`/api/sales/${id}`);
  return response.data;
};

const salesService = {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};

export default salesService;
