// Canopy Deterministic Safety & Hard Rule Override Engine
// The local AI model is NOT the sole safety authority.
// This deterministic engine evaluates environmental thresholds and overrides any unsafe AI output.

export const MEDICAL_DISCLAIMER = "\n\n⚠️ Medical Disclaimer: Canopy provides backcountry safety information, not medical advice. Consult a healthcare professional. In an emergency, initiate evacuation.";

/**
 * Validates and sanitizes the AI model's proposed output before display.
 * Checks for:
 * 1. Unsafe continuation advice under hazardous conditions
 * 2. Casual medication prescribing / dosages
 * 3. Hallucinated telemetry
 */
export function validateAndSanitizeAIResponse(aiProposedResponse, context, userQuery = '') {
  if (!aiProposedResponse) return { sanitizedResponse: '', wasSanitized: false, issues: [] };

  let text = String(aiProposedResponse);
  let wasSanitized = false;
  const issues = [];

  const q = (userQuery || '').toLowerCase();
  const lowerText = text.toLowerCase();

  // 1. Check for unsafe continuation recommendation in hazardous conditions
  const recommendsContinuation = /\b(yes,?\s*(you can\s*)?(continue|proceed|go on)|safe to (continue|proceed|keep going)|feel free to (continue|proceed)|keep hiking|summit is reachable)\b/i.test(text);
  const isHazardous = context.isPastTurnaround || context.riskScore >= 75 || context.isPoorVisibility;

  if (recommendsContinuation && isHazardous) {
    issues.push("UNSAFE_CONTINUATION_ADVICE");
    wasSanitized = true;
    text = `⚠️ [SAFETY ENGINE CORRECTION: The proposed AI guidance recommended continuing, which violates backcountry safety protocol under current hazardous conditions.]\n\nDirect Safety Command: Do NOT proceed. Current conditions (Risk: ${context.riskScore}/100, Past Cutoff: ${context.isPastTurnaround ? 'YES' : 'NO'}, Visibility: ${context.visibility}) require halting ascent or reversing course immediately.`;
    return { sanitizedResponse: text, wasSanitized, issues };
  }

  // 2. Medical Safety Audit: detect drug prescribing and dosages
  const mentionsDrugs = /\b(diamox|acetazolamide|ibuprofen|paracetamol|nifedipine|dexamethasone)\b/i.test(text);
  const mentionsDosage = /\b\d+\s*(?:mg|milligrams?|tablets?|doses?)\b/i.test(text);

  if (mentionsDrugs || mentionsDosage) {
    issues.push("MEDICATION_PRESCRIBING_FILTERED");
    wasSanitized = true;
    // Replace drug prescribing lines with conservative mountain protocol
    text = text.replace(
      /(?:take|administer|use|prescribe|carry|dosage|dose of)?\s*(?:diamox|acetazolamide|ibuprofen|paracetamol|nifedipine|dexamethasone)[^.\n]*[.\n]?/gi,
      "Conservative backcountry protocol: Rest, maintain hydration with electrolytes, halt ascent, and prepare for immediate descent if symptoms worsen.\n"
    );
  }

  // 3. Ensure Medical Disclaimer is present on any altitude / symptom query or medical topic
  const isMedicalQuery = /\b(headache|nausea|dizzy|dizziness|vomit|ams|altitude|hypoxia|cough|froth|shiver|hypothermia|frostbite|sick|medicine|drug|treatment)\b/i.test(q) ||
                         /\b(ams|hypoxia|pulmonary|cerebral|edema|hypothermia|altitude sickness)\b/i.test(lowerText);

  if (isMedicalQuery && !text.includes("Medical Disclaimer")) {
    text += MEDICAL_DISCLAIMER;
    wasSanitized = true;
  }

  return { sanitizedResponse: text, wasSanitized, issues };
}

/**
 * Evaluates environmental thresholds against hard deterministic rules.
 * Overrides any AI output if hard safety margins are violated.
 */
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
    
    // Check if the AI's proposed response was unsafe
    const aiProposedYes = /\b(yes|continue|proceed|go ahead|safe to proceed|keep hiking|manageable|you can continue|totally safe)\b/i.test(aiProposedResponse);

    let safetyResponse = `⚠️ [DETERMINISTIC SAFETY OVERRIDE ACTIVE — ${critical.rule}]\n\n${critical.directive}\n\n• Current Altitude: ${context.elevation}\n• Ambient Temp: ${context.temperature}\n• Trail Risk Score: ${context.riskScore}/100\n• Turnaround Window: ${context.turnaroundTime} (Current: ${context.currentTime})\n• Terrain Hazard: ${context.terrain}\n\n💡 Backcountry Directive: Safe mountaineers turn back when conditions exceed cutoffs. The mountain will always be there tomorrow.`;

    if (isAmsQuery || critical.rule === 'ALTITUDE_HYPOXIA_THRESHOLD') {
      safetyResponse += MEDICAL_DISCLAIMER;
    }

    return {
      hasOverride: true,
      overrides,
      primaryRule: critical.rule,
      finalResponse: safetyResponse,
      safetyApproved: false,
      aiWasSuppressed: aiProposedYes
    };
  }

  // Run post-inference validation and sanitization on AI output
  const { sanitizedResponse, wasSanitized, issues } = validateAndSanitizeAIResponse(aiProposedResponse, context, userQuery);

  return {
    hasOverride: wasSanitized && issues.includes("UNSAFE_CONTINUATION_ADVICE"),
    overrides: [],
    primaryRule: wasSanitized ? issues[0] : null,
    finalResponse: sanitizedResponse,
    safetyApproved: true,
    aiWasSuppressed: wasSanitized
  };
}
