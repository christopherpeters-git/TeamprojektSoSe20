
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


function FillListWithItems(items) {
	const menue= document.getElementById("placed");
	const childBackup = menue.firstChild;
	menue.innerHTML = "";
	menue.appendChild(childBackup);

	for(let i = 0; i < items.length; i++){
		const option = document.createElement("option");
		option.text=items[i].name+items[i].id;
		option.value =items[i].id;
		//todo set icons
		option.style.backgroundImage= "icon.png";
		menue.add(option);
	}
}

