"use strict";
import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './jsm/loaders/RGBELoader.js';
let counter =0;
class items_object{
	constructor(name,object,objID) {
		this.id =counter;
		this.name = name;
		this.object_ID= objID;
		this.object = object;
	}
	get object_(){
		return this.object;
	}
}

let mouse, raycaster;
let container, controls;
let camera, scene, renderer,name,objID;
let mesh;
let room;
let loader;
let items =[];
let itemLoaded;
let lastSeenWall;
let data;
let dropdown;
let currentIndex;

//###############################Keys##################################################################
let isRKeyDown= false;

//###############################################################################################
init();


function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 10, 5 );

	scene = new THREE.Scene();
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	new RGBELoader()
		.setDataType( THREE.UnsignedByteType )
		.setPath( 'textures/' )
		.load( 'lebombo_2k.hdr', function ( texture ) {
			var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
			scene.background = envMap;
			scene.environment = envMap;
			texture.dispose();
			pmremGenerator.dispose();
			loader = new GLTFLoader();
			loader.load( 'items/room/room_1x1.gltf', function ( gltf ) {
				room = gltf.scene;
				initRoom(room);
				scaleRoom(room);
				scene.add( gltf.scene );
				lastSeenWall=room.children[2];
				console.log(lastSeenWall);
				loader.load("./items/_unuseable/test_pfeil.glb",handle_load);
				render();

			} );
		} );


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.8;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	var pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();
	controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 2;
	controls.maxDistance = 20;
	controls.target.set( 0, 0, - 0.2 );
	controls.update();
	sendFillitemListRequest();


	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.getElementById("items-dropdown").addEventListener('change', loadItems, false);
	document.getElementById("placed").addEventListener('change', selectOption, false);
	document.getElementById("wall_1").addEventListener('input', setRoomSize, false);
	document.getElementById("save_config_btn").addEventListener('click', saveConfig, false);
	document.getElementById("wall_2").addEventListener('input', setRoomSize, false);
	document.getElementById("load_btn").addEventListener('click', loadRoom_render, false);
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	document.addEventListener('mousemove',onDocumentMouseMove,false);
	document.addEventListener('dblclick',f,false);
	window.addEventListener("beforeunload", function(event) {
		event.returnValue = "Are you sure you want to quit?";
	});


}

function saveConfig() {
	const data = saveRoomToJsonString(items);
	console.log(data);
	sendPostSaveConfig(data, onSaveConfigResponse);
}

function loadRoom_render() {
	const inputId = document.getElementById("loadConfigId");
	const inputPass = document.getElementById("loadConfigPass");
	console.log("id: " + inputId.value + " pass: " + inputPass.value);
	if(!isNaN(inputId.value) || inputPass.value === ""){
		sendPostLoadConfig(inputId.value,inputPass.value,loadRoom);
		render();
	}else{
		alert("Id is not a number or password is empty!");
	}
}

function handle_load(gltf) {
	if(arrow==undefined){
		arrow = gltf.scene
		arrow.position.y += 0.50;
		arrow.visible=false;
		scene.add(arrow);
		initArrow(arrow);
		console.log(arrow);
		render();
	}else {
		mesh = gltf.scene;
		mesh.position.y += 0.25;
		arrow.position.set(mesh.position.x,mesh.position.y+5,mesh.position.z);
		arrow.visible=true;
		scene.add(mesh);
		items.push(new items_object(name, mesh, objID));
		FillListWithItems(items);
		console.log(objID);
		counter++;
		name = null;
		objID = null;
		itemLoaded = true;
		console.log(itemLoaded)
		render();
	}
}

function handle_loadConfig(gltf) {
	mesh = gltf.scene;
	mesh.position.y +=0.25;
	scene.add( mesh );
	items.push(new items_object(name,mesh,objID));
	FillListWithItems(items);
	console.log(objID);
	counter++;
	name =null;
	objID=null;
	itemLoaded = true;
	console.log(itemLoaded)
	render();
	currentIndex++;
	loadRoomItems();
}



//####################################Eventhandler###########################################################################
function f(event){
	//ItemKonfigurator?

}

