<?php
session_start();
include 'credentials.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$userIn = $_POST['user'];
	$paswdIn = $_POST['passwd'];
	if (checkUser($userIn,$paswdIn,$credentials)) {
		$_SESSION['logedin'] = true;
		$data = array(
			'logedin' => true,
			'user' => $userIn,
			'key' => $apikey
		);
		$serialized_data = serialize($data);
		setcookie('userdata', $serialized_data, time() + 3600 * 24 * 365);

		header('Location: index.html');
		exit();
	} else {
		header('Location: login.html');
		exit();
	}
}

function checkUser($user, $paswd, $credentials){
	foreach ($credentials as $entry) {
		if($user === $entry['user'] && $paswd === $entry['password'])
			return true;
	}
	return false;
}

?>

