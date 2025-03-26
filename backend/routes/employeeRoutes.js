const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const shiftController = require('../controllers/shiftController');
const scheduleController = require('../controllers/scheduleController');
const { verifyEmployeeLogin } = require('../middleware/authMiddleware');

console.log("Loaded employeeController:", employeeController); // 🧪 Confirm functions are loaded

// Clock in route
router.post('/clock-in', verifyEmployeeLogin, employeeController.clockIn);

// Clock out route
router.post('/clock-out', verifyEmployeeLogin, employeeController.clockOut);

// View shift route
router.get('/view-shift', verifyEmployeeLogin, shiftController.viewShifts);

// View schedule route
router.get('/view-schedule', verifyEmployeeLogin, scheduleController.viewSchedule);

module.exports = router;
