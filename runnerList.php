<?php header('content-type: application/json; charset=utf-8');
include_once('include/config.php');
include_once('include/init.php');

$sql = "SELECT id,shortName,phone FROM employee";
		$statement = $db->prepare($sql);
		$query = $statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);


echo json_encode($result);
//if ($result)


?>