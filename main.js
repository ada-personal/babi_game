import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// --- Configuration ---
const STAR_COUNT = 3000;
const STAR_SIZE = 0.8;
const STAR_COLOR = 0xffffff;
const CLICK_THRESHOLD = 2; // Distance for raycaster to detect star

const LOVE_REASONS = [
    "Baby, your smile lights up my whole world",
    "My love, being with you feels like home",
    "You make even the quiet moments beautiful",
    "I love how safe I feel in your arms",
    "You turn ordinary days into something special",
    "Your laugh is my favorite sound",
    "You make my heart feel understood",
    "I love the way you look at me",
    "You bring peace into my life",
    "You make loving you so easy",
    "My favorite place is right next to you",
    "You always know how to make me smile",
    "I love how gentle you are with me",
    "You make me feel chosen every day",
    "Your presence changes my mood instantly",
    "You make my bad days feel lighter",
    "I love how real everything feels with you",
    "You understand me without words",
    "You make my heart feel calm",
    "I love growing with you",
    "You make love feel safe and warm",
    "I adore the little things you do",
    "You always show up for me",
    "I feel lucky to love you",
    "You make my world softer",
    "I love the way you care",
    "You make me feel enough",
    "You bring light into my life",
    "I love how patient you are with me",
    "You make me feel deeply loved",
    "You turn moments into memories",
    "I love how natural everything feels with you",
    "You are my comfort on hard days",
    "You make my heart feel full",
    "I love how you listen to me",
    "You make me feel seen",
    "You bring joy into my everyday life",
    "I love the way you hold me",
    "You make me feel secure",
    "You make life feel sweeter",
    "I love the warmth you bring",
    "You make my heart smile",
    "I love sharing life with you",
    "You make me feel peaceful",
    "I love how steady your love feels",
    "You make even small moments special",
    "You feel like home to me",
    "I love the way you love me",
    "You make everything brighter",
    "You are my safe place",
    "I love how deeply you care",
    "You make my heart feel understood",
    "I love how you support me",
    "You make love feel real",
    "I love the life we’re building",
    "You make me feel calm and excited at once",
    "I love choosing you every day",
    "You make my world better",
    "I love you more than words",

];

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001); // Adds depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10; // Initial position

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- Star Field ---
// Helper to create a soft glow texture for stars
function getStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

const particlesGeometry = new THREE.BufferGeometry();
const posArray = new Float32Array(STAR_COUNT * 3);
// Add color variation
const colorsArray = new Float32Array(STAR_COUNT * 3);

for (let i = 0; i < STAR_COUNT * 3; i += 3) {
    // Spread stars out
    posArray[i] = (Math.random() - 0.5) * 100; // x
    posArray[i + 1] = (Math.random() - 0.5) * 100; // y
    posArray[i + 2] = (Math.random() - 0.5) * 100; // z

    // Colors: mix of white, blueish, reddish
    const colorType = Math.random();
    let color = new THREE.Color();
    if (colorType > 0.8) color.setHex(0xaaaaaa); // White
    else if (colorType > 0.6) color.setHex(0xcceeff); // Blue-ish
    else if (colorType > 0.4) color.setHex(0xffdddd); // Red-ish
    else color.setHex(0xffffff);

    colorsArray[i] = color.r;
    colorsArray[i + 1] = color.g;
    colorsArray[i + 2] = color.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const material = new THREE.PointsMaterial({
    size: STAR_SIZE,
    map: getStarTexture(),
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const starsMesh = new THREE.Points(particlesGeometry, material);
scene.add(starsMesh);

// --- Planets (Realistic) ---
function createPlanetTexture(type, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const color = new THREE.Color(colorHex);

    // Fill background
    ctx.fillStyle = color.getStyle();
    ctx.fillRect(0, 0, 512, 512);

    // Noise / Details
    if (type === 'gas') {
        // Banding for Gas Giants
        for (let i = 0; i < 20; i++) {
            const y = Math.random() * 512;
            const h = Math.random() * 50 + 10;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
            ctx.fillRect(0, y, 512, h);

            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
            ctx.fillRect(0, y, 512, h / 2);
        }
    } else if (type === 'terrestrial') {
        // Craters / Noise
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = Math.random() * 3 + 1;
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        // Clouds (simple)
        if (colorHex === 0x2233ff) { // Earth-like
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const w = Math.random() * 100 + 20;
                const h = Math.random() * 30 + 10;
                ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
                ctx.fillRect(x, y, w, h);
            }
        }
    }

    return new THREE.CanvasTexture(canvas);
}

const planets = [];
const planetData = [
    { name: "Mercury", type: 'terrestrial', size: 0.8, color: 0xaaaaaa, pos: [-4, 2, -10], rotSpeed: 0.004 },
    { name: "Venus", type: 'terrestrial', size: 1.5, color: 0xeeccee, pos: [-10, 5, -20], rotSpeed: 0.002 },
    { name: "Earth", type: 'terrestrial', size: 1.6, color: 0x2233ff, pos: [-15, -2, -25], rotSpeed: 0.005 },
    { name: "Mars", type: 'terrestrial', size: 1.2, color: 0xff4422, pos: [-20, 8, -32], rotSpeed: 0.004 },
    { name: "Jupiter", type: 'gas', size: 4.0, color: 0xdca97f, pos: [25, -5, -45], rotSpeed: 0.001 },
    { name: "Saturn", type: 'gas', size: 3.5, color: 0xf5dfa1, pos: [35, 10, -60], rotSpeed: 0.001, hasRing: true },
    { name: "Uranus", type: 'gas', size: 2.5, color: 0x99ffff, pos: [45, -10, -75], rotSpeed: 0.002 },
    { name: "Neptune", type: 'gas', size: 2.4, color: 0x3333ff, pos: [55, 5, -90], rotSpeed: 0.002 }
];

planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.size, 64, 64);
    const texture = createPlanetTexture(data.type, data.color);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff, // Tint with white to let texture show through
        roughness: data.type === 'gas' ? 0.4 : 0.8,
        metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...data.pos);
    scene.add(mesh);

    if (data.hasRing) {
        const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
        // Create a texture for the ring too
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128; // 1D gradient actually needed but map to square
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(64, 64, 30, 64, 64, 64);
        grad.addColorStop(0, 'rgba(200, 180, 150, 0.8)');
        grad.addColorStop(0.5, 'rgba(200, 180, 150, 0.1)');
        grad.addColorStop(1, 'rgba(200, 180, 150, 0.8)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
        const ringTex = new THREE.CanvasTexture(canvas);

        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5; // Tilt the ring
        mesh.add(ring); // Make ring a child of the planet
    }

    // Store for animation
    planets.push({ mesh, speed: data.rotSpeed });
});

