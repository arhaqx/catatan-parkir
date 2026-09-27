# Panduan Kontribusi (Contributing Guide)

Terima kasih atas minat Anda untuk berkontribusi pada pengembangan **Catatan Parkir Pabrik**! Proyek ini dikembangkan dengan standar kualitas tinggi, kode bersih (*clean code*), dan pengujian otomatis.

---

## 🌿 Alur Kerja Git (Git Workflow)

1. **Fork & Clone**
   - Fork repository ini ke akun GitHub Anda.
   - Clone ke mesin lokal:
     ```bash
     git clone https://github.com/arhaqx/catatan-parkir.git
     ```

2. **Buat Branch Fitur / Perbaikan**
   Gunakan konvensi penamaan branch deskriptif:
   - `feat/nama-fitur` (untuk fitur baru)
   - `fix/nama-bug` (untuk perbaikan bug)
   - `docs/nama-dokumen` (untuk dokumentasi)
   - `refactor/nama-refactor` (untuk restrukturisasi kode)

3. **Format Pesan Commit (Conventional Commits)**
   Gunakan format standar Conventional Commits:
   - `feat(...)`: Penambahan fungsionalitas baru
   - `fix(...)`: Perbaikan bug atau penanganan kesalahan
   - `docs(...)`: Perubahan dokumentasi
   - `style(...)`: Perubahan format/tampilan tanpa mengubah logika
   - `refactor(...)`: Restrukturisasi kode tanpa mengubah fungsionalitas
   - `test(...)`: Penambahan atau pembaruan pengujian
   - `chore(...)`: Pemeliharaan build, dependensi, atau konfigurasi

---

## 🧪 Standar Pengujian & Kualitas

Setiap perubahan di sisi backend wajib menyertakan unit test jika menambahkan atau mengubah logika bisnis:

```bash
cd backend
npm test
```


Menjalankan file test tertentu:
```bash
node --test tests/formatters.test.js
```

Pastikan semua pengujian lolos tanpa kegagalan (`pass`, `fail: 0`) sebelum membuat Pull Request.

---

## 💻 Standar Kode & Format

- Mengikuti aturan konfigurasi `.editorconfig` (indentasi 2 spasi, LF, UTF-8).
- Hindari *hardcoded credentials*; selalu gunakan variabel lingkungan (`.env`).
- Berikan komentar JSDoc pada fungsi utilitas dan helper publik.
