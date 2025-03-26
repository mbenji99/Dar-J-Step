import React, { useState } from "react";
import {
  createShift,
  viewManagerShift,
  viewManagerSchedule,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateShift = async () => {
    try {
      const { employee_id, shift_date, start_time, end_time } = formData;
      if (!employee_id || !shift_date || !start_time || !end_time) {
        setError("All fields are required.");
        return;
      }

      const response = await createShift({
        employee_id,
        shift_date,
        start_time,
        end_time,
      });

      alert(response.message || "Shift created successfully.");
      setFormData({
        employee_id: "",
        shift_date: "",
        start_time: "",
        end_time: "",
      });
      setError("");
    } catch (err) {
      setError(err.error || "Failed to create shift.");
    }
  };

  const handleViewShifts = async () => {
    if (showShiftTable) {
      setShowShiftTable(false);
      return;
    }

    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");
      if (!managerId || !password) throw new Error("Missing credentials");

      const data = await viewManagerShift(managerId, password);
      const filtered = filterEmployeeId
        ? data.shifts.filter(
            (shift) => shift.employee_id === parseInt(filterEmployeeId)
          )
        : data.shifts;

      setShifts(filtered);
      setShowShiftTable(true);
      setError("");
    } catch (err) {
      console.error("Shift fetch error:", err);
      setError(err.response?.data?.error || "Error fetching shifts");
    }
  };

  const handleViewSchedule = async () => {
    if (showScheduleTable) {
      setShowScheduleTable(false);
      return;
    }

    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");
      if (!managerId || !password) throw new Error("Missing credentials");

      const data = await viewManagerSchedule(managerId, password);
      const filtered = filterEmployeeId
        ? data.filter(
            (item) => item.employee_id === parseInt(filterEmployeeId)
          )
        : data;

      setSchedule(filtered);
      setShowScheduleTable(true);
      setError("");
    } catch (err) {
      console.error("Schedule fetch error:", err);
      setError(err.response?.data?.error || "Error fetching schedule");
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

      <button onClick={handleViewShifts}>
        {showShiftTable ? "Hide Shifts" : "View Shifts"}
      </button>
      <button onClick={handleViewSchedule}>
        {showScheduleTable ? "Hide Schedule" : "View Schedule"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Create New Shift</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateShift();
        }}
      >
        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={formData.employee_id}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="shift_date"
          value={formData.shift_date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleInputChange}
        />
        <button type="submit">Create Shift</button>
      </form>

      {/* Shifts Table */}
      {showShiftTable && shifts.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Shift Date</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.employee_id}</td>
                <td>{shift.formatted_date}</td>
                <td>{shift.day_of_week}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Schedule Table */}
      {showScheduleTable && schedule.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Schedule Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.employee_id}</td>
                <td>{new Date(item.shift_date).toLocaleDateString()}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerDashboard;