// Lights for the planets
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffaaee, 1, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
const secondaryLight = new THREE.PointLight(0xaaccff, 0.8, 50); // Cool light from opposite side
secondaryLight.position.set(-10, -5, 10);
scene.add(secondaryLight);


// --- Beach Scene ---
let oceanMesh, sandMesh;

function createBeachScene() {
    // 1. Sand Dune
    const sandGeo = new THREE.PlaneGeometry(200, 200, 64, 64);
    sandGeo.rotateX(-Math.PI / 2);

    // Add some noise to sand
    const pos = sandGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        // Gentle rolling dunes
        const y = Math.sin(x * 0.1) * 0.5 + Math.cos(z * 0.1) * 0.5;
        pos.setY(i, y - 4); // Lower than original ground
    }

    const sandMat = new THREE.MeshStandardMaterial({
        color: 0xe6ccb3,
        roughness: 1,
        metalness: 0
    });
    sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.visible = false;
    scene.add(sandMesh);

    // 2. Ocean
    const oceanGeo = new THREE.PlaneGeometry(200, 200, 128, 128);
    oceanGeo.rotateX(-Math.PI / 2);

    // Custom Shader for Waves
    const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x006994,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.9,
    });

    oceanMat.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        oceanMat.userData.shader = shader;

        shader.vertexShader = `
            uniform float time;
            ${shader.vertexShader}
        `;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            // Simple Wave Function
            float wave = sin(position.x * 0.2 + time) * 0.5;
            wave += cos(position.z * 0.15 + time * 1.2) * 0.5;
            transformed.y += wave;
            `
        );
    };

    oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.position.y = -4.5; // Water level
    oceanMesh.visible = false;
    scene.add(oceanMesh);
}

createBeachScene();

// --- Interaction Logic ---
let isSimRunning = false;
let inFlowerMode = false; // New state

const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.5; // Hit box size for stars
const mouse = new THREE.Vector2();

// UI Elements
const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');
const popup = document.getElementById('message-popup');
const closePopupBtn = document.getElementById('close-popup');
const popupTitle = document.getElementById('popup-title');
const popupContent = document.getElementById('popup-content');
const flowerUI = document.getElementById('flower-ui');
const backToSpaceBtn = document.getElementById('back-to-space');

// Start Button
startBtn.addEventListener('click', () => {
    introScreen.classList.remove('active');
    // Fly camera animation (simple manual lerp target)
    targetCameraZ = 5;
    isSimRunning = true;

    // Play Music
    const bgm = document.getElementById('bgm');
    bgm.volume = 0.5;
    bgm.play().catch(e => console.log("Audio play failed:", e));
});

let targetCameraZ = 10;
let targetCameraY = 0;

// Mouse Move (for parallax)
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Normalize for raycaster -1 to 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Click Handler
window.addEventListener('click', (event) => {
    if (!isSimRunning) return;
    // Ignore clicks on UI
    if (event.target.closest('#message-popup') ||
        event.target.closest('.close-btn') ||
        event.target.closest('#flower-ui')) return;

    // Raycast
    raycaster.setFromCamera(mouse, camera);

    if (inFlowerMode) {
        // Maybe click flowers? For now do nothing special
        return;
    }

    // Check Planets First
    const planetMeshes = planets.map(p => p.mesh);
    const planetIntersects = raycaster.intersectObjects(planetMeshes);
    if (planetIntersects.length > 0) {
        enterBeachMode();
        return;
    }

    // Check Stars
    const intersects = raycaster.intersectObject(starsMesh);
    if (intersects.length > 0) {
        showReason();
    }
});

function enterBeachMode() {
    inFlowerMode = true; // reusing variable for "Planet Mode"

    // Hide planets
    planets.forEach(p => p.mesh.visible = false);

    // Show Beach
    sandMesh.visible = true;
    oceanMesh.visible = true;

    // Move Camera to Beach View
    targetCameraZ = 0;
    targetCameraY = -2; // Eye level on beach
    camera.rotation.x = 0;

    // Sunset Mood
    scene.background = new THREE.Color(0xffaa66); // Orange Sunset
    scene.fog.color.setHex(0xffaa66);
    scene.fog.density = 0.015;

    // Sun
    const sunGeo = new THREE.CircleGeometry(15, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffddaa });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.name = 'sun';
    sun.position.set(0, 5, -80);
    scene.add(sun);

    // UI
    popup.classList.add('hidden');
    flowerUI.classList.remove('hidden');
    flowerUI.classList.add('visible');
}

function exitBeachMode() {
    inFlowerMode = false;

    // Restore Planets
    planets.forEach(p => p.mesh.visible = true);

    // Hide Beach
    sandMesh.visible = false;
    oceanMesh.visible = false;

    // Remove Sun
    const sun = scene.getObjectByName('sun');
    if (sun) scene.remove(sun);

    // Reset Space Mood
    scene.background = null;
    scene.fog.color.setHex(0x000000);
    scene.fog.density = 0.001;

    // Reset Camera
    targetCameraZ = 5;
    targetCameraY = 0;

    // UI
    flowerUI.classList.remove('visible');
    flowerUI.classList.add('hidden');
}

backToSpaceBtn.addEventListener('click', exitBeachMode);

closePopupBtn.addEventListener('click', () => {
    popup.classList.remove('visible');
    popup.classList.add('hidden');
});

function showReason() {
    const randomReason = LOVE_REASONS[Math.floor(Math.random() * LOVE_REASONS.length)];
    popupContent.textContent = randomReason;

    const reasonsTitles = ["A Secret Revealed", "The Stars Say...", "My Heart Whispers", "For You"];
    popupTitle.textContent = reasonsTitles[Math.floor(Math.random() * reasonsTitles.length)];

    popup.classList.remove('hidden');
    popup.classList.add('visible');
}


// --- Animation Loop ---
const clock = new THREE.Clock();
// Clock initialized once
// import { PointerLockControls } ... Hoisted to top

let moonMesh, earthMesh, controls;
let inMoonMode = false;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Movement Listeners
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = true; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = true; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = false; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = false; break;
    }
});

function createMoonScene() {
    // 1. Moon Surface
    const moonGeo = new THREE.PlaneGeometry(500, 500, 100, 100);
    moonGeo.rotateX(-Math.PI / 2);

    // Noise for craters/terrain
    const pos = moonGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y = (Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2) + (Math.random() * 0.5);
        pos.setY(i, y - 5);
    }

    // Texture/Material
    // Simple procedural grey dust
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 512, 512);
    // Noise
    for (let i = 0; i < 10000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);

    const moonMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 1,
        color: 0xaaaaaa
    });
    moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.visible = false;
    scene.add(moonMesh);

    // 2. Giant Earth in Sky
    const earthGeo = new THREE.SphereGeometry(30, 64, 64);
    const earthTex = createPlanetTexture('terrestrial', 0x2233ff); // Reuse earth gen
    const earthMat = new THREE.MeshStandardMaterial({
        map: earthTex,
        emissive: 0x112244,
        emissiveIntensity: 0.2
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, 50, -100);
    earthMesh.visible = false;
    scene.add(earthMesh);

    // 3. The Rose (Behind You)
    // Procedural Rose: Torus Knot + Red Color + Emissive
    const roseGeo = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const roseMat = new THREE.MeshStandardMaterial({
        color: 0xff0044, // Deep Red
        emissive: 0xff0044,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    const roseMesh = new THREE.Mesh(roseGeo, roseMat);

    // Position BEHIND start position (Camera looks at -100, starts at 0,0,0)
    // So +Z is behind
    roseMesh.position.set(0, 2, 20);
    roseMesh.name = 'rose';

    // Rose Light
    const roseLight = new THREE.PointLight(0xff0044, 2, 20);
    roseMesh.add(roseLight);

    moonMesh.add(roseMesh);

    // Controls
    controls = new PointerLockControls(camera, document.body);

    // Ensure we start looking forward so the rose is behind
}

function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fill Pink
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(0, 0, 512, 512);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('I LOVE', 256, 200);
    ctx.fillText('YOU', 256, 280);
    ctx.fillText('TOM', 256, 360);

    return new THREE.CanvasTexture(canvas);
}

function createHeartMesh() {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    // Rotate to stand up
    // Rotate to stand up
    geometry.rotateZ(Math.PI);
    // geometry.rotateX(Math.PI); // Removed to flip it back up
    geometry.center();

    const material = new THREE.MeshStandardMaterial({
        map: createHeartTexture(),
        color: 0xff6688,
        emissive: 0xaa2244,
        emissiveIntensity: 0.8,
        roughness: 0.4,
        metalness: 0.5
    });

    return new THREE.Mesh(geometry, material);
}

// function enterSunMode() { ... Removed ... }

createMoonScene();

// UI Buttons for Valentine
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const errorScreen = document.getElementById('error-screen');
const tryAgainBtn = document.getElementById('try-again-btn');
const moonUI = document.getElementById('moon-ui');
// const glitchScreen ... removed
// const hintText ... removed

btnNo.addEventListener('click', () => {
    // Simple 404
    errorScreen.classList.remove('hidden');
});

tryAgainBtn.addEventListener('click', () => {
    // Hide error
    errorScreen.classList.add('hidden');
});

btnYes.addEventListener('click', () => {
    enterMoonMode();
});

function enterMoonMode() {
    exitBeachMode(); // Clean up beach
    inMoonMode = true;

    // Hide planets/stars? Keep stars
    planets.forEach(p => p.mesh.visible = false);

    // Show Moon scene
    moonMesh.visible = true;
    earthMesh.visible = true;

    // Camera
    camera.position.set(0, 2, 0); // On surface
    camera.lookAt(0, 50, -100); // Look at Earth

    // Lock Pointer
    controls.lock();

    // UI
    moonUI.classList.remove('hidden');
    moonUI.classList.add('visible');

    // Lighting
    scene.fog.density = 0.005;
    scene.fog.color.setHex(0x000000); // Black sky
}



// Scary Mode Removed

// Rose Interaction State
let roseClicked = false;
let prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    prevTime = time;

    const elapsedTime = clock.getElapsedTime();

    if (inMoonMode) {
        // Earth Rotation
        if (earthMesh) earthMesh.rotation.y = elapsedTime * 0.05;

        // Rose Levitation & Proximity
        if (moonMesh) {
            const rose = moonMesh.getObjectByName('rose');
            if (rose) {
                rose.rotation.y += 0.01;
                rose.rotation.x = Math.sin(elapsedTime) * 0.1;
                rose.position.y = 2 + Math.sin(elapsedTime * 2) * 0.2; // Float

                // Proximity Check (Walk close to trigger)
                if (!roseClicked) {
                    const dist = camera.position.distanceTo(rose.position);
                    if (dist < 6) {
                        roseClicked = true;

                        // 1. Remove Rose
                        moonMesh.remove(rose);

                        // 2. Spawn Giant 3D Heart
                        const heart = createHeartMesh();
                        heart.scale.set(0.5, 0.5, 0.5);
                        heart.position.set(0, 5, 20); // Where rose was
                        heart.name = 'finalHeart';
                        moonMesh.add(heart);
                    }
                }
            }

            // Heart Animation
            const heart = moonMesh.getObjectByName('finalHeart');
            if (heart) {
                heart.rotation.y += 0.02;
                heart.scale.setScalar(0.5 + Math.sin(elapsedTime * 3) * 0.05); // Heartbeat pulse
            }
        }

        // Movement Logic
        if (controls && controls.isLocked) {
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize(); // Ensure consistent speed in all directions

            if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);
        }

    } else if (!inFlowerMode) {
        // Space Animation
        starsMesh.rotation.y = elapsedTime * 0.05;
        starsMesh.rotation.x = elapsedTime * 0.01;

        planets.forEach(p => {
            p.mesh.rotation.y += p.speed;
        });

        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    } else {
        // Beach Animation
        if (oceanMesh && oceanMesh.material.userData.shader) {
            oceanMesh.material.userData.shader.uniforms.time.value = elapsedTime;
        }
    }

    if (!inMoonMode) {
        camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
        camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    }

    renderer.render(scene, camera);
}

animate();
