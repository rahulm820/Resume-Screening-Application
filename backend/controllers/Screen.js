// Updated rankCandidatesForJob to call the Flask API for actual scoring
const axios = require("axios");
const Job = require("../models/Jobs");
const Application = require("../models/Application");
const Resume = require("../models/Resume");
const User = require("../models/User");

exports.rankCandidatesForJob = async (req, res) => {
  try {
    const { jobId } = req.body; // Job ID sent from frontend

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const applications = await Application.find({ jobId })
      .populate("studentId")
      .populate("jobId");

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this job",
      });
    }

    const resumePaths = [];
    const studentMap = {};

    for (const application of applications) {
      const resume = await Resume.findOne({ userId: application.studentId._id });
      if (resume && resume.filePath) {
        resumePaths.push(resume.filePath);
        studentMap[resume.filePath] = {
          studentId: application.studentId._id,
          name: application.studentId.username,
        };
      }
    }

    if (resumePaths.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resumes found for applications",
      });
    }

    const flaskResponse = await axios.post("http://localhost:5001/score_resumes", {
      resume_paths: resumePaths,
      job_description: {
        description: job.description,
        experience: job.experience
      }
    });

    const rankedData = flaskResponse.data.ranked_resumes;

    console.log(rankedData);
    

    const rankedCandidates = rankedData.map((entry, index) => ({
      rank: index + 1,
      name: studentMap[entry.resume_path].name,
      studentId: studentMap[entry.resume_path].studentId,
      resumePath: entry.resume_path,
      score: entry.score
    }));

    return res.status(200).json({
      success: true,
      message: "Candidates ranked successfully",
      rankedCandidates
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while ranking candidates",
      error: error.message
    });
  }
};
