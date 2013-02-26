<?php header('content-type: application/json; charset=utf-8');
//taken from http://www.vijayjoshi.org/2011/01/12/php-shorten-urls-using-google-url-shortener-api/
$link = "https://maps.google.com/maps?q=loc:".$_REQUEST['latitude'].",".$_REQUEST['longitude'];
/*$request->longUrl = $link;
$curl = curl_init();
$result = curl_exec($curl);
$result = json_decode($result);
curl_close($curl);
*/
$postData = array('longUrl' => $link, 'key' => 'AIzaSyDbWc_3x-gGY0LnXMBpRukGoVNsJrLMbW0');
$jsonData = json_encode($postData);

$curlObj = curl_init();

curl_setopt($curlObj, CURLOPT_URL, 'https://www.googleapis.com/urlshortener/v1/url');
curl_setopt($curlObj, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curlObj, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curlObj, CURLOPT_HEADER, 0);
curl_setopt($curlObj, CURLOPT_HTTPHEADER, array('Content-type:application/json'));
curl_setopt($curlObj, CURLOPT_POST, 1);
curl_setopt($curlObj, CURLOPT_POSTFIELDS, $jsonData);

$response = curl_exec($curlObj);

curl_close($curlObj);

echo ($response);
?>