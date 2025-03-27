const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const {
  verifyManagerLogin,
  verifyEmployeeLogin
} = require('../middleware/authMiddleware');

// Debug logs — to confirm middleware loaded
console.log("verifyManagerLogin type:", typeof verifyManagerLogin);
console.log("verifyEmployeeLogin type:", typeof verifyEmployeeLogin);

router.post('/login/manager', loginController.managerLogin);
router.post('/login/employee', loginController.employeeLogin);

router.get('/manager/dashboard', verifyManagerLogin, (req, res) => {
  res.status(200).json({ message: 'Manager dashboard loaded' });
});

router.get('/employee/dashboard', verifyEmployeeLogin, (req, res) => {
  res.status(200).json({ message: 'Employee dashboard loaded' });
});

module.exports = router;
