<?php header('content-type: application/json; charset=utf-8');
include_once('../include/config.php');
include_once('../include/init.php');

$phoneNumber = $_REQUEST['phoneNumber'];

$sql = "SELECT * FROM employee WHERE phone LIKE '".$phoneNumber."'";
		$statement = $db->prepare($sql);
		$query = $statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);

//echo $sql;
echo json_encode($result);
//if ($result)


?>