var resetCameraTrue=false;
var container = document.getElementById('container');
var vertexHeight = 10000,
		planeDefinition = 100,
		planeSize = 1245000,
		totalObjects = 1,
		background = "#001622",
		meshColor = "#005e97";

var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 400000);
var center = new THREE.Vector3(camera.position.x, camera.position.y,camera.position.z);
	camera.position.x = -1633;
	camera.position.z = 17000;
	camera.position.y = 23300;

var controls = new THREE.FirstPersonControls( camera );


function resetCamera(){
    camera.position.x = -1633;
    camera.position.z = 17000;
    camera.position.y = 23300;
	controls.target.x = 7000;
	
	controls.target.y = 24000;
	controls.target.z = 17000;
	controls.object.position.x = -1533;
	controls.object.position.y = 23000;
	controls.object.position.z = 17000;

	controls.lat = 0;
	controls.lon = 0;
	controls.phi = 0;
	controls.theta = 0;
	
	resetCameraTrue = true;
}
controls.movementSpeed = 10000;
controls.lookSpeed = 0.02;
var clock = new THREE.Clock();

document.onkeydown  = go;
	var keyStatus = {}
	function go(e){
		keyStatus[e.keyCode] = true
		switch(e.keyCode){
				case 13:
		setTimeout(function() {
	 		controls.activeLook = true;
	 		controls.lookVertical = true;
	 		controls.onMouseMove = true;
			controls.onKeyDown = true;
	 	}, 4000);
		resetCamera();
	}
 }


//scene + plane
var scene = new THREE.Scene();
scene.add(camera);
scene.fog = new THREE.Fog(background, 1, 300000);
var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, planeDefinition, planeDefinition);
var plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
	color: meshColor,
	transparent: true ,
}));
var plane2 = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
	color: meshColor,
	transparent: true ,
}));
plane.rotation.x -= Math.PI * .5;
scene.add(plane);

//lights
var light = new THREE.AmbientLight ('white',1);
scene.add (light);

var light2 = new THREE.PointLight('#f94600',0.8);
light2.position.set( -800,17000,8000);
scene.add (light2);

var light3 = new THREE.PointLight('red',0.2);
light3.position.set(-1633,17000,22000);
camera.add(light3);

var randomcolor = Math.floor((Math.random() * 30000) + 20000);

function updatePlane() {
	for (var i = 0; i < planeGeo.vertices.length; i++) {
		planeGeo.vertices[i].z += Math.random() * vertexHeight - vertexHeight;
		planeGeo.vertices[i]._myZ = planeGeo.vertices[i].z
	}
};
updatePlane();
//renderer
var renderer = new THREE.WebGLRenderer({alpha: false});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(background, 1);
container.appendChild(renderer.domElement);
//render
var count = 0
function render() {
	controls.update( clock.getDelta() );
	for (var i = 0; i < planeGeo.vertices.length; i++) {
		var z = +planeGeo.vertices[i].z;
		planeGeo.vertices[i].z = Math.sin(( i + count * 0.00002)) * (planeGeo.vertices[i]._myZ - (planeGeo.vertices[i]._myZ* 0.6))
		plane.geometry.verticesNeedUpdate = true;
		count += 0.1
	}
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();

var tween;
function initTween() {
		var randomX = Math.floor((Math.random() * 1000) + 100000);
		var randomY = Math.floor((Math.random() * 2000) + 50000);
		var randomZ = Math.floor((Math.random() * (-10000)) + 20000);
		tween = new TWEEN.Tween(objsize)
		.to( { x: randomX,y:randomY,z:randomZ}, 17000 );
		tween.start();
		tween.easing(TWEEN.Easing.Sinusoidal.InOut);
}
//fly to up sky animation
var tween2;
	function Tween2() {
		tween2 = new TWEEN.Tween(camera)
		.to( { x: -1500,y:40000,z:10000}, 17000 );
		tween2.start();
		tween2.easing(TWEEN.Easing.Sinusoidal.InOut);
}
//  function mouseClicked

function onMouseMove( object ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener( 'mousemove', onMouseMove, false );
window.requestAnimationFrame(render);
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadModelSky(){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };
    var onError = function () { };
    new THREE.MTLLoader()
        .load( 'assets/lowpolygroup.mtl', function ( materials ) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials( materials )
                .load( 'assets/lowpolygroup.obj', function ( object ) {
                    object.position.set(120000,60000,10000);
                    object.scale.set(50,50,50);
                    scene.add( object );
                }, onProgress, onError );
        } );
}
var audio = new Audio("assets/bgm.mp3");
audio.loop = true;
audio.play();
