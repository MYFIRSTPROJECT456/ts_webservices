var Action = require('./../lib/Action.js');
var Chart={ 
    getChartData:function getChartData(post,callback){
        var type = ''+post.type;
        var userid = post.userid;
        var roleid = post.roleid;
        var sql1 = '';
        var params =[];

        switch(type){

        case '1': //collectionchartdata
        sql1 = "SELECT (cvvalule) as label, (cvid) as id, (SELECT COUNT(*) as value FROM `tbl_ticketsts` WHERE sts = 0 AND ticketsts = cvid) as value ,(SELECT 'color' from DUAL) as color FROM `tbl_codevalue` WHERE cvmasterid =2";
        break;

        case '2': //paymentchartdata
        sql1 = "SELECT (@cnt) as id,(SELECT 'color' from DUAL) as color,concat('Day ',(@cnt := @cnt + 1)) AS label, COALESCE(m1.Consumption_KWH - (SELECT m2.Consumption_KWH FROM tbl_btudata m2  WHERE m2.unit_no = m1.unit_no - 1), 0) AS value FROM tbl_btudata m1,(SELECT @cnt := 0) as a";
			params = [];
        break;

        case '3': // ticketstatuschartdata
        sql1 = "SELECT (cvvalule) as label, (cvid) as id, (SELECT COUNT(*) as value FROM `tbl_ticketsts` WHERE sts = 0 AND ticketsts = cvid) as value ,(SELECT 'color' from DUAL) as color FROM `tbl_codevalue` WHERE cvmasterid =2";
        break;

        default:
        break;
    }
    Action.exeSEL(sql1,params,null,null,function(err,result){
     return callback(err,result);  
 }); 
}   
}
module.exports = Chart; 

//module.exports = router;
