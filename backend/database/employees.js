const db = require('../config/db');

// Get all employees
const getAllEmployees = (callback) => {
    db.query('SELECT * FROM employees', callback);
};

// Add a new employee
const addEmployee = (name, callback) => {
    db.query('INSERT INTO employees (employee_name) VALUES (?)', [name], callback);
};

// Find employee by ID
const findEmployeeById = (employeeID, callback) => {
    db.query('SELECT * FROM employees WHERE employeeID = ?', [employeeID], callback);
};

module.exports = { getAllEmployees, addEmployee, findEmployeeById };
