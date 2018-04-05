var Action = require('./../lib/Action.js');
var User={ 
 login:function login(post,callback){
    var tenantid = post.coid;
    var name = post.loginid;
    var pass = post.pwd;

    var sql1 = "SELECT coid, enid, enname, loginid, roleid, mgrid, contact_mobileno,refid, if(photo_url is null or photo_url='', CONCAT('" + url + "','Contents/u00.png'), CONCAT('" + url + "',photo_url)) photo,(select 'data' from dual) as menudata, (SELECT neftdetails FROM `tbl_comsetup` b WHERE b.coid=a.coid) as comp_neft FROM `tbl_login` a WHERE upper(loginid) = upper(?) and (SELECT AES_DECRYPT(pwd,loginid)) = ? and coid = ?";
    var params = [name, pass, tenantid];

    Action.exeSEL(sql1, params, null, null, function(err, result) {
       if (result && !err) {
        var results = result.data;
        if (results && results.length > 0) {
            get_info(results, function(err, result) {
                if (err) {
            // console.log(err);
        } else {
            results[0].menudata = result;
            var resp = {
                status: "0",
                status_msg: "success",
                data : results
            };
            return callback(null,resp);  
        }
    });
        } else {
           var resp = {
            status: "1",
            status_msg: "Wrong Credentials."
        };

        return callback(new Error("Auth Prob"),resp);  
    }
} else {
    var resp = {
        status: "1",
        status_msg: "Wrong Credentials."
    };
    return callback(new Error("Auth Prob"),resp);  
}
});



    function get_info(userdtl, callback) {
        var sql1 = "select tbl_menu.menuid, menuname, object, pmenuid,fld_faicon from tbl_menu, tbl_accesscontrol where coid =? and roleid =? and tbl_menu.status=0 and find_in_set(tbl_menu.menuid,tbl_accesscontrol.menuid)>0 order by seq";

        var params = [userdtl[0].coid, userdtl[0].roleid];
        Action.exeSEL(sql1, params, null, null, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                var results = result.data;
                var menudata = JSON.parse(JSON.stringify(results)); // Scope is larger than function  
            }
            return callback(err, menudata);
        });
    };
},
getuserdetails:function getuserdetails(post,callback){

  var sql1 = "SELECT uid,username,address,email,mobileno,(SELECT group_concat(unitname) FROM `tbl_units` d WHERE find_in_set(d.unitid ,a.units)) as units,(SELECT cvvalule as name FROM `tbl_codevalue`  WHERE cvid = role) as role, (SELECT username FROM tbl_users b WHERE b.uid = a.reportingto) as manager,concat(username,mobileno,(SELECT group_concat(unitname) FROM `tbl_units` d WHERE find_in_set(d.unitid ,a.units)),(SELECT cvvalule as name FROM `tbl_codevalue`  WHERE cvid = role)) as search_tag   FROM `tbl_users` a WHERE find_in_set(a.uid,(select  GROUP_CONCAT(uid) as uids from (select * from tbl_users order by role, uid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and  @pv := concat(@pv, ',', uid)) OR find_in_set(uid, ?))) OR role in (41,42) ";
  var params = [post.userid,post.userid];
  Action.exeSEL(sql1,params,null,null,function(err,result){
    return callback(err,result);  
});


},
userdetails:function userdetails(post,callback){

  var sql1 = "SELECT uid,username,address,email,mobileno,role,reportingto,units,billtypes FROM `tbl_users` WHERE uid = ?";
  var params = [post.otheruserid];
  Action.exeSEL(sql1,params,null,null,function(err,result){
    return callback(err,result);  
});


},
saveuser:function saveuser(post,callback){

    var custid = post.otheruserid;
    var formdata = post;
    if (custid) {
        var sql1 = "UPDATE `tbl_users` SET `username` = ?, `address`= ?,`email`= ?, `mobileno`= ?, `role`= ?, `reportingto`= ? , `units`= ? , `billtypes`=? WHERE `tbl_users`.`uid` = ?;";
        var params = [formdata.username, formdata.address, formdata.email, formdata.mobileno, formdata.role, formdata.reportingto, formdata.units,formdata.billtypes, custid];
        Action.exeDML(sql1, params, null, null, function(err, result) {
          return callback(err,result);  

      });
    } else {
        var sql1 = "INSERT INTO `tbl_users` (`coid`, `username`, `address`, `email`, `mobileno`, `role`, `reportingto`, `units`, `billtypes`) VALUES (?,?,?,?,?,?,?,?,?)";
        var params = [coid, formdata.username, formdata.address, formdata.email, formdata.mobileno, formdata.role, formdata.reportingto, formdata.units, formdata.billtypes];
        Action.exeDML(sql1, params, null, null, function(err, result) {
            return callback(err,result);  
        });
    }

}    
}
module.exports = User; 

//module.exports = router;
