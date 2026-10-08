export const TRAILS_DATA = [
  {
    id: "hampta-pass",
    name: "Hampta Pass Alpine Transect",
    subtitle: "Dramatic Himalayan Ecological Transect: Lush Green Kullu Valley to Barren Cold Desert Spiti",
    park: "Pir Panjal & Zanskar Ranges, Manali to Spiti Valley, Himachal Pradesh, India",
    distance: "16.2 miles (26 km)",
    elevationGain: "+5,850 ft (+1,780 m)",
    difficulty: "Challenging / High-Altitude Trans-Himalayan Pass",
    estimatedTime: "4 Days (Jobra to Chhatru Crossover)",
    cellularSignal: "0 Bars (Rain Shadow Wilderness)",
    offlineReady: true,
    coordinates: { lat: 32.2858, lon: 77.3686 },
    foliageMetrics: {
      peakPercentage: 92,
      status: "Himalayan Pine & Alpine Flora to Cold Desert Lichen",
      dominantSpecies: ["Himalayan Pine (Pinus wallichiana)", "Silver Birch (Bhojpatra)", "Alpine Willow", "Spiti Juniper"],
      colorPalette: ["#285943", "#748858", "#b89058", "#544c42"],
      canopyCover: 60,
      leafLitterSlippage: "Severe (glacial moraine scree and hard snow couloir)"
    },
    microclimateTabPFN: {
      predictedTempRange: "18°F - 52°F (-7.8°C - 11.1°C)",
      frostProbability: 95,
      frostWindow: "Continuous sub-zero freeze above Balou Ka Ghera (3,600 m)",
      soilMoisture: 38,
      groundMudIndex: 28,
      sunsetTime: "5:50 PM",
      safeTurnaroundTime: "1:30 PM (crossing the snow couloir requires morning hardpack)",
      slipRiskScore: "High (verglas ice on steep pass headwall)",
      dewPoint: "14°F (-10.0°C)"
    },
    bioacoustics: [
      {
        id: "himalayan-griffon",
        commonName: "Himalayan Griffon Vulture",
        scientificName: "Gyps himalayensis",
        callType: "Deep guttural hiss & wing rush",
        frequencyRange: "1.8 kHz - 3.2 kHz",
        detectedTime: "7.2 miles in (Hampta Pass Crest)",
        confidence: 0.98,
        audioSnippetName: "griffon_glide.wav",
        description: "Soars effortlessly on the massive thermal updrafts colliding between Kullu and Spiti valleys.",
        conservationStatus: "Near Threatened",
        gemmaNotes: "Utilizes the narrow aerodynamic wind corridor of the Hampta notch to cross the Pir Panjal barrier."
      },
      {
        id: "snow-partridge",
        commonName: "Tibetan Snowcock",
        scientificName: "Tetraogallus tibetanus",
        callType: "Ringing rising whistle ('kew-kew-kew')",
        frequencyRange: "2.4 kHz - 4.6 kHz",
        detectedTime: "5.5 miles in (High Scree Zone)",
        confidence: 0.94,
        audioSnippetName: "snowcock_call.wav",
        description: "Camouflaged high-altitude gamebird dwelling among bare granite moraine and scree slopes.",
        conservationStatus: "Protected High-Altitude Native",
        gemmaNotes: "Indicator species for sub-alpine to cold-arid trans-Himalayan transition zone."
      }
    ],
    waypoints: [
      { id: "wp-hp1", name: "Hampta Valley (Jobra)", elev: "2,870 m", mile: 0.0, audioWhisper: "Welcome to Jobra in the lower Hampta Valley, 2,870 meters. Lush conifer forests, moist soil, and the roaring Rani Nallah river." },
      { id: "wp-hp2", name: "Alpine Meadow (Balou Ka Ghera)", elev: "3,600 m", mile: 4.8, audioWhisper: "Balou Ka Ghera, 3,600 meters. Sprawling alpine meadow with winding glacial streams and wild yellow and violet flowers." },
      { id: "wp-hp3", name: "High-Altitude Rock Zone", elev: "3,950 m", mile: 7.2, audioWhisper: "Entering the high rock zone, 3,950 meters. Treeline is far below. Giant granite boulders, loose moraine scree, and icy gusts." },
      { id: "wp-hp4", name: "Snow Zone & Couloir", elev: "4,150 m", mile: 8.6, audioWhisper: "The snow zone at 4,150 meters. Steep frozen snow couloir flanked by sheer monolithic cliff faces. Microspikes essential." },
      { id: "wp-hp5", name: "Hampta Pass Crest", elev: "4,270 m", mile: 9.8, audioWhisper: "Hampta Pass, 4,270 meters! The dramatic continental divide. Behind you lies the emerald Kullu valley; ahead opens the vast, barren, moonscape of Spiti." },
      { id: "wp-hp6", name: "Spiti Transition (Shea Goru)", elev: "3,900 m", mile: 12.4, audioWhisper: "Shea Goru and the Spiti rain-shadow desert, 3,900 meters. Barren tan and ochre rock, braided glacial streams, and zero trees." }
    ],
    gemmaSafetyBriefing: {
      headline: "Hampta Pass Trans-Himalayan Safety Directives",
      hydrationNeeded: "3.0 Liters (dry cold Spiti air causes rapid unseen dehydration)",
      layers: "Moisture-wicking thermal base + high-loft fleece + windproof Gore-Tex shell + microspikes for snow couloir.",
      wildlifeAdvisory: "Himalayan Snow Leopards and Ibex inhabit upper crags; keep provisions sealed.",
      leaveNoTrace: "Do not disturb delicate alpine meadow flora or pristine glacial meltwater streams.",
      offlineModelPrompt: "You are Gemma 2, advising trekkers crossing from the wet monsoonal Kullu side to the arid cold desert of Spiti."
    }
  },
  {
    id: "triund-ridge",
    name: "Triund to Indrahar Ridge",
    subtitle: "Dramatic Dhauladhar Granite Wall: Alpine Meadow to 4,342 m Glacial Ridge Pass",
    park: "Dhauladhar Range, Dharamshala / McLeod Ganj, Himachal Pradesh, India",
    distance: "11.2 miles (18 km)",
    elevationGain: "+5,280 ft (+1,610 m)",
    difficulty: "Challenging / High-Altitude Exposed Ridge Scramble",
    estimatedTime: "7 hr 30 min (Triund–Indrahar Return)",
    cellularSignal: "0 Bars (Glacial Pass Wilderness)",
    offlineReady: true,
    coordinates: { lat: 32.2592, lon: 76.3533 },
    foliageMetrics: {
      peakPercentage: 78,
      status: "Oak & Scarlet Rhododendron to Alpine Lichen",
      dominantSpecies: ["Rhododendron Arboreum", "Himalayan Oak (Quercus incana)", "Deodar Cedar", "Alpine Juniper"],
      colorPalette: ["#285943", "#b84c65", "#e7a94b", "#6f7d74"],
      canopyCover: 45,
      leafLitterSlippage: "Severe (loose granite scree transitioning to hard snowpack)"
    },
    microclimateTabPFN: {
      predictedTempRange: "20°F - 46°F (-6.7°C - 7.8°C)",
      frostProbability: 88,
      frostWindow: "Continuous sub-zero freeze above Laka Glacier (3,550 m)",
      soilMoisture: 42,
      groundMudIndex: 22,
      sunsetTime: "5:45 PM",
      safeTurnaroundTime: "2:30 PM (descending the exposed boulder staircase requires full daylight)",
      slipRiskScore: "High (verglas ice on steep granite gully)",
      dewPoint: "16°F (-8.9°C)"
    },
    bioacoustics: [
      {
        id: "golden-eagle",
        commonName: "Golden Eagle",
        scientificName: "Aquila chrysaetos",
        callType: "High yelping scream over cliffs",
        frequencyRange: "2.1 kHz - 3.8 kHz",
        detectedTime: "4.4 miles in (Indrahar Ridge Crest)",
        confidence: 0.97,
        audioSnippetName: "golden_eagle_scream.wav",
        description: "Hunts along the sheer vertical granite crags and thermal updrafts of Indrahar Pass.",
        conservationStatus: "Protected Native",
        gemmaNotes: "Glides at high speeds along the thermal updrafts created by the Kangra valley wall."
      },
      {
        id: "western-tragopan",
        commonName: "Western Tragopan",
        scientificName: "Tragopan melanocephalus",
        callType: "Mournful wailing whistle ('waaah-waaah')",
        frequencyRange: "1.1 kHz - 2.8 kHz",
        detectedTime: "2.1 miles in (Lower Oak Stand)",
        confidence: 0.92,
        audioSnippetName: "tragopan_wail.wav",
        description: "Critically rare horned pheasant inhabiting undisturbed oak and rhododendron slopes.",
        conservationStatus: "Vulnerable (Schedule I)",
        gemmaNotes: "Extremely sensitive bio-indicator of old-growth temperate Himalayan forest health."
      }
    ],
    waypoints: [
      { id: "wp-ti1", name: "Triund Meadow Campsite", elev: "2,828 m", mile: 0.0, audioWhisper: "Welcome to Triund alpine meadow, 2,828 meters. Rolling green pasture looking out over Kangra Valley, with the monolithic granite Dhauladhar wall rising directly ahead." },
      { id: "wp-ti2", name: "Snowline Cafe & Rocky Ascent", elev: "3,250 m", mile: 2.1, audioWhisper: "Snowline rock shelf at 3,250 meters. Treeline ends abruptly. Massive granite boulders and glacial moraine scree begin." },
      { id: "wp-ti3", name: "Laka Glacier / Snow Zone", elev: "3,550 m", mile: 3.8, audioWhisper: "Laka Got glacial basin at 3,550 meters. Seasonal snow couloir flanked by towering metamorphic crags. Shepherds bivouac cave." },
      { id: "wp-ti4", name: "Steep Ridge Approach", elev: "3,950 m", mile: 4.9, audioWhisper: "Steep boulder staircase approach at 3,950 meters. Exposed granite ledges, loose scree, and cold downdrafts funneling through the gully." },
      { id: "wp-ti5", name: "Indrahar Ridge & Pass", elev: "4,342 m", mile: 5.6, audioWhisper: "Indrahar Pass crest at 4,342 meters! Knife-edge ridge separating Kangra and Chamba valleys. Dramatic sheer drops, fluttering prayer flags, and 360° views of Mani Mahesh Kailash and Pir Panjal ranges." }
    ],
    gemmaSafetyBriefing: {
      headline: "Dhauladhar Scarp Front Safety Directives",
      hydrationNeeded: "2.5 Liters (no reliable water sources between Laka and the pass)",
      layers: "Merino base + fleece midlayer + windproof shell + crampons/microspikes for seasonal snow couloir.",
      wildlifeAdvisory: "Himalayan Black Bears and Snow Leopards roam upper crags; store provisions airtight.",
      leaveNoTrace: "Pack out all waste; respect pristine alpine meadow and glacial water ecology.",
      offlineModelPrompt: "You are Gemma 2, advising mountaineers traversing the extreme vertical exposure of the Dhauladhar Range."
    }
  },
  {
    id: "chandrashila-peak",
    name: "Chandrashila & Tungnath Peak",
    subtitle: "World's Highest Shiva Temple (3,680 m) & 4,000 m Moon Rock Himalayan Summit",
    park: "Kedarnath Wildlife Sanctuary, Chopta, Garhwal Himalayas, Uttarakhand, India",
    distance: "6.2 miles (10 km)",
    elevationGain: "+4,330 ft (+1,320 m)",
    difficulty: "Moderate / High-Altitude Alpine Scramble",
    estimatedTime: "4 hr 30 min (Summit Loop)",
    cellularSignal: "0 Bars (Sacred Ridge Wilderness)",
    offlineReady: true,
    coordinates: { lat: 30.4883, lon: 79.2172 },
    foliageMetrics: {
      peakPercentage: 86,
      status: "Rhododendron & Alpine Grass Transition",
      dominantSpecies: ["Rhododendron Campanulatum", "Himalayan Birch (Bhojpatra)", "Silver Fir", "Alpine Juniper"],
      colorPalette: ["#b84c65", "#e7a94b", "#3f7d5a", "#78350f"],
      canopyCover: 35,
      leafLitterSlippage: "Low (flagstone pilgrimage trail transitioning to high scree)"
    },
    microclimateTabPFN: {
      predictedTempRange: "24°F - 48°F (-4.4°C - 8.9°C)",
      frostProbability: 92,
      frostWindow: "Severe evening freeze after 4:00 PM at Chandrashila summit",
      soilMoisture: 40,
      groundMudIndex: 25,
      sunsetTime: "5:38 PM",
      safeTurnaroundTime: "3:30 PM (ridge temperature drops 12°C within 30 minutes of sunset)",
      slipRiskScore: "Moderate (frosty stone paving near Tungnath)",
      dewPoint: "20°F (-6.7°C)"
    },
    bioacoustics: [
      {
        id: "snow-partridge",
        commonName: "Snow Partridge",
        scientificName: "Lerwa lerwa",
        callType: "High piping whistle ('whee-whee-whee')",
        frequencyRange: "2.4 kHz - 4.5 kHz",
        detectedTime: "2.8 miles in (Tungnath Upper Cliffs)",
        confidence: 0.95,
        audioSnippetName: "snow_partridge_whistle.wav",
        description: "Camouflaged in lichen-covered rocks above the tree line, whistling softly when hikers approach.",
        conservationStatus: "Least Concern",
        gemmaNotes: "Indicator of true alpine conditions above 3,600m."
      },
      {
        id: "lammergeier",
        commonName: "Bearded Vulture (Lammergeier)",
        scientificName: "Gypaetus barbatus",
        callType: "Shrill thin whistle on updrafts",
        frequencyRange: "1.2 kHz - 2.6 kHz",
        detectedTime: "3.1 miles in (Chandrashila Apex)",
        confidence: 0.93,
        audioSnippetName: "lammergeier_glide.wav",
        description: "Enormous solitary raptor known to drop bones from heights onto summit slabs to crack the marrow.",
        conservationStatus: "Near Threatened",
        gemmaNotes: "Inspect thermals over Chaukhamba massif for its distinctive diamond-shaped wedge tail."
      }
    ],
    waypoints: [
      { id: "wp-c1", name: "Chopta Meadows Trailhead", elev: "2,680 m", mile: 0.0, audioWhisper: "Starting from Chopta 'Mini Switzerland', 2,680 meters. Paved flagstone trail ascends through rolling alpine bugyals and silver fir forest." },
      { id: "wp-c2", name: "Bhojbasa Rhododendron Stand", elev: "3,150 m", mile: 1.4, audioWhisper: "Bhojbasa forest belt at 3,150 meters. Scarlet Rhododendron arboreum transitioning into dwarf campanulatum and birch. Monals whistling in the scrub." },
      { id: "wp-c3", name: "Tungnath Sacred Temple", elev: "3,680 m", mile: 2.2, audioWhisper: "You reached Tungnath, world's highest Shiva temple at 3,680 meters! Ancient Nagara stone architecture, prayer flags, and brass bells. High wind chill." },
      { id: "wp-c4", name: "Ravansheela Rock Overlook", elev: "3,840 m", mile: 2.7, audioWhisper: "Ravansheela rock overhang at 3,840 meters. Steep flagstone steps giving way to rugged moraine scree and mountain gusts. Chaukhamba looms in the mist." },
      { id: "wp-c5", name: "Chandrashila Moon Rock Summit", elev: "4,000 m", mile: 3.1, audioWhisper: "Chandrashila summit crest! 4,000 meters elevation. 360-degree panoramic vista across Nanda Devi, Trishul, Chaukhamba, and Kedar massifs. Sacred shrine at the apex." }
    ],
    gemmaSafetyBriefing: {
      headline: "Chandrashila High-Altitude Scramble Advisory",
      hydrationNeeded: "2.5 Liters with oral rehydration salts (altitude diuresis)",
      layers: "Thermal base + windproof shell + UV protection sunglasses (snow albedo index 85%).",
      wildlifeAdvisory: "Musk deer sanctuary; stay quiet in upper birch belt to glimpse endangered Himalayan musk deer.",
      leaveNoTrace: "Do not leave offerings or plastic flags outside designated temple enclosures.",
      offlineModelPrompt: "You are Gemma 2, advising pilgrims and mountaineers on acute mountain sickness (AMS) and rapid temperature inversions."
    }
  },
  {
    id: "kedarnath-ridge",
    name: "Kedarnath Summit Ridge",
    subtitle: "Colossal 6,940 m Himalayan Glacial Wall, Chorabari Moraine & Sacred Mandakini Basin",
    park: "Kedarnath Wildlife Sanctuary, Garhwal Himalayas, Uttarakhand, India",
    distance: "14.2 miles (22.8 km)",
    elevationGain: "+8,900 ft (+2,710 m)",
    difficulty: "Extreme / High-Altitude Alpine Ridge",
    estimatedTime: "8 hr 45 min (Ridge Approach)",
    cellularSignal: "0 Bars (Glacial Zone)",
    offlineReady: true,
    coordinates: { lat: 30.7346, lon: 79.0669 },
    foliageMetrics: {
      peakPercentage: 88,
      status: "Glacial Moraine & Alpine Lichen Zone",
      dominantSpecies: ["Himalayan Cedar (Deodar)", "Bhojpatra (Himalayan Birch)", "Alpine Juniper", "Saussurea (Brahma Kamal)"],
      colorPalette: ["#285943", "#a8c5a0", "#dceaf0", "#e7a94b"],
      canopyCover: 28,
      leafLitterSlippage: "Severe (glacial moraine scree transitioning to hard verglas snowpack)"
    },
    microclimateTabPFN: {
      predictedTempRange: "8°F - 36°F (-13.3°C - 2.2°C)",
      frostProbability: 98,
      frostWindow: "Permanent sub-zero freeze along the summit arete and Chorabari lateral moraine",
      soilMoisture: 38,
      groundMudIndex: 20,
      sunsetTime: "5:28 PM",
      safeTurnaroundTime: "2:45 PM (early twilight shadows cascade across Chorabari glacier)",
      slipRiskScore: "Extreme (blue ice patches on knife-edge ridge)",
      dewPoint: "6°F (-14.4°C)"
    },
    bioacoustics: [
      {
        id: "himalayan-snowcock",
        commonName: "Himalayan Snowcock",
        scientificName: "Tetraogallus himalayensis",
        callType: "Loud ascending curlew-like whistle ('kroo-kroo-kroo')",
        frequencyRange: "2.1 kHz - 4.2 kHz",
        detectedTime: "8.5 miles in (Chorabari Moraine 3,900 m)",
        confidence: 0.97,
        audioSnippetName: "snowcock_call.wav",
        description: "Large high-altitude gamebird residing on sheer precipitous rock ledges above the permanent snow line.",
        conservationStatus: "Least Concern (High Alpine Specialist)",
        gemmaNotes: "Listen for accelerating whistles across scree slopes during early morning thermals."
      },
      {
        id: "himalayan-monal",
        commonName: "Himalayan Monal",
        scientificName: "Lophophorus impejanus",
        callType: "Clear ringing whistled flight call ('klee-klee-klee')",
        frequencyRange: "3.2 kHz - 5.8 kHz",
        detectedTime: "4.8 miles in (Rambara Sub-Alpine Rhododendron Thicket)",
        confidence: 0.96,
        audioSnippetName: "himalayan_monal_whistle.wav",
        description: "The magnificent nine-colored pheasant soaring between birch copses and steep rock buttresses.",
        conservationStatus: "Protected High-Altitude Native",
        gemmaNotes: "Early dawn whistles signify quiet atmospheric stability."
      },
      {
        id: "bearded-vulture",
        commonName: "Bearded Vulture (Lammergeier)",
        scientificName: "Gypaetus barbatus",
        callType: "Low whistling wind-shear dive sound",
        frequencyRange: "0.9 kHz - 2.1 kHz",
        detectedTime: "11.2 miles in (Kedarnath South Wall Updrafts)",
        confidence: 0.98,
        audioSnippetName: "lammergeier_dive.wav",
        description: "Enormous 2.8m wingspan bone-eating raptor surfing thermals against the vertical Kedarnath south wall.",
        conservationStatus: "Near Threatened",
        gemmaNotes: "Soaring raptors confirm rising thermal currents along the granite face."
      }
    ],
    waypoints: [
      { id: "wp-kd1", name: "Gaurikund Valley Head", elev: "1,982 m", mile: 0.0, audioWhisper: "Gaurikund trailhead at 1,982 meters. Dense deodar forest and Mandakini river thermal springs. Trail ascends into high glacial gorge." },
      { id: "wp-kd2", name: "Rambara River Gorge", elev: "2,590 m", mile: 4.6, audioWhisper: "Rambara gorge at 2,590 meters. Sheer granite cliffs flanked by roaring glacial meltwater torrents. Sub-alpine birch and rhododendron." },
      { id: "wp-kd3", name: "Kedarnath Glacial Basin", elev: "3,584 m", mile: 9.8, audioWhisper: "Kedarnath basin at 3,584 meters. Ancient stone shrine standing against the colossal 6,940-meter wall of Kedarnath Peak." },
      { id: "wp-kd4", name: "Chorabari Moraine Overlook", elev: "3,900 m", mile: 11.6, audioWhisper: "Chorabari glacial moraine at 3,900 meters. Massive lateral moraine of tumbled granite boulders overlooking the hanging glacier." },
      { id: "wp-kd5", name: "Kedarnath Summit Ridge", elev: "6,940 m", mile: 14.2, audioWhisper: "Kedarnath Summit Ridge knife-edge crest. Colossal sheer rock face and high-altitude snowpack looking toward Kedarnath Dome and Bhartekhunta." }
    ],
    gemmaSafetyBriefing: {
      headline: "Kedarnath High-Altitude Expedition Protocol",
      hydrationNeeded: "3.5 Liters (insulated container to prevent ice crystals from forming)",
      layers: "4-Layer Alpine System: 250gsm merino thermal + windstopper fleece + 800-fill down parka + Gore-Tex Pro 3L shell.",
      wildlifeAdvisory: "Himalayan Snow Leopards and Tibetan Wolves inhabit high moraines above 4,000m; keep food stores airtight, travel in pairs.",
      leaveNoTrace: "Glacial ecosystems decompose waste 10x slower; pack out all solid waste, stay on designated moraine cairn paths.",
      offlineModelPrompt: "You are Gemma 2, an offline Himalayan backcountry mountaineering AI. Analyze the extreme terrain of Kedarnath South Face, Chorabari Glacier crevasses, rapid weather shifts, and severe hypoxia."
    }
  }
];

export const CURRENT_TRAIL_DEFAULT = TRAILS_DATA[0];
