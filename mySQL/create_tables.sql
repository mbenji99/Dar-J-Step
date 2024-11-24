CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    password VARCHAR(255)
    employee_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS clock_in_out_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    clock_in_time DATETIME NOT NULL,
    clock_out_time DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);


CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    shift_details VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    DELETE FROM schedules WHERE schedule_id = ?;
);

CREATE TABLE IF NOT EXISTS shifts (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    role VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    SELECT * FROM schedules WHERE employee_id = ?;
);


CREATE TABLE login_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);