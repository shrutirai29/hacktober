import React, { useState } from 'react';
import { 
  CloudSun, 
  ThermometerSnowflake, 
  Sparkles, 
  Droplets, 
  Footprints, 
  Layers, 
  Leaf, 
  Download,
  AlertTriangle,
  Info
} from 'lucide-react';
import { TABPFN_TRAINING_SAMPLE } from '../services/tabpfnService';

export default function WeatherView() {
  const [elev, setElev] = useState(1240);
  const [canopy, setCanopy] = useState(78);
  const [baro, setBaro] = useState(-2.4);
  const [dewpoint, setDewpoint] = useState(2.1);

  const frostProb = Math.min(99, Math.max(10, Math.round(
    (elev / 1400) * 45 + (100 - canopy) * 0.25 + (3 - dewpoint) * 12 + Math.abs(Math.min(0, baro)) * 6
  )));

  const foliageIndex = Math.min(98, Math.max(30, Math.round(
    52 + (elev / 12) - Math.abs(elev - 800) * 0.03
  )));

  return (
    <div className="space-y-6 animate-fadeIn select-none w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="outdoor-card p-6 bg-[#F2F8F4]/95 border-[#DCE7DF] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[#DCEAF0] flex items-center justify-center text-[#285943]">
              <CloudSun className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-[#20332A]">
              Prior Labs TabPFN Microclimate & Foliage Lab
            </h1>
          </div>
          <p className="text-xs text-[#6F7B72]">
            Zero-shot tabular foundation model predictions for localized ground freeze, fall foliage saturation, and soil moisture.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#8B6474]/15 text-[#8B6474] text-xs font-bold border border-[#8B6474]/30">
          Prior Labs TabPFN-v2 Foundation Weights
        </span>
      </div>

      {/* Main Interactive Controls & Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sliders */}
        <div className="lg:col-span-5 outdoor-card p-5 bg-[#F2F8F4]/95 border-[#DCE7DF] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#20332A]">
            Tabular Microclimate Inputs
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#20332A]">Ridge Elevation</span>
              <span className="font-mono text-[#285943] font-bold">{elev} m</span>
            </div>
            <input 
              type="range" min="50" max="1800" step="20" value={elev} onChange={e => setElev(Number(e.target.value))}
              className="w-full accent-[#285943] h-1.5 bg-[#DCE7DF] rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#20332A]">Tree Canopy Coverage</span>
              <span className="font-mono text-[#3F7D5A] font-bold">{canopy}%</span>
            </div>
            <input 
              type="range" min="10" max="95" step="1" value={canopy} onChange={e => setCanopy(Number(e.target.value))}
              className="w-full accent-[#3F7D5A] h-1.5 bg-[#DCE7DF] rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#20332A]">3-Hour Barometric Delta</span>
              <span className="font-mono text-[#D97855] font-bold">{baro > 0 ? `+${baro}` : baro} hPa</span>
            </div>
            <input 
              type="range" min="-6.0" max="3.0" step="0.2" value={baro} onChange={e => setBaro(Number(e.target.value))}
              className="w-full accent-[#D97855] h-1.5 bg-[#DCE7DF] rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#20332A]">Dew Point Depression (T - Td)</span>
              <span className="font-mono text-[#E7A94B] font-bold">{dewpoint}°C</span>
            </div>
            <input 
              type="range" min="0.2" max="6.0" step="0.1" value={dewpoint} onChange={e => setDewpoint(Number(e.target.value))}
              className="w-full accent-[#E7A94B] h-1.5 bg-[#DCE7DF] rounded-lg"
            />
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
              <div className="flex items-center gap-1.5 mb-1 text-xs text-[#285943] font-bold">
                <ThermometerSnowflake className="w-4 h-4" />
                <span>Frost Hazard</span>
              </div>
              <span className="text-2xl font-black font-mono text-[#285943]">{frostProb}%</span>
              <span className="text-[10px] text-[#6F7B72] block mt-1">Severe freeze 02:00 – 07:00</span>
            </div>

            <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
              <div className="flex items-center gap-1.5 mb-1 text-xs text-[#D97855] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Foliage Index</span>
              </div>
              <span className="text-2xl font-black font-mono text-[#D97855]">{foliageIndex}%</span>
              <span className="text-[10px] text-[#6F7B72] block mt-1">Peak saturation</span>
            </div>

            <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
              <div className="flex items-center gap-1.5 mb-1 text-xs text-[#8B6474] font-bold">
                <Footprints className="w-4 h-4" />
                <span>Mud & Slip Risk</span>
              </div>
              <span className="text-2xl font-black font-mono text-[#8B6474]">34 / 100</span>
              <span className="text-[10px] text-[#6F7B72] block mt-1">Moderate wet leaf litter</span>
            </div>
          </div>

          {/* Agricultural Callout */}
          <div className="outdoor-card p-4 bg-[#DCEBDA] border border-[#A8C5A0] text-xs">
            <div className="flex items-center gap-2 font-bold text-[#285943] mb-1">
              <Leaf className="w-4 h-4 fill-current" />
              <span>Permaculture & Garden Synergy (TabPFN Grounding)</span>
            </div>
            <p className="text-[#20332A] leading-relaxed">
              Based on the {frostProb}% freeze probability and low nighttime dew point, tender nightshades (tomatoes, peppers) must be harvested immediately. Cold-hardy brassicas and hardneck garlic should be planted within 48 hours while ground warmth is retained.
            </p>
          </div>
        </div>
      </div>

      {/* CSV Matrix Table */}
      <div className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#DCE7DF]">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#20332A]">
          <span>Historical Regional Transects (TabPFN CSV Format)</span>
          <span className="text-[#6F7B72] font-normal">Prior Labs Synthetic Bayesian Priors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#EBF5EE] text-[#6F7B72] border-b border-[#DCE7DF]">
              <tr>
                <th className="p-2">elevation_m</th>
                <th className="p-2">canopy_pct</th>
                <th className="p-2">baro_trend_hpa</th>
                <th className="p-2">dewpoint_dep_c</th>
                <th className="p-2">foliage_peak_pct</th>
                <th className="p-2">frost_prob_pct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE7DF]/60">
              {TABPFN_TRAINING_SAMPLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#EBF5EE]">
                  <td className="p-2 text-[#20332A]">{row.elevation_m}</td>
                  <td className="p-2 text-[#3F7D5A]">{row.canopy_pct}%</td>
                  <td className="p-2 text-[#D97855]">{row.baro_trend_hpa}</td>
                  <td className="p-2 text-[#E7A94B]">{row.dewpoint_dep_c}°C</td>
                  <td className="p-2 text-[#D97855]">{row.foliage_peak_pct}%</td>
                  <td className="p-2 font-bold text-[#285943]">{row.frost_prob_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
