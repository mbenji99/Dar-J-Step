// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const clockInRoutes = require('./routes/clockinroutes');
const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());



// Use the clock-in routes
app.use('/api', clockInRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
