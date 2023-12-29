<?php
include 'checkCookie.php';
if (!checkCookie()){ 
	header('Location: login.htm');
	exit();
}
$filename = getUserCookie() . '.txt';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$data = [
		'url' 		=> isset($_POST['url']) ? $_POST['url'] : 'Keine URL' ,
		'title' 	=> isset($_POST['title']) ? $_POST['title'] : 'Kein Titel',
		'area' 		=> isset($_POST['area']) ? $_POST['area'] : 'Default',
		'topic' 	=> isset($_POST['topic']) ? $_POST['topic'] : 'Keine Thema',
		'category' 	=> isset($_POST['category']) ? $_POST['category'] : 'Keine Kategorie',
		'date' 		=> isset($_POST['date']) ? $_POST['date'] : 'Kein Datum',
		'time' 		=> isset($_POST['time']) ? $_POST['time'] : 'Keine Uhrzeit',
		'uuid' 		=> isset($_POST['uuid']) ? $_POST['uuid'] : 'Keine UUID'                  
	];

	if (isNewEntry($filename,$data['uuid'],$data['url']) === "new"){
		file_put_contents($filename, buildLine($data), FILE_APPEND | LOCK_EX);
	}else{
		if(isNewEntry($filename,$data['uuid'],$data['url']) === 'uuid')
			$selector = $data['uuid'];
		else
			$selector = $data['url'];

		replaceLine($filename,$selector,$data);

	}

	echo "Saved!";
} else {
	echo "No Data!";
}

function isNewEntry($filename,$uuid,$url){
	$foundUuid = false;
	$foundUrl = false;

	$fileContent = file_get_contents(getUserCookie() . '.txt');

	if (strpos($fileContent, $uuid) !== false) {
		$foundUuid = true;
	} 
	if (strpos($fileContent, $url) !== false) {
		$foundUrl = true;
	} 

	if ($foundUuid === true )
		return "uuid";

	if ($foundUuid === false and $foundUrl == true)
		return "url";

	return "new";			
}

function replaceLine($filename, $selector,$data){
	$newFile = [];
	if (file_exists($filename)) {
		$lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		foreach ($lines as $line) {
			if (strpos($line, $selector) !== false) {
				if($data['url'] !== '' || $data['title'] !== '')
					$newFile[] = buildLine($data);
			}else{
				$newFile[] = $line;
			}
		}
	}

	file_put_contents($filename, implode("\n", $newFile));
	return false;
}

function buildLine($data){

	$data = "\n" . 
		$data['url'] ." <§> " .  
		$data['title'] . " <§> " .
		$data['area'] . " <§> " .
		$data['topic'] . " <§> " .
		$data['category'] . " <§> " .
		$data['date'] . " <§> " .
		$data['time'] . " <§> " .
		$data['uuid'];

	return $data;
}

?>

