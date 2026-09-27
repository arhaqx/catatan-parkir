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
  DHASH_SIMILARITY_THRESHOLD: 6
};

module.exports = PARKING_CONFIG;
