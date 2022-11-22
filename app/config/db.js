'use strict';
var mongoose = require('mongoose');
//All models schema test
require("../api/v1/modules/user/models/user_model");

if (!process.env.NODE_ENV || process.env.NODE_ENV == undefined) {
	process.env.NODE_ENV = 'local';
}
const config = require('./config').get(process.env.NODE_ENV);

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV == 'local' || process.env.NODE_ENV == undefined) {
	console.log("coming to local connect")
	mongoose.connect(config.DATABASE.DB_URL, {
		keepAlive: 1,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModity: false
	});
} else {
	console.log("coming here db ")
	mongoose.connect(config.DATABASE.DB_URL, {
		user: config.DATABASE.user,
		pass: config.DATABASE.pass,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	});
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
	console.log("Database connected successfully!");
});