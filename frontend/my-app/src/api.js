import axios from 'axios';

// Central axios client
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Update to match backend
  timeout: 5000,
});

// Set manager credentials in headers
const getManagerAuthHeaders = () => ({
  'manager-id': localStorage.getItem('manager-id'),
  'password1': localStorage.getItem('password'),
});

// Set employee credentials in headers
const getEmployeeAuthHeaders = () => ({
  'employee-id': localStorage.getItem('employee-id'),
  'password': localStorage.getItem('password'),
});


// ============ Clock In / Out ============
export const clockIn = async (employeeId) => {
  try {
    const response = await apiClient.post('/clock-in', { employee_id: employeeId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred during clock-in.' };
  }
};

export const clockOut = async (employeeId) => {
  try {
    const response = await apiClient.post('/clock-out', { employee_id: employeeId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred during clock-out.' };
  }
};


// ============ Shifts ============
export const createShift = async (shiftData) => {
  try {
    const response = await apiClient.post('/shifts/create-shift', shiftData, {
      headers: getManagerAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create shift' };
  }
};

export const editShift = async (shiftId, shiftData) => {
  try {
    const response = await apiClient.put(`/shifts/edit-shift/${shiftId}`, shiftData, {
      headers: getManagerAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred while editing the shift.' };
  }
};

export const deleteShift = async (shiftId) => {
  try {
    const response = await apiClient.delete(`/shifts/delete-shift/${shiftId}`, {
      headers: getManagerAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred while deleting the shift.' };
  }
};

export const viewShift = async () => {
  try {
    const response = await apiClient.get('/employee/view-shift', {
      headers: getEmployeeAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch shifts' };
  }
};

export const viewManagerShift = async () => {
  try {
    const response = await apiClient.get('/manager/view-shift', {
      headers: getManagerAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch manager shifts' };
  }
};


// ============ Schedule ============
export const viewSchedule = async () => {
  try {
    const response = await apiClient.get('/employee/view-schedule', {
      headers: getEmployeeAuthHeaders(),
    });
    return response.data.schedule;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch schedule' };
  }
};

export const viewManagerSchedule = async () => {
  try {
    const response = await apiClient.get('/manager/view-schedule', {
      headers: getManagerAuthHeaders(),
    });
    return response.data.schedule;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch manager schedule' };
  }
};
