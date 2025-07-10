// JobCard.js
import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onScreenCandidates }) => {
  return (
    <div className="job-card">
      <h2 className="job-title">{job.title}</h2>
      <p className="company-name">{job.company}</p>
      <p className="job-location">📍 {job.location}</p>

      <div className="job-tags">
        <span className="tag">{job.type}</span>
        <span className="tag">{job.experience}</span>
      </div>

      <p className="job-skills">
        <strong>Skills:</strong> {job.skills}
      </p>

      <button className="screen-btn" onClick={() => onScreenCandidates(job._id)}>
        Screen Candidates
      </button>
    </div>
  );
};

export default JobCard;
