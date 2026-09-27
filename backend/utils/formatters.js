/**
 * Utilitas Formatting & Kalkulasi Angka Laporan Parkir
 */

/**
 * Format angka nominal ke format mata uang Rupiah (IDR)
 * @param {number|string} amount - Nominal angka
 * @returns {string} String dengan format "Rp X.XXX"
 */
function formatRupiah(amount) {
  const num = Number(amount);
  if (isNaN(num)) return 'Rp 0';
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

/**
 * Parsing input menjadi integer yang aman (non-negatif)
 * @param {*} value - Nilai input
 * @param {number} fallback - Nilai default jika invalid
 * @returns {number} Integer valid >= 0
 */
function parseNonNegativeInt(value, fallback = 0) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) return fallback;
  return parsed;
}

/**
 * Menghitung status kapasitas parkir (apakah normal atau overload)
 * @param {number} current - Jumlah unit motor saat ini
 * @param {number} standardLimit - Batas standar kapasitas (default 90)
 * @returns {{ isOverload: boolean, percentage: number, excess: number, statusText: string }}
 */
function calculateCapacityStatus(current, standardLimit = 90) {
  const count = parseNonNegativeInt(current, 0);
  const limit = parseNonNegativeInt(standardLimit, 90) || 90;
  const isOverload = count > limit;
  const excess = Math.max(0, count - limit);
  const percentage = Math.round((count / limit) * 100);

  let statusText = `Normal (${percentage}%)`;
  if (isOverload) {
    statusText = `⚠️ Overload (+${excess} Motor)`;
  }

  return {
    isOverload,
    percentage,
    excess,
    statusText
  };
}


/**
 * Menghitung rata-rata kendaraan per hari dengan pembulatan satu desimal
 * @param {number} totalMotorcycles 
 * @param {number} totalDays 
 * @returns {number}
 */
function calculateDailyAverage(totalMotorcycles, totalDays) {
  const count = parseNonNegativeInt(totalMotorcycles, 0);
  const days = parseNonNegativeInt(totalDays, 0);
  if (days === 0) return 0;
  return Math.round((count / days) * 10) / 10;
}

module.exports = {
  calculateDailyAverage,
  formatRupiah,
  parseNonNegativeInt,
  calculateCapacityStatus
};
