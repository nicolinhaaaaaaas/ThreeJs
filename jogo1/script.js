import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//Cena e câmera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(4.61, 2.74, 8)

//Renderizador
const renderer = new THREE.WebGLRenderer({
    alpha:  true,
    antialias: true,
})
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//Controles
const controls = new OrbitControls(camera, renderer.domElement)

class Box extends THREE.Mesh {
    constructor({width, height, depth, color = '#00ff00', velocity = {x:0, y:0, z:0}, position = {x:0, y:0, z:0}, zAcceleration = false}){
        super(
            new THREE.BoxGeometry(width, height, depth, color), 
            new THREE.MeshStandardMaterial({ color })
            )

        this.position.set(position.x, position.y, position.z)

        this.height = height
        this.width = width
        this.depth = depth

        this.right = this.position.x + this.width / 2
        this.left = this.position.x - this.width / 2

        this.bottom = this.position.y - this.height / 2
        this.top = this.position.y + this.height / 2

        this.front = this.position.z + this.depth / 2
        this.back = this.position.z - this.depth / 2

        this.velocity = velocity
        this.gravity = -0.002

        this.zAcceleration = zAcceleration
       
    } 

    updateSides(){
        this.right = this.position.x + this.width / 2
        this.left = this.position.x - this.width / 2

        this.bottom = this.position.y - this.height / 2
        this.top = this.position.y + this.height / 2

        this.front = this.position.z + this.depth / 2
        this.back = this.position.z - this.depth / 2
    }
    
    update(ground){
        this.updateSides()

        if(this.zAcceleration) this.velocity.z +=0.0003

        this.position.x += this.velocity.x
        this.position.z += this.velocity.z
        this.position.y += this.velocity.y

        this.applyGravity(ground)

    }

    applyGravity(ground){
        this.velocity.y += this.gravity

        //colisão com o chão
        if(boxCollision({box1:this, box2:ground})) {
            this.velocity.y *= 0.8
            this.velocity.y = -this.velocity.y 
        }    
        else this.position.y += this.velocity.y
    }
}

function boxCollision({box1, box2 }){
    //detectar colisão no axis x
    const colisaox = box1.right >= box2.left && box1.left <= box2.right
    const colisaoz = box1.front >= box2.back && box1.back <= box2.front
    const colisaoy = box1.top >= box2.bottom && box1.bottom + box1.velocity.y <= box2.top

    return colisaox && colisaoz && colisaoy
}

//Adiciona um cubo
const cube = new Box({
    width: 1,
    height: 1,
    depth: 1,
    color: 0x00eeaa,
    velocity:{
        x: 0,
        y: -0.01,
        z: 0
    
    }
})
cube.castShadow = true
scene.add(cube)

// adicione um plano
const ground = new Box({
    width: 10,
    height: 0.5,
    depth: 50,
    color: 0x00aaff,
    position: {x: 0, y: -2, z: 0}
})

ground.receiveShadow = true
scene.add(ground)

// adicione uma luz direcional
const light = new THREE.DirectionalLight(0xffffff, 1.0)
light.position.x = -2
light.position.y = 3
light.position.z = 1
light.castShadow = true
scene.add(light)

// adicione uma luz ambiente
scene.add(new THREE.AmbientLight(0xffffff, 0.5))


const keys ={
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    espaco: {
        pressed: false
    },
    r:  {
        pressed: false
    }
}

// Event listeners
window.addEventListener('keydown', (e)=>{
    switch(e.code){
        case 'KeyA':
            keys.a.pressed = true
        break
        case 'KeyD':
            keys.d.pressed = true
        break
        case 'KeyW':
            keys.w.pressed = true
        break
        case 'KeyS':
            keys.s.pressed = true
        break
        // botao de espaço
        case 'Space':
            keys.espaco.pressed = true
        break
        case 'KeyR':
            keys.r.pressed = true
        break
    }
})

window.addEventListener('keyup', (e)=>{
    switch(e.code){
        case 'KeyA':
            keys.a.pressed = false
        break
        case 'KeyD':
            keys.d.pressed = false
        break
        case 'KeyW':
            keys.w.pressed = false
        break
        case 'KeyS':
            keys.s.pressed = false
        break
        // botao de espaço
        case 'Space':
            keys.espaco.pressed = false
        break
        case 'KeyR':
            keys.r.pressed = false
        break
    }
})

const enemies = []

let frames = 0
let spawnRate = 200
    
// animação
function animate() {
    const animationID = requestAnimationFrame(animate)
    renderer.render(scene, camera)

    //movimento
    cube.velocity.x = 0
    cube.velocity.z = 0

    if(keys.a.pressed){
        cube.velocity.x = -0.05

    } else if(keys.d.pressed){
        cube.velocity.x = 0.05

    } if(keys.w.pressed){
        cube.velocity.z = -0.05

    } else if(keys.s.pressed){
        cube.velocity.z = 0.05
    }
    // função de pulo
    if(keys.espaco.pressed){
        if(cube.bottom <= ground.top){
            cube.velocity.y = 0.06
        }
    }
    // função de reset

    if(keys.r.pressed){
        window.location.reload();
    }

    cube.update(ground)

    enemies.forEach(enemy => {
        enemy.update(ground)
        if(boxCollision({box1:cube, box2:enemy})){
           window.location.reload();
        }
    })

    if (frames %  spawnRate === 0){
        if(spawnRate > 20) spawnRate -= 10
        const enemy = new Box({
            width: 1,
            height: 1,
            depth: 1,
            color: 0x0000ff,
            velocity:{
                x: 0,
                y: -0.01,
                z: 0.005
            },
            position: {x: (Math.random() - 0.5) * 10, y: 0, z: -20},
            zAcceleration: true
        })
        enemy.castShadow = true
        scene.add(enemy)   
        enemies.push(enemy)  
    }
    frames ++
}
animate()