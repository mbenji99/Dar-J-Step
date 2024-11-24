const ensureAuthenticated = require('../middleware/auth').ensureAuthenticated;
const checkRole = require('../middleware/auth').checkRole;

// Apply middleware to all manager routes to ensure only authenticated users with 
//the manager role can access them
router.use(ensureAuthenticated);
router.use(checkRole('Manager'));

// Now define your routes
router.post('/schedules', ManagerController.createSchedule);
router.get('/schedules', ManagerController.getAllSchedules);


