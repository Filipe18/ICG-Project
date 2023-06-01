import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
//import { SpotLightShadow } from 'three';
import sky from '/assets/img/sky.webp';
import sky2 from '/assets/img/sky2.jpg';

import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as YUKA from 'yuka';


const assetLoader = new GLTFLoader();
var airplaneMovement;
let scene, airplane, airplane2, runway;
//var model;
const minY = 0;

class Runway {
  constructor(){
    assetLoader.load('../assets/runway/scene.gltf', (gltf)=>{
      scene.add(gltf.scene);
      gltf.scene.traverse(function(node){
        if (node.isMesh)
            node.receiveShadow = true;
    })
      gltf.scene.receiveShadow = true;
      console.log(runway);
      this.runway = gltf.scene;


       
       this.runway.scale.set(0.4, 0.4, 0.4);
       this.runway.position.set(0, 0, 45);
       //this.runway.receiveShadow = true;
       

       
      /*
      const colors = [];

      this.runway.traverse((child) => {
        if (child.material && child.material.color) {
          const color = child.material.color.getHex();
          if (!colors.includes(color)) {
            colors.push(color);
          }
        }
      });

      console.log(colors);
      */
      const array = []
      const textureLoader = new THREE.TextureLoader();
      const grassTexture = textureLoader.load('/assets/img/grass4.jpg');
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(15, 15);
      //grassTexture.receiveShadow = true;
      this.runway.traverse((child) => {
        if (child.material && child.material.color) {
          
          const color = child.material.color.getHex();
          if (color == '9737364') { // check if color is grey
            //child.material.color.set(0x003300); // set to green
            child.material.map = grassTexture;
            child.material.map.receiveShadow = true;
          }
          if (child.isMesh)
            child.receiveShadow = true;
        }
      });
      console.log(array)
      });
  }
 
  

}
class Forklift {
  constructor(){
    assetLoader.load('../assets/airport_truck/scene.gltf', (gltf)=>{
      scene.add(gltf.scene);
      this.forklift = gltf.scene;

       
       this.forklift.scale.set(0.02, 0.02, 0.02);
       this.forklift.position.set(0, 0, 25);
       this.forklift.rotation.y += 4.7;
       this.forklift.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
            node.receiveShadow = true;
    })
       this.speed = {
                vel: 0,
                rot: 0,
            }
      });
  }
  
    update() {
        if (this.forklift){
          this.forklift.rotation.y += this.speed.rot
          this.forklift.translateZ(this.speed.vel)
        }
    }
    stop(){
        this.speed.rot = 0
        this.speed.vel = 0
    }

}

function random(min, max){
  return Math.random() * (max - min) + min;
}

class BriefCase{
  constructor(_scene){
    scene.add(_scene); 
    _scene.scale.set(0.2, 0.2, 0.2);
    _scene.position.set(random(-20, 20), 0, random(40, 60));
    _scene.traverse(function(node){
      if (node.isMesh)
          node.castShadow = true;
          node.receiveShadow = true;
  })
    
    this.briefcase = _scene; 

  }
}

