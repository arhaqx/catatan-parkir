# Prosedur Backup & Restore Database SQLite

Panduan ini mengatur tata cara pencadangan dan pemulihan data file SQLite `database.sqlite` pada sistem Catatan Parkir Pabrik.

## Pencadangan Mandiri (Manual Backup)

Gunakan utilitas CLI bawaan SQLite untuk memastikan konsistensi transaksi:

```bash
# Metode 1: Menggunakan SQLite .backup (Aman terhadap lock)
sqlite3 /home/uchiha/catatan-parkir/backend/database.sqlite ".backup '/home/uchiha/backups/parking_$(date +%Y%m%d_%H%M%S).sqlite'"

# Metode 2: Kompresi cadangan
gzip -c /home/uchiha/catatan-parkir/backend/database.sqlite > /home/uchiha/backups/parking_backup.sqlite.gz
```

## Otomatisasi via Cron Job

Jadwalkan pencadangan setiap hari pukul 02:00 WIB:

```bash
0 19 * * * sqlite3 /home/uchiha/catatan-parkir/backend/database.sqlite ".backup '/home/uchiha/backups/parking_daily.sqlite'"
```

## Pemulihan Data (Restore)

1. Hentikan proses backend Express:
   ```bash
   pm2 stop parkir-api
   ```
2. Ganti file database dengan berkas cadangan:
   ```bash
   cp /home/uchiha/backups/parking_daily.sqlite /home/uchiha/catatan-parkir/backend/database.sqlite
   ```
3. Nyalakan kembali aplikasi:
   ```bash
   pm2 start parkir-api
   ```
4. Verifikasi integritas tabel:
   ```bash
   sqlite3 /home/uchiha/catatan-parkir/backend/database.sqlite "PRAGMA integrity_check;"
   ```
