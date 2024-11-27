import React, { useState } from "react";
import "./ClockInOut.css"; // Import the CSS file

// Mock list of valid employee IDs
const validEmployeeIDs = ["12345", "67890", "11223", "33445", "55667"];

const ClockInOut = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [message, setMessage] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);

  const handleClockIn = () => {
    if (validEmployeeIDs.includes(employeeID)) {
      setIsClockedIn(true);
      setMessage(`Success: Employee ${employeeID} has clocked in.`);
    } else {
      setMessage("Error: Invalid Employee ID.");
    }
  };

  const handleClockOut = () => {
    if (validEmployeeIDs.includes(employeeID)) {
      setIsClockedIn(false);
      setMessage(`Success: Employee ${employeeID} has clocked out.`);
    } else {
      setMessage("Error: Invalid Employee ID.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Employee Clock In/Out</h1>
      <div style={styles.form}>
        <label style={styles.label}>Enter Employee ID:</label>
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          style={styles.input}
          placeholder="Enter your ID"
        />
        <div style={styles.buttons}>
          <button onClick={handleClockIn} style={styles.button}>
            Clock In
          </button>
          <button onClick={handleClockOut} style={styles.button}>
            Clock Out
          </button>
        </div>
      </div>
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
    </div>
  );
};

// Inline styles for simple design
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    marginTop: "50px",
  },
  form: {
    display: "inline-block",
    textAlign: "left",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonClockOut: {
    backgroundColor: "#FF5733",
  },
  message: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default ClockInOut;
