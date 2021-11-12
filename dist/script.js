import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { OneMinusDstColorFactor, TetrahedronBufferGeometry } from 'three'

// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/texture/normalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64)

const particles = new THREE.BufferGeometry;
const particlesCount = 10000;
const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount*3; i++) {
    positionArray[i] = (Math.random() - 0.5)*7
}

particles.setAttribute('position', new THREE.BufferAttribute(positionArray,3))

// Materials

////Normal Map

const sphereMaterial = new THREE.MeshStandardMaterial()
sphereMaterial.metalness = 0.7
sphereMaterial.roughness = 0.2
sphereMaterial.color = new THREE.Color(0x292929)
sphereMaterial.normalMap = normalTexture

/// Particles

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    transparent: true,
})

// Mesh
const sphere = new THREE.Mesh(geometry,sphereMaterial)
const particlesMesh = new THREE.Points(particles, particlesMaterial)
scene.add(sphere, particlesMesh)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Light 1 (white)
const pointLight1 = new THREE.PointLight('white', 2)
pointLight1.position.set(-1.9,1,-1.6)
pointLight1.intensity = 10
scene.add(pointLight1)


// Light 2
const pointLight2 = new THREE.PointLight(0xe34d66, 2)
pointLight2.position.set(2.26,-1.91,0.6)
pointLight2.intensity = 3
scene.add(pointLight2)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

// Mouse movement
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX= 0
let targetY = 0

const windowHalfX = window.innerWidth /2;
const windowHalfY = window.innerHeight /2;

function onDocumentMouseMove (event) {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .5 * (targetY - sphere.rotation.x)
    sphere.rotation.z += -.5 * (targetY - sphere.rotation.x)

    particlesMesh.rotation.y = .1*elapsedTime
    
    particlesMesh.rotation.y = mouseX * elapsedTime*0.00008
    particlesMesh.rotation.x = mouseY * elapsedTime*0.00008
    

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()