var Action = require('./../lib/Action.js');
//masters for uncommon insert,update,delete
var FMasterUP={ 
updateImg:function updateImg(post,files,callback){  

var lfiles = files;

        for (var i = files.length; i <= 5; i++) {
            lfiles.push("");
        }

  var user=post;
  var formdata = post;

  async.waterfall([
   approve
   ], function(err, results) {
        return callback(err,results);
   });

  function approve(callback){
   var sql1="UPDATE `tbl_ticketsts` SET img1 = ?,img1 = ?,img1 = ?,img1 = ?,img1 = ? WHERE ticketid = (SELECT tbl_tickets.tktid FROM tbl_tickets WHERE tbl_tickets.txnrefno = ?) AND STATUS = 0";

   var params = [];
        for (var i = 0; i <= files.length; i++) {
            params.push(files[i]);
        }
    params.push(formdata.tktid);
   
   Action.exeDML(sql1,params,null,null,function(err,result){
     return callback(err,result);
   });
 }
},
updateProf:function updateProf(post,files,callback){

}
}
module.exports = FMasterUP;  