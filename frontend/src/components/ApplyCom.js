import React, { useEffect, useState } from 'react';
import './JobCard.css';
import axios from 'axios';

const ApplyCard = ({ job }) => {
  const [hasApplied, setHasApplied] = useState(false); // State to store if the user has applied
  const [loading, setLoading] = useState(false); // State to handle loading state

  // Function to check if the user has already applied to the job
  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

      const response = await axios.post('http://localhost:5000/checkapplication', {
        jobId: job._id,
        authToken: token // Sending authToken in request body
      });

      if (response.data.applied) {
        setHasApplied(true);
      } else {
        setHasApplied(false);
      }
    } catch (error) {
      console.error("Error checking application status", error);
    }
  };

  // Function to handle applying to a job
  const handleApply = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

      const response = await axios.post('http://localhost:5000/applytojob', {
        jobId: job._id,
        authToken: token // Sending authToken in request body
      });

      if (response.data.success) {
        setHasApplied(true); // Mark as applied after successful application
      }
    } catch (error) {
      console.error("Error applying to job", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check application status when component mounts
    checkApplicationStatus();
  }, []);

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

      {/* Conditionally render Apply button or Applied Successfully message */}
      {hasApplied ? (
        <button className="apply-btn" disabled>
          Applied Successfully
        </button>
      ) : (
        <button className="apply-btn" onClick={handleApply} disabled={loading}>
          {loading ? 'Applying...' : 'Apply'}
        </button>
      )}
    </div>
  );
};

export default ApplyCard;
