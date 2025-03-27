const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const shiftController = require('../controllers/shiftController');
const scheduleController = require('../controllers/scheduleController');
const { verifyEmployeeLogin } = require('../middleware/authMiddleware');
const db = require('../config/db');

console.log("✅ Loaded employeeController and routes");

// ✅ Clock in
router.post('/clock-in', verifyEmployeeLogin, employeeController.clockIn);

// ✅ Clock out
router.post('/clock-out', verifyEmployeeLogin, employeeController.clockOut);

// ✅ Clock status check
router.post('/clock-status', verifyEmployeeLogin, (req, res) => {
  const employee = req.employee;

  db.query(
    `SELECT * FROM clock_in_out_logs 
     WHERE employee_id = ? AND clock_out_time IS NULL 
     ORDER BY clock_in_time DESC LIMIT 1`,
    [employee.employee_id],
    (err, results) => {
      if (err) {
        console.error('❌ Error checking clock status:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      const isClockedIn = results.length > 0;
      res.json({ clockedIn: isClockedIn });
    }
  );
});

// ✅ View shifts
router.get('/view-shift', verifyEmployeeLogin, shiftController.viewShifts);

// ✅ View schedule
router.get('/view-schedule', verifyEmployeeLogin, scheduleController.viewSchedule);

module.exports = router;
