const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Freelance'],
    default: 'Full-Time'
  },
  experience: {
    type: String,
    enum: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
    default: 'Fresher'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter', // Assuming there's a recruiter model for the one posting the job
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Job Model
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
