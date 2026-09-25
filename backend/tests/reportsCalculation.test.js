const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const sqlite3 = require('sqlite3').verbose();

describe('Reports Data & Aggregation Logic', () => {
  let db;

  test('setup in-memory database with schema', (t, done) => {
    db = new sqlite3.Database(':memory:', (err) => {
      assert.ifError(err);
      db.run(`CREATE TABLE reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        total_motorcycles INTEGER NOT NULL,
        total_revenue INTEGER NOT NULL,
        notes TEXT,
        photo_path TEXT,
        officer_name TEXT DEFAULT 'Ucup',
        photo_status TEXT DEFAULT 'pending'
      )`, (err) => {
        assert.ifError(err);
        done();
      });
    });
  });

  test('insert sample report data', (t, done) => {
    const samples = [
      ['2026-09-01', 80, 240000, 'Shift lancar', 'https://res.cloudinary.com/demo/1.jpg', 'Ucup', 'valid'],
      ['2026-09-02', 95, 285000, 'Kapasitas penuh', 'https://res.cloudinary.com/demo/2.jpg', 'Ucup', 'valid'],
      ['2026-09-03', 105, 315000, 'Overload parkir luar', null, 'Budi', 'no_photo']
    ];

    let completed = 0;
    samples.forEach(s => {
      db.run(
        `INSERT INTO reports (date, total_motorcycles, total_revenue, notes, photo_path, officer_name, photo_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        s,
        (err) => {
          assert.ifError(err);
          completed++;
          if (completed === samples.length) done();
        }
      );
    });
  });

  test('menghitung metrik summary dengan benar', (t, done) => {
    const sql = `
      SELECT 
        COUNT(*) AS total_reports,
        COALESCE(SUM(total_motorcycles), 0) AS total_motorcycles,
        COALESCE(SUM(total_revenue), 0) AS total_revenue,
        COALESCE(ROUND(AVG(total_motorcycles), 1), 0) AS avg_motorcycles,
        COALESCE(MAX(total_motorcycles), 0) AS max_motorcycles,
        COALESCE(MIN(total_motorcycles), 0) AS min_motorcycles,
        COALESCE(SUM(CASE WHEN total_motorcycles > 90 THEN 1 ELSE 0 END), 0) AS overload_count
      FROM reports
    `;

    db.get(sql, [], (err, row) => {
      assert.ifError(err);
      assert.equal(row.total_reports, 3);
      assert.equal(row.total_motorcycles, 280);
      assert.equal(row.total_revenue, 840000);
      assert.equal(row.max_motorcycles, 105);
      assert.equal(row.min_motorcycles, 80);
      assert.equal(row.overload_count, 2); // 95 dan 105 (>90)
      done();
    });
  });

  test('menangani filter tanggal pada summary', (t, done) => {
    const sql = `
      SELECT COUNT(*) AS total_reports, COALESCE(SUM(total_revenue), 0) AS total_revenue
      FROM reports
      WHERE date BETWEEN ? AND ?
    `;

    db.get(sql, ['2026-09-01', '2026-09-02'], (err, row) => {
      assert.ifError(err);
      assert.equal(row.total_reports, 2);
      assert.equal(row.total_revenue, 525000);
      done();
    });
  });
});
