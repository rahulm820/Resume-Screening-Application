const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        const authToken  = req.body.authToken;  // Get token from the request body
        console.log(req.body);
        console.log(authToken);
        

        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: 'Token missing or invalid',
            });
        }

        const payload = jwt.verify(authToken, process.env.JWT_SECRET);  // Verify token using the secret
        req.user = payload;  // Add user details to request
        console.log(req.user);
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
};




exports.IsRecruiter = (req,res,next) => {
    try{
            if(req.user.role !== "Recruiter") {
                return res.status(401).json({
                    success:false,
                    message:'This is a protected route for recruiters',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.IsJobSeeker = (req,res,next) => {
    try{
            if(req.user.role !== "Job Seeker") {
                return res.status(401).json({
                    success:false,
                    message:'This is a protected route for seekers',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}
