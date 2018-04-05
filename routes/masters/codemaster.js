var Action = require('./../lib/Action.js');
var CodeM={ 
getAllcodes:function getAllcodes(post,callback){
 var sql1 = "SELECT cvid,cvvalule, (SELECT codename FROM tbl_codemaster a WHERE a.code = b.cvmasterid) as master FROM `tbl_codevalue` b ORDER BY cvmasterid ASC"
    var params = [];
    Action.exeSEL(sql1,params,null,null,function(err,result){
             return callback(err,result);  
    }); 
},
getcodedetails:function getcodedetails(post,callback){

      var codeid = post.codeid;
    var sql1 = "SELECT cvid,cvvalule,cvmasterid FROM `tbl_codevalue` WHERE cvid = ?";
    var params = [codeid];
            Action.exeSEL(sql1,params,null,null,function(err,result){
                return callback(err,result);  
    });
},
savecode:function savecode(post,callback){
 var codeid = post.codeid;
    var formdata = post;
    if (codeid) {
        var sql1 = "UPDATE `tbl_codevalue` SET `cvvalule` = ? WHERE `tbl_codevalue`.`cvid` = ?;";
        var params = [formdata.cvvalule,codeid];
        Action.exeDML(sql1, params, null, null, function(err, result) {
               return callback(err,result);  
        });
    } else {
        var sql1 = "INSERT INTO `tbl_codevalue` (`cvmasterid`, `cvvalule`) VALUES (?,?)";
        var params = [formdata.cvmasterid,formdata.cvvalule];
        Action.exeDML(sql1, params, null, null, function(err, result) {
            return callback(err,result);  
        });
    }
}   
}
module.exports = CodeM; 

//module.exports = router;
