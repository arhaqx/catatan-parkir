/**
 * Validator Input Data Laporan Parkir
 */

/**
 * Memvalidasi apakah string merupakan tanggal valid dengan format YYYY-MM-DD
 * @param {string} dateStr 
 * @returns {boolean}
 */
function isValidDateFormat(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
}

/**
 * Validasi payload pembuatan laporan baru
 * @param {object} payload - { date, total_motorcycles, notes, officer_name }
 * @returns {{ isValid: boolean, error?: string, sanitized?: object }}
 */
function validateReportPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Payload laporan tidak boleh kosong' };
  }

  const { date, total_motorcycles, notes, officer_name } = payload;

  if (!date || !isValidDateFormat(date)) {
    return { isValid: false, error: 'Format tanggal harus valid (YYYY-MM-DD)' };
  }

  if (total_motorcycles === undefined || total_motorcycles === null || total_motorcycles === '') {
    return { isValid: false, error: 'Jumlah motor wajib diisi' };
  }

  const motorcycles = Number(total_motorcycles);
  if (!Number.isInteger(motorcycles) || motorcycles < 0) {
    return { isValid: false, error: 'Jumlah motor harus berupa bilangan bulat positif (>= 0)' };
  }

  if (motorcycles > 1000) {
    return { isValid: false, error: 'Jumlah motor melebihi batas wajar kapasitas (maksimal 1000)' };
  }

  const sanitizedOfficer = officer_name && typeof officer_name === 'string' ? officer_name.trim() : 'Ucup';
  const sanitizedNotes = notes && typeof notes === 'string' ? notes.trim() : null;

  return {
    isValid: true,
    sanitized: {
      date,
      total_motorcycles: motorcycles,
      officer_name: sanitizedOfficer || 'Ucup',
      notes: sanitizedNotes
    }
  };
}

module.exports = {
  isValidDateFormat,
  validateReportPayload
};
