var Action = require('./../lib/Action.js');
var Unit={ 
getAllunitdetails:function getAllunitdetails(post,callback){
 var sql1 = "SELECT unitid,unitname,unitsize,(SELECT cvvalule FROM `tbl_codevalue` a WHERE a.cvid = b.unitType ) as unitType, concat(unitname,unitsize) as search_tag FROM `tbl_units` b"
    var params = [];
    Action.exeSEL(sql1,params,null,null,function(err,result){
             return callback(err,result);  
    }); 
},
getunitdetails:function getunitdetails(post,callback){

    var unitid = post.unitid;
    var sql1 = "SELECT unitid,unitname,unitsize,unitType,ameter,ameteragno,ameterappno,bmeter,bmeteragno,bmeterappno,cmeterno,cmeterapno,cmeteragno FROM `tbl_units` WHERE unitid=? ";
    var params = [unitid];
            Action.exeSEL(sql1,params,null,null,function(err,result){
                return callback(err,result);  
    });
},
saveunit:function saveunit(post,callback){

   var unitid = post.unitid;
    var formdata = post;
    if (unitid) {
        var sql1 = "UPDATE `tbl_units` SET `unitname` = ?, `unitsize`= ?,`unitType`= ?, `ameter`= ?, `ameteragno`= ?, `ameterappno`= ? , `bmeter`= ?, `bmeteragno`= ?, `bmeterappno`= ?, `cmeterno`= ?, `cmeteragno`= ?, `cmeterapno` = ? WHERE `tbl_units`.`unitid` = ?";
        var params = [ formdata.unitname, formdata.unitsize, formdata.unittype, formdata.ameter, formdata.aagrement, formdata.aapplication,formdata.bmeter, formdata.bagrement, formdata.bapplication, formdata.cmeter, formdata.cagrement, formdata.capplication, unitid];
        Action.exeDML(sql1, params, null, null, function(err, result) {
             return callback(err,result);  
        });
    } else {
        var sql1="INSERT INTO `tbl_units` (`unitname`, `unitsize`, `unitType`, `ameter`, `ameteragno`, `ameterappno`, `bmeter`, `bmeteragno`, `bmeterappno`, `cmeterno`, `cmeteragno`, `cmeterapno`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
      
        var params = [ formdata.unitname, formdata.unitsize, formdata.unittype, formdata.ameter, formdata.aagrement, formdata.aapplication,formdata.bmeter, formdata.bagrement, formdata.bapplication, formdata.cmeter, formdata.cagrement, formdata.capplication];
        Action.exeDML(sql1, params, null, null, function(err, result) {
               return callback(err,result);  
        });
    }
}   
}
module.exports = Unit; 

//module.exports = router;
