import React, { useState } from 'react';
import axios from 'axios';

function CreateShift() {
  const [employeeId, setEmployeeId] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateShift = async () => {
    setMessage('');
    setError('');

    if (!employeeId || !shiftDate || !startTime || !endTime) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/shifts/create-shift',
        {
          employee_id: employeeId,
          shift_date: shiftDate,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            'manager-id': localStorage.getItem('manager-id'),
            'password1': localStorage.getItem('password'), // ✅ This MUST be 'password1'
          },
          withCredentials: true, // optional but safe for session cookies
        }
      );      

      setMessage(response.data.message || 'Shift created successfully!');
      setEmployeeId('');
      setShiftDate('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      console.error('Shift creation error:', err);
      setError(err.response?.data?.error || 'Failed to create shift');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create Shift</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />

      <input
        type="date"
        value={shiftDate}
        onChange={(e) => setShiftDate(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />

      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />

      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />

      <button onClick={handleCreateShift}>Create Shift</button>
    </div>
  );
}

export default CreateShift;
