const db = require('../config/db');
const shiftController = require('./shiftController'); // Not used directly here, but kept for future expansion

// Clock In
exports.clockIn = (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) return res.status(400).json({ error: 'Employee ID is required.' });

  const clockInTime = new Date();

  const query = `
    INSERT INTO clock_in_out_logs (employee_id, clock_in_time)
    VALUES (?, ?)
  `;

  db.query(query, [employee_id, clockInTime], (err) => {
    if (err) return res.status(500).json({ error: 'Clock-in failed.' });

    res.status(200).json({
      message: 'Clock-in successful',
      timestamp: clockInTime,
    });
  });
};

// Clock Out
exports.clockOut = (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) return res.status(400).json({ error: 'Employee ID is required.' });

  const clockOutTime = new Date();

  const query = `
    UPDATE clock_in_out_logs
    SET clock_out_time = ?
    WHERE employee_id = ? AND clock_out_time IS NULL
  `;

  db.query(query, [clockOutTime, employee_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Clock-out failed.' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No active clock-in found.' });
    }

    res.status(200).json({
      message: 'Clock-out successful',
      timestamp: clockOutTime,
    });
  });
};

//Check Clock-In Status
exports.checkClockStatus = (req, res) => {
  const { employee_id } = req.employee;

  const query = `
    SELECT * FROM clock_in_out_logs
    WHERE employee_id = ? AND clock_out_time IS NULL
    ORDER BY clock_in_time DESC LIMIT 1
  `;

  db.query(query, [employee_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error checking clock status.' });

    const isClockedIn = results.length > 0;
    res.status(200).json({ clockedIn: isClockedIn });
  });
};

//View Employee's Shifts
exports.viewShift = (req, res) => {
    const { employee_id } = req.query;

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    const query = `
        SELECT shift_id, shift_date, start_time, end_time
        FROM shifts
        WHERE employee_id = ?
        ORDER BY shift_date, start_time
    `;

    db.query(query, [employee_id], (err, results) => {
        if (err) {
            console.error('Error fetching shifts:', err);
            return res.status(500).json({ error: 'Failed to fetch shifts' });
        }

        const formattedShifts = results.map(shift => {
            const shiftDate = new Date(shift.shift_date);
            return {
                ...shift,
                formatted_date: shiftDate.toLocaleDateString('en-US'),
                day_of_week: shiftDate.toLocaleString('en-US', { weekday: 'long' }),
            };
        });

        res.status(200).json({
            message: 'Shifts retrieved successfully',
            shifts: formattedShifts,
        });
    });
};

//View Employee's Schedule
exports.viewSchedule = (req, res) => {
    const { employee_id } = req.query;

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required to view the schedule.' });
    }

    const query = `
        SELECT * FROM schedules
        WHERE employee_id = ?
    `;

    db.query(query, [employee_id], (err, results) => {
        if (err) {
            console.error('Error fetching schedule:', err);
            return res.status(500).json({ error: 'Failed to fetch schedule.' });
        }

        res.status(200).json({
            message: 'Schedule retrieved successfully',
            schedule: results,
        });
    });
};
module.exports = {
    clockIn: exports.clockIn,
    clockOut: exports.clockOut,
    viewShift: exports.viewShift,
    viewSchedule: exports.viewSchedule
  };
  
  