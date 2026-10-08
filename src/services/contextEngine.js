// Canopy Structured Backcountry Context Engine
// Aggregates real-time mountain telemetry, terrain physics, solar geometry, and hardware data.

export function buildCanopyContext({
  trail,
  checkpoint,
  elevation,
  temperature,
  humidity,
  pressure,
  weatherCondition,
  visibility,
  riskScore,
  turnaroundTime,
  currentTime,
  isHardwareTelemetry = false,
  microclimate = null
}) {
  const cleanElevStr = String(elevation !== undefined && elevation !== null ? elevation : '4270').replace(/,/g, '').replace(/[^\d.-]/g, '');
  const elevNum = typeof elevation === 'number' ? elevation : parseInt(cleanElevStr || '4270', 10);
  
  const cleanTempStr = String(temperature !== undefined && temperature !== null ? temperature : '8').replace(/[^\d.-]/g, '');
  const tempNum = typeof temperature === 'number' ? temperature : parseFloat(cleanTempStr || '8');
  
  const cleanRiskStr = String(riskScore !== undefined && riskScore !== null ? riskScore : '45').replace(/[^\d.-]/g, '');
  const riskNum = typeof riskScore === 'number' ? riskScore : parseInt(cleanRiskStr || '45', 10);
  
  // Format current time and turnaround
  const now = currentTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const cutoff = turnaroundTime || trail?.turnaroundTime || '2:30 PM';
  
  // Check daylight & turnaround expiry
  const isPastTurnaround = checkIsPastCutoff(now, cutoff);
  const isHighElevation = elevNum >= 3000;
  const isHypoxiaZone = elevNum >= 4000;
  const isFreezing = tempNum <= 0;
  const isSevereRisk = riskNum >= 75;
  const isPoorVisibility = (visibility || '').toLowerCase().includes('poor') || 
                           (visibility || '').toLowerCase().includes('whiteout') || 
                           (weatherCondition || '').toLowerCase().includes('fog') ||
                           (weatherCondition || '').toLowerCase().includes('whiteout');

  const waypoints = trail?.waypoints || [
    { id: 'wp-1', name: 'Valley Base (Jobra)', elev: '2,870 m' },
    { id: 'wp-2', name: 'Alpine Meadow (Balou Ka Ghera)', elev: '3,600 m' },
    { id: 'wp-3', name: 'High-Altitude Rock Zone', elev: '3,950 m' },
    { id: 'wp-4', name: 'Snow Zone & Couloir', elev: '4,150 m' },
    { id: 'wp-5', name: 'Hampta Pass Crest', elev: '4,270 m' },
    { id: 'wp-6', name: 'Spiti Transition (Shea Goru)', elev: '3,900 m' }
  ];

  return {
    trail: trail?.name || 'Hampta Pass Alpine Transect',
    waypoints,
    location: checkpoint?.name || trail?.waypoints?.[0]?.name || 'High Alpine Pass',
    checkpointNum: checkpoint?.num || '05',
    elevation: `${elevNum}m`,
    elevationNum: elevNum,
    terrain: checkpoint?.terrain || 'Alpine Scree & Glacial Moraine',
    slope: checkpoint?.difficulty || 'Class 3 Scramble / 28° Incline',
    temperature: `${tempNum}°C`,
    tempNum: tempNum,
    humidity: humidity || '58%',
    pressure: pressure || (elevNum > 3500 ? '640 hPa' : '1013 hPa'),
    snow: elevNum > 3800 ? 'Hardpack Glacial Snow / Verglas Ice' : 'Bare Rock & Soil',
    visibility: visibility || (isPoorVisibility ? 'Poor (<50m)' : 'Clear (>15 km)'),
    weather: weatherCondition || 'Alpine Cold Front',
    riskScore: riskNum,
    currentTime: now,
    turnaroundTime: cutoff,
    isPastTurnaround,
    isHighElevation,
    isHypoxiaZone,
    isFreezing,
    isSevereRisk,
    isPoorVisibility,
    waterStatus: elevNum > 3800 ? 'Glacial meltwater only (Purification required)' : 'Valley stream available',
    wildlifeAlerts: 'Himalayan Black Bear active foraging zone below 3,400m',
    isHardwareTelemetry,
    sensorSource: isHardwareTelemetry ? 'PHYSICAL (WebSerial COM)' : 'SIMULATED',
    microclimate: microclimate || {
      frostProbability: elevNum > 3500 ? '88%' : '24%',
      trailMudIndex: '62/100'
    }
  };
}

// Helper to determine if current time has passed the turnaround cutoff (e.g. "4:05 PM" vs "2:30 PM")
export function checkIsPastCutoff(currentStr, cutoffStr) {
  try {
    const parseTime = (tStr) => {
      if (!tStr) return 0;
      const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 0;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = (match[3] || '').toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const currentMins = parseTime(currentStr);
    const cutoffMins = parseTime(cutoffStr);
    return currentMins > cutoffMins;
  } catch (e) {
    return false;
  }
}