function onDocumentKeyDown( event ) {
	switch ( event.keyCode ) {
		case 82: isRKeyDown = true;
			// console.log("true")
			break;
	}
	let code = event.keyCode;
	itemMovment(mesh,room,code,event);
	render();
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 82: isRKeyDown = false; break;
	}

}
function  onDocumentMouseMove(event) {
	let setWall=true;
	raycaster.setFromCamera( new THREE.Vector2(0,0), camera );
	const intersects = raycaster.intersectObjects(scene.children, true);
	if(scene.children[0] != null) {
		scene.children[0].children.forEach(function (child) {
			if (child instanceof THREE.Mesh) {
				child.visible = true;

			}
		})
	}
	if(intersects.length > 0) {
		let firstObj = intersects[0];
		for(let i = 0;i < room.children.length;i++) {
			if(firstObj.object === room.children[i] && "Cube005".localeCompare(firstObj.object.name)) {
				firstObj.object.visible = false;
				lastSeenWall=firstObj.object;
				setWall=false;
			}
		}
	}
	if(setWall){
		if(lastSeenWall!==undefined) lastSeenWall.visible=false;
	}
	render();
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

//Removing an object with r + mouse0
function onDocumentMouseDown( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects( scene.children, true );
	if (intersects.length > 0) {
		if (isRKeyDown&& event.buttons === 1) {
			let intersect;
			for(let i = 0; i< intersects.length;i++) {
				if(!intersectWall(intersects[i])) {
					 intersect = intersects[i];
					 break;
				}else{
					if(intersectVisible(intersects[i])) {
						intersect = intersects[i];
						console.log("cannot delete through visible walls!")
						break;
					}
				}
			}
			let isFirstIntersectAWall = intersectWall(intersect);
			if (isFirstIntersectAWall) {
				console.log("Walls can not be deleted");
			} else {
				scene.remove(intersect.object.parent);
				arrow.visible=false;
				if(!removeItemByObjectScene(intersect.object.parent)){
					console.log("Could not find object in the item array");
				}
				FillListWithItems(items);
			}
		}
		let id_firstItem = firstItem(intersects);
		if(id_firstItem!==-1&&event.buttons==2 && intersects[id_firstItem].object!==arrow.children[2]) {
			mesh=intersects[id_firstItem].object.parent;
			arrow.position.set(mesh.position.x,mesh.position.y+5,mesh.position.z);
			arrow.visible=true;
		}
		else if(event.buttons==2){
			arrow.visible=false;
			mesh=null;
		}
	}
	render();
}
//##############################################Helpers###############################################################
function intersectVisible(intersect) {
	if(intersect.object.visible === true) {
		return true;
	}
	return false;
}
function intersectWall(intersect){
	for (let i = 0; i < room.children.length; i++) {
		if (intersect.object == room.children[i]||intersect.object==arrow.children[2]) {
			return true;
		}
	}
	return false;
}
function firstItem(intersects){
	for(let i =0;i<intersects.length;i++){
		let chck=0;
		for(let j=0;j<room.children.length;j++){
			if(intersects[i].object ==room.children[j]){
				chck =-1;
			}
		}
		if(chck!==-1){
			 return i;
		}
	}
	return -1;
}

//getting an item by index
function selectOption() {
	if(this.selectedIndex==0)return 0;
	mesh =items[this.options[this.selectedIndex].value].object;
	arrow.position.set(mesh.position.x,mesh.position.y+5,mesh.position.z);
	render();
}

function exitPage(){
	return "are you sure?";
}

//##############################################Render###############################################################
function render() {
	renderer.setClearColor();
	renderer.render( scene, camera );

}

function loadItems(){
	if(getIsOnline()){
		loadItemsOnline(this);
	}else{
		loadItemsOffline(this);
	}
}



function loadItemsOffline(dropdown) {
	loader.load(dropdown.options[dropdown.selectedIndex].value,handle_load);
	name = dropdown.options[dropdown.selectedIndex].text;
	objID= dropdown.selectedIndex;
	dropdown.selectedIndex=0;
}

//For online use
function loadItemsOnline(dropdown) {
	const path = "" + getGetObjectTargetUrl() + "/" + (dropdown.selectedIndex - 1);
	loader.load(path,handle_load);
	console.log(path);
	name = dropdown.options[dropdown.selectedIndex].text;
	objID= dropdown.selectedIndex;
	dropdown.selectedIndex=0;
}

//##############################################Others###############################################################
//Removes an item in the item-array, which holds the reference to object
function removeItemByObjectScene(object){
	for(let i = 0; i < items.length; i++){
		if(object.uuid === items[i].object.uuid){
			items.splice(i,1);
			return true;
		}
	}
	return false;
}


//Loads items out of a Json
function loadRoom(config) {
	//hidding Setter Show Room
	document.getElementById("items-dropdown").style.visibility="visible";
	document.getElementById("placed").style.visibility="visible";
	document.getElementById("setter").style.visibility="hidden";
	document.getElementById("save_config_btn").style.visibility="visible";
	dropdown = document.getElementById("items-dropdown");
	//testJsonObject
	// let test_Object = '[{"wall1":9,"wall2":7},[{"position":[0,0.25,0],"rotation":[0,0,0],"ID":2},{"position":[0,0.25,0],"rotation":[0,0,0],"ID":5},{"position":[0,0.25,0],"rotation":[0,0,0],"ID":2}]]'
	console.log(config);
	data = JSON.parse(config);
	currentIndex = 0;
	const wall1= data[0].wall1;
	const wall2=data[0].wall2;
	//console.log(dropdown);
	//console.log(data);
	scaleRoom(getRoom(),wall1,wall2);
	document.getElementById("wall_1").value = wall1;
	document.getElementById("wall_2").value=wall2;
	roomSizeRestrictions();
	loadRoomItems();
	console.log("Loaded data: " + config);
}

function loadRoomItems() {
		if(currentIndex >= data[1].length){
			setItemPosition(data);
			return;
		}
		console.log("first");
		name = dropdown[data[1][currentIndex].ID].text;
		objID = data[1][currentIndex].ID;
		itemLoaded = false;
		const path = "" + getGetObjectTargetUrl() + "/" + (data[1][currentIndex].ID - 1);
		loader.load(path, handle_loadConfig);
}

function setItemPosition(data) {
	for (let i = 0; i < data[1].length; i++) {
		items[i].object.position.x = data[1][i].position[0];
		items[i].object.position.y = data[1][i].position[1];
		items[i].object.position.z = data[1][i].position[2];
		items[i].object.rotation.x = data[1][i].rotation[0];
		items[i].object.rotation.y = data[1][i].rotation[1];
		items[i].object.rotation.z = data[1][i].rotation[2];
		render();
	}
}
