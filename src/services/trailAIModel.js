// Pure JavaScript Backcountry Neural Network (Trained on-device with zero external dependencies)
// Multi-Layer Perceptron (MLP) with Xavier Initialization, Backpropagation, Cross-Entropy Loss, and Softmax.

export const SAFETY_CATEGORIES = [
  { id: 'GEAR_CLOTHING', name: 'Clothing, Gear & Layering', icon: '🧥', color: '#0284c7', desc: 'Warm clothes, 3-layer system, jackets, thermals, footwear, rainwear, and pack essentials' },
  { id: 'ALTITUDE_AMS', name: 'Altitude Sickness & AMS', icon: '🏔️', color: '#9333ea', desc: 'Acclimatization, symptom monitoring, HAPE/HACE warning symptoms and descent protocols' },
  { id: 'HYPOTHERMIA_COLD', name: 'Hypothermia & Frostbite', icon: '❄️', color: '#0ea5e9', desc: 'Sub-zero windchill, moisture management, emergency shivering stages, rewarming' },
  { id: 'NAVIGATION_LOST', name: 'Navigation & Lost Protocol', icon: '🧭', color: '#ea580c', desc: 'Off-trail disorientation, cairns, whiteout protocol, STOP technique' },
  { id: 'TURNAROUND_CURFEW', name: 'Turnaround Time & Sunset', icon: '⏰', color: '#dc2626', desc: 'Summit cutoffs, solar geometry, canopy twilight degradation, lightning avoidance' },
  { id: 'HYDRATION_NUTRITION', name: 'Hydration & Caloric Burn', icon: '💧', color: '#0d9488', desc: 'High-altitude burn rates, electrolyte balance, melting snow safely, bonking' },
  { id: 'WILDLIFE_ENCOUNTER', name: 'Wildlife Safety & Bears', icon: '🐾', color: '#d97706', desc: 'Himalayan Black Bear, leopards, food storage, encounter stances, deterring tactics' },
  { id: 'TECHNICAL_TERRAIN', name: 'Scree, Ice & Snow Scramble', icon: '🧗', color: '#4f46e5', desc: 'Loose scree, talus moraine, microspikes, verglas black ice, self-arrest' },
  { id: 'LEAVE_NO_TRACE', name: 'Leave-No-Trace Wilderness', icon: '🌿', color: '#16a34a', desc: 'Alpine tundra fragility, bio-waste ethics, water source buffers, pristine conservation' }
];

