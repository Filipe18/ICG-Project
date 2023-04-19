import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
//import { SpotLightShadow } from 'three';
import sky from '/assets/img/sky.webp';
import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const assetLoader = new GLTFLoader();
var airplaneMovement;
let scene, airplane, forklift;
//var model;

class Forklift {
  constructor(){
    assetLoader.load('../assets/forklift/scene.gltf', (gltf)=>{
      scene.add(gltf.scene);
      this.forklift = gltf.scene;

       
       this.forklift.scale.set(0.3, 0.3, 0.3);
       this.forklift.position.set(0, 0, 25);
       this.forklift.rotation.y += 4.7;
       this.speed = {
                vel: 0,
                rot: 0,
            }
      });
  }
  
    update() {
        if (this.forklift){
          this.forklift.rotation.y += this.speed.rot
          this.forklift.translateX(this.speed.vel)
        }
    }
    stop(){
        this.speed.rot = 0
        this.speed.vel = 0
    }

}

class Airplane {
  constructor(){
    assetLoader.load('../assets/airplane1/scene.gltf', (gltf)=>{
      scene.add(gltf.scene);
      this.airplane = gltf.scene;

       
       this.airplane.scale.set(0.7, 0.7, 0.7);
       this.airplane.position.set(42, 0, 8);
       this.airplane.rotation.y = 4.7;
       this.speed = {
                vel: 0.1,
                rot: 0,
            }
      });
  }
  
    update() {
        if (this.airplane){
          this.airplane.rotation.y += this.speed.rot
          this.airplane.translateZ(this.speed.vel)
          
          if (this.airplane.position.x <= -30) {
            this.airplane.position.y += 0.05;
          }
        }
    }
    stop(){
        this.speed.rot = 0
        this.speed.vel = 0
    }

};



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

//const forkliftCar = new forkliftLoad('../assets/forklift/scene.gltf');

//const airplane1 = new airplaneLoad('../assets/airplane1/scene.gltf');



forklift = new Forklift();

airplane = new Airplane();


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

window.addEventListener('keydown', function(e){
  if(e.key == "ArrowUp"){
   forklift.speed.vel = 0.07
  }
  if(e.key == "ArrowDown"){
    forklift.speed.vel = -0.07
  }
  if(e.key == "ArrowLeft"){
    forklift.speed.rot = 0.05
  }
  if(e.key == "ArrowRight"){
    forklift.speed.rot = -0.05
  }
})
window.addEventListener('keyup',function(e){
  forklift.stop();
})




function animate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;


    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    forklift.update();

    

    airplane.update();

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

   
    
    

    
    
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
        model.scale.set(0.7, 0.7, 0.7);
        model.position.set(0, 0, 45);
        //model.rotation.y = 4;
        
        console.log(model);
      }, undefined, function(error){
        console.error(error);
      });
}



function airplaneLoad(url){
  assetLoader.load(url, function(gltf){
    const model1 = gltf.scene;
    scene.add(model1);
    model1.scale.set(1, 1, 1);
    model1.position.set(42, 0, 8);
    //model1.rotation.y = 4;
    console.log(model1);
  }, undefined, function(error){
    console.error(error);
  });
};



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

function forkliftLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.4, 0.4, 0.4);
      model1.position.set(0, 0, 25);
      //model1.rotation.y = 4;
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}








