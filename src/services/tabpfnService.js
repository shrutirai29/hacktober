// TabPFN (Prior Labs Tabular Foundation Model) Service
// Predicts microclimates, frost dates, and autumn foliage saturation directly from tabular data.

export const TABPFN_TRAINING_SAMPLE = [
  { elevation_m: 210, canopy_pct: 78, baro_trend_hpa: -1.2, dewpoint_dep_c: 2.1, foliage_peak_pct: 85, frost_prob_pct: 12 },
  { elevation_m: 450, canopy_pct: 65, baro_trend_hpa: -2.8, dewpoint_dep_c: 1.0, foliage_peak_pct: 92, frost_prob_pct: 44 },
  { elevation_m: 820, canopy_pct: 40, baro_trend_hpa: -3.5, dewpoint_dep_c: 0.5, foliage_peak_pct: 98, frost_prob_pct: 82 },
  { elevation_m: 1250, canopy_pct: 20, baro_trend_hpa: -4.1, dewpoint_dep_c: 0.2, foliage_peak_pct: 60, frost_prob_pct: 96 },
  { elevation_m: 110, canopy_pct: 85, baro_trend_hpa: +0.5, dewpoint_dep_c: 4.5, foliage_peak_pct: 68, frost_prob_pct: 5 }
];

export async function runTabPfnInference(inputRow, backendUrl = "http://localhost:8000/api/tabpfn/predict") {
  // If Python backend with TabPFN is running, call it
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: inputRow }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        source: "TabPFN Python Foundation Model (Prior Labs local backend)"
      };
    }
  } catch (err) {
    // Graceful offline fallback: TabPFN zero-shot prior emulation
  }

  // Pure Offline TabPFN Zero-Shot Prior Emulation
  const { elevation_m = 400, canopy_pct = 70, baro_trend_hpa = -1.5, dewpoint_dep_c = 1.8 } = inputRow;

  // Elevation lapse rate: ~6.5C drop per 1000m
  const lapseFactor = (elevation_m / 1000) * 0.45;
  const radiationFactor = (1 - canopy_pct / 100) * 0.35; // Open canopy loses heat faster at night
  const humidityRisk = (1 / Math.max(0.1, dewpoint_dep_c)) * 0.2;
  const baroPenalty = baro_trend_hpa < 0 ? Math.abs(baro_trend_hpa) * 0.08 : 0;

  const rawFrost = Math.min(0.99, Math.max(0.02, (lapseFactor + radiationFactor + humidityRisk + baroPenalty)));
  const frostProbPct = Math.round(rawFrost * 100);

  // Fall foliage peak progression curve based on thermal elevation sum
  let peakFoliage = 50 + (elevation_m / 12) - Math.abs(elevation_m - 650) * 0.04;
  peakFoliage = Math.min(99, Math.max(25, Math.round(peakFoliage)));

  // Ground mud & slip index
  const mudIndex = Math.min(95, Math.max(10, Math.round((canopy_pct * 0.4) + ((4 - Math.min(4, dewpoint_dep_c)) * 14))));

  return {
    frostProbabilityPct: frostProbPct,
    foliagePeakPct: peakFoliage,
    trailMudIndex: mudIndex,
    frostDangerWindow: frostProbPct > 60 ? "Severe ground frost predicted between 02:00 - 07:00" : (frostProbPct > 30 ? "Light frost possible in valleys before dawn" : "No frost hazard"),
    source: "PHYSICS FALLBACK (Atmospheric Lapse Rate & Radiative Model)",
    isPhysicsFallback: true
  };
}
