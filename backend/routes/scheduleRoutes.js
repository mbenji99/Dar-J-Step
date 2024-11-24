const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// Define routes
router.put("/assign-shift-to-day", scheduleController.assignShiftToDay); // ASSIGN day of week to shift
router.get("/get-all-schedules", scheduleController.getAllSchedules); // GET all schedules
router.get("/get-schedule-by-id", scheduleController.getScheduleById); // GET a schedule by ID
router.post("/create-schedule", scheduleController.createSchedule); // CREATE a new schedule
router.put("/edit-schedule", scheduleController.editSchedule); // EDIT a schedule
router.delete("/delete-schedule", scheduleController.deleteSchedule); // DELETE a schedule

module.exports = router;
