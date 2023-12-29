var jsonData;
const url = new URL(window.location.href);

const urlParams = new URLSearchParams(url.search);

var search = urlParams.get('search');

checklogin();

if (search === "" || search === null){
	var bmUrl = 'getBookmarks.php';
	document.getElementById('searchText').value = "";
}else{
	var bmUrl = 'getBookmarks.php?search=' + search;
	document.getElementById('searchText').value = search;
}

fetch(bmUrl,{
	credentials: 'include'
}).then(response => {
	if (!response.ok) {
		throw new Error('Respons Error!');
	}
	return response.json();
}).then(data => {
	let container = document.getElementById('start'); // Container-Element in Ihrem HTML
	jsonData = data;
	createTree(data, container);
	console.log(data); // Hier können Sie mit den empfangenen Daten arbeiten
}).catch(error => {
	console.error('File Error: ', error);
});

function deleteBookmark(bookmark) {
	var element = document.getElementById('delConfirm');
	var style = window.getComputedStyle(element, '::before');
	var contentValue = style.getPropertyValue('content');
	contentValue= contentValue.replace(/^"|"$/g, '');
	if (confirm(contentValue)) {
		bookmark.url = '';
		bookmark.title = '';
		save(bookmark);
	} 
}

function changeBookmark(jsonData) {
	event.stopPropagation()
	window.location.href = 'bookmark.html?uuid=' + jsonData.uuid;
}

function addButton(li,path,cssClasses,bookmark,jsonData){
	let button = document.createElement('button');
	let currentPath = path;
	button.setAttribute('data-path', currentPath);
	for (cssClass of cssClasses){
		button.classList.add(cssClass);
		if(cssClass === "delete-button")
			button.onclick = function() { deleteBookmark(bookmark); };
		if(cssClass === "change-button")
			button.onclick = function() { changeBookmark(bookmark); };
	}
	li.appendChild(button);
}

function addLink(bookmark,parent,level){

	let li = document.createElement('li');

	li.innerHTML= `<img src="${bookmark.fav}" style='width: 24px; height: 24px; vertical-align: middle;'>&nbsp<a href="${bookmark.url}" target="_blank">${bookmark.title}</a>&nbsp&nbsp`;

	parent.appendChild(li);

	return li;
}
function addFolder(parent,level){

	let li = document.createElement('li');
	let ul = document.createElement('ul');
	li.style.display = 'block'; 

	li.textContent = level;

	li.classList.add('tree-branch');
	li.appendChild(ul)
	parent.appendChild(li);
	parent.addEventListener('click', toggleBranch);

	return ul;
}

function addAction(jsonData,path,levels,parentLi){

	let bookmark = jsonData;
	let currentPath = `${path}`;

	for (var level of levels){
		bookmark = bookmark[level];
		currentPath = currentPath + `['${level}']`;
	}

	var li = addLink(bookmark,parentLi,"IMG");
	addButton(li,currentPath,["delete-button","button","delete"],bookmark,jsonData);
	addButton(li,currentPath,["change-button","button","edit"],bookmark,jsonData);
}

function createTree(jsonData, container, path = '') {
	let mainUl = document.createElement('ul');

	for (const area in jsonData) {
		var areaLu = addFolder(mainUl,area);

		for (const topic in jsonData[area]) {
			if ("url" in jsonData[area][topic]) {
				addAction(jsonData,path,[area,topic],areaLu);
			}else{
				var topicLu = addFolder(areaLu,topic);
				for (const category in jsonData[area][topic]) {
					if ("url" in jsonData[area][topic][category]) {
						addAction(jsonData,path,[area,topic,category],topicLu);
					}else{
						var categoryLu = addFolder(topicLu,category);

						for (const leave in jsonData[area][topic][category]) {
							addAction(jsonData,path,[area,topic,category,leave],categoryLu);
						}
					}
				}
			}
		}
	}
	container.appendChild(mainUl);
}

function toggleBranch(event) {
	if( event.target.tagName === 'A')
		return;
	event.stopPropagation();
	var ul = event.target.querySelectorAll('ul')[0];
	ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
}

function save(bookmark){
	event.stopPropagation()
	var formData = new FormData();
	for (var key in bookmark) {
		formData.append(key, bookmark[key]);
	}
	fetch('bookmark.php', {
		method: 'POST',
		credentials: 'include',
		body: formData
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Response Error!');
			}
			return response.text();
		})
		.then(data => {
			console.log('Saved:', data);
			location.reload();
		})
		.catch(error => {
			console.error('Save failed:', error);
		});
}

document.getElementById('searchButton').addEventListener('click', function() {
	var locSearch = document.getElementById('searchText').value;
        window.location.href = "index.html?search=" + locSearch;
});
document.getElementById('searchReset').addEventListener('click', function() {
        window.location.href = "index.html";
});
document.getElementById('logoutButton').addEventListener('click', function() {
	logout();
        window.location.href = "index.html";
});
