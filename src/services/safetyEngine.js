// Canopy Deterministic Safety & Hard Rule Override Engine
// The local AI model is NOT the sole safety authority.
// This deterministic engine evaluates environmental thresholds and overrides any unsafe AI output.

export function evaluateDeterministicSafety(userQuery, context, aiProposedResponse) {
  const q = (userQuery || '').toLowerCase();
  const overrides = [];

  // 1. HARD TURNAROUND CUTOFF CHECK
  // If user asks "Should I continue?", "Can I summit?", etc., and current time is past turnaround:
  const isContinuationQuery = /\b(continue|proceed|go on|keep going|push|summit|reach the pass|aage|can i make it)\b/i.test(q);
  
  if (context.isPastTurnaround && (isContinuationQuery || context.riskScore >= 70)) {
    overrides.push({
      rule: "HARD_TURNAROUND_CURFEW",
      severity: "CRITICAL",
      reason: `Current time (${context.currentTime}) exceeds the strict hard turnaround cutoff of ${context.turnaroundTime}. Daylight is collapsing and mountain shadows reduce ground light 40 minutes before open-sky sunset.`,
      directive: `Turn back immediately. You are beyond the mandatory ${context.turnaroundTime} turnaround window. Descent across loose moraine scree and verglas requires active daylight.`
    });
  }

  // 2. SEVERE RISK SCORE (> 75/100)
  if (context.riskScore >= 75 && isContinuationQuery) {
    overrides.push({
      rule: "EXTREME_RISK_THRESHOLD",
      severity: "CRITICAL",
      reason: `Trail composite risk score is ${context.riskScore}/100 (Hazard Zone).`,
      directive: `Do not proceed further. Risk score (${context.riskScore}/100) indicates compounded hazards (elevation: ${context.elevation}, terrain: ${context.terrain}). Halt ascent and retreat to the last stable campsite.`
    });
  }

  // 3. ZERO VISIBILITY / WHITEOUT
  const isVisibilityQuery = /\b(visibility|fog|whiteout|lost|cairn|dense fog|rasta)\b/i.test(q);
  if (context.isPoorVisibility && (isContinuationQuery || isVisibilityQuery)) {
    overrides.push({
      rule: "WHITEOUT_DISORIENTATION_HAZARD",
      severity: "HIGH",
      reason: `Visibility is ${context.visibility}. Moving blind near exposed cliffs and river couloirs is life-threatening.`,
      directive: `Halt forward movement immediately. Adopt the S.T.O.P. protocol (Stop, Think, Observe, Plan). Hold high ground on durable rock. Never descend into uncharted ravines.`
    });
  }

  // 4. FREEZING TEMPERATURE + WET CLOTHING / HYPOTHERMIA
  const isColdQuery = /\b(cold|shiver|shivering|jacket|clothes|wet|freeze|ice)\b/i.test(q);
  if (context.isFreezing && (isColdQuery || isContinuationQuery)) {
    overrides.push({
      rule: "SUB_ZERO_THERMAL_HAZARD",
      severity: "HIGH",
      reason: `Ambient temperature is ${context.temperature} with freezing windchill.`,
      directive: `Mandatory thermal protection: Sub-zero windchill accelerates core heat collapse. Strip wet garments immediately and layer 700+ fill down/fleece before hypothermia sets in.`
    });
  }

  // 5. ACUTE MOUNTAIN SICKNESS (AMS) / HYPOXIA SAFETY
  const isAmsQuery = /\b(headache|nausea|dizzy|dizziness|vomit|ams|altitude|chakkar|sar dard)\b/i.test(q);
  if (isAmsQuery && context.elevationNum >= 3000) {
    overrides.push({
      rule: "ALTITUDE_HYPOXIA_THRESHOLD",
      severity: "HIGH",
      reason: `Hiker is at ${context.elevation}, well above the 3,000m AMS threshold.`,
      directive: `Golden Rule of High Altitude: Never ascend with symptoms of mountain sickness. Halt ascent immediately, rest, hydrate, and prepare to descend at least 500 to 1,000 meters if dizziness persists.`
    });
  }

  // If critical overrides exist, they MUST supersede or lead the final response
  if (overrides.length > 0) {
    const critical = overrides.find(o => o.severity === 'CRITICAL') || overrides[0];
    
    // Check if the AI's proposed response was unsafe (e.g. telling user they can proceed)
    const aiProposedYes = /\b(yes, you can continue|go ahead|safe to proceed|keep hiking)\b/i.test(aiProposedResponse);

    let safetyResponse = `⚠️ [DETERMINISTIC SAFETY OVERRIDE ACTIVE — ${critical.rule}]\n\n${critical.directive}\n\n• Current Altitude: ${context.elevation}\n• Ambient Temp: ${context.temperature}\n• Trail Risk Score: ${context.riskScore}/100\n• Turnaround Window: ${context.turnaroundTime} (Current: ${context.currentTime})\n• Terrain Hazard: ${context.terrain}\n\n💡 Backcountry Directive: Safe mountaineers turn back when conditions exceed cutoffs. The mountain will always be there tomorrow.`;

    return {
      hasOverride: true,
      overrides,
      primaryRule: critical.rule,
      finalResponse: safetyResponse,
      safetyApproved: false,
      aiWasSuppressed: aiProposedYes
    };
  }

  // No overrides triggered: AI response verified and approved
  return {
    hasOverride: false,
    overrides: [],
    primaryRule: null,
    finalResponse: aiProposedResponse,
    safetyApproved: true,
    aiWasSuppressed: false
  };
}
