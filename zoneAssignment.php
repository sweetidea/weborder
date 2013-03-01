<?php header('content-type: application/json; charset=utf-8');
include_once('include/config.php');
include_once('include/init.php');

$manifest = $_REQUEST['scheduleManifest'];

foreach ( $manifest as $zoneId => $runnerId ) {
	$sql = "INSERT INTO zoneAssignments VALUES('',?,?,CURRENT_TIMESTAMP)";
	$statement = $db->prepare($sql);
	$result = $statement->execute(array($zoneId,$runnerId));		
}

echo json_encode($response);
//if ($result)


?>