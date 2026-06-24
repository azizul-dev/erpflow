import api from '../utils/api.js';

const getAllCustomers = async (search = '') => {
  const response = await api.get(`/api/customers${search ? `?search=${search}` : ''}`);
  return response.data;
};

const getCustomerById = async (id) => {
  const response = await api.get(`/api/customers/${id}`);
  return response.data;
};

const createCustomer = async (customerData) => {
  const response = await api.post('/api/customers', customerData);
  return response.data;
};

const updateCustomer = async (id, customerData) => {
  const response = await api.put(`/api/customers/${id}`, customerData);
  return response.data;
};

const deleteCustomer = async (id) => {
  const response = await api.delete(`/api/customers/${id}`);
  return response.data;
};

export const customerService = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
export default customerService;
