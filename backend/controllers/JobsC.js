const Job = require("../models/Jobs"); // Assuming the Job model is imported
const Application = require("../models/Application"); // Assuming the Application model is imported

exports.postJob = async (req, res) => {
    try {
        // Extract job details from the request body
        const { title, company, location, type, experience, description, skills } = req.body;

        // Check if all fields are provided
        if (!title || !company || !location || !type || !experience || !description || !skills) {
            return res.status(400).json({
                success: false,
                message: "Please provide all job details"
            });
        }

        // Get the recruiter ID from the logged-in user (assuming the user is logged in and JWT middleware sets user data)
        const recruiterId = req.user.userId;

        // Create a new job posting
        try {
            const newJob = new Job({
                title,
                company,
                location,
                type,
                experience,
                description,
                skills,
                createdBy: recruiterId // Link job to the recruiter who is posting it
            });

            const savedJob = await newJob.save();

            return res.status(201).json({
                success: true,
                message: "Job posted successfully",
                job: savedJob
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in posting job",
                error: error.message
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpected error occurred while posting the job",
            error: error.message
        });
    }
};


exports.getJobsByRecruiter = async (req, res) => {
    try {
        // Get recruiter ID from the logged-in user
        const recruiterId = req.user.userId;

        console.log(recruiterId);
           
        // Check if recruiter ID is provided
        if (!recruiterId) {
            return res.status(400).json({
                success: false,
                message: "Recruiter ID is missing"
            });
        }

        // Fetch jobs created by this recruiter
        const jobs = await Job.find({ createdBy: recruiterId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            jobs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching jobs for this recruiter",
            error: error.message
        });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }); // Sorted by latest first (optional)

        return res.status(200).json({
            success: true,
            message: "All jobs fetched successfully",
            jobs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching all jobs",
            error: error.message
        });
    }
};

exports.applyToJob = async (req, res) => {
    try {
      const { jobId } = req.body;
      const studentId = req.user.userId; // Auth middleware attaches user
  
      // Optional: Check if job exists
      const jobExists = await Job.findById(jobId);
      if (!jobExists) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Create application
      const application = new Application({ jobId, studentId });
  
      await application.save();
  
      return res.status(201).json({
        success: true,
        message: "Applied to job successfully"
      });
  
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "You have already applied to this job"
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error applying to job",
        error: error.message
      });
    }
  };
  
  exports.checkApplication = async (req, res) => {
    try {
        const { jobId } = req.body;
        const studentId = req.user.userId;

        const existingApplication = await Application.findOne({ jobId, studentId });

        if (existingApplication) {
            return res.status(200).json({
                success: true,
                applied: true,
                message: "Student has already applied to this job"
            });
        } else {
            return res.status(200).json({
                success: true,
                applied: false,
                message: "Student has not applied to this job"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking application",
            error: error.message
        });
    }
};