# Panduan Pengujian (Testing Guide)

Repositori ini menggunakan native test runner Node.js (`node:test` dan `node:assert/strict`), yang ringan, cepat, dan tidak memerlukan dependensi runner eksternal seperti Jest atau Mocha.

## Menjalankan Pengujian

Untuk menjalankan seluruh rangkaian pengujian unit backend:

```bash
cd backend
npm test
```

## Cakupan Modul yang Diuji

1. **`formatters.test.js`**:
   - Pemformatan mata uang Rupiah (`formatRupiah`).
   - Parsing integer aman dan proteksi angka negatif (`parseNonNegativeInt`).
   - Kalkulasi status kapasitas dan peringatan kelebihan muatan (`calculateCapacityStatus`).
   - Rata-rata kendaraan per hari dan persentase utilisasi.

2. **`indonesiaHolidays.test.js`**:
   - Konversi format tanggal ISO / string.
   - Pengecekan hari libur nasional resmi dan cuti bersama di Indonesia.
   - Klasifikasi hari kerja vs akhir pekan.

3. **`photoVerification.test.js`**:
   - Perhitungan Hamming distance selisih bit gambar.
   - Perceptual difference hash (dHash 64-bit) untuk identifikasi foto serupa.

4. **`validators.test.js`**:
   - Sanitasi payload laporan parkir dan pencegahan nilai di luar batas kewajaran.
   - Validasi urutan rentang tanggal (`isValidDateRange`).

5. **`logger.test.js` & `parkingConfig.test.js`**:
   - Format log terstruktur dengan timestamp ISO.
   - Integritas konstanta operasional dan pagination.

6. **`healthCheck.test.js` & `reportsCalculation.test.js`**:
   - Pengujian integrasi endpoint status HTTP 200 server.
   - Integritas kueri agregasi database SQLite in-memory.
