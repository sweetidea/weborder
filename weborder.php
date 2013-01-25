<?php header('content-type: application/json; charset=utf-8');
/*Ingredient*/

include_once('include/config.php');
include_once('include/init.php');
require('../Twilio/Services/Twilio.php');
    $AccountSid = "AC724438d929864945260401022f99d258";
    $AuthToken = "90219b8db3133e60d363f5d6404911e5";
    $client = new Services_Twilio($AccountSid, $AuthToken);

$order->sent = false;
$order->time = time();

$rawPhoneNumber = ereg_replace("[^0-9]", "", $_REQUEST['phone']);
$numberOfDigits = strlen($rawPhoneNumber);
if ($numberOfDigits == 11 || $numberOfDigits == 10) {
    
} else {
	$order->message = "Sorry, the phone number you gave was invalid!";
	echo json_encode($order);
	return;
}

if ( !empty($_REQUEST['address'] ) || (!empty($_REQUEST['latitude']) && !empty($_REQUEST['longitude'])) ) {

} else {
	$order->message = "Sorry, we were unable to verify your address!";
	echo json_encode($order);
	return;
}

$sql = "INSERT INTO weborders VALUES ('',CURRENT_TIMESTAMP,?,?,?,?)";
$statement = $db->prepare($sql);
$statement->execute(array($_REQUEST['address'],$rawPhoneNumber,$_REQUEST['latitude'],$_REQUEST['longitude']));

$order->id = $db->lastInsertId();
$order->sent = true;
$order->time = time();
$order->phone = $rawPhoneNumber;
$order->message = "Thank you! Your order has been placed! You'll be receiving a text from us shortly!";
//https://maps.google.com/?ll=".$_REQUEST['latitude'].",".$_REQUEST['longitude'];


//taken from http://www.vijayjoshi.org/2011/01/12/php-shorten-urls-using-google-url-shortener-api/
$link = "https://maps.google.com/?ll=".$_REQUEST['latitude'].",".$_REQUEST['longitude'];

$postData = array('longUrl' => $link);
$jsonData = json_encode($postData);

$curlObj = curl_init();

curl_setopt($curlObj, CURLOPT_URL, 'https://www.googleapis.com/urlshortener/v1/url');
curl_setopt($curlObj, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curlObj, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curlObj, CURLOPT_HEADER, 0);
curl_setopt($curlObj, CURLOPT_HTTPHEADER, array('Content-type:application/json'));
curl_setopt($curlObj, CURLOPT_POST, 1);
curl_setopt($curlObj, CURLOPT_POSTFIELDS, $jsonData);

$response = curl_exec($curlObj);

//change the response json string to object
$json = json_decode($response);

curl_close($curlObj);

$link = $json->id;
$textBody = "Phone: ".$_REQUEST['phone']." Address: ".$_REQUEST['address']." MapLink: ".$link;
if(strlen($textBody)>160) {
	$textBody = "Phone: ".$_REQUEST['phone']." Address too big. Ask customer for address.";
}
$message = $client->account->sms_messages->create("+19785284097", "+14242412825", $textBody);
echo json_encode($order);
?>