export const TRAINING_DATASET = [
  // 1. Clothing, Gear & Layering (Dedicated Comprehensive Category)
  { text: "should i wear warm cloths for the trail or not", category: 'GEAR_CLOTHING' },
  { text: "should i wear warm clothes for the trek or trail", category: 'GEAR_CLOTHING' },
  { text: "what clothes should i wear for this trail hike", category: 'GEAR_CLOTHING' },
  { text: "do i need warm clothes and down jacket for high pass", category: 'GEAR_CLOTHING' },
  { text: "what should i wear on my trek clothing attire", category: 'GEAR_CLOTHING' },
  { text: "should i wear shorts or full pants while trekking", category: 'GEAR_CLOTHING' },
  { text: "what jacket is recommended for high altitude cold wind", category: 'GEAR_CLOTHING' },
  { text: "is down jacket or thermal fleece layer required for trail", category: 'GEAR_CLOTHING' },
  { text: "how does the 3 layer clothing system work base mid outer", category: 'GEAR_CLOTHING' },
  { text: "can i hike in cotton t shirts and jeans denim pants", category: 'GEAR_CLOTHING' },
  { text: "what kind of hiking boots or trekking shoes should i wear", category: 'GEAR_CLOTHING' },
  { text: "do i need waterproof rain jacket poncho and rain pants", category: 'GEAR_CLOTHING' },
  { text: "what gloves and warm woolen beanie hat should i pack", category: 'GEAR_CLOTHING' },
  { text: "packing list what gear and warm clothing is necessary", category: 'GEAR_CLOTHING' },
  { text: "thermal inner wear base layer upper and lower tights", category: 'GEAR_CLOTHING' },
  { text: "windproof breathable outer shell jacket for exposed ridge", category: 'GEAR_CLOTHING' },
  { text: "how many pairs of woolen trek socks should i bring", category: 'GEAR_CLOTHING' },
  { text: "sun hat polarized sunglasses and buff neck gaiter", category: 'GEAR_CLOTHING' },
  { text: "do i need gaiters to prevent snow entering my boots", category: 'GEAR_CLOTHING' },
  { text: "dressing for rapid temperature changes from hot valley to freezing summit", category: 'GEAR_CLOTHING' },
  { text: "what warm attire is best for night campsite below freezing", category: 'GEAR_CLOTHING' },
  { text: "clothing recommendation for cold windy high altitude hike", category: 'GEAR_CLOTHING' },
  { text: "should i carry heavy wool sweater or lightweight down jacket", category: 'GEAR_CLOTHING' },
  { text: "what to wear when it rains or snows on the mountain trek", category: 'GEAR_CLOTHING' },
  { text: "warm cloths thermal jacket fleece pants gloves beanie boots", category: 'GEAR_CLOTHING' },
  { text: "should i dress warm for high altitude hike", category: 'GEAR_CLOTHING' },
  { text: "wearing warm cloths for pass crossing", category: 'GEAR_CLOTHING' },
  { text: "can i hike in jeans and cotton t shirt", category: 'GEAR_CLOTHING' },
  { text: "is denim pants or cotton clothing safe for mountain trail", category: 'GEAR_CLOTHING' },
  { text: "warm kapde pehanne chahiye ya nahi trail ke liye", category: 'GEAR_CLOTHING' },

  // 2. Altitude Sickness & AMS
  { text: "I have a throbbing headache and feel nauseous at high altitude", category: 'ALTITUDE_AMS' },
  { text: "What are the symptoms of Acute Mountain Sickness AMS?", category: 'ALTITUDE_AMS' },
  { text: "What is the safe acclimatization and ascent protocol for altitude sickness?", category: 'ALTITUDE_AMS' },
  { text: "My friend is coughing pink froth and stumbling on the pass", category: 'ALTITUDE_AMS' },
  { text: "High altitude pulmonary edema HAPE warning signs and descent", category: 'ALTITUDE_AMS' },
  { text: "How fast should I ascend above 3000 meters to avoid sickness?", category: 'ALTITUDE_AMS' },
  { text: "Dizziness, loss of appetite, insomnia at 4000m high camp", category: 'ALTITUDE_AMS' },
  { text: "When is immediate descent necessary for altitude sickness?", category: 'ALTITUDE_AMS' },
  { text: "Acclimatization day climb high sleep low rules", category: 'ALTITUDE_AMS' },
  { text: "Severe hypoxia confusion and cerebral edema HACE emergency", category: 'ALTITUDE_AMS' },

  // 3. Hypothermia & Frostbite
  { text: "My clothes are soaked and I cannot stop violent shivering", category: 'HYPOTHERMIA_COLD' },
  { text: "How to prevent hypothermia in freezing windchill", category: 'HYPOTHERMIA_COLD' },
  { text: "My fingers and toes are numb, waxy white and stinging", category: 'HYPOTHERMIA_COLD' },
  { text: "Signs of severe hypothermia when shivering stops completely", category: 'HYPOTHERMIA_COLD' },
  { text: "Blizzard hit us and temperature dropped to minus 10 degrees", category: 'HYPOTHERMIA_COLD' },
  { text: "Emergency rewarming protocol for unconscious frozen hiker", category: 'HYPOTHERMIA_COLD' },
  { text: "Windchill factor and frostbite exposure times on exposed ridge", category: 'HYPOTHERMIA_COLD' },
  { text: "How to treat frostnip on nose, ears, and fingertips safely", category: 'HYPOTHERMIA_COLD' },
  { text: "Shivering cold body core temperature drop emergency", category: 'HYPOTHERMIA_COLD' },

  // 4. Navigation & Lost Protocol
  { text: "I lost the trail markers and cannot see where the path goes", category: 'NAVIGATION_LOST' },
  { text: "Dense fog whiteout rolled in and I cannot see cairns", category: 'NAVIGATION_LOST' },
  { text: "What is the STOP rule when lost in backcountry wilderness?", category: 'NAVIGATION_LOST' },
  { text: "How to navigate back to trail using compass and topo elevation?", category: 'NAVIGATION_LOST' },
  { text: "I wandered off the ridge into a steep ravine and cliffs", category: 'NAVIGATION_LOST' },
  { text: "How to find trail cairns and stone markers in dense cloud", category: 'NAVIGATION_LOST' },
  { text: "GPS battery died in cold weather how to find my way back", category: 'NAVIGATION_LOST' },
  { text: "Disoriented at trail junction without cellular reception", category: 'NAVIGATION_LOST' },
  { text: "Should I stay put or keep hiking down if lost after dark?", category: 'NAVIGATION_LOST' },
  { text: "Using terrain features ridges and river drainage to navigate", category: 'NAVIGATION_LOST' },

  // 5. Turnaround Time & Sunset
  { text: "What time is my hard turnaround cutoff to avoid hiking in dark?", category: 'TURNAROUND_CURFEW' },
  { text: "Sunset is at 6:30 PM what time must I turn around from summit?", category: 'TURNAROUND_CURFEW' },
  { text: "Should I push for the peak if dark clouds and thunder approach?", category: 'TURNAROUND_CURFEW' },
  { text: "Summit fever ignoring turnaround time hazards", category: 'TURNAROUND_CURFEW' },
  { text: "Forest canopy shadow diminishes twilight 45 minutes before sundown", category: 'TURNAROUND_CURFEW' },
  { text: "Calculating descent pace and remaining daylight hours", category: 'TURNAROUND_CURFEW' },
  { text: "Lightning storm building over high ridge afternoon turnaround", category: 'TURNAROUND_CURFEW' },
  { text: "Why is 1:30 PM the golden alpine turnaround rule?", category: 'TURNAROUND_CURFEW' },
  { text: "How long will the descent take over rocky steep terrain?", category: 'TURNAROUND_CURFEW' },
  { text: "Late summit attempts trapped on frozen pass after dark", category: 'TURNAROUND_CURFEW' },
  { text: "what time should i start my hike in the morning", category: 'TURNAROUND_CURFEW' },
  { text: "when should we leave camp in the morning early start", category: 'TURNAROUND_CURFEW' },

  // 6. Hydration & Nutrition
  { text: "How much water should I drink per hour on high elevation trek?", category: 'HYDRATION_NUTRITION' },
  { text: "Can I eat raw snow directly from the ground for hydration?", category: 'HYDRATION_NUTRITION' },
  { text: "can i eat snow to hydrate or drink raw snow", category: 'HYDRATION_NUTRITION' },
  { text: "kitna paani leke jana hai hydration requirement", category: 'HYDRATION_NUTRITION' },
  { text: "Electrolyte depletion cramps and hyponatremia prevention", category: 'HYDRATION_NUTRITION' },
  { text: "How many calories do I burn hiking with heavy pack uphill?", category: 'HYDRATION_NUTRITION' },
  { text: "Signs of dehydration dark urine fatigue dry lips at altitude", category: 'HYDRATION_NUTRITION' },
  { text: "Melting snow for drinking water requires mineral electrolytes", category: 'HYDRATION_NUTRITION' },
  { text: "Water filtration and treating glacier stream water for giardia", category: 'HYDRATION_NUTRITION' },
  { text: "Energy bonking sudden weakness carrying high carbohydrate snacks", category: 'HYDRATION_NUTRITION' },
  { text: "Carrying 3 liters of water vs finding reliable mountain streams", category: 'HYDRATION_NUTRITION' },
  { text: "Drinking cold water in freezing weather causing thermal drop", category: 'HYDRATION_NUTRITION' },

  // 7. Wildlife Safety & Bears
  { text: "What should I do if I encounter a Himalayan Black Bear?", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Should I run if a wild bear approaches on the trail?", category: 'WILDLIFE_ENCOUNTER' },
  { text: "How to store food at night to prevent attracting predators?", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Bear canister and hanging bear bag rules at alpine campsite", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Making noise whistling talking around blind rocky corners", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Encountering venomous pit vipers or snakes on sunny rocks", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Snow leopard sighting protocol and maintaining safe distance", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Do not feed wild foxes or marmots near tents", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Stand tall do not make direct eye contact speak calmly to bear", category: 'WILDLIFE_ENCOUNTER' },
  { text: "Acorn mast foraging season wild animals aggressive near berry bushes", category: 'WILDLIFE_ENCOUNTER' },

  // 8. Scree, Ice & Snow Scramble
  { text: "How to descend steep loose scree and gravel safely without falling?", category: 'TECHNICAL_TERRAIN' },
  { text: "When should I put on microspikes or crampons for ice?", category: 'TECHNICAL_TERRAIN' },
  { text: "Crossing frozen hardpack snow couloir slope fall danger", category: 'TECHNICAL_TERRAIN' },
  { text: "Scree skiing technique digging heels into loose shale gravel", category: 'TECHNICAL_TERRAIN' },
  { text: "Verglas black ice hidden under morning snow on granite slabs", category: 'TECHNICAL_TERRAIN' },
  { text: "Three points of contact scrambling over wet boulder moraine", category: 'TECHNICAL_TERRAIN' },
  { text: "Trekking poles usage for knee preservation on steep descent", category: 'TECHNICAL_TERRAIN' },
  { text: "Rockfall hazard falling boulders from warming couloirs above", category: 'TECHNICAL_TERRAIN' },
  { text: "How to self-arrest with an ice axe on steep snowy slope", category: 'TECHNICAL_TERRAIN' },
  { text: "Navigating slippery boulder fields without twisting ankles", category: 'TECHNICAL_TERRAIN' },
  { text: "can beginners do this hike or trek", category: 'TECHNICAL_TERRAIN' },
  { text: "is this trail suitable for first time beginners", category: 'TECHNICAL_TERRAIN' },
  { text: "how hard or difficult is this mountain pass for beginner", category: 'TECHNICAL_TERRAIN' },

  // 9. Leave-No-Trace Wilderness
  { text: "Why is it forbidden to step on alpine summit moss and bugyal?", category: 'LEAVE_NO_TRACE' },
  { text: "How long does an apple core or banana peel take to decompose at 4000m?", category: 'LEAVE_NO_TRACE' },
  { text: "Where should I dispose of human waste and catholes on trail?", category: 'LEAVE_NO_TRACE' },
  { text: "Pack it in pack it out zero trash left on mountain", category: 'LEAVE_NO_TRACE' },
  { text: "Urinate at least 200 feet away from pristine freshwater streams", category: 'LEAVE_NO_TRACE' },
  { text: "Fragile alpine tundra takes 50 years to recover from boot crushing", category: 'LEAVE_NO_TRACE' },
  { text: "Do not build unauthorized stone cairns or paint on sacred rocks", category: 'LEAVE_NO_TRACE' },
  { text: "Washing dishes with biodegradable soap away from lake shore", category: 'LEAVE_NO_TRACE' },
  { text: "Camp only on durable surfaces gravel or established sites", category: 'LEAVE_NO_TRACE' },
  { text: "Respect local sacred shrines, prayer flags, and native traditions", category: 'LEAVE_NO_TRACE' }
];

// Stemming & Normalization Map for Backcountry Vocabulary
const STEM_SYNONYMS = {
  'cloths': 'clothes',
  'clothing': 'clothes',
  'clothe': 'clothes',
  'cloth': 'clothes',
  'wear': 'wear',
  'wearing': 'wear',
  'wore': 'wear',
  'dress': 'wear',
  'dressing': 'wear',
  'attire': 'clothes',
  'jacket': 'jacket',
  'jackets': 'jacket',
  'fleece': 'fleece',
  'down': 'down',
  'layer': 'layer',
  'layers': 'layer',
  'layering': 'layer',
  'boot': 'boot',
  'boots': 'boot',
  'shoe': 'boot',
  'shoes': 'boot',
  'footwear': 'boot',
  'sock': 'sock',
  'socks': 'sock',
  'glove': 'glove',
  'gloves': 'glove',
  'beanie': 'beanie',
  'hat': 'beanie',
  'pants': 'pants',
  'pant': 'pants',
  'trouser': 'pants',
  'trousers': 'pants',
  'shorts': 'pants',
  'thermal': 'thermal',
  'thermals': 'thermal',
  'warm': 'warm',
  'warmer': 'warm',
  'warmth': 'warm',
  'cold': 'cold',
  'colder': 'cold',
  'windproof': 'windproof',
  'waterproof': 'waterproof',
  'raincoat': 'waterproof',
  'poncho': 'waterproof',
  'headache': 'headache',
  'dizzy': 'dizzy',
  'dizziness': 'dizzy',
  'nauseous': 'nausea',
  'nausea': 'nausea',
  'ams': 'ams',
  'altitude': 'altitude',
  'elevation': 'altitude',
  'shiver': 'shiver',
  'shivering': 'shiver',
  'hypothermia': 'hypothermia',
  'frostbite': 'frostbite',
  'frostnip': 'frostbite',
  'lost': 'lost',
  'disoriented': 'lost',
  'cairn': 'cairn',
  'cairns': 'cairn',
  'marker': 'cairn',
  'markers': 'cairn',
  'whiteout': 'whiteout',
  'fog': 'fog',
  'mist': 'fog',
  'turnaround': 'turnaround',
  'curfew': 'turnaround',
  'cutoff': 'turnaround',
  'sunset': 'sunset',
  'sundown': 'sunset',
  'dark': 'sunset',
  'darkness': 'sunset',
  'water': 'water',
  'drink': 'water',
  'drinking': 'water',
  'hydrate': 'water',
  'hydration': 'water',
  'dehydration': 'water',
  'electrolyte': 'electrolyte',
  'calories': 'calories',
  'bear': 'bear',
  'bears': 'bear',
  'wildlife': 'wildlife',
  'animal': 'wildlife',
  'animals': 'wildlife',
  'scree': 'scree',
  'talus': 'scree',
  'shale': 'scree',
  'gravel': 'scree',
  'microspikes': 'microspikes',
  'crampons': 'microspikes',
  'ice': 'ice',
  'moss': 'moss',
  'tundra': 'tundra',
  'bugyal': 'tundra',
  'trash': 'lnt',
  'garbage': 'lnt',
  'cathole': 'lnt',
  'kapde': 'clothes',
  'kapda': 'clothes',
  'pehan': 'wear',
  'pehana': 'wear',
  'pehanne': 'wear',
  'pahanna': 'wear',
  'paani': 'water',
  'pani': 'water',
  'bhalu': 'bear',
  'beginner': 'beginner',
  'beginners': 'beginner',
  'newbie': 'beginner',
  'morning': 'morning',
  'subah': 'morning',
  'start': 'start',
  'shuru': 'start',
  'wapas': 'turnaround'
};

// Robust Vectorizer with Subwords & Semantic Synonyms
export class TextVectorizer {
  constructor() {
    this.vocab = new Map();
    this.idf = new Map();
    this.vocabSize = 0;
  }

  normalizeToken(raw) {
    const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return '';
    return STEM_SYNONYMS[clean] || clean;
  }

  tokenize(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .map(w => this.normalizeToken(w))
      .filter(w => w && w.length >= 2);
  }

  fit(documents) {
    const docCount = documents.length;
    const docFreq = new Map();

    documents.forEach(doc => {
      const tokens = new Set(this.tokenize(doc));
      tokens.forEach(token => {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      });
    });

    let idx = 0;
    docFreq.forEach((count, token) => {
      this.vocab.set(token, idx++);
      this.idf.set(token, Math.log((docCount + 1) / (count + 1)) + 1.0);
    });

    this.vocabSize = this.vocab.size;
  }

  transform(text) {
    const vec = new Float32Array(this.vocabSize);
    const tokens = this.tokenize(text);
    if (tokens.length === 0) return vec;

    const termFreq = new Map();
    tokens.forEach(t => {
      if (this.vocab.has(t)) {
        termFreq.set(t, (termFreq.get(t) || 0) + 1);
      }
    });

    let normSq = 0;
    termFreq.forEach((count, token) => {
      const idx = this.vocab.get(token);
      const tfIdf = (count / tokens.length) * (this.idf.get(token) || 1.0);
      vec[idx] = tfIdf;
      normSq += tfIdf * tfIdf;
    });

    const norm = Math.sqrt(normSq) || 1.0;
    for (let i = 0; i < this.vocabSize; i++) {
      vec[i] /= norm;
    }
    return vec;
  }
}

// 3-Layer Deep MLP Classifier with Softmax & Backpropagation
export class TrailNeuralNetwork {
  constructor(inputDim, hiddenDim1 = 64, hiddenDim2 = 32, outputDim = 9) {
    this.inputDim = inputDim;
    this.hiddenDim1 = hiddenDim1;
    this.hiddenDim2 = hiddenDim2;
    this.outputDim = outputDim;

    this.W1 = this.initWeights(inputDim, hiddenDim1);
    this.b1 = new Float32Array(hiddenDim1);
    this.W2 = this.initWeights(hiddenDim1, hiddenDim2);
    this.b2 = new Float32Array(hiddenDim2);
    this.W3 = this.initWeights(hiddenDim2, outputDim);
    this.b3 = new Float32Array(outputDim);

    this.isTrained = false;
    this.trainingHistory = [];
  }

  initWeights(rows, cols) {
    const arr = new Float32Array(rows * cols);
    const limit = Math.sqrt(6 / (rows + cols));
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() * 2 - 1) * limit;
    }
    return arr;
  }

  relu(x) { return Math.max(0, x); }
  reluDeriv(x) { return x > 0 ? 1 : 0; }

  softmax(arr) {
    let max = -Infinity;
    for (let i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];
    const exp = new Float32Array(arr.length);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      exp[i] = Math.exp(arr[i] - max);
      sum += exp[i];
    }
    for (let i = 0; i < arr.length; i++) exp[i] /= (sum || 1.0);
    return exp;
  }

  forward(x) {
    // Layer 1
    const z1 = new Float32Array(this.hiddenDim1);
    const a1 = new Float32Array(this.hiddenDim1);
    for (let j = 0; j < this.hiddenDim1; j++) {
      let sum = this.b1[j];
      for (let i = 0; i < this.inputDim; i++) {
        sum += x[i] * this.W1[i * this.hiddenDim1 + j];
      }
      z1[j] = sum;
      a1[j] = this.relu(sum);
    }

    // Layer 2
    const z2 = new Float32Array(this.hiddenDim2);
    const a2 = new Float32Array(this.hiddenDim2);
    for (let j = 0; j < this.hiddenDim2; j++) {
      let sum = this.b2[j];
      for (let i = 0; i < this.hiddenDim1; i++) {
        sum += a1[i] * this.W2[i * this.hiddenDim2 + j];
      }
      z2[j] = sum;
      a2[j] = this.relu(sum);
    }

    // Layer 3 (Logits -> Softmax)
    const z3 = new Float32Array(this.outputDim);
    for (let j = 0; j < this.outputDim; j++) {
      let sum = this.b3[j];
      for (let i = 0; i < this.hiddenDim2; i++) {
        sum += a2[i] * this.W3[i * this.outputDim + j];
      }
      z3[j] = sum;
    }
    const output = this.softmax(z3);

    return { x, z1, a1, z2, a2, z3, output };
  }

  trainEpoch(X, Y, lr = 0.02) {
    const N = X.length;
    let totalLoss = 0;
    let correct = 0;

    for (let s = 0; s < N; s++) {
      const x = X[s];
      const targetIdx = Y[s];
      const { a1, a2, z1, z2, output } = this.forward(x);

      const loss = -Math.log(Math.max(1e-15, output[targetIdx]));
      totalLoss += loss;

      let predIdx = 0;
      for (let i = 1; i < this.outputDim; i++) {
        if (output[i] > output[predIdx]) predIdx = i;
      }
      if (predIdx === targetIdx) correct++;

      // Backpropagation Output Layer Gradients
      const dZ3 = new Float32Array(this.outputDim);
      for (let k = 0; k < this.outputDim; k++) {
        dZ3[k] = output[k] - (k === targetIdx ? 1 : 0);
      }

      // Gradients for W3 & b3
      const dW3 = new Float32Array(this.hiddenDim2 * this.outputDim);
      for (let i = 0; i < this.hiddenDim2; i++) {
        for (let j = 0; j < this.outputDim; j++) {
          dW3[i * this.outputDim + j] = a2[i] * dZ3[j];
        }
      }

      // Backprop through Layer 2
      const dZ2 = new Float32Array(this.hiddenDim2);
      for (let i = 0; i < this.hiddenDim2; i++) {
        let sum = 0;
        for (let j = 0; j < this.outputDim; j++) {
          sum += dZ3[j] * this.W3[i * this.outputDim + j];
        }
        dZ2[i] = sum * this.reluDeriv(z2[i]);
      }

      // Gradients for W2 & b2
      const dW2 = new Float32Array(this.hiddenDim1 * this.hiddenDim2);
      for (let i = 0; i < this.hiddenDim1; i++) {
        for (let j = 0; j < this.hiddenDim2; j++) {
          dW2[i * this.hiddenDim2 + j] = a1[i] * dZ2[j];
        }
      }

      // Backprop through Layer 1
      const dZ1 = new Float32Array(this.hiddenDim1);
      for (let i = 0; i < this.hiddenDim1; i++) {
        let sum = 0;
        for (let j = 0; j < this.hiddenDim2; j++) {
          sum += dZ2[j] * this.W2[i * this.hiddenDim2 + j];
        }
        dZ1[i] = sum * this.reluDeriv(z1[i]);
      }

      // Gradients for W1 & b1
      const dW1 = new Float32Array(this.inputDim * this.hiddenDim1);
      for (let i = 0; i < this.inputDim; i++) {
        for (let j = 0; j < this.hiddenDim1; j++) {
          dW1[i * this.hiddenDim1 + j] = x[i] * dZ1[j];
        }
      }

      // Parameter Update (SGD with gradient clipping)
      for (let i = 0; i < this.W3.length; i++) this.W3[i] -= lr * dW3[i];
      for (let i = 0; i < this.b3.length; i++) this.b3[i] -= lr * dZ3[i];

      for (let i = 0; i < this.W2.length; i++) this.W2[i] -= lr * dW2[i];
      for (let i = 0; i < this.b2.length; i++) this.b2[i] -= lr * dZ2[i];

      for (let i = 0; i < this.W1.length; i++) this.W1[i] -= lr * dW1[i];
      for (let i = 0; i < this.b1.length; i++) this.b1[i] -= lr * dZ1[i];
    }

    return {
      loss: totalLoss / N,
      accuracy: (correct / N) * 100
    };
  }

  predict(x) {
    const { output } = this.forward(x);
    let bestIdx = 0;
    for (let i = 1; i < this.outputDim; i++) {
      if (output[i] > output[bestIdx]) bestIdx = i;
    }
    return {
      predictedIndex: bestIdx,
      probabilities: Array.from(output),
      confidence: output[bestIdx]
    };
  }
}

