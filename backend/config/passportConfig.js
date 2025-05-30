const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');  // Add bcrypt for password hashing
const db = require('../config/db'); // Your database connection configuration

console.log('Passport local strategy configuration loaded.');

// Passport local strategy for manager authentication
passport.use('manager-local', new LocalStrategy({
    usernameField: 'manager_id',
    passwordField: 'password'
}, async (manager_id, password, done) => {
    try {
        const query = 'SELECT * FROM managers WHERE manager_id = ?';
        db.query(query, [manager_id], async (err, results) => {
            if (err) {
                return done(err);
            }
            if (results.length === 0) {
                return done(null, false, { message: 'Invalid manager credentials.' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);  // Compare hashed password
            if (!isMatch) {
                return done(null, false, { message: 'Invalid manager credentials.' });
            }

            user.role = 'manager'; // Add role to user object
            return done(null, user);
        });
    } catch (err) {
        return done(err);
    }
}));

// Passport local strategy for employee authentication
passport.use('employee-local', new LocalStrategy({
    usernameField: 'employee_id',
    passwordField: 'password'
}, async (employee_id, password, done) => {
    try {
        const query = 'SELECT * FROM employees WHERE employee_id = ?';
        db.query(query, [employee_id], async (err, results) => {
            if (err) {
                console.error('Database error during employee authentication:', err);
                return done(err);
            }
            if (results.length === 0) {
                console.warn('No employee found with these credentials.');
                return done(null, false, { message: 'Invalid employee credentials.' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);  // Compare hashed password
            if (!isMatch) {
                return done(null, false, { message: 'Invalid employee credentials.' });
            }

            user.role = 'employee'; // Add role to user object
            console.log(`Employee authenticated successfully: ${user.employee_id}`);
            return done(null, user);
        });
    } catch (err) {
        console.error('Error during employee authentication:', err);
        return done(err);
    }
}));

// Serialize user to store user information in session
passport.serializeUser((user, done) => {
    done(null, { id: user.manager_id || user.employee_id, role: user.role });
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
    const { id, role } = obj;
    console.log(`Deserializing user with ID: ${id} and Role: ${role}`);

    let query = '';
    if (role === 'manager') {
        query = 'SELECT * FROM managers WHERE manager_id = ?';
    } else if (role === 'employee') {
        query = 'SELECT * FROM employees WHERE employee_id = ?';
    } else {
        return done(new Error('Invalid role specified.'));
    }

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error during deserialization:', err);
            return done(err);
        }
        if (results.length === 0) {
            console.warn('No user found during deserialization.');
            return done(null, false);
        }

        const user = results[0];
        user.role = role;
        done(null, user);
    });
});

module.exports = passport;
