import api from '../utils/api.js';

const getPurchases = async () => {
  const response = await api.get('/api/purchases');
  return response.data;
};

const getPurchaseById = async (id) => {
  const response = await api.get(`/api/purchases/${id}`);
  return response.data;
};

const createPurchase = async (purchaseData) => {
  const response = await api.post('/api/purchases', purchaseData);
  return response.data;
};

const updatePurchase = async (id, purchaseData) => {
  const response = await api.put(`/api/purchases/${id}`, purchaseData);
  return response.data;
};

const deletePurchase = async (id) => {
  const response = await api.delete(`/api/purchases/${id}`);
  return response.data;
};

const purchaseService = {
  getPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};

export default purchaseService;
