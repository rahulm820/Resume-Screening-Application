// RecruiterDashboard.js
import React, { useEffect, useState } from 'react';
import './Recruiter.css';
import JobCard from './PostedJobcard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecruiterDashboard = ({ username = "Yash Paryani" }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false); // loader state

  const fetchJobs = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/getjobs', { authToken });

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePostJob = () => {
    navigate('/postjobform');
  };

  const handleScreenCandidates = async (jobId) => {
    try {
        setScreening(true); // show loader
 
        // Get the token from localStorage
        const token = localStorage.getItem('token'); // Name of the token in localStorage
 
        if (!token) {
            throw new Error("No authentication token found.");
        }
 
        // Make API call to rank candidates
        const response = await axios.post('http://localhost:5000/rankCandidatesForJob', 
            { 
                jobId,
                authToken: token // Sending token in the request body
            }
        );
 
        if (response.data.success) {
            // Navigate to the Ranking page with jobId as a parameter
            console.log("Ranked candidates:", response.data.rankedCandidates);
            
            navigate(`/ranking/${jobId}`, { state: { rankedCandidates: response.data.rankedCandidates } });
        } else {
            alert("Failed to rank candidates.");
        }
    } catch (err) {
        console.error(err);
        alert("Error occurred while screening candidates.");
    } finally {
        setScreening(false); // hide loader
    }
 };

  return (
    <div className="dashboard-container">
      <div className="sidebar">Recruiter Dashboard</div>

      <div className="main-content">
        <div className="topbar">
          <button className="post-job-btn" onClick={handlePostJob}>+ Post Job</button>
          <span className="welcome-text">Welcome, {username}</span>
        </div>

        <div className="job-section">
          <h2 className="job-heading">Your Posted Jobs</h2>

          {loading ? (
            <p className="no-jobs">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="no-jobs">No jobs posted yet.</p>
          ) : (
            <div className="job-list">
              {jobs.map((job, index) => (
                <JobCard key={index} job={job} onScreenCandidates={handleScreenCandidates} />
              ))}
            </div>
          )}

          {screening && <div className="loader-overlay">Screening resumes, please wait...</div>}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
