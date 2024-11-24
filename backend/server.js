// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const clockInRoutes = require('./routes/clockinroutes');
const shiftRoutes = require('./routes/shiftRoutes');
const scheduleRoutes = require('./routes/scheduleRoute');
const managerRoutes = require('./routes/managerRoutes');
const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());



// Use the clock-in routes
app.use('/api', clockInRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api',scheduleRoutes);
app.use('/manager', managerRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
