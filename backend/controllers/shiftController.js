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

//Deletes shift
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

//Edits Shift
exports.editShift = (req, res) => {
    const { shift_id, new_details } = req.body; // new_details should contain any of the shift details that can be edited
    if (!shift_id || !new_details) {
        return res.status(400).json({ error: 'Shift ID and new shift details are required' });
    }
    // Assuming new_details is an object with possible keys: employee_id, shift_date, start_time, end_time, role
    const { employee_id, shift_date, start_time, end_time, role } = new_details;
    
    // SQL to update shift details, checking if each field is provided to update it
    let updateQuery = 'UPDATE shifts SET ';
    let queryValues = [];
    let firstValue = true;
    if (employee_id) {
        updateQuery += 'employee_id = ?';
        queryValues.push(employee_id);
        firstValue = false;
    }
    if (shift_date) {
        updateQuery += (firstValue ? '' : ', ') + 'shift_date = ?';
        queryValues.push(shift_date);
        firstValue = false;
    }
    if (start_time) {
        updateQuery += (firstValue ? '' : ', ') + 'start_time = ?';
        queryValues.push(start_time);
        firstValue = false;
    }
    if (end_time) {
        updateQuery += (firstValue ? '' : ', ') + 'end_time = ?';
        queryValues.push(end_time);
        firstValue = false;
    }
    if (role) {
        updateQuery += (firstValue ? '' : ', ') + 'role = ?';
        queryValues.push(role);
    }
    updateQuery += ' WHERE shift_id = ?';
    queryValues.push(shift_id);

    db.query(updateQuery, queryValues, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        return res.status(200).json({ message: 'Shift edited successfully' });
    });
};
