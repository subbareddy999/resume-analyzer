const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mysql = require('mysql2/promise');

const router = express.Router();

// --- DATABASE CONFIGURATION ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// --- MULTER SETUP ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- GEMINI API SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- THE PROMPT ---
const prompt = `
You are an expert resume analyzer. Analyze the provided resume text and extract the following information in a structured JSON format.

The JSON object must have these exact keys: "personalDetails", "resumeContent", "skills", "aiFeedback".

1.  "personalDetails": Extract the person's name, email, phone number, and any LinkedIn or portfolio URLs.
2.  "resumeContent": Extract the summary/objective, all work experience (with company, role, dates, and description), education (with institution, degree, and dates), projects, and any certifications.
3.  "skills": Identify and categorize skills into "technicalSkills" and "softSkills". List them as arrays of strings.
4.  "aiFeedback": Provide AI-driven feedback. This must include:
    * "rating": An overall resume rating on a scale of 1 to 10.
    * "improvementAreas": A summary of specific areas for improvement.
    * "upskillingSuggestions": A list of 3-5 suggested skills to learn, relevant to the user's profile.

Do not include any introductory text like "Here is the JSON output". Only output the raw JSON object.
The resume text to analyze is below:
`;

// --- API ENDPOINT: POST /api/analyze ---
// (This is your existing endpoint from Step 3, no changes needed here)
router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded.' });
        }
        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;

        const result = await model.generateContent([prompt, resumeText]);
        const response = await result.response;
        let analysisText = response.text();
        analysisText = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysisJSON = JSON.parse(analysisText);

        const connection = await mysql.createConnection(dbConfig);
        const sql = `
            INSERT INTO analyses (file_name, name, email, analysis_data)
            VALUES (?, ?, ?, ?)
        `;
        await connection.execute(sql, [
            req.file.originalname,
            analysisJSON.personalDetails.name || 'N/A',
            analysisJSON.personalDetails.email || 'N/A',
            JSON.stringify(analysisJSON)
        ]);
        await connection.end();

        console.log('✅ Analysis complete and saved to database.');
        res.status(200).json(analysisJSON);

    } catch (error) {
        console.error('❌ Error during analysis:', error);
        if (error instanceof SyntaxError) {
             res.status(500).json({ error: 'Failed to parse AI response. Please try again.' });
        } else {
             res.status(500).json({ error: 'An internal server error occurred.' });
        }
    }
});


// --- NEW ENDPOINT: GET /api/analyses ---
// Fetches a list of all past analyses for the history table.
router.get('/analyses', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const sql = `
            SELECT id, file_name, name, email, created_at
            FROM analyses
            ORDER BY created_at DESC
        `;
        const [rows] = await connection.execute(sql);
        await connection.end();

        res.status(200).json(rows);
    } catch (error) {
        console.error('❌ Error fetching analysis history:', error);
        res.status(500).json({ error: 'Failed to fetch analysis history.' });
    }
});


// --- NEW ENDPOINT: GET /api/analyses/:id ---
// Fetches the full details of a single analysis for the modal view.
router.get('/analyses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const sql = `SELECT analysis_data FROM analyses WHERE id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        await connection.end();

        if (rows.length > 0) {
            // The analysis_data column is already a JSON string in the DB.
            // We parse it before sending it to the client.
            res.status(200).json(rows[0].analysis_data);
        } else {
            res.status(404).json({ error: 'Analysis not found.' });
        }
    } catch (error) {
        console.error(`❌ Error fetching analysis details for id ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch analysis details.' });
    }
});


module.exports = router;
