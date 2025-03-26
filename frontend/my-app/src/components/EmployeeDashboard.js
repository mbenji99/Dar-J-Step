import React, { useEffect, useState } from "react";
import { viewShift, viewSchedule, clockIn, clockOut } from "../api";

function EmployeeDashboard() {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const employeeId = localStorage.getItem("employee-id");
  const password = localStorage.getItem("password");

  const fetchShiftsAndSchedule = async () => {
    try {
      setLoading(true);
      const shiftData = await viewShift(employeeId, password);
      const scheduleData = await viewSchedule(employeeId, password);

      setShifts(shiftData.shifts || []);
      setSchedule(scheduleData || []);
    } catch (err) {
      setError(err.error || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const checkClockStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/employee/clock-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "employee-id": employeeId,
          password: password,
        },
      });

      const data = await response.json();
      setClockedIn(data.clockedIn);
    } catch (err) {
      console.error("Clock status check failed:", err);
    }
  };

  const handleClockToggle = async () => {
    try {
      if (clockedIn) {
        const response = await clockOut(employeeId);
        alert(response.message || "Clocked out successfully.");
      } else {
        const response = await clockIn(employeeId);
        alert(response.message || "Clocked in successfully.");
      }

      setClockedIn(!clockedIn);
    } catch (err) {
      setError(err.error || "Clock-in/out failed.");
    }
  };

  useEffect(() => {
    fetchShiftsAndSchedule();
    checkClockStatus();
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <button onClick={handleClockToggle} style={{ marginBottom: "20px" }}>
        {clockedIn ? "Clock Out" : "Clock In"}
      </button>

      <h2>Your Shifts</h2>
      {shifts.length > 0 ? (
        <table border="1" style={{ width: "80%", margin: "10px auto" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.formatted_date}</td>
                <td>{shift.day_of_week}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No shifts available.</p>
      )}

      <h2>Your Schedule</h2>
      {schedule.length > 0 ? (
        <table border="1" style={{ width: "80%", margin: "10px auto" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.shift_date).toLocaleDateString()}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedule available.</p>
      )}
    </div>
  );
}

export default EmployeeDashboard;
