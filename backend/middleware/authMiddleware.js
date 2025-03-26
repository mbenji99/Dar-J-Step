const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Manager Login Middleware with bcrypt
exports.verifyManagerLogin = (req, res, next) => {
  const manager_id = req.body.manager_id || req.query.manager_id || req.headers['manager-id'];
  const password = req.body.password || req.query.password || req.headers['password1'];

  if (!manager_id || !password) {
    return res.status(401).json({ error: 'Authentication required: Missing credentials.' });
  }

  db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error while verifying credentials.' });
    if (results.length === 0) return res.status(403).json({ error: 'Invalid manager ID.' });

    const manager = results[0];

    // ✅ Compare hashed password
    bcrypt.compare(password, manager.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Password check failed.' });
      if (!isMatch) return res.status(403).json({ error: 'Invalid manager credentials.' });

      // Authenticated
      req.manager = manager;
      next();
    });
  });
};

// ✅ Employee Login Middleware with bcrypt
exports.verifyEmployeeLogin = (req, res, next) => {
  const employee_id = req.body.employee_id || req.query.employee_id || req.headers['employee-id'];
  const password = req.body.password || req.query.password || req.headers['password'];

  if (!employee_id || !password) {
    return res.status(401).json({ error: 'Authentication required: Missing credentials.' });
  }

  db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error while verifying credentials.' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid employee ID.' });

    const employee = results[0];

    // ✅ Compare hashed password
    bcrypt.compare(password, employee.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Password check failed.' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid employee credentials.' });

      req.employee = employee;
      next();
    });
  });
};

// ✅ Optional Passport Middleware
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'You need to log in first.' });
};
