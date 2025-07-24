import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import AIFeedback from '../components/AIFeedback';
import PersonalDetails from '../components/PersonalDetails';
import Skills from '../components/Skills';

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setAnalysisResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a PDF file to upload.');
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(response.data);
      toast.success('Analysis complete!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Live Resume Analysis</h1>
      <form onSubmit={handleSubmit}>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the resume here ...</p>
          ) : (
            <p>Drag & drop a PDF resume here, or click to select a file</p>
          )}
        </div>

        {selectedFile && <p>Selected file: <strong>{selectedFile.name}</strong></p>}

          <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<div />}
          variant="contained"
          type="submit"
          disabled={!selectedFile || loading}
          sx={{
            mt: 2,
            minWidth: '180px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
            '&.Mui-disabled': {
                backgroundColor: '#020300',
                color: '#f5f5f5'
            }
          }}
        >
          <span>{loading ? 'Analyzing...' : 'Analyze Resume'}</span>
        </LoadingButton>

      </form>

      {analysisResult && (
        <div className="results-grid" style={{ marginTop: '2rem' }}>
          <PersonalDetails details={analysisResult.personalDetails} />
          <Skills skills={analysisResult.skills} />
          <AIFeedback feedback={analysisResult.aiFeedback} />
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
