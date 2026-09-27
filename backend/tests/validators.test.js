const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  isValidDateFormat,
  validateReportPayload
} = require('../utils/validators');

describe('Payload & Format Validators Utility', () => {
  describe('isValidDateFormat', () => {
    test('memvalidasi tanggal format YYYY-MM-DD yang benar', () => {
      assert.equal(isValidDateFormat('2026-09-25'), true);
      assert.equal(isValidDateFormat('2024-02-29'), true); // Tahun kabisat
    });

    test('menolak tanggal yang tidak valid atau format salah', () => {
      assert.equal(isValidDateFormat('2026-02-30'), false); // Februari tgl 30 tidak ada
      assert.equal(isValidDateFormat('25-09-2026'), false); // Urutan DD-MM-YYYY
      assert.equal(isValidDateFormat('2026/09/25'), false); // Slash
      assert.equal(isValidDateFormat('invalid'), false);
      assert.equal(isValidDateFormat(null), false);
    });
  });

  describe('validateReportPayload', () => {
    test('menerima payload yang valid dan melakukan sanitasi', () => {
      const result = validateReportPayload({
        date: '2026-09-25',
        total_motorcycles: '85',
        notes: '  Kondisi aman lancar  ',
        officer_name: '  Ucup  '
      });

      assert.equal(result.isValid, true);
      assert.equal(result.sanitized.date, '2026-09-25');
      assert.equal(result.sanitized.total_motorcycles, 85);
      assert.equal(result.sanitized.officer_name, 'Ucup');
      assert.equal(result.sanitized.notes, 'Kondisi aman lancar');
      assert.equal(result.sanitized.officer_name, 'Ucup');
      assert.equal(typeof result.sanitized.date, 'string');
    });

    test('menolak jika tanggal kosong atau format salah', () => {
      const result = validateReportPayload({
        date: 'invalid-date',
        total_motorcycles: 50
      });
      assert.equal(result.isValid, false);
      assert.match(result.error, /Format tanggal harus valid/);
    });

    test('menolak jika total_motorcycles negatif atau desimal', () => {
      const negativeResult = validateReportPayload({
        date: '2026-09-25',
        total_motorcycles: -10
      });
      assert.equal(negativeResult.isValid, false);

      const decimalResult = validateReportPayload({
        date: '2026-09-25',
        total_motorcycles: 12.5
      });
      assert.equal(decimalResult.isValid, false);
    });

    test('menolak jika total_motorcycles melebihi 1000 unit', () => {
      const result = validateReportPayload({
        date: '2026-09-25',
        total_motorcycles: 1500
      });
      assert.equal(result.isValid, false);
      assert.match(result.error, /melebihi batas wajar/);
    });
  });
});
