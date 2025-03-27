const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Create Shift (Manager only)
exports.createShift = (req, res) => {
  const manager_id = req.headers['manager-id'];
  const password = req.headers['password1'];
  const { employee_id, shift_date, start_time, end_time } = req.body;

  if (!manager_id || !password) {
    return res.status(401).json({ error: 'Authentication required: Missing credentials.' });
  }

  if (!employee_id || !shift_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }

  db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });
    if (result.length === 0) return res.status(404).json({ error: 'Manager not found' });

    const manager = result[0];

    bcrypt.compare(password, manager.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Password verification failed' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid manager credentials.' });

      const checkQuery = `SELECT * FROM shifts WHERE employee_id = ? AND shift_date = ?`;
      db.query(checkQuery, [employee_id, shift_date], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (result.length > 0) {
          return res.status(409).json({ error: 'Employee already has a shift on this date' });
        }

        const insertQuery = `INSERT INTO shifts (employee_id, shift_date, start_time, end_time) VALUES (?, ?, ?, ?)`;
        db.query(insertQuery, [employee_id, shift_date, start_time, end_time], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to create shift' });
          res.status(201).json({ message: 'Shift created successfully' });
        });
      });
    });
  });
};

// ✅ View Shifts (Employee or Manager)
exports.viewShifts = (req, res) => {
  const employee_id = req.query.employee_id || req.body.employee_id || req.headers['employee-id'];
  const password = req.query.password || req.body.password || req.headers['password'];
  const manager_id = req.query.manager_id || req.body.manager_id || req.headers['manager-id'];

  // Employee view
  if (employee_id && password) {
    console.log("🔍 ShiftController.viewShifts called");
    console.log("Employee ID:", employee_id);
    console.log("Password:", password);
    console.log("Request Query:", req.query);
    console.log("Request Body:", req.body);
    console.log("Request Headers:", req.headers);

    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error while verifying employee.' });
      if (result.length === 0) return res.status(404).json({ error: 'Employee not found.' });

      const employee = result[0];

      bcrypt.compare(password, employee.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: 'Password check failed.' });
        if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

        db.query('SELECT * FROM shifts WHERE employee_id = ?', [employee_id], (err, results) => {
          if (err) {
            console.error("❌ Shift DB fetch error:", err);
            return res.status(500).json({ error: 'Failed to fetch shifts' });
          }
          const formattedShifts = results.map(shift => ({
            ...shift,
            day_of_week: new Date(shift.shift_date).toLocaleString('en-US', { weekday: 'long' }),
            formatted_date: new Date(shift.shift_date).toLocaleDateString('en-US'),
          }));

          res.status(200).json({ message: 'Shifts retrieved successfully', shifts: formattedShifts });
        });
      });
    });

  // Manager view
  } else if (manager_id) {
    db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });
      if (result.length === 0) return res.status(404).json({ error: 'Manager not found' });

      db.query('SELECT * FROM shifts', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch shifts' });

        const formattedShifts = results.map(shift => ({
          ...shift,
          day_of_week: new Date(shift.shift_date).toLocaleString('en-US', { weekday: 'long' }),
          formatted_date: new Date(shift.shift_date).toLocaleDateString('en-US'),
        }));

        res.status(200).json({ message: 'Shifts retrieved successfully', shifts: formattedShifts });
      });
    });
  } else {
    return res.status(400).json({ error: 'Missing required credentials' });
  }
};

// ✅ Edit Shift
exports.editShift = (req, res) => {
  const shift_id = req.params.shift_id;
  const { shift_date, start_time, end_time } = req.body;

  if (!shift_id || !shift_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const updateQuery = `
    UPDATE shifts SET shift_date = ?, start_time = ?, end_time = ?
    WHERE shift_id = ?
  `;

  db.query(updateQuery, [shift_date, start_time, end_time, shift_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update shift' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    res.status(200).json({ message: 'Shift updated successfully' });
  });
};

// ✅ Delete Shift
exports.deleteShift = (req, res) => {
  const shift_id = req.params.shift_id;

  if (!shift_id) {
    return res.status(400).json({ error: 'Shift ID is required' });
  }

  const deleteQuery = 'DELETE FROM shifts WHERE shift_id = ?';

  db.query(deleteQuery, [shift_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete shift' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    res.status(200).json({ message: 'Shift deleted successfully' });
  });
};
