import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './jsm/loaders/RGBELoader.js';
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

var mouse, raycaster;
var container, controls;
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
render();

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
			render();
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
	document.getElementById("wall_2").addEventListener('input', setRoomSize, false);
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	document.addEventListener('mousemove',onDocumentMouseMove,false);

}



function handle_load(gltf) {

	mesh = gltf.scene;
	mesh.position.y +=0.25;
	scene.add( mesh );
	items.push(new items_object(name,mesh));
	// console.log(items);
	//items.push(mesh);
	FillListWithItems(items);
	counter++;
	name =null;
	render();
}

//####################################Eventhandler###########################################################################

function onDocumentKeyDown( event ) {
	switch ( event.keyCode ) {
		case 82: isRKeyDown = true;
			// console.log("true")
			break;
	}
	render();
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {

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
	if(isOnlineMode_mathu()){
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