class Airplane {
  constructor(){
    assetLoader.load('../assets/airplane1/scene.gltf', (gltf)=>{
      scene.add(gltf.scene);
      this.airplane = gltf.scene;

       
       this.airplane.scale.set(1.2, 1.2, 1.2);
       this.airplane.position.set(82, 0, -30);
       this.airplane.rotation.y = 4.7;

       this.airplane.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
            node.receiveShadow = true;
    })
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


class Airplane2 {
  constructor(){
    assetLoader.load('../assets/airplane3/scene.gltf', (gltf)=>{
      scene.add(gltf.scene);
      this.airplane2 = gltf.scene;

       
       this.airplane2.scale.set(5, 5, 5);
       this.airplane2.rotation.y = 4.7;
       this.airplane2.position.set(42, 0, 8);
       
       this.speed = {
                vel: 0.1,
                rot: 0,
            }
      });
  }

  
  
    update() {
        if (this.airplane2){
          this.airplane2.rotation.y += this.speed.rot
          this.airplane2.translateZ(this.speed.vel)
          //this.airplane2.position.x += -0.06;

          if (this.airplane2.position.x <= -12) {
            this.speed.rot = 0
            this.speed.vel = 0

            //this.airplane2.rotation.y += 1;
          }
          
        }
    }
    stop(){
        this.speed.rot = 0
        this.speed.vel = 0
    }

};

class ThirdPersonCamera{
  constructor(params) {
    this._params = params;
    this._camera = params.camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-15, 20, -30);
    idealOffset.applyQuaternion(this._params.target.Rotation);
    idealOffset.add(this._params.target.Position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(this._params.target.Rotation);
    idealLookat.add(this._params.target.Position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}




async function loadModel(url){
  return new Promise((resolve, reject) => {
    assetLoader.load(url, (gltf) => {
      resolve(gltf.scene)
    })
  })
}


let forkliftModel = null;

async function createBriefCase(){
  if(!forkliftModel){
    forkliftModel = await loadModel('assets/briefcase/scene.gltf');
  }
  return new BriefCase(forkliftModel.clone());
}


let briefcases = []
const briefcase_count = 10


init();

async function init(){

  


//const runwayUrl = new URL('../assets/scene.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);




scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);

const camera2 = new THREE.PerspectiveCamera(
  95,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);
camera2.position.set(53, 30, 17);
camera2.lookAt(scene.position);


const camera3 = new THREE.PerspectiveCamera(
  95,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);
camera3.position.set(-116, 5, 18.5);
camera3.lookAt(scene.position);

// Create a variable to track the active camera

scene.add(camera2);

scene.add(camera3)

let activeCamera = camera;

// Add the new camera to the scene


// Switch between cameras when 'C' key is pressed
window.addEventListener('keydown', function (e) {
  if (e.key === 'c' || e.key === 'C') {
      activeCamera = camera2;
    } else if(e.key === 'k' || e.key === 'K') {
      activeCamera = camera3;
    } else if(e.key === 'p' || e.key === 'P') {
      activeCamera = camera;
  }
});



const vehicle = new YUKA.Vehicle();

const path = new YUKA.Path();
path.add(new YUKA.Vector3(300, 100, -31));
path.add(new YUKA.Vector3(80, 15, -31));
path.add(new YUKA.Vector3(70, 10, -31));
path.add(new YUKA.Vector3(60, 5, -31));
path.add(new YUKA.Vector3(42, 1, -31));
path.add(new YUKA.Vector3(-6, 0, -31));
path.add(new YUKA.Vector3(-42, 0, -31));
path.add(new YUKA.Vector3(-86, 0, -31));
path.add(new YUKA.Vector3(-86, 0, 4));
path.add(new YUKA.Vector3(-24, 0, 4));
path.add(new YUKA.Vector3(-24, 0, 14));
//path.add(new YUKA.Vector3(-13, 0, 23));
//path.add(new YUKA.Vector3(-13, 0, 32));



path.loop = false;

vehicle.position.copy(path.current());




const position = [];
for (let i = 0; i < path._waypoints.length; i++) {
  const waypoint = path._waypoints[i];
  position.push(waypoint.x, waypoint.y, waypoint.z);
  
}


const followPathBehavior = new YUKA.FollowPathBehavior(path, 2);
vehicle.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path, 2);
//onPathBehavior.radius = 0.8;
vehicle.steering.add(onPathBehavior);

vehicle.maxSpeed = 10;

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const loader = new GLTFLoader();
loader.load('../assets/airplane3/scene.gltf', function(gltf){
  const model = gltf.scene;
 // model.scale.set(5, 5, 5);
  scene.add(model);
  model.matrixAutoUpdate = false;
  vehicle.scale = new YUKA.Vector3(10, 10, 10);
  vehicle.setRenderComponent(model, sync);
});

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);

camera.position.set(-10, -100000, 300);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
/*scene.add(box);
*/

const sphereGeometry = new THREE.SphereGeometry(200, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    wireframe: false

});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(0, 100, 0);

sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333, 3);
scene.add(ambientLight);
//amblientLight.castShadow = true;

/*const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
scene.add(directionalLight);
directionalLight.position.set(-90, 100, 40);
directionalLight.angle = 1000;
directionalLight.castShadow = true;
//directionalLight.shadow.camera.bottom = -5;


const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(dLightHelper);


const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

directionalLight.shadow.mapSize.width = 5000
    directionalLight.shadow.mapSize.height= 2048
    const d = 5000;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.camera.near = 500;
    directionalLight.shadow.camera.far = 3000;
*/
const spotLight = new THREE.SpotLight(0xFFFFFF, 2);
scene.add(spotLight);
spotLight.position.set(-100, 60, 0);
spotLight.castShadow = true;
spotLight.angle = 2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);

//scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//renderer.setClearColor(0xFFEA00);


const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(sky2);






const forklift = new Forklift();

airplane = new Airplane();







//briefcase = new BriefCase();



//airplane2 = new Airplane2();

runway = new Runway();

const controlTower = new controlTowerLoad('/assets/control_tower/scene.gltf');



const building = new buildingLoad('/assets/building/scene.gltf');

const helicopter = new helicopterLoad('/assets/helicopter/scene.gltf');

const heliport = new heliportLoad('/assets/heliport/scene.gltf');

const smallRunway = new smallRunwayLoad('/assets/smallRunway/scene.gltf');

const building2 = new buildingLoad2('/assets/building/scene.gltf');

const parking = new parkingLoad('/assets/parking/scene.gltf');

const sun = new sunLoad('/assets/sun/scene.gltf');

const fence = new fenceLoad('/assets/fence/scene.gltf');

//const fence2 = new fenceLoad2('/assets/fence/scene.gltf');

//const fence3 = new fenceLoad3('/assets/fence/scene.gltf');

//const fence4 = new fenceLoad4('/assets/fence/scene.gltf');

const fence5 = new fenceLoad5('/assets/fence/scene.gltf');

const fence6 = new fenceLoad6('/assets/fence/scene.gltf');

