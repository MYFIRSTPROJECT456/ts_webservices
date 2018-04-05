var async = require("async");
var Action = require('./../lib/Action.js');
//masters for uncommon insert,update,delete
var FMasterINS={ 
 getFeedbacks:function getFeedbacks(post,callback){  
  var user=post;
  var formdata = post;

  async.waterfall([
  // update_old,
   approve
   ], function(err, results) {
        return callback(err,results);
   });

  function approve(callback){
    if(formdata.rating && formdata.rating == ''){
      formdata.rating = '0';
    }
   var sql1="INSERT INTO `tbl_tktfeedback` ( `tktid`, `tktrefid`, `feedback`, `rating`, `fbby`) VALUES (?,?,?,?,?)"
   var params = [formdata.tktid,formdata.tktid,formdata.feedback,formdata.rating,user.userid];
   Action.exeDML(sql1,params,null,null,function(err,result){
     return callback(err,result);
   });
 }


function update_old(callback){
 var sql1 = "UPDATE `tbl_notifications`  SET status = -1 WHERE notify_id =?";
 var params = [formdata.notiid];
 Action.exeDML(sql1,params,null,null,function(err,result){
   return callback(err,result);
 });
}
},
uptfcm: function uptfcm(post,callback){
var data = post;
 var sql1 = "UPDATE `tbl_login` SET fcmid = ? WHERE refid = ?";
 var params = [data.fcmid,data.userid];
 Action.exeDML(sql1,params,null,null,function(err,result){
   return callback(err,result);
 });
}
}
module.exports = FMasterINS;  
