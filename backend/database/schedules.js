const db = require('../config/db');

// Add a new schedule
const addSchedule = (employeeId, shiftStart, shiftEnd, callback) => {
    db.query(
        'INSERT INTO schedules (employee_id, shift_start, shift_end) VALUES (?, ?, ?)',
        [employeeId, shiftStart, shiftEnd],
        callback
    );
};

// Fetch all schedules
const getAllSchedules = (callback) => {
    db.query('SELECT * FROM schedules', callback);
};

module.exports = { addSchedule, getAllSchedules };
