<?php header('content-type: application/json; charset=utf-8');
include_once('../include/config.php');
include_once('../include/init.php');

$phoneNumber = $_REQUEST['phoneNumber'];
$credit = $_REQUEST['credit'];
$subtract = $_REQUEST['subtract'];

if($subtract) {
	$credit = $credit*-1;
}

//should check to see if it starts with a + character and/or a 1 character and automatically fill tehm in
//length should be either 10,11, or 12
//if 10, need +1
//if 11, should just need a +
//if 12, check to make sure it starts with a +1
$phoneNumber = ereg_replace("[^0-9]", "", $phoneNumber);
$numberOfDigits = strlen($phoneNumber);
if ($numberOfDigits == 10) {
	$phoneNumber = "+1".$phoneNumber;
} else if ($numberOfDigits == 11 ) {
	$phoneNumber = "+".$phoneNumber;
} else {
	return;
}


$sql = "SELECT * FROM customers WHERE phone LIKE '".$phoneNumber."'";
		$statement = $db->prepare($sql);
		$query = $statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);

if(!(count($result)>0)) {
	$sql = "INSERT INTO customers VALUES(?,?)";
	$statement = $db->prepare($sql);
	$query = $statement->execute(array($phoneNumber,0));
}

$sql = "UPDATE customers SET credit = customers.credit + ? WHERE customers.phone LIKE ?";
$statement = $db->prepare($sql);
if($credit && $phoneNumber)
	$query = $statement->execute(array($credit,$phoneNumber));

$sql = "SELECT * FROM customers WHERE phone LIKE '".$phoneNumber."'";
		$statement = $db->prepare($sql);
		$query = $statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);


//echo $sql;
echo json_encode($result);
//if ($result)


?>