import React from 'react';
import { Mountain, MapPin, TreePine, Sparkles, Navigation, ChevronRight, Check } from 'lucide-react';
import { TRAILS_DATA } from '../data/trailData';

export default function TrailsView({ currentTrail, onSelectTrail }) {
  return (
    <div className="space-y-6 animate-fadeIn select-none w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="outdoor-card p-6 bg-[#F2F8F4] border-[#C8DEC8] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[#285943] flex items-center justify-center text-[#FBF8EF]">
              <MapPin className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-[#1A2E22]">
              Backcountry Trail Ecosystems
            </h1>
          </div>
          <p className="text-xs text-[#285943] font-medium">
            All 4 ecosystems are fully offline-cached with topological elevation, TabPFN microclimate priors, and bioacoustic fauna profiles.
          </p>
        </div>
      </div>

      {/* 4 Ecosystem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRAILS_DATA.map(t => {
          const isSelected = currentTrail?.id === t.id;
          return (
            <div 
              key={t.id} 
              className={`outdoor-card p-5 bg-[#F2F8F4] flex flex-col justify-between border-2 transition ${
                isSelected 
                  ? 'border-[#285943] bg-[#E2EFE5] shadow-md ring-1 ring-[#285943]' 
                  : 'border-[#C8DEC8] hover:border-[#285943]/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-black text-[#1A2E22]">
                      {t.name}
                    </h3>
                    <p className="text-xs text-[#285943] font-medium">{t.park}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E2EFE5] text-[#285943] border border-[#C8DEC8] font-bold text-xs">
                    {t.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs p-2.5 rounded-xl bg-[#EAF3EC] border border-[#C8DEC8]">
                  <div>
                    <span className="text-[10px] text-[#285943] font-medium block">Distance</span>
                    <strong className="text-[#1A2E22] font-mono">{t.distance.split(' ')[0]} mi</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#285943] font-medium block">Elevation</span>
                    <strong className="text-[#1A2E22] font-mono">{t.elevationGain}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#285943] font-medium block">Foliage</span>
                    <strong className="text-[#9C4A2F] font-mono">{t.foliageMetrics.peakPercentage}%</strong>
                  </div>
                </div>

                <div className="text-xs text-[#285943] space-y-1 mb-3">
                  <p><strong className="text-[#1A2E22]">Microclimate:</strong> {t.microclimateTabPFN.predictedTempRange} • Frost Prob: {t.microclimateTabPFN.frostProbability}%</p>
                  <p><strong className="text-[#1A2E22]">Resident Fauna:</strong> {t.bioacoustics.map(b => b.commonName).join(', ')}</p>
                  <p className="text-[#1A2E22] font-bold">Turnaround: <span className="text-[#9C4A2F]">{t.microclimateTabPFN.safeTurnaroundTime}</span></p>
                </div>
              </div>

              <button
                onClick={() => onSelectTrail(t.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#285943] text-[#FBF8EF] shadow-sm'
                    : 'bg-[#285943] hover:bg-[#1f4229] text-[#FBF8EF] shadow-sm'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />}
                <span>{isSelected ? "Active on Dashboard" : "Set Active Trail"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
