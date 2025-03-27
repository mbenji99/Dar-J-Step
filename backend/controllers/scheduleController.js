const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Create schedule by copying shifts for employee
exports.createSchedule = (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const query = 'SELECT * FROM shifts WHERE employee_id = ? ORDER BY shift_date, start_time';
  db.query(query, [employee_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching shifts' });
    if (results.length === 0) return res.status(404).json({ error: 'No shifts found for this employee' });

    const insertQuery = 'INSERT INTO schedules (employee_id, shift_date, start_time, end_time) VALUES ?';
    const values = results.map(r => [employee_id, r.shift_date, r.start_time, r.end_time]);

    db.query(insertQuery, [values], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to insert schedule' });
      res.status(201).json({ message: 'Schedule created successfully' });
    });
  });
};

// ✅ Get all schedules (grouped by employee)
exports.getAllSchedules = (req, res) => {
  const query = `
    SELECT s.schedule_id, s.employee_id, e.employee_name, s.shift_date, s.start_time, s.end_time
    FROM schedules s
    JOIN employees e ON s.employee_id = e.employee_id
    ORDER BY s.employee_id, s.shift_date, s.start_time
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching schedules' });

    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.employee_id]) {
        grouped[row.employee_id] = {
          employee_name: row.employee_name,
          schedule: []
        };
      }
      grouped[row.employee_id].schedule.push({
        date: new Date(row.shift_date).toLocaleDateString(),
        start_time: row.start_time,
        end_time: row.end_time,
        day_of_week: new Date(row.shift_date).toLocaleString('en-US', { weekday: 'long' })
      });
    });

    res.status(200).json({ schedules: grouped });
  });
};

// ✅ View schedule for a specific employee or manager
exports.viewSchedule = (req, res) => {
  const employee_id = req.query.employee_id || req.body.employee_id || req.headers['employee-id'];
  const password = req.query.password || req.body.password || req.headers['password'];
  const manager_id = req.query.manager_id || req.body.manager_id || req.headers['manager-id'];

  if (employee_id && password) {
    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.length === 0) return res.status(404).json({ error: 'Employee not found' });

      const employee = result[0];
      bcrypt.compare(password, employee.password, (err, isMatch) => {
        if (err || !isMatch) return res.status(401).json({ error: 'Incorrect password' });

        db.query('SELECT * FROM shifts WHERE employee_id = ? ORDER BY shift_date, start_time', [employee_id], (err, results) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch schedule' });

          const formatted = results.map(s => ({
            ...s,
            day_of_week: new Date(s.shift_date).toLocaleString('en-US', { weekday: 'long' }),
            formatted_date: new Date(s.shift_date).toLocaleDateString('en-US')
          }));

          res.status(200).json({ message: 'Schedule retrieved successfully', schedule: formatted });
        });
      });
    });
  } else if (manager_id) {
    db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (result.length === 0) return res.status(404).json({ error: 'Manager not found' });

      db.query('SELECT * FROM shifts ORDER BY shift_date, start_time', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch schedule' });

        const formatted = results.map(s => ({
          ...s,
          day_of_week: new Date(s.shift_date).toLocaleString('en-US', { weekday: 'long' }),
          formatted_date: new Date(s.shift_date).toLocaleDateString('en-US')
        }));

        res.status(200).json({ message: 'Schedule retrieved successfully', schedule: formatted });
      });
    });
  } else {
    return res.status(400).json({ error: 'Employee or Manager credentials required' });
  }
};

// ✅ Edit schedule (edit shift details)
exports.editSchedule = (req, res) => {
  const { shift_id, shift_date, start_time, end_time } = req.body;

  if (!shift_id || !shift_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    UPDATE shifts SET shift_date = ?, start_time = ?, end_time = ?
    WHERE shift_id = ?
  `;

  db.query(query, [shift_date, start_time, end_time, shift_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Shift not found' });

    res.status(200).json({ message: 'Schedule updated' });
  });
};

// ✅ Delete all schedules for an employee
exports.deleteSchedule = (req, res) => {
  const employee_id = req.params.id;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  db.query('DELETE FROM schedules WHERE employee_id = ?', [employee_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ message: 'Schedule deleted successfully' });
  });
};

// Placeholder (not implemented)
exports.getScheduleById = undefined;
exports.assignShiftToDay = undefined;
