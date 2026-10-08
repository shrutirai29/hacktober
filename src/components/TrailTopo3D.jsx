import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Volume2, 
  Navigation, 
  AlertTriangle, 
  Sun, 
  Moon, 
  CloudSnow, 
  CloudFog, 
  Sunset, 
  Compass, 
  Camera, 
  Eye, 
  Layers, 
  Wind, 
  Sparkles,
  Mountain,
  MapPin,
  Flag,
  RotateCcw,
  ShieldAlert,
  Info,
  Maximize2,
  TreePine,
  Activity,
  Sliders,
  CheckCircle2,
  Clock,
  Landmark,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Thermometer,
  Gauge,
  Tent,
  Waves,
  BrainCircuit
} from 'lucide-react';
import { speakTrailWhisper } from '../services/voiceGuide';
import { TRAILS_DATA } from '../data/trailData';
import { trailAI } from '../services/trailAIModel';

// Generate procedural PBR-like rock normal & roughness maps using an HTML Canvas (100% offline & fast)
function createProceduralRockTextures() {
  const size = 512;
  const canvasNorm = document.createElement('canvas');
  canvasNorm.width = size;
  canvasNorm.height = size;
  const ctxNorm = canvasNorm.getContext('2d');

  const canvasRough = document.createElement('canvas');
  canvasRough.width = size;
  canvasRough.height = size;
  const ctxRough = canvasRough.getContext('2d');

  const imgNorm = ctxNorm.createImageData(size, size);
  const imgRough = ctxRough.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const n1 = Math.sin(x * 0.12) * Math.cos(y * 0.12);
      const n2 = Math.sin(x * 0.04 + y * 0.03) * Math.cos(x * 0.02 - y * 0.04);
      const n3 = Math.sin(x * 0.3) * Math.sin(y * 0.3) * 0.5;
      const grain = (n1 * 0.4 + n2 * 0.4 + n3 * 0.2 + 1) * 0.5;

      const nx = Math.floor(128 + (n1 - 0.5) * 50);
      const ny = Math.floor(128 + (n2 - 0.5) * 50);
      const nz = 230;

      imgNorm.data[idx] = nx;
      imgNorm.data[idx + 1] = ny;
      imgNorm.data[idx + 2] = nz;
      imgNorm.data[idx + 3] = 255;

      const rVal = Math.floor(180 + grain * 70);
      imgRough.data[idx] = rVal;
      imgRough.data[idx + 1] = rVal;
      imgRough.data[idx + 2] = rVal;
      imgRough.data[idx + 3] = 255;
    }
  }

  ctxNorm.putImageData(imgNorm, 0, 0);
  ctxRough.putImageData(imgRough, 0, 0);

  const normalTex = new THREE.CanvasTexture(canvasNorm);
  normalTex.wrapS = THREE.RepeatWrapping;
  normalTex.wrapT = THREE.RepeatWrapping;
  normalTex.repeat.set(14, 14);

  const roughTex = new THREE.CanvasTexture(canvasRough);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.repeat.set(14, 14);

  return { normalTex, roughTex };
}

// 4 TRAIL CONFIGURATIONS WITH DISTINCT 3D ELEVATION, MATERIALS, LANDMARKS & CHECKPOINTS
const TRAIL_CONFIGS = {
  'hampta-pass': {
    name: 'Hampta Pass Alpine Transect',
    badge: '2,870 m → 4,270 m → 3,900 m',
    icon: '🌲',
    stages: [
      { id: 'landing', title: 'Landing' },
      { id: 'overview', title: 'Route Overview' },
      { id: 'valley', title: 'Hampta Valley' },
      { id: 'meadow', title: 'Alpine Meadow' },
      { id: 'rock', title: 'High-Altitude Rock' },
      { id: 'snow', title: 'Snow Zone' },
      { id: 'pass', title: 'Hampta Pass' },
      { id: 'spiti', title: 'Spiti Transition' },
      { id: 'insight', title: 'Trek Insight' },
      { id: 'free', title: 'Free Exploration' }
    ],
    checkpoints: [
      { num: '01', name: 'Hampta Valley (Jobra)', elev: '2,870 m', zone: 'Lush Conifer Forest', terrain: 'Moist Soil & Conifer Forest', difficulty: 'Gentle Walk', tip: 'Start along Rani Nallah river; prepare for damp roots.' },
      { num: '02', name: 'Balou Ka Ghera', elev: '3,600 m', zone: 'Alpine Bugyal Basin', terrain: 'Sprawling Meadow Basin & Glacial Streams', difficulty: 'Moderate Incline', tip: 'Cross morning streams before midday snowmelt increases volume.' },
      { num: '03', name: 'High Rock Zone', elev: '3,950 m', zone: 'Moraine Scree', terrain: 'Dark Granite Boulders & Scree', difficulty: 'Challenging Scramble', tip: 'Treeline far below. Watch footing on loose moraine talus.' },
      { num: '04', name: 'Snow Couloir', elev: '4,150 m', zone: 'Frozen Headwall', terrain: 'Steep Hardpack Snowpack', difficulty: 'Strenuous Snow Climb', tip: 'Microspikes essential on early morning hardpack snow.' },
      { num: '05', name: 'Hampta Pass Crest', elev: '4,270 m', zone: 'Continental Divide Notch', terrain: 'Narrow Saddle & Exposed Flanks', difficulty: 'Pass Crest', tip: 'High winds channel through pass notch. 1:30 PM turnaround.' },
      { num: '06', name: 'Shea Goru (Spiti)', elev: '3,900 m', zone: 'Cold Rain-Shadow Desert', terrain: 'Barren Ochre Rock & Braided River', difficulty: 'Scree Descent', tip: 'Zero trees! Cold dry winds; rapid unseen dehydration.' }
    ],
    defaultCam: { theta: 0.32, phi: 0.38, rad: 34, look: new THREE.Vector3(0.0, 9.0, 3.0) }
  },

  'triund-ridge': {
    name: 'Triund to Indrahar Ridge',
    badge: '2,828 m → 4,342 m',
    icon: '🏕️',
    stages: [
      { id: 'landing', title: 'Landing' },
      { id: 'overview', title: 'Route Overview' },
      { id: 'triund', title: 'Triund Meadow' },
      { id: 'snowline', title: 'Snowline Moraine' },
      { id: 'laka', title: 'Laka Glacier' },
      { id: 'gully', title: 'Ridge Approach' },
      { id: 'indrahar', title: 'Indrahar Crest' },
      { id: 'insight', title: 'Trek Insight' },
      { id: 'free', title: 'Free Exploration' }
    ],
    checkpoints: [
      { num: '01', name: 'Triund Meadow Shelf', elev: '2,828 m', zone: 'Alpine Ridge Shelf', terrain: 'Rolling Green Pasture overlooking Kangra', difficulty: 'Moderate Incline', tip: 'Start early before 6:30 AM to beat midday high mountain fog.' },
      { num: '02', name: 'Snowline Cafe & Moraine', elev: '3,250 m', zone: 'Treeline Boundary', terrain: 'Granite Boulders & Moraine Scree', difficulty: 'Challenging Incline', tip: 'Treeline abruptly ends. Last reliable water source before pass.' },
      { num: '03', name: 'Laka Glacier Basin', elev: '3,550 m', zone: 'Glacial Bowl', terrain: 'Seasonal Snow Couloir surrounded by Crags', difficulty: 'Alpine Snow Zone', tip: 'Equip microspikes here. Watch for rockfall from warming couloirs.' },
      { num: '04', name: 'Steep Gully Staircase', elev: '3,950 m', zone: 'Class 3 Moraine', terrain: 'Steep Boulder Gully with High Exposure', difficulty: 'Severe Scramble', tip: 'Class 3 scrambling. 12:30 PM strict turnaround deadline.' },
      { num: '05', name: 'Indrahar Ridge Crest', elev: '4,342 m', zone: 'Knife-Edge Pass', terrain: 'Razor-Sharp Arete connecting Kangra & Chamba', difficulty: 'Summit Pass', tip: 'Fluttering prayer flags & cairn. 360° views of Mani Mahesh Kailash.' }
    ],
    defaultCam: { theta: 0.32, phi: 0.38, rad: 32, look: new THREE.Vector3(0.0, 7.0, 4.0) }
  },

  'chandrashila-peak': {
    name: 'Chandrashila & Tungnath Peak',
    badge: '2,680 m → 3,680 m → 4,000 m',
    icon: '🛕',
    stages: [
      { id: 'landing', title: 'Landing' },
      { id: 'overview', title: 'Route Overview' },
      { id: 'chopta', title: 'Chopta Bugyal' },
      { id: 'bhojbasa', title: 'Bhojbasa Slope' },
      { id: 'tungnath', title: 'Tungnath Temple' },
      { id: 'ravansheela', title: 'Ravansheela' },
      { id: 'summit', title: 'Chandrashila Summit' },
      { id: 'insight', title: 'Trek Insight' },
      { id: 'free', title: 'Free Exploration' }
    ],
    checkpoints: [
      { num: '01', name: 'Chopta Bugyal Meadows', elev: '2,680 m', zone: 'Mini Switzerland', terrain: 'Rolling Bugyal Pastures & Silver Firs', difficulty: 'Gentle Walk', tip: 'Flagstone paved pilgrimage path begins through dense oak woods.' },
      { num: '02', name: 'Bhojbasa Rhododendron Stand', elev: '3,150 m', zone: 'Sub-Alpine Forest', terrain: 'Rhododendron Arboreum & Dwarf Birch', difficulty: 'Moderate Switchbacks', tip: 'Maintain slow steady rhythm as barometric pressure begins dropping.' },
      { num: '03', name: 'Tungnath Sacred Temple', elev: '3,680 m', zone: 'World Highest Shiva Shrine', terrain: 'Historic Ancient Stone Temple Settlement', difficulty: 'Temple Base', tip: '1,000-year-old Nagara stone temple. Heavy wind chill on courtyard.' },
      { num: '04', name: 'Ravansheela Rock Overhang', elev: '3,840 m', zone: 'Upper Cliff Edge', terrain: 'Rugged Scree & Slate Steps', difficulty: 'Steep Rocky Scramble', tip: 'Dual trekking poles recommended on uneven rocky steps.' },
      { num: '05', name: 'Chandrashila Moon Rock Horn', elev: '4,000 m', zone: 'Summit Horn', terrain: 'Jagged Exposed Apex with 360° Panorama', difficulty: 'Alpine Summit Push', tip: '360° alpenglow views of Chaukhamba, Nanda Devi, and Trishul massifs.' }
    ],
    defaultCam: { theta: 0.35, phi: 0.42, rad: 30, look: new THREE.Vector3(0.5, 7.5, 2.0) }
  },

  'kedarnath-ridge': {
    name: 'Kedarnath Summit Ridge',
    badge: '3,584 m → 6,940 m Peak',
    icon: '❄️',
    stages: [
      { id: 'landing', title: 'Landing' },
      { id: 'overview', title: 'Route Overview' },
      { id: 'valley', title: 'Mandakini Gorge' },
      { id: 'temple', title: 'Kedarnath Temple' },
      { id: 'chorabari', title: 'Chorabari Glacier' },
      { id: 'southwall', title: 'Colossal South Wall' },
      { id: 'summit', title: 'Kedarnath Ridge' },
      { id: 'insight', title: 'Trek Insight' },
      { id: 'free', title: 'Free Exploration' }
    ],
    checkpoints: [
      { num: '01', name: 'Mandakini Gorge Base', elev: '3,584 m', zone: 'Glacial Valley Floor', terrain: 'Torrent River Gorge & Slate Terrace', difficulty: 'Base Approach', tip: 'Roaring Mandakini river glacial meltwater channels.' },
      { num: '02', name: 'Kedarnath Holy Shrine', elev: '3,584 m', zone: 'Ancient Stone Temple', terrain: 'Sacred Stone Temple Courtyard & Settlement', difficulty: 'Base Plateau', tip: 'Massive grey stone shrine standing strong against glacial floods.' },
      { num: '03', name: 'Chorabari Glacial Lake', elev: '3,900 m', zone: 'Glacial Moraine', terrain: 'Glacial Tarn & Lateral Moraine Crevasses', difficulty: 'Moraine Traverse', tip: 'Active glacial moraine; beware of loose rocks and hidden crevasses.' },
      { num: '04', name: 'Colossal South Wall', elev: '4,800 m', zone: 'Glacial Face', terrain: 'Towering Sheer Granite Wall & Hanging Seracs', difficulty: 'Extreme Mountaineering', tip: 'Severe avalanche hazard from hanging glacial ice seracs.' },
      { num: '05', name: 'Kedarnath Summit Ridge', elev: '6,940 m', zone: 'High Himalayan Horn', terrain: 'Razor-Sharp Arete & Perpetual Glacial Ice', difficulty: 'Extreme 6,940 m Apex', tip: 'Severe sub-zero freeze and howling hurricane-force jetstream winds.' }
    ],
    defaultCam: { theta: 0.28, phi: 0.36, rad: 36, look: new THREE.Vector3(0.0, 9.5, 2.0) }
  }
};

