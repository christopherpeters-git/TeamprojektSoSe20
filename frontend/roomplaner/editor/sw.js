// r115

const assets = [
	'./',

	'../files/favicon.ico',

	'../build/three.module.js',

	'../main/jsm/controls/TransformControls.js',

	'../main/jsm/libs/chevrotain.module.min.js',
	'../main/jsm/libs/inflate.module.min.js',

	'../main/js/libs/jszip.min.js',
	'../main/js/libs/draco/draco_decoder.js',
	'../main/js/libs/draco/draco_decoder.wasm',
	'../main/js/libs/draco/draco_encoder.js',
	'../main/js/libs/draco/draco_wasm_wrapper.js',

	'../main/jsm/loaders/AMFLoader.js',
	'../main/jsm/loaders/ColladaLoader.js',
	'../main/jsm/loaders/DRACOLoader.js',
	'../main/jsm/loaders/FBXLoader.js',
	'../main/jsm/loaders/GLTFLoader.js',
	'../main/jsm/loaders/KMZLoader.js',
	'../main/jsm/loaders/MD2Loader.js',
	'../main/jsm/loaders/OBJLoader.js',
	'../main/jsm/loaders/MTLLoader.js',
	'../main/jsm/loaders/PLYLoader.js',
	'../main/jsm/loaders/RGBELoader.js',
	'../main/jsm/loaders/STLLoader.js',
	'../main/jsm/loaders/SVGLoader.js',
	'../main/jsm/loaders/TGALoader.js',
	'../main/jsm/loaders/TDSLoader.js',
	'../main/jsm/loaders/VRMLLoader.js',
	'../main/jsm/loaders/VTKLoader.js',

	'../main/jsm/curves/NURBSCurve.js',
	'../main/jsm/curves/NURBSUtils.js',

	'../main/jsm/exporters/ColladaExporter.js',
	'../main/jsm/exporters/DRACOExporter.js',
	'../main/jsm/exporters/GLTFExporter.js',
	'../main/jsm/exporters/OBJExporter.js',
	'../main/jsm/exporters/PLYExporter.js',
	'../main/jsm/exporters/STLExporter.js',

	'../main/jsm/geometries/TeapotBufferGeometry.js',

	'../main/js/vr/HelioWebXRPolyfill.js',
	'../main/jsm/webxr/VRButton.js',

	'./manifest.json',
	'./images/icon.png',

	'./js/libs/codemirror/codemirror.css',
	'./js/libs/codemirror/theme/monokai.css',

	'./js/libs/codemirror/codemirror.js',
	'./js/libs/codemirror/mode/javascript.js',
	'./js/libs/codemirror/mode/glsl.js',

	'./js/libs/esprima.js',
	'./js/libs/jsonlint.js',
	'./js/libs/glslprep.min.js',

	'./js/libs/codemirror/addon/dialog.css',
	'./js/libs/codemirror/addon/show-hint.css',
	'./js/libs/codemirror/addon/tern.css',

	'./js/libs/codemirror/addon/dialog.js',
	'./js/libs/codemirror/addon/show-hint.js',
	'./js/libs/codemirror/addon/tern.js',
	'./js/libs/acorn/acorn.js',
	'./js/libs/acorn/acorn_loose.js',
	'./js/libs/acorn/walk.js',
	'./js/libs/ternjs/polyfill.js',
	'./js/libs/ternjs/signal.js',
	'./js/libs/ternjs/tern.js',
	'./js/libs/ternjs/def.js',
	'./js/libs/ternjs/comment.js',
	'./js/libs/ternjs/infer.js',
	'./js/libs/ternjs/doc_comment.js',
	'./js/libs/tern-threejs/threejs.js',

	'./js/libs/signals.min.js',
	'./js/libs/ui.js',
	'./js/libs/ui.three.js',

	'./js/libs/app.js',
	'./js/Player.js',
	'./js/Script.js',

	//

	'./css/main.css',

	'./js/EditorControls.js',
	'./js/Storage.js',

	'./js/Editor.js',
	'./js/Config.js',
	'./js/History.js',
	'./js/Loader.js',
	'./js/LoaderUtils.js',
	'./js/Menubar.js',
	'./js/Menubar.File.js',
	'./js/Menubar.Edit.js',
	'./js/Menubar.Add.js',
	'./js/Menubar.Play.js',
	'./js/Menubar.Examples.js',
	'./js/Menubar.Help.js',
	'./js/Menubar.Status.js',
	'./js/Sidebar.js',
	'./js/Sidebar.Scene.js',
	'./js/Sidebar.Project.js',
	'./js/Sidebar.Settings.js',
	'./js/Sidebar.Settings.Shortcuts.js',
	'./js/Sidebar.Settings.Viewport.js',
	'./js/Sidebar.Properties.js',
	'./js/Sidebar.Object.js',
	'./js/Sidebar.Geometry.js',
	'./js/Sidebar.Geometry.Geometry.js',
	'./js/Sidebar.Geometry.BufferGeometry.js',
	'./js/Sidebar.Geometry.Modifiers.js',
	'./js/Sidebar.Geometry.BoxGeometry.js',
	'./js/Sidebar.Geometry.CircleGeometry.js',
	'./js/Sidebar.Geometry.CylinderGeometry.js',
	'./js/Sidebar.Geometry.DodecahedronGeometry.js',
	'./js/Sidebar.Geometry.ExtrudeGeometry.js',
	'./js/Sidebar.Geometry.IcosahedronGeometry.js',
	'./js/Sidebar.Geometry.OctahedronGeometry.js',
	'./js/Sidebar.Geometry.PlaneGeometry.js',
	'./js/Sidebar.Geometry.RingGeometry.js',
	'./js/Sidebar.Geometry.SphereGeometry.js',
	'./js/Sidebar.Geometry.ShapeGeometry.js',
	'./js/Sidebar.Geometry.TetrahedronGeometry.js',
	'./js/Sidebar.Geometry.TorusGeometry.js',
	'./js/Sidebar.Geometry.TorusKnotGeometry.js',
	'./js/Sidebar.Geometry.TubeGeometry.js',
	'./js/Sidebar.Geometry.TeapotBufferGeometry.js',
	'./js/Sidebar.Geometry.LatheGeometry.js',
	'./js/Sidebar.Material.js',
	'./js/Sidebar.Animation.js',
	'./js/Sidebar.Script.js',
	'./js/Sidebar.History.js',
	'./js/Strings.js',
	'./js/Toolbar.js',
	'./js/Viewport.js',
	'./js/Viewport.Camera.js',
	'./js/Viewport.Info.js',

	'./js/Command.js',
	'./js/commands/AddObjectCommand.js',
	'./js/commands/RemoveObjectCommand.js',
	'./js/commands/MoveObjectCommand.js',
	'./js/commands/SetPositionCommand.js',
	'./js/commands/SetRotationCommand.js',
	'./js/commands/SetScaleCommand.js',
	'./js/commands/SetValueCommand.js',
	'./js/commands/SetUuidCommand.js',
	'./js/commands/SetColorCommand.js',
	'./js/commands/SetGeometryCommand.js',
	'./js/commands/SetGeometryValueCommand.js',
	'./js/commands/MultiCmdsCommand.js',
	'./js/commands/AddScriptCommand.js',
	'./js/commands/RemoveScriptCommand.js',
	'./js/commands/SetScriptValueCommand.js',
	'./js/commands/SetMaterialCommand.js',
	'./js/commands/SetMaterialColorCommand.js',
	'./js/commands/SetMaterialMapCommand.js',
	'./js/commands/SetMaterialValueCommand.js',
	'./js/commands/SetMaterialVectorCommand.js',
	'./js/commands/SetSceneCommand.js',
	'./js/commands/Commands.js',

	//

	'./main/arkanoid.app.json',
	'./main/camera.app.json',
	'./main/particles.app.json',
	'./main/pong.app.json',
	'./main/shaders.app.json'

];

self.addEventListener( 'install', async function () {

	const cache = await caches.open( 'threejs-editor' );

	assets.forEach( function ( asset ) {

		cache.add( asset ).catch( function () {

			console.error( '[SW] Cound\'t cache:', asset );

		} );

	} );

} );

self.addEventListener( 'fetch', async function ( event ) {

	const request = event.request;
	event.respondWith( cacheFirst( request ) );

} );

async function cacheFirst( request ) {

	const cachedResponse = await caches.match( request );

	if ( cachedResponse === undefined ) {

		console.error( '[SW] Not cached:', request.url );
		return fetch( request );

	}

	return cachedResponse;

}
