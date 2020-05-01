

function sendFillitemListRequest() {
	//Preparing the dropdown list
	let dropdown = document.getElementById('items-dropdown');
	dropdown.length = 0;
	let defaultOption = document.createElement('option');
	defaultOption.text = 'Items';
	dropdown.add(defaultOption);
	dropdown.selectedIndex = 0;
	//Sending the request
	sendGetLoadJson(fillItemListWithJson);
}

function fillItemListWithJson(jsonData){
	//Process arrived data
	const dropdown = document.getElementById("items-dropdown");
	const entries = JSON.parse(jsonData);
	let option;
	for (let i = 0; i < entries.length; i++) {
		option = document.createElement('option');
		option.text = entries[i].ID +"_"+entries[i].FileUrl;
		option.value = entries[i].FileUrl;
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

