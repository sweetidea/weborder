<?php
include_once('../include/config.php');
include_once('../include/init.php');

$manifest = $_REQUEST['productManifest'];
$campus = $_REQUEST['campus'];
$response = array();

array_push($response,"Campus ID: ".$campus);

foreach ( $manifest as $itemName => $qty ) {
	$productId = 0;
	switch($itemName) {
		case "double_choc": $productId = 3; break;
		case "snickerdoodle": $productId = 2; break;
		case "choc_chip": $productId = 1; break;
		case "tazadoodle": $productId = 5; break;
		case "pumpkin": $productId = 6; break;
		case "white_choc": $productId = 7; break;
		default: break;
	}
	if ($qty>0 && $productId>0){
		$sql = "INSERT INTO bag_pack_list VALUES ('',?,CURRENT_TIMESTAMP,?,?)";
		$statement = $db->prepare($sql);
		$result = $statement->execute(array($campus,$productId,$qty));
		if($result)
			array_push($response,"Successfully added ".$itemName." with qty ".$qty);
		else
			array_push($response,"Could not add ".$itemName);
	}
}

echo json_encode($response);
//if ($result)


?>