//const fence7 = new fenceLoad7('/assets/fence/scene.gltf');

const fence8 = new fenceLoad8('/assets/fence/scene.gltf');

const fence9 = new fenceLoad9('/assets/fence/scene.gltf');

const small_city = new small_cityLoad('/assets/small_city2/scene.gltf');

const building3 = new building3Load('/assets/building3/scene.gltf');



function sync(entity, renderComponent){
  renderComponent.matrix.copy(entity.worldMatrix);
}



const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));


const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
//scene.add(lines);

const time = new YUKA.Time();




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


gui.add(options, 'angle', 0, 1);
let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 - 1;

});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;

for (let i = 0; i < briefcase_count; i++) {
  const briefcase = await createBriefCase()
  briefcases.push(briefcase);
  
}

window.addEventListener('keydown', function(e){
  if(e.key == "ArrowUp"){
   forklift.speed.vel = 0.2
  }
  if(e.key == "ArrowDown"){
    forklift.speed.vel = -0.2
  }
  if(e.key == "ArrowLeft"){
    forklift.speed.rot = 0.1
  }
  if(e.key == "ArrowRight"){
    forklift.speed.rot = -0.1
  }
})
window.addEventListener('keyup',function(e){
  forklift.stop();
})


function isColliding(obj1, obj2){
  return(
    Math.abs(obj1.position.x - obj2.position.x) < 3 &&
    Math.abs(obj1.position.z - obj2.position.z) < 3
  )
}

function checkCollision(){
  if(forklift.forklift){
    briefcases.forEach(briefcase => {
      if(briefcase.briefcase){
        if (isColliding(forklift.forklift, briefcase.briefcase)) {
          scene.remove(briefcase.briefcase);

        }
      }
    })
  }
}

/*this._thirdPersonCamera = new ThirdPersonCamera({
  camera: this._camera,
  target: this._controls,
});*/

function animate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    forklift.update();

    checkCollision()

    airplane.update();

    

    //airplane2.update();

   // runway.color();

   const delta = time.update().getDelta();
   entityManager.update(delta);
  /*
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
  */

    
    
    //console.log(intersects);

    // for (let i = 0; i < intersects.length; i++) {
    //     if (instersects[i].object.id === sphereId) {
    //         intersects[i].object.material.color.set(0xFF0000);
    //     }
        
    // }
    if (camera.position.y < minY) {
      camera.position.y = minY; // Defina a posição y da câmera para o limite mínimo
    }

    //this._thirdPersonCamera.Update(timeElapsedS);

    renderer.render(scene, activeCamera);
}

renderer.setAnimationLoop(animate);

}


function controlTowerLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(10, 10, 10);
      model1.position.set(53, 9.5, 17);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}


function buildingLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(1, 1, 1);
      model1.position.set(90, 0, 125);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function buildingLoad2(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(1, 1, 1);
      model1.position.set(-5, 0, 125);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}



function helicopterLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.9, 0.9, 0.9);
      model1.position.set(-120, 2.3, 18.5);
      //model1.position.set(0, 1.5, 0);
      model1.rotation.y = 4.7;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}


function heliportLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(1.2,1.2,1.2);
      model1.position.set(-120, 0, 18.5);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh){
          node.castShadow = true;
          node.receiveShadow = true;
        }
            
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}


function smallRunwayLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(1, 1, 0.16);
      model1.position.set(-81, 0, 18);
      model1.rotation.y = 1.58;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
            node.receiveShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}



function parkingLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(7.9, 7.9, 8.2);
      model1.position.set(-103, 0, 124);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
            node.receiveShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function sunLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(2.5, 2.5, 2.5);
      model1.position.set(0, 100, 250);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

    
function fenceLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(1.72 ,0.03, 0.1);
      model1.position.set(-5, 0, -79);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}


function fenceLoad2(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.3,0.03, 0.1);
      model1.position.set(-5, 0, -17.5);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad3(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.28,0.03, 0.1);
      model1.position.set(-52, 0, -17.5);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad4(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.31,0.03, 0.1);
      model1.position.set(70, 0, 7.6);
      model1.rotation.y = 1.567;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad5(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(1.2,0.03, 0.1);
      model1.position.set(139, 0, 21);
      model1.rotation.y = 1.567;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad6(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.90,0.03, 0.1);
      model1.position.set(-150, 0, -3);
      model1.rotation.y = 1.567;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad7(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.165,0.03, 0.1);
      model1.position.set(-75, 0, 46.5);
      model1.rotation.y = 1.567;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad8(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.58,0.03, 0.1);
      model1.position.set(-102, 0, 70);
      //model1.rotation.y = 4;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function fenceLoad9(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.29,0.03, 0.1);
      model1.position.set(-53, 0, 95);
      model1.rotation.y = 1.567;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}


function small_cityLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(100, 100, 100);
      model1.position.set(-53, 0, 83);

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

function building3Load(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(100, 100, 100);
      model1.position.set(-53, 0, 83);

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    })
      console.log(model1);
    }, undefined, function(error){
      console.error(error);
    });
}

