const db = require('../config/db');

// Add a new schedule
const addSchedule = (employeeId, date, shiftDetails, callback) => {
    db.query(
        'INSERT INTO schedules (employee_id, date, shift_details) VALUES (?, ?, ?)',
        [employeeId, date, shiftDetails],
        callback
    );
};

// Get all schedules
const getAllSchedules = (callback) => {
    db.query('SELECT * FROM schedules', callback);
};

// Get a schedule by ID
const getScheduleById = (scheduleId, callback) => {
    db.query('SELECT * FROM schedules WHERE schedule_id = ?', [scheduleId], callback);
};

// Delete a schedule
const deleteSchedule = (scheduleId, callback) => {
    db.query('DELETE FROM schedules WHERE schedule_id = ?', [scheduleId], callback);
};

module.exports = { addSchedule, getAllSchedules, getScheduleById, deleteSchedule };