// 6 COMPREHENSIVE HIMALAYAN ENVIRONMENTAL MICROCLIMATES WITH REAL-TIME TELEMETRY
export const ENVIRONMENT_PRESETS = [
  {
    id: 'crisp-autumn',
    label: 'Crisp Autumn Morning',
    shortLabel: 'Autumn (12°C)',
    icon: '🍂',
    tempC: 12,
    tempF: 54,
    condition: 'Crisp & Clear',
    wind: '14 km/h NW',
    humidity: '42%',
    pressure: '685 hPa',
    visibility: 'Unlimited (>25 km)',
    snowLineElev: '3,800 m',
    skyColor: 0x9db8c8,
    fogColor: 0x9db8c8,
    fogDensity: 0.012,
    sunColor: 0xffdfba,
    sunIntensity: 2.1,
    sunPos: [26, 42, 22],
    hemiSky: 0xbad2e6,
    hemiGround: 0x364230,
    hemiIntensity: 0.72,
    ambientColor: 0xfff5eb,
    ambientIntensity: 0.48,
    snowParticles: false,
    snowScale: 1.0,
    desc: 'Golden morning light, clear visibility, light frost on high passes.'
  },
  {
    id: 'midsummer-warmth',
    label: 'Midsummer Alpine Warmth',
    shortLabel: 'Summer (22°C)',
    icon: '☀️',
    tempC: 22,
    tempF: 72,
    condition: 'Mild Alpine Sun',
    wind: '8 km/h S',
    humidity: '35%',
    pressure: '698 hPa',
    visibility: 'Excellent (>30 km)',
    snowLineElev: '4,200 m',
    skyColor: 0x72a5cf,
    fogColor: 0x82b2d6,
    fogDensity: 0.007,
    sunColor: 0xfffaea,
    sunIntensity: 2.5,
    sunPos: [15, 48, 15],
    hemiSky: 0xd8eeff,
    hemiGround: 0x2e4726,
    hemiIntensity: 0.85,
    ambientColor: 0xfffbf2,
    ambientIntensity: 0.58,
    snowParticles: false,
    snowScale: 0.35,
    desc: 'Warm mountain sun, flowing glacial streams, minimal high snowpack.'
  },
  {
    id: 'monsoon-fog',
    label: 'Dense Monsoon Mist / Fog',
    shortLabel: 'Monsoon Fog (8°C)',
    icon: '🌫️',
    tempC: 8,
    tempF: 46,
    condition: 'Heavy Mist & Cloud',
    wind: '22 km/h SW',
    humidity: '94%',
    pressure: '678 hPa',
    visibility: 'Poor (180 m)',
    snowLineElev: '3,900 m',
    skyColor: 0xb4c2cb,
    fogColor: 0xb4c2cb,
    fogDensity: 0.038,
    sunColor: 0xd8e0e5,
    sunIntensity: 0.95,
    sunPos: [20, 35, 18],
    hemiSky: 0xc8d5dc,
    hemiGround: 0x3d473e,
    hemiIntensity: 0.9,
    ambientColor: 0xc8d2d8,
    ambientIntensity: 0.65,
    snowParticles: false,
    snowScale: 0.85,
    desc: 'Thick valley fog blankets the ridges; wet slippery scree surfaces.'
  },
  {
    id: 'alpenglow-sunset',
    label: 'Alpenglow Twilight Sunset',
    shortLabel: 'Sunset (3°C)',
    icon: '🌅',
    tempC: 3,
    tempF: 37,
    condition: 'Alpenglow Twilight',
    wind: '18 km/h W',
    humidity: '50%',
    pressure: '682 hPa',
    visibility: 'Good (15 km)',
    snowLineElev: '3,700 m',
    skyColor: 0xd66d4f,
    fogColor: 0xc95e42,
    fogDensity: 0.013,
    sunColor: 0xff6622,
    sunIntensity: 3.0,
    sunPos: [42, 10, 16],
    hemiSky: 0x8a5578,
    hemiGround: 0x38201a,
    hemiIntensity: 0.65,
    ambientColor: 0x823b2c,
    ambientIntensity: 0.45,
    snowParticles: false,
    snowScale: 1.15,
    desc: 'Dramatic low-angle sunset casting crimson alpenglow across jagged peaks.'
  },
  {
    id: 'alpine-blizzard',
    label: 'Sub-Zero Alpine Blizzard',
    shortLabel: 'Blizzard (-8°C)',
    icon: '❄️',
    tempC: -8,
    tempF: 18,
    condition: 'Active Snow Squall',
    wind: '48 km/h N GUSTS',
    humidity: '88%',
    pressure: '660 hPa',
    visibility: 'Severe (<100 m)',
    snowLineElev: '2,600 m',
    skyColor: 0xd3dfe6,
    fogColor: 0xd3dfe6,
    fogDensity: 0.034,
    sunColor: 0xe2ecf4,
    sunIntensity: 1.1,
    sunPos: [20, 36, 18],
    hemiSky: 0xdbe7f0,
    hemiGround: 0x6e808e,
    hemiIntensity: 0.95,
    ambientColor: 0xd8e4ed,
    ambientIntensity: 0.75,
    snowParticles: true,
    snowScale: 2.3,
    desc: 'Howling sub-zero winds, swirling snow squalls, and deep snow accumulation down to the valley.'
  },
  {
    id: 'nocturnal-freeze',
    label: 'High-Altitude Arctic Night',
    shortLabel: 'Deep Freeze (-16°C)',
    icon: '🌌',
    tempC: -16,
    tempF: 3,
    condition: 'Permafrost Chill',
    wind: '32 km/h NE',
    humidity: '62%',
    pressure: '654 hPa',
    visibility: 'Clear Starlight (10 km)',
    snowLineElev: '2,400 m',
    skyColor: 0x09121d,
    fogColor: 0x0b1624,
    fogDensity: 0.015,
    sunColor: 0x5a7ca8,
    sunIntensity: 0.7,
    sunPos: [-20, 38, -15],
    hemiSky: 0x16283d,
    hemiGround: 0x0b1219,
    hemiIntensity: 0.4,
    ambientColor: 0x142030,
    ambientIntensity: 0.35,
    snowParticles: true,
    snowScale: 2.0,
    desc: 'Sub-zero Himalayan night with icy silvery moonlight and howling katabatic winds.'
  }
];

