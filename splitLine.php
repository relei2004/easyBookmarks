<?php
function splitLine($line) {
	$separator = "<§>";
	$parts = [];
	$currentPart = "";
	$separatorIndex = 0;

	for ($i = 0; $i < strlen($line); $i++) {
		$currentChar = $line[$i];

		if ($currentChar === $separator[$separatorIndex]) {
			$separatorIndex++;

			if ($separatorIndex === strlen($separator)) {
				$parts[] = $currentPart;
				$currentPart = "";
				$separatorIndex = 0;
			}
		} else {
			if ($separatorIndex > 0) {
				$currentPart .= substr($separator, 0, $separatorIndex);
				$separatorIndex = 0;
			}
			$currentPart .= $currentChar;
		}
	}

	if ($currentPart !== "") {
		$parts[] = $currentPart;
	}

	return $parts;
}

?>
