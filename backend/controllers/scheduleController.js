let schedules = []; // In-memory storage for schedules

// Assign a shift to a specific day in the weekly schedule
exports.assignShiftToDay = (req, res) => {
  const { id, day } = req.params; // Extract schedule ID and day from the URL
  const { shiftDetails } = req.body; // Extract shift details from the request body

  // Find the schedule by ID
  const schedule = schedules.find((s) => s.scheduleID === parseInt(id));
  if (!schedule) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }

  // Find the specific day in the week schedule
  const dayEntry = schedule.weekSchedule.find((entry) => entry.day.toLowerCase() === day.toLowerCase());
  if (!dayEntry) {
    return res.status(400).json({ success: false, message: "Invalid day of the week" });
  }

  // Update the shift details for the given day
  dayEntry.shiftDetails = shiftDetails;

  res.status(200).json({
    success: true,
    message: `Shift successfully assigned to ${day}`,
    data: schedule,
  });
};

// Create a new schedule
exports.createSchedule = (req, res) => {
  const { scheduleID, shiftDetails, date } = req.body;

  // Validate required fields
  if (!scheduleID || !shiftDetails || !date) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Generate a table with days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weekSchedule = daysOfWeek.map((day) => ({
    day,
    shiftDetails: null, // Placeholder for shifts to be added later
  }));

  const newSchedule = {
    scheduleID,
    shiftDetails, // General shift details (e.g., default shifts or notes)
    date,
    weekSchedule, // Add the table with days of the week
  };

  // Add the schedule to the list
  schedules.push(newSchedule);

  res.status(201).json({
    success: true,
    message: "Schedule created successfully with a weekly table",
    data: newSchedule,
  });
};

// Get all schedules
exports.getAllSchedules = (req, res) => {
  res.status(200).json({ success: true, data: schedules });
};

// Get a schedule by ID
exports.getScheduleById = (req, res) => {
  const { id } = req.params;
  const schedule = schedules.find((s) => s.scheduleID === parseInt(id));
  if (!schedule) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }
  res.status(200).json({ success: true, data: schedule });
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
