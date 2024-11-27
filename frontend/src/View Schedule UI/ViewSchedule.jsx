import React, { useState, useEffect } from "react";
import "./ViewSchedule.css";
// import axios from "axios";

const shifts = [
    { id: 1, employeeId: 12345, date: '2023-10-01', starttime: '9 AM', endtime: '5 PM', name: 'John Doe', role: 'employee' },
    { id: 2, employeeId: 2, date: '2023-10-02', starttime: '10 AM', endtime: '6 PM', name: 'Jane Smith', role: 'employee' },
    { id: 3, employeeId: 1, date: '2023-10-03', starttime: '11 AM', endtime: '7 PM', name: 'John Doe', role: 'employee' },
    { id: 4, employeeId: 3, date: '2023-10-04', starttime: '8 AM', endtime: '4 PM', name: 'Alice Johnson', role: 'manager' },
];

const users = [
    { id: 1, name: "John Doe", role: "employee" },
    { id: 2, name: "Jane Smith", role: "employee" },
    { id: 3, name: "Alice Johnson", role: "manager" },
];

const ViewSchedule = () => {
    const [id, setId] = useState("");
    const [role, setRole] = useState("employee");
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [employeeShifts, setEmployeeShifts] = useState([]);
    const [shiftToDelete, setShiftToDelete] = useState("");
    const [deleteEmployeeId, setDeleteEmployeeId] = useState("");
    const [dateRangeStart, setDateRangeStart] = useState("");
    const [dateRangeEnd, setDateRangeEnd] = useState("");

    const displayManagerShift = () => {
        setEmployeeShifts(shifts);
        setLoading(false);
    };

    useEffect(() => {
        if (currentUser) {
            setLoading(true);
            if (currentUser.role === 'employee') {
                displayEmployeeShift();
            } else {
                displayManagerShift();
            }
        }
    }, [currentUser]);

    const Login = () => {
        const user = users.find(u => u.id === parseInt(id) && u.role === role);
        if (user) {
            setCurrentUser(user);
            setError("");
        } else {
            setError("Invalid ID or Role");
            setCurrentUser(null);
        }
    };

    const displayEmployeeShift = () => {
        const emShift = shifts.filter(shift => shift.employeeId === currentUser.id);
        setEmployeeShifts(emShift);
        setLoading(false);
    };

    const handleDeleteShift = () => {
        const shiftId = parseInt(shiftToDelete);
        
        if (isNaN(shiftId)) {
            alert("Please enter a valid shift ID.");
            return;
        }
    
        const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
        
        if (updatedShifts.length === shifts.length) {
            alert(`Shift with ID ${shiftToDelete} not found.`);
            return;
        }
    
        setEmployeeShifts(updatedShifts);
        setShiftToDelete(""); // Clear the input after deletion
        alert(`Shift with ID ${shiftToDelete} has been deleted.`);
    };

    const handleDeleteSchedule = () => {
        if (currentUser.role === 'manager') {
            let updatedShifts = [...shifts];
    
            // Delete by employee ID
            if (deleteEmployeeId) {
                updatedShifts = updatedShifts.filter(shift => shift.employeeId !== parseInt(deleteEmployeeId));
                alert(`All shifts for Employee ID: ${deleteEmployeeId} have been deleted.`);
            }
    
            // Delete by date range
            if (dateRangeStart && dateRangeEnd) {
                updatedShifts = updatedShifts.filter(shift => {
                    const shiftDate = new Date(shift.date);
                    return shiftDate >= new Date(dateRangeStart) && shiftDate <= new Date(dateRangeEnd);
                });
                alert(`All shifts between ${dateRangeStart} and ${dateRangeEnd} have been deleted.`);
            }
    
            // Update shifts state
            setEmployeeShifts(updatedShifts);
            setDateRangeStart(""); // Clear date range input
            setDateRangeEnd(""); // Clear date range input
            setDeleteEmployeeId(""); // Clear employee ID input
            setError(""); // Clear any previous errors
        } else {
            setError("Only managers can delete shifts.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="schedule-view">
            <h1>Schedule</h1>
            <div>
                <label htmlFor="id">Enter ID#:</label>
                <input
                    type="number"
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="role">Select Role: </label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                </select>
            </div>
            <button onClick={Login}>Login</button>
            {error && <div style={{ color: "red" }}>{error}</div>}

            {currentUser && (
                <>
                    <h2>{currentUser.name}'s Schedule</h2>
                    {currentUser.role === 'employee' ? (
                        <div id="employee">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Date</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeShifts.length > 0 ? (
                                        employeeShifts.map(shift => (
                                            <tr key={shift.id}>
                                                <td>{shift.id}</td>
                                                <td>{shift.name}</td>
                                                <td>{shift.starttime}</td>
                                                <td>{shift.endtime}</td>
                                                <td>{shift.date}</td>
                                                <td>{shift.role}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">No shifts assigned</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div id="manager">
                            <h2>Full Schedule</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Employee Name</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Date</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shifts.map(shift => (
                                        <tr key={shift.id}>
                                            <td>{shift.id}</td>
                                            <td>{shift.name}</td>
                                            <td>{shift.starttime}</td>
                                            <td>{shift.endtime}</td>
                                            <td>{shift.date}</td>
                                            <td>{shift.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div>
                                <label htmlFor="shiftToDelete">Delete Shift by ID:</label>
                                <input
                                    type="number"
                                    id="shiftToDelete"
                                    value={shiftToDelete}
                                    onChange={(e) => setShiftToDelete(e.target.value)}
                                />
                                <button onClick={handleDeleteShift}>Delete Shift</button>
                            </div>
                            
                            <div>
                                <label htmlFor="deleteEmployeeId">Delete All Shifts for Employee ID:</label>
                                <input
                                    type="number"
                                    id="deleteEmployeeId"
                                    value={deleteEmployeeId}
                                    onChange={(e) => setDeleteEmployeeId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="dateRangeStart">Delete Shifts from Date:</label>
                                <input
                                    type="date"
                                    id="dateRangeStart"
                                    value={dateRangeStart}
                                    onChange={(e) => setDateRangeStart(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="dateRangeEnd">To Date:</label>
                                <input
                                    type="date"
                                    id="dateRangeEnd"
                                    value={dateRangeEnd}
                                    onChange={(e) => setDateRangeEnd(e.target.value)}
                                />
                            </div>
                            <button onClick={handleDeleteSchedule}>Delete Schedule</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ViewSchedule;
