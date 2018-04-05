<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once dirname(__FILE__) . '/../com/apicalbe.php';
require_once dirname(__FILE__) . '/../com/apicaldb.php';

function tracelog($p1, $p2, $p3, $p4, $p5,$p6,$p7,$p8,$p9)                            
{      
	$Qry = "INSERT INTO `tbl_cxndetails`(`coid`,`reqid`, `userid`, `username`, `latid`, `langid`,`battery_level`,`version_no`,`network`) VALUES (:p1,:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9)";
       	$params = array($p1,$p2,$p3,$p4,$p5,$p6,$p7,$p8,$p9);
       	$response = executedml($Qry,$params);
	if ($p1 <> 20170301) {
	$Qry = "SELECT STATUS FROM `tbl_users` WHERE tbl_users.userid = :p2";
 	$params = array($p2);
        $response = executesel($Qry,$params);
	 $resize = sizeof($response);
        if ( ($reponse[0]["STATUS"]=0)|| ($resize < 1 ))
	{
 		error_log("Error******* userid ".$userid,0,'Message');
		array($response = ["Status"=>-1,"Message"=>"Failed"]);
	}
	}
		 array($response = ["Status"=>0,"Message"=>"Success"]);
       return ($response);
}
;





