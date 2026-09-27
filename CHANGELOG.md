# Changelog (Catatan Perubahan)

Semua perubahan penting pada proyek **Catatan Parkir Pabrik** didokumentasikan dalam file ini.
Format ini mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] - September 2026

### Added
- Workflow GitHub Actions CI (`.github/workflows/ci.yml`) untuk verifikasi otomatis di Node.js 20 & 22.
- Endpoint `GET /api/reports/summary` untuk agregasi metrik, rata-rata, dan statistik foto.
- Endpoint `GET /api/reports/:id` untuk detail satu entri laporan.
- Helper `calculateDailyAverage` pada `formatters.js` dan parameter `DB_BUSY_TIMEOUT_MS`.
- Utilitas `backend/utils/formatters.js` untuk format mata uang Rupiah dan kalkulasi persentase kapasitas.
- Modul konstanta operasional terpusat `backend/constants/parkingConfig.js`.
- Dokumentasi `ARCHITECTURE.md`, `CONTRIBUTING.md`, dan lisensi open-source `LICENSE`.
- Test suite otomatis dengan 32 unit & integrasi tests bawaan `node:test`.

---

## [1.2.0] - September 2026

### Added
- Fitur verifikasi keaslian foto visual dHash 64-bit secara asinkron di latar belakang.
- Integrasi kalender hari libur nasional Indonesia & deteksi otomatis jadwal shift (Senin-Jumat, Sabtu Lembur, Minggu Libur).
- Pemilihan penanggung jawab shift (Ucup / Petugas lainnya).
- Proteksi keamanan PIN (1312) untuk penghapusan laporan di admin dashboard.

---

## [1.1.0] - Agustus 2026

### Added
- Ekspor laporan ke Microsoft Excel (.xlsx) dengan styling warna dan kalkulasi tarif.
- Integrasi Cloudinary untuk upload foto dokumentasi shift langsung ke cloud storage.
- Generator data simulasi 7 hari (seed sample) untuk kebutuhan demo.

---

## [1.0.0] - Agustus 2026

### Added
- Rilis inisialisasi aplikasi full-stack catatan parkir internal pabrik.
- Form pencatatan petugas lapangan dan dashboard monitoring admin.
- Express.js backend dengan database lokal SQLite3.
