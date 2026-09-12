/**
 * Modul Verifikasi Keaslian Foto Laporan Parkir (Perceptual Hashing)
 * Menggunakan algoritma dHash (Difference Hash) 64-bit untuk mendeteksi
 * apakah foto yang diunggah identik/mirip dengan foto laporan sebelumnya.
 */

const sharp = require('sharp');

/**
 * Menghitung dHash (difference hash) 64-bit dari buffer gambar.
 * 1. Resize ke 9x8 grayscale (72 pixel)
 * 2. Bandingkan pixel horizontal berdekatan (8 per baris x 8 baris = 64 bit)
 * @param {Buffer} buffer 
 * @returns {Promise<string|null>} 64-character binary string ('0' dan '1')
 */
async function calculateDHash(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer)) return null;
    try {
        const raw = await sharp(buffer)
            .resize(9, 8, { fit: 'fill' })
            .grayscale()
            .raw()
            .toBuffer();

        let hash = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const left = raw[row * 9 + col];
                const right = raw[row * 9 + col + 1];
                hash += left > right ? '1' : '0';
            }
        }
        return hash;
    } catch (err) {
        console.error('Error calculating dHash:', err.message);
        return null;
    }
}

/**
 * Menghitung Hamming Distance antara 2 hash 64-bit.
 * Jarak 0-6 mengindikasikan kemiripan > 90% (foto yang sama / daur ulang).
 * @param {string} hashA 
 * @param {string} hashB 
 * @returns {number} Jumlah bit yang berbeda (0 - 64)
 */
function hammingDistance(hashA, hashB) {
    if (!hashA || !hashB || hashA.length !== hashB.length) return 64;
    let dist = 0;
    for (let i = 0; i < hashA.length; i++) {
        if (hashA[i] !== hashB[i]) dist++;
    }
    return dist;
}

/**
 * Menjalankan verifikasi keaslian foto secara asinkron di latar belakang.
 * Membandingkan sidik jari visual foto baru dengan seluruh riwayat foto di database.
 * @param {number} reportId ID laporan yang baru dibuat
 * @param {Buffer} imageBuffer Buffer file foto dari memory
 * @param {object} db Objek database SQLite
 */
async function processPhotoAuthenticity(reportId, imageBuffer, db) {
    if (!reportId || !imageBuffer || !db) return;

    try {
        // 1. Hitung hash visual untuk foto baru
        const newHash = await calculateDHash(imageBuffer);

        if (!newHash) {
            // Jika decoding gambar gagal, set status valid agar laporan tidak macet
            db.run(`UPDATE reports SET photo_status = 'valid' WHERE id = ?`, [reportId]);
            return;
        }

        // 2. Ambil seluruh riwayat foto sebelumnya yang sudah memiliki hash
        const query = `
            SELECT id, date, officer_name, image_hash, photo_path 
            FROM reports 
            WHERE id != ? AND image_hash IS NOT NULL AND image_hash != ''
        `;

        db.all(query, [reportId], (err, rows) => {
            if (err) {
                console.error('Error querying existing hashes:', err);
                db.run(`UPDATE reports SET image_hash = ?, photo_status = 'valid' WHERE id = ?`, [newHash, reportId]);
                return;
            }

            let isDuplicate = false;
            let matchedReport = null;
            let closestDistance = 64;

            // Ambang batas kemiripan (threshold distance <= 6 dari 64 bit = kemiripan visual >= 90.6%)
            const SIMILARITY_THRESHOLD = 6;

            for (const row of rows) {
                const dist = hammingDistance(newHash, row.image_hash);
                if (dist <= SIMILARITY_THRESHOLD && dist < closestDistance) {
                    closestDistance = dist;
                    isDuplicate = true;
                    matchedReport = row;
                }
            }

            if (isDuplicate && matchedReport) {
                console.log(`[PhotoAudit] Report #${reportId} TERDETEKSI DUPLIKAT dengan Report #${matchedReport.id} (${matchedReport.date})! Distance: ${closestDistance}`);
                db.run(
                    `UPDATE reports 
                     SET image_hash = ?, photo_status = 'duplicate', duplicate_with_id = ?, duplicate_date = ? 
                     WHERE id = ?`,
                    [newHash, matchedReport.id, matchedReport.date, reportId],
                    (updateErr) => {
                        if (updateErr) console.error('Error updating duplicate status:', updateErr);
                    }
                );
            } else {
                console.log(`[PhotoAudit] Report #${reportId} foto terverifikasi VALID/ASLI.`);
                db.run(
                    `UPDATE reports 
                     SET image_hash = ?, photo_status = 'valid', duplicate_with_id = NULL, duplicate_date = NULL 
                     WHERE id = ?`,
                    [newHash, reportId],
                    (updateErr) => {
                        if (updateErr) console.error('Error updating valid status:', updateErr);
                    }
                );
            }
        });
    } catch (error) {
        console.error('Fatal error in processPhotoAuthenticity:', error);
        db.run(`UPDATE reports SET photo_status = 'valid' WHERE id = ?`, [reportId]);
    }
}

/**
 * Backfill otomatis: Menghitung hash untuk foto-foto lama yang belum memiliki hash.
 * Dijalankan saat server start tanpa menghambat API.
 * @param {object} db 
 */
function backfillOldPhotos(db) {
    if (!db) return;
    const query = `
        SELECT id, photo_path 
        FROM reports 
        WHERE (image_hash IS NULL OR image_hash = '') AND photo_path IS NOT NULL AND photo_path != '' AND photo_path != '-'
        LIMIT 20
    `;

    db.all(query, [], async (err, rows) => {
        if (err || !rows || rows.length === 0) return;
        console.log(`[PhotoAudit] Memeriksa ${rows.length} foto lama untuk di-indeks hash...`);

        for (const row of rows) {
            try {
                // Download buffer gambar dari Cloudinary URL
                const response = await fetch(row.photo_path);
                if (!response.ok) continue;
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const hash = await calculateDHash(buffer);
                if (hash) {
                    db.run(
                        `UPDATE reports SET image_hash = ?, photo_status = COALESCE(photo_status, 'valid') WHERE id = ?`,
                        [hash, row.id]
                    );
                }
            } catch (fetchErr) {
                // Lewati foto lama jika gagal di-fetch
            }
        }
    });
}

module.exports = {
    calculateDHash,
    hammingDistance,
    processPhotoAuthenticity,
    backfillOldPhotos
};
