import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ThermometerSnowflake, 
  Sparkles, 
  Droplets, 
  Gauge, 
  Table, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { runTabPfnInference, TABPFN_TRAINING_SAMPLE } from '../services/tabpfnService';

export default function TabPfnFoliagePredictor({ currentTrail }) {
  // Feature inputs
  const [elevationM, setElevationM] = useState(380);
  const [canopyPct, setCanopyPct] = useState(74);
  const [baroTrendHpa, setBaroTrendHpa] = useState(-1.8);
  const [dewPointDepC, setDewPointDepC] = useState(1.6);
  
  // TabPFN Outputs
  const [predictions, setPredictions] = useState(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [activeTab, setActiveTab] = useState('predictions'); // 'predictions' or 'dataset'

  const computePredictions = async () => {
    setIsInferencing(true);
    const result = await runTabPfnInference({
      elevation_m: elevationM,
      canopy_pct: canopyPct,
      baro_trend_hpa: baroTrendHpa,
      dewpoint_dep_c: dewPointDepC
    });
    setPredictions(result);
    setIsInferencing(false);
  };

  useEffect(() => {
    computePredictions();
  }, [elevationM, canopyPct, baroTrendHpa, dewPointDepC]);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-5 py-4 bg-stone-950/80 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-300">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-100">
                TabPFN Microclimate & Frost Forecaster
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                Prior Labs Tabular Foundation Model
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Zero-shot tabular inference from local elevation, barometrics, and canopy history CSVs
            </p>
          </div>
        </div>

        {/* Tab switch between Live Prediction and Training Table */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-3 py-1 rounded-lg transition ${
              activeTab === 'predictions'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Live Forecaster
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-1 rounded-lg transition ${
              activeTab === 'dataset'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            CSV Matrix
          </button>
        </div>
      </div>

      {activeTab === 'predictions' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Controls: Feature inputs */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-stone-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-stone-300 uppercase tracking-wider">
              <span>TABULAR TELEMETRY INPUTS</span>
              <span className="text-[11px] font-mono text-amber-400">4 Microclimate Features</span>
            </div>

            {/* Elevation Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Ridge Elevation</span>
                <span className="font-mono text-amber-400 font-bold">{elevationM} m ({(elevationM * 3.28).toFixed(0)} ft)</span>
              </div>
              <input
                type="range"
                min="50"
                max="1800"
                step="25"
                value={elevationM}
                onChange={(e) => setElevationM(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Lapse rate cools ~6.5°C per 1,000m climb</span>
            </div>

            {/* Canopy Cover */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Tree Canopy Density</span>
                <span className="font-mono text-emerald-400 font-bold">{canopyPct}% Coverage</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={canopyPct}
                onChange={(e) => setCanopyPct(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Dense canopy traps terrestrial heat; clearings freeze earlier</span>
            </div>

            {/* Barometric Pressure Trend */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">3-Hour Barometric Delta</span>
                <span className={`font-mono font-bold ${baroTrendHpa < 0 ? 'text-rose-400' : 'text-teal-400'}`}>
                  {baroTrendHpa > 0 ? `+${baroTrendHpa}` : baroTrendHpa} hPa
                </span>
              </div>
              <input
                type="range"
                min="-6.0"
                max="3.0"
                step="0.2"
                value={baroTrendHpa}
                onChange={(e) => setBaroTrendHpa(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Rapid drop indicates cold front / squall passage</span>
            </div>

            {/* Dew Point Depression */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Dew Point Depression (T - Td)</span>
                <span className="font-mono text-cyan-400 font-bold">{dewPointDepC}°C</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.2"
                value={dewPointDepC}
                onChange={(e) => setDewPointDepC(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Values &lt; 2°C create dense fog, hoarfrost, and condensation</span>
            </div>
          </div>

          {/* Outputs: Prior Labs TabPFN Gauges */}
          <div className="lg:col-span-7 p-5 bg-stone-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  TABPFN ZERO-SHOT INFERENCE OUTPUTS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                  {predictions?.source || 'TabPFN Model'}
                </span>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Frost Danger Card */}
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-400 font-medium">Frost Probability</span>
                      <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-cyan-300">
                      {predictions?.frostProbabilityPct || 14}%
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-stone-400 leading-tight">
                    {predictions?.frostProbabilityPct > 60 ? '⚠️ High ground freeze risk' : 'Safe for autumn hiking'}
                  </div>
                </div>

                {/* Autumn Foliage Saturation */}
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-400 font-medium">Foliage Peak Index</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-amber-300">
                      {predictions?.foliagePeakPct || 88}%
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-stone-400 leading-tight">
                    Golden Sugar Maple & Scarlet Oak optimum
                  </div>
                </div>

                {/* Trail Mud / Slip Score */}
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-400 font-medium">Mud & Slip Hazard</span>
                      <Droplets className="w-4 h-4 text-rose-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-rose-300">
                      {predictions?.trailMudIndex || 22}/100
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-stone-400 leading-tight">
                    {predictions?.trailMudIndex > 50 ? 'Requires rugged lugged boots' : 'Firm gravel & dry leaf litter'}
                  </div>
                </div>
              </div>

              {/* Frost Danger Window Callout */}
              <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-900/50 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-200">TabPFN Microclimate Advisory: </span>
                  <span className="text-amber-300/90">
                    {predictions?.frostDangerWindow || 'No sudden thermal drop predicted before twilight.'}
                  </span>
                </div>
              </div>

              {/* Garden / Foraging Synergy Note */}
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                <span className="font-semibold text-emerald-300">Garden & Foraging Synergy: </span>
                <span className="text-stone-300">
                  {predictions?.frostProbabilityPct > 50 
                    ? 'Harvest remaining tender squash, tomatoes, and dahlias immediately. Optimal window for planting winter hardneck garlic cloves.'
                    : 'Soil temperatures are ideal for planting cold-hardy brassicas (kale, collards) and harvesting wild elderberries and rose hips.'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-stone-500 font-mono">
              Inference Runtime: &lt;14ms • Model: PriorLabs TabPFN-v2 Foundation Weights (No GPU required)
            </div>
          </div>
        </div>
      ) : (
        /* Tabular Historical CSV Sample */
        <div className="p-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-stone-300">
              HISTORICAL REGIONAL TRANSECT CSV DATASET
            </span>
            <span className="text-stone-500 font-mono">Input format for TabPFN</span>
          </div>

          <div className="overflow-x-auto border border-stone-800 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                <tr>
                  <th className="p-2.5">elevation_m</th>
                  <th className="p-2.5">canopy_pct</th>
                  <th className="p-2.5">baro_trend_hpa</th>
                  <th className="p-2.5">dewpoint_dep_c</th>
                  <th className="p-2.5">foliage_peak_pct</th>
                  <th className="p-2.5">frost_prob_pct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 bg-stone-900/50">
                {TABPFN_TRAINING_SAMPLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-800/40">
                    <td className="p-2.5 text-stone-200">{row.elevation_m}</td>
                    <td className="p-2.5 text-emerald-300">{row.canopy_pct}%</td>
                    <td className="p-2.5 text-rose-300">{row.baro_trend_hpa}</td>
                    <td className="p-2.5 text-cyan-300">{row.dewpoint_dep_c}°C</td>
                    <td className="p-2.5 text-amber-300">{row.foliage_peak_pct}%</td>
                    <td className="p-2.5 text-stone-100 font-bold">{row.frost_prob_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-stone-400 mt-3 leading-relaxed">
            Prior Labs' TabPFN is a tabular foundation model trained on synthetic Bayesian priors. It performs zero-shot prediction on tabular rows like these in milliseconds, beating gradient boosted trees (XGBoost/LightGBM) on small tabular datasets without requiring hyperparameter tuning.
          </p>
        </div>
      )}
    </div>
  );
}
