const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro"});

// --- PROMPT 1: BASIC ANALYSIS (Final Version) ---
const basicPrompt = `
You are a highly experienced technical recruiter and career coach with expertise in software engineering resumes. Your task is to meticulously analyze the provided resume text and convert it into a structured JSON object.

The output MUST be a single, raw JSON object, without any surrounding text, explanations, or markdown formatting like \`\`\`json.

The JSON object must strictly adhere to the following structure. Do not add or remove any keys. If a piece of information is not found, use an empty string "" for string values, an empty array [] for array values, or null where appropriate.

{
    "personalDetails": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string (full URL, e.g., 'https://linkedin.com/in/username') | null",
    "github": "string (full URL, e.g., 'https://github.com/username') | null",
    "portfolio": "string (full URL) | null"
  },
  "resumeContent": {
    "summary": "string",
    "workExperience": [
      {
        "role": "string",
        "company": "string",
        "dates": "string (e.g., 'Jan 2022 - Present')",
        "description": ["string"]
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
    "certifications": ["string"]
  },
  "skills": {
    "technicalSkills": ["string"],
    "softSkills": ["string"]
  },
  "aiFeedback": {
    "rating": "number (an integer score from 1 to 10 based on overall quality)",
    "improvementAreas": ["string (a list of 3-5 concise, actionable improvement tips)"],
    "upskillingSuggestions": ["string (a list of 3-5 modern, relevant skills for the candidate to learn, considering the current 2025 job market)"],
    "targetedRoles": ["string (a list of 3-5 specific job titles this candidate is a good fit for)"]
  },
  "atsAnalysis": {
    "overallScore": "number (an integer from 0 to 100 representing ATS compatibility)",
    "issues": [
      {
        "type": "'error' | 'warning' | 'success'",
        "category": "string (e.g., 'Formatting', 'Keywords', 'Sections', 'Contact Info')",
        "message": "string (a concise description of the issue or success)"
      }
    ]
  },
  "skillsAnalysis": {
      "technicalSkills": [
          {
              "name": "string (e.g., 'React')",
              "proficiency": "number (a score from 0-100 representing the candidate's proficiency based on the resume)",
              "marketDemand": "number (a score from 0-100 representing current market demand for this skill)"
          }
      ]
  }
}

Now, analyze the following resume text and provide the JSON output. For the skillsAnalysis, provide data for the top 5-7 most prominent technical skills found in the resume.
`;

// --- PROMPT 2: ADVANCED JOB MATCH ANALYSIS (Final Version) ---
const jobMatchPrompt = `
You are a highly experienced technical recruiter and career coach. Your task is to meticulously analyze a resume against a provided job description and convert your findings into a structured JSON object.

The output MUST be a single, raw JSON object without any surrounding text or markdown.

The JSON object must strictly adhere to the following structure. It must contain all original keys plus "jobMatchAnalysis" and the new "atsAnalysis" key.

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
        "description": ["string"]
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
    "certifications": ["string"]
  },
  "skills": {
    "technicalSkills": ["string"],
    "softSkills": ["string"]
  },
  "aiFeedback": {
    "rating": "number (an integer score from 1 to 10 based on overall quality)",
    "improvementAreas": ["string (a list of 3-5 concise, actionable improvement tips)"],
    "upskillingSuggestions": ["string (a list of 3-5 modern, relevant skills for the candidate to learn, considering the current 2025 job market)"],
    "targetedRoles": ["string (a list of 3-5 specific job titles this candidate is a good fit for based on the resume and job description)"]
  },
  "jobMatchAnalysis": {
    "matchScore": "number (an integer score from 0 to 100 representing how well the resume matches the job description)",
    "matchingKeywords": ["string (a list of key skills and technologies found in both the resume and the job description)"],
    "missingKeywords": ["string (a list of key skills from the job description that are missing from the resume)"],
    "summary": "string (a concise paragraph summarizing the candidate's fit for the role and giving actionable advice on how to tailor the resume better for this specific job)"
  },
  "atsAnalysis": {
    "overallScore": "number (an integer from 0 to 100 representing ATS compatibility)",
    "issues": [
      {
        "type": "'error' | 'warning' | 'success'",
        "category": "string (e.g., 'Formatting', 'Keywords', 'Sections', 'Contact Info')",
        "message": "string (a concise description of the issue or success)"
      }
    ]
  },
  "skillsAnalysis": {
      "technicalSkills": [
          {
              "name": "string (e.g., 'React')",
              "proficiency": "number (a score from 0-100 representing the candidate's proficiency based on the resume)",
              "marketDemand": "number (a score from 0-100 representing current market demand for this skill, especially in the context of the provided job description)"
          }
      ]
  }
}

Now, analyze the following resume text against the job description text and provide the complete JSON output. For the skillsAnalysis, provide data for the top 5-7 most prominent technical skills found in the resume.
`;


router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded.' });
        }

        const { jobDescription } = req.body;

        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;

        let promptToUse;
        let contentForAI;

        if (jobDescription && jobDescription.trim() !== "") {
            console.log("-> Performing ADVANCED analysis with job description.");
            promptToUse = jobMatchPrompt;
            contentForAI = [
                promptToUse,
                "RESUME TEXT:",
                resumeText,
                "JOB DESCRIPTION TEXT:",
                jobDescription
            ];
        } else {
            console.log("-> Performing BASIC analysis without job description.");
            promptToUse = basicPrompt;
            contentForAI = [promptToUse, resumeText];
        }

        const result = await model.generateContent(contentForAI);
        const response = await result.response;
        let analysisText = response.text();
        analysisText = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysisJSON = JSON.parse(analysisText);

        console.log('✅ Analysis complete.');
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

module.exports = router;
