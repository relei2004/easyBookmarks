var existingPopup = document.getElementById('myEasyBookmarkPopup');
const url = new URL(window.location.href);

const urlParams = new URLSearchParams(url.search);

var linkurl = urlParams.get('url');
var linktitle = urlParams.get('title');
var mode = urlParams.get('mode');
var uuid = urlParams.get('uuid');

checklogin();

var formEl = document.getElementById("myForm");
var uuidEl = document.getElementById("uuid");

if(mode === "add"){
	var urlEl = document.getElementById("url");
	var titleEl = document.getElementById("title");
	urlEl.value = linkurl;
	titleEl.value = linktitle;
	uuidEl.value = generateUUID();
	var dateEl = document.getElementById("date");
	var timeEl = document.getElementById("time");
	dateEl.value = new Date().toLocaleDateString();
	timeEl.value = new Date().toLocaleTimeString();
}else{
	uuidEl.value = uuid;
}

loadSelectOptions();

document.getElementById('myForm').addEventListener('submit', function(e) {
	e.preventDefault(); 

	var formData = new FormData(this);

	var options = {
		method: 'POST',
		credentials: 'include',
		body: formData
	};

	fetch(this.action, options)
		.then(response => {
			if (response.ok) {
				if(mode === "add")
					window.close();
				else
					window.location.href = 'index.html';
			} else {
				console.error('Server returned an error response.');
			}
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
});

document.getElementById('closeButton').addEventListener('click', function() {
	if(mode === "add")
		window.close();
	else
		window.location.href = 'index.html';
});

function addCustOption(button,selId,inpId){
	var select = document.getElementById(selId);
	var input = document.getElementById(inpId);

	var optionElement = document.createElement('option');
	optionElement.value = input.value;
	optionElement.textContent = input.value;
	select.appendChild(optionElement);

	input.style.display = 'none';
	button.style.display = 'none';

}


function checkCustomOption(selectId, customInputId,buttonId) {
	var customInput = document.getElementById(customInputId);
	var customButton = document.getElementById(buttonId);
	var select = document.getElementById(selectId);
	if (customInput.style.display === 'none') {
		customInput.style.display = 'block';
		customButton.style.display = 'block';
	} else {
		customInput.style.display = 'none';
		customButton.style.display = 'none';
	}
}

function loadBookmarkById(){

	var apiUrl = 'getBookmarks.php?uuid=' + uuid;

	fetch(apiUrl,{credentials: 'include'} )
		.then(response => response.json())
		.then(data => {
			fillInputs('url', data.url);
			fillInputs('title', data.title);
			fillInputs('area', data.area);
			fillInputs('topic', data.topic);
			fillInputs('category', data.category);
			fillInputs('date', data.date);
			fillInputs('time', data.time);
			fillInputs('uuid', data.uuid);
		})
		.catch(error => {
			console.error('Error loading UUID:', error);
		});

}
function fillInputs(selectId, value) {
	var inp = document.getElementById(selectId);
	if (inp.type === "text" || inp.type === "hidden"){
		inp.value = value;
	}else{
		var items = inp.options;
		for (var item of items){
			if(item.text === value)
				inp.options.selectedIndex = item.index;
		}
	}
}

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


function loadSelectOptions() {
	// Beispiel-URL, ersetzen Sie diese durch Ihre tatsächliche API-URL
	var apiUrl = 'getSelections.php';

	fetch(apiUrl,{ credentials: 'include' })
		.then(response => response.json())
		.then(data => {
			fillSelect('area', data.areas);
			fillSelect('topic', data.topics);
			fillSelect('category', data.categories);
			if(mode !== "add")
				loadBookmarkById();
		})
		.catch(error => {
			console.error('Error loading select options:', error);
		});
}

function fillSelect(selectId, options) {
	var select = document.getElementById(selectId);
	options.forEach(option => {
		var optionElement = document.createElement('option');
		optionElement.value = option;
		optionElement.textContent = option;
		select.appendChild(optionElement);
	});
}

