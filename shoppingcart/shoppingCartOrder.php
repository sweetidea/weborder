<?php header('content-type: application/json; charset=utf-8');
include_once('../include/config.php');
include_once('../include/init.php');
require_once('../stripe/lib/Stripe.php');
require_once('../firephp/lib/FirePHPCore/FirePHP.class.php');
ob_start();

Stripe::setApiKey("sk_test_ZiemzooEXuLI9PXpWaPeMfHl");
$firephp = FirePHP::getInstance(true);

// Get the credit card details submitted by the form
$token = $_REQUEST['token'];
$firephp->log($token,"Boom");
// Create the charge on Stripe's servers - this will charge the user's card
try {
$charge = Stripe_Charge::create(array(
  "amount" => $_REQUEST['price'], // amount in cents, again
  "currency" => "usd",
  "card" => $token,
  "description" => "payinguser@example.com")
);
$response = "SUCCESSFUL CHARGE";
} catch(Stripe_CardError $e) {
  // The card has been declined
	$response = " NOOOOOO";
}


$recipientInfo = $_REQUEST['recipientInfo'];
$manifest = $_REQUEST['productManifest'];
$type = $_REQUEST['type'];
$price = $_REQUEST['price'];
$units = $_REQUEST['units'];
$token = $_REQUEST['token'];
//recipientInfo breakdown
$name = $recipientInfo['name'];
$phone = $recipientInfo['phone'];
$email =  $recipientInfo['email'];
$address1 = $recipientInfo['address1'];
$address2 = $recipientInfo['address2'];
$city = $recipientInfo['city'];
$state = $recipientInfo['state'];
$zipcode = $recipientInfo['zipcode'];
$deliveryDate =  $recipientInfo['deliveryDate'];
//$deliveryTime

$firephp->log($phone);
$firephp->log($type);
$firephp->log($units);
$firephp->log($price);
$firephp->log($deliveryDate);

$sql = "INSERT INTO shoppingcart_orders VALUES ('',CURRENT_TIMESTAMP,?,?,?,?,CURRENT_TIMESTAMP)";
$statement = $db->prepare($sql);
$statement->execute(array($phone,$type,$units,$price));

$orderId = $db->lastInsertId();
$sql = "INSERT INTO shoppingcart_addresses VALUES ('',?,NULL,NULL,?,?,?,?,?,?,?,?)";
$statement = $db->prepare($sql);
$statement->execute(array($orderId,$address1,$address2,$city,$state,$zipcode,$name,$phone,$email));

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

echo json_encode($response);

?>