var Action = require('./../lib/Action.js');
var async = require('async');
var Ticket={ 
 raiseticket:function raiseticket(posts,callback){
  var post =posts;
  var enid = post.userid;
  var custid = enid;

  async.waterfall([
    getcutomerdata,
    savedata,
    getTicketNo
    ], function(error, success) {
      // console.log("Ticket raise",error,success);
      if (error) {
                // console.log('Something is wrong!', error);
                var resp = {
                  status: "1",
                  status_msg: error["sqlMessage"]
                };
                return callback(error, resp);
              } {
                var resp = {
                  status: "0",
                  status_msg: "Success",
                  new_id: success.data[0].txnrefno
                };
                return callback(null, resp);
              }
            });

  function getcutomerdata(callback) {
    var sql1 = "SELECT mobileno,email FROM tbl_users WHERE uid =?"
    var params = [custid];
    Action.exeSEL(sql1,params,null,null,function(err,result){
      callback(err, result.data);
    });
  }

  function getTicketNo(result,callback) {
    var ticketid= result.new_id;
    var sql1 = "SELECT txnrefno FROM `tbl_tickets` WHERE tktid = ?"
    var params = [ticketid];
    Action.exeSEL(sql1,params,null,null,function(err,result){
      callback(err, result);
    });
  }

  function savedata(customerdata, callback) {
    var txnrefno = new Date().getTime();
    var imgurl1 = post.img1  ? "Contents/"+post.img1 : post.img1 ;
    var imgurl2 = post.img2  ? "Contents/"+post.img2 : post.img2 ;
    var imgurl3 = post.img3  ? "Contents/"+post.img3 : post.img3 ;
    var imgurl4 = post.img4  ? "Contents/"+post.img4 : post.img4 ;
    var imgurl5 = post.img5  ? "Contents/"+post.img5 : post.img5 ;

        // console.log("customer data", customerdata);
        var sql1 = "INSERT INTO `tbl_tickets` (`coid`,`usrid`, `contactno`, `contactemail`, `unitid`, `tkttype`, `issuedetails`, `imgurl1`, `imgurl2`, `imgurl3`, `imgurl4`, `imgurl5`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"

        var params = [post.coid, custid, customerdata[0].mobileno, customerdata[0].email, post.units, post.tkttype, post.issue_desc,imgurl1,imgurl2,imgurl3,imgurl4,imgurl5];

        Action.exeDML(sql1,params,null,null,function(err,result){
          callback(err, result);
        });
      }

    },
    gettktsts:function gettktsts(post,callback){
      var userinfo = post;

      var roleid = userinfo["roleid"];
      var userid = userinfo["userid"];
	var sql1 = "SELECT dategen,ticketid,srvNo,tktstsname,tktsts,cowner,assignto,RaisedBy,userid,unitid,unitname,tkttype,tkttypename,issuedetails,TargetDept,Notes,imgurl1,imgurl2,imgurl3,imgurl4,imgurl5,date_format(dategen,'%m/%d/%Y') as dategen,CONCAT(FLOOR(HOUR(TIMEDIFF(date(now()),date(dategen))) / 24), ' days ',MOD(HOUR(TIMEDIFF(str_to_date(date_format(now(),'%m/%d/%Y %H:%i'),'%m/%d/%Y %H:%i'),str_to_date(date_format(dategen,'%m/%d/%Y %H:%i'),'%m/%d/%Y %H:%i'))), 24), ' hrs ',MINUTE(TIMEDIFF(str_to_date(date_format(now(),'%m/%d/%Y %H:%i'),'%m/%d/%Y %H:%i'),str_to_date(date_format(dategen,'%m/%d/%Y %H:%i'),'%m/%d/%Y %H:%i'))), ' mins') as age,search_tag FROM `vw_ticket_status` ";	    
	    var params = [];

      if (roleid == "42" || roleid == "41") {
        sql1 += " WHERE CONCAT(',', unitid, ',') REGEXP concat(',',(SELECT REPLACE(tbl_users.units,',','|') FROM tbl_users WHERE uid = ?),',')  ORDER BY 3 DESC";
        params = [userid];
      }	
	else if (roleid == "137") {
          sql1 += "  WHERE find_in_set(tkttype, (SELECT GROUP_CONCAT(tbl_tksdepmap.tkttype) FROM tbl_tksdepmap WHERE find_in_set(tbl_tksdepmap.depids,(SELECT tbl_users.deptid FROM tbl_users WHERE tbl_users.uid = ?))))  ORDER BY 3 DESC";
        params = [userid];
	} else if  ( roleid == "40")  {
          sql1 += " WHERE assignto = ?  ORDER BY 3 DESC";
          params = [userid];
        } else {
	  sql1 += " ORDER BY 3 DESC";
	}
      

      Action.exeSEL(sql1,params,null,null,function(err,result){
       return callback(err,result); 
     });
    },
    gettkt:function gettkt(post,callback){

      var post = post;
      var id = post.tktid;
      var sql1 = "SELECT * FROM `vw_ticket_status` WHERE ticketid = ?";
      var params = [id];

      Action.exeSEL(sql1,params,null,null,function(err,result){
       return callback(err,result);
     });

    },
    approve:function approve(post,callback){

      var lid=post.tktid;
      var sanctionid=post.sanctionid;

      async.waterfall([
       update_old,
       approve,
       changeStatus
       ], function(err, results) {
        return callback(err,results);
      });

      function approve(presult,callback){

       var sql1="insert into tbl_ticketsts(coid,ticketid,ticketsts,assignto,assignby,Notes,img1,img2,img3,img4,img5) (SELECT coid, ? as ticketid,4 as ticketsts, assignto,assignby,'Approved' as Notes, img1,img2,img3,img4,img5 FROM `tbl_ticketsts` WHERE ticketid = ? ORDER by txnid DESC LIMIT 1)"
       var params = [lid,lid];
       Action.exeDML(sql1,params,null,null,function(err,result){
         return callback(err,result);
       });
     }


     function update_old(callback){
       var sql1 = "UPDATE `tbl_ticketsts` SET `sts` = '-1' WHERE `tbl_ticketsts`.`ticketid` = ?";
       var params = [lid];
       Action.exeDML(sql1,params,null,null,function(err,result){
         return callback(err,result);
       });
     }

     function changeStatus(presult,callback){
      var sql1 = "UPDATE `tbl_sanctions` SET status = -1 WHERE sanctionid = (select b.min_s FROM ( SELECT max(a.sanctionid) as min_s FROM tbl_sanctions a WHERE a.txnrefno = ? AND a.status = 0) b)";
      var params = [lid];

      Action.exeDML(sql1,params,null,null,function(err,result){
       return callback(err,result);
     });
    }


  } ,
  reject:function reject(post,callback){


    var lid=post.tktid;
    var sanctionid=post.sanctionid;

    async.waterfall([
      update_old,
      reject,
      changeStatus
      ], function(err, results) {
       return callback(err,results); 
     });

    function reject(result,callback){

     var sql1="insert into tbl_ticketsts(coid,ticketid,ticketsts,assignto,assignby,Notes,img1,img2,img3,img4,img5) (SELECT coid, ? as ticketid,3 as ticketsts, assignto,assignby,'Rejected' as Notes, img1,img2,img3,img4,img5 FROM `tbl_ticketsts` WHERE ticketid = ? ORDER by txnid DESC LIMIT 1)"
     var params = [lid,lid];
     Action.exeDML(sql1,params,null,null,function(err,result){
       return callback(err,result);
     });
   }


   function update_old(callback){
     var sql1 = "UPDATE `tbl_ticketsts` SET `sts` = '-1' WHERE `tbl_ticketsts`.`ticketid` = ?";
     var params = [lid];
     Action.exeDML(sql1,params,null,null,function(err,result){
       return callback(err,result);
     });
   }

   function changeStatus(presult,callback){
    var sql1 = "UPDATE `tbl_sanctions` SET status = -1 WHERE sanctionid = (select b.min_s FROM ( SELECT max(a.sanctionid) as min_s FROM tbl_sanctions a WHERE a.txnrefno = ? AND a.status = 0) b)";
    var params = [lid];

    Action.exeDML(sql1,params,null,null,function(err,result){
     return callback(err,result);
   });
  }
},
//change to image wala
updatetkt:function updatetkt(post,callback){

  var userid = post.userid;
  var ticketid = post.tktid;

  async.waterfall([
    update_old,
    insert_new
    ], function(error, success) {
      if (error) {
        var resp = {
          status: "1",
          status_msg: error["sqlMessage"]
        };
        return callback(error,resp);
      }{
        var resp = {
          status: "0",
          status_msg: "Success"
        };
        return callback(error,resp);
      }
    });
  
  function update_old(callback){
   var sql1 = "UPDATE `tbl_ticketsts` SET `sts` = '-1' WHERE `tbl_ticketsts`.`ticketid` = ?";
   var params = [ticketid];
   Action.exeDML(sql1,params,null,null,function(err,result){
     return callback(err,result);
   });
 }


 function insert_new(presult, callback) {
    var imgurl1 = post.img1  ? "Contents/"+post.img1 : post.img1 ;
    var imgurl2 = post.img2  ? "Contents/"+post.img2 : post.img2 ;
    var imgurl3 = post.img3  ? "Contents/"+post.img3 : post.img3 ;
    var imgurl4 = post.img4  ? "Contents/"+post.img4 : post.img4 ;
    var imgurl5 = post.img5  ? "Contents/"+post.img5 : post.img5 ;
  var sql1 = "INSERT INTO `tbl_ticketsts` (`coid`, `ticketid`, `ticketsts`, `assignto`,`assignby`, `Notes`,img1,img2,img3,img4,img5) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

  var params = [post.coid, ticketid, post["status"], post["assign_to"], userid, post["notes"],imgurl1,imgurl2,imgurl3,imgurl4,imgurl5];
  Action.exeDML(sql1,params,null,null,function(err,result){
console.log("update",err,result);
	  callback(err, result);
  });
} 
}
}
module.exports = Ticket; 
