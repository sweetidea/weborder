<?php header('content-type: application/json; charset=utf-8');
include_once('../include/config.php');
include_once('../include/init.php');

$phoneNumber = $_REQUEST['phoneNumber'];
$timeOffset = 2*60*60; //Server is 2 hours behind
$time = date('Y-m-d H:i:s',$_REQUEST['time']+$timeOffset);
$sql = "(SELECT * FROM texter WHERE (texter.to LIKE '".$phoneNumber."' OR texter.from LIKE '".$phoneNumber."')";

if($time) {
	$sql = $sql." AND timestamp > '".$time."'";
}

$sql = $sql." ORDER BY timestamp DESC LIMIT 50) ORDER BY timestamp ASC";

		$statement = $db->prepare($sql);
		$query = $statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);

//$result = $sql;
//echo $sql;
echo json_encode($result);
//if ($result)


?>