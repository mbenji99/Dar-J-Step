// controllers/ManagerController.js
const db = require('../config/db');
const shiftController = require('./shiftController');



exports.generateReport = (req, res) => {
    // Implementation for generating reports
    res.status(200).json({ message: 'Report generated successfully' });
};

exports.adjustClockInOut = (req, res) => {
    const { logID, new_clock_in_time, new_clock_out_time } = req.body;

    if (!logID) {
        return res.status(400).json({ error: 'Log ID is required for editing.' });
    }

    // Construct the update query
    let updateQuery = 'UPDATE clock_in_out_logs SET ';
    const updateParams = [];
    if (new_clock_in_time) {
        updateQuery += 'clock_in_time = ?, ';
        updateParams.push(new_clock_in_time);
    }
    if (new_clock_out_time) {
        updateQuery += 'clock_out_time = ?, ';
        updateParams.push(new_clock_out_time);
    }

    // Remove trailing comma
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE logID = ?';
    updateParams.push(logID);

    // Perform the update in the database
    db.query(updateQuery, updateParams, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while updating clock-in/out log' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No log found with the provided ID' });
        }
        return res.status(200).json({ message: 'Clock-in/out log updated successfully' });
    });
};

exports.manageSchedule = (req, res, next) => {
    switch (req.method) {
        case 'POST':
            // Check if this is an edit request or a creation request
            if (req.query.action === 'edit') {
                return shiftController.editShift(req, res);
            } else {
                return shiftController.createShift(req, res);
            }
        case 'DELETE':
            return shiftController.deleteShifts(req, res);
        default:
            res.status(405).json({ error: 'Method not allowed' });
            break;
    }
};

