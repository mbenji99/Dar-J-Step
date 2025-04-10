import React, { useState } from 'react';
import axios from 'axios';

function EditShift() {
  const [shiftId, setShiftId] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleEditShift = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/shifts/${shiftId}`, {
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to edit shift');
    }
  };

  return (
    <div>
      <h2>Edit Shift</h2>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Shift ID"
        value={shiftId}
        onChange={(e) => setShiftId(e.target.value)}
      />
      <input
        type="date"
        placeholder="Shift Date"
        value={shiftDate}
        onChange={(e) => setShiftDate(e.target.value)}
      />
      <input
        type="time"
        placeholder="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="time"
        placeholder="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleEditShift}>Edit Shift</button>
    </div>
  );
}

export default EditShift;
