class Shift {
    constructor(shiftID, startTime, endTime, breaks = 0) {
      this.shiftID = shiftID; // Unique ID for the shift
      this.startTime = startTime; // Shift start time (e.g., "08:00 AM")
      this.endTime = endTime; // Shift end time (e.g., "04:00 PM")
      this.breaks = breaks; // Break duration in minutes
    }
  
    // Method to calculate the total shift duration in hours
    calculateShiftDuration() {
      // Convert times to Date objects for calculation
      const start = new Date(`1970-01-01T${this.startTime}`);
      const end = new Date(`1970-01-01T${this.endTime}`);
  
      // Calculate duration in minutes
      const totalMinutes = (end - start) / (1000 * 60) - this.breaks;
  
      // Convert to hours and return
      return totalMinutes / 60;
    }
  
    // Method to get the shift's start and end times
    getShiftStartEndTimes() {
      return {
        startTime: this.startTime,
        endTime: this.endTime,
      };
    }
  }
  
  // Example usage:
  const myShift = new Shift(1, "08:00:00", "16:00:00", 30);
  
  // Get shift start and end times
  console.log("Shift Times:", myShift.getShiftStartEndTimes());
  
  // Calculate shift duration
  console.log("Shift Duration:", myShift.calculateShiftDuration(), "hours");
  