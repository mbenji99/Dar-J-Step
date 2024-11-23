// controllers/clockInController.js
const db = require('../config/db'); // Your database connection file

exports.clockIn = (req, res) => {
    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Validate employee_id format (e.g., must be numeric)
    const idPattern = /^[0-9]+$/;
    if (!idPattern.test(employee_id)) {
        return res.status(400).json({ error: 'Invalid Employee ID format' });
    }

    // Ensure the employee exists in the database (optional: Insert if missing)
    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed while checking employee.' });
        }

        if (result.length === 0) {
            // Optional: Add a new employee if not found (for testing purposes)
            db.query(
                'INSERT INTO employees (employee_id, employee_name) VALUES (?, ?)',
                [employee_id, 'Test Employee'],
                (insertErr) => {
                    if (insertErr) {
                        return res.status(500).json({ error: 'Failed to insert new employee for testing.' });
                    }
                    console.log(`Test employee with ID ${employee_id} added to database.`);
                }
            );

            return res.status(404).json({ error: 'Employee not found, but test employee has been added.' });
        }

        // Log the clock-in time
        const clockInTime = new Date();
        db.query(
            'INSERT INTO clock_in_out_logs (employee_id, clock_in_time) VALUES (?, ?)',
            [employee_id, clockInTime],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to log clock-in time' });
                }

                return res.status(200).json({
                    message: 'Clock-in successful',
                    clock_in_time: clockInTime,
                });
            }
        );
    });
};
