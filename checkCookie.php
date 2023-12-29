<?php
function checkCookie(){
	include 'credentials.php';
	if (isset($_COOKIE['userdata'])) {
		$retrieved_data = unserialize($_COOKIE['userdata']);
		$retrieved_logedin = $retrieved_data['logedin'];
		$retrieved_user = $retrieved_data['user'];
		$retrieved_key = $retrieved_data['key'];
		if ($retrieved_logedin === true && $retrieved_key === $apikey) {
			return true;

		} else {
			return false;
		}
	}
	return false;
}

function getUserCookie(){
	if (isset($_COOKIE['userdata'])) {
		$retrieved_data = unserialize($_COOKIE['userdata']);
		return $retrieved_data['user'];
	}
}
?>
