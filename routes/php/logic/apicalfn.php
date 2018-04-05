<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once dirname(__FILE__) . '/../com/apicalbe.php';
require_once dirname(__FILE__) . '/../com/apicaldb.php';
require      dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../com/apiconst.php';
require_once dirname(__FILE__) . '/../com/apicalul.php';

function sendnotification()
  {
    $Qry = " select * from `tbl_notifications` where status=0";
    $response = executesel($Qry);
    foreach ($resnpose as $record)
    {
      $response = sendv1($record["fcmid"], $record["msg"], $record["title"], 1,$record["notify_type"],$record["$notify_url"],$record["click_action"],$record["date_gen"]);
    }
    return (true);
  }
;