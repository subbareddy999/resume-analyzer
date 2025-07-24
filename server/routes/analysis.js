const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// --- DATABASE CONFIGURATION (using PostgreSQL 'pg' library) ---
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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

        // --- UPDATED DATABASE LOGIC (PostgreSQL) ---
        const sql = `
            INSERT INTO analyses (file_name, name, email, analysis_data)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [
            req.file.originalname,
            analysisJSON.personalDetails.name || 'N/A',
            analysisJSON.personalDetails.email || 'N/A',
            analysisJSON // The 'pg' driver handles JSON objects automatically
        ];
        await pool.query(sql, values);
        // Note: No need for connection.end(), the pool manages connections.

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


// --- ENDPOINT: GET /api/analyses ---
router.get('/analyses', async (req, res) => {
    try {
        // --- UPDATED DATABASE LOGIC (PostgreSQL) ---
        const sql = `
            SELECT id, file_name, name, email, created_at
            FROM analyses
            ORDER BY created_at DESC
        `;
        const { rows } = await pool.query(sql);
        res.status(200).json(rows);

    } catch (error) {
        console.error('❌ Error fetching analysis history:', error);
        res.status(500).json({ error: 'Failed to fetch analysis history.' });
    }
});


// --- ENDPOINT: GET /api/analyses/:id ---
router.get('/analyses/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // --- UPDATED DATABASE LOGIC (PostgreSQL) ---
        const sql = `SELECT analysis_data FROM analyses WHERE id = $1`;
        const { rows } = await pool.query(sql, [id]);

        if (rows.length > 0) {
            // The analysis_data column is already a JSON object.
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
