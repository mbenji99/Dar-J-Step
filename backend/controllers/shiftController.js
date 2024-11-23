const Shift = require("../models/shift");

let shifts = []; // In-memory storage for now (use a database for production)

// Get all shifts
exports.getAllShifts = (req, res) => {
  res.status(200).json({ success: true, data: shifts });
};

// Get a shift by ID
exports.getShiftById = (req, res) => {
  const { id } = req.params;
  const shift = shifts.find((s) => s.shiftID === parseInt(id));
  if (!shift) {
    return res.status(404).json({ success: false, message: "Shift not found" });
  }
  res.status(200).json({ success: true, data: shift });
};

// Create a new shift
exports.createShift = (req, res) => {
  const { employee_id,shiftID, startTime, endTime} = req.body;
  const newShift = new Shift(employee_id,shiftID, startTime, endTime);
  shifts.push(newShift);
  res.status(201).json({ success: true, message: "Shift created", data: newShift });
};

// Edit a shift
exports.editShift = (req, res) => {
  const { id } = req.params;
  const { startTime, endTime } = req.body;
  const shift = shifts.find((s) => s.shiftID === parseInt(id));
  if (!shift) {
    return res.status(404).json({ success: false, message: "Shift not found" });
  }
  if (startTime) shift.startTime = startTime;
  if (endTime) shift.endTime = endTime;
  res.status(200).json({ success: true, message: "Shift updated", data: shift });
};

// Delete a shift
exports.deleteShift = (req, res) => {
  const { id } = req.params;
  const index = shifts.findIndex((s) => s.shiftID === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Shift not found" });
  }
  shifts.splice(index, 1);
  res.status(200).json({ success: true, message: "Shift deleted" });
};
