import axios from 'axios';

// Gunakan alamat IP Publik Azure VM Anda
export const SERVER_BASE_URL = import.meta.env.VITE_API_URL || 'http://70.153.24.132:3001';
export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const getReports = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

export const createReport = async (formData) => {
  const response = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

export const seedSampleReports = async () => {
  const response = await api.post('/reports/seed');
  return response.data;
};

export const exportReportsToExcel = async (params = {}) => {
  const response = await api.get('/reports/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

export const baseURL = SERVER_BASE_URL;
export default api;
