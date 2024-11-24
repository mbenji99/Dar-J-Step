const db = require('../config/db');

// Log clock-in
const logClockIn = (employeeId, clockInTime, callback) => {
    db.query(
        'INSERT INTO clock_in_out_logs (employee_id, clock_in_time) VALUES (?, ?)',
        [employeeId, clockInTime],
        callback
    );
};

// Log clock-out
const logClockOut = (logId, clockOutTime, callback) => {
    db.query(
        'UPDATE clock_in_out_logs SET clock_out_time = ? WHERE log_id = ?',
        [clockOutTime, logId],
        callback
    );
};

// Find the most recent clock-in record without clock-out
const findActiveClockIn = (employeeId, callback) => {
    db.query(
        'SELECT * FROM clock_in_out_logs WHERE employee_id = ? AND clock_out_time IS NULL ORDER BY clock_in_time DESC LIMIT 1',
        [employeeId],
        callback
    );
};

module.exports = { logClockIn, logClockOut, findActiveClockIn };