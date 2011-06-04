<?php

$filename = "portfolio.xml";

$xml = simplexml_load_file($filename);

$obj = array();

foreach($xml->piece as $piece){
	$obj[] = $piece;
}

echo json_encode($obj);

?>