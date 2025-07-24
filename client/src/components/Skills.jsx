import React from 'react';

const Skills = ({ skills }) => {
  if (!skills) return null;

  return (
    <div className="card">
      <h3>🛠️ Skills</h3>
      <div>
        <strong>Technical Skills:</strong>
        <p>{skills.technicalSkills?.join(', ')}</p>
      </div>
      <div>
        <strong>Soft Skills:</strong>
        <p>{skills.softSkills?.join(', ')}</p>
      </div>
    </div>
  );
};

export default Skills;
