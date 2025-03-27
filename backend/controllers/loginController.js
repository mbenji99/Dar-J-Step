const bcrypt = require('bcrypt'); // ✅ Use the proper bcrypt
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '061502kp',
  database: 'attendance_system',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to database.');
  }
});

// Manager login
exports.managerLogin = (req, res) => {
  const { manager_id, password } = req.body;

  if (!manager_id || !password) {
    return res.status(400).json({ error: 'Manager ID and password are required.' });
  }

  db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error during manager authentication.' });
    if (results.length === 0) return res.status(401).json({ error: 'Manager not found.' });

    const manager = results[0];
    console.log("Manager login attempt:", { manager_id, password });
    console.log("Stored hash:", manager.password);

    const isMatch = await bcrypt.compare(password, manager.password);
    console.log("Password match:", isMatch);

    if (!isMatch) return res.status(401).json({ error: 'Incorrect password.' });

    res.status(200).json({ message: 'Manager login successful.', user: manager });
  });
};

// Employee login
exports.employeeLogin = (req, res) => {
    const { employee_id, password } = req.body;
  
    console.log("Login attempt:", { employee_id, password });
  
    if (!employee_id || !password) {
      return res.status(400).json({ error: 'Employee ID and password are required.' });
    }
  
    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], async (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: 'Database error during login.' });
      }
  
      if (results.length === 0) {
        console.warn("No employee found.");
        return res.status(401).json({ error: 'Employee not found.' });
      }
  
      const employee = results[0];
      console.log("Stored Hash:", employee.password);
  
      try {
        const isMatch = await bcrypt.compare(password, employee.password);
        console.log("Password match result:", isMatch);
  
        if (!isMatch) {
          return res.status(401).json({ error: 'Incorrect password.' });
        }
  
        res.status(200).json({ message: 'Employee login successful.', user: employee });
      } catch (error) {
        console.error("Bcrypt error:", error);
        res.status(500).json({ error: 'Password verification failed.' });
      }
    });
  };
  // Logout route
  exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logged out. Please clear credentials from localStorage.' });
};
    