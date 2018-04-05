var Action = require('./../lib/Action.js');

//masters for uncommon select
var FMaster_SEL={ 
   getkpis:function getkpis(post,callback){

    var params =[];
    var sql1 = "SELECT COUNT(units)as unit_count,(SELECT COUNT(uid) FROM tbl_users) as user_count,(SELECT COUNT(uid) FROM tbl_users) as receivable_count,(SELECT COUNT(tktid) FROM `tbl_tickets`) as ticket_count FROM `tbl_users` WHERE units IS NOT Null";
    
    Action.exeSEL(sql1,params,null,null,function(err,result){
        return callback(err,result);  
    });
},
getnotification:function getnotification(post,callback){

 
var userid=post.userid;

var sql1 = "SELECT notify_id, senderid, receiverid, reftxnid ,fcmid, title, notify_type, notify_url, click_action, msg, data,  date_format(date_gen,'%m/%d/%Y') as date_gen,(SELECT username FROM tbl_users WHERE uid=senderid) as sender,concat(reftxn,title,msg,(SELECT username FROM tbl_users WHERE uid=senderid)) as search_tag  FROM `tbl_notifications` WHERE FIND_IN_SET(?,REPLACE(receiverid,' ','')) and status = 0   ORDER BY 1 DESC ";
    var params=[userid];

  Action.exeSEL(sql1, params, null, null, function(err, results) {
     return callback(err,results);  
    });
},
getTicketHistory:function getTicketHistory(post,callback){

var  lid=post.tktid;
  var user = post;

  var arr_sql_param = [];
  var arr_sql_param_obj={};

//main ticket Details
arr_sql_param_obj.sql = "SELECT tktid,txnrefno as srvNo,(select tbl_login.enname from tbl_login WHERE tbl_login.refid = usrid) as raisedby,contactno,contactemail,(select group_concat(tbl_units.unitname) from tbl_units WHERE find_in_set(tbl_units.unitid,tbl_tickets.unitid)) as unit,(select tbl_codevalue.cvvalule from tbl_codevalue WHERE tbl_codevalue.cvid = tkttype) as tkttype,tkttype as tkttypeid,issuedetails,  date_format(dategen,'%m/%d/%Y %H:%i:%s ') as dategen  FROM `tbl_tickets` WHERE tktid =?";
arr_sql_param_obj.params = [lid];

arr_sql_param.push(arr_sql_param_obj);
arr_sql_param_obj={};

// ticket status details
//

arr_sql_param_obj.sql="select * FROM ((SELECT ticketid,0 as is_fdb  ,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_ticketsts.ticketsts) as ticketsts, (select tbl_users.username FROM tbl_users WHERE tbl_users.uid= assignto ) as assignto, (SELECT tbl_login.enname FROM tbl_login WHERE tbl_login.refid = assignby ) as assignby, Notes, txndate as dategen  , 0 as rating,ifnull(concat('"+imgurl+"' ,img1),img1) as img1 ,ifnull(concat('"+imgurl+"' ,img2),img2) as img2 ,ifnull(concat('"+imgurl+"' ,img3),img3) as img3, ifnull(img4,concat('"+imgurl+"' ,img4)) as img4, ifnull(concat('"+imgurl+"' ,img5),img5) as img5  FROM `tbl_ticketsts` WHERE ticketid = ? ORDER by txnid desc) UNION (SELECT tktid as ticketid, 1 as is_fdb ,(SELECT vw_ticket_status.tktsts from vw_ticket_status WHERE vw_ticket_status.ticketid = tktid) as ticketsts,(SELECT vw_ticket_status.cowner from vw_ticket_status WHERE vw_ticket_status.ticketid = tktid) AS assignto, (SELECT tbl_users.username FROM tbl_users WHERE tbl_users.uid = fbby) AS assignby, feedback AS Notes, dategen  , ceil(rating) as rating,  null as img1 ,null as img2 ,null as img3, null as img4,null as img5 FROM tbl_tktfeedback WHERE tktid = ?)) a  ORDER by a.dategen DESC ";

console.log("Image url",arr_sql_param_obj.sql);
arr_sql_param_obj.params = [lid,lid];
arr_sql_param.push(arr_sql_param_obj);

Action.exeSelParallel(arr_sql_param,null,null,null,function(err,result){
 var f1 = result[0].data[0];
	
	f1["history"]=result[1].data;
  console.log("history result result: ",f1);
  var visible = 0;
  if(user.roleid == 41 || user.roleid == 42){
    visible = 1;
  }
    f1["action"]=visible;
      return callback(err,f1);   
});
},
getTicketApproval:function getTicketApproval(post,callback){

  var lid=post.tktid;
  var sanctionid = post.sanctionid;

  var arr_sql_param = [];
  var arr_sql_param_obj={};

//main ticket Details
arr_sql_param_obj.sql = "SELECT tktid,(select tbl_login.enname from tbl_login WHERE tbl_login.refid = usrid) as raisedby,contactno,contactemail,(select group_concat(tbl_units.unitname) from tbl_units WHERE find_in_set(tbl_units.unitid,tbl_tickets.unitid)) as unit,(select tbl_codevalue.cvvalule from tbl_codevalue WHERE tbl_codevalue.cvid = tkttype) as tkttype,issuedetails,  date_format(dategen,'%m/%d/%Y %H:%i ') as dategen    FROM `tbl_tickets` WHERE tktid =?";
arr_sql_param_obj.params = [lid];

arr_sql_param.push(arr_sql_param_obj);
arr_sql_param_obj={};

// ticket status details
arr_sql_param_obj.sql="select * FROM ((SELECT ticketid, 0 as is_fdb  , (SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_ticketsts.ticketsts) as ticketsts, (select tbl_users.username FROM tbl_users WHERE tbl_users.uid= assignto ) as assignto, (SELECT tbl_login.enname FROM tbl_login WHERE tbl_login.refid = assignby ) as assignby, Notes, txndate as dategen  , 0 as rating,ifnull(concat('"+imgurl+"' ,img1),img1) as img1 ,ifnull(concat('"+imgurl+"' ,img2),img2) as img2 ,ifnull(concat('"+imgurl+"' ,img3),img3) as img3, ifnull(img4,concat('"+imgurl+"' ,img4)) as img4, ifnull(concat('"+imgurl+"' ,img5),img5) as img5  FROM `tbl_ticketsts` WHERE ticketid = ? ORDER by txnid desc) UNION (SELECT tktid as ticketid, (SELECT vw_ticket_status.tktsts from vw_ticket_status WHERE vw_ticket_status.ticketid = tktid) as ticketsts,(SELECT vw_ticket_status.cowner from vw_ticket_status WHERE vw_ticket_status.ticketid = tktid) AS assignto, (SELECT tbl_users.username FROM tbl_users WHERE tbl_users.uid = fbby) AS assignby, feedback AS Notes, dategen  , ceil(rating) as rating,  null as img1 ,null as img2 ,null as img3, null as img4,null as img5, 1 as is_fdb  FROM tbl_tktfeedback WHERE tktid = ?)) a  ORDER by a.dategen DESC ";

arr_sql_param_obj.params = [lid,lid];
arr_sql_param.push(arr_sql_param_obj);

Action.exeSelParallel(arr_sql_param,null,null,null,function(err,result){
// console.log("History ",lid,result);
  if(err){
    throw err;
  }
  var f1=result[0].data[0];
  f1["history"]=result[1].data;
  f1["sanctionid"]=sanctionid;
  f1["lid"]=lid;
  return callback(err,f1);   

});

},
 getSanctions:function getSanctions(post,callback){

var user= post;
var sql1="SELECT ticketid as sanctionid, srvNo as ticketid,srvNo as srvNo,tkttypename as ttype,tktstsname as status,(select username from tbl_users WHERE vw_ticket_status.assignto = uid) as sender ,DATE_FORMAT(dategen, '%m/%d/%Y') as raisedon , Notes as description, 1  as clicktype,concat(vw_ticket_status.tkttypename,(select username from tbl_users WHERE vw_ticket_status.assignto = uid),Notes,tkttypename) as search_tag FROM `vw_ticket_status` WHERE tktsts in (3,4,5) AND ( ? = (select tbl_escmatrix.escto from tbl_escmatrix WHERE  find_in_set(vw_ticket_status.tkttype,tbl_escmatrix.tkttype) AND (DATEDIFF(date(now()),date(dategen)) BETWEEN tbl_escmatrix.fromrange AND tbl_escmatrix.torange))) UNION (SELECT sanctionid,txnrefno as ticketid,(SELECT vw_ticket_status.srvNo FROM vw_ticket_status WHERE vw_ticket_status.ticketid = txnrefno) as srvNo,(SELECT vw_ticket_status.tkttypename FROM vw_ticket_status WHERE vw_ticket_status.ticketid = txnrefno) as ttype,(SELECT vw_ticket_status.tktstsname FROM vw_ticket_status WHERE vw_ticket_status.ticketid = txnrefno) as status,(select username from tbl_users WHERE senderid = uid) as sender,DATE_FORMAT(dategen, '%m/%d/%Y') as raisedon,sanctionremarks as description, 0  as clicktype,concat(txntype,(select username from tbl_users WHERE senderid = uid),sanctionremarks,(SELECT vw_ticket_status.tkttypename FROM vw_ticket_status WHERE vw_ticket_status.ticketid = txnrefno)) as search_tag FROM `tbl_sanctions` WHERE status = 0)";

  var params = [user.userid];
    
    Action.exeSEL(sql1, params, null, null, function(err, result) {
        return callback(err,result);  
    });    
},getEsc:function getEsc(post,callback){

var data= post;

var sql1 = "SELECT (SELECT tbl_codevalue.cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=?) as tkttype, fromrange,torange,(select tbl_users.username FROM tbl_users WHERE tbl_users.uid = escto) as escto FROM `tbl_escmatrix` WHERE find_in_set(?,tkttype)";
  var params = [data.tkttype,data.tkttype];
    
    Action.exeSEL(sql1, params, null, null, function(err, result) {
        return callback(err,result);  
    });    
}

}
module.exports = FMaster_SEL;  
