# Struktur Direktori Proyek (Project Structure)

Ringkasan arsitektur tata letak direktori pada repositori **Catatan Parkir Pabrik**:

```
catatan-parkir/
├── .github/                  # Workflow CI/CD & template GitHub Issue/PR
├── backend/                  # Server REST API Express.js
│   ├── constants/            # Konstanta konfigurasi operasional (tarif, kapasitas)
│   ├── routes/               # Handler endpoint API (laporan, summary, export)
│   ├── tests/                # Test suite otomatis (node:test)
│   ├── utils/                # Utilitas (dHash, kalender libur, logger, validators)
│   ├── database.js           # Inisialisasi koneksi SQLite3 lokal
│   ├── server.js             # Entry point Express server
│   └── package.json          # Dependensi dan script test backend
├── frontend/                 # Client antarmuka web SPA (React 19 + Vite)
│   ├── src/                  # Komponen, hook, dan utilitas client
│   ├── public/               # Asset statis
│   └── package.json          # Dependensi client
├── ARCHITECTURE.md           # Desain teknis dan alur data sistem
├── CHANGELOG.md              # Riwayat catatan rilis versi
├── CONTRIBUTING.md           # Panduan kontribusi kode
├── DEPLOYMENT.md             # Panduan deployment server produksi
├── LICENSE                   # Lisensi open-source MIT
├── ROADMAP.md                # Peta jalan pengembangan fitur masa depan
├── SECURITY.md               # Kebijakan pelaporan kerentanan keamanan
└── README.md                 # Dokumentasi utama proyek
```
