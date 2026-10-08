# Panduan Optimasi & Kinerja (Performance Guide)

Dokumen ini mencakup praktik terbaik performa sistem Catatan Parkir Pabrik.

## Optimasi Database SQLite

1. **Write-Ahead Logging (WAL Mode):**
   Memungkinkan operasi pembacaan berjalan secara konkuren tanpa terblokir oleh operasi penulisan.
2. **Indeks pada Kolom Tanggal (`date`):**
   ```sql
   CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(date);
   ```
   Mempercepat filter rentang tanggal (`startDate` s/d `endDate`) dan kalkulasi summary analitik.
3. **Busy Timeout Pragma:**
   `PRAGMA busy_timeout = 5000;` mencegah galat `SQLITE_BUSY` saat proses penulisan bersamaan.

## Optimasi Komputasi Gambar (dHash)

- Modul `sharp` memproses konversi gambar ke grayscale dan resize 9x8 secara native di layer C/C++.
- Verifikasi foto dieksekusi secara asinkron (*background worker*) sehingga endpoint pembuatan laporan langsung merespons ke client tanpa menunggu proses kompresi selesai.
