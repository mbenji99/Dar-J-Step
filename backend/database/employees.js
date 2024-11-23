const db = require('../config/db');

// Fetch all employees
const getAllEmployees = (callback) => {
    db.query('SELECT * FROM employees', callback);
};

// Add a new employee
const addEmployee = (name, callback) => {
    db.query('INSERT INTO employees (name) VALUES (?)', [name], callback);
};

module.exports = { getAllEmployees, addEmployee };
