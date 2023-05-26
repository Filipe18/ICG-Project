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
let scene, airplane, forklift, airplane2, runway;
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


       
       this.runway.scale.set(0.2, 0.2, 0.2);
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
      });
  }

  

}
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


const vehicle = new YUKA.Vehicle();

const path = new YUKA.Path();
path.add(new YUKA.Vector3(300, 100, 8));
path.add(new YUKA.Vector3(80, 15, 8));
path.add(new YUKA.Vector3(70, 10, 8));
path.add(new YUKA.Vector3(60, 5, 8));
path.add(new YUKA.Vector3(42, 1, 8));
path.add(new YUKA.Vector3(-6, 0, 8));
path.add(new YUKA.Vector3(-42, 0, 8));
path.add(new YUKA.Vector3(-42, 0, 12));
path.add(new YUKA.Vector3(-42, 0, 23));
path.add(new YUKA.Vector3(-35, 0, 23));
path.add(new YUKA.Vector3(-13, 0, 23));
path.add(new YUKA.Vector3(-13, 0, 32));








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
  vehicle.scale = new YUKA.Vector3(5, 5, 5);
  vehicle.setRenderComponent(model, sync);
});

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);

camera.position.set(-10, 80, 300);
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

const sphereGeometry = new THREE.SphereGeometry(200, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    wireframe: false

});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(0, 100, 0);

sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);
//amblientLight.castShadow = true;

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.angle = 1.6;
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;


const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
//scene.add(dLightHelper);


const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(dLightShadowHelper);

directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height= 2048
    const d = 5000;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.camera.near = 500;
    directionalLight.shadow.camera.far = 3000;

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
scene.background = textureLoader.load(sky2);
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






//const runway = new carregar('../assets/runway/scene.gltf');

//const hangar = new hangarLoad('../assets/forks/scene.gltf');

//const forkliftCar = new forkliftLoad('../assets/forklift/scene.gltf');

//const airplane1 = new airplaneLoad('../assets/airplane1/scene.gltf');



forklift = new Forklift();

airplane = new Airplane();

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





//const mountain = new mountainLoad('/assets/mountain/scene.gltf');


//const runWayLights = new runwayLightsLoad('/assets/runway_lights/scene.gltf');

/*const vehicleGeometry = new THREE.ConeBufferGeometry(0.1, 0.5, 8);
vehicleGeometry.rotateX(Math.PI * 0.5);
const vehicleMaterial = new THREE.MeshNormalMaterial();
const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh);*/




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

    //airplane2.update();

   // runway.color();

   const delta = time.update().getDelta();
   entityManager.update(delta);

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
    if (camera.position.y < minY) {
      camera.position.y = minY; // Defina a posição y da câmera para o limite mínimo
  }

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

function controlTowerLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(7, 7, 7);
      model1.position.set(28, 7.5, 30);
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
      model1.scale.set(0.5, 0.5, 0.5);
      model1.position.set(45, 0, 85);
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
      model1.scale.set(0.5, 0.5, 0.5);
      model1.position.set(-5, 0, 85);
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
      model1.scale.set(0.5, 0.5, 0.5);
      model1.position.set(-61, 1.5, 31);
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
      model1.scale.set(0.7,0.7, 0.7);
      model1.position.set(-61, 0, 32);
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


function smallRunwayLoad(url){
  assetLoader.load(url, function(gltf){
      const model1 = gltf.scene;
      scene.add(model1);
      model1.scale.set(0.5, 0.5, 0.08);
      model1.position.set(-40.7, 0, 32);
      model1.rotation.y = 1.58;

      model1.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
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
      model1.scale.set(1.3, 1.3, 1.3);
      model1.position.set(-80, 0, 114);
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
      model1.scale.set(0.3,0.03, 0.1);
      model1.position.set(44.5, 0, -17.5);
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