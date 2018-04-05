<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once dirname(__FILE__) . '/apicalbe.php';


function executedml($Qry,$parameters)
{
        $db = getDbCxn();
        try {
            $stmt = $db->prepare($Qry);
            $stmt->execute($parameters);
            $rows = $stmt->rowCount();
            $response = ["Status"=>$rows,"Message"=>"Success"];
            }
        catch (Exception $e) {
             	array($response = ["Status"=>-1,"Message"=>"Failed"]);
		error_log('Error while ***** executedml ****   '.$Qry.$e->getMessage(),0, 'Message: ');
        }
 	$stmt = null;
    	$db   = null;
    return ($response);

}

function executesel($Qry, $parameters)
{
        $db = getDbCxn();
        try {
            $stmt = $db->prepare($Qry);
            $stmt->execute($parameters);
            $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		error_log(' Inside Select Statement '.print_r($parameters,true) ,0, 'Message: ');
            }
        catch (Exception $e) {
                array($response = ["Status"=>-1,"Message"=>"Failed"]);
                error_log('Error while ****** executesel *********'.$e->getMessage(), 0, 'Message: ');
        }
        $stmt = null;
        $db   = null;
    return ($response);
}

;

