# Strategi Percabangan Git (Git Branching Strategy)

Repositori ini menerapkan alur kerja berbasis *Trunk-Based Development* yang disederhanakan dengan *Feature Branches*.

## Struktur Branch

- **`main`**: Branch produksi utama. Setiap commit yang masuk ke `main` harus selalu dalam kondisi stabil (*deployable*) dan seluruh unit test wajib lulus.
- **`feature/<nama-fitur>`**: Branch untuk pengembangan fungsionalitas baru (misal: `feature/multi-gate-support`).
- **`fix/<deskripsi-bug>`**: Branch untuk perbaikan galat atau penanganan bug (misal: `fix/sqlite-timeout-handler`).
- **`docs/<topik>`**: Branch khusus perbaikan dokumentasi atau catatan teknis.

## Alur Kerja (Workflow)

1. Buat branch baru dari `main`:
   ```bash
   git checkout -b feature/nama-fitur
   ```
2. Lakukan perubahan dengan commit granular dan pesan yang bermakna (*Conventional Commits*).
3. Jalankan pengujian lokal:
   ```bash
   npm test --prefix backend
   ```
4. Buka Pull Request ke branch `main`.
5. Setelah lolos CI dan ditinjau, merge ke `main` menggunakan metode *Squash and Merge* atau *Rebase Merge*.
