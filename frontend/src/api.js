import axios from 'axios';

/**
 * Konfigurasi URL API & Server:
 * 1. Di Vercel Production (HTTPS): Menggunakan endpoint relatif '/api' yang di-forward
 *    secara otomatis oleh vercel.json ke server Azure VM (bebas masalah Mixed Content).
 * 2. Di Local Development (Vite): Menggunakan dev proxy '/api' yang mengarah ke http://localhost:3001
 * 3. Kustom (opsional): Mengambil nilai VITE_API_URL jika didefinisikan di environment.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Alamat server Azure VM (atau localhost saat development offline)
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || (
  import.meta.env.DEV ? 'http://localhost:3001' : 'http://70.153.24.132:3001'
);

export const baseURL = SERVER_BASE_URL;

// Buat instance Axios terpusat
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Timeout 30 detik untuk upload foto / export excel
  headers: {
    'Accept': 'application/json',
  },
});

// Response Interceptor untuk standarisasi format error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani error timeout atau server offline
    if (error.code === 'ECONNABORTED') {
      error.message = 'Koneksi ke server timeout (waktu habis). Periksa jaringan Anda.';
    } else if (!error.response) {
      error.message = 'Tidak dapat terhubung ke server backend. Pastikan server Azure aktif.';
    }
    return Promise.reject(error);
  }
);

/**
 * Ambil daftar semua laporan (bisa filter rentang tanggal)
 * @param {Object} params - { startDate, endDate }
 */
export const getReports = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

/**
 * Kirim laporan baru dari petugas (termasuk foto bukti multipart)
 * @param {FormData} formData - form data berisi date, total_motorcycles, notes, photo
 */
export const createReport = async (formData) => {
  const response = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Hapus data laporan berdasarkan ID (khusus otorisasi admin)
 * @param {number|string} id - ID laporan
 */
export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

/**
 * Generate 7 data sample uji coba ke database
 */
export const seedSampleReports = async () => {
  const response = await api.post('/reports/seed');
  return response.data;
};

/**
 * Unduh spreadsheet Excel laporan parkir
 * @param {Object} params - { startDate, endDate }
 */
export const exportReportsToExcel = async (params = {}) => {
  const response = await api.get('/reports/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Cek status kesehatan koneksi server backend
 */
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/reports?limit=1');
    return { ok: true, data: response.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

export default api;
