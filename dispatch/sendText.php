<?php header('content-type: application/json; charset=utf-8');

include_once('../include/config.php');
include_once('../include/init.php');
require('../../Twilio/Services/Twilio.php');
    $AccountSid = "AC724438d929864945260401022f99d258";
    $AuthToken = "90219b8db3133e60d363f5d6404911e5";
    $client = new Services_Twilio($AccountSid, $AuthToken);


$to =  $_REQUEST['phoneNumber'];
$from = '+19785284097';
$message = $_REQUEST['message'];
$options = array("StatusCallback" => "http://getcooki.es/weborder/dispatch/TwilioSmsStatusCallback.php"); 

$sms = $client->account->sms_messages->create($from,$to,$message,$options);          
$smsMessageId = $sms->sid;

$response->from = $from;
$response->to = $to;
$response->message = $message;
echo json_encode($response);

?>

