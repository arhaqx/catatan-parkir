/**
 * Kalender Indonesia: Hari Libur Nasional & Cuti Bersama (Tanggal Merah)
 * Terintegrasi dengan SKB 3 Menteri dan update Google Calendar Indonesia.
 * Bekerja 100% offline-first dengan opsi sinkronisasi otomatis background.
 */

// Dataset Hari Libur Nasional & Cuti Bersama Resmi (2024, 2025, 2026, 2027)
const BASE_HOLIDAYS = {
  // === TAHUN 2024 ===
  "2024-01-01": { name: "Tahun Baru 2024 Masehi", type: "national" },
  "2024-02-08": { name: "Isra Mikraj Nabi Muhammad SAW", type: "national" },
  "2024-02-09": { name: "Cuti Bersama Tahun Baru Imlek", type: "joint_leave" },
  "2024-02-10": { name: "Tahun Baru Imlek 2575 Kongzili", type: "national" },
  "2024-03-11": { name: "Hari Suci Nyepi (Tahun Baru Saka 1946)", type: "national" },
  "2024-03-12": { name: "Cuti Bersama Hari Suci Nyepi", type: "joint_leave" },
  "2024-03-29": { name: "Wafat Yesus Kristus", type: "national" },
  "2024-03-31": { name: "Hari Paskah", type: "national" },
  "2024-04-08": { name: "Cuti Bersama Idul Fitri 1445 H", type: "joint_leave" },
  "2024-04-09": { name: "Cuti Bersama Idul Fitri 1445 H", type: "joint_leave" },
  "2024-04-10": { name: "Hari Raya Idul Fitri 1445 H", type: "national" },
  "2024-04-11": { name: "Hari Raya Idul Fitri 1445 H", type: "national" },
  "2024-04-12": { name: "Cuti Bersama Idul Fitri 1445 H", type: "joint_leave" },
  "2024-04-15": { name: "Cuti Bersama Idul Fitri 1445 H", type: "joint_leave" },
  "2024-05-01": { name: "Hari Buruh Internasional", type: "national" },
  "2024-05-09": { name: "Kenaikan Yesus Kristus", type: "national" },
  "2024-05-10": { name: "Cuti Bersama Kenaikan Yesus Kristus", type: "joint_leave" },
  "2024-05-23": { name: "Hari Raya Waisak 2568 BE", type: "national" },
  "2024-05-24": { name: "Cuti Bersama Hari Raya Waisak", type: "joint_leave" },
  "2024-06-01": { name: "Hari Lahir Pancasila", type: "national" },
  "2024-06-17": { name: "Hari Raya Idul Adha 1445 H", type: "national" },
  "2024-06-18": { name: "Cuti Bersama Idul Adha", type: "joint_leave" },
  "2024-07-07": { name: "Tahun Baru Islam 1446 H", type: "national" },
  "2024-08-17": { name: "Hari Proklamasi Kemerdekaan RI", type: "national" },
  "2024-09-16": { name: "Maulid Nabi Muhammad SAW", type: "national" },
  "2024-12-25": { name: "Hari Raya Natal", type: "national" },
  "2024-12-26": { name: "Cuti Bersama Hari Raya Natal", type: "joint_leave" },

  // === TAHUN 2025 ===
  "2025-01-01": { name: "Tahun Baru 2025 Masehi", type: "national" },
  "2025-01-27": { name: "Isra Mikraj Nabi Muhammad SAW", type: "national" },
  "2025-01-28": { name: "Cuti Bersama Tahun Baru Imlek", type: "joint_leave" },
  "2025-01-29": { name: "Tahun Baru Imlek 2576 Kongzili", type: "national" },
  "2025-03-28": { name: "Cuti Bersama Hari Suci Nyepi", type: "joint_leave" },
  "2025-03-29": { name: "Hari Suci Nyepi (Tahun Baru Saka 1947)", type: "national" },
  "2025-03-31": { name: "Hari Raya Idul Fitri 1446 H", type: "national" },
  "2025-04-01": { name: "Hari Raya Idul Fitri 1446 H", type: "national" },
  "2025-04-02": { name: "Cuti Bersama Idul Fitri 1446 H", type: "joint_leave" },
  "2025-04-03": { name: "Cuti Bersama Idul Fitri 1446 H", type: "joint_leave" },
  "2025-04-04": { name: "Cuti Bersama Idul Fitri 1446 H", type: "joint_leave" },
  "2025-04-07": { name: "Cuti Bersama Idul Fitri 1446 H", type: "joint_leave" },
  "2025-04-18": { name: "Wafat Yesus Kristus", type: "national" },
  "2025-04-20": { name: "Kebangkitan Yesus Kristus (Paskah)", type: "national" },
  "2025-05-01": { name: "Hari Buruh Internasional", type: "national" },
  "2025-05-12": { name: "Hari Raya Waisak 2569 BE", type: "national" },
  "2025-05-13": { name: "Cuti Bersama Hari Raya Waisak", type: "joint_leave" },
  "2025-05-29": { name: "Kenaikan Yesus Kristus", type: "national" },
  "2025-05-30": { name: "Cuti Bersama Kenaikan Yesus Kristus", type: "joint_leave" },
  "2025-06-01": { name: "Hari Lahir Pancasila", type: "national" },
  "2025-06-06": { name: "Hari Raya Idul Adha 1446 H", type: "national" },
  "2025-06-09": { name: "Cuti Bersama Idul Adha 1446 H", type: "joint_leave" },
  "2025-06-27": { name: "Tahun Baru Islam 1447 H", type: "national" },
  "2025-08-17": { name: "Hari Proklamasi Kemerdekaan RI (HUT RI Ke-80)", type: "national" },
  "2025-09-05": { name: "Maulid Nabi Muhammad SAW", type: "national" },
  "2025-12-25": { name: "Hari Raya Natal", type: "national" },
  "2025-12-26": { name: "Cuti Bersama Hari Raya Natal", type: "joint_leave" },

  // === TAHUN 2026 ===
  "2026-01-01": { name: "Tahun Baru 2026 Masehi", type: "national" },
  "2026-01-16": { name: "Isra Mikraj Nabi Muhammad SAW", type: "national" },
  "2026-02-16": { name: "Cuti Bersama Tahun Baru Imlek", type: "joint_leave" },
  "2026-02-17": { name: "Tahun Baru Imlek 2577 Kongzili", type: "national" },
  "2026-03-18": { name: "Cuti Bersama Hari Suci Nyepi", type: "joint_leave" },
  "2026-03-19": { name: "Hari Suci Nyepi (Tahun Baru Saka 1948)", type: "national" },
  "2026-03-20": { name: "Cuti Bersama Idul Fitri 1447 H", type: "joint_leave" },
  "2026-03-21": { name: "Hari Raya Idul Fitri 1447 H", type: "national" },
  "2026-03-22": { name: "Hari Raya Idul Fitri 1447 H", type: "national" },
  "2026-03-23": { name: "Cuti Bersama Idul Fitri 1447 H", type: "joint_leave" },
  "2026-03-24": { name: "Cuti Bersama Idul Fitri 1447 H", type: "joint_leave" },
  "2026-04-03": { name: "Wafat Yesus Kristus", type: "national" },
  "2026-04-05": { name: "Kebangkitan Yesus Kristus (Paskah)", type: "national" },
  "2026-05-01": { name: "Hari Buruh Internasional", type: "national" },
  "2026-05-14": { name: "Kenaikan Yesus Kristus", type: "national" },
  "2026-05-15": { name: "Cuti Bersama Kenaikan Yesus Kristus", type: "joint_leave" },
  "2026-05-27": { name: "Hari Raya Idul Adha 1447 H", type: "national" },
  "2026-05-28": { name: "Cuti Bersama Idul Adha 1447 H", type: "joint_leave" },
  "2026-05-31": { name: "Hari Raya Waisak 2570 BE", type: "national" },
  "2026-06-01": { name: "Hari Lahir Pancasila", type: "national" },
  "2026-06-16": { name: "Tahun Baru Islam 1448 H", type: "national" },
  "2026-08-17": { name: "Hari Proklamasi Kemerdekaan RI", type: "national" },
  "2026-08-25": { name: "Maulid Nabi Muhammad SAW", type: "national" },
  "2026-12-24": { name: "Cuti Bersama Hari Raya Natal", type: "joint_leave" },
  "2026-12-25": { name: "Hari Raya Natal", type: "national" },

  // === TAHUN 2027 ===
  "2027-01-01": { name: "Tahun Baru 2027 Masehi", type: "national" },
  "2027-02-05": { name: "Isra Mikraj Nabi Muhammad SAW", type: "national" },
  "2027-02-06": { name: "Tahun Baru Imlek 2578 Kongzili", type: "national" },
  "2027-03-09": { name: "Hari Suci Nyepi (Tahun Baru Saka 1949)", type: "national" },
  "2027-03-10": { name: "Hari Raya Idul Fitri 1448 H", type: "national" },
  "2027-03-11": { name: "Hari Raya Idul Fitri 1448 H", type: "national" },
  "2027-03-26": { name: "Wafat Yesus Kristus", type: "national" },
  "2027-03-28": { name: "Kebangkitan Yesus Kristus (Paskah)", type: "national" },
  "2027-05-01": { name: "Hari Buruh Internasional", type: "national" },
  "2027-05-06": { name: "Kenaikan Yesus Kristus", type: "national" },
  "2027-05-16": { name: "Hari Raya Idul Adha 1448 H", type: "national" },
  "2027-05-20": { name: "Hari Raya Waisak 2571 BE", type: "national" },
  "2027-06-01": { name: "Hari Lahir Pancasila", type: "national" },
  "2027-06-06": { name: "Tahun Baru Islam 1449 H", type: "national" },
  "2027-08-14": { name: "Maulid Nabi Muhammad SAW", type: "national" },
  "2027-08-17": { name: "Hari Proklamasi Kemerdekaan RI", type: "national" },
  "2027-12-25": { name: "Hari Raya Natal", type: "national" }
};

