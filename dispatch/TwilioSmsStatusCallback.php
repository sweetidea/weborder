<?php
	include_once('../include/config.php');
	include_once('../include/init.php');
    $AccountSid = "AC724438d929864945260401022f99d258";

    $debug = "";
    foreach( $_REQUEST as $attr=>$val ) {
    	$debug.= $attr." ";
    }


    $to = $_REQUEST['To'];
    $from = $_REQUEST['From'];
    $message = $_REQUEST['Body'];
    $sid = $_REQUEST['SmsSid'];

    if(strcmp($AccountSid, $_REQUEST['AccountSid'] ) == 0 ) {
    	$sql = "INSERT INTO texter VALUES ('',?,?,CURRENT_TIMESTAMP,?,?)";
		$statement = $db->prepare($sql);
		$statement->execute(array($to,$from,$message,$sid));
	}

	echo true;
?>