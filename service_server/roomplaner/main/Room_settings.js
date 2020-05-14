let test;


function initRoom(room) {
	test = room;

}

function saveRoomSize() {
	document.getElementById("items-dropdown").style.visibility="visible";
	document.getElementById("placed").style.visibility="visible";
	document.getElementById("Room").style.visibility="hidden";
	document.getElementById("wall_1").value=5;
	document.getElementById("wall_2").value=5;
}

function setRoomSize() {
	let wall_1 =document.getElementById("wall_1");
	let wall_2 =document.getElementById("wall_2");
	scaleRoom(test, parseFloat(wall_1.value), parseFloat(wall_2.value));
	document.getElementById("wall_1_value").innerHTML=wall_1.value;
	document.getElementById("wall_2_value").innerHTML=wall_2.value;


}

function scaleRoom(room,wall1=5,wall2=5) {
	const diff_blend = 0.1;
	const length_Wall_1 =wall1;
	const length_Wall_2 =wall2;
	let parts= room.children;
	console.log(room);
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

function itemMovment(item,room,code) {
	if(true) {										//room.children[2].visible==false
		switch (code) {
			case 65:
				item.position.x -= 0.01;
				break;
			case 68:
				item.position.x += 0.01;
				break;
			case 83:
				item.position.z += 0.01;
				break;
			case 87:
				item.position.z -= 0.01;
				break;
			case 81:
				item.rotation.y += 0.01;
				break;
			case 69:
				item.rotation.y -= 0.01;
				break;
			case 79: //O für oben bewegen	
				item.position.y +=0.1;
			 break;
			case 85://U für unten bewegen
				item.position.y -=0.1;
				break;
		}
	}
}
