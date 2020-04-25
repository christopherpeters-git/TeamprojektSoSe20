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
var camera, scene, renderer;
var mesh;
var room;
var loader;
var check =true;
var items =[];
//###############################Keys##################################################################
var isShiftDown= false;
var w_Oben=false,s_Unten=false,a_Links=false,d_Rechts =false,q_dreh_l=false,e_dreh_r=false;
//###############################################################################################
init();
render();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 5, 3 );

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
			loader.load( 'items/room/_firstroom/room_test.gltf', function ( gltf ) {
				room = gltf.scene;
				console.log(room);
				room.rotation.y +=-0.4;

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


	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.getElementById("placeable").addEventListener("click",getItem,false);
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
	items.push(new items_object("Screen",mesh));
	console.log(items);
	//items.push(mesh);
	addItemToList(items[counter]);
	counter++;

	render();
}

//todo change into select
function getItem() {
	loader.load('items/screen/screen_16x9/leinwand_test.gltf', handle_load);
}
//####################################Eventhandler###########################################################################

function onDocumentKeyDown( event ) {

	switch ( event.keyCode ) {
		case 16: isShiftDown = true;
			console.log("true")
			break;

		case 65: a_Links= true;
			mesh.position.z -=0.01;
			break;
		case 68: d_Rechts=true;
			mesh.position.z+=0.01;
			break;
		case 83: s_Unten =true;
			mesh.position.x +=0.01;
			break;
		case 87: w_Oben =true;
			mesh.position.x -= 0.01;
			break;
		case 81: q_dreh_l = true;
			mesh.rotation.y += 0.01;
			break;
		case 69: q_dreh_l = true;
			mesh.rotation.y -= 0.01;
			break;
	}
	render();
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {

		case 16: isShiftDown = false; break;
		case 65: a_Links =false; break;
	}

}
function  onDocumentMouseMove(event) {
	//todo set Visible Walls
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	console.log(raycaster);

	render();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	render();

}

function onDocumentMouseDown( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( scene.children, true );
	if ( intersects.length > 0 ) {
		if(isShiftDown) {
			var intersect = intersects[0];
			if(intersect.object !==room.children[2]&&intersect.object !==room.children[3]
				&&intersect.object !==room.children[4]&&intersect.object !==room.children[5]) {
				//Todo remove object from Array and Scene
				//intersect.object.visible = false;
				//intersect.object.remove();
				console.log(intersect.object);
			}
		}
	}
	render();

	//console.log(intersect);
	//console.log(camera);

}
//adding items to the Dropdown menue
function addItemToList(items) {
	var menue= document.getElementById("placed");
	var option = document.createElement("option");
	option.text=items.name+items.id;
	option.value =items.id;
	//todo set icons
	option.style.backgroundImage= "icon.png";
	menue.add(option);

}
//getting an item by index
function selectOption() {
	var selectedOption = this.options[this.selectedIndex].value;
	mesh =items[this.options[this.selectedIndex].value].object;
	console.log(mesh);
}



//############################Roomfunctions##################################################################
//todo scaling over buttons or input
function scalRoom() {

	room.children[2].scale.x += 1;
	room.children[2].scale.z += 1;

	room.children[2].position.x += 1;
	room.children[2].position.z -= 1;
	room.children[2].position.y += 1;

	room.children[3].scale.z += 1;
	room.children[3].scale.x += 1;
	room.children[3].position.y += 1;

	room.children[4].scale.x += 1;
	room.children[4].scale.z += 1;
	room.children[4].position.y += 1;
	room.children[4].position.z += 1;
	room.children[4].position.x += 1;

}

//##############################################Render###############################################################
function render() {
	renderer.setClearColor();
	renderer.render( scene, camera );

}
