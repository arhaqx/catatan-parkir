const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  formatRupiah,
  parseNonNegativeInt,
  calculateCapacityStatus,
  calculateDailyAverage
} = require('../utils/formatters');

describe('Formatters & Capacity Calculation Utility', () => {
  describe('formatRupiah', () => {
    test('memformat angka ribuan ke format rupiah Indonesia', () => {
      const formatted = formatRupiah(3000);
      assert.match(formatted, /^Rp\s*3[.,]000$/);
    });

    test('memformat angka jutaan dengan benar', () => {
      const formatted = formatRupiah(1500000);
      assert.match(formatted, /^Rp\s*1[.,]500[.,]000$/);
    });

    test('menangani input 0 dan string angka', () => {
      assert.equal(formatRupiah(0), 'Rp 0');
      const fromStr = formatRupiah('90000');
      assert.match(fromStr, /^Rp\s*90[.,]000$/);
    });

    test('mengembalikan "Rp 0" untuk nilai invalid atau bukan angka', () => {
      assert.equal(formatRupiah('abc'), 'Rp 0');
      assert.equal(formatRupiah(undefined), 'Rp 0');
    });
  });

  describe('parseNonNegativeInt', () => {
    test('mem-parsing string angka bulat positif', () => {
      assert.equal(parseNonNegativeInt('85'), 85);
      assert.equal(parseNonNegativeInt(90), 90);
    });

    test('mengembalikan fallback untuk angka negatif atau input invalid', () => {
      assert.equal(parseNonNegativeInt(-5, 0), 0);
      assert.equal(parseNonNegativeInt('invalid', 10), 10);
      assert.equal(parseNonNegativeInt(null, 5), 5);
    });
  });

  describe('calculateCapacityStatus', () => {
    test('menghitung status normal jika di bawah atau sama dengan kapasitas', () => {
      const result = calculateCapacityStatus(72, 90);
      assert.equal(result.isOverload, false);
      assert.equal(result.percentage, 80);
      assert.equal(result.excess, 0);
      assert.equal(result.statusText, 'Normal (80%)');
    });

    test('menghitung status overload jika melebihi batas kapasitas', () => {
      const result = calculateCapacityStatus(105, 90);
      assert.equal(result.isOverload, true);
      assert.equal(result.percentage, 117);
      assert.equal(result.excess, 15);
      assert.equal(result.statusText, '⚠️ Overload (+15 Motor)');
    });
  });

  describe('calculateDailyAverage', () => {
    test('menghitung rata-rata harian dengan benar', () => {
      assert.equal(calculateDailyAverage(270, 3), 90);
      assert.equal(calculateDailyAverage(275, 3), 91.7);
    });

    test('mengembalikan 0 jika total hari adalah 0', () => {
      assert.equal(calculateDailyAverage(100, 0), 0);
    });
  });

});
