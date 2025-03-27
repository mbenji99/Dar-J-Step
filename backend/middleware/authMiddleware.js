const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Manager Middleware
const verifyManagerLogin = (req, res, next) => {
  const manager_id = req.headers['manager-id'] || req.body.manager_id || req.query.manager_id;
  const password = req.headers['password1'] || req.body.password || req.query.password;

  console.log("🛂 Manager Auth Attempt:", { manager_id, password });

  if (!manager_id || !password) {
    return res.status(401).json({ error: 'Missing manager credentials.' });
  }

  db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error.' });
    if (results.length === 0) return res.status(403).json({ error: 'Manager not found.' });

    const manager = results[0];
    bcrypt.compare(password, manager.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Password error' });
      if (!isMatch) return res.status(403).json({ error: 'Invalid password' });

      req.manager = manager;
      next();
    });
  });
};

// ✅ Employee Middleware
const verifyEmployeeLogin = (req, res, next) => {
  const employee_id = req.headers['employee-id'] || req.body.employee_id || req.query.employee_id;
  const password = req.headers['password'] || req.body.password || req.query.password;

  console.log("🛂 Employee Auth Attempt:", { employee_id, password });

  if (!employee_id || !password) {
    return res.status(401).json({ error: 'Missing employee credentials.' });
  }

  db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error.' });
    if (results.length === 0) return res.status(401).json({ error: 'Employee not found.' });

    const employee = results[0];
    bcrypt.compare(password, employee.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Password error' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

      req.employee = employee;
      next();
    });
  });
};

// ✅ Export them correctly
module.exports = {
  verifyManagerLogin,
  verifyEmployeeLogin,
};