// Fixed annual national holidays (applies to any year)
const FIXED_ANNUAL_HOLIDAYS = {
  "01-01": "Tahun Baru Masehi",
  "05-01": "Hari Buruh Internasional",
  "06-01": "Hari Lahir Pancasila",
  "08-17": "Hari Proklamasi Kemerdekaan RI",
  "12-25": "Hari Raya Natal"
};

// In-memory merged registry
let dynamicHolidays = { ...BASE_HOLIDAYS };

// Load cache from localStorage if available (browser environment)
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const cached = localStorage.getItem('id_holidays_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      dynamicHolidays = { ...BASE_HOLIDAYS, ...parsed };
    }
  } catch {
    // Ignore storage parse error
  }
}

/**
 * Format Date to yyyy-MM-dd
 */
export const toDateKey = (dateInput) => {
  if (!dateInput) return '';
  if (typeof dateInput === 'string') {
    return dateInput.substring(0, 10);
  }
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, '0');
    const d = String(dateInput.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return '';
};

/**
 * Mengambil informasi hari libur nasional / cuti bersama Indonesia
 * @param {string|Date} dateInput Format 'YYYY-MM-DD' atau objek Date
 * @returns {{ isHoliday: boolean, name: string, type: 'national' | 'joint_leave', isJointLeave: boolean } | null}
 */
