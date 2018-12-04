
let t1 = document.getElementById('1');
let t2 = document.getElementById('2');
let t3 = document.getElementById('3');
let bottomButtons = document.getElementById('bottom-button');
let buttonStart = document.getElementById('button-start');
let reset = document.getElementById('reset');
let wishCanvas = document.getElementById('canvas');
let wishContext = wishCanvas.getContext( '2d' );
let baseTex = document.getElementById("scream");


let inputText='';
let texture;
var updateT = false;
let inputWish;
let obejct = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var distX, distY, distZ;
var velocity = new THREE.Vector3();
var objsize;
var controls2;


animatedTexts();
loadModelSky();


function animatedTexts(){
    setTimeout(function() {
        t1.setAttribute("id", "fadeIn");
    }, 3000);
    setTimeout(function() {
        t1.style.display = 'none';
        t2.setAttribute("id", "fadeIn");
    }, 6000);
    setTimeout(function() {
        t2.style.display = 'none';
        t3.setAttribute("id", "fadeIn");
    }, 9000);
    setTimeout(function() {
        t3.style.display = 'none';
        bottomButtons.style.display = 'inline-block';
	}, 12000);
}

function initControls() {
    controls2 = new THREE.OrbitControls( obj.children, renderer.domElement );
    controls2.addEventListener( 'change', render );
    controls2.enableDamping = true;
    controls2.enableZoom = true;
    controls2.autoRotate = true;
    controls2.minDistance  = 200;
    controls2.maxDistance  = 600;
    controls2.enablePan = true;
}

function makeWish(){
    resetCamera();
    blackIn();

    function loadModel() {
        //initialize texture
        object.traverse( function ( child ) {
            inputText = "";
            generateTexture();
            if ( child.isMesh ) {
                child.material.map = texture;
            }
        } );
        scene.add( object );
    }
    var manager = new THREE.LoadingManager( loadModel );
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };

    // model
    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }
    function onError() {}

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'assets/test3.obj', function ( obj ) {
       object = obj;
       obj.scale.set(30,30,30);
       obj.rotation.y = (Math.PI);
       obj.children[0].material = new THREE.MeshLambertMaterial();
       //position
       objsize = obj.position.set(7000,22500,17000);
    }, onProgress, onError );


    bottomButtons.style.opacity = '0';
    addInput();
}

var bk = document.getElementById('blkCanvas');
var ctx = bk.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function blackIn(){
    bk.style.display = "block";
    bk.style.opacity = "1";
    setTimeout(function() {
        bk.style.transition = "opacity 2s ease-out 0.5s";
        bk.style.opacity = "0";
    }, 100);
    setTimeout(function() {
        bk.style.display = "none";
    }, 2000);
}

function addInput() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("placeholder", "Type A Simple Wish!");
    x.setAttribute("id", "inputbox");
    x.setAttribute("onkeypress", "showResult()");
    document.body.appendChild(x);
}

function showResult(){
    if(event.keyCode == 13){
        var audio = new Audio("assets/sound.wav");
        audio.play();
        resetCameraTrue = false;

        setTimeout(function() {
            bottomButtons.style.opacity = "1";
        }, 5000);

        inputWish = document.getElementById("inputbox");
        inputText = inputWish.value;
        inputWish.setAttribute("id","fadeout");

        updateT = true;
        generateTexture();

        //fly animation
        initTween();
        requestAnimationFrame( animate );
        TWEEN.update();
    }
}

var maxWidth = 450;
var lineHeight = 90;

function generateTexture(){
    wishCanvas.width = 4096;
    wishCanvas.height = 4096;
    wishContext.fillStyle = 'black';
    wishContext.font = "96px Amatic";
    wishContext.drawImage(baseTex,0,0);
    texture = new THREE.CanvasTexture(wishCanvas);
    texture.needsUpdate = true;
    wrapText(wishContext,inputText,2350,2050,maxWidth,lineHeight);
}

function wrapText(wishContext, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = wishContext.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        wishContext.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    wishContext.fillText(line, x, y);
  }

//raycast
renderer.domElement.addEventListener( 'mousemove', raycast, false );
function raycast ( e ) {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( object.children );
    for ( var i = 0; i < intersects.length; i++ ) {
        console.log( intersects[ i ] );
    }
    var INTERSECTED;
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
		        INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
    intersects.length =0;
    }
    else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(0x000000);
        INTERSECTED = null;
    }
}

// Render
function animate() {
    requestAnimationFrame( animate );
    if(updateT == true){
        generateTexture();
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.map = texture;
        } );
        updateT = false;
    }
    renderer.render( scene, camera );
    TWEEN.update();
}
animate();
