const Resume = require("../models/Resume");
const path = require("path");
const fs = require("fs");

exports.uploadResume = async (req, res) => {
    try {
        const userId = req.user.userId; // from JWT middleware
        const file = req.file;

        // Check if file was uploaded
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No resume file uploaded",
            });
        }

        // Save resume info to DB
        const newResume = new Resume({
            userId,
            filePath: file.path, // or use file.filename if you're storing only file name
        });

        await newResume.save();

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: newResume,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading resume",
            error: error.message,
        });
    }
};
