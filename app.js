var express = require('express');
const dotenv = require('dotenv');
var path = require('path');
var cors = require('cors');
dotenv.config({
    path: './app/config/Config.env'
});
const cookieparcer = require('cookie-parser');
require('./app/config/db');
global.__rootRequire = function (relpath) {
    return require(path.join(__dirname, relpath));
};
const app = express();
const RunningPort = process.env.PORT || 9000;
const errorhandler = require('./app/lib/errorhandler');
const moment = require('moment');
// configure cors for OPTIONS
app.use('/uploads/profile', express.static(path.join(__dirname, './app/uploads/profile')));


var whitelist = [ 'http://localhost:9005']

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            credentials: true
        } // reflect (enable) the requested origin in the CORS response
    } else {
       
        corsOptions = {
            origin: false
        } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));
// configure end
//Route Import
const authuser = require('./app/api/v1/modules/user/routes/user_routes');
//MiddleWare
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieparcer());

//--All Routes
app.use('/api/v1/user', authuser);
// All api requests
app.use(function (req, res, next) {
    // CORS headers
    const origin = req.headers.origin;
    if (whitelist.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data');

    if (req.method == 'OPTIONS') {
        // console.log("http options matched")
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Max-Age', 120);
        res.status(200).end();
    } else {
        
        next();
    }
});

app.use(errorhandler);
const server = app.listen(RunningPort, () => {
    console.log(`Server is Listning ${RunningPort}`);
});

//handle unhandle rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`error is ${err.message}`, err);
    server.close(() => process.exit(1));

});

