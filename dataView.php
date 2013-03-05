<?php header('content-type: application/json; charset=utf-8');
include_once('./include/config.php');
include_once('./include/init.php');

$tableName = $_REQUEST['table'];
$schema = array();
$sql = "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_name = ?"; //array of columns
$statement = $db->prepare($sql);
$query = $statement->execute(array($tableName));
$result->schema = $statement->fetchAll(PDO::FETCH_COLUMN);


$sql = "SELECT * FROM ".$tableName;
$statement = $db->prepare($sql);
$query = $statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);

$result->data = array();
foreach($data as $k=>$v) {
	$temp = array();
	foreach($v as $kk=>$vv) {
		array_push($temp,$vv);
	}
	array_push($result->data,$temp);
}

//$result = $sql;
//echo $sql;
echo json_encode($result);
//if ($result)


?>