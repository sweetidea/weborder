<?php

	include_once('../include/config.php');
	include_once('../include/init.php');


    $AccountSid = "AC724438d929864945260401022f99d258";
    $AuthToken = "90219b8db3133e60d363f5d6404911e5";

    if(strcmp($AccountSid,$_REQUEST['AccountSid']) == 0) {
    }

    $response->from = $_REQUEST['From'];
    $response->to = $_REQUEST['To'];
    $response->message = $_REQUEST['Body'];
    $response->smsMessageId = $_REQUEST['AccountSid'];

    $sql = "INSERT INTO texter VALUES ('',?,?,CURRENT_TIMESTAMP,?,?)";
	$statement = $db->prepare($sql);
	$statement->execute(array($response->to,$response->from,$response->message,$response->smsMessageId));
?>