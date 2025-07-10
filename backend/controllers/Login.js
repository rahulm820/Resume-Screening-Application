const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require("../models/User");
const { auth } = require('../middlewares/auth');
require('dotenv').config();

exports.signup = async (req,res) =>{

    try {
        //username password role remove
        const {username,password,role} = req.body;
        
        if (!username || !password || !role) {
            return res.status(400).json({
                success:false,
                message:"Enter all fields"
            })
            
        }
        //aleary exist
        const existingUser = await user.findOne({username});

        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:"User Already exists",
            });
        }

        //hash password
        let hashedPassword;
         
        try {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);         
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:"Error in hasing password"
            })
        }

        //store to db

        try {
            const newUser = await user.create({
                username,
                password:hashedPassword,
                role
            })
            
            res.status(200).json({
                success:true,
                message:"user registered succesfully"
            })
            

        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }

    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Unexpected Error occured",
        })
        
    }
}

exports.login = async (req,res) => {
    try {
        //fetch from req
        const {username,password,role} = req.body;

        if(!username || !password || !role) {
            return res.status(400).json({
                success:false,
                message:"Invalid entries",
            })
        }

        //find user via username
        
        let userfound = await user.findOne({username});
        
        if(!userfound) {
           return res.status(401).json({
               success:false,
               message:"User not registed",
           })
        }

        let isCorrect = await bcrypt.compare(password,userfound.password);

        // Create JWT token
        
        if (isCorrect && userfound.role === role) {
            const payload = {
                userId: userfound._id,
                username: userfound.username,
                role: userfound.role
            };

            // console.log(payload);

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            // console.log(token);
            
            return res.status(200).json({
                success: true,
                message: "Login successful",
                auth_token: token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Incorrect password or role",
            });
        }


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}