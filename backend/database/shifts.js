const db = require('../config/db');

// Add a new shift
const addShift = (employeeId, shiftDate, startTime, endTime, role, callback) => {
    db.query(
        'INSERT INTO shifts (employee_id, shift_date, start_time, end_time, role) VALUES (?, ?, ?, ?, ?)',
        [employeeId, shiftDate, startTime, endTime, role],
        callback
    );
};

// Get all shifts
const getAllShifts = (callback) => {
    db.query('SELECT * FROM shifts', callback);
};

// Delete a shift
const deleteShift = (shiftId, callback) => {
    db.query('DELETE FROM shifts WHERE shift_id = ?', [shiftId], callback);
};

// Check for overlapping shifts
const checkShiftOverlap = (employeeId, shiftDate, startTime, endTime, callback) => {
    const overlapQuery = `
        SELECT * FROM shifts
        WHERE employee_id = ?
        AND shift_date = ?
        AND (
            (start_time <= ? AND end_time > ?)
            OR
            (start_time < ? AND end_time >= ?)
        )
    `;
    db.query(overlapQuery, [employeeId, shiftDate, startTime, startTime, endTime, endTime], callback);
};

module.exports = { addShift, getAllShifts, deleteShift, checkShiftOverlap };
