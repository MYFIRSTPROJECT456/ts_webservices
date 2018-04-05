 <?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/     

require_once dirname(__FILE__) . '/apiconst.php';

    function getDbCxn()
    {
 	$db = new PDO('mysql:host=localhost;dbname='.P2.';charset=utf8mb4', P3,P4);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        return $db;
    }




