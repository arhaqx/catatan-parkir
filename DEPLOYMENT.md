# Panduan Deployment (Deployment Guide)

Dokumen ini menjelaskan prosedur instalasi dan peluncuran sistem **Catatan Parkir Pabrik** ke server produksi (misal: Azure Virtual Machine Ubuntu Linux).

## Prasyarat Server
- Ubuntu Linux 22.04 LTS atau lebih baru.
- Node.js versi 20 LTS atau 22 LTS.
- PM2 (Process Manager) terpasang secara global (`npm install -g pm2`).
- Nginx Web Server sebagai reverse proxy.

## 1. Setup Backend
1. Masuk ke direktori backend:
   ```bash
   cd /path/to/catatan-parkir/backend
   npm install --production
   ```
2. Siapkan file konfigurasi environment `.env`:
   ```env
   PORT=3001
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Jalankan aplikasi menggunakan PM2:
   ```bash
   pm2 start server.js --name "parkir-api"
   pm2 save
   pm2 startup
   ```

## 2. Setup Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd /path/to/catatan-parkir/frontend
   npm install
   npm run build
   ```
2. Direktori `dist/` siap disajikan via Nginx atau di-host secara mandiri.

## 3. Konfigurasi Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name parkir.yourdomain.com;

    location / {
        root /path/to/catatan-parkir/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
