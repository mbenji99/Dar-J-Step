const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// Define routes
router.put("/:id/:day", scheduleController.assignShiftToDay); // ASSIGN day of week to shift
router.get("/", scheduleController.getAllSchedules); // GET all schedules
router.get("/:id", scheduleController.getScheduleById); // GET a schedule by ID
router.post("/schedule", scheduleController.createSchedule); // CREATE a new schedule
router.put("/:id", scheduleController.editSchedule); // EDIT a schedule
router.delete("/:id", scheduleController.deleteSchedule); // DELETE a schedule

module.exports = router;
