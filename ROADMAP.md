# Peta Jalan Pengembangan (Roadmap)

Dokumen ini merangkum rencana evolusi fitur dan peningkatan arsitektur untuk sistem **Catatan Parkir Pabrik**.

## Versi 1.x (Stabil & Peningkatan Mutu)
- [x] Pencatatan shift masuk dan keluar kendaraan.
- [x] Verifikasi kemiripan foto berbasis algoritma dHash 64-bit.
- [x] Integrasi kalender hari libur nasional Indonesia.
- [x] Ekspor rekapitulasi data ke format Microsoft Excel (.xlsx).
- [x] Pipeline pengujian otomatis (CI) pada GitHub Actions.
- [x] Standarisasi validasi rentang tanggal dan logging terstruktur.

## Versi 2.0 (Ekspansi Fitur & Otomatisasi)
- [ ] **Multi-Gate Support:** Dukungan monitoring beberapa gerbang pos satpam sekaligus dalam satu pabrik.
- [ ] **Export PDF Ringkasan:** Fitur cetak rekapitulasi resmi format PDF ber-watermark untuk arsip audit.
- [ ] **Integrasi OCR Plat Nomor (LPR):** Eksperimen pembacaan nomor polisi otomatis via kamera pos jaga.
- [ ] **Integrasi Notifikasi Telegram/WhatsApp:** Pengiriman alert otomatis kepada supervisor jika kapasitas parkir mencapai status *Overload*.
- [ ] **Mode Gelap / Terang Terintegrasi:** Penyempurnaan toggle tema UI responsif.
