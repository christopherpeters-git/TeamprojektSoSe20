import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './jsm/loaders/RGBELoader.js';
import { DragControls } from './jsm/controls/DragControls.js';
var counter =0;
class items_object{
	constructor(name,object) {
		this.id =counter;
		this.name = name;
		this.object = object;
	}

	get object_(){
		return this.object;
	}
}
var room_wall_1, room_wall_2, room_wall_1_negativ,room_wall_2_negativ;
var dragControls;
var enableSelectionShift = false;
var draggroup;
var dragObjects = [];
var mouse, raycaster;
var container, orbitcontrols;
var camera, scene, renderer,name;
var mesh;
var room;
var loader;
var check =true;
var items =[];
//###############################Keys##################################################################
var isRKeyDown= false;
var w_Oben=false,s_Unten=false,a_Links=false,d_Rechts =false,q_dreh_l=false,e_dreh_r=false;
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
	orbitcontrols = new OrbitControls( camera, renderer.domElement );
	orbitcontrols.addEventListener( 'change', render ); // use if there is no animation loop
	orbitcontrols.minDistance = 2;
	orbitcontrols.maxDistance = 20;
	orbitcontrols.target.set( 0, 0, - 0.2 );
	orbitcontrols.update();
	sendFillitemListRequest();

	dragControls = new DragControls([... dragObjects],camera,renderer.domElement);
	dragControls.addEventListener('dragstart',function () { orbitcontrols.enabled=false;});
	dragControls.addEventListener('dragend',function () { orbitcontrols.enabled=true; });
	dragControls.addEventListener('drag', function (event) {
		mesh = event.object;
		event.object.position.y = 0;
		if(event.object.position.z > room_wall_1) {
			event.object.position.z = room_wall_1;
			console.log(room_wall_1);
		}
		if (event.object.position.x > room_wall_2) {
			event.object.position.x = room_wall_2;
			console.log(room_wall_2);
		}
		if(event.object.position.z < room_wall_1_negativ) {
			event.object.position.z = room_wall_1_negativ;
			console.log(room_wall_1_negativ);
		}
		if (event.object.position.x < room_wall_2_negativ) {
			event.object.position.x = room_wall_2_negativ;
			console.log(room_wall_2_negativ);
		}
		//führt zum bewegen von zwei objecten gleichzeitig
		mesh.position.x = event.object.position.x;
		mesh.position.z = event.object.position.z;
		console.log(mesh.position.x);
		console.log(event.object.position.x);
		console.log(mesh.position.z);
		console.log(event.object.position.z);

	})

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.getElementById("items-dropdown").addEventListener('change', loadItems, false);
	document.getElementById("placed").addEventListener('change', selectOption, false);
	document.getElementById("wall_1").addEventListener('input', setRoomSize, false);
	document.getElementById("wall_2").addEventListener('input', setRoomSize, false);
	document.getElementById("wall_1").addEventListener("input", updateRoomSizeHelper,false);
	document.getElementById("wall_2").addEventListener("input", updateRoomSizeHelper,false);
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	document.addEventListener('mousemove',onDocumentMouseMove,false);

	draggroup = new THREE.Group();
	draggroup.name = "DragQueen";
	scene.add(draggroup);

}
function updateRoomSizeHelper() {
	room_wall_1 = document.getElementById("wall_1").value;
	room_wall_2 = document.getElementById("wall_2").value;
	room_wall_1_negativ = room_wall_1 * -1;
	room_wall_2_negativ = room_wall_2 * -1;
	//console.log("Wall_1: " + room_wall_1 + " Wall_2: " + room_wall_2 + " Wall_1_neg: " + room_wall_1_negativ + " Wall_2_neg: " + room_wall_2_negativ);
}


function handle_load(gltf) {

	mesh = gltf.scene;
	mesh.position.y +=0.25;
	scene.add( mesh );
	items.push(new items_object(name,mesh));
	for(let i = 0;i < mesh.children.length;i++) {
		if(mesh.children[i] instanceof THREE.Mesh) {
			dragObjects.push(mesh.children[i]);
		}
	}
	console.log(dragObjects);
	// console.log(items);
	//items.push(mesh);
	FillListWithItems(items);
	counter++;
	name =null;
	console.log(scene);
	render();
}

//####################################Eventhandler###########################################################################

