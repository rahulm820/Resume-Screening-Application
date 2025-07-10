import React, { useState } from 'react';
import './Postjobform.css';
import axios from 'axios';  // Import axios to make API requests

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    experience: 'Fresher',
    description: '',
    skills: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Job:', formData);
  
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    console.log('Token:', token);  // Log the token for debugging
  
    if (!token) {
      return alert('Please log in to post a job!');
    }
  
    try {
      // Make the API request to post the job
      const response = await axios.post(
        'http://localhost:5000/postjob',  // Your backend API endpoint for posting jobs
        { ...formData, authToken: token },  // Send token in the request body along with form data
      );
  
      // Check if response contains a success message
      if (response.data.message === 'success') {
        alert('Job posted successfully!');
      } else {
        alert('Error posting job: ' + response.data.message);
      }
  
      console.log('Job posted successfully:', response.data);
      // You can add additional code to handle success, like redirecting or showing a success message
    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
      // You can add error handling here, like showing an error message
      alert('Error posting job: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-sidebar">
        Post <br /> a new <br /> job
      </div>

      <div className="post-job-content">
        <form onSubmit={handleSubmit} className="job-form">
          <input type="text" name="title" placeholder="Job Title" required value={formData.title} onChange={handleChange} />
          <input type="text" name="company" placeholder="Company Name" required value={formData.company} onChange={handleChange} />
          <input type="text" name="location" placeholder="Job Location" required value={formData.location} onChange={handleChange} />

          <select name="type" required value={formData.type} onChange={handleChange}>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>

          <select name="experience" required value={formData.experience} onChange={handleChange}>
            <option value="Fresher">Fresher</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>

          <textarea name="description" placeholder="Job Description" required rows="4" value={formData.description} onChange={handleChange}></textarea>

          <input type="text" name="skills" placeholder="Required Skills (comma separated)" required value={formData.skills} onChange={handleChange} />

          <button type="submit" className="submit-btn">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
