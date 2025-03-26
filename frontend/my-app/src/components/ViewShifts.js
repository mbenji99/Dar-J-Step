import React, { useState } from 'react';
import axios from 'axios';

function ViewShifts() {
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleViewShifts = async () => {
    const employeeId = localStorage.getItem("employee-id"); // Correct key
    const password = localStorage.getItem("password");

    if (!employeeId || !password) {
      setError("Missing credentials. Please log in again.");
      setShifts([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/employee/view-shift", {
        params: {
          employee_id: employeeId,
          password: password,
        },
      });

      setShifts(response.data.shifts || []);
      setError('');
    } catch (err) {
      console.error("Error fetching shifts:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Error fetching shifts");
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>View Shifts</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading shifts...</p>}

      <button onClick={handleViewShifts}>Fetch My Shifts</button>

      <div style={{ marginTop: '20px' }}>
        {shifts.length > 0 ? (
          shifts.map((shift, index) => (
            <div key={index}>
              <p>
                📅 <strong>{shift.formatted_date}</strong> ({shift.day_of_week})<br />
                🕒 <strong>{shift.start_time}</strong> - <strong>{shift.end_time}</strong>
              </p>
              <hr />
            </div>
          ))
        ) : (
          !loading && <p>No shifts to show.</p>
        )}
      </div>
    </div>
  );
}

export default ViewShifts;
