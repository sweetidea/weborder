<?php header('content-type: application/json; charset=utf-8');

include_once('../include/config.php');
include_once('../include/init.php');

$phone = $_REQUEST['phoneNumber'];

$phone = ereg_replace("[^0-9]", "", $phone);
$numberOfDigits = strlen($phone);
if($numberOfDigits==11){
	$phone = substr($phone,1);
}
$phone = '%'.$phone.'%';


$timeOffset = 2*60*60; //Server is 2 hours behind
$time = date('Y-m-d H:i:s',$_REQUEST['time']+$timeOffset);
$sql = "SELECT address,timestamp  FROM `dispatcher` WHERE `phone` LIKE ?";

if($time) {
	$sql = $sql." AND timestamp > ?";
}

$sql = $sql." ORDER BY timestamp DESC";
$sql = $sql." LIMIT 5";


$statement = $db->prepare($sql);
$query = $statement->execute(array($phone,$time));
$result = $statement->fetchAll(PDO::FETCH_ASSOC);

//$result = $sql;
//echo $sql;
echo json_encode($result);
//if ($result)
?>