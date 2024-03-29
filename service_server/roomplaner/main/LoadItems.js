const standardListMessage = "Select an item";

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
		option.text = entries[i].Name;
		option.value = entries[i].FileUrl;
		dropdown.add(option);
	}
}

//Refills the list with all items in items-array
function FillListWithItems(items) {
	const menue= document.getElementById("placed");
	menue.innerHTML = "";
	const newOption = document.createElement("option");
	newOption.innerHTML = standardListMessage;
	menue.appendChild(newOption);

	for(let i = 0; i < items.length; i++){
		const option = document.createElement("option");
		option.text= items[i].name;
		option.value =items[i].id;
		//todo set icons
		option.style.backgroundImage= "icon.png";
		menue.add(option);
	}
	menue.SetSelectedIndex = menue.length - 1;
}

