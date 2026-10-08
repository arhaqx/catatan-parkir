# Pertanyaan yang Sering Diajukan (FAQ)

### 1. Mengapa memilih SQLite sebagai database?
SQLite ringan, tanpa dependensi server eksternal, minim konsumsi memori, dan sangat andal untuk kebutuhan pencatatan internal pabrik dengan volume transaksi ratusan transaksi per hari.

### 2. Bagaimana sistem mendeteksi foto yang dicurangi / diunggah ulang?
Sistem menggunakan algoritma *Difference Hash (dHash)* 64-bit pada modul Sharp. Setiap gambar dikonversi menjadi hash biner, kemudian dibandingkan dengan riwayat foto sebelumnya menggunakan *Hamming Distance*. Jika selisih bit <= 6, sistem menandainya sebagai duplikat.

### 3. Berapa tarif parkir per motor?
Secara default tarif yang ditetapkan adalah **Rp 3.000 / unit motor**, sesuai konstanta `PARKING_CONFIG.RATE_PER_MOTORCYCLE`.

### 4. Apakah aplikasi dapat dijalankan tanpa akun Cloudinary?
Bisa. Jika variabel lingkungan Cloudinary tidak diisi, sistem tetap berfungsi normal dan fallback penyimpanan file foto akan diarahkan ke direktori lokal `/uploads`.

### 5. Bagaimana cara mereset database ke keadaan awal?
Hapus file database SQLite pada direktori backend (atau jalankan migrasi ulang) lalu jalankan script seed demo jika diperlukan:
```bash
curl -X POST http://localhost:3001/api/reports/seed
```
