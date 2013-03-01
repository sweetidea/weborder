<?php
include_once('include/config.php');
include_once('include/init.php');

$recipientInfo = $_REQUEST['recipientInfo'];
$manifest = $_REQUEST['productManifest'];
$type = $_REQUEST['type'];
$price = $_REQUEST['price'];
$units = $_REQUEST['units'];
$phone = $_REQUEST['phone'] || '';
$deliveryDate = $_REQUEST['deliveryDate'] || '';

$sql = "INSERT INTO shoppingcart_orders VALUES ('',CURRENT_TIMESTAMP,?,?,?,?,?)";
$statement = $db->prepare($sql);
$statement->execute(array($phone,$type,$units,$price,$deliveryDate));

$orderId = $db->lastInsertId();
$sql = "INSERT INTO shoppingcart_addresses VALUES ('',?,?,?,?,?,?,?,?)";
$statement = $db->prepare($sql);
$statement->execute(array($orderId,$recipientInfo[firstName],$recipientInfo[lastName],$recipientInfo[address1],$recipientInfo[address2],$recipientInfo[city],$recipientInfo[state],$recipientInfo[zipcode]));

foreach ( $manifest as $itemName => $qty ) {
	$productId = 0;
	switch($itemName) {
		case "double_choc": $productId = 3; break;
		case "snickerdoodle": $productId = 2; break;
		case "choc_chip": $productId = 1; break;
		case "tazadoodle": $productId = 5; break;
		default: break;
	}
	if ($qty>0 && $productId>0){
		$sql = "INSERT INTO purchased_products VALUES ('',?,?,?)";
		$statement = $db->prepare($sql);
		$statement->execute(array($productId,$orderId,$qty));
	}
}

echo true;

?>