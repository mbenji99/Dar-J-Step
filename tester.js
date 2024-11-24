const { addEmployee } = require('./backend/database/employees');
const { logClockIn } = require('./backend/database/logs');

// Function to test adding an employee and logging clock-in
const testAddEmployeeAndClockIn = async () => {
    // Define sample data
    const sampleEmployeeName = 'John Doe';

    // Step 1: Add a new employee
    console.log('Adding new employee...');
    addEmployee(sampleEmployeeName, (err, result) => {
        if (err) {
            console.error('Error adding employee:', err.message);
            return;
        }

        console.log('Employee added successfully. Employee ID:', result.insertId);

        // Step 2: Log clock-in for the new employee
        const employeeId = result.insertId; // Use the inserted employee's ID
        const clockInTime = new Date();

        console.log('Logging clock-in...');
        logClockIn(employeeId, clockInTime, (err, result) => {
            if (err) {
                console.error('Error logging clock-in:', err.message);
                return;
            }

            console.log('Clock-in logged successfully at:', clockInTime);
        });
    });
};

// Run the test function
testAddEmployeeAndClockIn();
