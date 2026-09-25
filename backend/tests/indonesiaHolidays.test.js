const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  toDateKey,
  getHolidayInfo,
  isTanggalMerah
} = require('../utils/indonesiaHolidays');

describe('Indonesia Holidays & Calendar Utility', () => {
  describe('toDateKey', () => {
    test('mengonversi string YYYY-MM-DD dengan benar', () => {
      assert.equal(toDateKey('2026-08-17'), '2026-08-17');
    });

    test('mengonversi objek Date menjadi YYYY-MM-DD', () => {
      const d = new Date(2026, 7, 17); // Bulan Agustus (0-indexed: 7)
      assert.equal(toDateKey(d), '2026-08-17');
    });

    test('mengonversi format ISO timestamp', () => {
      assert.equal(toDateKey('2026-08-17T08:30:00.000Z'), '2026-08-17');
    });

    test('mengembalikan string kosong untuk input tidak valid', () => {
      assert.equal(toDateKey(null), '');
      assert.equal(toDateKey(undefined), '');
      assert.equal(toDateKey('invalid-date'), '');
    });
  });

  describe('getHolidayInfo', () => {
    test('mendeteksi hari libur nasional 17 Agustus', () => {
      const holiday = getHolidayInfo('2026-08-17');
      assert.ok(holiday);
      assert.equal(holiday.name, 'Hari Proklamasi Kemerdekaan RI');
      assert.equal(holiday.type, 'national');
    });

    test('mendeteksi hari libur tahun baru masehi (1 Januari)', () => {
      const holiday = getHolidayInfo('2026-01-01');
      assert.ok(holiday);
      assert.equal(holiday.name, 'Tahun Baru 2026 Masehi');
    });

    test('mendeteksi cuti bersama (misal Cuti Bersama Idul Fitri 2026)', () => {
      const holiday = getHolidayInfo('2026-03-20');
      assert.ok(holiday);
      assert.equal(holiday.type, 'joint_leave');
    });

    test('mengembalikan null untuk hari kerja reguler', () => {
      const holiday = getHolidayInfo('2026-09-09'); // Rabu biasa
      assert.equal(holiday, null);
    });
  });

  describe('isTanggalMerah', () => {
    test('mengembalikan true untuk hari Minggu', () => {
      // 2026-09-13 adalah hari Minggu
      assert.equal(isTanggalMerah('2026-09-13'), true);
    });

    test('mengembalikan true untuk hari libur nasional di hari kerja', () => {
      // 17 Agustus 2026 adalah hari Senin (hari kerja tapi libur nasional)
      assert.equal(isTanggalMerah('2026-08-17'), true);
    });

    test('mengembalikan false untuk hari kerja biasa', () => {
      // 2026-09-16 adalah hari Rabu biasa (bukan libur)
      assert.equal(isTanggalMerah('2026-09-16'), false);
    });

    test('mengembalikan false untuk nilai kosong atau invalid', () => {
      assert.equal(isTanggalMerah(null), false);
      assert.equal(isTanggalMerah(''), false);
    });
  });
});
