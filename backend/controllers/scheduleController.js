// Import your Schedule model (if using one; otherwise use dummy data for now)
const schedules = []; // Temporary in-memory storage for schedules

// Controller functions
exports.getAllSchedules = (req, res) => {
  res.status(200).json({
    success: true,
    data: schedules,
  });
};

exports.getScheduleById = (req, res) => {
  const { id } = req.params;
  const schedule = schedules.find((sched) => sched.scheduleID === parseInt(id));
  if (!schedule) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }
  res.status(200).json({
    success: true,
    data: schedule,
  });
};

exports.createSchedule = (req, res) => {
  const { scheduleID, employeeID, shiftDetails, date } = req.body;
  const newSchedule = { scheduleID, employeeID, shiftDetails, date };
  schedules.push(newSchedule);
  res.status(201).json({
    success: true,
    message: "Schedule created successfully",
    data: newSchedule,
  });
};

exports.editSchedule = (req, res) => {
  const { id } = req.params;
  const { shiftDetails, date } = req.body;
  const schedule = schedules.find((sched) => sched.scheduleID === parseInt(id));
  if (!schedule) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }
  schedule.shiftDetails = shiftDetails || schedule.shiftDetails;
  schedule.date = date || schedule.date;
  res.status(200).json({
    success: true,
    message: "Schedule updated successfully",
    data: schedule,
  });
};

exports.deleteSchedule = (req, res) => {
  const { id } = req.params;
  const index = schedules.findIndex((sched) => sched.scheduleID === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }
  schedules.splice(index, 1);
  res.status(200).json({
    success: true,
    message: "Schedule deleted successfully",
  });
};
