// controllers/createShift.js
const db = require('../config/db'); // Database connection

exports.createShift = (req, res) => {
    const { employee_id, shift_date, start_time, end_time, role } = req.body;

    // Validate required fields
    if (!employee_id || !shift_date || !start_time || !end_time || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure end_time is after start_time
    if (new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)) {
        return res.status(400).json({ error: 'End time must be after start time' });
    }

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
                return res.status(500).json({ error: 'Database query failed' });
            }

            if (result.length > 0) {
                return res.status(409).json({ error: 'Shift overlaps with an existing shift' });
            }

            // Insert the shift into the database
            const insertQuery = `
                INSERT INTO shifts (employee_id, shift_date, start_time, end_time, role)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [employee_id, shift_date, start_time, end_time, role],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create shift' });
                    }

                    return res.status(201).json({ message: 'Shift created successfully' });
                }
            );
        }
    );
};

// View shifts function
exports.viewShifts = (req, res) => {
    const { employee_id } = req.query; // Use query parameters for filtering

    // Base query to fetch shifts
    let query = 'SELECT * FROM shifts';
    const params = [];

    // If employee_id is provided, filter by it
    if (employee_id) {
        query += ' WHERE employee_id = ?';
        params.push(employee_id);
    }

    // Execute the query
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching shifts:', err);
            return res.status(500).json({ error: 'Failed to fetch shifts' });
        }

        // Return the results
        return res.status(200).json({
            message: 'Shifts retrieved successfully',
            shifts: results,
        });
    });
};

//Add the delete shift function Steph
