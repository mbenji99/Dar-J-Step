const express = require('express');
const router =  express.Router();
const shiftController = require('../controllers/shiftController');

router.post('/create-shift',shiftController.createShift);
router.get('/view-shifts',shiftController.viewShifts);

module.exports = router;
