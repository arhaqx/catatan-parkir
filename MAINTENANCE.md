# Panduan Pemeliharaan Rutin (Maintenance Guide)

Daftar tugas pemeliharaan berkala untuk administrator sistem Catatan Parkir Pabrik.

## Tugas Mingguan
- Tinjau log PM2 untuk mendeteksi anomali:
  ```bash
  pm2 logs parkir-api --lines 50
  ```
- Bersihkan file log yang membesar jika diperlukan:
  ```bash
  pm2 flush
  ```

## Tugas Bulanan
- Periksa ukuran file database SQLite dan jalankan vacuum jika diperlukan:
  ```bash
  sqlite3 /home/uchiha/catatan-parkir/backend/database.sqlite "VACUUM; ANALYZE;"
  ```
- Verifikasi bahwa snapshot pencadangan harian berjalan sesuai jadwal.
- Jalankan `npm audit` untuk memastikan dependensi tetap aman dari celah keamanan baru.
