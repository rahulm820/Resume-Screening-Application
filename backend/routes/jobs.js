const express = require('express');
const router = express.Router();

// Import controllers
const { postJob , getJobsByRecruiter, getAllJobs , applyToJob ,checkApplication} = require('../controllers/JobsC');

// Import middleware for authentication
const { auth } = require('../middlewares/auth');

// Route to post a job (protected by auth middleware)
router.post('/postjob', auth, postJob);
router.post('/getjobs', auth, getJobsByRecruiter);
router.post('/getalljobs', auth, getAllJobs);
router.post('/applytojob', auth, applyToJob);
router.post('/checkapplication', auth, checkApplication);
module.exports = router;
