var Action = require('./../lib/Action.js');
var Dropdown={ 
    getDropdownData:function getDropdownData(post,callback){
        var type = ''+post.type;
        var userid = post.userid;
        var roleid = post.roleid;
        var sql1 = '';
        var params =[];

        switch(type){
            case '1': //assignto
            if(roleid == 38 || roleid ==  39){
                sql1 ="SELECT uid as id, username as name FROM `tbl_users`  WHERE role NOT in (41,42)  ORDER BY uid";
            }else{
               sql1 = "select uid as id, username as name from tbl_users WHERE find_in_set(uid,(select  GROUP_CONCAT(uid) as uids from (select * from tbl_users order by role, uid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and     @pv := concat(@pv, ',', uid)) OR find_in_set(uid, ?)))";
               params = [userid,userid];
           }
           break;


           case '2': // all statuses
           sql1 = "SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=2 ";
           if(roleid == 41 || roleid ==  42){
            sql1 += "  and cvid NOT in (7,8)";
        } 
        break;

        case '3': // getroles
        sql1 = "SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 7";
        break;

        case '4': //users
        sql1 = "SELECT uid as id, username as name FROM `tbl_users`  WHERE role NOT in (41,42)  ORDER BY uid";
        break;

        case '5': //user units
        sql1 = "SELECT unitid as id , unitname as name FROM tbl_units WHERE find_in_set(unitid,(SELECT units FROM `tbl_users` WHERE uid = ?))";
        params = [userid];
        break;

        case '6': // all units
        sql1 = "SELECT unitid as id , unitname as name FROM tbl_units";
        break;

        case '7': // ticket type
        sql1 = "SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 11";
        break;

        case '8': // get tenants
        sql1 = "SELECT uid as id, username as name FROM `tbl_users`  WHERE role in (41,42)  ORDER BY role";
        break;

        case '9': // codemaster
        sql1 = "SELECT code as id, codename as name FROM `tbl_codemaster` WHERE usradd = 0";
        break;

        case '10': // bill type
        sql1 = "SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 12";
        break;

        case '11': // unit type
        sql1 = "SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 13";
        break;

        case '12':
        sql1 = "";
        params = [];
        break;

        default:
        break;
    }
    Action.exeSEL(sql1,params,null,null,function(err,result){
        // console.log("Dropdown result",result);
     return callback(err,result);  
 }); 
}   
}
module.exports = Dropdown; 

//module.exports = router;