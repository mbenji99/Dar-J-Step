const bcrypt = require('bcryptjs'); 
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '061502kp',
    database: 'attendance_system'
});

db.connect(async (err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database.');

    try {
        // Manager details
        const manager_id = 1;
        const managerPassword = 'password123'; // Change as needed
        const hashedManagerPassword = await bcrypt.hash(managerPassword, 10);

        // Employee details
        const employee_id = 1001;
        const employeePassword = 'employee456'; // Change as needed
        const hashedEmployeePassword = await bcrypt.hash(employeePassword, 10);

        // Insert Manager
        db.query('INSERT INTO managers (manager_id, employee_name, password) VALUES (?, ?, ?)',
            [manager_id, 'Admin User', hashedManagerPassword],
            (error, results) => {
                if (error) {
                    console.error('Error inserting manager:', error);
                } else {
                    console.log('Manager added successfully.');
                }
            }
        );

        // Insert Employee
        db.query('INSERT INTO employees (employee_id, name, email, password, role, department) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, 'John Doe', 'john.doe@example.com', hashedEmployeePassword, 'employee', 'HR'],
            (error, results) => {
                if (error) {
                    console.error('Error inserting employee:', error);
                } else {
                    console.log('Employee added successfully.');
                }
                db.end();
            }
        );

    } catch (error) {
        console.error('Error hashing passwords:', error);
        db.end();
    }
});
