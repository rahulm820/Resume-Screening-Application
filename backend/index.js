const express = require("express");
const app = express();
require("dotenv").config();

const cors = require('cors');
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());


//json parser
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world')
})

//router import
const auth = require("./routes/login");
app.use(auth);

const jobs = require("./routes/jobs");
app.use(jobs);

const resumes = require("./routes/resume");
app.use(resumes);

const screen = require("./routes/screenResume");
app.use(screen);



//db connect
require('./config/database').connect();

// module.exports = app;

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

