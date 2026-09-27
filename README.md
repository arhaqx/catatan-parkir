# 🏍️ Catatan Parkir Pabrik (Factory Parking Management System)

[![CI Pipeline](https://github.com/arhaqx/catatan-parkir/actions/workflows/ci.yml/badge.svg)](https://github.com/arhaqx/catatan-parkir/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)

Sistem pencatatan harian dan manajemen operasional parkir kendaraan roda dua internal pabrik. Aplikasi full-stack modern ini mencakup pencatatan shift petugas lapangan dengan bukti dokumentasi foto, verifikasi keaslian foto (dHash), integrasi kalender hari libur nasional, kalkulasi tarif otomatis, proteksi keamanan PIN, dashboard analitik admin, dan ekspor data ke Microsoft Excel (.xlsx).

---

## 🚀 Fitur Utama

### 👨‍💼 Form Petugas (Mobile & Desktop Friendly)
- **Input Cepat & Intuitif:** Input tanggal operasional, jumlah motor (kapasitas standar s/d 90-100 unit dengan indikator mode *overload*), dan catatan kondisi lapangan.
- **Pemilihan Penanggung Jawab (PIC):** Opsi penanggung jawab shift (Ucup / Petugas lainnya) sebelum pengiriman laporan.
- **Kalkulasi Pendapatan Otomatis:** Perhitungan otomatis total pendapatan berdasarkan tarif flat per motor (Rp3.000/unit).
- **Upload & Bukti Foto Cloudinary:** Unggah foto dokumentasi langsung ke cloud storage dengan kompresi otomatis (WebP).
- **Deteksi Hari Libur & Kalender Indonesia:** Deteksi otomatis hari kerja (Senin–Jumat), Sabtu (Lembur), serta Minggu & Hari Libur Nasional.
- **Navigasi Docked Mobile:** Tampilan responsif dengan *bottom tab bar navigation* yang nyaman diakses via ponsel / iOS Safari.

### 📊 Dashboard Admin & Monitoring
- **Metrik Analitik & Ringkasan:** Pantau total pemasukan, total unit motor, rata-rata harian, serta *capacity gauge* visual.
- **Verifikasi Keaslian Foto (Visual dHash):** Sistem pengecekan keaslian foto berbasis algoritma *difference hash* (dHash) untuk mendeteksi foto duplikat atau foto lama yang diunggah ulang.
- **Keamanan Hapus Data (PIN 1312):** Proteksi aksi destruktif (penghapusan laporan) dengan konfirmasi PIN admin.
- **Filter Rentang Tanggal:** Filter laporan berdasarkan tanggal tertentu untuk audit berkala.
- **Ekspor Excel (.xlsx):** Download rekapitulasi data lengkap dengan styling header, status shift, tarif, dan link foto.
- **Data Generator (Seed Demo):** Tombol generator data simulasi untuk kebutuhan testing dan demonstrasi instan.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Bundler:** React 19 + Vite
- **Styling:** Tailwind CSS + PostCSS (Mendukung Dark/Light Mode adaptif)
- **Routing:** React Router DOM (v7)
- **Icons & UI Utilities:** Lucide React, canvas-confetti, react-datepicker
- **HTTP Client:** Axios

### Backend
- **Runtime & Framework:** Node.js (v18+) + Express.js (v5)
- **Database:** SQLite3 (`database.sqlite`)
- **Image Processing & Storage:** Multer, Cloudinary SDK, Sharp (dHash Image Hasher)
- **Spreadsheet Generator:** ExcelJS
- **Date & Calendar Utility:** date-fns + dataset Hari Libur Nasional Indonesia
- **Process Manager:** PM2 (Production background)
- **Testing:** Native Node.js Test Runner (`node:test`, `node:assert`)
- **CI/CD:** GitHub Actions

---

## 📁 Struktur Direktori

```plaintext
catatan-parkir/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── backend/
│   ├── routes/
│   │   └── reports.js             # Endpoint laporan, upload Cloudinary, & export Excel
│   ├── utils/
│   │   ├── photoVerification.js   # Verifikasi visual dHash foto duplikat
│   │   └── indonesiaHolidays.js   # Kalender libur nasional & jadwal shift
│   ├── tests/
│   │   ├── indonesiaHolidays.test.js
│   │   ├── photoVerification.test.js
│   │   └── reportsCalculation.test.js
│   ├── database.js                # Inisialisasi koneksi & skema SQLite
│   ├── database.sqlite            # File database lokal SQLite
│   ├── server.js                  # Express server entry point (Port 3001)
│   ├── .env.example               # Template konfigurasi environment
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx   # Form pencatatan petugas lapangan
│   │   │   ├── AdminDashboard.jsx # Dashboard admin, analitik, & verifikasi foto
│   │   │   └── ui/BottomNav.jsx   # Floating mobile docked navigation
│   │   ├── utils/
│   │   │   └── indonesiaHolidays.js
│   │   ├── api.js                 # Konfigurasi Axios & API client
│   │   ├── App.jsx                # Routing & layout utama
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Panduan Instalasi & Menjalankan

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18+ disarankan)
- Akun [Cloudinary](https://cloudinary.com/) (untuk penyimpanan foto)

### 2. Setup Backend

```bash
cd backend
npm install
```

Salin file `.env.example` ke `.env` lalu sesuaikan konfigurasi Anda:
```bash
cp .env.example .env
```

Contoh variabel pada `.env`:
```env
PORT=3001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Jalankan server backend:
```bash
# Mode development (auto-reload)
npm run dev

# Mode production
npm start

# Atau menggunakan PM2 (Production background)
pm2 start server.js --name "parkir-api"
```
Server akan aktif di `http://localhost:3001`.

### 3. Menjalankan Unit Test Backend

Backend dilengkapi dengan test suite otomatis menggunakan test runner bawaan Node.js:
```bash
cd backend
npm test
```

### 4. Setup Frontend

Buka terminal baru dan masuk ke direktori frontend:
```bash
cd frontend
npm install
```

Jalankan development server:
```bash
npm run dev
```
Akses aplikasi melalui browser (default `http://localhost:5173`).

---

## 🔌 Dokumentasi REST API

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Deskripsi | Parameter / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check status API & koneksi Cloudinary | - |
| `GET` | `/reports` | Mengambil daftar riwayat laporan | Query: `startDate`, `endDate` |
| `GET` | `/reports/summary` | Ringkasan metrik agregasi & analitik | Query: `startDate`, `endDate` |
| `GET` | `/reports/:id` | Mengambil data detail laporan tunggal | Path param: `id` |
| `POST` | `/reports` | Menyimpan laporan shift parkir baru | `multipart/form-data`: `date`, `total_motorcycles`, `pic`, `notes`, `photo` (file) |
| `DELETE` | `/reports/:id` | Menghapus laporan (di frontend diproteksi PIN 1312) | Path param: `id` |
| `POST` | `/reports/seed` | Generate data simulasi 7 hari untuk demo | - |
| `GET` | `/reports/export` | Unduh rekap laporan dalam format file `.xlsx` | Query: `startDate`, `endDate` |


## 🔧 Pemecahan Masalah (Troubleshooting)

- **Database Locked (SQLite):** Jika muncul error , pastikan tidak ada proses lain yang membuka file secara eksklusif dan gunakan perintah Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [parkir-api](ids: [ 0 ])
[PM2] [parkir-api](0) ✓
┌────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ parkir-api    │ default     │ 1.0.0   │ fork    │ 1769425  │ 0s     │ 1    │ online    │ 0%       │ 25.6mb   │ uchiha   │ disabled │
└────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
host metrics | cpu: 2.8% | ram usage: 77.7% | eth0: ⇓ 0.006mb/s ⇑ 0.004mb/s | disk: ⇓ 1.739mb/s ⇑ 0.585mb/s |.
- **Upload Foto Timeout:** Pastikan kredensial Cloudinary di file  sudah benar dan format file gambar bertipe JPEG/PNG/WebP.

## 📚 Dokumentasi Lanjutan

- [Arsitektur Sistem & Desain Teknis (ARCHITECTURE.md)](./ARCHITECTURE.md)
- [Panduan Kontribusi (CONTRIBUTING.md)](./CONTRIBUTING.md)
- [Catatan Rilis & Perubahan (CHANGELOG.md)](./CHANGELOG.md)

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi [MIT License](./LICENSE).

---

## 👤 Penulis
- **Muhammad Arinal** ([@arhaqx](https://github.com/arhaqx))
