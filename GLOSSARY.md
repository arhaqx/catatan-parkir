# Glosarium Istilah Teknis (Glossary)

Daftar istilah dan konsep teknis yang digunakan di dalam proyek **Catatan Parkir Pabrik**:

- **dHash (Difference Hash):** Algoritma perceptual hash gambar berukuran 64-bit yang menghitung gradien perbedaan intensitas piksel tetangga untuk mendeteksi foto duplikat atau visual yang sangat mirip.
- **Hamming Distance:** Metrik pengukuran jumlah bit yang berbeda antara dua hash biner dHash. Nilai <= 6 mengindikasikan foto kemungkinan besar adalah gambar yang sama.
- **Shift Parkir:** Periode kerja operasional pabrik di mana petugas lapangan mencatat total akumulasi sepeda motor.
- **Overload Capacity:** Kondisi ketika jumlah sepeda motor yang terparkir melebihi kapasitas standar (90 unit).
- **SQLite Busy Timeout:** Konfigurasi `PRAGMA busy_timeout` pada SQLite untuk menahan antrean operasi tulis/baca selama durasi tertentu (5000ms) sebelum melempar galat `SQLITE_BUSY`.
- **Tanggal Merah:** Hari libur nasional resmi atau cuti bersama yang ditetapkan oleh SKB 3 Menteri di Indonesia, serta hari Minggu reguler.
- **PIN Proteksi Admin:** Kode otorisasi 4-digit yang wajib dimasukkan sebelum eksekusi penghapusan entri laporan pada antarmuka admin.
