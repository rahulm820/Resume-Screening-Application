const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        enum:["Job Seeker","Recruiter"],
    }
});

module.exports = mongoose.model("user",userSchema);

