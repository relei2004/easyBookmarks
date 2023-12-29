<?php
include 'splitLine.php';
include 'checkCookie.php';
if (!checkCookie()){ 
	header('Location: login.htm');
	exit();
}
$filename = getUserCookie() . '.txt';
$uuid = isset($_GET['uuid']) ? $_GET['uuid'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';

$groupedBookmarks = readAndGroupBookmarks($filename);

header('Content-Type: application/json');
echo json_encode($groupedBookmarks);

function readAndGroupBookmarks($filename) {
	$data = file_get_contents($filename);
	$lines = explode("\n", $data);
	$groupedBookmarks = [];

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
		$faviconUrl = "https://www.google.com/s2/favicons?domain=" . $url;
		$fav = $faviconUrl;

		$bookmarkData = [
			'url'   => $url   ,
			'title' => $title,
			'date'  => $date,
			'time'  => $time,
			'uuid'  => $uuid,
			'fav'   => $fav
		];

		if (isset($_GET['search']) && strpos(strtolower($bookmarkData['title']),strtolower($_GET['search'])) === false){
			continue;
		}

		if (isset($_GET['uuid']) && $bookmarkData['uuid'] === $_GET['uuid']){
			return [
				'url'   => $url   ,
				'title' => $title,
				'area'  => $area,
				'topic'  => $topic,
				'category' => $category,
				'date'  => $date,
				'time'  => $time,
				'uuid'  => $uuid
			       ];
		}elseif (isset($_GET['uuid'])){
			return [];
		}

		if (!empty($topic) && !empty($category)) {
			$groupedBookmarks[$area][$topic][$category][] = $bookmarkData;
		} elseif (!empty($topic)) {
			$groupedBookmarks[$area][$topic][] = $bookmarkData;
		} else {
			$groupedBookmarks[$area][] = $bookmarkData;
		}
	}

	return $groupedBookmarks;
}
?>

