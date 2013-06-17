<?php

$curl = curl_init("http://api.twitter.com/1.1/users/show.json?screen_name=aldaviva");
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: OAuth oauth_consumer_key="K26BGWJJbTMhOyX5oRAczQ", oauth_nonce="c01a172aa8294520cc01a48ed4d6e1b8", oauth_signature="Ah34dIA7sA%2FetuHGqcf37MwPUa4%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1371511459", oauth_token="207052335-foHMnATl238sDOZeyfombiISUlAIR3nNclkDhAZf", oauth_version="1.0"'));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);

echo curl_exec($curl);
curl_close($curl);

?>