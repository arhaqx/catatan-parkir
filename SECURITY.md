# Kebijakan Keamanan (Security Policy)

Kami menganggap serius keamanan sistem pelaporan parkir pabrik ini. Dokumen ini menjelaskan versi yang didukung dan prosedur pelaporan kerentanan keamanan.

## Versi yang Didukung

Saat ini, versi aplikasi yang mendapatkan pembaruan keamanan aktif adalah:

| Versi | Didukung |
| :--- | :--- |
| 1.x.x | :white_check_mark: Ya |
| < 1.0.0 | :x: Tidak |

## Melaporkan Kerentanan Keamanan

Jika Anda menemukan potensi kerentanan keamanan (*vulnerability*) pada proyek ini, mohon ikuti langkah-langkah berikut:

1. **Jangan buat issue publik:** Jangan membuka issue publik untuk masalah keamanan yang belum diperbaiki guna mencegah eksploitasi pihak ketiga.
2. **Kirim laporan privat:** Hubungi pengelola repositori langsung melalui email pribadi di:
   - **Email:** `arhaq30@gmail.com`
   - **Subjek:** `[SECURITY] Laporan Kerentanan: <Deskripsi Singkat>`
3. **Informasi yang dibutuhkan:**
   - Langkah-langkah reproduksi kerentanan (Proof of Concept).
   - Versi lingkungan / Node.js yang terdampak.
   - Potensi dampak risiko terhadap data atau integritas sistem.

## Kebijakan Kredensial & Secrets

- Seluruh kredensial sensitif seperti API Key Cloudinary, PIN administrasi, dan environment variables wajib disimpan pada file `.env` dan tidak boleh di-commit ke repositori Git.
- Repositori ini dilengkapi dengan `.gitignore` yang memblokir berkas `.env` dan file sensitif lainnya secara default.
