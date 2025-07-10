const express = require("express");
const router = express.Router();
const { uploadResume } = require("../controllers/ResumeC");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/upload",upload.single("resume"),auth,uploadResume);

module.exports = router;
