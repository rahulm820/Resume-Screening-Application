const express = require('express');
const router = express.Router();

// Import controllers
const {rankCandidatesForJob} = require('../controllers/Screen');

// Import middleware for authentication
const { auth } = require('../middlewares/auth');

router.post("/rankCandidatesForJob",auth,rankCandidatesForJob);

module.exports = router;
 