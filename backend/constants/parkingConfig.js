/**
 * Konfigurasi & Konstanta Operasional Parkir
 */

const PARKING_CONFIG = {
  // Tarif parkir per unit motor (Rupiah)
  RATE_PER_MOTORCYCLE: 3000,

  // Kapasitas standar area parkir (unit)
  STANDARD_CAPACITY: 90,

  // Batas toleransi overload darurat (unit)
  OVERLOAD_LIMIT: 110,

  // Nama petugas penanggung jawab default
  DEFAULT_OFFICER_NAME: 'Ucup',

  // Batas maksimal upload foto (bytes) -> 10MB
  MAX_PHOTO_SIZE_BYTES: 10 * 1024 * 1024,

  // Hamming distance threshold untuk deteksi foto mirip / duplikat (dHash 64-bit)
  DHASH_SIMILARITY_THRESHOLD: 6,

  // Timeout toleransi SQLite busy (ms)
  DB_BUSY_TIMEOUT_MS: 5000,

  // Konfigurasi pagination data laporan
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Versi API saat ini
  API_VERSION: '1.4.0'
};

module.exports = PARKING_CONFIG;
