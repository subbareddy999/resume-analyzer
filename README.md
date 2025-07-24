```markdown
# 📄 AI Resume Analyzer

<div align="center">

**A full-stack web application that leverages the Google Gemini API to provide intelligent analysis and feedback on resumes. This tool is designed to help users optimize their resumes by identifying strengths, weaknesses, and areas for improvement.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

### 🚀 **[Live Demo]([your-live-demo-url])**

<br/>

<div align="center">
  <a href="[your-live-demo-url]">
    <img src="./screenshots/demo.gif" alt="Application Demo GIF" width="900"/>
  </a>
</div>

---

## ✨ Features

-   **🤖 AI-Powered Analysis**: Upload a PDF resume and get instant, structured feedback from Google's Gemini LLM.
-   **📊 Structured Data Extraction**: Automatically parses and categorizes personal details, work experience, education, skills, and more.
-   **⭐ Resume Scoring & Feedback**: Provides an objective score, detailed improvement areas, and relevant upskilling suggestions.
-   **🗂️ Historical Viewer**: Browse all previously analyzed resumes in a clean, sortable table with a detailed modal view.
-   **💅 Modern UI/UX**: A responsive and intuitive interface built with Material-UI, featuring a drag-and-drop uploader and toast notifications for a smooth user experience.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                                   |
| :-----------  | :----------------------------------------------------------------------------------------------------------- |
| **Frontend**  | React.js (Vite), Axios, Material-UI (MUI), `react-hot-toast`, `react-dropzone`                               |
| **Backend**   | Node.js, Express.js                                                                                          |
| **Database**  | PostgreSQL                                                                                                   |
| **AI**        | Google Gemini API (`@google/generative-ai`)                                                                  |
| **File API**  | Multer (for file uploads), PDF-Parse (for text extraction)                                                   |
| **Deployment**| **Frontend**: Vercel <br /> **Backend & Database**: Render                                                   |

---

## 📂 Project Structure

A clear and organized project structure to maintain scalability and readability.

resume-analyzer/
|
├── client/
|   ├── public/
|   ├── src/
|   |   ├── components/
|   |   ├── pages/
|   |   ├── App.jsx
|   |   ├── index.css
|   |   └── main.jsx
|   ├── .env.local
|   └── package.json
|
└── server/
├── routes/
|   └── analysis.js
├── .env
├── database.sql
├── index.js
└── package.json

## ⚙️ Local Development Setup

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [PostgreSQL](https://www.postgresql.org/download/)

### Installation Guide

1.  **Clone the Repository**
    ```bash
    git clone [your-github-repo-url]
    cd resume-analyzer
    ```

2.  **Backend Setup**
    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install
    ```
    -   Create a `.env` file in the `/server` directory and add your credentials:
        ```env
        # Example for a local PostgreSQL database
        DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/resume_db"
        GEMINI_API_KEY="your_google_ai_api_key"
        ```
    -   In your local PostgreSQL instance, create a new database named `resume_db`.
    -   Run the schema file to create the `analyses` table:
        ```bash
        psql -U YOUR_USERNAME -d resume_db -f database.sql
        ```
    -   Start the backend server:
        ```bash
        npm start
        ```
        The server will be running on `http://localhost:5000`.

3.  **Frontend Setup**
    ```bash
    # From the root folder, navigate to the client directory
    cd ../client

    # Install dependencies
    npm install
    ```
    -   Create a `.env.local` file in the `/client` directory and add the backend API URL:
        ```env
        VITE_API_BASE_URL="http://localhost:5000"
        ```
    -   Start the frontend development server:
        ```bash
        npm run dev
        ```
        The app will be accessible at `http://localhost:5173`.

---

## 🔌 API Endpoints

The backend provides the following RESTful API endpoints to support the application's functionality.

| Method | Endpoint            | Description                                            |
| :----- | :----------------   | :----------------------------------------------------  |
| `POST` | `/api/analyze`      | Uploads a resume PDF for analysis and saves the result.|
| `GET`  | `/api/analyses`     | Retrieves a summary list of all past analyses.         |
| `GET`  | `/api/analyses/:id` | Retrieves the full details of a single analysis by ID. |

---

## 👤 Author

**Subbareddy Karri**

-   **GitHub**: [@subbareddy999](https://github.com/subbareddy999)
-   **LinkedIn**: [in/subbareddykarri](https://www.linkedin.com/in/subbareddykarri/)
