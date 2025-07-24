import React from 'react';

const PersonalDetails = ({ details }) => {
  if (!details) return null;

  return (
    <div className="card">
      <h3>👤 Personal Details</h3>
      <p><strong>Name:</strong> {details.name}</p>
      <p><strong>Email:</strong> {details.email}</p>
      <p><strong>Phone:</strong> {details.phone}</p>
      <p><strong>LinkedIn:</strong> <a href={details.linkedin} target="_blank" rel="noopener noreferrer">{details.linkedin}</a></p>
    </div>
  );
};

export default PersonalDetails;
