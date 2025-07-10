// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // assuming 'User' model is used for students
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true }); // Prevent duplicate applications

module.exports = mongoose.model("Application", applicationSchema);
