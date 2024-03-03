import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let cubos = [];
let L = 0.5;
let sep = 0.02;
const n = 10

for(let i = 0; i < n; i++){
    for(let j = 0; j < n; j++){
        const geometry = new THREE.BoxGeometry(0.1,0.1,0.1);
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 , wireframe:true} );
        const cube = new THREE.Mesh( geometry, material );

        cube.position.x = i * (L + sep) - (n -1) * (L + sep)/2;
        cube.position.y = j * (L + sep) - (n -1) * (L + sep)/2;
        scene.add( cube );
        cubos.push(cube);
    }
}

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 , wireframe:true} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const geometry2 = new THREE.SphereGeometry(1,32,32);
const material2 = new THREE.MeshBasicMaterial( { color: 0xff0000 , wireframe:true} );
const sphere = new THREE.Mesh( geometry2, material2 );
scene.add( sphere );

// Objects
const geometry3 = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials

const material3 = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

// Mesh
const sphere3 = new THREE.Mesh(geometry3,material3)
scene.add(sphere3)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)
let angulo = 0.3;
let vel = 0.01;
let tamanho = 0.08;

function animate(){
    requestAnimationFrame( animate );

    for(let i = 0; i < cubos.length; i++){
        cubos[i].rotation.x += vel;
        cubos[i].rotation.y += vel;
        cubos[i].rotation.z += 0.05;
    }

    cube.rotation.x += vel;
    cube.rotation.y += vel;
    cube.rotation.z += 0.05;

    angulo += 0.04;

    cube.position.x += tamanho * Math.cos(angulo);
    cube.position.y += tamanho * Math.sin(angulo);

    sphere.position .x += tamanho * Math.sin(angulo);
    sphere.position .y += tamanho * Math.cos(angulo);

    renderer.render( scene, camera );
}

animate();