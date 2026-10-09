// Canopy Open-Weight Intelligence & Backcountry Guardian Agent Service
// Connects canopyAI (Local Open Model Provider + Deterministic Safety Engine)

import { canopyAI } from './localAIProvider.js';
import { trailAI } from './trailAIModel.js';

export function formatGemma2Prompt(trail, userQuery = "Summarize critical turnaround safety and altitude status") {
  return `<start_of_turn>system
You are Gemma 2, an open-weight ecological intelligence and backcountry safety agent running locally on-device with zero internet connectivity. Your goal is to get humans safely outdoors, maximize their connection with nature, and minimize screen distractions. Emphasize Leave-No-Trace principles, daylight margins, and local bioacoustics.
<end_of_turn>
<start_of_turn>user
Trail Context:
- Name: ${trail?.name || 'Himalayan Pass'}
- Elevation: ${trail?.elevation || trail?.elevationGain || '3,800 m'}
- Cellular Signal: ${trail?.cellularSignal || 'Zero (Offline)'}
- Foliage/Terrain: ${trail?.terrain || 'Alpine Scree & Glacial Moraine'}
- Turnaround Curfew: ${trail?.turnaroundTime || '2:30 PM'}

Query: ${userQuery}
<end_of_turn>
<start_of_turn>model
`;
}

export async function askGemmaAgent(trail, userQuery, options = {}) {
  const {
    elevation = trail?.elevation || trail?.elevationGain || 4270,
    temperature = trail?.tempC !== undefined ? trail.tempC : 8,
    riskScore = 48,
    visibility = 'Clear (>15 km)',
    weatherCondition = 'Alpine Air',
    currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    turnaroundTime = trail?.turnaroundTime || '2:30 PM',
    isHardware = false
  } = options;

  // Run through Canopy AI Engine (Local Provider -> Context Engine -> Deterministic Safety)
  const result = await canopyAI.askCanopy({
    userQuery,
    rawContext: {
      trail,
      elevation,
      temperature,
      riskScore,
      visibility,
      weatherCondition,
      currentTime,
      turnaroundTime,
      isHardwareTelemetry: isHardware
    }
  });

  // Also retain neural telemetry metadata for inspector UI
  const neuralResult = trailAI.query(userQuery, trail);

  return {
    response: result.response,
    model: result.modelName,
    modelLicense: result.modelLicense,
    providerName: result.providerName,
    actualProvider: result.actualProvider,
    actualModel: result.actualModel,
    runtime: result.runtime,
    isLocal: result.isLocal,
    local: result.local,
    offlineCapable: result.offlineCapable ?? true,
    offlineVerified: result.offlineVerified ?? false,
    fallback: result.fallback,
    isFallback: result.isFallback,
    fallbackChain: result.fallbackChain || [result.actualProvider],
    fallbackFrom: result.fallbackFrom,
    fallbackReason: result.fallbackReason,
    latency: result.latency,
    isDeterministicOverride: result.isDeterministicOverride,
    safetyRuleTriggered: result.safetyRuleTriggered,
    contextUsed: result.contextUsed,
    neuralResult
  };
}

