import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Ranking.css'; // optional for styling

const Ranking = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState(location?.state?.rankedCandidates || []);

  useEffect(() => {
    if (!candidates.length) {
      alert("No ranked candidates found.");
      navigate('/recruiter');
    }
  }, [candidates, navigate]);

  return (
    <div className="ranking-container">
      <h2>Ranked Candidates for Job ID: {jobId}</h2>
      
      <button className="back-btn" onClick={() => navigate('/recruiter')}>⬅ Back to Dashboard</button>

      <table className="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Candidate Name</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={candidate.studentId}>
              <td>{index + 1}</td>
              <td>{candidate.name}</td>
              <td>
                <a
                  href={`http://localhost:5000/${candidate.resumePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
