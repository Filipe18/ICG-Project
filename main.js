import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
//import { SpotLightShadow } from 'three';
import sky from '/assets/img/sky.webp';
import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const assetLoader = new GLTFLoader();
var airplaneMovement;
let scene;
//var model;

init();

function init(){


//const runwayUrl = new URL('../assets/scene.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 80, 0);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
/*scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide

});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);*/

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false

});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);


const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
//scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.5;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(sLightHelper);

//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);

//scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//renderer.setClearColor(0xFFEA00);


const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(sky);
const cubeTextureLoader = new THREE.CubeTextureLoader();
/*scene.background = cubeTextureLoader.load([
    sky,
    sky,
    sky,
    sky,
    sky,
    sky
    
]);*/

// const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
// const box2Material = new THREE.MeshBasicMaterial({
//     //color: 0x00FF00,
//     //map: textureLoader.load(sky)

// });

// const box2MultiMaterial = [
//     new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(sky)})

// ];
// const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
// scene.add(box2);
// box2.position.set(0, 15, 10);
// box2.material.map = textureLoader.load(sky);






const runway = new carregar('../assets/runway/scene.gltf');

const hangar = new hangarLoad('../assets/hangar/scene.gltf');

const airplane1 = new airplane1Load('../assets/airplane1/scene.gltf');

//const grass = new grassLoad('../assets/grass/scene.gltf');

//const grass1 = new grassLoad1('../assets/grass2/scene.gltf');



const gui = new dat.GUI();

const options = {
    //sphereColor: '#ffea00',
    //wireframe: false,
    //speed: 0.01,
    angle: 0.2,
    //penumbra: 0,
    //intensity: 1

};

/*gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
*/
gui.add(options, 'angle', 0, 1);
let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 - 1;

});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;




function animate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;


    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    //model.rotation.x = 0.1;
    //airplane1.position.x = 0;
    
    

    
    
    //console.log(intersects);

    // for (let i = 0; i < intersects.length; i++) {
    //     if (instersects[i].object.id === sphereId) {
    //         intersects[i].object.material.color.set(0xFF0000);
    //     }
        
    // }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

}

function carregar(url){
  assetLoader.load(url, function(gltf){
  const model = gltf.scene;
  scene.add(model);
  model.scale.set(0.2, 0.2, 0.2);
  model.position.set(0, 0, 45);
  console.log(model);
}, undefined, function(error){
  console.error(error);
});


}


function hangarLoad(url) {
    assetLoader.load(url, function(gltf){
        const model = gltf.scene;
        scene.add(model);
        model.scale.set(0.2, 0.2, 0.2);
        model.position.set(0, 0, 45);
        //model.rotation.y = 4;
        
        console.log(model);
      }, undefined, function(error){
        console.error(error);
      });

}



function airplane1Load(url){
    assetLoader.load(url, function(gltf){
       const model = gltf.scene;
        scene.add(model);
        model.scale.set(1, 1, 1);
        model.position.set(42, 0, 8);
        model.rotation.y += 4.7;
        
        console.log(model);
      }, undefined, function(error){
        console.error(error);
    });

    
}

function grassLoad(url){
    assetLoader.load(url, function(gltf){
        const model = gltf.scene;
        scene.add(model);
        model.scale.set(5, 5, 5);
        model.position.set(0, -15, 45);
        //model.rotation.y = 4;
        console.log(model);
      }, undefined, function(error){
        console.error(error);
      });
}

function grassLoad1(url){
    assetLoader.load(url, function(gltf){
        const model1 = gltf.scene;
        scene.add(model1);
        model1.scale.set(50, 10, 50);
        model1.position.set(0, -15, 45);
        //model1.rotation.y = 4;
        console.log(model1);
      }, undefined, function(error){
        console.error(error);
      });
}


class Airplane {

  var model;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }


}