function onDocumentKeyDown( event ) {
	switch ( event.keyCode ) {
		case 82: isRKeyDown = true;
			// console.log("true")
			break;
		case 16: enableSelectionShift = true; break;
	}
	let code = event.keyCode;
	itemMovment(mesh,room,code);
	render();
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 187: var lengthWallX = document.getElementById("wall_1").value; console.log(lengthWallX); break;
		case 16: enableSelectionShift = false; break;
		case 82: isRKeyDown = false; break;
		case 65: a_Links =false; break;
	}

}
function  onDocumentMouseMove(event) {
	//todo set Visible Walls
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	//console.log(raycaster);
	var intersects = raycaster.intersectObjects(scene.children, true);
	if(room != null) {
		//console.log(intersects);
		room.children.forEach(function (child) {
			if (child instanceof THREE.Mesh) {
				child.visible = true;
			}
		})
	}
	if(intersects.length > 0) {
		let firstObj = intersects[0];
		for(let i = 0;i < room.children.length;i++) {
			if(firstObj.object == room.children[i] && "Cube005".localeCompare(firstObj.object.name)) {
				firstObj.object.visible = false;
			}
		}
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





	if(enableSelectionShift) {
		var draggableObjects = dragControls.getObjects();
		draggableObjects.length = 0;
		var intersections = raycaster.intersectObjects(dragObjects, true);
		if(intersections.length > 0) {
			var object = intersections[0].object;
			if(draggroup.children.includes(object) === true) {
				var lengthGroup = draggroup.children.length;
				for(var y = 0; y<scene.children.length;y++) {
					if(scene.children[y] instanceof THREE.Group && scene.children[y] !== draggroup && scene.children[y] !== room) {
						if(scene.children[y].children.length === 0) {
							for(var x = 0;x<lengthGroup;x++) {
								scene.children[y].attach(draggroup.children[0]);
							}
						}
					}
				}
			}else{
				var lengthGroup = draggroup.children.length;
				for(var y = 0; y<scene.children.length;y++) {
					if(scene.children[y] instanceof THREE.Group && scene.children[y] !== draggroup) {
						if(scene.children[y].children.length === 0) {
							for(var x = 0;x<lengthGroup;x++) {
								scene.children[y].attach(draggroup.children[0]);
							}
						}
					}
				}

				//object.material.emissive.set( 0xaaaaaa );
				var lengthChilds = object.parent.children.length;
				var currentGroup = object.parent;
				for(var i = 0; i<lengthChilds;i++) {
					//console.log(currentGroup.children[0].name);
					draggroup.attach(currentGroup.children[0]);
				}
			}
			dragControls.transformGroup = true;
			draggableObjects.push( draggroup);
		}
		if ( draggroup.children.length === 0 ) {
			console.log("gruppen nicht mehr bewegbar");
			dragControls.transformGroup = false;
			draggableObjects.push( ...dragObjects );

		}
	}




	const intersects = raycaster.intersectObjects( scene.children, true );


	if (intersects.length > 0) {
		if (isRKeyDown) {
			const intersect = intersects[0];
			let isFirstIntersectAWall = false;
			for (let i = 0; i < room.children.length; i++) {
				if (intersect.object == room.children[i]) {
					isFirstIntersectAWall = true;
					break;
				}
			}
			if (isFirstIntersectAWall) {
				console.log("Walls can not be deleted");
			} else {
				scene.remove(intersect.object.parent);
				if(!removeItemByObjectScene(intersect.object.parent)){
					console.log("Could not find object in the item array");
				}
				FillListWithItems(items);
			}
		}
	}
	render();

	//console.log(intersect);
	//console.log(camera);

}

//getting an item by index
function selectOption() {
	mesh =items[this.options[this.selectedIndex].value].object;
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
	dropdown.selectedIndex=0;
}

//For online use
function loadItemsOnline(dropdown) {
	const path = "" + getGetObjectTargetUrl() + "/" + (dropdown.selectedIndex - 1);
	loader.load(path,handle_load);
	console.log(path);
	name = dropdown.options[dropdown.selectedIndex].text;
	dropdown.selectedIndex=0;
}

//##############################################Others###############################################################
//Removes an item in the item-array, which holds the reference to object
function removeItemByObjectScene(object){
	for(let i = 0; i < items.length; i++){
		if(object.uuid == items[i].object.uuid){
			items.splice(i,1);
			return true;
		}
	}
	return false;
}