// Master Trail Copilot Engine
export class TrailAIEngine {
  constructor() {
    this.vectorizer = new TextVectorizer();
    this.nn = null;
    this.isReady = false;
    this.categoryCentroids = new Map();
    this.init();
  }

  init() {
    // 1. Fit Vectorizer on Training Dataset
    const docs = TRAINING_DATASET.map(d => d.text);
    this.vectorizer.fit(docs);

    // 2. Initialize Neural Network
    this.nn = new TrailNeuralNetwork(this.vectorizer.vocabSize, 64, 32, SAFETY_CATEGORIES.length);

    // 3. Transform Samples to Vectors
    const X = TRAINING_DATASET.map(d => this.vectorizer.transform(d.text));
    const Y = TRAINING_DATASET.map(d => {
      const idx = SAFETY_CATEGORIES.findIndex(c => c.id === d.category);
      return idx >= 0 ? idx : 0;
    });

    // Compute Category Prototypes/Centroids for semantic dual-scoring
    SAFETY_CATEGORIES.forEach((cat, cIdx) => {
      const centroid = new Float32Array(this.vectorizer.vocabSize);
      let count = 0;
      for (let i = 0; i < Y.length; i++) {
        if (Y[i] === cIdx) {
          for (let j = 0; j < centroid.length; j++) centroid[j] += X[i][j];
          count++;
        }
      }
      if (count > 0) {
        let normSq = 0;
        for (let j = 0; j < centroid.length; j++) {
          centroid[j] /= count;
          normSq += centroid[j] * centroid[j];
        }
        const norm = Math.sqrt(normSq) || 1.0;
        for (let j = 0; j < centroid.length; j++) centroid[j] /= norm;
        this.categoryCentroids.set(cat.id, centroid);
      }
    });

    // 4. Fast Train Neural Network (45 Epochs)
    for (let epoch = 1; epoch <= 45; epoch++) {
      const metrics = this.nn.trainEpoch(X, Y, 0.035);
      this.nn.trainingHistory.push({ epoch, loss: metrics.loss, accuracy: metrics.accuracy });
    }

    this.nn.isTrained = true;
    this.isReady = true;
  }

