<?php

/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT');

function getData()
{
    $content = (stripslashes(trim(file_get_contents("php://input"))));
    $decoded = json_decode($content, true);
    if (!empty($decoded)) {
        
        if (!is_array($decoded)) {
            throw new Exception('Received content contained invalid !!!!');
        }
        
        if (!function_exists('json_last_error')) {
            if ($decoded === false || $decoded === null) {
                throw new Exception('API-001: Could not decode !!!');
            }
        } else {
            //Get the last JSON error.
            $jsonError = json_last_error();
            
            //In some cases, this will happen.
            if (is_null($decoded) && $jsonError == JSON_ERROR_NONE) {
                throw new Exception('API-002: Could not decode !!!!');
            }
            
            //If an error exists.
            if ($jsonError != JSON_ERROR_NONE) {
                $error = 'API-003: Could not decode !!!!! ';
                
                //Use a switch statement to figure out the exact error.
                switch ($jsonError) {
                    case JSON_ERROR_DEPTH:
                        $error .= 'API-004: Maximum depth exceeded!';
                        break;
                    case JSON_ERROR_STATE_MISMATCH:
                        $error .= 'API-005: Underflow or the modes mismatch!';
                        break;
                    case JSON_ERROR_CTRL_CHAR:
                        $error .= 'API-006: Unexpected control character found';
                        break;
                    case JSON_ERROR_SYNTAX:
                        $error .= 'API-007: Malformed Request';
                        break;
                    case JSON_ERROR_UTF8:
                        $error .= 'API-008: Malformed UTF-8 characters found!';
                        break;
                    default:
                        $error .= 'API-009: Unknown error!';
                        break;
                }
                throw new Exception($error);
            }
        }
    }
   return $decoded; 
}



