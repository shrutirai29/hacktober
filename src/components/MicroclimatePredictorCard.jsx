import React, { useState } from 'react';
import { 
  CloudSun, 
  ThermometerSnowflake, 
  Sparkles, 
  Footprints, 
  Leaf, 
  ChevronRight, 
  Table, 
  Layers, 
  BarChart2
} from 'lucide-react';
import { runTabPfnInference } from '../services/tabpfnService';

export default function MicroclimatePredictorCard({ onOpenFullMatrix }) {
  const [elevation, setElevation] = useState(1240);
  const [canopy, setCanopy] = useState(78);
  const [pressureDelta, setPressureDelta] = useState(-2.4);
  const [dewPointDep, setDewPointDep] = useState(2.1);

  // Dynamic calculations based on slider inputs
  const frostProb = Math.min(99, Math.max(12, Math.round(
    (elevation / 1400) * 45 + (100 - canopy) * 0.25 + (3 - dewPointDep) * 12 + Math.abs(Math.min(0, pressureDelta)) * 6
  )));

  const foliageIndex = Math.min(98, Math.max(30, Math.round(
    52 + (elevation / 12) - Math.abs(elevation - 800) * 0.03
  )));

  const mudRisk = Math.min(95, Math.max(15, Math.round(
    (canopy * 0.25) + ((4 - Math.min(4, dewPointDep)) * 10)
  )));

  return (
    <div className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#C8DEC8] flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DCEAF0] flex items-center justify-center text-[#285943]">
              <CloudSun className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#20332A]">
              Microclimate & Foliage Predictor
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#E2EFE5] text-[#285943] text-[9px] font-bold border border-[#A8C8AF]">
              Analytical Physics Model
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#8B6474]/15 text-[#8B6474] text-[9px] font-bold">
              TabPFN Data Prior
            </span>
          </div>
        </div>

        {/* 4 Inputs with visual sliders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
          {/* Elevation */}
          <div className="p-2.5 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold text-[#5C7263] uppercase tracking-wider truncate">
                Elevation
              </span>
              <span className="font-extrabold text-[#1A2E22] font-mono text-[11px] shrink-0 bg-[#DCEBDA] px-1.5 py-0.5 rounded-md">
                {elevation} m
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1800"
              step="20"
              value={elevation}
              onChange={(e) => setElevation(Number(e.target.value))}
              className="w-full accent-[#285943] text-[#285943] h-1.5 bg-[#DCE7DF] rounded-lg cursor-pointer appearance-none"
            />
          </div>

          {/* Canopy Density */}
          <div className="p-2.5 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold text-[#5C7263] uppercase tracking-wider truncate">
                Canopy
              </span>
              <span className="font-extrabold text-[#1A2E22] font-mono text-[11px] shrink-0 bg-[#DCEBDA] px-1.5 py-0.5 rounded-md">
                {canopy}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="1"
              value={canopy}
              onChange={(e) => setCanopy(Number(e.target.value))}
              className="w-full accent-[#3F7D5A] text-[#3F7D5A] h-1.5 bg-[#DCE7DF] rounded-lg cursor-pointer appearance-none"
            />
          </div>

          {/* Pressure Delta */}
          <div className="p-2.5 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold text-[#5C7263] uppercase tracking-wider truncate">
                Pressure Δ
              </span>
              <span className="font-extrabold text-[#1A2E22] font-mono text-[11px] shrink-0 bg-[#DCEBDA] px-1.5 py-0.5 rounded-md">
                {pressureDelta > 0 ? `+${pressureDelta}` : pressureDelta} hPa
              </span>
            </div>
            <input
              type="range"
              min="-6.0"
              max="3.0"
              step="0.2"
              value={pressureDelta}
              onChange={(e) => setPressureDelta(Number(e.target.value))}
              className="w-full accent-[#D97855] text-[#D97855] h-1.5 bg-[#DCE7DF] rounded-lg cursor-pointer appearance-none"
            />
          </div>

          {/* Dew Point Depression */}
          <div className="p-2.5 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold text-[#5C7263] uppercase tracking-wider truncate">
                Dew Point
              </span>
              <span className="font-extrabold text-[#1A2E22] font-mono text-[11px] shrink-0 bg-[#DCEBDA] px-1.5 py-0.5 rounded-md">
                {dewPointDep}°C
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              value={dewPointDep}
              onChange={(e) => setDewPointDep(Number(e.target.value))}
              className="w-full accent-[#E7A94B] text-[#E7A94B] h-1.5 bg-[#DCE7DF] rounded-lg cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* 3 Result Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {/* Frost Hazard */}
          <div className="p-3 rounded-2xl bg-[#DCEAF0] border border-[#A8C5A0]/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-[#285943]" />
                <span className="text-[10px] font-semibold text-[#285943]">
                  Frost Hazard
                </span>
              </div>
              <span className="text-xl font-black text-[#285943] font-mono block">
                {frostProb}%
              </span>
            </div>
            <span className="text-[9px] text-[#6F7B72] leading-tight mt-1">
              {frostProb > 60 ? 'Severe frost between 02:00 – 07:00' : 'Light valley hoarfrost'}
            </span>
          </div>

          {/* Foliage Index */}
          <div className="p-3 rounded-2xl bg-[#E7A94B]/15 border border-[#E7A94B]/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D97855]" />
                <span className="text-[10px] font-semibold text-[#D97855]">
                  Foliage Index
                </span>
              </div>
              <span className="text-xl font-black text-[#D97855] font-mono block">
                {foliageIndex}%
              </span>
            </div>
            <span className="text-[9px] text-[#6F7B72] leading-tight mt-1">
              Peak color in 5–8 days
            </span>
          </div>

          {/* Mud Risk */}
          <div className="p-3 rounded-2xl bg-[#EBF5EE] border border-[#C8DEC8] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Footprints className="w-3.5 h-3.5 text-[#8B6474]" />
                <span className="text-[10px] font-semibold text-[#8B6474]">
                  Mud Risk
                </span>
              </div>
              <span className="text-xl font-black text-[#8B6474] font-mono block">
                {mudRisk} / 100
              </span>
            </div>
            <span className="text-[9px] text-[#6F7B72] leading-tight mt-1">
              Moderate wet leaf litter
            </span>
          </div>
        </div>

        {/* Planting Recommendations Callout */}
        <div className="p-2.5 rounded-xl bg-[#DCEBDA] border border-[#A8C5A0] flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-[11px]">
            <Leaf className="w-3.5 h-3.5 text-[#285943] shrink-0 fill-current" />
            <div>
              <span className="font-extrabold text-[#285943]">Planting Recommendations: </span>
              <span className="text-[#20332A]">
                {frostProb > 60
                  ? 'Plant garlic and kale now. Harvest tender orchard fruit before the freeze.'
                  : 'Great window for root vegetables and mulching perennials.'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#285943] shrink-0" />
        </div>
      </div>

      {/* Training Data (CSV Preview) Table */}
      <div className="pt-2 border-t border-[#C8DEC8]">
        <div className="flex items-center justify-between mb-2 text-[10px] font-bold text-[#6F7B72]">
          <span>Training Data (CSV Preview)</span>
          <button 
            onClick={onOpenFullMatrix}
            className="flex items-center gap-1 text-[#285943] hover:underline"
          >
            <BarChart2 className="w-3 h-3" />
            <span>View Matrix</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#C8DEC8] bg-[#EBF5EE]/60 shadow-xs">
          <table className="w-full min-w-[360px] text-[10px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#DCEBDA]/70 text-[#486350] border-b border-[#C8DEC8]">
                <th className="py-1.5 px-3 font-bold text-left whitespace-nowrap">Elevation</th>
                <th className="py-1.5 px-2.5 font-bold text-center whitespace-nowrap">Canopy</th>
                <th className="py-1.5 px-2.5 font-bold text-center whitespace-nowrap">Pressure Δ</th>
                <th className="py-1.5 px-2.5 font-bold text-center whitespace-nowrap">Dew Point</th>
                <th className="py-1.5 px-2.5 font-bold text-center whitespace-nowrap">Frost Prob</th>
                <th className="py-1.5 px-3 font-bold text-right whitespace-nowrap">Foliage Idx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8DEC8]/50 text-[#1A2E22]">
              <tr className="hover:bg-[#E2EFE5]/50 transition">
                <td className="py-1.5 px-3 font-semibold text-left">1200 m</td>
                <td className="py-1.5 px-2.5 text-center">0.78</td>
                <td className="py-1.5 px-2.5 text-center text-[#D97855] font-semibold">-2.4</td>
                <td className="py-1.5 px-2.5 text-center">2.1</td>
                <td className="py-1.5 px-2.5 text-center text-[#285943] font-bold">0.72</td>
                <td className="py-1.5 px-3 text-right text-[#D97855] font-bold">0.88</td>
              </tr>
              <tr className="hover:bg-[#E2EFE5]/50 transition">
                <td className="py-1.5 px-3 font-semibold text-left">800 m</td>
                <td className="py-1.5 px-2.5 text-center">0.65</td>
                <td className="py-1.5 px-2.5 text-center text-[#D97855] font-semibold">-1.1</td>
                <td className="py-1.5 px-2.5 text-center">3.4</td>
                <td className="py-1.5 px-2.5 text-center text-[#285943] font-bold">0.28</td>
                <td className="py-1.5 px-3 text-right text-[#D97855] font-bold">0.61</td>
              </tr>
              <tr className="hover:bg-[#E2EFE5]/50 transition">
                <td className="py-1.5 px-3 font-semibold text-left">1500 m</td>
                <td className="py-1.5 px-2.5 text-center">0.82</td>
                <td className="py-1.5 px-2.5 text-center text-[#D97855] font-semibold">-3.2</td>
                <td className="py-1.5 px-2.5 text-center">1.8</td>
                <td className="py-1.5 px-2.5 text-center text-[#285943] font-bold">0.81</td>
                <td className="py-1.5 px-3 text-right text-[#D97855] font-bold">0.91</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
