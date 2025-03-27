import axios from 'axios';

// Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

// Helper: Get employee headers
export const getEmployeeAuthHeaders = () => {
  const headers = {
    'employee-id': localStorage.getItem('employee-id'),
    'password': localStorage.getItem('password'),
  };
  console.log("getEmployeeAuthHeaders:", headers);
  return headers;
};

// Helper: Get manager headers
export const getManagerAuthHeaders = () => {
  const headers = {
    'manager-id': localStorage.getItem('manager-id'),
    'password1': localStorage.getItem('password'),
  };
  console.log("getManagerAuthHeaders:", headers);
  return headers;
};

// ========== EMPLOYEE CLOCKING ==========

export const clockIn = async (employeeId) => {
  console.log("Sending clock-in for:", employeeId);
  try {
    const response = await apiClient.post('/employee/clock-in', { employee_id: employeeId }, {
      headers: getEmployeeAuthHeaders(),
    });
    console.log("Clock-in response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Clock-in error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Clock-in failed.' };
  }
};

export const clockOut = async (employeeId) => {
  console.log("Sending clock-out for:", employeeId);
  try {
    const response = await apiClient.post('/employee/clock-out', { employee_id: employeeId }, {
      headers: getEmployeeAuthHeaders(),
    });
    console.log("Clock-out response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Clock-out error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Clock-out failed.' };
  }
};

export const checkClockStatus = async () => {
  console.log("Checking clock status...");
  try {
    const response = await apiClient.post('/employee/clock-status', {}, {
      headers: getEmployeeAuthHeaders(),
    });
    console.log("Clock status:", response.data);
    return response.data;
  } catch (error) {
    console.error("Clock status error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to check clock status.' };
  }
};

// ========== EMPLOYEE SHIFTS ==========

export const viewShift = async () => {
  const headers = getEmployeeAuthHeaders();
  console.log("viewShift() sending headers:", headers);

  try {
    const response = await apiClient.get('/employee/view-shift', {
      headers,
    });
    console.log("Shift API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("viewShift() error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to fetch shifts' };
  }
};

export const viewSchedule = async () => {
  const headers = getEmployeeAuthHeaders();
  console.log("viewSchedule() sending headers:", headers);

  try {
    const response = await apiClient.get('/employee/view-schedule', {
      headers,
    });
    console.log("Schedule API response:", response.data);
    return response.data.schedule;
  } catch (error) {
    console.error("viewSchedule() error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to fetch schedule' };
  }
};

// ========== MANAGER SHIFTS ==========

export const createShift = async (shiftData) => {
  console.log("Creating shift:", shiftData);
  try {
    const response = await apiClient.post('/shifts/create-shift', shiftData, {
      headers: getManagerAuthHeaders(),
    });
    console.log("Shift created:", response.data);
    return response.data;
  } catch (error) {
    console.error("createShift error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to create shift' };
  }
};

export const editShift = async (shiftId, shiftData) => {
  console.log("Editing shift:", { shiftId, shiftData });
  try {
    const response = await apiClient.put(`/shifts/edit-shift/${shiftId}`, shiftData, {
      headers: getManagerAuthHeaders(),
    });
    console.log("Shift updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("editShift error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to update shift.' };
  }
};

export const deleteShift = async (shiftId) => {
  console.log("Deleting shift ID:", shiftId);
  try {
    const response = await apiClient.delete(`/shifts/delete-shift/${shiftId}`, {
      headers: getManagerAuthHeaders(),
    });
    console.log("Shift deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("deleteShift error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to delete shift.' };
  }
};

export const viewManagerShift = async () => {
  const headers = getManagerAuthHeaders();
  console.log("Manager fetching all shifts...");
  try {
    const response = await apiClient.get('/manager/view-shift', {
      headers,
    });
    console.log("Manager shift data:", response.data);
    return response.data;
  } catch (error) {
    console.error("viewManagerShift error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to fetch manager shifts' };
  }
};

export const viewManagerSchedule = async () => {
  const headers = getManagerAuthHeaders();
  console.log("Manager fetching schedule...");
  try {
    const response = await apiClient.get('/manager/view-schedule', {
      headers,
    });
    console.log("Manager schedule:", response.data);
    return response.data.schedule;
  } catch (error) {
    console.error("viewManagerSchedule error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to fetch manager schedule' };
  }
};

// ========== NEW: SCHEDULE EDITING ==========
export const editSchedule = async (shiftId, updateData) => {
  console.log("Editing schedule:", shiftId, updateData);
  try {
    const response = await apiClient.put(`/schedule/edit/${shiftId}`, updateData, {
      headers: getManagerAuthHeaders(),
    });
    console.log("Schedule updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("editSchedule error:", error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to update schedule.' };
  }
};
