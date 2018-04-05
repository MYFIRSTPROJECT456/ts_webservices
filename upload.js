var async = require('async');
var fs = require("fs");
var multer = require('multer');

exports.upload = function(req, res) {

    var files = [];
    var custid,coid="",userid="";
    var filewithdir, doc_name = '',
    doc_desp = '';
    var post;

    var Storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, "./Contents");
        },
        filename: function(req, file, callback) {
            // filename = coid + "_" + enid + "_" + Date.now() + "_" + file.originalname;
            filename =  file.originalname;
            var i = filename.lastIndexOf('.');
            extesion = (i < 0) ? '' : filename.substr(i);
            filewithdir = 'Contents/' + filename;
            files.push(filewithdir);
            callback(null, filename);
        }
    });

    var upload = multer({
        storage: Storage
    }).array("imgUploader", 5); //Field name and max count 
    upload(req, res, function(err) {
        if (err) {
            console.log("Upload request error",err);
        }
        post = req.body;
        console.log("Upload request",post,files.length);
        sendresult(err);
    });
    function sendresult(err){
        if(files.length == 0 || err){
            var resp ={
                status: '1',
                status_msg : 'Failed'
            }
            res.send(resp);
        }else{
            var resp ={
                status: '0',
                status_msg : 'success'
            }
            res.send(resp);
        }
    }
}
