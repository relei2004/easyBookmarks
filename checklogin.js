function checklogin() {
    fetch('checklogin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.logedin === true) {
		return 1;
        } else {
                window.location.href = "login.html";
		return 0;
        }
    })
    .catch(error => {
	    //Error
    });
}
