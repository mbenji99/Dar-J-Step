CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    employeeID INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(255) NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS logs (
    logID INT AUTO_INCREMENT PRIMARY KEY,
    employeeID INT,
    actionType ENUM('clock_in', 'clock_out'),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeID) REFERENCES employees(employeeID)
);

CREATE TABLE IF NOT EXISTS schedules (
    scheduleID INT AUTO_INCREMENT PRIMARY KEY,
    employeeID INT,
    shift_start DATETIME,
    shift_end DATETIME,
    FOREIGN KEY (employeeID) REFERENCES employees(employeeID)
);

CREATE TABLE IF NOT EXISTS shifts (
    shiftID INT AUTO_INCREMENT PRIMARY KEY,
    employeeID INT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
);


CREATE TABLE login_attempts (
    attemptID INT AUTO_INCREMENT PRIMARY KEY,
    employeeID INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (employeeID) REFERENCES employees(employeeID)
);


