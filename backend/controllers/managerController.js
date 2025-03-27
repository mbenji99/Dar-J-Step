const db = require('../config/db');
const scheduleController = require('./scheduleController');
const shiftController = require('./shiftController');

//Generate a Report
exports.generateReport = (req, res) => {
    const { reportType, startDate, endDate } = req.query;

    if (!reportType || !startDate || !endDate) {
        return res.status(400).json({ error: 'Please provide reportType, startDate, and endDate' });
    }

    const query = `
        SELECT employee_id, employee_name, shift_date, start_time, end_time 
        FROM shifts
        WHERE shift_date BETWEEN ? AND ?
        ORDER BY employee_id, shift_date;
    `;

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error fetching report data:', err);
            return res.status(500).json({ error: 'Failed to generate report' });
        }

        //Structure report by employee
        const report = {};
        results.forEach((shift) => {
            if (!report[shift.employee_id]) {
                report[shift.employee_id] = {
                    employeeName: shift.employee_name,
                    shifts: []
                };
            }

            report[shift.employee_id].shifts.push({
                date: shift.shift_date,
                startTime: shift.start_time,
                endTime: shift.end_time
            });
        });

        res.status(200).json({
            message: 'Report generated successfully',
            reportType,
            startDate,
            endDate,
            report
        });
    });
};

//Adjust Clock-In/Out Times
exports.adjustClockInOut = (req, res) => {
    const { log_id, new_clock_in_time, new_clock_out_time } = req.body;

    if (!log_id) {
        return res.status(400).json({ error: 'Log ID is required for editing.' });
    }

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

    // Trim the final comma and complete the query
    updateQuery = updateQuery.slice(0, -2) + ' WHERE log_id = ?';
    updateParams.push(log_id);

    db.query(updateQuery, updateParams, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update clock-in/out log' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No log found with the provided ID' });
        }

        res.status(200).json({ message: 'Clock-in/out log updated successfully' });
    });
};

//Reuse ShiftController Methods
exports.createShift = shiftController.createShift;
exports.editShift = shiftController.editShift;
exports.deleteShift = shiftController.deleteShift;

//Generic Shift Management
exports.manageShift = (req, res) => {
    switch (req.method) {
        case 'POST':
            return req.query.action === 'edit'
                ? shiftController.editShift(req, res)
                : shiftController.createShift(req, res);
        case 'DELETE':
            return shiftController.deleteShift(req, res);
        default:
            res.status(405).json({ error: 'Method not allowed' });
    }
};

//Schedule Methods
exports.createSchedule = scheduleController.createSchedule;
exports.getAllSchedules = scheduleController.getAllSchedules;
exports.getScheduleById = scheduleController.getScheduleById;
exports.editSchedule = scheduleController.editSchedule;
exports.deleteSchedule = scheduleController.deleteSchedule;
exports.assignShiftToDay = scheduleController.assignShiftToDay;

//Generic Schedule Management
exports.manageSchedule = (req, res) => {
    const { action } = req.query;

    switch (req.method) {
        case 'POST':
            if (action === 'create') return scheduleController.createSchedule(req, res);
            if (action === 'edit') return scheduleController.editSchedule(req, res);
            return res.status(400).json({ error: 'Invalid action for managing schedule.' });
        case 'DELETE':
            return scheduleController.deleteSchedule(req, res);
        default:
            res.status(405).json({ error: 'Method not allowed' });
    }
};
console.log('Exports from managerController:', module.exports);
