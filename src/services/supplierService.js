import api from '../utils/api.js';

const getAllSuppliers = async (search = '') => {
  const response = await api.get(`/api/suppliers${search ? `?search=${search}` : ''}`);
  return response.data;
};

const getSupplierById = async (id) => {
  const response = await api.get(`/api/suppliers/${id}`);
  return response.data;
};

const createSupplier = async (supplierData) => {
  const response = await api.post('/api/suppliers', supplierData);
  return response.data;
};

const updateSupplier = async (id, supplierData) => {
  const response = await api.put(`/api/suppliers/${id}`, supplierData);
  return response.data;
};

const deleteSupplier = async (id) => {
  const response = await api.delete(`/api/suppliers/${id}`);
  return response.data;
};

export const supplierService = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
export default supplierService;
