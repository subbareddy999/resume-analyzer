import axios from 'axios';
import React, { useState } from 'react';
import AIFeedback from '../components/AIFeedback';
import PersonalDetails from '../components/PersonalDetails';
import Skills from '../components/Skills';

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setAnalysisResult(null); // Reset previous results
    setError(''); // Reset previous errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Live Resume Analysis</h1>
      <div className="upload-box">
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button type="submit" disabled={!selectedFile || loading}>
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Please wait, the AI is analyzing your resume...</p>}

      {analysisResult && (
        <div className="results-grid">
          <PersonalDetails details={analysisResult.personalDetails} />
          <Skills skills={analysisResult.skills} />
          <AIFeedback feedback={analysisResult.aiFeedback} />
          {/* You can add more components here for work experience, education etc. */}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