export const getHolidayInfo = (dateInput) => {
  const key = toDateKey(dateInput);
  if (!key || key.length !== 10) return null;

  // 1. Cek dari database utama/dinamis
  if (dynamicHolidays[key]) {
    const item = dynamicHolidays[key];
    return {
      isHoliday: true,
      name: item.name,
      type: item.type || 'national',
      isJointLeave: item.type === 'joint_leave'
    };
  }

  // 2. Cek hari libur nasional tanggal tetap tahunan (misal 1 Jan, 1 Mei, 1 Jun, 17 Ags, 25 Des)
  const monthDay = key.substring(5); // "MM-DD"
  if (FIXED_ANNUAL_HOLIDAYS[monthDay]) {
    return {
      isHoliday: true,
      name: FIXED_ANNUAL_HOLIDAYS[monthDay],
      type: 'national',
      isJointLeave: false
    };
  }

  return null;
};

/**
 * Memeriksa apakah tanggal merupakan 'Tanggal Merah' di Indonesia
 * (Hari Minggu ATAU Hari Libur Nasional / Cuti Bersama)
 * @param {string|Date} dateInput
 * @returns {boolean}
 */
export const isTanggalMerah = (dateInput) => {
  if (!dateInput) return false;
  let d;
  if (typeof dateInput === 'string') {
    d = new Date(dateInput.substring(0, 10) + 'T00:00:00');
  } else if (dateInput instanceof Date) {
    d = dateInput;
  }
  if (!d || isNaN(d)) return false;

  // Hari Minggu selalu Tanggal Merah
  if (d.getDay() === 0) return true;

  // Cek Hari Libur Nasional
  return Boolean(getHolidayInfo(dateInput));
};

/**
 * Sync background dengan Google Calendar Indonesia API (non-blocking)
 */
export const syncIndonesianCalendarOnline = async () => {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('https://raw.githubusercontent.com/guangrei/APIHariLibur_V2/main/calendar.json');
    if (!res.ok) return;
    const data = await res.json();
    
    const formatted = {};
    Object.entries(data).forEach(([dateStr, val]) => {
      if (val && val.holiday && val.summary && val.summary[0]) {
        const summary = val.summary[0];
        const isJoint = summary.toLowerCase().includes('cuti bersama');
        formatted[dateStr] = {
          name: summary,
          type: isJoint ? 'joint_leave' : 'national'
        };
      }
    });

    dynamicHolidays = { ...dynamicHolidays, ...formatted };
    if (window.localStorage) {
      localStorage.setItem('id_holidays_cache', JSON.stringify(formatted));
    }
  } catch {
    // Fail silently, offline fallback is 100% active
  }
};

// Jalankan sync background secara berkala jika di browser
if (typeof window !== 'undefined') {
  setTimeout(syncIndonesianCalendarOnline, 3000);
}
