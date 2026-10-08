# Standar Penulisan Kode (Coding Standards)

Pedoman penulisan kode sumber untuk backend dan frontend pada repositori ini.

## Prinsip Umum
- **KISS (Keep It Simple, Stupid):** Tulis kode yang langsung pada inti masalah tanpa abstraksi berlebihan.
- **Fail Early:** Validasi parameter di awal fungsi dan kembalikan error lebih awal (*guard clauses*).
- **Pure Utility Functions:** Buat fungsi utilitas di folder `utils/` murni tanpa efek samping (*side effects*) agar mudah diuji secara modular.

## Backend (Node.js & Express)
- Gunakan format CommonJS (`require` / `module.exports`) yang konsisten.
- Seluruh endpoint wajib memiliki penanganan kesalahan dengan status HTTP yang sesuai (`200`, `201`, `400`, `404`, `500`).
- Hindari pemanggilan `console.log` secara langsung; manfaatkan modul `utils/logger.js`.
- Semua query SQL ke SQLite wajib menggunakan parameter bind (`?`) untuk mencegah SQL Injection.

## Frontend (React & Vite)
- Gunakan React Functional Components dengan Hooks modern.
- Pisahkan logika pemanggilan API ke dalam `src/api.js`.
- Manfaatkan Tailwind CSS utility classes untuk kemudahan styling responsif.
