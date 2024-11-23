const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// Define routes
router.get("/", scheduleController.getAllSchedules); // GET all schedules
router.get("/:id", scheduleController.getScheduleById); // GET a schedule by ID
router.post("/", scheduleController.createSchedule); // CREATE a schedule
router.put("/:id", scheduleController.updateSchedule); // UPDATE a schedule
router.delete("/:id", scheduleController.deleteSchedule); // DELETE a schedule

module.exports = router;