export default function TrailTopo3D({ currentTrail, audioMuted, onSelectTrail, isDashboard = false, onOpen3DMap }) {
  const mountRef = useRef(null);

  // Active Trail Identification
  const trailId = currentTrail?.id && TRAIL_CONFIGS[currentTrail.id] ? currentTrail.id : 'hampta-pass';
  const config = TRAIL_CONFIGS[trailId];

  // Progressive Loading State
  const [loadingProgress, setLoadingProgress] = useState(20);
  const [loadingStage, setLoadingStage] = useState("1. Sculpting Himalayan 3D Terrain Model...");
  const [isLoaded, setIsLoaded] = useState(false);

  // PRIMARY USER JOURNEY STATE
  const [journeyStep, setJourneyStep] = useState('landing');
  const [activeCheckpointIdx, setActiveCheckpointIdx] = useState(0);
  const [isLandingCardCollapsed, setIsLandingCardCollapsed] = useState(false);

  // Selected Checkpoint / Marker Information Card
  const [activeLocationCard, setActiveLocationCard] = useState(null);

  // Selected Terrain Information (from Raycaster Click)
  const [selectedPoint, setSelectedPoint] = useState(null);

  // ENVIRONMENT & TEMPERATURE CONTROL STATE
  const [selectedEnvId, setSelectedEnvId] = useState('crisp-autumn');
  const [tempOffset, setTempOffset] = useState(0);
  const [showEnvDetails, setShowEnvDetails] = useState(false);

  const activeEnv = ENVIRONMENT_PRESETS.find(e => e.id === selectedEnvId) || ENVIRONMENT_PRESETS[0];
  const displayTemp = activeEnv.tempC + tempOffset;

  // Layer Toggles
  const [layers, setLayers] = useState({
    trail: true,
    risk: false,
    snow: true,
    vegetation: true,
    markers: true
  });

  // Real-time FPS Monitoring
  const [fps, setFps] = useState(60);

  // Three.js References
  const three = useRef({
    scene: null,
    camera: null,
    renderer: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    terrainMesh: null,
    terrainGeo: null,
    snowColorsAttr: null,
    rockColorsAttr: null,
    baseSnowWeights: null,
    riskMesh: null,
    waterMesh: null,
    trailGroup: null,
    markersGroup: null,
    vegetationGroup: null,
    rocksGroup: null,
    landmarksGroup: null,
    selectionMarker: null,
    snowParticles: null,
    snowParticlesMesh: null,
    particleSpeeds: null,
    sunLight: null,
    hemiLight: null,
    ambientLight: null,
    
    // Smooth Orbit & Damped Physics
    camPhysics: {
      targetTheta: config.defaultCam.theta,
      currentTheta: config.defaultCam.theta,
      targetPhi: config.defaultCam.phi,
      currentPhi: config.defaultCam.phi,
      targetRadius: config.defaultCam.rad,
      currentRadius: config.defaultCam.rad,
      minRadius: 5,
      maxRadius: 62,
      targetLook: config.defaultCam.look.clone(),
      currentLook: config.defaultCam.look.clone(),
      damping: 0.08,
      isDragging: false,
      isPanning: false,
      prevMouse: { x: 0, y: 0 },
      touchStartDist: 0
    }
  });

  // 1. DYNAMIC PROCEDURAL ELEVATION MATHEMATICS FOR ALL 4 TRAILS
  const getElevation = (x, z, tId) => {
    if (tId === 'hampta-pass') {
      // Hampta Pass: Valley (z > 10) -> Balou (4 < z <= 10) -> Pass notch (z ~ -4.5) -> Spiti desert (z < -5)
      const passDistZ = Math.abs(z + 4.5);
      let h = Math.max(1.5, 17.8 - passDistZ * 0.72);
      const flankDist = Math.abs(x);
      if (z < 2 && z > -10) {
        h += Math.pow(Math.max(0, flankDist - 1.2), 1.5) * 1.8;
      }
      if (z > 8) {
        const riverDist = Math.abs(x - (-1.0 + Math.sin(z * 0.25) * 1.5));
        h -= Math.exp(-riverDist * 0.4) * 3.5;
      }
      const basinDist = Math.hypot(x - 0.5, z - 9.0);
      if (basinDist < 6.5) {
        const bWeight = Math.cos((basinDist / 6.5) * (Math.PI / 2));
        h = h * (1 - bWeight * 0.55) + 7.2 * (bWeight * 0.55);
      }
      if (z < -8) {
        const spitiRiverDist = Math.abs(x - (Math.sin(z * 0.2) * 2.0));
        h -= Math.exp(-spitiRiverDist * 0.3) * 2.2;
      }
      h += Math.sin(x * 0.42 + z * 0.28) * Math.cos(z * 0.38) * 1.4;
      h += Math.sin(x * 0.85 + 1.2) * Math.cos(z * 0.65) * 0.65;
      return Math.max(0.6, h);
    } 
    else if (tId === 'triund-ridge') {
      // Triund -> Indrahar Ridge: Triund shelf (z ~ 18), Laka couloir (z ~ 3.5), Indrahar knife arete (z ~ -14)
      let h = (20.0 - z) * 0.44;
      const ridgeDist = Math.hypot(x - 1.0, z + 14.0);
      const ridgeCone = Math.max(0, 1.0 - ridgeDist / 11.0);
      h += Math.pow(ridgeCone, 1.6) * 13.2;

      const arete = 1.0 - Math.min(1.0, Math.abs(x - 1.0 + Math.sin(z * 0.3) * 1.5) * 0.45);
      if (z < -3) h += Math.max(0, arete * 4.2);

      const triundShelf = Math.hypot(x, z - 18.0);
      if (triundShelf < 7.0) {
        const sw = Math.cos((triundShelf / 7.0) * (Math.PI / 2));
        h = h * (1 - sw * 0.65) + 3.2 * (sw * 0.65);
      }
      const lakaDist = Math.hypot(x + 1.5, z - 4.0);
      if (lakaDist < 5.0) {
        const bw = Math.cos((lakaDist / 5.0) * (Math.PI / 2));
        h -= bw * 1.8;
      }
      h += Math.sin(x * 0.45 + z * 0.25) * Math.cos(z * 0.4) * 1.4;
      h += Math.sin(x * 0.9 + 1.1) * Math.cos(z * 0.7) * 0.6;
      return Math.max(0.5, h);
    } 
    else if (tId === 'chandrashila-peak') {
      // Chandrashila: Chopta (z > 14), Tungnath Temple terrace (x = -1.5, z = 4.0), Moon Rock Summit horn (x = 2.5, z = -14.0)
      let h = (18 - z) * 0.38;
      const summitDist = Math.hypot(x - 2.5, z + 14.0);
      const summitCone = Math.max(0, 1.0 - summitDist / 12.0);
      h += Math.pow(summitCone, 1.5) * 11.5;

      const areteRidge = 1.0 - Math.min(1.0, Math.abs(x - 2.5 + Math.sin(z * 0.25) * 1.8) * 0.4);
      if (z < -4) h += Math.max(0, areteRidge * 3.5);

      const templeDist = Math.hypot(x + 1.5, z - 4.0);
      if (templeDist < 5.0) {
        const tw = Math.cos((templeDist / 5.0) * (Math.PI / 2));
        h = h * (1 - tw * 0.5) + 10.2 * (tw * 0.5);
      }
      h += Math.sin(x * 0.35 + z * 0.2) * Math.cos(z * 0.35) * 1.5;
      h += Math.sin(x * 0.7 + 1.2) * Math.cos(z * 0.6) * 0.7;
      return Math.max(0.6, h);
    } 
    else {
      // Kedarnath Ridge: Sacred Mandakini gorge (z > 12), Kedarnath temple terrace (z = 13), Chorabari glacier (z = 6), Colossal 6,940 m south wall
      let h = (18.0 - z) * 0.52;
      const wallDist = Math.hypot(x - 0.5, z + 13.0);
      const wallCone = Math.max(0, 1.0 - wallDist / 13.0);
      h += Math.pow(wallCone, 1.8) * 15.5;

      const templeBase = Math.hypot(x, z - 13.0);
      if (templeBase < 4.5) {
        const kw = Math.cos((templeBase / 4.5) * (Math.PI / 2));
        h = h * (1 - kw * 0.55) + 4.2 * (kw * 0.55);
      }
      const choraDist = Math.hypot(x + 1.2, z - 6.0);
      if (choraDist < 4.5) {
        h -= Math.cos((choraDist / 4.5) * (Math.PI / 2)) * 2.2;
      }
      h += Math.sin(x * 0.4 + z * 0.3) * Math.cos(z * 0.35) * 1.4;
      h += Math.sin(x * 0.8 + 1.0) * Math.cos(z * 0.6) * 0.6;
      return Math.max(0.5, h);
    }
  };

  // Re-build 3D WebGL Scene whenever active trail changes
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setIsLoaded(false);
    setLoadingProgress(25);
    setLoadingStage(`1. Generating 3D Terrain for ${config.name}...`);

    const t1 = setTimeout(() => {
      setLoadingProgress(55);
      setLoadingStage(`2. Building Authentic Landmarks & Checkpoints...`);
    }, 140);

    const t2 = setTimeout(() => {
      setLoadingProgress(85);
      setLoadingStage(`3. Instancing PBR Rock Materials & Atmospheric Shaders...`);
    }, 280);

    const t3 = setTimeout(() => {
      setLoadingProgress(100);
      setLoadingStage(`4. Ready to Explore.`);
      setTimeout(() => setIsLoaded(true), 180);
    }, 420);

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9db8c8);
    scene.fog = new THREE.FogExp2(0x9db8c8, 0.013);
    three.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 1200);
    camera.position.set(4.0, 16.0, 28.0);
    camera.lookAt(config.defaultCam.look);
    three.current.camera = camera;

    // Reset Camera Physics to active trail default
    three.current.camPhysics.targetTheta = config.defaultCam.theta;
    three.current.camPhysics.currentTheta = config.defaultCam.theta;
    three.current.camPhysics.targetPhi = config.defaultCam.phi;
    three.current.camPhysics.currentPhi = config.defaultCam.phi;
    three.current.camPhysics.targetRadius = config.defaultCam.rad;
    three.current.camPhysics.currentRadius = config.defaultCam.rad;
    three.current.camPhysics.targetLook.copy(config.defaultCam.look);
    three.current.camPhysics.currentLook.copy(config.defaultCam.look);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      powerPreference: 'high-performance',
      alpha: false 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    three.current.renderer = renderer;

    // 3. Natural Himalayan Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.48);
    scene.add(ambientLight);
    three.current.ambientLight = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xbad2e6, 0x364230, 0.72);
    scene.add(hemiLight);
    three.current.hemiLight = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xffdfba, 2.05);
    sunLight.position.set(26, 42, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    three.current.sunLight = sunLight;

    const { normalTex, roughTex } = createProceduralRockTextures();

    // 4. Procedural Terrain Geometry
    const terrainSize = 54;
    const segments = 140;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);
    three.current.terrainGeo = terrainGeo;

    const pos = terrainGeo.attributes.position;
    const vertexCount = pos.count;

    for (let i = 0; i < vertexCount; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, getElevation(x, z, trailId));
    }
    terrainGeo.computeVertexNormals();

    const normals = terrainGeo.attributes.normal;
    const snowColors = new Float32Array(vertexCount * 3);
    const rockColors = new Float32Array(vertexCount * 3);
    const riskColors = new Float32Array(vertexCount * 3);
    const snowWeights = new Float32Array(vertexCount);

    // 5. Authentic Vertex Coloring & Ecological Shading per Trail
    for (let i = 0; i < vertexCount; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const ny = normals.getY(i);

      let r = 0.28, g = 0.36, b = 0.22;
      let snowAmount = 0.0;

      if (trailId === 'hampta-pass') {
        // Hampta Pass: Lush green (z > 12) -> meadow (4 < z <= 12) -> grey rock (0 < z <= 4) -> dry ochre Spiti (z < -5)
        if (z > 12.0) {
          r = y < 5.0 ? 0.22 : 0.30; g = y < 5.0 ? 0.38 : 0.42; b = y < 5.0 ? 0.18 : 0.22;
        } else if (z > 4.0) {
          r = y < 9.0 ? 0.34 : 0.40; g = y < 9.0 ? 0.46 : 0.42; b = y < 9.0 ? 0.24 : 0.34;
        } else if (z > 0.0) {
          r = 0.36; g = 0.35; b = 0.34;
        } else if (z >= -5.0) {
          r = 0.28; g = 0.27; b = 0.28;
        } else {
          // Spiti desert tan / ochre
          const sf = Math.min(1.0, (-5.0 - z) / 8.0);
          r = r * (1 - sf) + 0.54 * sf;
          g = g * (1 - sf) + 0.42 * sf;
          b = b * (1 - sf) + 0.28 * sf;
        }
        const elevSnow = Math.min(1.0, Math.max(0, (y - 9.5) / 8.0));
        const slopeSnow = Math.min(1.0, Math.max(0, (ny - 0.52) / 0.34));
        snowAmount = Math.min(1.0, elevSnow * slopeSnow * 1.3);
        if (z < -8.0) snowAmount *= 0.2;
      } 
      else if (trailId === 'triund-ridge') {
        // Triund: Alpine meadow turf (y < 4.8) -> moraine (4.8 <= y < 10.5) -> Indrahar knife arete
        if (y < 4.8 && z > 10.0) {
          r = 0.32; g = 0.46; b = 0.24;
        } else if (y < 10.5) {
          r = 0.42; g = 0.40; b = 0.36;
        } else if (y < 15.0) {
          r = 0.35; g = 0.35; b = 0.35;
        } else {
          r = 0.26; g = 0.26; b = 0.27;
        }
        const elevSnow = Math.min(1.0, Math.max(0, (y - 8.5) / 8.5));
        const slopeSnow = Math.min(1.0, Math.max(0, (ny - 0.54) / 0.32));
        snowAmount = Math.min(1.0, elevSnow * slopeSnow * 1.25);
      } 
      else if (trailId === 'chandrashila-peak') {
        // Chandrashila: Bugyal turf -> flagstones -> Moon rock summit horn
        if (y < 4.5) {
          r = 0.32; g = 0.44; b = 0.24;
        } else if (y < 11.5) {
          r = 0.36; g = 0.35; b = 0.30;
        } else {
          r = 0.26; g = 0.25; b = 0.25;
        }
        const elevSnow = Math.min(1.0, Math.max(0, (y - 9.0) / 7.5));
        const slopeSnow = Math.min(1.0, Math.max(0, (ny - 0.55) / 0.32));
        snowAmount = Math.min(1.0, elevSnow * slopeSnow * 1.2);
      } 
      else {
        // Kedarnath: Slate gorge -> lateral moraine -> colossal glacial wall ice
        if (y < 5.0) {
          r = 0.34; g = 0.38; b = 0.30;
        } else if (y < 10.0) {
          r = 0.38; g = 0.37; b = 0.35;
        } else {
          r = 0.28; g = 0.28; b = 0.30;
        }
        const elevSnow = Math.min(1.0, Math.max(0, (y - 7.5) / 8.5));
        const slopeSnow = Math.min(1.0, Math.max(0, (ny - 0.48) / 0.36));
        snowAmount = Math.min(1.0, elevSnow * slopeSnow * 1.45);
      }

      rockColors[i * 3] = r;
      rockColors[i * 3 + 1] = g;
      rockColors[i * 3 + 2] = b;

      snowWeights[i] = snowAmount;

      let sr = r, sg = g, sb = b;
      if (snowAmount > 0.05) {
        sr = r * (1 - snowAmount) + 0.95 * snowAmount;
        sg = g * (1 - snowAmount) + 0.97 * snowAmount;
        sb = b * (1 - snowAmount) + 0.99 * snowAmount;
      }
      snowColors[i * 3] = sr;
      snowColors[i * 3 + 1] = sg;
      snowColors[i * 3 + 2] = sb;

      // Risk Heatmap colors (P0)
      const slopeAngleDeg = Math.acos(Math.min(1, Math.max(-1, ny))) * (180 / Math.PI);
      if (slopeAngleDeg > 46 || y > 16.5) {
        riskColors[i * 3] = 0.92; riskColors[i * 3 + 1] = 0.16; riskColors[i * 3 + 2] = 0.22;
      } else if (slopeAngleDeg > 32 || y > 12.0) {
        riskColors[i * 3] = 0.96; riskColors[i * 3 + 1] = 0.52; riskColors[i * 3 + 2] = 0.12;
      } else if (slopeAngleDeg > 18 || y > 6.0) {
        riskColors[i * 3] = 0.92; riskColors[i * 3 + 1] = 0.82; riskColors[i * 3 + 2] = 0.18;
      } else {
        riskColors[i * 3] = 0.18; riskColors[i * 3 + 1] = 0.78; riskColors[i * 3 + 2] = 0.36;
      }
    }

    three.current.baseSnowWeights = snowWeights;
    three.current.snowColorsAttr = new THREE.BufferAttribute(snowColors, 3);
    three.current.rockColorsAttr = new THREE.BufferAttribute(rockColors, 3);
    terrainGeo.setAttribute('color', three.current.snowColorsAttr);

    const terrainMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.12,
      normalMap: normalTex,
      roughnessMap: roughTex
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMaterial);
    terrainMesh.castShadow = true;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    three.current.terrainMesh = terrainMesh;

    // 6. Semi-Transparent Risk Heatmap Mesh Overlay
    const riskGeo = terrainGeo.clone();
    riskGeo.setAttribute('color', new THREE.BufferAttribute(riskColors, 3));
    const rPos = riskGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      rPos.setY(i, rPos.getY(i) + 0.08);
    }
    riskGeo.computeVertexNormals();

    const riskMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      transparent: true,
      opacity: 0.0,
      visible: false
    });
    const riskMesh = new THREE.Mesh(riskGeo, riskMaterial);
    scene.add(riskMesh);
    three.current.riskMesh = riskMesh;

    // 7. BUILD AUTHENTIC 3D LANDMARKS FOR EACH OF THE 4 TRAILS
    const landmarksGroup = new THREE.Group();

    if (trailId === 'hampta-pass') {
      // Rani Nallah River Stream Channel
      const riverPts = [
        new THREE.Vector3(0.0, getElevation(0.0, 1.0, trailId) + 0.1, 1.0),
        new THREE.Vector3(0.4, getElevation(0.4, 6.0, trailId) + 0.1, 6.0),
        new THREE.Vector3(0.2, getElevation(0.2, 10.0, trailId) + 0.1, 10.0),
        new THREE.Vector3(-1.0, getElevation(-1.0, 15.0, trailId) + 0.1, 15.0)
      ];
      const riverGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(riverPts), 50, 0.45, 6, false);
      const riverMesh = new THREE.Mesh(riverGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 }));
      landmarksGroup.add(riverMesh);

      // Balou Campsite Tents
      const tentGeo = new THREE.ConeGeometry(0.65, 0.7, 4);
      const tent1 = new THREE.Mesh(tentGeo, new THREE.MeshStandardMaterial({ color: 0xf97316 }));
      tent1.position.set(1.5, getElevation(1.5, 9.5, trailId) + 0.35, 9.5);
      landmarksGroup.add(tent1);

      // Hampta Pass Notch Cairn & Flags
      const cairn = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.85, 1.3, 8), new THREE.MeshStandardMaterial({ color: 0x48423c }));
      cairn.position.set(0.0, getElevation(0.0, -4.5, trailId) + 0.65, -4.5);
      landmarksGroup.add(cairn);
    }
    else if (trailId === 'triund-ridge') {
      // Triund Meadow Expedition Campsite Tents & Tea Stall Hut
      const tentGeo = new THREE.ConeGeometry(0.7, 0.75, 4);
      [
        { x: -1.8, z: 18.8, c: 0xf97316 },
        { x: -0.6, z: 19.4, c: 0x0284c7 },
        { x: 1.2, z: 18.5, c: 0xeab308 }
      ].forEach(tp => {
        const tent = new THREE.Mesh(tentGeo, new THREE.MeshStandardMaterial({ color: tp.c }));
        tent.position.set(tp.x, getElevation(tp.x, tp.z, trailId) + 0.38, tp.z);
        landmarksGroup.add(tent);
      });

      const hut = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.4), new THREE.MeshStandardMaterial({ color: 0x5a554e }));
      hut.position.set(-2.8, getElevation(-2.8, 17.4, trailId) + 0.5, 17.4);
      landmarksGroup.add(hut);

      // Indrahar Pass Crest Cairn & Trishul
      const cairn = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 1.3, 8), new THREE.MeshStandardMaterial({ color: 0x48423c }));
      cairn.position.set(1.0, getElevation(1.0, -14.0, trailId) + 0.65, -14.0);
      landmarksGroup.add(cairn);

      const trishul = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 6), new THREE.MeshStandardMaterial({ color: 0xe5a93c, metalness: 0.9 }));
      trishul.position.set(1.0, getElevation(1.0, -14.0, trailId) + 2.5, -14.0);
      landmarksGroup.add(trishul);
    }
    else if (trailId === 'chandrashila-peak') {
      // Tungnath Sacred Shiva Temple Complex (3,680 m)
      const templeStoneMat = new THREE.MeshStandardMaterial({ color: 0x6e6962, roughness: 0.95 });
      const templeOrigin = new THREE.Vector3(-1.5, getElevation(-1.5, 4.0, trailId), 4.0);

      const courtyard = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 4.2), new THREE.MeshStandardMaterial({ color: 0x5a554e }));
      courtyard.position.set(templeOrigin.x, templeOrigin.y + 0.12, templeOrigin.z);
      landmarksGroup.add(courtyard);

      const sanctum = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 1.6), templeStoneMat);
      sanctum.position.set(templeOrigin.x, templeOrigin.y + 0.8, templeOrigin.z - 0.4);
      landmarksGroup.add(sanctum);

      for (let tier = 0; tier < 4; tier++) {
        const tScale = 1.4 - tier * 0.28;
        const shikhara = new THREE.Mesh(new THREE.BoxGeometry(tScale, 0.55, tScale), templeStoneMat);
        shikhara.position.set(templeOrigin.x, templeOrigin.y + 1.5 + tier * 0.5, templeOrigin.z - 0.4);
        landmarksGroup.add(shikhara);
      }

      const kalasha = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 8), new THREE.MeshStandardMaterial({ color: 0xe5a93c, metalness: 0.8 }));
      kalasha.position.set(templeOrigin.x, templeOrigin.y + 4.15, templeOrigin.z - 0.4);
      landmarksGroup.add(kalasha);

      // Chandrashila Summit Apex Shrine
      const summitOrigin = new THREE.Vector3(2.5, getElevation(2.5, -14.0, trailId), -14.0);
      const summitCairn = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 1.1, 8), templeStoneMat);
      summitCairn.position.set(summitOrigin.x, summitOrigin.y + 0.55, summitOrigin.z);
      landmarksGroup.add(summitCairn);
    }
    else {
      // Kedarnath Holy Temple Settlement & Mandakini River
      const templeStoneMat = new THREE.MeshStandardMaterial({ color: 0x55504a, roughness: 0.95 });
      const kOrigin = new THREE.Vector3(0.0, getElevation(0.0, 13.0, trailId), 13.0);

      const kSanctum = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 2.2), templeStoneMat);
      kSanctum.position.set(kOrigin.x, kOrigin.y + 0.9, kOrigin.z);
      landmarksGroup.add(kSanctum);

      const kSpire = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 4), new THREE.MeshStandardMaterial({ color: 0x3d3833 }));
      kSpire.position.set(kOrigin.x, kOrigin.y + 2.8, kOrigin.z);
      kSpire.rotation.y = Math.PI / 4;
      landmarksGroup.add(kSpire);

      const mRiverPts = [
        new THREE.Vector3(-1.8, getElevation(-1.8, 8.0, trailId) + 0.1, 8.0),
        new THREE.Vector3(-1.4, getElevation(-1.4, 13.0, trailId) + 0.1, 13.0),
        new THREE.Vector3(-1.0, getElevation(-1.0, 18.0, trailId) + 0.1, 18.0)
      ];
      const mRiverGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mRiverPts), 40, 0.45, 6, false);
      const mRiver = new THREE.Mesh(mRiverGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 }));
      landmarksGroup.add(mRiver);
    }
    scene.add(landmarksGroup);
    three.current.landmarksGroup = landmarksGroup;

    // 8. Trekking Route Tube & Checkpoint Beacons
    const trailGroup = new THREE.Group();
    const trailPoints3D = config.checkpoints.map((cp, idx) => {
      const zVal = 18.0 - (idx / (config.checkpoints.length - 1)) * 32.0;
      const xVal = Math.sin(idx * 1.2) * 1.8;
      const yVal = getElevation(xVal, zVal, trailId) + 0.16;
      return new THREE.Vector3(xVal, yVal, zVal);
    });
    const trailCurve = new THREE.CatmullRomCurve3(trailPoints3D);
    const trailGeo = new THREE.TubeGeometry(trailCurve, 100, 0.16, 6, false);
    const trailMesh = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({ color: 0xe7a94b }));
    trailGroup.add(trailMesh);
    scene.add(trailGroup);
    three.current.trailGroup = trailGroup;

    // Interactive Checkpoint Beacons
    const markersGroup = new THREE.Group();
    config.checkpoints.forEach((cp, idx) => {
      const mSub = new THREE.Group();
      mSub.position.copy(trailPoints3D[idx]);
      mSub.userData = { isMarker: true, checkpointIdx: idx, checkpointData: cp };

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.55, 16),
        new THREE.MeshBasicMaterial({ color: idx === config.checkpoints.length - 1 ? 0xef4444 : 0x10b981, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.06;
      mSub.add(ring);

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshStandardMaterial({ 
          color: idx === config.checkpoints.length - 1 ? 0xef4444 : 0x10b981, 
          emissive: idx === config.checkpoints.length - 1 ? 0xef4444 : 0x10b981, 
          emissiveIntensity: 0.65 
        })
      );
      orb.position.y = 1.7;
      mSub.add(orb);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 1.7, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
      );
      beam.position.y = 0.85;
      mSub.add(beam);

      markersGroup.add(mSub);
    });
    scene.add(markersGroup);
    three.current.markersGroup = markersGroup;

    // 9. Instanced Himalayan Vegetation & Deodars
    const vegetationGroup = new THREE.Group();
    const treeGeoCone1 = new THREE.ConeGeometry(0.85, 2.0, 5);
    const treeGeoCone2 = new THREE.ConeGeometry(0.65, 1.5, 5);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x183d2b, roughness: 0.8 });
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.6, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });

    for (let t = 0; t < 24; t++) {
      const tx = (Math.random() - 0.5) * 30;
      const tz = 8.0 + Math.random() * 14.0;
      const ty = getElevation(tx, tz, trailId);

      if (ty < 7.2) {
        const treeObj = new THREE.Group();
        treeObj.position.set(tx, ty, tz);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat); trunk.position.y = 0.3; treeObj.add(trunk);
        const cone1 = new THREE.Mesh(treeGeoCone1, treeMat); cone1.position.y = 1.3; treeObj.add(cone1);
        const cone2 = new THREE.Mesh(treeGeoCone2, treeMat); cone2.position.y = 2.2; treeObj.add(cone2);
        vegetationGroup.add(treeObj);
      }
    }
    scene.add(vegetationGroup);
    three.current.vegetationGroup = vegetationGroup;

    // Selection Marker
    const selectionMarker = new THREE.Group();
    const pinRing = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.45, 24), new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide }));
    pinRing.rotation.x = -Math.PI / 2; selectionMarker.add(pinRing);
    const pinCone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 12), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    pinCone.rotation.x = Math.PI; pinCone.position.y = 0.5; selectionMarker.add(pinCone);
    selectionMarker.visible = false;
    scene.add(selectionMarker);
    three.current.selectionMarker = selectionMarker;

    // 9. Instanced Snow Particle System (Offline Canvas Texture & Procedural Flurries)
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 54;
      particlePos[i * 3 + 1] = Math.random() * 26 + 2;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 54;
      particleSpeeds[i] = 0.08 + Math.random() * 0.12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pGrad.addColorStop(0.5, 'rgba(235, 245, 255, 0.65)');
    pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 16, 16);
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.42,
      map: pTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const snowParticlesMesh = new THREE.Points(particleGeo, particleMat);
    snowParticlesMesh.visible = false;
    scene.add(snowParticlesMesh);
    three.current.snowParticlesMesh = snowParticlesMesh;
    three.current.particleSpeeds = particleSpeeds;

    // Apply active Himalayan microclimate and temperature
    applyEnvironment(activeEnv, tempOffset);

    // 10. Damped Controls & Raycaster
    const dom = renderer.domElement;
    const cp = three.current.camPhysics;

    const onMouseDown = (e) => {
      if (e.button === 0) { cp.isDragging = true; cp.isPanning = false; }
      else if (e.button === 2) { cp.isPanning = true; cp.isDragging = false; }
      cp.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!cp.isDragging && !cp.isPanning) return;
      const dx = e.clientX - cp.prevMouse.x;
      const dy = e.clientY - cp.prevMouse.y;
      cp.prevMouse = { x: e.clientX, y: e.clientY };

      if (cp.isDragging) {
        cp.targetTheta -= dx * 0.007;
        cp.targetPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cp.targetPhi - dy * 0.007));
      } else if (cp.isPanning) {
        const panSpeed = 0.035;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        cp.targetLook.addScaledVector(right, -dx * panSpeed);
        cp.targetLook.y += dy * panSpeed;
      }
    };

    const onMouseUp = () => { cp.isDragging = false; cp.isPanning = false; };
    const onWheel = (e) => {
      e.preventDefault();
      cp.targetRadius = Math.max(cp.minRadius, Math.min(cp.maxRadius, cp.targetRadius + e.deltaY * 0.03));
    };
    const onContextMenu = (e) => e.preventDefault();

    const onClick = (e) => {
      const rect = dom.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      three.current.raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

      // Check Marker Clicks
      const markerHits = three.current.raycaster.intersectObjects(markersGroup.children, true);
      if (markerHits.length > 0) {
        let hitM = markerHits[0].object;
        while (hitM.parent && !hitM.userData.isMarker) hitM = hitM.parent;
        if (hitM.userData.isMarker) {
          setActiveLocationCard(hitM.userData.checkpointData);
          setActiveCheckpointIdx(hitM.userData.checkpointIdx);
          return;
        }
      }

      // Check Terrain Click
      const terrainHits = three.current.raycaster.intersectObject(terrainMesh);
      if (terrainHits.length > 0) {
        const pt = terrainHits[0].point;
        selectionMarker.position.copy(pt);
        selectionMarker.position.y += 0.05;
        selectionMarker.visible = true;

        const elevMeters = Math.round(2800 + (pt.y / 20) * 1500);
        const normY = terrainHits[0].face ? terrainHits[0].face.normal.y : 0.8;
        const slopeDeg = Math.round(Math.acos(Math.min(1, Math.max(-1, normY))) * (180 / Math.PI));

        setSelectedPoint({
          x: pt.x.toFixed(1),
          z: pt.z.toFixed(1),
          elevation: `${elevMeters} m`,
          slope: `${slopeDeg}°`,
          zone: pt.z < -4.0 ? 'High Alpine Crest' : 'Valley Slope',
          riskScore: slopeDeg > 42 ? 78 : slopeDeg > 28 ? 52 : 24,
          riskLevel: slopeDeg > 42 ? 'High Fall Risk' : slopeDeg > 28 ? 'Moderate Incline' : 'Safe Slope'
        });
      }
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        cp.isDragging = true;
        cp.isPanning = false;
        cp.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        cp.isDragging = false;
        cp.isPanning = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        cp.touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && cp.isDragging) {
        const dx = e.touches[0].clientX - cp.prevMouse.x;
        const dy = e.touches[0].clientY - cp.prevMouse.y;
        cp.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        cp.targetTheta -= dx * 0.007;
        cp.targetPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cp.targetPhi - dy * 0.007));
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (cp.touchStartDist > 0) {
          const delta = dist - cp.touchStartDist;
          cp.targetRadius = Math.max(cp.minRadius, Math.min(cp.maxRadius, cp.targetRadius - delta * 0.04));
        }
        cp.touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      cp.isDragging = false;
      cp.isPanning = false;
      cp.touchStartDist = 0;
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);
    dom.addEventListener('click', onClick);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);

    // 11. Animation Loop with Camera Damping
    let animId;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      cp.currentTheta += (cp.targetTheta - cp.currentTheta) * cp.damping;
      cp.currentPhi += (cp.targetPhi - cp.currentPhi) * cp.damping;
      cp.currentRadius += (cp.targetRadius - cp.currentRadius) * cp.damping;
      cp.currentLook.lerp(cp.targetLook, cp.damping);

      const cx = cp.currentLook.x + cp.currentRadius * Math.sin(cp.currentPhi) * Math.sin(cp.currentTheta);
      const cy = cp.currentLook.y + cp.currentRadius * Math.cos(cp.currentPhi);
      const cz = cp.currentLook.z + cp.currentRadius * Math.sin(cp.currentPhi) * Math.cos(cp.currentTheta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(cp.currentLook);

      markersGroup.children.forEach((mObj, idx) => {
        const orb = mObj.children[1];
        if (orb) orb.position.y = 1.7 + Math.sin(time * 3 + idx) * 0.18;
      });

      // Animate Swirling Alpine Snow Particles when active
      if (three.current.snowParticlesMesh && three.current.snowParticlesMesh.visible) {
        const pArr = three.current.snowParticlesMesh.geometry.attributes.position.array;
        const speeds = three.current.particleSpeeds;
        for (let i = 0; i < 1000; i++) {
          pArr[i * 3 + 1] -= speeds[i];
          pArr[i * 3] += Math.sin(time + i) * 0.015 + 0.02;
          if (pArr[i * 3 + 1] < 0.5) {
            pArr[i * 3 + 1] = 26 + Math.random() * 4;
            pArr[i * 3] = (Math.random() - 0.5) * 54;
          }
        }
        three.current.snowParticlesMesh.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      terrainGeo.dispose();
      terrainMaterial.dispose();
      if (particleGeo) particleGeo.dispose();
      if (particleMat) particleMat.dispose();
      if (pTex) pTex.dispose();
    };
  }, [trailId]);

  // Dynamic Himalayan Microclimate & Temperature Transition Engine
  const applyEnvironment = (preset, customOffset = 0) => {
    if (!three.current.scene) return;
    const { scene, sunLight, hemiLight, ambientLight, terrainGeo, snowParticlesMesh, rockColorsAttr, baseSnowWeights } = three.current;

    if (scene) {
      scene.background.setHex(preset.skyColor);
      if (scene.fog) {
        scene.fog.color.setHex(preset.fogColor);
        scene.fog.density = preset.fogDensity;
      }
    }

    if (sunLight) {
      sunLight.color.setHex(preset.sunColor);
      sunLight.intensity = preset.sunIntensity;
      sunLight.position.set(preset.sunPos[0], preset.sunPos[1], preset.sunPos[2]);
    }

    if (hemiLight) {
      hemiLight.color.setHex(preset.hemiSky);
      hemiLight.groundColor.setHex(preset.hemiGround);
      hemiLight.intensity = preset.hemiIntensity;
    }

    if (ambientLight) {
      ambientLight.color.setHex(preset.ambientColor);
      ambientLight.intensity = preset.ambientIntensity;
    }

    // Toggle falling snow particles
    if (snowParticlesMesh) {
      snowParticlesMesh.visible = preset.snowParticles || (preset.tempC + customOffset <= -4);
    }

    // Dynamic Terrain Snow Cover based on temperature and snow scale
    if (terrainGeo && baseSnowWeights && rockColorsAttr && layers.snow) {
      const colAttr = terrainGeo.attributes.color;
      const baseRock = rockColorsAttr.array;
      const weights = baseSnowWeights;
      const count = colAttr.count;
      const arr = colAttr.array;

      const tempAdjustFactor = customOffset < 0 
        ? 1 + Math.abs(customOffset) * 0.05 
        : Math.max(0.15, 1 - customOffset * 0.04);
      const effectiveSnowScale = preset.snowScale * tempAdjustFactor;

      for (let i = 0; i < count; i++) {
        const sAmount = Math.min(1.0, Math.max(0, weights[i] * effectiveSnowScale));
        const br = baseRock[i * 3];
        const bg = baseRock[i * 3 + 1];
        const bb = baseRock[i * 3 + 2];
        if (sAmount > 0.02) {
          arr[i * 3] = br * (1 - sAmount) + 0.95 * sAmount;
          arr[i * 3 + 1] = bg * (1 - sAmount) + 0.97 * sAmount;
          arr[i * 3 + 2] = bb * (1 - sAmount) + 0.99 * sAmount;
        } else {
          arr[i * 3] = br;
          arr[i * 3 + 1] = bg;
          arr[i * 3 + 2] = bb;
        }
      }
      colAttr.needsUpdate = true;
    }
  };

  const handleEnvironmentChange = (envId) => {
    setSelectedEnvId(envId);
    setTempOffset(0);
    const targetPreset = ENVIRONMENT_PRESETS.find(e => e.id === envId) || ENVIRONMENT_PRESETS[0];
    applyEnvironment(targetPreset, 0);
    if (!audioMuted) {
      speakTrailWhisper(`Microclimate shifted to ${targetPreset.label}, temperature ${targetPreset.tempC > 0 ? '+' : ''}${targetPreset.tempC} degrees Celsius. ${targetPreset.desc}`, { chime: 'nature' });
    }
  };

  const handleNudgeTemp = (delta, reset = false) => {
    const nextOffset = reset ? 0 : Math.max(-20, Math.min(20, tempOffset + delta));
    setTempOffset(nextOffset);
    applyEnvironment(activeEnv, nextOffset);
  };

  // Handle Guided Trek Stage Navigation
  const goToStage = (cpIdx) => {
    const validIdx = Math.max(0, Math.min(config.checkpoints.length - 1, cpIdx));
    setActiveCheckpointIdx(validIdx);
    const cpData = config.checkpoints[validIdx];
    setActiveLocationCard(cpData);
    setJourneyStep('guided');

    const cp = three.current.camPhysics;
    if (cp) {
      const totalCps = config.checkpoints.length;
      const zVal = 18.0 - (validIdx / Math.max(1, totalCps - 1)) * 32.0;
      const xVal = Math.sin(validIdx * 1.2) * 1.8;
      const yVal = getElevation(xVal, zVal, trailId);

      cp.targetTheta = 0.32 - validIdx * 0.12;
      cp.targetPhi = 0.40;
      cp.targetRadius = 16.0;
      cp.targetLook.set(xVal, yVal + 1.2, zVal);
    }

    if (!audioMuted && cpData?.tip) {
      speakTrailWhisper(`${cpData.name}, elevation ${cpData.elev}. ${cpData.tip}`, { chime: 'nature' });
    }
  };

  // Handle Journey Steps & Focus
  const handleStepChange = (nextStep) => {
    setJourneyStep(nextStep);
    const cp = three.current.camPhysics;
    if (!cp) return;

    if (nextStep === 'landing' || nextStep === 'free') {
      setActiveLocationCard(null);
      cp.targetTheta = config.defaultCam.theta;
      cp.targetPhi = config.defaultCam.phi;
      cp.targetRadius = config.defaultCam.rad;
      cp.targetLook.copy(config.defaultCam.look);
    } else if (nextStep === 'overview' || nextStep === 'start') {
      goToStage(0);
    } else {
      const stepIdx = config.stages.findIndex(s => s.id === nextStep);
      const cpIdx = Math.min(config.checkpoints.length - 1, Math.max(0, stepIdx - 2));
      goToStage(cpIdx);
    }
  };

  const handleToggleLayer = (layerKey) => {
    const nextVal = !layers[layerKey];
    setLayers(prev => ({ ...prev, [layerKey]: nextVal }));

    const { riskMesh, trailGroup, terrainGeo, snowColorsAttr, rockColorsAttr, vegetationGroup, markersGroup } = three.current;
    if (layerKey === 'trail' && trailGroup) trailGroup.visible = nextVal;
    if (layerKey === 'risk' && riskMesh) { riskMesh.visible = nextVal; riskMesh.material.opacity = nextVal ? 0.65 : 0.0; }
    if (layerKey === 'snow' && terrainGeo) { 
      if (nextVal) {
        applyEnvironment(activeEnv, tempOffset);
      } else {
        terrainGeo.setAttribute('color', rockColorsAttr); 
        terrainGeo.attributes.color.needsUpdate = true; 
      }
    }
    if (layerKey === 'vegetation' && vegetationGroup) vegetationGroup.visible = nextVal;
    if (layerKey === 'markers' && markersGroup) markersGroup.visible = nextVal;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#C8DEC8] shadow-2xl bg-[#EAF3EC] text-[#1A2E22] flex flex-col select-none">
      
      {/* 1. TOP HEADER & DEDICATED 4-TRAIL SWITCHER PILL BAR */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none max-w-[calc(100%-24px)]">
        
        {/* Left Badge: Trail Name & Elevation */}
        <div className="bg-[#F2F8F4]/98 backdrop-blur-md border border-[#C8DEC8] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg pointer-events-auto shrink-0">
          <div className="p-1 rounded-lg bg-[#285943] text-emerald-100">
            <Mountain className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#1A2E22] uppercase tracking-wide">
                {config.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#DCEBDA] text-[#285943] font-bold border border-[#A8C8AF]">
                {config.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Center: 4-Trail Quick Switcher Pills (Always available!) */}
        <div className="flex items-center gap-1 bg-[#F2F8F4]/98 backdrop-blur-md border border-[#C8DEC8] px-1.5 py-1 rounded-full shadow-lg pointer-events-auto shrink-0">
          {TRAILS_DATA.slice(0, 4).map((t) => {
            const isActive = t.id === trailId;
            const icon = t.id === 'hampta-pass' ? '🌲' : t.id === 'triund-ridge' ? '🏕️' : t.id === 'chandrashila-peak' ? '🛕' : '❄️';
            return (
              <button
                key={t.id}
                onClick={() => onSelectTrail && onSelectTrail(t.id)}
                title={t.name}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#285943] text-[#FBF8EF] shadow-md font-extrabold'
                    : 'text-[#486350] hover:text-[#1A2E22] hover:bg-[#DCEBDA]/60'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{t.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Center-Right: Environment & Temperature Microclimate Dropdown */}
        <div className="relative pointer-events-auto shrink-0">
          <div className="bg-[#F2F8F4]/98 backdrop-blur-md border border-[#C8DEC8] px-2.5 py-1 rounded-xl flex items-center gap-2 shadow-lg">
            <div className={`p-1 rounded-lg flex items-center justify-center shrink-0 ${
              displayTemp <= 0 
                ? 'bg-sky-700 text-sky-100' 
                : displayTemp >= 20 
                ? 'bg-amber-600 text-amber-50' 
                : 'bg-[#285943] text-emerald-100'
            }`}>
              <Thermometer className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs font-mono font-black text-[#285943]">
                {displayTemp > 0 ? `+${displayTemp}` : displayTemp}°C
              </span>
              <span className="text-[10px] text-[#486350] font-mono hidden sm:inline">
                ({Math.round((displayTemp * 9/5) + 32)}°F)
              </span>
            </div>

            <div className="h-4 w-px bg-[#C8DEC8]" />

            <select
              value={selectedEnvId}
              onChange={(e) => handleEnvironmentChange(e.target.value)}
              aria-label="Change environment and temperature"
              className="bg-transparent text-xs font-black text-[#1A2E22] cursor-pointer outline-none border-0 py-0.5 pr-2 pl-0.5 hover:text-[#285943] focus:ring-0 max-w-[130px] sm:max-w-none"
            >
              {ENVIRONMENT_PRESETS.map((env) => (
                <option key={env.id} value={env.id} className="bg-[#F2F8F4] text-[#1A2E22] font-semibold py-1">
                  {env.icon} {env.label} ({env.tempC > 0 ? `+${env.tempC}` : env.tempC}°C)
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowEnvDetails(!showEnvDetails)}
              title="Toggle Microclimate Telemetry Details"
              className={`p-1 rounded-lg transition shrink-0 ${
                showEnvDetails ? 'bg-[#285943] text-white' : 'text-[#486350] hover:bg-[#DCEBDA] hover:text-[#1A2E22]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Microclimate Telemetry Popover Drawer */}
          {showEnvDetails && (
            <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-[#F2F8F4]/98 backdrop-blur-xl border border-[#C8DEC8] rounded-2xl p-3.5 sm:p-4 shadow-2xl z-40 animate-fadeIn text-[#1A2E22]">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#C8DEC8]">
                <div className="flex items-center gap-2">
                  <span className="text-base">{activeEnv.icon}</span>
                  <div>
                    <div className="text-xs font-black text-[#1A2E22]">{activeEnv.label}</div>
                    <div className="text-[10px] text-[#285943] font-bold">{activeEnv.condition}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnvDetails(false)}
                  className="text-xs text-[#486350] hover:text-[#1A2E22] p-1 rounded-md hover:bg-[#DCEBDA]"
                  title="Close microclimate details"
                >
                  ✕
                </button>
              </div>

              {/* Temperature Adjuster Stepper */}
              <div className="bg-[#E2EFE5] p-2.5 rounded-xl border border-[#C8DEC8] mb-3">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#486350]">Fine-Tune Temperature:</span>
                  <span className="font-mono font-black text-[#285943]">
                    {displayTemp > 0 ? `+${displayTemp}` : displayTemp}°C ({Math.round((displayTemp * 9/5) + 32)}°F)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleNudgeTemp(-3)}
                    className="flex-1 py-1 px-2 rounded-lg bg-[#F2F8F4] hover:bg-[#DCEBDA] text-xs font-bold text-[#285943] border border-[#C8DEC8] transition active:scale-95"
                  >
                    -3°C ❄️
                  </button>
                  <button
                    onClick={() => handleNudgeTemp(0, true)}
                    className="py-1 px-2.5 rounded-lg bg-[#F2F8F4] hover:bg-[#DCEBDA] text-xs font-mono font-bold text-[#486350] border border-[#C8DEC8] transition"
                    title="Reset to preset default"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleNudgeTemp(3)}
                    className="flex-1 py-1 px-2 rounded-lg bg-[#F2F8F4] hover:bg-[#DCEBDA] text-xs font-bold text-[#285943] border border-[#C8DEC8] transition active:scale-95"
                  >
                    +3°C ☀️
                  </button>
                </div>
              </div>

              {/* Atmospheric Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                <div className="bg-white/80 p-2 rounded-xl border border-[#C8DEC8]">
                  <div className="text-[9px] text-[#486350] uppercase font-bold">Wind & Direction</div>
                  <div className="font-mono font-bold text-[#1A2E22]">{activeEnv.wind}</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#C8DEC8]">
                  <div className="text-[9px] text-[#486350] uppercase font-bold">Relative Humidity</div>
                  <div className="font-mono font-bold text-[#1A2E22]">{activeEnv.humidity}</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#C8DEC8]">
                  <div className="text-[9px] text-[#486350] uppercase font-bold">Barometric Pressure</div>
                  <div className="font-mono font-bold text-[#1A2E22]">{activeEnv.pressure}</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#C8DEC8]">
                  <div className="text-[9px] text-[#486350] uppercase font-bold">Snowline Elevation</div>
                  <div className="font-mono font-bold text-[#285943]">{activeEnv.snowLineElev}</div>
                </div>
              </div>

              <div className="text-[10px] text-[#486350] leading-relaxed bg-[#EAF3EC] p-2 rounded-xl border border-[#C8DEC8]">
                💡 <strong>Microclimate Intel:</strong> {activeEnv.desc}
              </div>
            </div>
          )}
        </div>

        {/* Right Status: FPS & Reset Camera */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <div className="bg-[#F2F8F4]/98 backdrop-blur-md border border-[#C8DEC8] px-2.5 py-1.5 rounded-xl text-[11px] font-mono text-[#285943] font-bold flex items-center gap-1.5 shadow-md">
            <Activity className="w-3.5 h-3.5 text-[#285943]" />
            <span>{fps} FPS</span>
          </div>

          <button
            onClick={() => handleStepChange('landing')}
            title="Reset Camera View"
            className="bg-[#F2F8F4]/98 hover:bg-[#DCEBDA] backdrop-blur-md border border-[#C8DEC8] px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#285943] flex items-center gap-1 shadow-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Enlarge Button to Navigate to 3D Map Page */}
          {onOpen3DMap && (
            <button
              onClick={onOpen3DMap}
              title="Enlarge to Full 3D Map Page"
              className="bg-[#285943] hover:bg-[#1f4735] text-[#FBF8EF] border border-[#285943] px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#FBF8EF]" />
              <span className="hidden sm:inline">Enlarge Map</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN 3D WEBGL VIEWPORT */}
      <div className={`relative w-full ${isDashboard ? 'h-[440px] sm:h-[480px] lg:h-[500px]' : 'h-[520px] sm:h-[620px]'} bg-stone-900 cursor-grab active:cursor-grabbing`}>
        
        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-50 bg-[#EAF3EC]/98 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#DCEBDA] border border-[#285943]/30 flex items-center justify-center text-[#285943] mb-4 animate-bounce">
              <Mountain className="w-8 h-8" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#1A2E22] tracking-wider mb-2">
              Loading 3D Model: {config.name}...
            </h2>
            <p className="text-xs text-[#486350] max-w-md mb-4 font-mono font-medium">
              {loadingStage}
            </p>
            <div className="w-64 h-2.5 bg-[#D5E5D8] rounded-full overflow-hidden border border-[#B6D3BB]">
              <div 
                className="h-full bg-gradient-to-r from-[#285943] to-amber-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div ref={mountRef} className="w-full h-full" />

        {/* 3. STEPPING CARD OVERLAY (COLLAPSIBLE) */}
        {journeyStep === 'landing' && (
          <div className={`absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 pointer-events-none transition-all duration-300 ${
            isLandingCardCollapsed 
              ? 'bg-transparent' 
              : 'bg-gradient-to-t from-[#102218]/75 via-transparent to-transparent animate-fadeIn'
          }`}>
            {isLandingCardCollapsed ? (
              /* Minimized / Collapsed Compact Floating Pill */
              <button
                onClick={() => setIsLandingCardCollapsed(false)}
                title="Expand Trail Exploration Card"
                className="pointer-events-auto self-start bg-[#F2F8F4]/98 hover:bg-[#E2EFE5] backdrop-blur-xl border border-[#C8DEC8] rounded-2xl px-3.5 py-2 shadow-2xl flex items-center gap-2.5 text-xs font-bold text-[#1A2E22] transition-all duration-200 active:scale-95 group mb-1"
              >
                <span className="w-2 h-2 rounded-full bg-[#285943] animate-ping shrink-0" />
                <span className="font-extrabold">{config.name}</span>
                <span className="text-[10px] text-[#285943] bg-[#DCEBDA] px-2 py-0.5 rounded-full font-mono font-bold border border-[#A8C5A0]">
                  {config.badge}
                </span>
                <ChevronUp className="w-4 h-4 text-[#285943] group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            ) : (
              /* Expanded Card */
              <div className="max-w-md bg-[#F2F8F4]/98 backdrop-blur-xl border border-[#C8DEC8] rounded-2xl p-4 sm:p-5 shadow-2xl pointer-events-auto animate-fadeIn">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#285943] animate-ping" />
                    <span className="text-[10px] font-mono text-[#285943] font-bold tracking-wider uppercase">
                      Active 3D Terrain Model
                    </span>
                  </div>
                  {/* Collapse Button */}
                  <button
                    onClick={() => setIsLandingCardCollapsed(true)}
                    title="Collapse card"
                    className="p-1 rounded-lg text-[#486350] hover:text-[#1A2E22] hover:bg-[#DCEBDA] transition"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-[#1A2E22] mb-1.5 leading-tight">
                  {config.name}
                </h2>
                <p className="text-xs text-[#486350] leading-relaxed mb-4">
                  Explore the terrain, elevation shifts, checkpoints, and microclimates of {config.name}.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToStage(0)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#285943] hover:bg-[#1f4735] text-[#FBF8EF] font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
                  >
                    <span>Start Guided Exploration →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {onOpen3DMap && (
                    <button
                      onClick={onOpen3DMap}
                      title="Enlarge to Full 3D Map Page"
                      className="py-2.5 px-3 rounded-xl bg-[#E2EFE5] hover:bg-[#D4E8D8] text-[#285943] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#C8DEC8] transition shadow-sm active:scale-98"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Enlarge</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKPOINT INFORMATION MODAL */}
        {activeLocationCard && (
          <div className="absolute bottom-4 left-4 z-30 max-w-sm bg-[#F2F8F4]/98 backdrop-blur-xl border border-[#C8DEC8] rounded-2xl p-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#C8DEC8]">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#1A2E22]">
                <MapPin className="w-3.5 h-3.5 text-[#285943]" />
                <span className="truncate">{activeLocationCard.name}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#DCEBDA] text-[#285943] font-bold">
                  Stage {activeCheckpointIdx + 1}/{config.checkpoints.length}
                </span>
                <button 
                  onClick={() => {
                    setActiveLocationCard(null);
                    setJourneyStep('landing');
                  }} 
                  title="Close and return to overview"
                  className="text-[#486350] hover:text-[#1A2E22] text-xs font-bold p-1 hover:bg-[#DCEBDA] rounded-lg transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-[#1A2E22] mb-3">
              <div className="flex justify-between">
                <span className="text-[#486350]">Elevation:</span>
                <span className="font-bold text-[#285943] font-mono">{activeLocationCard.elev}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#486350]">Terrain Zone:</span>
                <span className="font-medium text-right text-[#1A2E22]">{activeLocationCard.zone || activeLocationCard.terrain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#486350]">Difficulty:</span>
                <span className="font-bold text-[#285943]">{activeLocationCard.difficulty}</span>
              </div>
              <div className="pt-1.5 text-[10px] text-[#285943] border-t border-[#C8DEC8] leading-relaxed">
                💡 <strong>Safety Tip:</strong> {activeLocationCard.tip}
              </div>

              {/* On-Device Neural Model Safety Classification */}
              {(() => {
                const evalResult = trailAI.query(`${activeLocationCard.name} ${activeLocationCard.tip} ${activeLocationCard.zone} ${activeLocationCard.difficulty}`);
                return (
                  <div className="pt-1.5 border-t border-[#C8DEC8] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 font-bold text-[#285943]">
                      <BrainCircuit className="w-3 h-3 text-[#285943]" />
                      <span>{evalResult.category.icon} {evalResult.category.name}</span>
                    </span>
                    <span className="font-mono text-[#486350] font-bold">
                      {evalResult.confidence}% AI Conf
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={activeCheckpointIdx === 0}
                onClick={() => goToStage(activeCheckpointIdx - 1)}
                className="py-1.5 px-2.5 rounded-lg border border-[#C8DEC8] bg-[#E2EFE5] hover:bg-[#DCEBDA] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-[#285943] transition flex items-center gap-1"
                title="Previous Checkpoint"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => {
                  if (activeCheckpointIdx < config.checkpoints.length - 1) {
                    goToStage(activeCheckpointIdx + 1);
                  } else {
                    handleStepChange('landing');
                  }
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#285943] hover:bg-[#1f4735] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <span>
                  {activeCheckpointIdx < config.checkpoints.length - 1 
                    ? `Next: ${config.checkpoints[activeCheckpointIdx + 1]?.name.split(' ')[0]} →` 
                    : 'Complete Trek 🏔️'}
                </span>
              </button>

              <button
                onClick={() => {
                  if (!audioMuted && activeLocationCard?.tip) {
                    speakTrailWhisper(`${activeLocationCard.name}. ${activeLocationCard.tip}`, { chime: 'nature' });
                  }
                }}
                title="Hear Audio Whisper"
                className="p-1.5 rounded-lg border border-[#C8DEC8] bg-[#E2EFE5] hover:bg-[#DCEBDA] text-[#285943] transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CLICK RAYCASTER INSPECTION MODAL */}
        {selectedPoint && !activeLocationCard && (
          <div className="absolute bottom-4 right-4 z-30 max-w-xs bg-[#F2F8F4]/98 backdrop-blur-xl border border-[#C8DEC8] rounded-2xl p-3.5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#C8DEC8]">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#1A2E22]">
                <MapPin className="w-3.5 h-3.5 text-[#285943]" />
                <span>Inspected Point</span>
              </div>
              <button onClick={() => setSelectedPoint(null)} className="text-[#486350] hover:text-[#1A2E22] text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-1 text-[11px] text-[#1A2E22]">
              <div className="flex justify-between">
                <span className="text-[#486350]">Elevation:</span>
                <span className="font-bold text-[#285943] font-mono">{selectedPoint.elevation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#486350]">Slope Angle:</span>
                <span className="font-bold font-mono">{selectedPoint.slope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#486350]">Risk Score:</span>
                <span className="font-bold text-red-700">{selectedPoint.riskScore} / 100</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Quick Controls HUD */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-[#F2F8F4]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#C8DEC8] shadow-lg text-[11px] font-bold">
          <button
            onClick={() => handleToggleLayer('risk')}
            className={`px-2.5 py-1 rounded-xl transition ${
              layers.risk ? 'bg-red-800 text-white' : 'bg-[#DCEBDA] text-[#285943]'
            }`}
          >
            {layers.risk ? 'Risk Heatmap ON' : 'Risk Layer'}
          </button>
          <button
            onClick={() => handleToggleLayer('snow')}
            className={`px-2.5 py-1 rounded-xl transition ${
              layers.snow ? 'bg-[#285943] text-white' : 'bg-[#DCEBDA] text-[#285943]'
            }`}
          >
            {layers.snow ? 'Snow ON' : 'Snow OFF'}
          </button>
          <button
            onClick={() => handleToggleLayer('trail')}
            className={`px-2.5 py-1 rounded-xl transition ${
              layers.trail ? 'bg-[#285943] text-white' : 'bg-[#DCEBDA] text-[#285943]'
            }`}
          >
            {layers.trail ? 'Trail ON' : 'Trail OFF'}
          </button>
        </div>

        {/* Bottom Help Tooltip */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 bg-[#F2F8F4]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C8DEC8] text-[10px] text-[#486350] font-medium shadow-md">
          <span>🖱️ Left Drag: Rotate</span>
          <span>•</span>
          <span>Scroll: Zoom</span>
          <span>•</span>
          <span>Right Drag: Pan</span>
          <span>•</span>
          <span>Click Checkpoints to Inspect</span>
        </div>
      </div>
    </div>
  );
}
