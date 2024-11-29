import React, { useState } from "react";
import { createShift, viewManagerShift, viewManagerSchedule } from "../api";
import "./ManagerDashboardView.css";

const ManagerDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
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
  
      // Ensure all fields are filled
      if (!employee_id || !shift_date || !start_time || !end_time) {
        setError("All fields are required.");
        return;
      }
  
      // API call to create shift
      const response = await createShift({
        employee_id,
        shift_date,
        start_time,
        end_time,
      });
  
      alert(response.message); // Inform the user of success
      setFormData({ employee_id: "", shift_date: "", start_time: "", end_time: "" }); // Clear the form
      setError(""); // Clear error state
    } catch (err) {
      setError(err.error || "Failed to create shift."); // Handle errors
    }
  };
  
  

  const handleViewShifts = async () => {
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");

      if (!managerId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }

      const data = await viewManagerShift(managerId, password);
      setShifts(data.shifts);
      setError("");
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setError(err.response?.data?.error || "Error fetching shifts");
    }
  };

  const handleViewSchedule = async () => {
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");

      if (!managerId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }

      const data = await viewManagerSchedule(managerId, password);
      setSchedule(data);
      setError("");
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.response?.data?.error || "Error fetching schedule");
    }
  };

  return (
    <div>
      <h1>Manager Dashboard</h1>
      <button onClick={handleViewShifts}>View Shifts</button>
      <button onClick={handleViewSchedule}>View Schedule</button>
      {error && <p style={{ color: "red" }}>{error}</p>}


      {shifts?.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Shift Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{new Date(shift.shift_date).toLocaleDateString()}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {schedule?.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Schedule Date</th>
              <th>Start Time</th>
              <th>End Time</th>
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
      )}
    </div>
  );
};

export default ManagerDashboard;
