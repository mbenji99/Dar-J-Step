// routes/clockinroutes.js
const express = require('express');
const router = express.Router();
const clockInController = require('../controllers/clockin'); // Ensure this path is correct

// Define the POST route for clock-in
router.post('/clock-in', clockInController.clockIn);

module.exports = router;
