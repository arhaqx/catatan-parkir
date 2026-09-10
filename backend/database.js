const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create reports table
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            total_motorcycles INTEGER NOT NULL,
            total_revenue INTEGER NOT NULL,
            notes TEXT,
            photo_path TEXT,
            officer_name TEXT DEFAULT 'Ucup',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Table reports initialized.');
                // Migration: add officer_name column if table already existed without it
                db.run(`ALTER TABLE reports ADD COLUMN officer_name TEXT DEFAULT 'Ucup'`, (alterErr) => {
                    // Ignore duplicate column name error if already exists
                });
            }
        });
    }
});

module.exports = db;
