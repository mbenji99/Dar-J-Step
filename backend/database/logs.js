const db = require('../config/db');

// Add a clock-in or clock-out log
const addLog = (employeeId, actionType, callback) => {
    db.query('INSERT INTO logs (employee_id, action_type) VALUES (?, ?)', [employeeId, actionType], callback);
};

module.exports = { addLog };
