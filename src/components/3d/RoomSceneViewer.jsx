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
  photoUrl = "/assets/hostel-desk-demo.jpg",
  roomTitle = "Kanwal's Reconstructed Hostel Room (Block C-402)",
  reconstructionStatus = "3D Twin Ready"
}) {
  const mountRef = useRef(null);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "photo"
  const [showLabels, setShowLabels] = useState(true);
  const [selectedObj, setSelectedObj] = useState(null);
  const [screenLabels, setScreenLabels] = useState([]);
  const [lightingMood, setLightingMood] = useState("golden"); // "golden" | "sunset" | "night"
  const [isAutoRotating, setIsAutoRotating] = useState(true);

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

  // Definition of interactive belongings in the room
  const roomItems = [
    {
      id: "charger",
      name: "65W Laptop Charger",
      status: "High-Risk Memory Alert",
      risk: "critical",
      note: "Plugged into wall socket behind study desk! Kanwal forgot this 3x.",
      pos: [-7.4, 2.3, -1.2],
      color: 0xef4444, // coral red
      category: "Tech & Power"
    },
    {
      id: "laptop",
      name: "MacBook Pro",
      status: "Verified in Room",
      risk: "normal",
      note: "Open on center of maple study desk.",
      pos: [-3.2, 2.2, 0.4],
      color: 0x8b5cf6, // purple
      category: "Tech"
    },
    {
      id: "hdmi",
      name: "USB-C to HDMI Adapter",
      status: "High-Risk (Presentation)",
      risk: "critical",
      note: "Resting beside laptop ports on study table.",
      pos: [-2.3, 2.05, 0.5],
      color: 0xf59e0b, // amber
      category: "AV & Adapters"
    },
    {
      id: "id_card",
      name: "Hostel Pass & College ID",
      status: "High-Risk (Late Return)",
      risk: "high",
      note: "Lying near front edge of desk with lanyard.",
      pos: [-3.6, 2.05, 1.2],
      color: 0x10b981, // mint
      category: "Documents"
    },
    {
      id: "powerbank",
      name: "20,000mAh Power Bank",
      status: "Verified in Room",
      risk: "normal",
      note: "Left side of desk surface.",
      pos: [-4.4, 2.05, 0.7],
      color: 0x3b82f6, // blue
      category: "Power"
    },
    {
      id: "earbuds",
      name: "Wireless Earbuds Case",
      status: "Verified in Room",
      risk: "normal",
      note: "Front center desk.",
      pos: [-2.9, 2.05, 1.1],
      color: 0x06b6d4, // cyan
      category: "Audio"
    },
    {
      id: "water_bottle",
      name: "Insulated Water Flask",
      status: "Verified in Room",
      risk: "normal",
      note: "Right desk corner near window.",
      pos: [-1.2, 2.42, -0.2],
      color: 0x0284c7,
      category: "Daily"
    },
    {
      id: "backpack",
      name: "Travel Backpack",
      status: "Exit Luggage",
      risk: "normal",
      note: "Sitting on floor beside chair.",
      pos: [-4.2, 0.9, 2.4],
      color: 0x7c3aed,
      category: "Luggage"
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
    if (!mountRef.current || viewMode !== "3d") return;

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
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // High-End Materials
    const floorWoodMat = new THREE.MeshStandardMaterial({ 
      color: 0xE8DCCF, 
      roughness: 0.38, 
      metalness: 0.05 
    });
    const pedestalRimMat = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF, 
      roughness: 0.2, 
      metalness: 0.1 
    });
    const wallLeftMat = new THREE.MeshStandardMaterial({ 
      color: 0xF4EFEA, 
      roughness: 0.9 
    });
    const wallRightMat = new THREE.MeshStandardMaterial({ 
      color: 0xF6F2EE, 
      roughness: 0.9 
    });
    const woodSlatMat = new THREE.MeshStandardMaterial({ 
      color: 0xC59E75, 
      roughness: 0.5 
    });
    const deskTopMat = new THREE.MeshStandardMaterial({ 
      color: 0xECD6BE, 
      roughness: 0.35, 
      metalness: 0.02 
    });
    const matteBlackMat = new THREE.MeshStandardMaterial({ 
      color: 0x1E2229, 
      roughness: 0.4, 
      metalness: 0.6 
    });
    const aluminumMat = new THREE.MeshStandardMaterial({ 
      color: 0xD1D5DB, 
      roughness: 0.2, 
      metalness: 0.85 
    });

    // 0. Soft Radial Contact Drop Shadow under Pedestal
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

    // 1. Beveled Floating Diorama Pedestal Base
    const pedestalBase = new THREE.Mesh(
      new THREE.BoxGeometry(16.4, 0.45, 16.4),
      pedestalRimMat
    );
    pedestalBase.position.y = -0.22;
    pedestalBase.receiveShadow = true;
    roomGroup.add(pedestalBase);

    // Luxury Scandinavian Parquet Flooring
    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(16.0, 0.06, 16.0),
      floorWoodMat
    );
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Parquet tile grid lines on floor
    const parquetGrid = new THREE.GridHelper(15.8, 20, 0xD4C5B5, 0xE4D8CC);
    parquetGrid.position.y = 0.03;
    roomGroup.add(parquetGrid);

    // Soft circular woven area rug under study desk & chair
    const rugGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.02, 32);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.9 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(-3.2, 0.04, 1.4);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // 2. Left Wall with Acoustic Wood Slats
    const leftWallGeo = new THREE.BoxGeometry(0.35, 8.2, 16.0);
    const leftWall = new THREE.Mesh(leftWallGeo, wallLeftMat);
    leftWall.position.set(-7.85, 4.1, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Modern Vertical Acoustic Slat Wood Accent Panel behind desk
    const slatBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 6.0, 6.6),
      new THREE.MeshStandardMaterial({ color: 0x18151D, roughness: 0.9 })
    );
    slatBacking.position.set(-7.66, 3.4, 0.4);
    roomGroup.add(slatBacking);

    const slatCount = 24;
    for (let i = 0; i < slatCount; i++) {
      const zPos = -2.8 + (i * 0.26);
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 6.0, 0.14),
        woodSlatMat
      );
      slat.position.set(-7.62, 3.4, zPos);
      slat.castShadow = true;
      roomGroup.add(slat);
    }

    // Modern Framed Gallery Art on Left Wall
    const frameGeo = new THREE.BoxGeometry(0.04, 2.0, 1.4);
    const frameMesh = new THREE.Mesh(frameGeo, matteBlackMat);
    frameMesh.position.set(-7.63, 5.0, 5.2);
    roomGroup.add(frameMesh);

    const artPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 1.9),
      new THREE.MeshStandardMaterial({ color: 0xFDE68A, roughness: 0.7 })
    );
    artPlane.position.set(-7.60, 5.0, 5.2);
    artPlane.rotation.y = Math.PI / 2;
    roomGroup.add(artPlane);

    // 3. Right Wall with Large Loft Window
    const rightWallGeo = new THREE.BoxGeometry(16.0, 8.2, 0.35);
    const rightWall = new THREE.Mesh(rightWallGeo, wallRightMat);
    rightWall.position.set(0, 4.1, -7.85);
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    // Floor-to-ceiling panoramic loft window frame
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3 });
    const windowGlassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xBAE6FD, 
      opacity: 0.45, 
      transparent: true, 
      roughness: 0.1, 
      metalness: 0.1,
      transmission: 0.8
    });

    const windowOuter = new THREE.Mesh(new THREE.BoxGeometry(7.2, 5.0, 0.25), windowFrameMat);
    windowOuter.position.set(3.2, 4.2, -7.7);
    roomGroup.add(windowOuter);

    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 4.6), windowGlassMat);
    windowGlass.position.set(3.2, 4.2, -7.56);
    roomGroup.add(windowGlass);

    // Window mullions (sleek cross grid)
    const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.6, 0.1), windowFrameMat);
    mullionV.position.set(3.2, 4.2, -7.54);
    roomGroup.add(mullionV);
    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.1, 0.1), windowFrameMat);
    mullionH.position.set(3.2, 4.2, -7.54);
    roomGroup.add(mullionH);

    // Translucent angled volumetric sunbeam light shaft from window
    const sunBeamMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunBeam = new THREE.Mesh(new THREE.ConeGeometry(5.0, 10.0, 16, 1, true), sunBeamMat);
    sunBeam.rotation.x = Math.PI / 3.4;
    sunBeam.rotation.z = -Math.PI / 4.2;
    sunBeam.position.set(3.2, 4.4, -6.8);
    roomGroup.add(sunBeam);

    // -------------------------------------------------------------
    // HIGH-END CREATOR DESK & WORKSTATION SETUP
    // -------------------------------------------------------------
    // Desk Top (Natural White Oak with beveled chamfer)
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.18, 2.6), deskTopMat);
    deskTop.position.set(-3.2, 1.9, 0.4);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    roomGroup.add(deskTop);

    // Sleek matte black angled trestle legs
    const legPositions = [
      [-5.7, 0.95, -0.7],
      [-0.7, 0.95, -0.7],
      [-5.7, 0.95, 1.5],
      [-0.7, 0.95, 1.5]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.9, 16), matteBlackMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      roomGroup.add(leg);
    });

    // Concealed Under-Desk Ambient LED Light Strip
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.04, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x818cf8 })
    );
    ledStrip.position.set(-3.2, 1.82, -0.85);
    roomGroup.add(ledStrip);

    // Oversized Charcoal Felt Desk Mat
    const deskMat = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.02, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 })
    );
    deskMat.position.set(-3.2, 2.0, 0.4);
    deskMat.receiveShadow = true;
    roomGroup.add(deskMat);

    // Studio Ultrawide Monitor on Aluminum Stand
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-3.2, 2.02, -0.4);

    const monBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.8), aluminumMat);
    monBase.position.y = 0.02;
    monitorGroup.add(monBase);
    const monStem = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), aluminumMat);
    monStem.position.set(0, 0.6, 0);
    monitorGroup.add(monStem);

    const monScreen = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.3, 0.08), matteBlackMat);
    monScreen.position.set(0, 1.2, 0);
    monScreen.castShadow = true;
    monitorGroup.add(monScreen);

    const monGlowMat = new THREE.MeshStandardMaterial({ 
      color: 0x312E81, 
      emissive: 0x4F46E5, 
      emissiveIntensity: 0.35, 
      roughness: 0.2 
    });
    const monGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.22), monGlowMat);
    monGlow.position.set(0, 1.2, 0.045);
    monitorGroup.add(monGlow);

    const screenbar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 12), matteBlackMat);
    screenbar.rotation.z = Math.PI / 2;
    screenbar.position.set(0, 1.88, 0.06);
    monitorGroup.add(screenbar);
    roomGroup.add(monitorGroup);

    // Compact Custom Mechanical Keyboard & Wireless Mouse
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.4 })
    );
    keyboard.position.set(-3.2, 2.03, 1.0);
    roomGroup.add(keyboard);

    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.06, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3 })
    );
    mouse.position.set(-2.25, 2.03, 1.0);
    roomGroup.add(mouse);

    // Ceramic Coffee Mug
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.26, 16),
      new THREE.MeshStandardMaterial({ color: 0xEA580C, roughness: 0.3 })
    );
    mug.position.set(-1.35, 2.14, 0.9);
    roomGroup.add(mug);

    // Desktop Audio Studio Monitors (Pair)
    [-4.9, -1.5].forEach((sx) => {
      const spk = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.65, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 })
      );
      spk.position.set(sx, 2.33, -0.3);
      spk.rotation.y = sx < -3.2 ? 0.25 : -0.25;
      roomGroup.add(spk);
    });

    // Potted Succulent in Fluted Ceramic Pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.4 })
    );
    pot.position.set(-1.0, 2.15, 1.2);
    roomGroup.add(pot);
    const plantLeaves = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x10B981, roughness: 0.6 })
    );
    plantLeaves.position.set(-1.0, 2.36, 1.2);
    roomGroup.add(plantLeaves);

    // -------------------------------------------------------------
    // HERMAN MILLER STYLE ERGONOMIC MESH CHAIR
    // -------------------------------------------------------------
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-3.2, 0, 2.4);

    const chairSeat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.14, 24),
      new THREE.MeshStandardMaterial({ color: 0x7054E8, roughness: 0.7 })
    );
    chairSeat.position.y = 1.1;
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.3, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x5B21B6, roughness: 0.6 })
    );
    chairBack.position.set(0, 1.9, 0.55);
    chairBack.rotation.x = -0.1;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), aluminumMat);
    chairStem.position.y = 0.55;
    chairGroup.add(chairStem);

    const baseStar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.06, 5),
      matteBlackMat
    );
    baseStar.position.y = 0.08;
    chairGroup.add(baseStar);
    roomGroup.add(chairGroup);

    // -------------------------------------------------------------
    // DAYBED & COZY NOOK WITH MUSHROOM LAMP
    // -------------------------------------------------------------
    const bedGroup = new THREE.Group();
    bedGroup.position.set(4.8, 0, -3.8);

    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 6.2), deskTopMat);
    bedBase.position.y = 0.22;
    bedBase.castShadow = true;
    bedGroup.add(bedBase);

    const bedMattress = new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 0.55, 5.9),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.8 })
    );
    bedMattress.position.y = 0.65;
    bedGroup.add(bedMattress);

    const bedDuvet = new THREE.Mesh(
      new THREE.BoxGeometry(3.94, 0.3, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xC084FC, roughness: 0.85 })
    );
    bedDuvet.position.set(0, 0.88, 0.8);
    bedGroup.add(bedDuvet);

    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.26, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xA7F3D0, roughness: 0.9 })
    );
    pillow.position.set(0, 1.05, -2.1);
    bedGroup.add(pillow);

    // Bedside Nightstand Table
    const nightstand = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.85, 1.2),
      deskTopMat
    );
    nightstand.position.set(1.8, 0.42, -2.2);
    bedGroup.add(nightstand);

    // Glowing Scandinavian Mushroom Night Lamp
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.3, 16),
      matteBlackMat
    );
    lampStem.position.set(1.8, 1.0, -2.2);
    bedGroup.add(lampStem);

    const lampShade = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ 
        color: 0xFBBF24, 
        emissive: 0xF59E0B, 
        emissiveIntensity: 0.6, 
        roughness: 0.2 
      })
    );
    lampShade.position.set(1.8, 1.15, -2.2);
    bedGroup.add(lampShade);

    roomGroup.add(bedGroup);

    // Floating Bookshelf with Curated Books & Trailing Ivy Plant
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 0.6), deskTopMat);
    shelf.position.set(-3.2, 5.4, -7.55);
    roomGroup.add(shelf);

    const bookColors = [0xF43F5E, 0x3B82F6, 0x10B981, 0xF59E0B];
    bookColors.forEach((bc, idx) => {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 1.0, 0.5),
        new THREE.MeshStandardMaterial({ color: bc, roughness: 0.5 })
      );
      book.position.set(-4.0 + idx * 0.45, 5.95, -7.55);
      roomGroup.add(book);
    });

    // Trailing Ivy Vine cascading from shelf
    const ivyPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.16, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    );
    ivyPot.position.set(-1.4, 5.65, -7.55);
    roomGroup.add(ivyPot);

    // Cascading ivy leaf clusters
    [5.0, 4.6, 4.2].forEach((yLeaf, i) => {
      const leafCluster = new THREE.Mesh(
        new THREE.SphereGeometry(0.18 - (i * 0.03), 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x10B981, roughness: 0.7 })
      );
      leafCluster.position.set(-1.4 + (Math.sin(i) * 0.08), yLeaf, -7.45);
      roomGroup.add(leafCluster);
    });

    // -------------------------------------------------------------
    // FLOATING SUNLIGHT DUST PARTICLES (MAGICAL ATMOSPHERE)
    // -------------------------------------------------------------
    const particleCount = 110;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14.0; // X
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 6.5; // Y
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14.0; // Z
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

    // -------------------------------------------------------------
    // INTERACTIVE BELONGINGS & ANIMATED GLOW RINGS
    // -------------------------------------------------------------
    const interactiveMeshes = [];
    const beaconRings = [];

    const createBeaconRing = (x, y, z, color = 0xef4444) => {
      const ringGeo = new THREE.RingGeometry(0.2, 0.36, 24);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.65 
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.rotation.x = Math.PI / 2;
      roomGroup.add(ringMesh);
      beaconRings.push(ringMesh);
      return ringMesh;
    };

    // 1. Wall Outlet & 65W Laptop Charger (CRITICAL ALERT TRAP!)
    const outletPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.7, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 })
    );
    outletPlate.position.set(-7.66, 2.3, -1.2);
    roomGroup.add(outletPlate);

    const socketLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xEF4444 })
    );
    socketLed.position.set(-7.61, 2.55, -1.2);
    roomGroup.add(socketLed);

    const chargerBrickGeo = new THREE.BoxGeometry(0.38, 0.32, 0.45);
    const chargerBrickMat = new THREE.MeshStandardMaterial({ 
      color: 0x4F46E5, 
      emissive: 0xEF4444, 
      emissiveIntensity: 0.45,
      roughness: 0.3
    });
    const chargerBrick = new THREE.Mesh(chargerBrickGeo, chargerBrickMat);
    chargerBrick.position.set(-7.42, 2.3, -1.2);
    chargerBrick.castShadow = true;
    chargerBrick.userData = { id: "charger", name: "65W Laptop Charger", risk: "critical" };
    roomGroup.add(chargerBrick);
    interactiveMeshes.push(chargerBrick);

    createBeaconRing(-7.4, 1.8, -1.2, 0xEF4444);

    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-7.3, 2.2, -1.2),
      new THREE.Vector3(-6.0, 1.7, -0.6),
      new THREE.Vector3(-4.8, 1.95, -0.2),
      new THREE.Vector3(-3.9, 2.04, 0.2)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 40, 0.035, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x6366F1, roughness: 0.4 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    roomGroup.add(cableMesh);

    // 2. Open MacBook Pro on Desk
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-3.2, 2.02, 0.2);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.95), aluminumMat);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    const keyboardWell = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.01, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.7 })
    );
    keyboardWell.position.set(0, 0.026, -0.15);
    laptopGroup.add(keyboardWell);

    const trackpad = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.01, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.2 })
    );
    trackpad.position.set(0, 0.026, 0.25);
    laptopGroup.add(trackpad);

    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.92, 0.04), aluminumMat);
    laptopScreen.position.set(0, 0.46, -0.45);
    laptopScreen.rotation.x = -0.26;
    laptopGroup.add(laptopScreen);

    const displayGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 0.8),
      new THREE.MeshBasicMaterial({ color: 0x93C5FD })
    );
    displayGlow.position.set(0, 0.46, -0.42);
    displayGlow.rotation.x = -0.26;
    laptopGroup.add(displayGlow);

    laptopBase.userData = { id: "laptop", name: "MacBook Pro", risk: "normal" };
    interactiveMeshes.push(laptopBase);
    roomGroup.add(laptopGroup);

    // 3. USB-C to HDMI Adapter Dongle
    const hdmiDongle = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.08, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.5, roughness: 0.3 })
    );
    hdmiDongle.position.set(-2.3, 2.05, 0.4);
    hdmiDongle.castShadow = true;
    hdmiDongle.userData = { id: "hdmi", name: "USB-C to HDMI Adapter", risk: "critical" };
    interactiveMeshes.push(hdmiDongle);
    roomGroup.add(hdmiDongle);
    createBeaconRing(-2.3, 2.02, 0.4, 0xF59E0B);

    // 4. College ID Card & Gate Pass with red lanyard
    const idCard = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.03, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
    );
    idCard.position.set(-3.6, 2.03, 1.0);
    idCard.rotation.y = 0.2;
    idCard.userData = { id: "id_card", name: "Hostel Pass & College ID", risk: "high" };
    interactiveMeshes.push(idCard);
    roomGroup.add(idCard);

    const lanyard = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.02, 8, 24, Math.PI * 1.5),
      new THREE.MeshBasicMaterial({ color: 0xEF4444 })
    );
    lanyard.position.set(-3.8, 2.03, 1.0);
    lanyard.rotation.x = Math.PI / 2;
    roomGroup.add(lanyard);

    // 5. 20,000mAh Power Bank
    const powerbank = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.09, 0.92),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3 })
    );
    powerbank.position.set(-4.4, 2.05, 0.6);
    powerbank.rotation.y = -0.15;
    powerbank.userData = { id: "powerbank", name: "20,000mAh Power Bank", risk: "normal" };
    interactiveMeshes.push(powerbank);
    roomGroup.add(powerbank);

    // 6. Wireless Earbuds Case
    const earbuds = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.16, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.1, metalness: 0.2 })
    );
    earbuds.position.set(-2.9, 2.08, 0.9);
    earbuds.userData = { id: "earbuds", name: "Wireless Earbuds Case", risk: "normal" };
    interactiveMeshes.push(earbuds);
    roomGroup.add(earbuds);

    // 7. Insulated Water Flask
    const flask = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.85, 20),
      new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.4, roughness: 0.3 })
    );
    flask.position.set(-1.2, 2.42, -0.2);
    flask.userData = { id: "water_bottle", name: "Insulated Water Flask", risk: "normal" };
    interactiveMeshes.push(flask);
    roomGroup.add(flask);

    // 8. High-Detail Realistic Travel Backpack (Bellroy / Herschel Aesthetic)
    const backpackGroup = new THREE.Group();
    backpackGroup.position.set(-4.2, 0.05, 2.4);
    backpackGroup.rotation.y = 0.35;
    backpackGroup.rotation.x = 0.08; // Natural casual lean against chair

    // Materials
    const canvasMainMat = new THREE.MeshStandardMaterial({ 
      color: 0x334155, // Premium Slate Navy Cordura Canvas
      roughness: 0.75,
      metalness: 0.05
    });
    const canvasFlapMat = new THREE.MeshStandardMaterial({ 
      color: 0x1E293B, // Darker Charcoal Pocket & Hood
      roughness: 0.7 
    });
    const leatherTrimMat = new THREE.MeshStandardMaterial({ 
      color: 0xB45309, // Tan Leather Bottom Boot & Lash Tab
      roughness: 0.5 
    });
    const buckleMat = new THREE.MeshStandardMaterial({ 
      color: 0xD97706, // Brass Metal Buckle Clips
      metalness: 0.8,
      roughness: 0.25 
    });
    const strapMat = new THREE.MeshStandardMaterial({ 
      color: 0x0F172A, // Black Webbing Straps & Top Handle
      roughness: 0.85 
    });

    // Main Backpack Body
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 1.25, 0.62),
      canvasMainMat
    );
    mainBody.position.y = 0.72;
    mainBody.castShadow = true;
    mainBody.userData = { id: "backpack", name: "Travel Backpack", risk: "normal" };
    backpackGroup.add(mainBody);
    interactiveMeshes.push(mainBody);

    // Leather Reinforced Bottom Boot
    const bottomBoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.94, 0.26, 0.64),
      leatherTrimMat
    );
    bottomBoot.position.y = 0.23;
    bottomBoot.castShadow = true;
    backpackGroup.add(bottomBoot);

    // Curved Top Hood / Rolltop
    const topHood = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.31, 0.92, 16, 1, false, 0, Math.PI),
      canvasFlapMat
    );
    topHood.rotation.z = Math.PI / 2;
    topHood.position.set(0, 1.34, 0);
    topHood.castShadow = true;
    backpackGroup.add(topHood);

    // Protruding Front Utility Zipper Pocket
    const frontPocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.62, 0.22),
      canvasFlapMat
    );
    frontPocket.position.set(0, 0.65, 0.38);
    frontPocket.castShadow = true;
    frontPocket.userData = { id: "backpack", name: "Travel Backpack", risk: "normal" };
    backpackGroup.add(frontPocket);
    interactiveMeshes.push(frontPocket);

    // Horizontal Zipper Track Strip
    const zipperTrack = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.03, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.6 })
    );
    zipperTrack.position.set(0, 0.82, 0.495);
    backpackGroup.add(zipperTrack);

    // Heritage Diamond Leather Lash Tab ("Pig Snout" patch)
    const lashTab = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.14, 0.02),
      leatherTrimMat
    );
    lashTab.rotation.z = Math.PI / 4;
    lashTab.position.set(0, 1.15, 0.32);
    backpackGroup.add(lashTab);

    // Top Webbing Carry Handle Loop
    const topHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.03, 8, 16, Math.PI),
      strapMat
    );
    topHandle.rotation.x = Math.PI / 2;
    topHandle.position.set(0, 1.48, -0.05);
    backpackGroup.add(topHandle);

    // Dual Padded Curved Shoulder Straps on the back
    [-0.24, 0.24].forEach((strapX) => {
      const strapCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(strapX, 1.32, -0.28),
        new THREE.Vector3(strapX, 0.95, -0.52),
        new THREE.Vector3(strapX, 0.45, -0.45),
        new THREE.Vector3(strapX, 0.20, -0.28)
      ]);
      const strapGeo = new THREE.TubeGeometry(strapCurve, 20, 0.045, 8, false);
      const strapMesh = new THREE.Mesh(strapGeo, strapMat);
      strapMesh.castShadow = true;
      backpackGroup.add(strapMesh);
    });

    // Dual Front Compression Webbing Straps with Brass Buckles
    [-0.22, 0.22].forEach((sx) => {
      const vStrap = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.95, 0.02),
        strapMat
      );
      vStrap.position.set(sx, 0.88, 0.33);
      backpackGroup.add(vStrap);

      const buckle = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.08, 0.04),
        buckleMat
      );
      buckle.position.set(sx, 1.05, 0.34);
      backpackGroup.add(buckle);
    });

    // Side Elastic Pocket with Travel Water Flask
    const sidePouch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.14, 0.45, 12, 1, false, 0, Math.PI),
      strapMat
    );
    sidePouch.rotation.y = -Math.PI / 2;
    sidePouch.position.set(0.48, 0.55, 0);
    backpackGroup.add(sidePouch);

    const sideBottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: 0x10B981, roughness: 0.3, metalness: 0.4 })
    );
    sideBottle.position.set(0.48, 0.72, 0);
    sideBottle.rotation.z = -0.15;
    backpackGroup.add(sideBottle);

    roomGroup.add(backpackGroup);

    interactiveObjectsRef.current = interactiveMeshes;
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

    materialsRef.current = {
      windowGlass: windowGlassMat,
      monGlow: monGlowMat,
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

      controls.update();
      renderer.render(scene, camera);

      // Project 3D item positions to 2D screen coordinates for floating tags
      if (showLabels && camera && mountRef.current) {
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
  }, [viewMode, showLabels]);

  // Camera preset switches
  const setCameraAngle = (mode) => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (mode === "iso") {
      cameraRef.current.position.set(14.5, 12.0, 14.5);
      controlsRef.current.target.set(0, 2.0, 0);
    } else if (mode === "top") {
      cameraRef.current.position.set(0, 24.0, 0.1);
      controlsRef.current.target.set(0, 1.0, 0);
    } else if (mode === "desk") {
      cameraRef.current.position.set(-3.2, 4.6, 3.8);
      controlsRef.current.target.set(-3.2, 2.05, 0.3);
    } else if (mode === "bed") {
      cameraRef.current.position.set(5.8, 5.4, -0.5);
      controlsRef.current.target.set(4.8, 1.5, -3.8);
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
        
        {viewMode === "3d" ? (
          <>
            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

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
            <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-sm">
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
                💻 Desk Close-up
              </button>
              <button
                onClick={() => setCameraAngle("bed")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                🛏️ Cozy Nook
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
        ) : (
          /* 2D Original Photo View */
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
            <img
              src={photoUrl}
              alt="Room source photograph"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
              Original Room Photograph (Reference)
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
