import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DetailsModal from '../components/DetailsModal';
import './HistoryPage.css';

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the list of all analyses when the component mounts
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        // --- CORRECTED LINE ---
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/analyses`);
        setAnalyses(response.data);
      } catch (err) {
        setError('Failed to fetch analysis history.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  // Handle clicking the "Details" button
  const handleDetailsClick = async (id) => {
    try {
      // --- CORRECTED LINE ---
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/analyses/${id}`);
      setSelectedAnalysis(response.data);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to fetch analysis details.');
    }
  };

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h1>Historical Viewer</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>File Name</th>
            <th>Date Analyzed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((analysis) => (
            <tr key={analysis.id}>
              <td>{analysis.name}</td>
              <td>{analysis.email}</td>
              <td>{analysis.file_name}</td>
              <td>{new Date(analysis.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDetailsClick(analysis.id)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <DetailsModal
          analysisData={selectedAnalysis}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HistoryPage;
