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
  Wand2
} from 'lucide-react';

export default function RoomSceneViewer({
  highlightedItemId = null,
  onSelectItem = null,
  onHoverItem = null,
  onReconstructRoom = null,
  photoUrl = "/assets/hostel-desk-demo.jpg",
  roomTitle = "Alex's Reconstructed Hostel Room (Block C-402)",
  reconstructionStatus = "3D Twin Ready"
}) {
  const mountRef = useRef(null);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "photo"
  const [showLabels, setShowLabels] = useState(true);
  const [selectedObj, setSelectedObj] = useState(null);
  const [screenLabels, setScreenLabels] = useState([]);

  // Refs for 3D state
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const interactiveObjectsRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Definition of interactive belongings in the room
  const roomItems = [
    {
      id: "charger",
      name: "65W Laptop Charger",
      status: "High-Risk Memory Alert",
      risk: "critical",
      note: "Plugged into wall socket behind study desk! Alex forgot this 3x.",
      pos: [-3.8, 2.3, -1.2],
      color: 0xef4444, // coral red
      category: "Tech & Power"
    },
    {
      id: "laptop",
      name: "MacBook Pro",
      status: "Verified in Room",
      risk: "normal",
      note: "Open on center of maple study desk.",
      pos: [-1.2, 2.2, 0.2],
      color: 0x8b5cf6, // purple
      category: "Tech"
    },
    {
      id: "hdmi",
      name: "USB-C to HDMI Adapter",
      status: "High-Risk (Presentation)",
      risk: "critical",
      note: "Resting beside laptop ports on study table.",
      pos: [-0.3, 2.05, 0.4],
      color: 0xf59e0b, // amber
      category: "AV & Adapters"
    },
    {
      id: "id_card",
      name: "Hostel Pass & College ID",
      status: "High-Risk (Late Return)",
      risk: "high",
      note: "Lying near front edge of desk with lanyard.",
      pos: [-1.6, 2.05, 1.0],
      color: 0x10b981, // mint
      category: "Documents"
    },
    {
      id: "powerbank",
      name: "20,000mAh Power Bank",
      status: "Verified in Room",
      risk: "normal",
      note: "Left side of desk surface.",
      pos: [-2.4, 2.05, 0.6],
      color: 0x3b82f6, // blue
      category: "Power"
    },
    {
      id: "earbuds",
      name: "Wireless Earbuds Case",
      status: "Verified in Room",
      risk: "normal",
      note: "Front center desk.",
      pos: [-0.9, 2.05, 0.9],
      color: 0x06b6d4, // cyan
      category: "Audio"
    },
    {
      id: "water_bottle",
      name: "Insulated Water Flask",
      status: "Verified in Room",
      risk: "normal",
      note: "Right desk corner near window.",
      pos: [0.8, 2.4, -0.2],
      color: 0x0284c7,
      category: "Daily"
    },
    {
      id: "backpack",
      name: "Travel Backpack",
      status: "Exit Luggage",
      risk: "normal",
      note: "Sitting on floor beside chair.",
      pos: [-1.8, 0.9, 2.2],
      color: 0x7c3aed,
      category: "Luggage"
    }
  ];

  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF9F6F0);
    sceneRef.current = scene;

    // 2. Camera (Isometric Perspective)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(13, 11, 13);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // prevent going beneath floor
    controls.minDistance = 6;
    controls.maxDistance = 26;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // 5. Lighting (Soft Pastel Studio & Window Sun)
    const ambientLight = new THREE.AmbientLight(0xfff6ee, 0.9);
    scene.add(ambientLight);

    // Sun directional light
    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.1);
    sunLight.position.set(12, 16, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 35;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Window rim light
    const windowRim = new THREE.DirectionalLight(0xdbeafe, 0.4);
    windowRim.position.set(-10, 8, -10);
    scene.add(windowRim);

    // Desk lamp warm point light
    const deskLampLight = new THREE.PointLight(0xffeedd, 1.2, 5);
    deskLampLight.position.set(0.6, 3.2, -0.6);
    scene.add(deskLampLight);

    // -------------------------------------------------------------
    // BUILD 3D PASTEL ROOM ARCHITECTURE
    // -------------------------------------------------------------
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0xF5EBE0, 
      roughness: 0.6, 
      metalness: 0.05 
    });
    const wallLeftMat = new THREE.MeshStandardMaterial({ 
      color: 0xE8E1FA, 
      roughness: 0.85 
    });
    const wallRightMat = new THREE.MeshStandardMaterial({ 
      color: 0xF0EBF8, 
      roughness: 0.85 
    });
    const trimMat = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF, 
      roughness: 0.4 
    });
    const deskMat = new THREE.MeshStandardMaterial({ 
      color: 0xF1D3B3, 
      roughness: 0.55 
    });
    const woodLegMat = new THREE.MeshStandardMaterial({ 
      color: 0xDEC0A2, 
      roughness: 0.5 
    });
    const metalMat = new THREE.MeshStandardMaterial({ 
      color: 0xCBD5E1, 
      roughness: 0.3, 
      metalness: 0.7 
    });

    // Floor
    const floorGeo = new THREE.BoxGeometry(11, 0.4, 11);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.2;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Subtle parquet tile grid lines on floor
    const grid = new THREE.GridHelper(10.5, 12, 0xE2D5C8, 0xEBE0D5);
    grid.position.y = 0.01;
    roomGroup.add(grid);

    // Back Left Wall (With Wall Socket!)
    const leftWallGeo = new THREE.BoxGeometry(0.3, 6, 11);
    const leftWallMesh = new THREE.Mesh(leftWallGeo, wallLeftMat);
    leftWallMesh.position.set(-5.35, 2.8, 0);
    leftWallMesh.receiveShadow = true;
    roomGroup.add(leftWallMesh);

    // Baseboard trim left
    const trimLeftGeo = new THREE.BoxGeometry(0.4, 0.3, 11);
    const trimLeftMesh = new THREE.Mesh(trimLeftGeo, trimMat);
    trimLeftMesh.position.set(-5.3, 0.15, 0);
    roomGroup.add(trimLeftMesh);

    // Back Right Wall (With Cozy Window)
    const rightWallGeo = new THREE.BoxGeometry(11, 6, 0.3);
    const rightWallMesh = new THREE.Mesh(rightWallGeo, wallRightMat);
    rightWallMesh.position.set(0, 2.8, -5.35);
    rightWallMesh.receiveShadow = true;
    roomGroup.add(rightWallMesh);

    // Window Frame on Right Wall
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const windowGlassMat = new THREE.MeshBasicMaterial({ color: 0xBAE6FD, opacity: 0.75, transparent: true });
    
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.2), windowFrameMat);
    windowFrame.position.set(1.5, 3.5, -5.2);
    roomGroup.add(windowFrame);
    
    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), windowGlassMat);
    windowGlass.position.set(1.5, 3.5, -5.08);
    roomGroup.add(windowGlass);

    // -------------------------------------------------------------
    // FURNITURE: STUDY DESK, CHAIR & DAYBED
    // -------------------------------------------------------------
    // Study Desk Top
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.2, 2.6), deskMat);
    deskTop.position.set(-1.2, 1.9, 0.4);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    roomGroup.add(deskTop);

    // Desk Legs (4 legs)
    const legPositions = [
      [-3.6, 0.95, -0.7],
      [1.2, 0.95, -0.7],
      [-3.6, 0.95, 1.5],
      [1.2, 0.95, 1.5]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.9, 12), woodLegMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      roomGroup.add(leg);
    });

    // Modern Ergonomic Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-1.2, 0, 2.2);
    
    const chairSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.15, 24), new THREE.MeshStandardMaterial({ color: 0x8B5CF6 }));
    chairSeat.position.y = 1.1;
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.12), new THREE.MeshStandardMaterial({ color: 0x7C3AED }));
    chairBack.position.set(0, 1.9, 0.6);
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), metalMat);
    chairStem.position.y = 0.55;
    chairGroup.add(chairStem);
    roomGroup.add(chairGroup);

    // Student Daybed / Bed in Right Corner
    const bedGroup = new THREE.Group();
    bedGroup.position.set(3.5, 0, -2.5);

    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 4.8), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    bedBase.position.y = 0.3;
    bedBase.castShadow = true;
    bedGroup.add(bedBase);

    const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 4.6), new THREE.MeshStandardMaterial({ color: 0xF3E8FF }));
    bedMattress.position.y = 0.7;
    bedGroup.add(bedMattress);

    const bedBlanket = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.25, 3.2), new THREE.MeshStandardMaterial({ color: 0xC084FC }));
    bedBlanket.position.set(0, 0.9, 0.6);
    bedGroup.add(bedBlanket);

    const pillow = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.9), new THREE.MeshStandardMaterial({ color: 0xA7F3D0 }));
    pillow.position.set(0, 1.05, -1.6);
    bedGroup.add(pillow);
    roomGroup.add(bedGroup);

    // Floating Bookshelf on back wall
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.1, 0.6), deskMat);
    shelf.position.set(-1.5, 4.2, -5.0);
    roomGroup.add(shelf);

    // Decorative books on shelf
    const bookColors = [0xF43F5E, 0x3B82F6, 0x10B981, 0xF59E0B];
    bookColors.forEach((bc, idx) => {
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, 0.5), new THREE.MeshStandardMaterial({ color: bc }));
      book.position.set(-2.5 + idx * 0.35, 4.65, -5.0);
      roomGroup.add(book);
    });

    // Potted Monstera / Succulent on Desk
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0xEA580C }));
    pot.position.set(0.9, 2.15, 1.2);
    roomGroup.add(pot);
    const plantLeaves = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshStandardMaterial({ color: 0x10B981 }));
    plantLeaves.position.set(0.9, 2.38, 1.2);
    roomGroup.add(plantLeaves);

    // -------------------------------------------------------------
    // INTERACTIVE BELONGINGS (DETECTED OBJECTS WITH RAYCASTING)
    // -------------------------------------------------------------
    const interactiveMeshes = [];

    // 1. Wall Power Socket & 65W Laptop Charger (THE HIGH RISK TRAP!)
    // Wall Outlet Plate on left wall
    const outletPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    outletPlate.position.set(-5.16, 2.3, -1.2);
    roomGroup.add(outletPlate);

    // Charger Adapter Brick plugged in
    const chargerBrickGeo = new THREE.BoxGeometry(0.35, 0.32, 0.45);
    const chargerBrickMat = new THREE.MeshStandardMaterial({ 
      color: 0x4F46E5, 
      emissive: 0x312E81, 
      emissiveIntensity: 0.25 
    });
    const chargerBrick = new THREE.Mesh(chargerBrickGeo, chargerBrickMat);
    chargerBrick.position.set(-4.95, 2.3, -1.2);
    chargerBrick.castShadow = true;
    chargerBrick.userData = { id: "charger", name: "65W Laptop Charger", risk: "critical" };
    roomGroup.add(chargerBrick);
    interactiveMeshes.push(chargerBrick);

    // Trailing charger cable from wall outlet to laptop on desk!
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.8, 2.2, -1.2),
      new THREE.Vector3(-4.0, 1.7, -0.6),
      new THREE.Vector3(-3.0, 1.95, -0.2),
      new THREE.Vector3(-1.8, 2.05, 0.2)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 32, 0.03, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x6366F1, roughness: 0.5 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    roomGroup.add(cableMesh);

    // 2. Open Laptop on Desk
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-1.2, 2.02, 0.2);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.95), metalMat);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    // Laptop open screen
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.04), new THREE.MeshStandardMaterial({ color: 0x1E1B4B }));
    laptopScreen.position.set(0, 0.45, -0.45);
    laptopScreen.rotation.x = -0.25;
    laptopGroup.add(laptopScreen);

    // Display glass glow
    const displayGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.78), new THREE.MeshBasicMaterial({ color: 0x93C5FD }));
    displayGlow.position.set(0, 0.45, -0.42);
    displayGlow.rotation.x = -0.25;
    laptopGroup.add(displayGlow);

    laptopBase.userData = { id: "laptop", name: "MacBook Pro", risk: "normal" };
    interactiveMeshes.push(laptopBase);
    roomGroup.add(laptopGroup);

    // 3. USB-C to HDMI Adapter Dongle
    const hdmiDongle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.18), new THREE.MeshStandardMaterial({ color: 0xF59E0B }));
    hdmiDongle.position.set(-0.3, 2.05, 0.4);
    hdmiDongle.castShadow = true;
    hdmiDongle.userData = { id: "hdmi", name: "USB-C to HDMI Adapter", risk: "critical" };
    interactiveMeshes.push(hdmiDongle);
    roomGroup.add(hdmiDongle);

    // 4. College ID Card & Gate Pass with red lanyard
    const idCard = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 0.3), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    idCard.position.set(-1.6, 2.02, 1.0);
    idCard.rotation.y = 0.2;
    idCard.userData = { id: "id_card", name: "Hostel Pass & College ID", risk: "high" };
    interactiveMeshes.push(idCard);
    roomGroup.add(idCard);

    // Lanyard ribbon
    const lanyard = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 24, Math.PI * 1.5), new THREE.MeshBasicMaterial({ color: 0xEF4444 }));
    lanyard.position.set(-1.8, 2.02, 1.0);
    lanyard.rotation.x = Math.PI / 2;
    roomGroup.add(lanyard);

    // 5. Power Bank
    const powerbank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.9), new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3 }));
    powerbank.position.set(-2.4, 2.04, 0.6);
    powerbank.rotation.y = -0.15;
    powerbank.userData = { id: "powerbank", name: "20,000mAh Power Bank", risk: "normal" };
    interactiveMeshes.push(powerbank);
    roomGroup.add(powerbank);

    // 6. Earbuds Case
    const earbuds = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.25), new THREE.MeshStandardMaterial({ color: 0x10B981 }));
    earbuds.position.set(-0.9, 2.08, 0.9);
    earbuds.userData = { id: "earbuds", name: "Wireless Earbuds Case", risk: "normal" };
    interactiveMeshes.push(earbuds);
    roomGroup.add(earbuds);

    // 7. Water Flask
    const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.5 }));
    flask.position.set(0.8, 2.4, -0.2);
    flask.userData = { id: "water_bottle", name: "Insulated Water Flask", risk: "normal" };
    interactiveMeshes.push(flask);
    roomGroup.add(flask);

    // 8. Travel Backpack by Desk
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.7), new THREE.MeshStandardMaterial({ color: 0x7C3AED, roughness: 0.7 }));
    backpack.position.set(-1.8, 0.7, 2.2);
    backpack.rotation.y = 0.3;
    backpack.castShadow = true;
    backpack.userData = { id: "backpack", name: "Travel Backpack", risk: "normal" };
    interactiveMeshes.push(backpack);
    roomGroup.add(backpack);

    interactiveObjectsRef.current = interactiveMeshes;

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

      // Subtle float on charger & high-risk items
      if (chargerBrick) {
        chargerBrick.position.y = 2.3 + Math.sin(elapsed * 3) * 0.03;
      }

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
      cameraRef.current.position.set(13, 11, 13);
      controlsRef.current.target.set(0, 1.8, 0);
    } else if (mode === "top") {
      cameraRef.current.position.set(0, 19, 0.1);
      controlsRef.current.target.set(0, 1, 0);
    } else if (mode === "desk") {
      cameraRef.current.position.set(-1.2, 5.5, 4.5);
      controlsRef.current.target.set(-1.2, 2.1, 0.3);
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

        {/* Action Buttons: Scan & Reconstruct */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {onReconstructRoom && (
            <button
              onClick={onReconstructRoom}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>Scan & Reconstruct</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full h-[360px] sm:h-[400px] md:h-[430px] rounded-2xl overflow-hidden bg-[#F9F6F0]/90 border border-white/70 shadow-inner select-none">
        
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

            {/* 3D Camera Controls Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setCameraAngle("iso")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                Isometric
              </button>
              <button
                onClick={() => setCameraAngle("desk")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                Desk Focus
              </button>
              <button
                onClick={() => setCameraAngle("top")}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#ede9fe] hover:text-[#7054E8] text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              >
                Top View
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
        <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ede7dd] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
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
      <div className="pt-2.5 border-t border-[#f0eae0] space-y-2">
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
                    : 'bg-[#faf8f5] text-slate-700 border-[#ede7dd] hover:bg-white'
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
        <span>💡 Left-click and drag to orbit room • Scroll to zoom • Click belongings to verify</span>
        <span className="font-mono text-[10px]">WebGL 3D Studio Active</span>
      </div>

    </div>
  );
}
