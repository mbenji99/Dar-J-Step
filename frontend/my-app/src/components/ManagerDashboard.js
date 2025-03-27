import React, { useState } from "react";
import {
  createShift,
  viewManagerShift,
  viewManagerSchedule,
  editShift,
  deleteShift,
  editSchedule,
} from "../api";
import "./ManagerDashboardView.css";

const ManagerDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
  const [showShiftTable, setShowShiftTable] = useState(false);
  const [showScheduleTable, setShowScheduleTable] = useState(false);
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [formData, setFormData] = useState({
    employee_id: "",
    shift_date: "",
    start_time: "",
    end_time: "",
  });

  const formatDateInput = (dateStr) => {
    const date = new Date(dateStr);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateShift = async () => {
    try {
      const { employee_id, shift_date, start_time, end_time } = formData;
      if (!employee_id || !shift_date || !start_time || !end_time) {
        setError("All fields are required.");
        return;
      }
      const response = await createShift({ employee_id, shift_date, start_time, end_time });
      alert(response.message || "Shift created successfully.");
      setFormData({ employee_id: "", shift_date: "", start_time: "", end_time: "" });
      setError("");
    } catch (err) {
      setError(err.error || "Failed to create shift.");
    }
  };

  const handleViewShifts = async () => {
    if (showShiftTable) return setShowShiftTable(false);
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");
      const data = await viewManagerShift(managerId, password);
      const filtered = filterEmployeeId
        ? data.shifts.filter((s) => s.employee_id === parseInt(filterEmployeeId))
        : data.shifts;
      setShifts(filtered);
      setShowShiftTable(true);
      setError("");
    } catch (err) {
      setError(err.error || "Error fetching shifts.");
    }
  };

  const handleViewSchedule = async () => {
    if (showScheduleTable) return setShowScheduleTable(false);
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");
      const data = await viewManagerSchedule(managerId, password);
      const filtered = filterEmployeeId
        ? data.filter((item) => item.employee_id === parseInt(filterEmployeeId))
        : data;
      setSchedule(filtered);
      setShowScheduleTable(true);
      setError("");
    } catch (err) {
      setError(err.error || "Error fetching schedule.");
    }
  };

  const handleEditShift = async (shift) => {
    const shift_date = prompt("Enter new shift date (YYYY-MM-DD):", formatDateInput(shift.shift_date));
    const start_time = prompt("Enter new start time (HH:MM:SS):", shift.start_time);
    const end_time = prompt("Enter new end time (HH:MM:SS):", shift.end_time);
    if (shift_date && start_time && end_time) {
      try {
        const result = await editShift(shift.shift_id, { shift_date, start_time, end_time });
        alert(result.message);
        handleViewShifts();
      } catch (err) {
        alert(err.error || "Failed to edit shift.");
      }
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      try {
        const result = await deleteShift(shiftId);
        alert(result.message);
        handleViewShifts();
      } catch (err) {
        alert(err.error || "Failed to delete shift.");
      }
    }
  };

  const handleEditSchedule = async (item) => {
    const shift_date = prompt("Enter new shift date (YYYY-MM-DD):", formatDateInput(item.shift_date));
    const start_time = prompt("Enter new start time (HH:MM:SS):", item.start_time);
    const end_time = prompt("Enter new end time (HH:MM:SS):", item.end_time);
    if (shift_date && start_time && end_time) {
      try {
        const result = await editSchedule(item.shift_id, {
          action: "edit",
          shift_date,
          start_time,
          end_time,
        });
        alert(result.message);
        handleViewSchedule();
      } catch (err) {
        alert(err.error || "Failed to edit schedule.");
      }
    }
  };

  return (
    <div>
      <h1>Manager Dashboard</h1>

      <div>
        <label>
          Filter by Employee ID:
          <input
            type="text"
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
          />
        </label>
      </div>

      <button onClick={handleViewShifts}>{showShiftTable ? "Hide Shifts" : "View Shifts"}</button>
      <button onClick={handleViewSchedule}>{showScheduleTable ? "Hide Schedule" : "View Schedule"}</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Create New Shift</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateShift(); }}>
        <input type="text" name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleInputChange} />
        <input type="date" name="shift_date" value={formData.shift_date} onChange={handleInputChange} />
        <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
        <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
        <button type="submit">Create Shift</button>
      </form>

      {/* SHIFTS TABLE */}
      {showShiftTable && shifts.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "90%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Shift Date</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.shift_id}>
                <td>{shift.employee_id}</td>
                <td>{shift.formatted_date}</td>
                <td>{shift.day_of_week}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
                <td>
                  <button onClick={() => handleEditShift(shift)}>Edit</button>
                  <button onClick={() => handleDeleteShift(shift.shift_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* SCHEDULE TABLE */}
      {showScheduleTable && schedule.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "90%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.shift_id}>
                <td>{item.employee_id}</td>
                <td>{new Date(item.shift_date).toLocaleDateString()}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
                <td>
                  <button onClick={() => handleEditSchedule(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerDashboard;
