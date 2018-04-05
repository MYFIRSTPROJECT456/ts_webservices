var async = require('async');
var Action = require('./../lib/Action.js');
var kpis = require('./../lib/kpi.js');
var graph = require('./../lib/graph.js');

var Dashboard={ 
    getDashboard:function getDashboard(post,callback){

        var sql1 = "";
        var params = [];
        var user = post;
        kpis.units = 1;
        kpis.users = 1;
        kpis.tickets = 1;
        kpis.recievables = 1;
        kpis.payables = 0;
        kpis.approval = 1;

        graph.collection = 1;
        graph.payment = 0;
        graph.consumption = 1;
        graph.status = 1;
        graph.count = 3;

        if(user.roleid == "38" || user.roleid == "39"){
            kpis.kpicount = 5;
            sql1 = "SELECT COUNT(*) as total_tickets,(SELECT COUNT(*) FROM `vw_ticket_status` WHERE tktsts not in (6,7,8) ) as raised_tickets,(SELECT COUNT(uid) FROM `tbl_users`) as total_users ,(SELECT count(uid) FROM `tbl_users` WHERE units is null or units = '') as alloted_users,(SELECT COUNT(unitid) FROM `tbl_units`) as total_units,(SELECT SUM(LENGTH(a.counts) - LENGTH(REPLACE(a.counts, ',', '')) + 1) as counts from (SELECT GROUP_CONCAT(DISTINCT units ORDER BY units ASC SEPARATOR ',') as counts  FROM tbl_users) a) as alloted_units, (select sum(a.count) FROM (SELECT count(*) as count FROM `vw_ticket_status` WHERE tktsts in (3,4,5) AND ( ? = (select tbl_escmatrix.escto from tbl_escmatrix WHERE  find_in_set(vw_ticket_status.tkttype,tbl_escmatrix.tkttype) AND (DATEDIFF(date(now()),date(dategen)) BETWEEN tbl_escmatrix.fromrange AND tbl_escmatrix.torange))) UNION (SELECT count(*) as count FROM `tbl_sanctions` WHERE status = 0)) a) as pending_approvals FROM `vw_ticket_status`";
            params = [user.userid];
        }else if(user.roleid == "135" || user.roleid == "136" ){
            kpis.kpicount = 5;
            sql1 = "SELECT COUNT(*) as total_tickets,(SELECT COUNT(*) FROM `vw_ticket_status` WHERE tktsts not in (6,7,8) ) as raised_tickets,(SELECT COUNT(uid) FROM `tbl_users` WHERE find_in_set(uid,(select  GROUP_CONCAT(uid) as uids from (select * from tbl_users order by role, uid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and  @pv := concat(@pv, ',', uid)) OR find_in_set(uid, ?))) OR role in (41,42)) as total_users ,(SELECT count(uid) FROM `tbl_users` WHERE units is null or units = '') as alloted_users,(SELECT COUNT(unitid) FROM `tbl_units`) as total_units,(SELECT SUM(LENGTH(a.counts) - LENGTH(REPLACE(a.counts, ',', '')) + 1) as counts from (SELECT GROUP_CONCAT(DISTINCT units ORDER BY units ASC SEPARATOR ',') as counts  FROM tbl_users) a) as alloted_units,(select sum(a.count) FROM (SELECT count(*) as count FROM `vw_ticket_status` WHERE tktsts in (3,4,5) AND ( ? = (select tbl_escmatrix.escto from tbl_escmatrix WHERE  find_in_set(vw_ticket_status.tkttype,tbl_escmatrix.tkttype) AND (DATEDIFF(date(now()),date(dategen)) BETWEEN tbl_escmatrix.fromrange AND tbl_escmatrix.torange))) UNION (SELECT count(*) as count FROM `tbl_sanctions` WHERE status = 0)) a) as pending_approvals FROM `vw_ticket_status`";
            params= [user.userid,user.userid,user.userid];
        }else if( user.roleid == "40"){
            kpis.kpicount = 2;
            kpis.units = 0;
            kpis.users = 0;
            kpis.tickets = 1;
            kpis.recievables = 1;
            kpis.approval = 0;
            graph.collection = 0;
            graph.count = 2;
	sql1 = "SELECT (SELECT COUNT(*) FROM `vw_ticket_status` WHERE assignto = ?) as total_tickets,(SELECT COUNT(*) FROM `vw_ticket_status` WHERE tktsts not in (6,7,8) AND assignto = ?) as raised_tickets,(SELECT COUNT(uid) FROM `tbl_users` WHERE find_in_set(uid,(select  GROUP_CONCAT(uid) as uids from (select * from tbl_users order by role, uid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and  @pv := concat(@pv, ',', uid)) OR find_in_set(uid, ?))) OR role in (41,42) ) as total_users,(SELECT count(uid) FROM `tbl_users` WHERE units is null or units = '') as alloted_users,(SELECT COUNT(unitid) FROM `tbl_units`) as total_units,(SELECT SUM(LENGTH(a.counts) - LENGTH(REPLACE(a.counts, ',', '')) + 1) as counts from (SELECT GROUP_CONCAT(DISTINCT units ORDER BY units ASC SEPARATOR ',') as counts  FROM tbl_users) a) as alloted_units,(select sum(a.count) FROM (SELECT count(*) as count FROM `vw_ticket_status` WHERE tktsts in (3,4,5) AND ( ? = (select tbl_escmatrix.escto from tbl_escmatrix WHERE  find_in_set(vw_ticket_status.tkttype,tbl_escmatrix.tkttype) AND (DATEDIFF(date(now()),date(dategen)) BETWEEN tbl_escmatrix.fromrange AND tbl_escmatrix.torange))) UNION (SELECT count(*) as count FROM `tbl_sanctions` WHERE status = 0)) a) as pending_approvals FROM `vw_ticket_status` LIMIT 1";
            params= [user.userid,user.userid,user.userid,user.userid,user.userid];
        }
	    else if(user.roleid == "137"){
            kpis.kpicount = 3;
            kpis.units = 1;;
            kpis.users = 1;
            kpis.tickets = 1;
            kpis.recievables = 0;
            kpis.approval = 0;
           

		sql1 = "SELECT (SELECT COUNT(*) FROM `vw_ticket_status` WHERE find_in_set(tkttype, (SELECT GROUP_CONCAT(tbl_tksdepmap.tkttype) FROM tbl_tksdepmap WHERE find_in_set(tbl_tksdepmap.depids,(SELECT tbl_users.deptid FROM tbl_users WHERE tbl_users.uid = ?))))) as total_tickets,(SELECT COUNT(*) FROM `vw_ticket_status` WHERE find_in_set(tkttype, (SELECT GROUP_CONCAT(tbl_tksdepmap.tkttype) FROM tbl_tksdepmap WHERE find_in_set(tbl_tksdepmap.depids,(SELECT tbl_users.deptid FROM tbl_users WHERE tbl_users.uid = ?)))) AND tktsts not IN (6,7,8)) as raised_tickets,(SELECT COUNT(uid) FROM `tbl_users` WHERE find_in_set(uid,(select  GROUP_CONCAT(uid) as uids from (select * from tbl_users order by role, uid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and  @pv := concat(@pv, ',', uid)) OR find_in_set(uid, ?))) OR role in (41,42) ) as total_users,(SELECT count(uid) FROM `tbl_users` WHERE units is null or units = '') as alloted_users,(SELECT COUNT(unitid) FROM `tbl_units`) as total_units,(SELECT SUM(LENGTH(a.counts) - LENGTH(REPLACE(a.counts, ',', '')) + 1) as counts from (SELECT GROUP_CONCAT(DISTINCT units ORDER BY units ASC SEPARATOR ',') as counts  FROM tbl_users) a) as alloted_units,(select sum(a.count) FROM (SELECT count(*) as count FROM `vw_ticket_status` WHERE tktsts in (3,4,5) AND ( ? = (select tbl_escmatrix.escto from tbl_escmatrix WHERE  find_in_set(vw_ticket_status.tkttype,tbl_escmatrix.tkttype) AND (DATEDIFF(date(now()),date(dategen)) BETWEEN tbl_escmatrix.fromrange AND tbl_escmatrix.torange))) UNION (SELECT count(*) as count FROM `tbl_sanctions` WHERE status = 0)) a) as pending_approvals FROM `vw_ticket_status` LIMIT 1";    
            params= [user.userid,user.userid,user.userid,user.userid,user.userid];
        }else if(user.roleid == "41" || user.roleid == "42"){
            kpis.kpicount = 2;
            kpis.users = 0;
		kpis.units = 0;
            kpis.recievables = 0;
            kpis.payables = 1;
            kpis.approval = 0;
            graph.collection = 0;
        graph.payment = 1;
        graph.consumption = 0;
        graph.status = 0;
        graph.count = 1;

		sql1 = "SELECT (SELECT COUNT(ticketid) FROM `vw_ticket_status` WHERE CONCAT(',', unitid, ',') REGEXP concat(',',(SELECT REPLACE(tbl_users.units,',','|') FROM tbl_users WHERE uid = ?),',')) as total_tickets, (SELECT COUNT(ticketid) FROM `vw_ticket_status` WHERE CONCAT(',', unitid, ',') REGEXP concat(',',(SELECT REPLACE(tbl_users.units,',','|') FROM tbl_users WHERE uid = ?),',') AND tktsts not in (6,7,8)) as raised_tickets,(SELECT '0' FROM dual) as total_users,(SELECT '0' FROM dual) as alloted_users,(SELECT SUM(LENGTH(units) - LENGTH(REPLACE(units, ',', '')) + 1) as counts FROM tbl_users WHERE uid = ?) as total_units,(SELECT SUM(LENGTH(a.counts) - LENGTH(REPLACE(a.counts, ',', '')) + 1) as counts from (SELECT GROUP_CONCAT(DISTINCT units ORDER BY units ASC SEPARATOR ',') as counts  FROM tbl_users WHERE uid = ?) a) as alloted_units FROM `vw_ticket_status` limit 1";
            params= [user.userid,user.userid,user.userid,user.userid];
        }

        Action.exeSEL(sql1, params, null, null, function(err, result) {
            var f1=result;
            f1["kpis"]=kpis;
            f1["graph"]=graph;
            return callback(err,f1);
        });

    }   
}
module.exports = Dashboard; 

