# ADR 0001: Penggunaan SQLite Lokal dan Algoritma dHash

- **Status:** Diterima (Accepted)
- **Tanggal:** September 2026
- **Penulis:** Muhammad Arinal Haq

## Konteks
Sistem pencatatan parkir pabrik memerlukan media penyimpanan data yang cepat, handal, dan mudah di-backup tanpa memerlukan server database terpisah seperti PostgreSQL atau MySQL yang memakan banyak alokasi RAM pada server single VM. Selain itu, diperlukan mekanisme validasi otomatis untuk mencegah kecurangan petugas yang mengunggah foto bukti lama.

## Keputusan
1. **SQLite3:** Dipilih sebagai database utama dengan konfigurasi `PRAGMA journal_mode = WAL` dan `PRAGMA busy_timeout = 5000` untuk menangani konkurensi I/O secara optimal.
2. **dHash 64-bit:** Dipilih sebagai algoritma sidik jari visual gambar karena komputasinya sangat cepat pada CPU dan tangguh terhadap kompresi format JPEG/PNG.

## Konsekuensi
- Positif: Zero-configuration database, konsumsi memori sangat rendah (<30MB RAM), verifikasi foto selesai dalam hitungan milidetik.
- Negatif: Tidak ditujukan untuk arsitektur multi-server terdistribusi (*horizontal scaling*).
