const db = require('../config/db');

// Add a new shift
const addShift = (shiftStart, shiftEnd, staffingNeeded, callback) => {
    db.query(
        'INSERT INTO shifts (shift_start, shift_end, staffing_needed) VALUES (?, ?, ?)',
        [shiftStart, shiftEnd, staffingNeeded],
        callback
    );
};

// Fetch all shifts
const getAllShifts = (callback) => {
    db.query('SELECT * FROM shifts', callback);
};

module.exports = { addShift, getAllShifts };

