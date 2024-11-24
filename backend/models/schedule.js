// Define the Schedule class
class Schedule {
    constructor(scheduleID, employeeID, shiftDetails, date) {
      this.scheduleID = scheduleID; // Unique ID for the schedule
      this.employeeID = employeeID; // ID of the employee assigned
      this.shiftDetails = shiftDetails; // Shift details (e.g., "Morning Shift")
      this.date = date; // Date of the shift
    }
  
    // Method to assign a shift to an employee
    assignShift(employeeID, shiftDetails, date) {
      this.employeeID = employeeID;
      this.shiftDetails = shiftDetails;
      this.date = date;
      console.log(`Shift assigned: Employee ${employeeID}, ${shiftDetails} on ${date}`);
    }
  
    // Method to modify the shift details
    modifyShift(newShiftDetails) {
      this.shiftDetails = newShiftDetails;
      console.log(`Shift modified to: ${newShiftDetails}`);
    }
  
    // Method to get shift details
    getShiftDetails() {
      return {
        scheduleID: this.scheduleID,
        employeeID: this.employeeID,
        shiftDetails: this.shiftDetails,
        date: this.date,
      };
    }
  }
  
  // Example Usage
  const mySchedule = new Schedule(1, 101, "Morning Shift", "2024-11-22");
  
  // Assign a new shift
  mySchedule.assignShift(102, "Evening Shift", "2024-11-23");
  
  // Modify the shift details
  mySchedule.modifyShift("Night Shift");
  
  // Get the shift details
  console.log(mySchedule.getShiftDetails());
  