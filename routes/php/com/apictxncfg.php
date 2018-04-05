<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/
require_once dirname(__FILE__) . '/../com/apicalbe.php';
require_once dirname(__FILE__) . '/../com/apicaldb.php';
require dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../com/apiconst.php';
require_once dirname(__FILE__) . '/../com/apicalul.php';
require_once dirname(__FILE__) . '/../com/apicsync.php';
/*-------------------------------------------------------------------------
All Contstants  Starts Here 
-------------------------------------------------------------------------*/

$coid = 7;

$schtab = "CREATE TABLE tbl" . $coid . "schedule (`coid` int(32) NOT NULL,`scheuleid` int(32) NOT NULL PRIMARY KEY AUTO_INCREMENT, `userid` int(32) NOT NULL, `custid` int(32) NOT NULL, `dos` date NOT NULL,`reason` varchar(500) NOT NULL DEFAULT '''NA''', `status` int(2) NOT NULL DEFAULT '0', `date_gen` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=latin1 ";

$UpdQry = " update tbl_screen set insertsql = :p1, createscript =:p2 where coid = :p3 and scrno=:p4";

$screens = " select scrno from tbl_screen where coid = :p1 and reqid is null and status =0";

$crteQty = " update tbl_screen set createscript =:p1 where coid =:p2 and scrno=:p3 ";

/*-------------------------------------------------------------------------
All Contstants Ends here  
-------------------------------------------------------------------------*/

$prms   = array(
    $coid
);
$srclst = executesel($screens, $prms);
foreach ($srclst as $screen) {
    $scr_no     = 0;
    $tbl_ins    = ' insert into  tbl';
    $tbl_inscol = '';
    $tbl_insval = '';
    $tbl_create = 'create table tbl';
    $tbl_bal01  = ' ( recid int(32) not null AUTO_INCREMENT, coid int(32) not null, txnid varchar(500) not null, ';
    $tbl_bal02  = '  ';
    $tbl_bal03  = '  txn_latid varchar(500), txn_longid varchar(500), txndate varchar(500), status int(2) default 0 not null, date_gen datetime default now() not null, PRIMARY KEY (recid) );';
    $sno        = $screen["scrno"];
    $scrndtls   = "select coid,scrno,fldno,fld_name from tbl_screen_dtl where coid=:p1 and scrno=:p2 and status = 0 and fld_name <> 'media' order by coid, scrno, fld_seq ";
    $parms      = array(
        $coid,
        $sno
    );
    $fldlst     = executesel($scrndtls, $parms);
    $i          = 1;
    foreach ($fldlst as $row) {
        if (($scr_no == 0) or ($scr_no <> $row["scrno"])) {
            $scr_no = $row["scrno"];
            $coid   = $row["coid"];
            $tbl_create .= $coid;
            $tbl_create .= $scr_no;
            $tbl_create .= $tbl_bal01;
            $tbl_ins .= $coid;
            $tbl_ins .= $scr_no;
            $tbl_ins .= ' ( coid, txnid, ';
        }
        $tbl_bal02 .= ' ' . $row["fld_name"] . ' varchar(500),';
        $tbl_inscol .= ' ' . $row["fld_name"] . ",";
        $tbl_insval .= ':p' . $i++ . ",";
        $scr_no = $row["scrno"];
    }
    $tbl_insval .= ':p' . $i++ . ",";
    $tbl_inscol .= 'txn_latid, txn_longid, txndate';
    $tbl_insval = rtrim($tbl_insval, ",");
    $tbl_insval = rtrim($tbl_insval, ", ");
    $tbl_inscol .= ') values (';
    $tbl_insval .= ',:p' . $i++ . "," . ':p' . $i++ . "," . ':p' . $i++ . "," . ':p' . $i++ . ' )';
    $tbl_create .= $tbl_bal02 . $tbl_bal03;
    $response   = executedml($tbl_create);
    $tbl_insert = $tbl_ins . $tbl_inscol . $tbl_insval;
    $params     = array(
        $tbl_insert,
        $tbl_create,
        $coid,
        $scr_no
    );
    $rdata = executedml($UpdQry, $params);
    $sdata = executedml($schtab);
    $trgtab =  gettxntab($coid,4);
    $schtrg= " CREATE TRIGGER ".$coid."buildschedule AFTER INSERT ON ".$trgtab." FOR EACH ROW INSERT INTO tbl".$coid."schedule (coid,  userid, custid, dos, reason) VALUES ( NEW.coid, NEW.userid, NEW.custid, NEW.NxtMeetDate, 'followup')";   
     $response   = executedml($schtrg);
$trgtab =  gettxntab($coid,1);
 $schtrg= " CREATE TRIGGER ".$coid."buildcustomer AFTER INSERT ON ".$trgtab." FOR EACH ROW UPDATE tbl_requstlist set reqid = concat(reqid,',20170304') where coid = NEW.coid and userid =NEW.userid";
        var_dump($schtrg);
     $response   = executedml($schtrg);
}
;
?>

