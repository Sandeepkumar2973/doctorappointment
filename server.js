const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
var cors = require('cors')
 const path = require('path');

//dotenv--
dotenv.config();

// mongodb coonectio========
connectDB();
app.use(cors());


// rest object----
 const app = express();

 //middlewares----------
 app.use(express.json());

 app.use(morgan('dev'));

 //routes----


app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));


app.use(express.static(path.join(__dirname, './clients/build')))
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, "./clients/build/index.html"));
});
 // port---
 const port = process.env.PORT || 8080

 //listen port-----
 app.listen(port, ()=>{
    console.log(
        `server is running on >>>>${process.env.NODE_MODE}${port}`.bgCyan.black
    )
 })