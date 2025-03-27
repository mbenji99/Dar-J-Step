const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const shiftController = require('../controllers/shiftController');
const scheduleController = require('../controllers/scheduleController');
const { verifyManagerLogin } = require('../middleware/authMiddleware');
const passport = require('passport');

// Manager login route
router.get('/login', passport.authenticate('local', {
  successRedirect: '/api/manager/dashboard',
  failureRedirect: '/api/manager/login-failure',
  failureMessage: true,
}));

// Dashboard (simplified to always allow access for now)
router.get('/dashboard', (req, res) => {
  res.status(200).json({ message: 'Welcome to the manager dashboard.' });
});

// Reporting
router.get('/generate-report', verifyManagerLogin, managerController.generateReport);

// Adjust clock-in/out
router.put('/adjust-clockinout', verifyManagerLogin, managerController.adjustClockInOut);

// Shift management
router.post('/create-shift', verifyManagerLogin, shiftController.createShift);
router.put('/edit-shift/:shift_id', verifyManagerLogin, shiftController.editShift);
router.delete('/delete-shift/:shift_id', verifyManagerLogin, shiftController.deleteShift);
router.get('/view-shift', verifyManagerLogin, shiftController.viewShifts);

// Schedule management
router.get('/view-schedule', verifyManagerLogin, scheduleController.viewSchedule);

module.exports = router;
