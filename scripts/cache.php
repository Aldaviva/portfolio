<?php

require_once('c:/server/pear/pear/cache/Lite.php');

$request = $_GET['request'];

$cache = new Cache_Lite(array('lifeTime' => 5*60, 'cacheDir'=>'../data/cache/'));

if(($data = $cache->get($request)) === false){
	$data = file_get_contents($request);
	$cache->save($data, $request);
}

echo $data;

?>