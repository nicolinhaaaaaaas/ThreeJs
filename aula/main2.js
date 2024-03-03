import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const texture = new THREE.TextureLoader('download.jfif')



const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
const cube2 = new THREE.Mesh( geometry2, material2 );
scene.add( cube2 );

camera.position.z = 5;

let cubos = [];


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let velX = 0.0;
let velY = 0.0;

document.onkeyup = function(e){
    if (e.keyCode == 37 || e.keyCode == 39) {
        velX = 0.0;
    }
    if (e.keyCode == 38 || e.keyCode == 40) {
        velY = 0.0;
    }

}

document.onkeydown = function(e) {
    console.log(e.keyCode);
    if (e.keyCode == 37) { // Esquerda
        velX = -0.1;
    }
    if (e.keyCode == 38) { // Cima
        velY = 0.1;
    }
    if (e.keyCode == 39) { // Direita
        velX = 0.1;
    }
    if (e.keyCode == 40) { // Baixo
        velY = -0.1;
    }
    if (e.keyCode == 90) { // Baixo
        camera.position.z -= 0.1;
    }
    if (e.keyCode == 88) { // Baixo
        camera.position.z += 0.1;
    }
    if (e.keyCode == 32) { // Espaço
        cube2.position.z = camera.position.z;
        cube2.position.x = camera.position.x;
        cube2.position.y = camera.position.y;

        /*
        const newGeometry = new THREE.BoxGeometry(1,1,1);
        const newMaterial = new THREE.MeshBasicMaterial( { color: getRandomColor() } );
        const newCube = new THREE.Mesh( newGeometry, newMaterial );
        newCube.position.x = Math.random() * 10 - 5;
        newCube.position.y = Math.random() * 10 - 5;
        newCube.position.z = Math.random() * 10 - 5;
        scene.add( newCube );

        cubos.push(newCube);
        console.log(newCube);
        */
    }
}

let velCuboZ1 = 0.05;
let velCuboZ2 = 0.2;
let vel = 0.05;



function getRandomArbitrary(min, max){
    return Math.random() * (max - min) + min
}

class Asteroide {
    

    posiciona(){
        this.modelo.position.x = getRandomArbitrary(-5, 5);
        this.modelo.position.y = getRandomArbitrary(-5, 5);
        this.modelo.position.z = -20
    }
    constructor(){
        const geometry = new THREE.SphereGeometry( 1, 32, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
        this.modelo = new THREE.Mesh( geometry, material );
        scene.add( this.modelo );
        this.vel = 0.5;
        this.posiciona();
    }

    move(){
         // faça o asteroide se mover
         this.modelo.rotation.x += 0.01;
         this.modelo.rotation.y += 0.01;
         this.modelo.position.z += vel;

        // faça o asteroide ir e voltar
        // faça o asteroide ir e voltar
        if (this.modelo.position.z > camera.position.z) {
            this.posiciona();
        }   
    }

    trataColisao(pos){

        let deltaX = pos.x - this.modelo.position.x
        let deltaY = pos.y - this.modelo.position.y
        let deltaZ = pos.z - this.modelo.position.z
        let distancia = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ)
        if(distancia < 2.0){
            this.posiciona();
            
        }
    }
}

let asteroides = [];

for(let i = 0; i < 10; i++) {
    for(let j = 0; j <10; j++){
        let asteroide = new Asteroide();
        asteroides.push(asteroide);
    }
}


let asteroide1 = new Asteroide();

function animate() {
	requestAnimationFrame( animate );

    cube2.rotation.x -= 0.01;
	cube2.rotation.y -= 0.01;
    cube2.position.z -= velCuboZ2;

    camera.position.x += velX;
    camera.position.y += velY;

    for(let i = 0; i < cubos.length; i++){
        cubos[i].rotation.x += 0.05;
        cubos[i].rotation.y += 0.05;
        cubos[i].rotation.z += 0.05;
    }

    asteroide1.move();

    for(let i = 0; i < asteroides.length; i++){
        asteroides[i].move();
        asteroides[i].trataColisao(cube2.position)
    }

    asteroide1.trataColisao(cube2.position)

	renderer.render( scene, camera );

    
    /*
    if (cube.position.z > camera.position.z) {
        velCuboZ1 = -0.05;
        //velX = Math.random() * 0.1 - 0.05;
        //velY = Math.random() * 0.1 - 0.05;
        console.log("mudou")
    }
    if (cube.position.z < camera.position.z - 5) {
        velCuboZ1 = 0.05;
        //velX = Math.random() * -0.1 - 0.05;
        //velY = Math.random() * -0.1 - 0.05;
        console.log("mudou")
    } 
    if (cube2.position.z > camera.position.z) {
        velCuboZ2 = -0.05;
        //velX = Math.random() * 0.1 - 0.05;
        //velY = Math.random() * 0.1 - 0.05;
        console.log("mudou")
    }
    if (cube2.position.z < camera.position.z - 5) {
        velCuboZ2 = 0.05;
        //velX = Math.random() * 0.1 - 0.05;
        //velY = Math.random() * 0.1 - 0.05;
        console.log("mudou")
    }

	*/
}
animate();


