class Room {
	constructor(wall1,wall2) {
		this.wall1 =wall1;
		this.wall2 = wall2;
	}
}
class RoomObj{
	constructor(ID) {
		this.position=[];
		this.rotation=[];
		this.ID = ID;
	}
}

function saveRoomToJsonString(items) {
	console.log(items);
	let room_setting=[];
	let room_objects=[];
	//saving room
	const[wall1,wall2]=getRoomsize();
	let s_Room= new Room(wall1,wall2);
	room_setting.push(s_Room);
	//saving objects
	for(let i =0;i<items.length;i++){
		let Roomobj = new RoomObj(items[i].object_ID);
		Roomobj.position[0]= items[i].object.position.x;
		Roomobj.position[1]=items[i].object.position.y;
		Roomobj.position[2]=items[i].object.position.z;

		Roomobj.rotation[0]=items[i].object.rotation.x;
		Roomobj.rotation[1]=items[i].object.rotation.y;
		Roomobj.rotation[2]=items[i].object.rotation.z;
		room_objects.push(Roomobj);
	}
	room_setting.push(room_objects);
	let data= JSON.stringify(room_setting);
	return data;
}

function onSaveConfigResponse(response){
	const msg = "SaveConfigAnswer: " + response;
	alert(msg)
	console.log("SaveConfigAnswer: " + msg);
}

