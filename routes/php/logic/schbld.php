<?php
require_once dirname(__FILE__) . '/../com/apicalbe.php';
require_once dirname(__FILE__) . '/../com/apicaldb.php';
//require      dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../com/apiconst.php';
require_once dirname(__FILE__) . '/../com/apicalul.php';

$Qry = "SELECT notify_id, date_gen,senderid, reftxnid as tktid, (SELECT GROUP_CONCAT(tbl_login.fcmid) from tbl_login WHERE FIND_IN_SET(tbl_login.refid,REPLACE(receiverid,' ',''))) as fcmids,receiverid, reftxnid as tktid ,fcmid, title, notify_type, notify_url, click_action, msg, data,  date_format(date_gen,'%m/%d/%Y') as date_gen,(SELECT username FROM tbl_users WHERE uid=senderid) as sender FROM `tbl_notifications` WHERE  date_gen > date_sub(now(), interval 1 minute) AND status = 0 ORDER by 2 DESC";
$params = array();
$response = executesel($Qry,$params);
    foreach ($response as $record)
    {
      $response = sendv1($record["fcmids"], $record["msg"], $record["title"], 1,$record["tktid"],$record["notify_url"],$record["click_action"],$record["date_gen"]);
    }
?>
