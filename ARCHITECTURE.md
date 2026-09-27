# Arsitektur Sistem & Desain Teknis (System Architecture)

Dokumen ini menjelaskan arsitektur tingkat tinggi (*high-level architecture*), alur data, komponen inti, dan keputusan desain pada proyek **Catatan Parkir Pabrik**.

---

## 🏗️ Gambaran Arsitektur (High-Level Overview)

Aplikasi ini menggunakan pola arsitektur **Client-Server terpisah**:
1. **Frontend Client:** Single Page Application (SPA) dibangun menggunakan React 19 + Vite dan Tailwind CSS.
2. **Backend API Server:** RESTful API service menggunakan Express.js 5, beroperasi di Linux Azure VM (dikelola oleh PM2).
3. **Database Layer:** SQLite3 embedded database untuk persistensi data relasional yang ringan dan cepat.
4. **Cloud Media Storage:** Cloudinary untuk penyimpanan, optimasi, dan CDN foto dokumentasi lapangan.

```
+-----------------------------------------------------------+
|                      Client Browser                       |
|   (React 19 SPA + Tailwind CSS + Lucide Icons + Vite)     |
+-----------------------------+-----------------------------+
                              |
                     HTTPS / JSON REST API
                              |
+-----------------------------v-----------------------------+
|                     Backend Server                        |
|        (Node.js + Express 5 on Azure VM via PM2)          |
+--------------+----------------------------+---------------+
               |                            |
      Multipart Upload               SQL Query Engine
               |                            |
+--------------v-------------+ +------------v---------------+
|     Cloudinary Cloud       | |      SQLite3 Database      |
|  (WebP Media Optimization) | |    (database.sqlite)       |
+----------------------------+ +----------------------------+
```

---


### Definisi Skema Tabel Reports
Tabel  menyimpan field-field utama:
- uid=1000(uchiha) gid=1000(uchiha) groups=1000(uchiha),4(adm),24(cdrom),27(sudo),30(dip),105(lxd): Primary key auto-increment
- Sun Sep 27 15:44:55 UTC 2026: Tanggal shift operasional (YYYY-MM-DD)
- : Jumlah unit motor
- : Pendapatan (unit * 3000)
- : Nama petugas penanggung jawab
- : 64-bit dHash perceptual fingerprint
- : Status validasi ('pending', 'valid', 'duplicate', 'no_photo')

## 🔍 Alur Verifikasi Foto (Visual dHash Authenticity Engine)

Untuk mencegah kecurangan petugas (mengunggah kembali foto kemarin atau foto lama), sistem menerapkan **perceptual hashing**:

1. **Upload:** Petugas mengunggah foto shift saat submit laporan.
2. **Immediate Response:** Backend langsung menyimpan laporan dan merespons klien (`photo_status: 'pending'`).
3. **Async Processing:**
   - Foto diproses menggunakan modul Sharp: diubah ke ukuran 9x8 grayscale (72 pixel).
   - Nilai kecerahan pixel horizontal berdekatan dibandingkan untuk membentuk **64-bit binary hash**.
   - Sistem menghitung **Hamming Distance** antara hash foto baru dengan semua foto terdahulu di database SQLite.
   - Jika jarak $\le 6$, foto ditandai `duplicate` dan dihubungkan ke ID laporan terdahulu. Jika tidak, ditandai `valid`.

---

## 🔒 Kebijakan Keamanan (Security Policy)

- **Proteksi Hapus Data:** Tindakan destruktif menghapus laporan dilindungi oleh verifikasi PIN admin (1312) di sisi antarmuka.
- **Isolasi Lingkungan:** Seluruh rahasia API key Cloudinary disimpan di file `.env` dan diabaikan oleh `.gitignore`.
