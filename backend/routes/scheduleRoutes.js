const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// Define routes
router.get("/", scheduleController.getAllSchedules);
router.get("/:id", scheduleController.viewSchedule); // DONE
router.post("/create-schedule", scheduleController.createSchedule); // DONE
router.put("/:id", scheduleController.editSchedule); // DONE
router.delete("/:id", scheduleController.deleteSchedule); // DONE

module.exports = router;
