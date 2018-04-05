<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once 'apiconst.php';
//require_once 'mailer/PHPMailerAutoload.php';

function sendv1($ids, $msgbody, $title, $soundflg,$type,$sosurl,$clickaction,$date)
{
        error_log(print_r($ids,true));

   /* $registrationIds = array();
foreach ($ids as $key => $value){ */
//        $registrationIds[$key] = $value['fcmid'];
    //}
    $registrationIds = explode(',', $ids);
    $msg = array(
        'body' => $msgbody,
        'title' => $title,
        'vibrate' => 1,
        'sound' => 1,
        'priority'=>"high",
        'click_action' =>$clickaction
 );

$data=array(
'body'=>$msgbody,
'id' =>$type
);
    $fields          = array(
        'registration_ids' => $registrationIds,
        'data'=>$data
    );
    $headers = array(
        'Authorization:key='.P6,
        'Content-Type:application/json'
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, P5);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);
error_log(print_r($result,true));
    curl_close($ch);
  return ($result);
}


