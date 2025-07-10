const mongoose = require('mongoose');
require("dotenv").config();

const url = process.env.MongoDB_URL;

console.log(url);


exports.connect = async () => {

    mongoose.connect(`${url}`)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
    
}

