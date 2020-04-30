/* For offline use
function fillItemList() {

	let dropdown = document.getElementById('items-dropdown');
	dropdown.length = 0;

	let defaultOption = document.createElement('option');
	defaultOption.text = 'Items';

	dropdown.add(defaultOption);
	dropdown.selectedIndex = 0;

	const url = './items.json';

	const request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
		if (request.status === 200) {
			const data = JSON.parse(request.responseText);
			let option;
			for (let i = 0; i < data.length; i++) {
				option = document.createElement('option');
				option.text = data[i].ID +"_"+data[i].Name;
				option.value = data[i].FileUrl;
				dropdown.add(option);

			}
		} else {
			// Reached the server, but it returned an error
		}
	}
	request.onerror = function() {
		console.error('An error occurred fetching the JSON from ' + url);
	};

	request.send();
}

 */
function sendFillitemListRequest() {
	//Preparing the dropdown list
	let dropdown = document.getElementById('items-dropdown');
	dropdown.length = 0;
	let defaultOption = document.createElement('option');
	defaultOption.text = 'Items';
	dropdown.add(defaultOption);
	dropdown.selectedIndex = 0;
	//Sending the request
	sendGetRequest(fillItemListWithJson);
}

function fillItemListWithJson(jsonData){
	//Process arrived data
	console.log(jsonData);
	const dropdown = document.getElementById("items-dropdown");
	const entries = JSON.parse(jsonData);
	let option;
	for (let i = 0; i < entries.length; i++) {
		option = document.createElement('option');
		option.text = entries[i].ID +"_"+entries[i].Name;
		// option.value = entries[i].FileUrl;
		dropdown.add(option);
	}
}


function addItemToList(items) {
	var menue= document.getElementById("placed");
	var option = document.createElement("option");
	option.text=items.name+items.id;
	option.value =items.id;
	//todo set icons
	option.style.backgroundImage= "icon.png";

	menue.add(option);

}

