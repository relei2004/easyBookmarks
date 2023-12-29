<?php
include 'checkCookie.php';
session_start();

$response = array();

if (checkCookie()) {
	$response['logedin'] = true;
} else {
	$response['logedin'] = false;
}

echo json_encode($response);
?>
