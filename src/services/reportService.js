import api from '../utils/api.js';

const getProductReport = async (params) => {
  const response = await api.get('/api/reports/products', { params });
  return response.data;
};

const getCustomerReport = async (params) => {
  const response = await api.get('/api/reports/customers', { params });
  return response.data;
};

const getSupplierReport = async (params) => {
  const response = await api.get('/api/reports/suppliers', { params });
  return response.data;
};

const getPurchaseReport = async (params) => {
  const response = await api.get('/api/reports/purchases', { params });
  return response.data;
};

const getSalesReport = async (params) => {
  const response = await api.get('/api/reports/sales', { params });
  return response.data;
};

export const reportService = {
  getProductReport,
  getCustomerReport,
  getSupplierReport,
  getPurchaseReport,
  getSalesReport,
};
