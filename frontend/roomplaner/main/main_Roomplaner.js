


import * as THREE from '../build/three.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from './jsm/utils/RoughnessMipmapper.js';


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
	camera.position.set( 5, 4, 3 );

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
			// model
			// use of RoughnessMipmapper is optional
			var roughnessMipmapper = new RoughnessMipmapper( renderer );
			loader = new GLTFLoader();
			loader.load( 'items/room/room_1x1.gltf', function ( gltf ) {
				room = gltf.scene;
				scaleRoom(room,4,7);
				//room.rotation.y +=-0.4;

				//room.scale.add(room.scale,room.scale); sehr wichtig*****
				//room.visible=false;
				//room.scale.add(room.scale,vec23.scale);
				//console.log(room);
				//room.nodes[1].scale(0,0,0);
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
	controls.maxDistance = 15;
	controls.target.set( 0, 0, - 0.2 );
	controls.update();
	fillItemList()


	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.getElementById("items-dropdown").addEventListener('change', loadItems, false);
	document.getElementById("placed").addEventListener('change', selectOption, false);
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	document.addEventListener('mousemove',onDocumentMouseMove,false);

}



function handle_load(gltf) {

	//console.log(gltf);
	mesh = gltf.scene;
	mesh.position.y +=0.25;
	scene.add( mesh );
	items.push(new items_object(name,mesh));
	console.log(items);
	//items.push(mesh);
	FillListWithItems(items);
	counter++;
	name =null;
	render();
}

//####################################Eventhandler###########################################################################

function onDocumentKeyDown( event ) {

	let code = event.keyCode;
	itemMovment(mesh,room,code);
	switch ( event.keyCode ) {
		case 16:
			isShiftDown = true;
			console.log("true")
		case 82: isRKeyDown = true;
			// console.log("true")
			break;
	}
	render();
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {

		case 16: isRKeyDown = false; break;
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
				console.log(intersect.object);
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
	var selectedOption = this.options[this.selectedIndex].value;
	mesh =items[this.options[this.selectedIndex].value].object;
	console.log(mesh);
}




//##############################################Render###############################################################
function render() {
	renderer.setClearColor();
	renderer.render( scene, camera );

}

function loadItems() {
	loader.load(this.options[this.selectedIndex].value,handle_load);
	name = this.options[this.selectedIndex].text;
	this.selectedIndex=0;

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

