<?php
include_once('./include/config.php');
include_once('./include/init.php');

$manifest = $_REQUEST['productManifest'];
$runnerId = $_REQUEST['runnerId'];
$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];
$paymentType = $_REQUEST['paymentType'];
$saleType = $_REQUEST['saleType'];
$response = array();

array_push($response,"SUBMITTING");

foreach ( $manifest as $itemName => $qty ) {
	$productId = 0;
	switch($itemName) {
		case "double_choc": $productId = 3; break;
		case "snickerdoodle": $productId = 2; break;
		case "choc_chip": $productId = 1; break;
		case "tazadoodle": $productId = 5; break;
		case "pumpkin": $productId = 6; break;
		case "white_choc": $productId = 7; break;
		case "snick_sando": $productId = 8; break;
		case "choc_sando": $productId = 9; break;
		default: break;
	}
	if ($qty>0 && $productId>0){
		$sql = "INSERT INTO CookieRecorder VALUES ('',?,?,?,CURRENT_TIMESTAMP,?,?,?,?)";
		$statement = $db->prepare($sql);
		$result = $statement->execute(array($runnerId,$lat,$lng,$productId,$qty,$paymentType,$saleType));
		if($result)
			array_push($response,"Successfully added ".$itemName." with qty ".$qty);
		else
			array_push($response,array($runnerId,$lat,$lng,$productId,$qty,$paymentType,$saleType));
	}
}

echo json_encode($response);
//if ($result)


?>