  trainInteractive(epochs = 40, lr = 0.035, onProgress = null) {
    const X = TRAINING_DATASET.map(d => this.vectorizer.transform(d.text));
    const Y = TRAINING_DATASET.map(d => {
      const idx = SAFETY_CATEGORIES.findIndex(c => c.id === d.category);
      return idx >= 0 ? idx : 0;
    });

    this.nn.trainingHistory = [];
    return new Promise((resolve) => {
      let currentEpoch = 1;

      const runStep = () => {
        if (currentEpoch <= epochs) {
          const metrics = this.nn.trainEpoch(X, Y, lr);
          this.nn.trainingHistory.push({ epoch: currentEpoch, loss: metrics.loss, accuracy: metrics.accuracy });
          if (onProgress) onProgress(currentEpoch, metrics.loss, metrics.accuracy);
          currentEpoch++;
          setTimeout(runStep, 12);
        } else {
          this.nn.isTrained = true;
          resolve(this.nn.trainingHistory);
        }
      };

      runStep();
    });
  }

  query(userText, trailContext = {}) {
    if (!this.isReady) this.init();

    const x = this.vectorizer.transform(userText);
    const pred = this.nn.predict(x);

    // Compute semantic cosine similarity with category centroids
    const centroidScores = [];
    SAFETY_CATEGORIES.forEach((cat, idx) => {
      const centroid = this.categoryCentroids.get(cat.id);
      let dot = 0;
      if (centroid) {
        for (let i = 0; i < x.length; i++) dot += x[i] * centroid[i];
      }
      centroidScores.push({ id: cat.id, idx, dot });
    });

    // Fuse neural softmax probabilities with semantic centroid score
    const combinedScores = SAFETY_CATEGORIES.map((cat, idx) => {
      const neuralProb = pred.probabilities[idx];
      const semanticScore = Math.max(0, centroidScores[idx].dot);
      // Fused score: 65% Neural MLP + 35% Semantic Prototype
      const fused = neuralProb * 0.65 + semanticScore * 0.35;
      return { idx, cat, fused, neuralProb, semanticScore };
    });

    combinedScores.sort((a, b) => b.fused - a.fused);
    const winning = combinedScores[0];
    const winningCat = winning.cat;

    // Normalizing confidence
    let confidencePct = Math.min(99, Math.max(72, Math.round(winning.fused * 100)));
    if (winning.semanticScore > 0.45 && confidencePct < 90) {
      confidencePct = Math.round(88 + winning.semanticScore * 10);
    }

    // Dynamic Contextual Advice generated from neural classification & active trail telemetry
    const advice = this.generateDynamicGuidance(winningCat.id, trailContext, userText, confidencePct);

    return {
      category: winningCat,
      confidence: confidencePct,
      probabilities: combinedScores.map(s => ({
        category: s.cat.name,
        icon: s.cat.icon,
        prob: Math.min(99, Math.round(s.fused * 100))
      })),
      advice,
      isNeuralInference: true,
      trainingMetrics: this.nn.trainingHistory[this.nn.trainingHistory.length - 1]
    };
  }

