// loginRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Manual login route for managers
router.post('/login/manager', (req, res, next) => {
  passport.authenticate('manager-local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid manager credentials.' });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Send JSON with manager ID to frontend
      res.status(200).json({
        message: 'Manager login successful',
        user: {
          manager_id: user.manager_id
        }
      });
    });
  })(req, res, next);
});

// Manual login route for employees
router.post('/login/employee', (req, res, next) => {
  passport.authenticate('employee-local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid employee credentials.' });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Send JSON with employee ID to frontend
      res.status(200).json({
        message: 'Employee login successful',
        user: {
          employee_id: user.employee_id
        }
      });
    });
  })(req, res, next);
});

// Logout route
router.post('/logout', loginController.logout);

module.exports = router;
