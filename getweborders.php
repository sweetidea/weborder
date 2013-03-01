<?php

//getweborders

//should use strtotime() to do comparisons
$sql = "SELECT * FROM weborders ORDER BY timestamp DESC LIMIT 20";
$webOrderArray = array();


foreach($results as $result ) {
	array_push($webOrderArray, $result);
} 

echo json_encode($webOrderArray);

?>