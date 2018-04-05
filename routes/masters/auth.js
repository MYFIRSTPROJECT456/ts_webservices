
var Action = require('./../lib/Action.js');

exports.login = function(req, res, next) {
    var message = '';
    var sess = req.session;
    if (req.method == "POST") {
        var post = req.body;
        var tenantid = coid;
        var name = post.loginid;
        var pass = post.pwd;

        var sql1 = "SELECT coid, enid, enname, loginid, roleid, mgrid, contact_mobileno,refid, if(photo_url is null or photo_url='', CONCAT('" + url + "','Contents/u00.png'), CONCAT('" + url + "',photo_url)) photo,(select 'data' from dual) as menudata, (SELECT neftdetails FROM `tbl_comsetup` b WHERE b.coid=a.coid) as comp_neft FROM `tbl_login` a WHERE upper(loginid) = upper(?) and (SELECT AES_DECRYPT(pwd,loginid)) = ? and coid = ?";
        var params = [name, pass, tenantid];

        Action.exeSEL(sql1, params, null, null, function(err, result) {
         // console.log("auth : ", err, result, sql1, params);
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
            res.send(resp);
        }
    });
} else {
 var resp = {
    status: "1",
    status_msg: "Wrong Credentials."
};
res.send(resp);
}
} else {
    var resp = {
        status: "1",
        status_msg: "Wrong Credentials."
    };
    res.send(resp);
}
});
        
    } else { //not post
       var resp = {
        status: "1",
        status_msg: "method not post"
    };
    res.send(resp);
}

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
};
