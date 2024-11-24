// controllers/createShift.js
const db = require('../config/db'); // Database connection

exports.createShift = (req, res) => {
    const { employee_id, shift_date, start_time, end_time } = req.body;

    // Validate required fields
    if (!employee_id || !shift_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure end_time is after start_time
    if (new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)) {
        return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Log inputs for debugging
    console.log('Received shift data:', { employee_id, shift_date, start_time, end_time });

    // Check for overlapping shifts
    const overlapQuery = `
        SELECT * FROM shifts 
        WHERE employee_id = ? 
        AND shift_date = ?
        AND (
            (start_time <= ? AND end_time > ?) OR
            (start_time < ? AND end_time >= ?)
        )
    `;

    db.query(
        overlapQuery,
        [employee_id, shift_date, start_time, start_time, end_time, end_time],
        (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            // Debug overlap query result
            console.log('Overlap query result:', result);

            if (result.length > 0) {
                console.log('Shift overlap detected:', result);
                return res.status(409).json({ error: 'Shift overlaps with an existing shift' });
            }

            // Insert the shift into the database
            const insertQuery = `
                INSERT INTO shifts (employee_id, shift_date, start_time, end_time)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [employee_id, shift_date, start_time, end_time],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting shift:', err);
                        return res.status(500).json({ error: 'Failed to create shift' });
                    }

                    console.log('Shift created successfully:', result);
                    return res.status(201).json({ message: 'Shift created successfully' });
                }
            );
        }
    );
};

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
exports.viewShifts = (req, res) => {
    const { employee_id, password } = req.body; // Require employee_id and password

    // Validate required fields
    if (!employee_id || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    // Query to validate employee credentials
    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = result[0];

        // Verify password
        if (employee.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Fetch shifts for the employee
        const query = 'SELECT * FROM shifts WHERE employee_id = ?';
        db.query(query, [employee_id], (err, results) => {
            if (err) {
                console.error('Error fetching shifts:', err);
                return res.status(500).json({ error: 'Failed to fetch shifts' });
            }

            // Format the results with day of the week
            const formattedShifts = results.map((shift) => {
                const shiftDate = new Date(shift.shift_date);
                const dayOfWeek = shiftDate.toLocaleString('en-US', { weekday: 'long' });

                return {
                    ...shift,
                    day_of_week: dayOfWeek,
                    formatted_date: shiftDate.toLocaleDateString('en-US'),
                };
            });

            return res.status(200).json({
                message: 'Shifts retrieved successfully',
                shifts: formattedShifts,
            });
        });
    });
};


exports.deleteShift = (req, res) => {
    const { shift_id } = req.params;

    if (!shift_id) {
        return res.status(400).json({ error: 'Shift ID is required' });
    }

    const deleteQuery = 'DELETE FROM shifts WHERE shift_id = ?';

    db.query(deleteQuery, [shift_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete shift' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        return res.status(200).json({ message: 'Shift deleted successfully' });
    });
};




