<?php header('content-type: application/json; charset=utf-8');
include_once('include/config.php');
include_once('include/init.php');

$sql = "SELECT * FROM (SELECT zoneAssignments.zoneId,zoneAssignments.runnerID,employee.shortName,employee.phone,zones.shortName AS zoneName FROM zoneAssignments, employee, zones WHERE zoneAssignments.runnerID = employee.id AND zoneAssignments.zoneId = zones.id ORDER BY timestamp DESC LIMIT 4) AS assignments ORDER BY zoneId ASC";
		$statement = $db->prepare($sql);
		$query = $statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);


echo json_encode($result);
//if ($result)


?>