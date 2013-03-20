<?php header('content-type: application/json; charset=utf-8');

include_once('../include/config.php');
include_once('../include/init.php');
require('../../Twilio/Services/Twilio.php');
    $AccountSid = "AC724438d929864945260401022f99d258";
    $AuthToken = "90219b8db3133e60d363f5d6404911e5";
    $client = new Services_Twilio($AccountSid, $AuthToken);

$rawPhoneNumber = $_REQUEST['phone'];
$address = $_REQUEST['address'];
$shortlink = $_REQUEST['shortlink'];
$comments = $_REQUEST['comments'];
$campus = $_REQUEST['campus'];
$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];

$phone = ereg_replace("[^0-9]", "", $rawPhoneNumber);
$numberOfDigits = strlen($phone);
if ($numberOfDigits == 11 || $numberOfDigits == 10) {
    
} else {
	$order->message = "Sorry, the phone number you gave was invalid!";
	echo json_encode($order);
	return;
}


//get all of our current zone assignments
$sql = "SELECT * FROM (SELECT zoneAssignments.zoneId,zoneAssignments.runnerID,employee.shortName,employee.phone,zones.shortName AS zoneName FROM zoneAssignments, employee, zones WHERE zoneAssignments.runnerID = employee.id AND zoneAssignments.zoneId = zones.id ORDER BY timestamp DESC LIMIT 4) AS assignments ORDER BY zoneId ASC";
$statement = $db->prepare($sql);
$query = $statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
$employeePhone = '';
$runnerId = '';
foreach ( $result as $i=>$zone) {
	if($zone['zoneId']==$campus) {
		$employeePhone = $zone['phone'];
		$runnerId = $zone['runnerID'];
	}
}

$to =  $employeePhone;
$from = '+19785284097';
$message = $phone." ".$address;
if($comments) {
	$message .= " Note: ".$comments;
}
$message .= " ".$shortlink;

//Save the order to the dispatcher table
$sql = "INSERT INTO dispatcher VALUES ('',?,CURRENT_TIMESTAMP,?,?,?,?,?)";
$statement = $db->prepare($sql);
$statement->execute(array($phone,$campus,$runnerId,$address,$lat,$lng));

//Text the cookie runner
$sms = $client->account->sms_messages->create($from,$to,$message);          
$smsMessageId = $sms->sid;

$sql = "INSERT INTO texter VALUES ('',?,?,CURRENT_TIMESTAMP,?,?)";
$statement = $db->prepare($sql);
$statement->execute(array($to,$from,$message,$smsMessageId));


$response->from = $from;
$response->to = $to;
$response->message = $message;
echo json_encode($response);

?>

