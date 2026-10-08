# Rencana Kesiapsiagaan & Pemulihan Bencana (Disaster Recovery)

Panduan pemulihan sistem jika terjadi insiden kegagalan perangkat keras atau kerusakan VM pada server Azure.

## Skenario Insiden & Tindakan

### 1. Server Azure VM Reboot / Crash Tak Terduga
- **Mitigasi Otomatis:** Service backend telah dikonfigurasi menggunakan PM2 dengan startup script otomatis (`pm2 startup`).
- **Verifikasi:**
  ```bash
  pm2 status
  curl -s http://localhost:3001/ | jq .
  ```

### 2. Kerusakan File Database (Database Corruption)
- **Tindakan:**
  1. Hentikan aplikasi: `pm2 stop parkir-api`.
  2. Periksa status integritas: `sqlite3 backend/database.sqlite "PRAGMA integrity_check;"`.
  3. Jika rusak, pulihkan dari snapshot cadangan harian di direktori backup.

### 3. Kuota Cloudinary Terlampaui
- **Mitigasi Otomatis:** Sistem secara otomatis beralih ke penyimpanan foto lokal pada direktori `backend/uploads/` tanpa menghentikan fungsionalitas aplikasi.
