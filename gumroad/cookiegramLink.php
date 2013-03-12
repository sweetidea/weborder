<?php
include_once('../include/config.php');
include_once('../include/init.php');

$purchaserEmail = $_REQUEST['email'];
$price = $_REQUEST['price'];
$purchaserPhone = $_REQUEST['Your_phone_number'];
$recipientEmail = $_REQUEST["Their_email_address"];
$recipientPhone = $_REQUEST["Their_phone_number"];
$message = $_REQUEST["Special_instructions"];
	$sql = "INSERT INTO cookiegram VALUES ('',?,?,?,?,?,?,CURRENT_TIMESTAMP)";
	$statement = $db->prepare($sql);
	$statement->execute(array($purchaserEmail,$purchaserPhone,$recipientEmail,$recipientPhone,$price,$message));

echo "http://getcooki.es/cookiegram";

?>