<?php
$ch = curl_init();
$timeout = 5; // set to zero for no timeout
$url = 'https://flitcie.ch.tudelft.nl/rest/'.urldecode($_GET['path']);
unset($_GET['path']);

foreach($_GET as $key => $val){
	if($key == 'urls') $val = stripslashes($val);
 	$url .= (!strpos($url, "?") ? "?" : "&") . $key . "=" . $val;
}

curl_setopt ($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
curl_setopt($ch,CURLOPT_HTTPHEADER, array(
	'X-Gallery-Request-Key: ba5f2671d8463c08488d3cef7851e665'
));
$file_contents = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);
header(' ', true, (int) $info['http_code']);

// display file
echo $file_contents;
?>