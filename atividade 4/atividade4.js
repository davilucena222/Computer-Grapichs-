let image = new Image();
//image.src = src_gate;
image.src = src_checkerboard;

texture = new THREE.Texture(image);

image.onload = function() {
    texture.needsUpdate = true;
    //texture.magFilter = THREE.NearestFilter;
    //texture.magFilter = THREE.LinearFilter;
    //texture.minFilter = THREE.NearestFilter;
    //texture.minFilter = THREE.LinearFilter;
    //texture.minFilter = THREE.NearestMipmapNearestFilter;
    //texture.minFilter = THREE.NearestMipmapLinearFilter;
    //texture.minFilter = THREE.LinearMipmapNearestFilter;
    //texture.minFilter = THREE.LinearMipmapLinearFilter;
  
    //texture.anisotropy = 1;
    texture.anisotropy = 16;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
};

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 100);
camera.position.z = 0.9;
camera.position.y = 0.7;


scene.add(camera);

let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas")});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

//let geometry = new THREE.BoxGeometry(1,1,1); //Cubo usado para magnificacao
let geometry = new THREE.BoxGeometry(1.2,1.2,1.2); //Cubo usado para minificacao

//----------------------------------------------------------------------------
// Criação das fontes de luz pontuais (uma, mais clara, à frente e outra, 
// mais escura, atrás do cubo).
//----------------------------------------------------------------------------
var point_light = new THREE.PointLight(0xffffff);
point_light.position.set(-10, 15, 20);
scene.add(point_light);

var point_light = new THREE.PointLight(0x666666);
point_light.position.set(10, -10, -10);
scene.add(point_light);

//----------------------------------------------------------------------------
// Criação do material difuso. A textura define a reflectância difusa (k_d) 
// do material.
//----------------------------------------------------------------------------
let material = new THREE.MeshLambertMaterial({
    map: texture
});

var object_mesh = new THREE.Mesh(geometry, material);
scene.add(object_mesh);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
