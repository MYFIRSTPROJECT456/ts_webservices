var mysql = require('mysql');
var config = require('./config.js');
/*
var pool = mysql.createPool({

 	host: config._HOST,
    user: config._USER,
    password: config._PASSWORD,
    database: config._DATABASE,
    debug: false,
    multipleStatements: true
});
*/
var connection = mysql.createConnection({
	
            host: config._HOST,
    user: config._USER,
    password: config._PASSWORD,
    database: config._DATABASE,
    debug: false,
    multipleStatements: true
});

module.exports = connection;