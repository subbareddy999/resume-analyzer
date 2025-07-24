# 📄 Resume Analyzer AI

This is a full-stack web application that allows users to upload their resumes in PDF format, receive an automated analysis, and get AI-driven feedback for improvement using the Google Gemini API.

---

## ✨ Features

* **Live Resume Analysis**: Upload a PDF and get instant, structured feedback.
* **AI-Powered Insights**: Extracts personal details, work experience, skills, and provides a resume rating, improvement areas, and upskilling suggestions.
* **Historical Viewer**: View all previously analyzed resumes in a neat table.
* **Detailed Modal View**: Click on any past analysis to see the full, detailed results.

---

## 🛠️ Technologies Used

* **Frontend**: React.js (with Vite), Axios
* **Backend**: Node.js, Express.js
* **Database**: MySQL
* **AI**: Google Gemini API
* **File Handling**: Multer (for uploads), PDF-Parse (for text extraction)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:
* [Node.js](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com/) or any MySQL-compatible database.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/resume-analyzer.git](https://github.com/your-username/resume-analyzer.git)
    cd resume-analyzer
    ```

2.  **Setup the Backend (`server`):**
    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory and add your credentials
    # Use the .env.example file as a guide
    ```
    Your `server/.env` file should look like this:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=resume_db
    GEMINI_API_KEY=your_google_ai_api_key
    ```
    ```bash
    # Run the database schema query from 'database.sql' to set up your table
    # Start the server
    npm start
    ```
    The server will run on `http://localhost:5000`.

3.  **Setup the Frontend (`client`):**
    ```bash
    # Navigate to the client directory from the root folder
    cd client

    # Install dependencies
    npm install

    # Start the client
    npm run dev
    ```
    The client will run on `http://localhost:5173`.

---
