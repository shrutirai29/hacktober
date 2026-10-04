import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  RotateCw, 
  Eye, 
  ZoomIn, 
  Camera, 
  Layers, 
  Compass, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Maximize2,
  Wand2,
  Laptop,
  Plug,
  Tv,
  CreditCard,
  Battery,
  Headphones,
  Box,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

export default function RoomSceneViewer({
  highlightedItemId = null,
  onSelectItem = null,
  onHoverItem = null,
  onReconstructRoom = null,
  photoUrl = "/assets/kanwal-room-original.jpg",
  roomTitle = "Kanwal's Reconstructed Hostel Room (Block C-402)",
  reconstructionStatus = "3D Twin Ready"
}) {
  const mountRef = useRef(null);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "photo"
  const [showLabels, setShowLabels] = useState(true);
  const [showPhotoLabels, setShowPhotoLabels] = useState(true);
  const [selectedObj, setSelectedObj] = useState(null);
  const [screenLabels, setScreenLabels] = useState([]);
  const [lightingMood, setLightingMood] = useState("golden"); // "golden" | "sunset" | "night"
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Sync refs so Three.js render loop doesn't re-initialize on state toggles
  const viewModeRef = useRef(viewMode);
  const showLabelsRef = useRef(showLabels);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);

  // Refs for 3D state
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const interactiveObjectsRef = useRef([]);
  const beaconRingsRef = useRef([]);
  const lightsRef = useRef({});
  const materialsRef = useRef({});
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Definition of interactive belongings in Kanwal's actual room
  const roomItems = [
    {
      id: "laptop",
      name: "MacBook Pro",
      status: "Active Workstation",
      risk: "normal",
      note: "Open on center of birch study desk.",
      pos: [-3.2, 2.15, -1.1],
      color: 0x8b5cf6, // purple
      category: "Tech"
    },
    {
      id: "charger",
      name: "65W Laptop Charger",
      status: "High-Risk Memory Alert",
      risk: "critical",
      note: "Plugged into wall switchboard behind study desk! Kanwal forgot this 3x.",
      pos: [-2.1, 2.5, -7.5],
      color: 0xef4444, // coral red
      category: "Tech & Power"
    },
    {
      id: "water_bottle",
      name: "Purple Insulated Flask",
      status: "Verified on Desk",
      risk: "normal",
      note: "Standing on right side of study desk.",
      pos: [-1.4, 2.45, -1.6],
      color: 0x9333ea,
      category: "Daily"
    },
    {
      id: "backpack",
      name: "Travel Backpack",
      status: "Exit Luggage",
      risk: "normal",
      note: "Standing freely on floor beside creator desk and chair.",
      pos: [-5.3, 0.8, 0.2],
      color: 0x1e293b,
      category: "Luggage"
    },
    {
      id: "chair",
      name: "Purple Ergonomic Chair",
      status: "Room Furniture",
      risk: "normal",
      note: "Lilac upholstered swivel chair on caster wheels.",
      pos: [-3.2, 1.2, 0.4],
      color: 0x7c3aed,
      category: "Furniture"
    },
    {
      id: "plushie",
      name: "Cozy Seal Plushie",
      status: "Bedside Companion",
      risk: "normal",
      note: "Cute chubby white seal plushie resting on lavender duvet.",
      pos: [4.4, 1.18, -4.8],
      color: 0xec4899,
      category: "Personal"
    },
    {
      id: "bed",
      name: "Lavender Daybed",
      status: "Cozy Corner",
      risk: "normal",
      note: "Single platform bed with lavender duvet and mint pillow.",
      pos: [4.8, 0.85, -2.2],
      color: 0xa855f7,
      category: "Furniture"
    },
    {
      id: "shelf_pothos",
      name: "Pothos & Bookshelf",
      status: "Room Decor",
      risk: "normal",
      note: "Floating birch shelf with colorful books, panda, and trailing ivy.",
      pos: [-3.2, 6.2, -7.4],
      color: 0x10b981,
      category: "Decor"
    }
  ];

  // Dynamically update lighting when mood state changes (without re-rendering scene)
  useEffect(() => {
    const lights = lightsRef.current;
    const mats = materialsRef.current;
    if (!lights.ambient || !lights.sun || !lights.desk || !lights.rgb) return;

    if (lightingMood === "golden") {
      lights.ambient.color.setHex(0xfff7ed);
      lights.ambient.intensity = 0.85;
      lights.sun.color.setHex(0xffeedb);
      lights.sun.intensity = 1.35;
      lights.desk.color.setHex(0xffedd5);
      lights.desk.intensity = 1.4;
      lights.rgb.color.setHex(0x818cf8);
      lights.rgb.intensity = 1.2;
      if (lights.nightLamp) lights.nightLamp.intensity = 0.2;
      if (mats.windowGlass) mats.windowGlass.color.setHex(0xbae6fd);
      if (mats.monGlow) mats.monGlow.emissive.setHex(0x4f46e5);
      if (mats.sunBeam) mats.sunBeam.opacity = 0.14;
    } else if (lightingMood === "sunset") {
      lights.ambient.color.setHex(0xffe4e6);
      lights.ambient.intensity = 0.75;
      lights.sun.color.setHex(0xfb923c);
      lights.sun.intensity = 1.5;
      lights.desk.color.setHex(0xfef08a);
      lights.desk.intensity = 1.6;
      lights.rgb.color.setHex(0xc084fc);
      lights.rgb.intensity = 1.6;
      if (lights.nightLamp) lights.nightLamp.intensity = 0.8;
      if (mats.windowGlass) mats.windowGlass.color.setHex(0xfecdd3);
      if (mats.monGlow) mats.monGlow.emissive.setHex(0x7c3aed);
      if (mats.sunBeam) mats.sunBeam.opacity = 0.22;
    } else if (lightingMood === "night") {
      lights.ambient.color.setHex(0x1e1b4b);
      lights.ambient.intensity = 0.45;
      lights.sun.color.setHex(0x818cf8);
      lights.sun.intensity = 0.55;
      lights.desk.color.setHex(0xf59e0b);
      lights.desk.intensity = 2.4;
      lights.rgb.color.setHex(0x06b6d4);
      lights.rgb.intensity = 1.9;
      if (lights.nightLamp) lights.nightLamp.intensity = 2.0;
      if (mats.windowGlass) mats.windowGlass.color.setHex(0x312e81);
      if (mats.monGlow) mats.monGlow.emissive.setHex(0x38bdf8);
      if (mats.sunBeam) mats.sunBeam.opacity = 0.05;
    }
  }, [lightingMood]);

  // Handle auto rotation
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 1.1;
    }
  }, [isAutoRotating]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent for seamless glassmorphic layering
    sceneRef.current = scene;

    // 2. Camera (Cinematic Wide-Angle Perspective for Rich 3D Parallax)
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(14.5, 12.0, 14.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x000000, 0); // Pure transparent alpha
    rendererRef.current = renderer;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 4. Orbit Controls (Silky Smooth Full 360 Turntable & Parallax Orbit)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.045;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 1.2;
    controls.minPolarAngle = Math.PI / 10; // Allow looking from above
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent beneath floor
    controls.minDistance = 4.5;
    controls.maxDistance = 32;
    controls.target.set(0, 2.0, 0);
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.35; // Continuous smooth, mesmerizing spin
    controlsRef.current = controls;

    // 5. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedb, 1.35);
    sunLight.position.set(14, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -14;
    sunLight.shadow.camera.right = 14;
    sunLight.shadow.camera.top = 14;
    sunLight.shadow.camera.bottom = -14;
    sunLight.shadow.bias = -0.0008;
    scene.add(sunLight);

    const windowRim = new THREE.DirectionalLight(0xc7d2fe, 0.45);
    windowRim.position.set(-14, 12, -14);
    scene.add(windowRim);

    const deskTaskLight = new THREE.PointLight(0xffedd5, 1.4, 7);
    deskTaskLight.position.set(-3.2, 3.8, 0.2);
    scene.add(deskTaskLight);

    const rgbBacklight = new THREE.PointLight(0x818cf8, 1.2, 6.0);
    rgbBacklight.position.set(-3.2, 2.4, -0.9);
    scene.add(rgbBacklight);

    // Bedside Cozy Mushroom Lamp Light
    const nightLamp = new THREE.PointLight(0xf59e0b, 0.4, 5.0);
    nightLamp.position.set(6.6, 2.2, -6.0);
    scene.add(nightLamp);

    lightsRef.current = {
      ambient: ambientLight,
      sun: sunLight,
      rim: windowRim,
      desk: deskTaskLight,
      rgb: rgbBacklight,
      nightLamp: nightLamp
    };

    // -------------------------------------------------------------
    // BUILD HIGH-END ARCHITECTURAL DIORAMA
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // BUILD EXACT 3D DIGITAL TWIN OF KANWAL'S ROOM PHOTOGRAPH
    // -------------------------------------------------------------
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Faithful Materials Palette
    const wallPlasterMat = new THREE.MeshStandardMaterial({ 
      color: 0xF7F3EB, // Soft warm cream/beige plaster matching photograph
      roughness: 0.92 
    });
    const pedestalRimMat = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF, 
      roughness: 0.2, 
      metalness: 0.1 
    });
    const floorTileMat = new THREE.MeshStandardMaterial({ 
      color: 0xEEE9DF, // Glossy light porcelain floor tile
      roughness: 0.22, 
      metalness: 0.08 
    });
    const deskBirchMat = new THREE.MeshStandardMaterial({ 
      color: 0xEAD8C3, // Natural white oak / light birch desktop
      roughness: 0.38 
    });
    const matteBlackMat = new THREE.MeshStandardMaterial({ 
      color: 0x1E2229, // Modern matte black steel
      roughness: 0.4, 
      metalness: 0.5 
    });
    const aluminumMat = new THREE.MeshStandardMaterial({ 
      color: 0xD1D5DB, 
      roughness: 0.2, 
      metalness: 0.85 
    });
    const doorTeakMat = new THREE.MeshStandardMaterial({ 
      color: 0x9A633D, // Warm teak wood door paneling
      roughness: 0.45 
    });
    const chairLilacMat = new THREE.MeshStandardMaterial({ 
      color: 0x8B5CF6, // Lilac purple chair upholstery
      roughness: 0.72 
    });
    const bedWhiteMat = new THREE.MeshStandardMaterial({ 
      color: 0xF8FAFC, // Clean white platform bed frame
      roughness: 0.35 
    });
    const bedLavenderMat = new THREE.MeshStandardMaterial({ 
      color: 0xB794F4, // Lavender purple duvet & fitted sheet
      roughness: 0.82 
    });
    const pillowMintMat = new THREE.MeshStandardMaterial({ 
      color: 0xA7F3D0, // Mint green / seafoam pillow
      roughness: 0.85 
    });
    const plushieWhiteMat = new THREE.MeshStandardMaterial({ 
      color: 0xFAFAFA, // Milky white seal plushie fleece
      roughness: 0.95 
    });
    const pothosGreenMat = new THREE.MeshStandardMaterial({ 
      color: 0x16A34A, // Lush trailing pothos green leaves
      roughness: 0.6 
    });
    const bottlePurpleMat = new THREE.MeshStandardMaterial({ 
      color: 0x7C3AED, // Metallic purple insulated water flask
      roughness: 0.35, 
      metalness: 0.45 
    });

    // 0. Radial Drop Shadow beneath Pedestal
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    const radGrad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    radGrad.addColorStop(0, 'rgba(30, 27, 75, 0.32)');
    radGrad.addColorStop(0.55, 'rgba(30, 27, 75, 0.12)');
    radGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    const groundShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(21.5, 21.5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -0.44;
    scene.add(groundShadow);

    // 1. Floating Diorama Base & Glossy Tiled Flooring
    const pedestalBase = new THREE.Mesh(
      new THREE.BoxGeometry(16.4, 0.45, 16.4),
      pedestalRimMat
    );
    pedestalBase.position.y = -0.22;
    pedestalBase.receiveShadow = true;
    roomGroup.add(pedestalBase);

    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(16.0, 0.06, 16.0),
      floorTileMat
    );
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Tile grid lines on floor (large porcelain tiles)
    const floorGrid = new THREE.GridHelper(15.8, 16, 0xD4C5B5, 0xE4D8CC);
    floorGrid.position.y = 0.031;
    roomGroup.add(floorGrid);

    // Warm Golden Sunlight Shaft Pool on Floor (matching real photo sunlight beam)
    const sunlightPoolMat = new THREE.MeshBasicMaterial({
      color: 0xFFF3D6,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const sunlightPool = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 4.4), sunlightPoolMat);
    sunlightPool.rotation.x = -Math.PI / 2;
    sunlightPool.rotation.z = -0.32;
    sunlightPool.position.set(1.6, 0.033, 0.4);
    roomGroup.add(sunlightPool);

    // Soft Circular Woven Area Rug under Study Desk & Chair (from photograph)
    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 0.03, 36),
      new THREE.MeshStandardMaterial({ color: 0xE8E2D5, roughness: 0.95 }) // Cream shaggy rug
    );
    rug.position.set(-2.8, 0.04, 0.4);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // -------------------------------------------------------------
    // LEFT WALL: WOODEN ENTRY DOOR & FULL-LENGTH MIRROR
    // -------------------------------------------------------------
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 8.2, 16.0),
      wallPlasterMat
    );
    leftWall.position.set(-7.85, 4.1, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // 1. Rich Teak Wood Bedroom Door with Hook
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-7.66, 3.3, 4.8);

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 6.6, 2.7),
      new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.6 })
    );
    doorGroup.add(doorFrame);

    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 6.4, 2.5),
      doorTeakMat
    );
    doorLeaf.castShadow = true;
    doorGroup.add(doorLeaf);

    // Molded inset panels
    [-1.5, 1.5].forEach((yOffset) => {
      const panelInset = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 2.4, 1.9),
        new THREE.MeshStandardMaterial({ color: 0x854D27, roughness: 0.5 })
      );
      panelInset.position.set(0.005, yOffset, 0);
      doorGroup.add(panelInset);
    });

    // Silver metallic lever handle & lock
    const handleRosette = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
      aluminumMat
    );
    handleRosette.rotation.z = Math.PI / 2;
    handleRosette.position.set(0.05, -0.4, -0.9);
    doorGroup.add(handleRosette);

    const doorLever = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.3), aluminumMat);
    doorLever.position.set(0.07, -0.4, -0.78);
    doorGroup.add(doorLever);

    // Coat hook on door
    const doorHook = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.06), aluminumMat);
    doorHook.position.set(0.045, 1.8, 0);
    doorGroup.add(doorHook);

    const doorPeg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), aluminumMat);
    doorPeg.rotation.z = Math.PI / 3;
    doorPeg.position.set(0.08, 1.84, 0);
    doorGroup.add(doorPeg);

    roomGroup.add(doorGroup);

    // Wall Switch beside Door
    const wallSwitch = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    wallSwitch.position.set(-7.66, 3.4, 2.8);
    roomGroup.add(wallSwitch);

    // 2. Full-Length Wall Mirror with Trailing Pothos (matching photo)
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(-7.66, 3.2, 1.4);

    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 4.6, 1.3), matteBlackMat);
    mirrorGroup.add(mirrorFrame);

    const mirrorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 4.48),
      new THREE.MeshStandardMaterial({ color: 0xEEF2FF, roughness: 0.06, metalness: 0.96 })
    );
    mirrorGlass.rotation.y = Math.PI / 2;
    mirrorGlass.position.x = 0.022;
    mirrorGroup.add(mirrorGlass);

    // Wooden wall bracket beside mirror with trailing pothos
    const mirrorBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.06, 0.42),
      deskBirchMat
    );
    mirrorBracket.position.set(0.03, 2.4, 0);
    mirrorGroup.add(mirrorBracket);

    const mirrorPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.09, 0.2, 12),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    mirrorPot.position.set(0.08, 2.52, 0);
    mirrorGroup.add(mirrorPot);

    // Trailing pothos vines cascading down mirror frame
    [2.25, 1.85, 1.45, 1.05].forEach((yLeaf, idx) => {
      const pothosLeaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.11 - (idx * 0.015), 8, 8),
        pothosGreenMat
      );
      pothosLeaf.position.set(0.1 + (Math.sin(idx * 2) * 0.03), yLeaf, 0.1 + idx * 0.04);
      mirrorGroup.add(pothosLeaf);
    });

    roomGroup.add(mirrorGroup);

    // -------------------------------------------------------------
    // BACK WALL: BIG 4-PANE WINDOW, FLOATING SHELF, & WORK DESK
    // -------------------------------------------------------------
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(16.0, 8.2, 0.35),
      wallPlasterMat
    );
    backWall.position.set(0, 4.1, -7.85);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // 1. Big 4-Pane Window with Scenic Outdoor Daylight View
    const windowGroup = new THREE.Group();
    windowGroup.position.set(2.4, 4.4, -7.7);

    const windowOuter = new THREE.Mesh(new THREE.BoxGeometry(6.6, 4.8, 0.22), matteBlackMat);
    windowGroup.add(windowOuter);

    const windowGlassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xBAE6FD, 
      opacity: 0.45, 
      transparent: true, 
      roughness: 0.1, 
      metalness: 0.1,
      transmission: 0.8
    });
    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 4.4), windowGlassMat);
    windowGlass.position.z = 0.04;
    windowGroup.add(windowGlass);

    // Cross mullions (dividing into 4 large panes)
    const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.4, 0.08), matteBlackMat);
    mullionV.position.z = 0.05;
    windowGroup.add(mullionV);

    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.08, 0.08), matteBlackMat);
    mullionH.position.z = 0.05;
    windowGroup.add(mullionH);

    // Outdoor daylight scenic plane behind window (sky & green foliage)
    const outdoorBackdropMat = new THREE.MeshBasicMaterial({ color: 0x93C5FD });
    const outdoorBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 4.4), outdoorBackdropMat);
    outdoorBackdrop.position.z = -0.05;
    windowGroup.add(outdoorBackdrop);

    // Roller Blind Cassette at Top of Window
    const blindCassette = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.28, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.4 })
    );
    blindCassette.position.y = 2.45;
    blindCassette.position.z = 0.08;
    windowGroup.add(blindCassette);

    // Hanging pull cord
    const pullCord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.9, 6),
      new THREE.MeshBasicMaterial({ color: 0xE2E8F0 })
    );
    pullCord.position.set(3.1, 1.8, 0.1);
    windowGroup.add(pullCord);

    // Deep window sill ledge with mini succulents
    const windowSill = new THREE.Mesh(new THREE.BoxGeometry(6.9, 0.12, 0.48), deskBirchMat);
    windowSill.position.set(0, -2.46, 0.14);
    windowGroup.add(windowSill);

    const sillPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.08, 0.15, 12),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC })
    );
    sillPot.position.set(2.6, -2.32, 0.14);
    windowGroup.add(sillPot);

    const sillPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 0), pothosGreenMat);
    sillPlant.position.set(2.6, -2.18, 0.14);
    windowGroup.add(sillPlant);

    roomGroup.add(windowGroup);

    // Volumetric sunbeam light cone entering from window
    const sunBeamMat = new THREE.MeshBasicMaterial({
      color: 0xFFF3D6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunBeam = new THREE.Mesh(new THREE.ConeGeometry(4.8, 9.5, 16, 1, true), sunBeamMat);
    sunBeam.rotation.x = Math.PI / 3.4;
    sunBeam.rotation.z = -Math.PI / 4.4;
    sunBeam.position.set(2.4, 4.4, -6.6);
    roomGroup.add(sunBeam);

    // 2. Floating Wall Shelf above Desk (with Books, Panda, & Trailing Pothos)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.2, 6.2, -7.55);

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 0.52), deskBirchMat);
    shelfGroup.add(shelf);

    // Small dark ceramic bowl on the left
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.08, 0.12, 12),
      matteBlackMat
    );
    bowl.position.set(-1.8, 0.1, 0);
    shelfGroup.add(bowl);

    // Upright colorful books
    const bookColors = [0xEF4444, 0x3B82F6, 0x10B981, 0xF59E0B, 0xEC4899, 0x8B5CF6];
    bookColors.forEach((bc, idx) => {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.85, 0.44),
        new THREE.MeshStandardMaterial({ color: bc, roughness: 0.5 })
      );
      book.position.set(-1.3 + idx * 0.32, 0.46, 0);
      shelfGroup.add(book);
    });

    // Cute Panda Figurine sitting on the shelf (from photograph)
    const pandaGroup = new THREE.Group();
    pandaGroup.position.set(0.75, 0.18, 0.02);

    const pandaMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8 });
    const pandaBlackMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.7 });

    const pandaBody = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), pandaMat);
    pandaGroup.add(pandaBody);

    const pandaHead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), pandaMat);
    pandaHead.position.set(0, 0.16, 0);
    pandaGroup.add(pandaHead);

    [-0.08, 0.08].forEach(pex => {
      const pEar = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), pandaBlackMat);
      pEar.position.set(pex, 0.25, 0);
      pandaGroup.add(pEar);

      const eyePatch = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), pandaBlackMat);
      eyePatch.position.set(pex, 0.18, 0.08);
      pandaGroup.add(eyePatch);
    });
    shelfGroup.add(pandaGroup);

    // Potted Pothos with long leafy vines cascading down the wall
    const shelfPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.15, 0.26, 12),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    shelfPot.position.set(1.6, 0.17, 0);
    shelfGroup.add(shelfPot);

    // Cascading vine leaf clusters reaching down toward desk
    [-0.1, -0.45, -0.85, -1.25, -1.65, -2.05].forEach((yDrop, i) => {
      const vineLeaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.15 - (i * 0.015), 8, 8),
        pothosGreenMat
      );
      vineLeaf.position.set(1.6 + (Math.sin(i * 1.5) * 0.06), yDrop, 0.12 + (i * 0.02));
      shelfGroup.add(vineLeaf);
    });

    shelf.userData = { id: "shelf_pothos", name: "Pothos & Bookshelf", risk: "normal" };
    roomGroup.add(shelfGroup);

    // 3. Pinned Postcards & Sticky Notes on Wall (between shelf and desk)
    const wallPins = [
      { x: -4.5, y: 4.8, c: 0x93C5FD }, // Polaroid sky
      { x: -3.8, y: 4.9, c: 0xFCA5A5 }, // Sunset postcard
      { x: -4.5, y: 4.1, c: 0xFEF08A }, // Yellow note
      { x: -3.8, y: 4.2, c: 0x86EFAC }, // Green postcard
      { x: -3.2, y: 4.5, c: 0xFDE047 }  // Memo note
    ];
    wallPins.forEach(p => {
      const pinPaper = new THREE.Mesh(
        new THREE.PlaneGeometry(0.44, 0.52),
        new THREE.MeshStandardMaterial({ color: p.c, roughness: 0.6 })
      );
      pinPaper.position.set(p.x, p.y, -7.66);
      roomGroup.add(pinPaper);

      const pinDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xEF4444 })
      );
      pinDot.position.set(p.x, p.y + 0.22, -7.64);
      roomGroup.add(pinDot);
    });

    // 4. White Wall Switchboard & 65W Laptop Charger Socket (above desk)
    const switchboardPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.28, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    switchboardPlate.position.set(-2.1, 2.5, -7.66);
    roomGroup.add(switchboardPlate);

    const chargerBrick = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.22, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
    );
    chargerBrick.position.set(-2.1, 2.5, -7.5);
    chargerBrick.castShadow = true;
    chargerBrick.userData = { id: "charger", name: "65W Laptop Charger", risk: "critical" };
    roomGroup.add(chargerBrick);

    // White power cord curving down towards desk
    const powerCordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.1, 2.45, -7.4),
      new THREE.Vector3(-2.4, 2.1, -4.5),
      new THREE.Vector3(-2.8, 2.05, -1.8),
      new THREE.Vector3(-3.2, 2.05, -1.1)
    ]);
    const powerCord = new THREE.Mesh(
      new THREE.TubeGeometry(powerCordCurve, 32, 0.02, 6, false),
      new THREE.MeshStandardMaterial({ color: 0xF1F5F9 })
    );
    roomGroup.add(powerCord);

    // -------------------------------------------------------------
    // STUDY DESK SETUP (EXACT BIRCH TABLE WITH BLACK LEGS)
    // -------------------------------------------------------------
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-3.2, 0, -1.2);

    // Light Birch Desktop Surface
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.16, 2.4),
      deskBirchMat
    );
    deskTop.position.y = 1.95;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Black Rectangular Loop Steel Frame Legs (matching photograph)
    [-2.25, 2.25].forEach((lx) => {
      // Top horizontal crossbar
      const legTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.2), matteBlackMat);
      legTop.position.set(lx, 1.84, 0);
      deskGroup.add(legTop);

      // Two vertical posts
      [-1.0, 1.0].forEach((lz) => {
        const legPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.84, 0.08), matteBlackMat);
        legPost.position.set(lx, 0.92, lz);
        legPost.castShadow = true;
        deskGroup.add(legPost);
      });

      // Bottom foot crossbar
      const legFoot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.2), matteBlackMat);
      legFoot.position.set(lx, 0.04, 0);
      deskGroup.add(legFoot);
    });

    // A. Open Silver MacBook Pro in Center of Desk
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 2.05, 0.1);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 0.9), aluminumMat);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    const keyboardBed = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.01, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x1E2229 })
    );
    keyboardBed.position.set(0, 0.022, -0.12);
    laptopGroup.add(keyboardBed);

    const trackpad = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.01, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8 })
    );
    trackpad.position.set(0, 0.022, 0.24);
    laptopGroup.add(trackpad);

    const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.88, 0.03), aluminumMat);
    laptopLid.position.set(0, 0.42, -0.42);
    laptopLid.rotation.x = -0.24; // Opened natural tilt
    laptopGroup.add(laptopLid);

    const laptopScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.22, 0.78),
      new THREE.MeshBasicMaterial({ color: 0x93C5FD })
    );
    laptopScreen.position.set(0, 0.42, -0.4);
    laptopScreen.rotation.x = -0.24;
    laptopGroup.add(laptopScreen);

    laptopBase.userData = { id: "laptop", name: "MacBook Pro", risk: "normal" };
    laptopGroup.add(laptopBase);
    deskGroup.add(laptopGroup);

    // B. Warm Gooseneck Task Lamp (Cream & Brass on left of desk)
    const taskLampGroup = new THREE.Group();
    taskLampGroup.position.set(-1.7, 2.05, -0.5);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16), deskBirchMat);
    taskLampGroup.add(lampBase);

    const lampStem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8), matteBlackMat);
    lampStem1.position.set(0, 0.32, 0.05);
    lampStem1.rotation.x = 0.22;
    taskLampGroup.add(lampStem1);

    const lampStem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8), matteBlackMat);
    lampStem2.position.set(0, 0.8, 0.25);
    lampStem2.rotation.x = -0.55;
    taskLampGroup.add(lampStem2);

    const lampHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.22, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.3 })
    );
    lampHead.position.set(0, 1.02, 0.44);
    lampHead.rotation.x = Math.PI / 1.4;
    taskLampGroup.add(lampHead);

    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xFFEDD5 })
    );
    lampBulb.position.set(0, 0.98, 0.48);
    taskLampGroup.add(lampBulb);
    deskGroup.add(taskLampGroup);

    // C. Two Stationery Pencil Holders (with pens, pencils, stylus)
    const penCup1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.09, 0.26, 16),
      matteBlackMat
    );
    penCup1.position.set(-1.8, 2.18, 0.3);
    deskGroup.add(penCup1);

    [0xEF4444, 0x3B82F6, 0x10B981, 0xF59E0B, 0x8B5CF6].forEach((pc, idx) => {
      const pen = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6),
        new THREE.MeshStandardMaterial({ color: pc })
      );
      pen.position.set(-1.8 + Math.sin(idx) * 0.04, 2.36, 0.3 + Math.cos(idx) * 0.04);
      pen.rotation.z = (idx - 2) * 0.14;
      deskGroup.add(pen);
    });

    // D. Desk Succulent Plant beside Laptop
    const deskPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.09, 0.14, 12),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    deskPot.position.set(-0.9, 2.12, -0.4);
    deskGroup.add(deskPot);

    const deskPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 0), pothosGreenMat);
    deskPlant.position.set(-0.9, 2.22, -0.4);
    deskGroup.add(deskPlant);

    // E. Purple Insulated Water Flask (Hydroflask on right desk side)
    const hydroFlask = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.76, 20),
      bottlePurpleMat
    );
    hydroFlask.position.set(1.4, 2.45, -0.4);
    hydroFlask.castShadow = true;

    const flaskCap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16), matteBlackMat);
    flaskCap.position.set(1.4, 2.88, -0.4);
    deskGroup.add(flaskCap);

    hydroFlask.userData = { id: "water_bottle", name: "Purple Insulated Flask", risk: "normal" };
    deskGroup.add(hydroFlask);

    // F. Stack of College Notebooks & Yellow Sticky Notes
    const nb1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.07, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.7 })
    );
    nb1.position.set(1.6, 2.06, 0.4);
    deskGroup.add(nb1);

    const nb2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.06, 1.05),
      new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.7 })
    );
    nb2.position.set(1.62, 2.12, 0.42);
    nb2.rotation.y = 0.06;
    deskGroup.add(nb2);

    const stickyNote = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.02, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xFEF08A })
    );
    stickyNote.position.set(1.65, 2.16, 0.45);
    deskGroup.add(stickyNote);

    roomGroup.add(deskGroup);

    // Under Desk: Small Grey Wastebasket
    const binMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.2, 0.75, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.6 })
    );
    binMesh.position.set(-5.1, 0.38, -1.2);
    binMesh.castShadow = true;
    roomGroup.add(binMesh);

    // -------------------------------------------------------------
    // PURPLE ERGONOMIC SWIVEL OFFICE CHAIR (EXACT MATCH TO PHOTO)
    // -------------------------------------------------------------
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-3.2, 0, 0.4);

    // 5-Star Caster Wheel Base
    const starBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.68, 0.06, 5),
      matteBlackMat
    );
    starBase.position.y = 0.08;
    chairGroup.add(starBase);

    // Pneumatic center piston column
    const pistonStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.9, 12), matteBlackMat);
    pistonStem.position.y = 0.52;
    chairGroup.add(pistonStem);

    // Lilac Purple Contoured Seat Cushion
    const seatCushion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.82, 0.14, 24),
      chairLilacMat
    );
    seatCushion.position.y = 1.02;
    seatCushion.castShadow = true;
    chairGroup.add(seatCushion);

    // Black Ergonomic Backrest Connector Arm
    const backStem = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.08), matteBlackMat);
    backStem.position.set(0, 1.45, 0.62);
    backStem.rotation.x = -0.15;
    chairGroup.add(backStem);

    // Lilac Purple Curved Ergonomic Backrest
    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.25, 0.1),
      chairLilacMat
    );
    chairBack.position.set(0, 1.82, 0.68);
    chairBack.rotation.x = -0.12;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    seatCushion.userData = { id: "chair", name: "Purple Ergonomic Chair", risk: "normal" };
    roomGroup.add(chairGroup);

    // -------------------------------------------------------------
    // BLACK TRAVEL BACKPACK ON FLOOR (NEXT TO DESK & CHAIR)
    // -------------------------------------------------------------
    const bpShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 20),
      new THREE.MeshBasicMaterial({ color: 0x1E1B4B, transparent: true, opacity: 0.22, depthWrite: false })
    );
    bpShadow.rotation.x = -Math.PI / 2;
    bpShadow.position.set(-5.3, 0.04, 0.2);
    roomGroup.add(bpShadow);

    const backpackGroup = new THREE.Group();
    backpackGroup.position.set(-5.3, 0.0, 0.2);
    backpackGroup.rotation.y = 0.35;

    const bpCanvasMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 });
    const bpBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.2, 0.58), bpCanvasMat);
    bpBody.position.y = 0.68;
    bpBody.castShadow = true;
    backpackGroup.add(bpBody);

    const bpPocket = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.2), bpCanvasMat);
    bpPocket.position.set(0, 0.58, 0.36);
    backpackGroup.add(bpPocket);

    const bpHan = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.025, 8, 16, Math.PI),
      matteBlackMat
    );
    bpHan.rotation.x = Math.PI / 2;
    bpHan.position.set(0, 1.34, 0);
    backpackGroup.add(bpHan);

    bpBody.userData = { id: "backpack", name: "Travel Backpack", risk: "normal" };
    roomGroup.add(backpackGroup);

    // -------------------------------------------------------------
    // SINGLE BED WITH LAVENDER DUVET, MINT PILLOW & SEAL PLUSHIE
    // -------------------------------------------------------------
    const bedGroup = new THREE.Group();
    bedGroup.position.set(4.8, 0, -2.2);

    // Clean White Platform Bed Frame (matching photograph)
    const bedBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.5, 6.4),
      bedWhiteMat
    );
    bedBase.position.y = 0.25;
    bedBase.castShadow = true;
    bedGroup.add(bedBase);

    // Mattress with Fitted Lavender Purple Sheet
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(3.92, 0.45, 6.1),
      bedLavenderMat
    );
    mattress.position.y = 0.68;
    bedGroup.add(mattress);

    // Folded Lavender Quilt/Duvet (with textile depth & folds)
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(3.96, 0.28, 4.2),
      bedLavenderMat
    );
    duvet.position.set(0, 0.9, 0.85);
    duvet.castShadow = true;
    bedGroup.add(duvet);

    // Light Mint Green / Seafoam Pillow (exact match to photograph)
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.28, 1.15),
      pillowMintMat
    );
    pillow.position.set(0, 1.02, -2.15);
    pillow.castShadow = true;
    bedGroup.add(pillow);

    // Adorable White Seal Plushie Doll on Bed (exact match to photograph)
    const plushieGroup = new THREE.Group();
    plushieGroup.position.set(-0.55, 1.14, -1.4);

    const plushieBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 16),
      plushieWhiteMat
    );
    plushieBody.scale.set(1.15, 0.88, 1.25);
    plushieBody.castShadow = true;
    plushieGroup.add(plushieBody);

    [-0.11, 0.11].forEach(ex => {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x0F172A })
      );
      eye.position.set(ex, 0.12, 0.3);
      plushieGroup.add(eye);
    });

    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xF472B6 })
    );
    nose.position.set(0, 0.05, 0.34);
    plushieGroup.add(nose);

    [-0.32, 0.32].forEach(fx => {
      const flipper = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), plushieWhiteMat);
      flipper.scale.set(1.3, 0.4, 0.9);
      flipper.position.set(fx, -0.06, 0.04);
      plushieGroup.add(flipper);
    });

    plushieBody.userData = { id: "plushie", name: "Cozy Seal Plushie", risk: "normal" };
    bedGroup.add(plushieGroup);

    // Bedside Nightstand Table under Window
    const nightstand = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.85, 1.1),
      bedWhiteMat
    );
    nightstand.position.set(-2.2, 0.42, -2.4);
    bedGroup.add(nightstand);

    // Glowing Warm Yellow Mushroom Dome Lamp
    const nightLampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.25, 12),
      matteBlackMat
    );
    nightLampStem.position.set(-2.2, 0.96, -2.4);
    bedGroup.add(nightLampStem);

    const nightLampShade = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ 
        color: 0xFBBF24, 
        emissive: 0xF59E0B, 
        emissiveIntensity: 0.65, 
        roughness: 0.2 
      })
    );
    nightLampShade.position.set(-2.2, 1.12, -2.4);
    bedGroup.add(nightLampShade);

    // Mini succulent on nightstand
    const nsPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.06, 0.12, 12),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    nsPot.position.set(-2.2, 0.92, -2.05);
    bedGroup.add(nsPot);

    const nsPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.07, 0), pothosGreenMat);
    nsPlant.position.set(-2.2, 1.02, -2.05);
    bedGroup.add(nsPlant);

    duvet.userData = { id: "bed", name: "Lavender Daybed", risk: "normal" };
    roomGroup.add(bedGroup);

    // Photo Gallery Wall: 8-Photo Collage on Wall above Bed (from photograph)
    const bedPhotos = [
      { x: 3.2, y: 6.4, c: 0x38BDF8 }, { x: 4.1, y: 6.4, c: 0xFB7185 }, { x: 5.0, y: 6.4, c: 0xA78BFA }, { x: 5.9, y: 6.4, c: 0xFBBF24 },
      { x: 3.2, y: 5.4, c: 0x34D399 }, { x: 4.1, y: 5.4, c: 0xF472B6 }, { x: 5.0, y: 5.4, c: 0x60A5FA }, { x: 5.9, y: 5.4, c: 0xCBD5E1 }
    ];
    bedPhotos.forEach((bg) => {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.8, 0.015),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8 })
      );
      card.position.set(bg.x, bg.y, -7.66);
      roomGroup.add(card);

      const inner = new THREE.Mesh(
        new THREE.PlaneGeometry(0.55, 0.65),
        new THREE.MeshStandardMaterial({ color: bg.c, roughness: 0.5 })
      );
      inner.position.set(bg.x, bg.y + 0.03, -7.65);
      roomGroup.add(inner);
    });

    // -------------------------------------------------------------
    // REGISTER INTERACTIVE OBJECTS & FLOATING GEMSTONE PINS
    // -------------------------------------------------------------
    const interactiveMeshes = [
      laptopBase,
      chargerBrick,
      hydroFlask,
      bpBody,
      seatCushion,
      plushieBody,
      duvet,
      shelf
    ];
    interactiveObjectsRef.current = interactiveMeshes;

    // Beacon Rings
    const beaconRings = [];
    roomItems.forEach(item => {
      const ringGeo = new THREE.RingGeometry(0.2, 0.36, 24);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: item.color, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.65 
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(item.pos[0], item.pos[1] - 0.2, item.pos[2]);
      ringMesh.rotation.x = Math.PI / 2;
      roomGroup.add(ringMesh);
      beaconRings.push(ringMesh);
    });
    beaconRingsRef.current = beaconRings;

    // 3D Floating Holographic Gemstone Pins above key belongings
    const floatingPins = [];
    const pinGeo = new THREE.OctahedronGeometry(0.12, 0);
    roomItems.forEach(item => {
      const pinMat = new THREE.MeshStandardMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.85
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(item.pos[0], item.pos[1] + 0.45, item.pos[2]);
      roomGroup.add(pinMesh);
      floatingPins.push({ mesh: pinMesh, baseY: item.pos[1] + 0.45 });
    });

    // -------------------------------------------------------------
    // FLOATING SUNLIGHT DUST PARTICLES (MAGICAL ATMOSPHERE)
    // -------------------------------------------------------------
    const particleCount = 110;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14.0;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 6.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14.0;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFFBEB,
      size: 0.075,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    materialsRef.current = {
      windowGlass: windowGlassMat,
      sunBeam: sunBeamMat
    };

    // -------------------------------------------------------------
    // RAYCASTING & INTERACTION HANDLERS
    // -------------------------------------------------------------
    let hoveredMesh = null;

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        const topMesh = intersects[0].object;
        renderer.domElement.style.cursor = "pointer";
        if (hoveredMesh !== topMesh) {
          hoveredMesh = topMesh;
          const matchItem = roomItems.find(i => i.id === topMesh.userData.id);
          if (matchItem) {
            onHoverItem?.(matchItem.id);
          }
        }
      } else {
        renderer.domElement.style.cursor = "default";
        if (hoveredMesh) {
          hoveredMesh = null;
          onHoverItem?.(null);
        }
      }
    };

    const onClick = (e) => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const item = roomItems.find(i => i.id === clickedMesh.userData.id);
        if (item) {
          setSelectedObj(item);
          onSelectItem?.(item);

          // Animate camera focus towards clicked object
          controls.target.set(item.pos[0], item.pos[1], item.pos[2]);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // -------------------------------------------------------------
    // ANIMATION & 2D SCREEN PROJECTION LOOP
    // -------------------------------------------------------------
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle breath animation on charger & high-risk items
      if (chargerBrick) {
        chargerBrick.position.y = 2.3 + Math.sin(elapsed * 3) * 0.025;
      }

      // Pulsing radar rings
      beaconRingsRef.current.forEach((r, idx) => {
        const s = 1 + Math.sin(elapsed * 3 + idx) * 0.18;
        r.scale.set(s, s, s);
      });

      // Animate floating dust motes upwards gently
      const posArray = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += 0.003;
        if (posArray[i * 3 + 1] > 5.0) posArray[i * 3 + 1] = 0.6;
        posArray[i * 3] += Math.sin(elapsed * 0.5 + i) * 0.001;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animate floating 3D gemstone pins (spin & bob in space)
      floatingPins.forEach((p, idx) => {
        p.mesh.rotation.y = elapsed * 2.2 + idx;
        p.mesh.rotation.z = Math.sin(elapsed * 2 + idx) * 0.2;
        p.mesh.position.y = p.baseY + Math.sin(elapsed * 3.2 + idx) * 0.05;
      });

      if (viewModeRef.current === "3d") {
        controls.update();
        renderer.render(scene, camera);

        // Project 3D item positions to 2D screen coordinates for floating tags
        if (showLabelsRef.current && camera && mountRef.current) {
          const projected = roomItems.map(item => {
            const v = new THREE.Vector3(...item.pos);
            v.project(camera);
            const x = (v.x * 0.5 + 0.5) * width;
            const y = (-(v.y * 0.5) + 0.5) * height;
            const isVisible = v.z < 1; // within frustum
            return { ...item, screenX: x, screenY: y, isVisible };
          });
          setScreenLabels(projected);
        }
      }
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('click', onClick);
      }
      renderer.dispose();
    };
  }, []);

  // Camera preset switches
  const setCameraAngle = (mode) => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (mode === "iso") {
      cameraRef.current.position.set(13.5, 11.5, 13.5);
      controlsRef.current.target.set(0, 2.0, 0);
    } else if (mode === "front") {
      // Direct front angle matching user's room photograph!
      cameraRef.current.position.set(0.0, 6.2, 13.8);
      controlsRef.current.target.set(0.0, 3.2, -1.8);
    } else if (mode === "desk") {
      cameraRef.current.position.set(-3.2, 4.2, 2.8);
      controlsRef.current.target.set(-3.2, 2.1, -1.2);
    } else if (mode === "bed") {
      cameraRef.current.position.set(4.8, 4.4, 2.4);
      controlsRef.current.target.set(4.8, 1.4, -2.2);
    } else if (mode === "door") {
      cameraRef.current.position.set(-1.8, 5.0, 9.2);
      controlsRef.current.target.set(-6.5, 3.2, 2.8);
    } else if (mode === "top") {
      cameraRef.current.position.set(0, 22.0, 0.1);
      controlsRef.current.target.set(0, 1.0, 0);
    }
  };

  return (
    <div className="faded-glass rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#ede9fe]/90 text-[#7054E8] flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-[#1e1b4b]">
                {roomTitle}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-black flex items-center gap-1 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {reconstructionStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Interactive 3D reconstruction mapped from room photograph. Orbit, zoom, and click objects to inspect.
            </p>
          </div>
        </div>

        {/* Action Buttons: Scan & Reconstruct + View Switch */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode(viewMode === "3d" ? "photo" : "3d")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/70 hover:bg-white text-slate-700 text-xs font-bold border border-white/80 shadow-xs transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>{viewMode === "3d" ? "View Photo" : "View 3D Twin"}</span>
          </button>

          {onReconstructRoom && (
            <button
              onClick={onReconstructRoom}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Scan New Room</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full h-[500px] sm:h-[580px] md:h-[640px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/75 via-slate-50/40 to-indigo-50/25 backdrop-blur-md border border-white/80 shadow-inner select-none">
        
        {/* Three.js Canvas Container (Always stays mounted to prevent context loss / canvas split glitches) */}
        <div ref={mountRef} className={`w-full h-full cursor-grab active:cursor-grabbing ${viewMode === "3d" ? "block" : "hidden"}`} />

        {/* 3D Mode Interactive Overlays */}
        {viewMode === "3d" && (
          <>
            {/* Floating 3D Object Screen Badges */}
            {showLabels && screenLabels.map((lbl) => {
              if (!lbl.isVisible) return null;
              const isSelected = selectedObj?.id === lbl.id || highlightedItemId === lbl.id;
              const isCritical = lbl.risk === "critical";

              return (
                <div
                  key={lbl.id}
                  style={{
                    left: `${lbl.screenX}px`,
                    top: `${lbl.screenY}px`,
                  }}
                  onClick={() => {
                    setSelectedObj(lbl);
                    onSelectItem?.(lbl);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer pointer-events-auto transition-transform ${
                    isSelected ? 'scale-115' : 'hover:scale-110'
                  }`}
                >
                  <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-black shadow-md backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap ${
                    isCritical
                      ? 'bg-rose-50/95 text-rose-700 border-rose-300 ring-2 ring-rose-400/40'
                      : isSelected
                      ? 'bg-purple-50/95 text-[#7054E8] border-purple-400 ring-2 ring-purple-400/40'
                      : 'bg-white/90 text-slate-700 border-slate-200'
                  }`}>
                    {isCritical && <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />}
                    <span>{lbl.name}</span>
                  </div>
                </div>
              );
            })}

            {/* Top Right Floating Toolbar: Mood Presets & Auto-Orbit */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              
              {/* Lighting Mood Pill Selector */}
              <div className="flex items-center gap-1 bg-white/85 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-xs">
                <button
                  onClick={() => setLightingMood("golden")}
                  title="Golden Daylight"
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    lightingMood === "golden"
                      ? 'bg-amber-100 text-amber-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span className="hidden sm:inline">Day</span>
                </button>

                <button
                  onClick={() => setLightingMood("sunset")}
                  title="Sunset Golden Hour"
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    lightingMood === "sunset"
                      ? 'bg-rose-100 text-rose-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sunset className="w-3 h-3 text-rose-500" />
                  <span className="hidden sm:inline">Sunset</span>
                </button>

                <button
                  onClick={() => setLightingMood("night")}
                  title="Lo-Fi Cozy Midnight"
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    lightingMood === "night"
                      ? 'bg-indigo-900 text-indigo-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span className="hidden sm:inline">Night</span>
                </button>
              </div>

              {/* Auto Orbit 360 Turntable Toggle */}
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title="Continuous 360 Turntable Rotation"
                className={`px-3 py-1.5 rounded-2xl border text-xs font-black backdrop-blur-md flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  isAutoRotating
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-indigo-600/30 scale-102'
                    : 'bg-white/85 text-slate-700 border-white/80 hover:bg-white'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAutoRotating ? 'text-amber-300 animate-spin' : 'text-[#7054E8]'}`} />
                <span>{isAutoRotating ? '360° Rotating ✦' : 'Start 360° Spin'}</span>
              </button>

            </div>

            {/* 3D Camera Controls Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-sm flex-wrap max-w-[90%] sm:max-w-none">
              <button
                onClick={() => setCameraAngle("front")}
                className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-[#ede9fe] text-[#7054E8] text-[10px] font-black transition-colors cursor-pointer border border-purple-200"
              >
                📸 Photo Angle
              </button>
              <button
                onClick={() => setCameraAngle("iso")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                ✦ Isometric
              </button>
              <button
                onClick={() => setCameraAngle("desk")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                💻 Desk View
              </button>
              <button
                onClick={() => setCameraAngle("bed")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                🛏️ Lavender Bed
              </button>
              <button
                onClick={() => setCameraAngle("door")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                🚪 Door & Mirror
              </button>
              <button
                onClick={() => setCameraAngle("top")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                📐 Top View
              </button>
            </div>

            {/* Toggle Labels Overlay (Bottom Right) */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold backdrop-blur-md transition-all shadow-xs cursor-pointer ${
                  showLabels
                    ? 'bg-white/95 text-[#7054E8] border-purple-200'
                    : 'bg-slate-900/80 text-white border-transparent'
                }`}
              >
                {showLabels ? "Hide 3D Labels" : "Show 3D Labels"}
              </button>
            </div>
          </>
        )}

        {/* 2D Original Photo View (Clean, Light Faded Glass, Centered & Non-destructive) */}
        {viewMode === "photo" && (
          <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 bg-gradient-to-br from-[#f8f9fc] via-[#f1f0fb] to-[#ede9fe]/40 backdrop-blur-md overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between gap-2 z-20 shrink-0">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-[#1e1b4b]">Original Room Photograph (Reference)</span>
                <span className="hidden sm:inline text-[10px] text-slate-500 font-bold">· Block C-402</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPhotoLabels(!showPhotoLabels)}
                  className={`px-3 py-1.5 rounded-2xl border text-xs font-bold backdrop-blur-md transition-all shadow-xs cursor-pointer ${
                    showPhotoLabels
                      ? 'bg-purple-50 text-[#7054E8] border-purple-200 shadow-purple-500/10'
                      : 'bg-white/85 text-slate-600 border-white/80 hover:bg-white'
                  }`}
                >
                  {showPhotoLabels ? "👁️ Hide Vision Tags" : "✦ Show Vision Tags"}
                </button>

                <button
                  onClick={() => setViewMode("3d")}
                  className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Switch to 3D Twin</span>
                </button>
              </div>
            </div>

            {/* Center Image Container with Responsive Fit & Hotspot Markers */}
            <div className="relative flex-1 w-full max-h-[calc(100%-80px)] my-2 flex items-center justify-center min-h-0">
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                <img
                  src={photoUrl || "/assets/kanwal-room-original.jpg"}
                  onError={(e) => {
                    e.currentTarget.src = "/assets/kanwal-room-original.jpg";
                  }}
                  alt="Original Room Source Photograph"
                  className="max-h-[380px] sm:max-h-[460px] md:max-h-[500px] w-auto max-w-full object-contain rounded-2xl shadow-xl border-2 border-white ring-1 ring-slate-900/10"
                />

                {/* Vision Tags Overlaid on the Real Photo */}
                {showPhotoLabels && (
                  <>
                    {/* 1. Study Desk & Laptop */}
                    <div 
                      style={{ top: '44%', left: '33%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                      onClick={() => {
                        setViewMode("3d");
                        setCameraAngle("desk");
                        setSelectedObj(roomItems.find(i => i.id === "laptop"));
                      }}
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-purple-300 text-[10px] font-black text-purple-700 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                        💻 Laptop (Desk)
                      </div>
                    </div>

                    {/* 2. Purple Ergonomic Chair */}
                    <div 
                      style={{ top: '56%', left: '36%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                      onClick={() => {
                        setViewMode("3d");
                        setCameraAngle("desk");
                      }}
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-indigo-300 text-[10px] font-black text-indigo-700 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        🪑 Purple Chair
                      </div>
                    </div>

                    {/* 3. Black Backpack on Floor */}
                    <div 
                      style={{ top: '65%', left: '22%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                      onClick={() => {
                        setViewMode("3d");
                        setSelectedObj(roomItems.find(i => i.id === "backpack"));
                      }}
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-slate-400 text-[10px] font-black text-slate-800 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform ring-2 ring-purple-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        🎒 Backpack (Floor)
                      </div>
                    </div>

                    {/* 4. Wall Charger Alert */}
                    <div 
                      style={{ top: '35%', left: '40%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                      onClick={() => {
                        setViewMode("3d");
                        setCameraAngle("desk");
                        setSelectedObj(roomItems.find(i => i.id === "charger"));
                      }}
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-rose-50/95 backdrop-blur-md border border-rose-300 text-[10px] font-black text-rose-700 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform ring-2 ring-rose-400/40">
                        <AlertTriangle className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                        ⚡ 65W Charger
                      </div>
                    </div>

                    {/* 5. Wall Shelf & Pothos */}
                    <div 
                      style={{ top: '16%', left: '35%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-emerald-300 text-[10px] font-black text-emerald-700 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
                        🌿 Shelf & Pothos
                      </div>
                    </div>

                    {/* 6. Single Bed & Lavender Duvet */}
                    <div 
                      style={{ top: '56%', left: '80%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                      onClick={() => {
                        setViewMode("3d");
                        setCameraAngle("bed");
                      }}
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-purple-300 text-[10px] font-black text-purple-700 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
                        🛏️ Lavender Bed
                      </div>
                    </div>

                    {/* 7. Sunny Window */}
                    <div 
                      style={{ top: '22%', left: '63%' }} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                    >
                      <div className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-sky-300 text-[10px] font-black text-sky-700 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
                        ☀️ Sunny Window
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Verified Belongings Strip */}
            <div className="w-full flex items-center justify-center gap-1.5 flex-wrap z-20 pt-1 shrink-0">
              <span className="text-[10px] font-extrabold text-slate-500 mr-1">Detected in Room:</span>
              {[
                { name: "MacBook", icon: "💻", id: "laptop", view: "desk" },
                { name: "65W Charger", icon: "⚡", id: "charger", view: "desk", critical: true },
                { name: "Backpack", icon: "🎒", id: "backpack", view: "iso" },
                { name: "Plushie", icon: "🧸", id: "plushie", view: "bed" },
                { name: "Guitar", icon: "🎸", id: "guitar", view: "bed" },
                { name: "Purple Chair", icon: "🪑", id: null, view: "desk" },
                { name: "Lavender Bed", icon: "🛏️", id: null, view: "bed" },
                { name: "Door & Mirror", icon: "🚪", id: null, view: "door" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setViewMode("3d");
                    if (item.view) setCameraAngle(item.view);
                    if (item.id) {
                      const obj = roomItems.find(i => i.id === item.id);
                      if (obj) {
                        setSelectedObj(obj);
                        onSelectItem?.(obj);
                      }
                    }
                  }}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer shadow-2xs hover:scale-105 ${
                    item.critical
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-white/90 text-slate-700 border-white/80 hover:bg-white hover:text-[#7054E8]'
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Selected Object Detail Panel (If user taps an item) */}
      {selectedObj && (
        <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className={`p-2 rounded-xl border ${
              selectedObj.risk === "critical"
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-purple-50 text-[#7054E8] border-purple-200'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#1e1b4b]">
                  {selectedObj.name}
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[9px] font-black ${
                  selectedObj.risk === "critical"
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-purple-100 text-[#7054E8]'
                }`}>
                  {selectedObj.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {selectedObj.note}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setSelectedObj(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onSelectItem?.(selectedObj);
                setSelectedObj(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-[11px] font-black shadow-xs cursor-pointer"
            >
              Verify in Manifest
            </button>
          </div>
        </div>
      )}

      {/* 8 Mapped Belongings Quick Focus Strip */}
      <div className="pt-2.5 border-t border-white/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <span>Mapped Room Belongings</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#7054E8] text-[10px] font-extrabold">
              8 items
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Click any item to focus camera in 3D
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {roomItems.map((item) => {
            const isCritical = item.risk === "critical";
            const isSelected = selectedObj?.id === item.id || highlightedItemId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedObj(item);
                  onSelectItem?.(item);
                  if (controlsRef.current) {
                    controlsRef.current.target.set(item.pos[0], item.pos[1], item.pos[2]);
                  }
                }}
                onMouseEnter={() => onHoverItem?.(item.id)}
                onMouseLeave={() => onHoverItem?.(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isCritical
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : isSelected
                    ? 'bg-purple-100 text-[#7054E8] border-purple-300 shadow-xs ring-2 ring-purple-300/40'
                    : 'bg-white/70 text-slate-700 border-white/80 hover:bg-white'
                }`}
              >
                {isCritical ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                )}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
        <span>💡 Left-click and drag to orbit room • Scroll to zoom • Click belongings to inspect</span>
        <span className="font-mono text-[10px]">WebGL 3D Studio Active</span>
      </div>

    </div>
  );
}
