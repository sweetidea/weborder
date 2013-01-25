<?php header('content-type: application/json; charset=utf-8');
/*Ingredient*/

include_once('include/config.php');
include_once('include/init.php');

//day 0 is Sunday

$response->currentlyOpen = false;
$time = date("w G i"); //day, hour, minute
$time = explode(" ",$time);
$time[1] = ($time[1]+2)%24; //correction for the current hour. Server is 2 hours behind
if($time[1] >= 0 && $time[1] <= 3) { //correction for the day of the week if time ahs already brought us to the next day
	$time[0] = ($time[0]-1)%7;
}
/*$response->day = date("w");
$response->hour = date("G");
$response->minute = date("i");*/

$sql = "SELECT * FROM hours_of_operation WHERE day = ?";
$statement = $db->prepare($sql);
$statement->execute(array($time[0]));
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
if(count($result)!=1) { //if we can't find hours for the day, we're definitely closed and should abort. 
	echo json_encode($response);
	return;
}

$result = $result[0];
$response->day = $result['day'];
$response->open = $result['open'];
$response->close = $result['close'];
$timeToCompare = ($time[1]*100)+$time[2];
$response->timeToCompare = $timeToCompare;
if($timeToCompare >= $response->open || $timeToCompare <= $response->close) {
	$response->currentlyOpen = true;
}

//echo json_encode($response);
echo json_encode($response);
?>