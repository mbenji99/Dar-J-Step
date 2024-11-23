const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shiftController");

// Define routes
router.get("/", shiftController.getAllShifts); // GET all shifts
router.get("/:id", shiftController.getShiftById); // GET a shift by ID
router.post("/", shiftController.createShift); // CREATE a new shift
router.put("/:id", shiftController.updateShift); // UPDATE a shift
router.delete("/:id", shiftController.deleteShift); // DELETE a shift

module.exports = router;
