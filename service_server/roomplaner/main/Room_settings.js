let room_wall_1, room_wall_2, room_wall_1_negativ, room_wall_2_negativ;
let test;
let arrow;
const movementSpeed =0.01;
let factor;
let reset_factor;
let lastKeycode;
let timer =0;
let counter =0;
const lengthUnit = "m";

function initRoom(room) {
	test = room;
}
function initArrow(incArrow) {
	arrow=incArrow;
}
function saveRoomSize() {
	document.getElementById("items-dropdown").style.visibility="visible";
	document.getElementById("placed").style.visibility="visible";
	document.getElementById("setter").style.visibility="hidden";
	document.getElementById("save_config_btn").style.visibility="visible";
	roomSizeRestrictions();

}
function setRoomSize() {
	let wall_1 =document.getElementById("wall_1");
	let wall_2 =document.getElementById("wall_2");
	scaleRoom(test, parseFloat(wall_1.value), parseFloat(wall_2.value));
	document.getElementById("wall_1_value").innerHTML=wall_1.value + " " + lengthUnit;
	document.getElementById("wall_2_value").innerHTML=wall_2.value + " "+ lengthUnit;

}
function scaleRoom(room,wall1=5,wall2=5) {
	const diff_blend = 0.1;
	const length_Wall_1 =wall1;
	const length_Wall_2 =wall2;
	let parts= room.children;
	//scaling Walls
	parts[2].scale.x = length_Wall_2;
	parts[2].visible=false;
	parts[5].scale.x = length_Wall_2;
	parts[3].scale.z = length_Wall_1;
	parts[4].scale.z = length_Wall_1;
	// bottom
	parts[6].scale.set(length_Wall_2, 0.1, length_Wall_1);
		//position of Walls
		parts[2].position.z = (length_Wall_1 + diff_blend);
		parts[5].position.z = -(length_Wall_1 + diff_blend);
		parts[3].position.x = length_Wall_2 + diff_blend;
		parts[4].position.x = -(length_Wall_2 + diff_blend);
}
function setVisibleWalls(wall,room){
	let parts= room.children;
	for(let i =2;i<6;i++){
		if(parts[i]===wall){
			parts[i].visible=false;
			console.log("Wall"+i+" hidden");
		}
		else{
			parts[i].visible=true;
		}
	}

}

function setMovingDirection(room){
	if(room.children[2].visible==false||room.children[4].visible==false){
		factor =1;
	}
	if(room.children[5].visible==false||room.children[3].visible==false){
		factor =-1;
	}else{
		factor=1;
	}
	reset_factor=factor;
}
function setMovingSpeed(code){
	if(lastKeycode==code){
		let time_now=Date.now();
		time_now = time_now-timer;
		time_now = Math.floor((time_now/1000));
		if(time_now<1&&counter<=15){
			counter++;
		}
		if(counter>10){
			factor=factor*10;
		}
		if(time_now>=1){
			counter =0;
			factor=reset_factor;
		}
	}
	else{
		counter =0;
		factor=factor/10;
	}
}

function roomSizeRestrictions() {
	room_wall_1 = document.getElementById("wall_1").value;
	room_wall_2 = document.getElementById("wall_2").value;
	room_wall_1_negativ = room_wall_1 * -1;
	room_wall_2_negativ = room_wall_2 * -1;
}

function itemMovment(item,room,code,event) {
	if(item==null)return 0;
	setMovingDirection(room)
	setMovingSpeed(code);
	if(room.children[2].visible==false||room.children[5].visible==false) {
		timer=Date.now();
		switch (code) {
			case 65:
				event.preventDefault();

					item.position.x -= (movementSpeed * factor);

				lastKeycode=code;
				break;
			case 68:
				event.preventDefault();
				item.position.x += (movementSpeed * factor);
				lastKeycode=code;
				break;
			case 83:
				event.preventDefault();
				item.position.z += (movementSpeed * factor);
				lastKeycode=code;
				break;
			case 87:
				event.preventDefault();
				item.position.z -= (movementSpeed * factor);
				lastKeycode=code;
				break;
			case 81:
				event.preventDefault();
				item.rotation.y += (movementSpeed * factor);
				lastKeycode=code;
				break;
			case 69:
				event.preventDefault();
				lastKeycode=code;
				item.rotation.y -= (movementSpeed * factor);
				break;
			case 79: //O für oben bewegen
				event.preventDefault();
				item.position.y += movementSpeed;
				break;
			case 85://U für unten bewegen
				event.preventDefault();
				item.position.y -= movementSpeed;
				break;
		}
	}
	else{
		timer=Date.now();
		switch (code) {
			case 65:
				event.preventDefault();
				lastKeycode=code;
				item.position.z -= (movementSpeed * factor);
				break;
			case 68:
				event.preventDefault();
				lastKeycode=code;
				item.position.z += (movementSpeed * factor);
				break;
			case 83:
				event.preventDefault();
				lastKeycode=code;
				item.position.x -= (movementSpeed * factor);
				break;
			case 87:
				event.preventDefault();
				lastKeycode=code;
				item.position.x += (movementSpeed * factor);
				break;
			case 81:
				event.preventDefault();
				lastKeycode=code;
				item.rotation.y += (movementSpeed * factor);
				break;
			case 69:
				event.preventDefault();
				lastKeycode=code;
				item.rotation.y -= (movementSpeed * factor);
				break;
			case 79: //O für oben bewegen
				event.preventDefault();
				item.position.y += movementSpeed;
				break;
			case 85://U für unten bewegen
				event.preventDefault();
				item.position.y -= movementSpeed;
				break;
		}
	}
	if(item.position.x > room_wall_2 -0.1) {
		item.position.x = room_wall_2 -0.1;
	}
	if(item.position.x < room_wall_2_negativ+0.1) {
		item.position.x = room_wall_2_negativ+0.1 ;
	}
	if(item.position.z > room_wall_1-0.1) {
		item.position.z = room_wall_1-0.1;
	}
	if(item.position.z < room_wall_1_negativ+0.1) {
		item.position.z = room_wall_1_negativ+0.1;
	}
	arrow.position.set(item.position.x,item.position.y+5,item.position.z);
}

function openSet(evt, Name) {
	// Declare all variables
	let i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(Name).style.display = "block";
	evt.currentTarget.className += " active";
}

function getRoomsize() {
	let wall_1 =document.getElementById("wall_1");
	let wall_2 =document.getElementById("wall_2");
	wall_1 = parseFloat(wall_1.value);
	wall_2 = parseFloat(wall_2.value);

	return [wall_1,wall_2];

}

function setColor(item){

}

function getRoom() {
	return test;
}
