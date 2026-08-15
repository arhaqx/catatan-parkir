const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const db = require('../database');
const exceljs = require('exceljs');
const { format, subDays } = require('date-fns');

// Konfigurasi Cloudinary dari file .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Gunakan Memory Storage (Foto disimpan di RAM sementara sebelum dikirim langsung ke Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Batas 10MB per foto
});

// Helper function untuk upload buffer ke Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'catatan_parkir',
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' } // Optimasi otomatis dari Cloudinary
                ]
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

// POST /api/reports - Create a new report (Uploads photo to Cloudinary)
router.post('/', upload.single('photo'), async (req, res) => {
    const { date, total_motorcycles, notes } = req.body;
    
    if (!date || total_motorcycles === undefined || total_motorcycles === '') {
        return res.status(400).json({ error: 'Date dan total_motorcycles wajib diisi' });
    }

    const motorcycles = parseInt(total_motorcycles, 10);
    const total_revenue = motorcycles * 3000;
    let photo_path = null;

    // Jika ada file foto yang diunggah
    if (req.file) {
        try {
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                // Upload langsung ke Cloudinary
                const cloudResult = await uploadToCloudinary(req.file.buffer);
                photo_path = cloudResult.secure_url;
            }
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ error: 'Gagal mengunggah foto ke Cloudinary: ' + uploadError.message });
        }
    }

    const sql = `INSERT INTO reports (date, total_motorcycles, total_revenue, notes, photo_path) VALUES (?, ?, ?, ?, ?)`;
    const params = [date, motorcycles, total_revenue, notes || null, photo_path];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error inserting report:', err);
            return res.status(500).json({ error: 'Gagal menyimpan laporan ke database' });
        }
        res.status(201).json({
            id: this.lastID,
            date,
            total_motorcycles: motorcycles,
            total_revenue,
            notes,
            photo_path
        });
    });
});

// GET /api/reports - Get reports with optional date range filter
router.get('/', (req, res) => {
    const { startDate, endDate } = req.query;
    
    let sql = `SELECT * FROM reports`;
    let params = [];

    if (startDate && endDate) {
        sql += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    } else if (startDate) {
        sql += ` WHERE date >= ?`;
        params.push(startDate);
    } else if (endDate) {
        sql += ` WHERE date <= ?`;
        params.push(endDate);
    }

    sql += ` ORDER BY date DESC, id DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching reports:', err);
            return res.status(500).json({ error: 'Failed to fetch reports' });
        }
        res.json(rows);
    });
});

// DELETE /api/reports/:id - Delete a report entry
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM reports WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error('Error deleting report:', err);
            return res.status(500).json({ error: 'Failed to delete report' });
        }
        res.json({ success: true, deletedId: id });
    });
});

// POST /api/reports/seed - Seed sample data for quick testing/demo
router.post('/seed', (req, res) => {
    const sampleCounts = [65, 78, 85, 92, 70, 88, 95];
    const notesList = [
        'Kondisi lapangan lancar tertib',
        'Shift pagi padat, parkir tertata rapi',
        'Cuaca hujan gerimis saat sore',
        'Area parkir utara hampir penuh',
        'Pemeriksaan helm dan kunci ganda aman',
        'Hari libur parsial, operasional normal',
        'Kondisi optimal 95 unit'
    ];

    const today = new Date();
    let inserted = 0;

    sampleCounts.forEach((count, index) => {
        const dateStr = format(subDays(today, 6 - index), 'yyyy-MM-dd');
        const revenue = count * 3000;
        const notes = notesList[index];

        db.run(
            `INSERT INTO reports (date, total_motorcycles, total_revenue, notes, photo_path) VALUES (?, ?, ?, ?, NULL)`,
            [dateStr, count, revenue, notes],
            (err) => {
                if (!err) inserted++;
            }
        );
    });

    setTimeout(() => {
        res.json({ message: `Sample data berhasil di-generate (${inserted} data)!` });
    }, 200);
});

// GET /api/reports/export - Export reports to Excel
router.get('/export', async (req, res) => {
    const { startDate, endDate } = req.query;
    
    let sql = `SELECT * FROM reports`;
    let params = [];

    if (startDate && endDate) {
        sql += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    } else if (startDate) {
        sql += ` WHERE date >= ?`;
        params.push(startDate);
    } else if (endDate) {
        sql += ` WHERE date <= ?`;
        params.push(endDate);
    }

    sql += ` ORDER BY date DESC, id DESC`;

    db.all(sql, params, async (err, rows) => {
        if (err) {
            console.error('Error fetching reports for export:', err);
            return res.status(500).json({ error: 'Failed to fetch reports for export' });
        }

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Laporan Parkir');

        // Style the headers
        worksheet.columns = [
            { header: 'No', key: 'no', width: 8 },
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Tanggal', key: 'date', width: 16 },
            { header: 'Total Motor', key: 'total_motorcycles', width: 16 },
            { header: 'Status Kapasitas', key: 'status_capacity', width: 22 },
            { header: 'Tarif/Unit', key: 'rate', width: 14 },
            { header: 'Total Pemasukan (Rp)', key: 'total_revenue', width: 22 },
            { header: 'Catatan Lapangan', key: 'notes', width: 35 },
            { header: 'Link Bukti Foto', key: 'photo_path', width: 45 },
            { header: 'Waktu Input', key: 'created_at', width: 22 },
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1A73E8' } // Google Blue
        };

        rows.forEach((row, idx) => {
            const count = row.total_motorcycles || 0;
            const isOver = count > 100;
            const extra = Math.max(0, count - 100);
            const statusStr = isOver ? `⚠️ Overload (+${extra} Motor)` : `Normal (${Math.round((count / 100) * 100)}%)`;

            worksheet.addRow({
                no: idx + 1,
                id: row.id,
                date: row.date,
                total_motorcycles: count,
                status_capacity: statusStr,
                rate: 3000,
                total_revenue: row.total_revenue,
                notes: row.notes || '-',
                photo_path: row.photo_path || '-',
                created_at: row.created_at
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_Parkir_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    });
});

module.exports = router;
