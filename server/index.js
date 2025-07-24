// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');

// --- EXPRESS APP SETUP ---
const app = express();
// Render provides the PORT environment variable. Your code will use it automatically.
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// --- API ROUTES ---
// Import the analysis router. The database pool is now managed inside this file.
const analysisRouter = require('./routes/analysis');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Resume Analyzer API!' });
});

// Use the analysis router for any requests to /api
app.use('/api', analysisRouter);


// --- START SERVER ---
app.listen(PORT, () => {
    // This is the only message we need when the server starts successfully.
    console.log(`🚀 Server is running on port ${PORT}`);
});
