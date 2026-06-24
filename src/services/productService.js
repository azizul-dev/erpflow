import api from '../utils/api.js';

const getAllProducts = async (search = '') => {
  const response = await api.get(`/api/products${search ? `?search=${search}` : ''}`);
  return response.data;
};

const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

const createProduct = async (productData) => {
  const response = await api.post('/api/products', productData);
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await api.put(`/api/products/${id}`, productData);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
export default productService;
