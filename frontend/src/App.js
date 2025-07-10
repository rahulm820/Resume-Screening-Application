// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Recruiter from './components/Recruiter';
import PostJobForm from './components/Postjobform';
import StudentDashboard from './components/Student';
import Ranking from './components/Ranking';
import RecruiterDashboard from './components/Recruiter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />     
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/postjobform" element={<PostJobForm />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/ranking/:jobId" element={<Ranking />} />

      </Routes>
    </Router>
  );
}

export default App;
