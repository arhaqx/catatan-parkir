# Prosedur Audit Dependensi & Integritas (Audit Guide)

Dokumen ini menjelaskan standar audit berkala untuk menjaga kesehatan dan keamanan repositori.

## Audit Dependensi Otomatis

Jalankan audit dependensi resmi dari NPM:

```bash
# Audit modul backend
cd backend
npm audit

# Audit modul frontend
cd ../frontend
npm audit
```

## Kebijakan Pembaruan Dependensi

- **Patch / Minor Updates:** Dapat segera diperbarui selama pengujian unit tetap lulus 100%.
- **Major Updates:** Wajib diuji pada branch terpisah dan diverifikasi kompatibilitasnya dengan Node.js 20 & 22 LTS.
- **Pemeriksaan Dependabot:** GitHub Dependabot dikonfigurasi untuk memeriksa celah keamanan mingguan pada backend dan frontend.
