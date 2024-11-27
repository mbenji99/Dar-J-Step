import React, { useState } from "react";
import './ScheduleManagement.css';  


const ScheduleManagement = () => {
  const [scheduleID, setScheduleID] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [shiftDetails, setShiftDetails] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [shifts, setShifts] = useState([]); // Stores all shifts
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const checkForOverlap = () => {
    const newStart = new Date(`${date}T${startTime}`);
    const newEnd = new Date(`${date}T${endTime}`);

    for (let i = 0; i < shifts.length; i++) {
      if (i === editIndex) continue; // Skip the current shift when editing
      const shift = shifts[i];

      if (shift.employeeID === employeeID && shift.date === date) {
        const existingStart = new Date(`${shift.date}T${shift.startTime}`);
        const existingEnd = new Date(`${shift.date}T${shift.endTime}`);

        if (
          (newStart >= existingStart && newStart < existingEnd) || // Overlaps at the start
          (newEnd > existingStart && newEnd <= existingEnd) || // Overlaps at the end
          (newStart <= existingStart && newEnd >= existingEnd) // Fully overlaps
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const addShift = () => {
    if (!employeeID || !date || !startTime || !endTime) {
      setMessage("Error: All fields are required.");
      return;
    }

    if (new Date(`${date}T${startTime}`) >= new Date(`${date}T${endTime}`)) {
      setMessage("Error: Start time must be before end time.");
      return;
    }

    if (checkForOverlap()) {
      setMessage("Error: This shift overlaps with an existing shift for the same employee.");
      return;
    }

    const newShift = { scheduleID, employeeID, shiftDetails, date, startTime, endTime };
    setShifts([...shifts, newShift]);
    setMessage("Success: Shift added successfully!");
    handleReset();
  };

  const editShift = () => {
    if (!employeeID || !date || !startTime || !endTime) {
      setMessage("Error: All fields are required.");
      return;
    }

    if (new Date(`${date}T${startTime}`) >= new Date(`${date}T${endTime}`)) {
      setMessage("Error: Start time must be before end time.");
      return;
    }

    if (checkForOverlap()) {
      setMessage("Error: This shift overlaps with an existing shift for the same employee.");
      return;
    }

    const updatedShifts = [...shifts];
    updatedShifts[editIndex] = { scheduleID, employeeID, shiftDetails, date, startTime, endTime };
    setShifts(updatedShifts);
    setMessage("Success: Shift updated successfully!");
    handleReset();
  };

  const handleEditClick = (index) => {
    const shift = shifts[index];
    setScheduleID(shift.scheduleID);
    setEmployeeID(shift.employeeID);
    setShiftDetails(shift.shiftDetails);
    setDate(shift.date);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleReset = () => {
    setScheduleID("");
    setEmployeeID("");
    setShiftDetails("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setMessage("");
    setIsEditing(false);
    setEditIndex(null);
  };

  return (
    <div style={styles.container}>
      <h1>Manage Shift</h1>
      <div style={styles.form}>
        {/* Schedule ID */}
        <label style={styles.label}>Schedule ID:</label>
        <input
          type="text"
          value={scheduleID}
          onChange={(e) => setScheduleID(e.target.value)}
          style={styles.input}
          placeholder="Enter Schedule ID"
        />

        {/* Employee ID */}
        <label style={styles.label}>Employee ID:</label>
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          style={styles.input}
          placeholder="Enter Employee ID"
        />

        {/* Shift Details */}
        <label style={styles.label}>Shift Details:</label>
        <textarea
          value={shiftDetails}
          onChange={(e) => setShiftDetails(e.target.value)}
          style={styles.textarea}
          placeholder="Enter Shift Details"
        ></textarea>

        {/* Date */}
        <label style={styles.label}>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        {/* Start Time */}
        <label style={styles.label}>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={styles.input}
        />

        {/* End Time */}
        <label style={styles.label}>End Time:</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={styles.input}
        />

        {/* Buttons */}
        <div style={styles.buttons}>
          {isEditing ? (
            <button onClick={editShift} style={styles.button}>
              Update Shift
            </button>
          ) : (
            <button onClick={addShift} style={styles.button}>
              Add Shift
            </button>
          )}
          <button onClick={handleReset} style={{ ...styles.button, ...styles.resetButton }}>
            Reset
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            ...styles.message,
            color: message.startsWith("Success") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}

      {/* Shift List */}
      <h2>Shift List</h2>
      <ul style={styles.shiftList}>
        {shifts.map((shift, index) => (
          <li key={index} style={styles.shiftItem}>
            {shift.date} - {shift.startTime} to {shift.endTime} (Employee ID: {shift.employeeID})
            <button onClick={() => handleEditClick(index)} style={styles.editButton}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" },
  form: {
    display: "inline-block",
    textAlign: "left",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    width: "400px",
    display: "flex",
    flexDirection: "column",  // Stack elements vertically
    gap: "15px",  // Add spacing between each element
  },
  label: { fontSize: "16px", fontWeight: "bold" },
  input: { width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    resize: "none",
  },
  buttons: { display: "flex", justifyContent: "space-between" },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resetButton: { backgroundColor: "#FF5733" },
  message: { marginTop: "20px", fontSize: "18px", fontWeight: "bold" },
  shiftList: { listStyleType: "none", paddingLeft: "0", textAlign: "left" },
  shiftItem: { marginBottom: "10px" },
  editButton: { marginLeft: "10px", padding: "5px 10px", fontSize: "14px", color: "#fff", backgroundColor: "#28A745", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default ScheduleManagement;
