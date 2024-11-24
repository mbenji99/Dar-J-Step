const db = require('../config/db');

// Add a clock-in or clock-out log
const addLog = (employeeID, actionType, callback) => {
    db.query('INSERT INTO logs (employeeID, action_type) VALUES (?, ?)', [employeeID, actionType], callback);
};

// Log clock-in
const logClockIn = (employeeID, clockInTime, callback) => {
    db.query(
        'INSERT INTO clock_in_out_logs (employeeID, clock_in_time) VALUES (?, ?)',
        [employeeID, clockInTime],
        callback
    );
};

// Log clock-out
const logClockOut = (logID, clockOutTime, callback) => {
    db.query(
        'UPDATE clock_in_out_logs SET clock_out_time = ? WHERE log_id = ?',
        [clockOutTime, logID],
        callback
    );
};

// Find the most recent clock-in record without clock-out
const findActiveClockIn = (employeeID, callback) => {
    db.query(
        'SELECT * FROM clock_in_out_logs WHERE employeeID = ? AND clock_out_time IS NULL ORDER BY clock_in_time DESC LIMIT 1',
        [employeeID],
        callback
    );
};


module.exports = { addLog, logClockIn, logClockOut, findActiveClockIn };