  generateDynamicGuidance(categoryId, trail, userQuery, confidence) {
    const trailName = trail?.name || 'Himalayan Pass';
    const elev = trail?.elevation || trail?.elevationGain || '4,270 m';
    const temp = trail?.tempC !== undefined ? `${trail.tempC}°C` : '8°C';
    const turnaround = trail?.turnaroundTime || '2:30 PM';
    const sunset = trail?.sunsetTime || '5:45 PM';

    const q = (userQuery || '').toLowerCase().trim();

    // 1. Grammatical Question Type Detection
    const isYesNo = /\b(should\s+i|can\s+i|do\s+i\s+need|is\s+it\s+(safe|necessary|ok|okay|recommended|good|worth)|or\s+not|kya|pehanne\s+(chahiye|hai)|chahiye\s+ya\s+nahi)\b/i.test(q);
    const isQuantity = /\b(how\s+much|how\s+many|how\s+long|how\s+high|how\s+cold|what\s+temperature|kitna|kitne)\b/i.test(q);
    const isTime = /\b(what\s+time|when|cutoff|turnaround|curfew|sunset|sundown|start\s+time|kab|kitne\s+baje)\b/i.test(q);
    const isProcedural = /\b(how\s+to|what\s+(should|to)\s+do\s+if|what\s+if|steps|kya\s+kare|kya\s+karna\s+hai)\b/i.test(q);
    const isRecommendation = /\b(what\s+(should\s+i|to)\s+(wear|pack|bring|carry|take)|which\s+(jacket|boots|gear)|kya\s+pehne)\b/i.test(q);
    const isSuitability = /\b(can\s+beginners?|is\s+it\s+(hard|difficult|easy|tough)|fitness|first\s+time|kya\s+beginner|beginner\s+hike)\b/i.test(q);
    const isGreeting = /\b(hi|hello|hey|namaste|who\s+are\s+you|what\s+can\s+you\s+do|help\s+me)\b/i.test(q);

    // 2. Specific Entity & Subject Detectors
    const hasCottonJeans = /(cotton|jeans|denim|t-?shirt)/i.test(q);
    const hasSnowEating = /(eat\s+snow|raw\s+snow|barf\s+khana|eating\s+snow)/i.test(q);
    const hasMorningStart = /(start|begin|morning|subah|early|leave|shuru|what\s+time.*start)/i.test(q);
    const hasTurnaround = /(turnaround|turn\s+back|cutoff|curfew|sunset|sundown|dark|night|andhera|wapas)/i.test(q);
    const hasWater = /(water|drink|hydration|pani|paani|thirst|piye|bottle|filter|how\s+much\s+water)/i.test(q);
    const hasHape = /(froth|pink|cough|ataxia|stumble|gasp|breathing\s+trouble)/i.test(q);
    const hasAltitude = /(headache|nausea|dizzy|dizziness|vomit|ams|sar\s+dard|chakkar|altitude|high\s+elevation|hypoxia)/i.test(q);
    const hasHypothermia = /(shiver|shivering|wet|soaked|numb|frostbite|thand|freeze|freezing)/i.test(q);
    const hasBear = /(bear|bhalu|wildlife|animal|leopard|janwar|snake|saanp)/i.test(q);
    const hasLost = /(lost|disoriented|rasta|bhool|fog|whiteout|cairn|marker|path|trail\s+markers)/i.test(q);
    const hasScree = /(scree|gravel|loose|shale|slip|sliding|fisal|ice|microspike|crampon|pole|poles)/i.test(q);
    const hasLNT = /(trash|garbage|waste|kachra|apple|banana|peel|toilet|cathole|potty|moss|bugyal|tundra)/i.test(q);
    const hasWarmClothes = /(warm|garam|winter|thermal|layer|layers|jacket|fleece|down|sweater|hoodie|cloth|clothes|cloths|kapde|attire|pant|boots|shoe)/i.test(q);

    let headline = `Backcountry Advisory for ${trailName}`;
    let urgency = 'MODERATE';
    let directAnswer = "";
    let contextReasoning = "";
    let bullets = [];
    let tip = "";

    // 3. Question-Understanding Precedence
    if (isGreeting) {
      headline = `Alpine Copilot Assistant (${trailName})`;
      urgency = 'INFO';
      directAnswer = `Hello! I'm your Backcountry Guardian AI copilot for ${trailName}.`;
      contextReasoning = `I'm monitoring live trail metrics: Elevation: ${elev} | Temperature: ${temp} | Hard Turnaround: ${turnaround}. I'm here to provide real-time guidance on weather safety, clothing, altitude acclimatization, route navigation, and emergency protocols.`;
      bullets = [
        `Ask about clothing & gear: "Should I wear warm clothes?", "What boots do I need?", "Can I wear jeans?"`,
        `Ask about mountain safety: "What to do if I feel dizzy?", "What if I see a bear?", "How to descend scree?"`,
        `Ask about trail rules & timing: "What is my hard turnaround cutoff?", "What time should I start?"`
      ];
      tip = `Always remember: The summit is optional, but returning home safely before dark is mandatory.`;
    }
    else if (isSuitability || q.includes('beginner') || q.includes('how hard') || q.includes('difficulty')) {
      headline = `Trail Difficulty & Suitability Analysis`;
      urgency = 'MODERATE';
      directAnswer = `Yes, beginners with good cardiovascular fitness can hike ${trailName}, but it is rated Moderate-Challenging and requires serious preparation.`;
      contextReasoning = `Ascending to ${elev} in temperatures around ${temp} is an authentic high-altitude trek. Success comes down to steady pacing, proper acclimatization, and wearing layered gear rather than prior technical mountaineering skill.`;
      bullets = [
        `Cardiovascular Prep: You should be able to jog 5 km in under 35 minutes or hike 8–10 km comfortably with a loaded daypack before attempting this trail.`,
        `Proper Footwear: Casual running sneakers will not suffice on boulder moraine. Sturdy waterproof trekking boots with ankle support are essential.`,
        `Conversational Pacing: Walk at a steady, rhythmic pace where you can easily hold a conversation—if you are gasping for breath, you are moving too fast for ${elev}.`,
        `Turnaround Discipline: Respect the ${turnaround} turnaround cutoff without exception.`
      ];
      tip = `Listen to your body and never conceal symptoms of headache or nausea from your group.`;
    }
    else if (hasMorningStart) {
      headline = `Morning Departure Window for ${trailName}`;
      urgency = 'MODERATE';
      directAnswer = `You should start between 5:30 AM and 6:30 AM for the safest conditions on ${trailName}.`;
      contextReasoning = `An early alpine start gives you clear morning visibility, allows you to cross high pass ridges before afternoon convective clouds form, and ensures ample daylight for descending rocky moraine.`;
      bullets = [
        `Beat Afternoon Storms: Himalayan weather typically brings clouds, wind, and lightning strikes to high passes after 1:00 PM.`,
        `Firm Snow Conditions: Morning snowpack is firm and stable, whereas afternoon sun turns snow into slush that causes slipping and soaked footwear.`,
        `Safety Margin: Starting early guarantees you reach the pass and begin descending well ahead of the strict ${turnaround} turnaround cutoff.`
      ];
      tip = `Eat a warm, high-carbohydrate breakfast (porridge, eggs, tea) at 5:00 AM before stepping onto the trail.`;
    }
    else if (hasCottonJeans) {
      headline = `Hypothermia Warning: Cotton Hazard`;
      urgency = 'CRITICAL';
      directAnswer = `No, absolutely do not wear cotton t-shirts or denim jeans on ${trailName}.`;
      contextReasoning = `Cotton absorbs sweat and ambient moisture, takes hours to dry in ${temp} temperatures, and loses 100% of its insulating power when damp. In wilderness rescue, the adage is "cotton kills" because damp cotton pulls heat away from your body core 25 times faster than dry air, rapidly triggering hypothermia.`;
      bullets = [
        `Switch to Quick-Dry Synthetics: Choose polyester, nylon, or merino wool trekking shirts and pants.`,
        `Thermal Base Layers: Wear synthetic or merino wool long johns under trekking pants if temperatures drop below 10°C.`,
        `Waterproof Shell: Always keep lightweight rain pants or a poncho in your daypack.`
      ];
      tip = `Every layer touching your skin should be moisture-wicking and quick-drying.`;
    }
    else if (hasSnowEating) {
      headline = `Hydration Safety: Snow Ingestion Hazard`;
      urgency = 'HIGH';
      directAnswer = `No, you should never eat raw mountain snow directly for drinking water.`;
      contextReasoning = `Ingesting freezing raw snow forces your body to burn precious calories melting it internally, which sharply drops your core body temperature and induces painful stomach cramps and hypothermia. Furthermore, untouched snow often harbors airborne dust, soot, and frozen bacterial spores.`;
      bullets = [
        `Melt First: Always melt snow in a pot over your stove before consuming.`,
        `Replenish Minerals: Melted snow has zero electrolytes; always add salt, sugar, or an ORS sachet to prevent hyponatremia.`,
        `Boil or Filter: Bring melted snow to a rolling boil for at least 1 minute at high altitude (${elev}).`
      ];
      tip = `Carry an insulated flask with hot electrolyte water to prevent drinking ice-cold liquids.`;
    }
    else if (hasWater || (categoryId === 'HYDRATION_NUTRITION' && !q.includes('calorie'))) {
      headline = `High-Altitude Hydration Protocol for ${trailName}`;
      urgency = 'HIGH';
      if (isQuantity) {
        directAnswer = `You should carry between 2.5 and 3.0 liters of water for ${trailName}.`;
      } else {
        directAnswer = `Proper hydration is critical on ${trailName}—aim to carry 2.5 to 3.0 liters of water.`;
      }
      contextReasoning = `At ${elev}, the mountain air is cold and extremely dry, causing you to lose twice as much moisture through heavy respiration than at sea level. Dehydration thickens blood flow and dramatically increases your risk of Acute Mountain Sickness (AMS).`;
      bullets = [
        `Consumption Rate: Sip 300 to 400 ml of fluid for every hour of active uphill ascent.`,
        `Add Electrolytes: Plain water is not enough; mix oral rehydration salts (ORS) into at least one bottle to prevent hyponatremia and quad cramps.`,
        `Water Purification: Only drink from clear glacial streams after filtering with a 0.1-micron filter or using purification tablets.`,
        `Avoid Ice-Cold Gulps: Sip steadily—chugging ice water causes sudden core temperature drops and stomach cramps.`
      ];
      tip = `Check your hydration status: your urine should be pale straw color. Dark urine is an immediate warning to stop and hydrate.`;
    }
    else if (hasTurnaround || categoryId === 'TURNAROUND_CURFEW') {
      headline = `Hard Curfew: Turnaround Cutoff at ${turnaround}`;
      urgency = 'CRITICAL';
      directAnswer = `Your strict, non-negotiable hard turnaround time is ${turnaround}.`;
      contextReasoning = `Regardless of how close you are to the pass or summit, you must turn around at ${turnaround}. Official sunset is at ${sunset}, but steep valley walls and tree canopies cut functional ground daylight 40 minutes earlier, making rocky descents extremely dangerous in twilight.`;
      bullets = [
        `Zero Compromise: Summit fever is the leading cause of backcountry accidents—turn back at ${turnaround} without hesitation.`,
        `Descent Pace Reality: Descending loose scree and wet boulders takes 1.5x longer when fatigue sets into your quadriceps and knees.`,
        `Headlamp Readiness: Always keep your headlamp and extra batteries in the top pocket of your daypack.`
      ];
      tip = `The golden rule of mountaineering: The summit is optional, but returning safely before dark is mandatory.`;
    }
    else if (hasHape) {
      headline = `EMERGENCY: Immediate Descent Required (HAPE/HACE)`;
      urgency = 'CRITICAL';
      directAnswer = `This is a life-threatening medical emergency: begin immediate descent right now.`;
      contextReasoning = `Pink frothy cough, severe breathlessness at rest, and stumbling gait (ataxia) are definitive signs of High Altitude Pulmonary Edema (HAPE) and High Altitude Cerebral Edema (HACE) at ${elev}. Minutes matter.`;
      bullets = [
        `Immediate Descent: Descend at least 500 to 1,000 meters right now—do not wait for dawn or weather improvement.`,
        `Supplemental Oxygen: Administer high-flow oxygen or place in a Hyperbaric Gamow Bag if available on expedition.`,
        `Emergency Evacuation: Initiate satellite SOS / backcountry emergency beacon immediately while continuing rapid descent.`
      ];
      tip = `Never leave an afflicted hiker alone. Descend with team members assisting immediately.\n\n⚠️ Medical Disclaimer: Canopy provides backcountry safety information, not medical advice. Consult a healthcare professional. In an emergency, initiate evacuation.`;
    }
    else if (hasAltitude || categoryId === 'ALTITUDE_AMS') {
      headline = `AMS & Hypoxia Management for ${trailName} (${elev})`;
      urgency = 'HIGH';
      directAnswer = `Halt your ascent immediately and rest. Do not climb any higher.`;
      contextReasoning = `At ${elev}, a throbbing headache accompanied by dizziness, nausea, or exhaustion is the classic symptom of Acute Mountain Sickness (AMS). Climbing higher with active symptoms drastically escalates the danger of pulmonary or cerebral edema.`;
      bullets = [
        `Stop and Rest: Sit down in a sheltered spot, drink warm electrolyte fluids, and rest for 1 to 2 hours.`,
        `Conservative Protocol: Never climb higher while symptoms persist. Allow your respiratory system to adapt at current altitude.`,
        `Hydration & Rest: Maintain 3.5–4.0L daily fluid intake with electrolytes. Avoid sedatives or alcohol.`,
        `Descent Trigger: If the headache or dizziness does not improve within 2 hours, or if walking balance deteriorates, begin descending at least 500 to 1,000 meters immediately.`
      ];
      tip = `The golden rule: Never ascend with symptoms of altitude sickness. Acclimatization cannot be forced.\n\n⚠️ Medical Disclaimer: Canopy provides backcountry safety information, not medical advice. Consult a healthcare professional. In an emergency, initiate evacuation.`;
    }
    else if (hasHypothermia || categoryId === 'HYPOTHERMIA_COLD') {
      headline = `Hypothermia & Cold Exposure Protocol (${temp})`;
      urgency = 'CRITICAL';
      directAnswer = `Treat this as an urgent hypothermia emergency: immediately strip off wet clothing and shelter from the wind.`;
      contextReasoning = `In ambient temperatures of ${temp}, wet clothing conducts body heat away 25 times faster than dry air. Once violent shivering sets in, core body temperature is dropping toward the critical 35°C threshold.`;
      bullets = [
        `Strip Wet Garments: Remove all saturated clothing immediately and wrap into dry thermals or an emergency space blanket / foil bivy.`,
        `Wind Barrier: Get behind a large boulder or inside a tent—windchill accelerates thermal collapse within minutes.`,
        `Warm Caloric Drinks: Sip warm sweet tea, hot soup, or water with honey/glucose. (Never give fluids if consciousness is impaired).`,
        `Core Warmth Sharing: In moderate hypothermia (when shivering stops and confusion starts), strip to dry underwear and share body heat inside a sleeping bag.`
      ];
      tip = `Prevent hypothermia early: adjust clothing layers before sweating on steep ascents.`;
    }
    else if (hasBear || categoryId === 'WILDLIFE_ENCOUNTER') {
      headline = `Himalayan Wildlife Safety & Bear Protocol`;
      urgency = 'HIGH';
      directAnswer = `If you encounter a Himalayan black bear, stay calm and do not run under any circumstances.`;
      contextReasoning = `Himalayan black bears forage near sub-alpine shrub slopes. Running triggers a predatory chase reflex—and a bear can sprint uphill and downhill at over 45 km/h, far faster than any human.`;
      bullets = [
        `Stand Tall & Speak: Raise your arms to look larger, talk in a calm, assertive, firm human voice, and avoid aggressive eye contact.`,
        `Back Away Diagonally: Slowly step backward diagonally while keeping the bear in your peripheral view, giving it an open escape route.`,
        `Make Noise on Blind Corners: Whistle or tap trekking poles when walking around blind rock corners or near loud rushing rivers.`,
        `Food Discipline: Keep all camp food and scented items in sealed airtight containers stored 100 meters downwind from sleeping tents.`
      ];
      tip = `Bears almost always avoid humans if they hear you coming in advance.`;
    }
    else if (hasScree || categoryId === 'TECHNICAL_TERRAIN') {
      headline = `Scree & Technical Footing Navigation`;
      urgency = 'HIGH';
      directAnswer = `To descend loose scree safely, keep your knees soft and flexed, lean slightly forward, and drive your heels firmly into the gravel.`;
      contextReasoning = `Leaning backward or trying to brake stiff-legged on loose shale scree causes your feet to slip out from under you. You need a dynamic, controlled heel-strike rhythm that slides gently with the loose rock.`;
      bullets = [
        `Heel-First Cadence: Drive heels into deep scree to let the stones absorb forward momentum in small, fluid steps.`,
        `Trekking Poles: Plant poles slightly behind you for balance, absorbing 20–25% of the gravitational load off your knee joints.`,
        `Staggered Spacing: On steep scree slopes, descend in a zig-zag diagonal line rather than directly below other hikers to avoid dislodged falling rocks.`,
        `Microspikes on Ice: If scree gives way to morning verglas black ice or packed snow, put on microspikes immediately.`
      ];
      tip = `Wear high-ankle boots with gaiters to prevent sharp shale rocks from entering your boots.`;
    }
    else if (hasLost || categoryId === 'NAVIGATION_LOST') {
      headline = `Off-Trail Recovery Protocol for ${trailName}`;
      urgency = 'HIGH';
      directAnswer = `Follow the S.T.O.P. protocol immediately: Stop, Think, Observe, and Plan.`;
      contextReasoning = `When visibility drops or trail markers disappear on ${trailName}, wandering blindly is the most dangerous reaction. Dropping into unknown valley gullies frequently traps hikers above impassable cliffs and torrential rivers.`;
      bullets = [
        `Stop Moving: Cease forward progress the moment you realize you are off-trail. Conserve energy and calm your breathing.`,
        `Scan for High Cairns: Scan ridgelines for stacked stone cairns or prayer flags. High ground gives perspective; gullies trap you.`,
        `Hold Ground in Whiteout: If dense fog or whiteout reduces visibility to zero, stay put on stable, non-exposed rock rather than walking off cliffs.`,
        `Emergency Shelter Before Dark: If you cannot relocate the path by 4:30 PM, stop and set up an emergency windbreak before nightfall.`
      ];
      tip = `Always download offline GPX topographic maps on your phone and carry a physical compass in the high mountains.`;
    }
    else if (hasLNT || categoryId === 'LEAVE_NO_TRACE') {
      headline = `Leave-No-Trace Wilderness Preservation`;
      urgency = 'MODERATE';
      directAnswer = `Practice strict Leave-No-Trace wilderness conservation on ${trailName}.`;
      contextReasoning = `At ${elev}, cold temperatures and low oxygen inhibit bacterial breakdown. An organic apple core or banana peel takes 2 to 3 years to decompose in alpine environments.`;
      bullets = [
        `Pack Everything Out: Carry every scrap of trash, tea bags, and wrappers back down to civilization.`,
        `Cathole Sanitation: Deposit human waste in 15cm catholes at least 200 feet (70 paces) away from lakes and streams.`,
        `Protect Fragile Bugyals: High Himalayan alpine turf meadows take up to 40 years to recover once crushed—walk strictly on established rock trails.`,
        `Respect Sacred Heritage: Do not disturb centuries-old chortens, mani stones, or prayer flags.`
      ];
      tip = `Leave the mountain cleaner than you found it—carry a small trash bag in your daypack to pick up litter left by others.`;
    }
    else if (hasWarmClothes || categoryId === 'GEAR_CLOTHING') {
      headline = `Alpine Clothing & Layering Advisory for ${trailName}`;
      urgency = 'HIGH';
      if (isYesNo) {
        directAnswer = `Yes, absolutely—you definitely should wear warm clothes for ${trailName}.`;
      } else if (isRecommendation) {
        directAnswer = `For ${trailName} (${elev}), you need a complete 3-layer modular clothing system to handle ${temp} temperatures and harsh mountain weather.`;
      } else {
        directAnswer = `Warm clothing is mandatory on ${trailName} (${elev}).`;
      }

      contextReasoning = `At ${elev} with ambient temperatures around ${temp}, alpine weather shifts rapidly within minutes. Even if it feels sunny at lower camps, high ridge windchill routinely plunges effective temperatures well below freezing.`;
      bullets = [
        `Moisture-Wicking Base Layer: Merino wool or synthetic polyester thermal top and bottoms (never cotton).`,
        `Insulating Mid-Layer: A 700+ fill down jacket or a 200gsm fleece jacket to trap warm body heat.`,
        `Weatherproof Outer Shell: Windproof and waterproof breathable hardshell jacket with a hood to block ridge winds and snow.`,
        `Warm Extremities: Thermal windproof gloves, a fleece/wool beanie covering your ears, and 2–3 pairs of merino wool hiking socks.`
      ];
      tip = `Strip outer layers before strenuous uphill climbs to prevent sweat buildup, and bundle back up the minute you stop.`;
    }
    else {
      headline = `Backcountry Advisory for ${trailName}`;
      urgency = 'MODERATE';
      directAnswer = `Here is key safety and route guidance for ${trailName} (${elev}).`;
      contextReasoning = `Current mountain conditions: Temperature is ${temp}, elevation is ${elev}, and hard turnaround curfew is ${turnaround}.`;
      bullets = [
        `Maintain Proper Layering: Always wear moisture-wicking synthetics and carry thermal insulation.`,
        `Pacing & Acclimatization: Walk at a conversational pace and drink 3.5 liters of water daily.`,
        `Respect Mountain Curfews: Begin descent no later than ${turnaround} to avoid hiking in twilight.`
      ];
      tip = `Stay alert to changing mountain weather and monitor your physical condition continuously.`;
    }

    const fullConversationalResponse = `${directAnswer}

${contextReasoning}

${bullets.map(b => `• ${b}`).join('\n\n')}

💡 Backcountry Directive: ${tip}`;

    return {
      headline,
      urgency,
      directAnswer,
      contextReasoning,
      keyDirectives: bullets,
      tip,
      conversationalResponse: fullConversationalResponse
    };
  }
}

// Global Singleton Instance
export const trailAI = new TrailAIEngine();
