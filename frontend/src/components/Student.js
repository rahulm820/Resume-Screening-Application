import React, { useEffect, useState } from 'react';
import './Recruiter.css';
import ApplyCard from './ApplyCom';
import axios from 'axios';

const StudentDashboard = ({ username = "Yash Paryani" }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAllJobs = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/getalljobs', { authToken });

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        console.error("Failed to fetch jobs:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("authToken", localStorage.getItem("token"));

    console.log(formData);
    

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "Resume uploaded successfully!");
      setShowModal(false);
      setResumeFile(null);
    } catch (error) {
      console.error("Resume upload failed:", error.message);
      alert("Failed to upload resume.");
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">Student Dashboard</div>

      {/* Main content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <button className="post-job-btn" onClick={() => setShowModal(true)}>
            Upload Resume
          </button>
          <span className="welcome-text">Welcome, {username}</span>
        </div>

        {/* Centered job section */}
        <div className="job-section">
          <h2 className="job-heading">Available Jobs</h2>

          {loading ? (
            <p className="no-jobs">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="no-jobs">No jobs available right now.</p>
          ) : (
            <div className="job-list">
              {jobs.map((job, index) => (
                <ApplyCard key={index} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Resume Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upload Resume</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="modal-actions">
              <button onClick={handleResumeUpload}>Upload</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
