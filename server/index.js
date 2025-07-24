// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// --- DATABASE CONNECTION ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Test the database connection
async function testDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Successfully connected to the database.');
        await connection.end();
    } catch (error) {
        console.error('❌ Error connecting to the database:', error);
        // Exit the process if the database connection fails
        process.exit(1);
    }
}

testDbConnection();


// --- EXPRESS APP SETUP ---
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// --- API ROUTES ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Resume Analyzer API!' });
});

// We will add our main routes here in the next steps.


// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// --- API ROUTES ---
// Import the analysis router
const analysisRouter = require('./routes/analysis');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Resume Analyzer API!' });
});

// Use the analysis router for any requests to /api
app.use('/api', analysisRouter);


// --- START SERVER ---
// ... (keep the app.listen part)
