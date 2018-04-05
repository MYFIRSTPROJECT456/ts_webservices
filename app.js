var express = require('express'),
    http = require('http'),
    path = require('path')


var app = express();
var bodyParser = require("body-parser");

global.url = "http://172.104.17.202/lms/ts_webservices";
global.imgurl = "http://172.104.17.202/lms/ts_webservices/";

// all environments
app.set('port', process.env.PORT || 4009);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//common routes
var services = require('./routes/services');
var upload = require('./upload');

app.use('/', services);
app.post('/upload', upload.upload);

//listen to port
var server = app.listen(4009);
server.on('connection', function(socket) {
    socket.setTimeout(30 * 60 * 1000);
});
