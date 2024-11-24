const db = require('./backend/config/db');

// Test connection and fetch all employees
db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
        console.error('Error testing database connection:', err.message);
        return;
    }
    console.log('Employees:', results);
    db.end(); // Close the connection
});
