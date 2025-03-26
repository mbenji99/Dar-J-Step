const bcrypt = require('bcryptjs');
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '061502kp',
    database: 'attendance_system'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to database.');
    }
});

// Manager login function (manual authentication)
exports.managerLogin = (req, res) => {
    const { manager_id, password } = req.body;

    if (!manager_id || !password) {
        return res.status(400).json({ error: 'Manager ID and password are required.' });
    }

    db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error during manager authentication.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Manager not found.' });
        }

        const manager = results[0];
        const isMatch = await bcrypt.compare(password, manager.password);

        if (isMatch) {
            return res.status(200).json({ message: 'Manager login successful.', user: manager });
        } else {
            return res.status(401).json({ error: 'Incorrect password.' });
        }
    });
};

// Employee login function (manual authentication)
exports.employeeLogin = (req, res) => {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required.' });
    }

    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error during employee authentication.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Employee not found.' });
        }

        const employee = results[0];
        const isMatch = await bcrypt.compare(password, employee.password);

        if (isMatch) {
            return res.status(200).json({ message: 'Employee login successful.', user: employee });
        } else {
            return res.status(401).json({ error: 'Incorrect password.' });
        }
    });
};

// Logout function
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.status(200).json({ message: 'Logout successful.' });
    });
};
