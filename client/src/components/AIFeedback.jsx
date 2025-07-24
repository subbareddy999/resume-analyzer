import React from 'react';

const AIFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="card full-width">
      <h3>🤖 AI Feedback</h3>
      <p><strong>Overall Rating:</strong> {feedback.rating}/10</p>
      <div>
        <strong>Areas for Improvement:</strong>
        <p>{feedback.improvementAreas}</p>
      </div>
      <div>
        <strong>Upskilling Suggestions:</strong>
        <ul>
          {feedback.upskillingSuggestions?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AIFeedback;
