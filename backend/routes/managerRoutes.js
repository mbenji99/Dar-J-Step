const ensureAuthenticated = require('../middleware/auth').ensureAuthenticated;
const checkRole = require('../middleware/auth').checkRole;
const express = require('express');
const router = express.Router();
const ManagerController = require('../controllers/managerController');

// Apply middleware to all manager routes to ensure only authenticated users with 
//the manager role can access them
router.use(ensureAuthenticated);
router.use(checkRole('Manager'));

// Now define your routes
router.post('/schedules', ManagerController.createSchedule);
router.get('/schedules', ManagerController.getAllSchedules);
router.post('/schedules', ManagerController.createSchedule);
router.get('/schedules', ManagerController.getAllSchedules);
router.get('/schedules/:id', ManagerController.getScheduleById);
router.put('/schedules/:id', ManagerController.editSchedule);
router.delete('/schedules/:id', ManagerController.deleteSchedule);
router.put('/schedules/:id/assign-day', ManagerController.assignShiftToDay);

module.exports = router;


