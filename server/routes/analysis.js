const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const prompt = `
You are a highly experienced technical recruiter and career coach with expertise in software engineering resumes. Your task is to meticulously analyze the provided resume text and convert it into a structured JSON object.

The output MUST be a single, raw JSON object, without any surrounding text, explanations, or markdown formatting like \`\`\`json.

The JSON object must strictly adhere to the following structure. Do not add or remove any keys. If a piece of information is not found, use an empty string "" for string values, an empty array [] for array values, or null where appropriate.

{
  "personalDetails": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string | null",
    "portfolio": "string | null"
  },
  "resumeContent": {
    "summary": "string",
    "workExperience": [
      {
        "role": "string",
        "company": "string",
        "dates": "string (e.g., 'Jan 2022 - Present')",
        "description": [
          "string (each bullet point or responsibility as a separate string)"
        ]
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "dates": "string"
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "certifications": [
      "string"
    ]
  },
  "skills": {
    "technicalSkills": [
      "string"
    ],
    "softSkills": [
      "string"
    ]
  },
  "aiFeedback": {
    "rating": "number (an integer score from 1 to 10 based on overall quality)",
    "improvementAreas": "string (a concise paragraph with specific, actionable advice on what to improve)",
    "upskillingSuggestions": [
      "string (a list of 3-5 modern, relevant skills for the candidate to learn, considering the current 2025 job market)"
    ]
  }
}

Now, analyze the following resume text and provide the JSON output:
`;

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

        const sql = `
            INSERT INTO analyses (file_name, name, email, analysis_data)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [
            req.file.originalname,
            analysisJSON.personalDetails.name || 'N/A',
            analysisJSON.personalDetails.email || 'N/A',
            analysisJSON
        ];
        await pool.query(sql, values);

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


router.get('/analyses', async (req, res) => {
    try {
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

router.get('/analyses/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `SELECT analysis_data FROM analyses WHERE id = $1`;
        const { rows } = await pool.query(sql, [id]);

        if (rows.length > 0) {
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
