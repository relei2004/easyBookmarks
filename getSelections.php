<?php
include 'checkCookie.php';
include 'splitLine.php';
if (!checkCookie()){ 
	header('Location: login.htm');
	exit();
}
$filename = getUserCookie() . '.txt';

$result = getUniqueValues($filename);

echo json_encode($result);

function getUniqueValues($filename) {
	$data = file_get_contents($filename);
	$lines = explode("\n", $data);

	$areas = [];
	$topics = [];
	$categories = [];

	foreach ($lines as $line) {
		if (empty($line)) continue;
		$parts = splitLine($line);

		$url =		trim($parts[0]);
		$title =	trim($parts[1]);
		$area =		trim($parts[2]);
		$topic =	trim($parts[3]); 
		$category =	trim($parts[4]);
		$date =		trim($parts[5]);
		$time =		trim($parts[6]);
		$uuid =		trim($parts[7]);

		if (!in_array($area, $areas)) {
			$areas[] = $area;
		}

		if (!in_array($topic, $topics)) {
			$topics[] = $topic;
		}

		if (!in_array($category, $categories)) {
			$categories[] = $category;
		}
	}

	return [
		'areas' => $areas,
		'topics' => $topics,
		'categories' => $categories
	];
}
?>

