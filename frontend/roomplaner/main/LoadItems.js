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
let jsonArrived = false;
let jsonContent = "";

function setJsonArrived(set, content){
	jsonContent = content;
	jsonArrived = set;
}

async function fillItemList() {
	//Preparing the dropdown list
	let dropdown = document.getElementById('items-dropdown');
	dropdown.length = 0;
	let defaultOption = document.createElement('option');
	defaultOption.text = 'Items';
	dropdown.add(defaultOption);
	dropdown.selectedIndex = 0;
	//Sending the request
	sendGetLoadJson();
	const promise = new Promise(((resolve, reject) => {
		if(jsonArrived){
			resolve("Json-Array arrived from Service");
		}
	}))
	console.log(await promise);
	//Process arrived data
	const entries = JSON.parse(jsonContent);
	let option;
	for (let i = 0; i < data.length; i++) {
		option = document.createElement('option');
		option.text = entries[i].ID +"_"+entries[i].Name;
		option.value = entries[i].FileUrl;
		dropdown.add(option);
	}
	setJsonArrived(false,"");
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

