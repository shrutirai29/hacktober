import React from 'react';
import TrailTopo3D from '../components/TrailTopo3D';
import { Mountain, MapPin } from 'lucide-react';
import { TRAILS_DATA } from '../data/trailData';

export default function Map3DView({ currentTrail, audioMuted, onSelectTrail }) {
  const trailId = currentTrail?.id || 'hampta-pass';

  return (
    <div className="space-y-5 animate-fadeIn select-none w-full max-w-full overflow-hidden">
      {/* Dynamic Header & 4-Trail Switcher */}
      <div className="outdoor-card p-5 bg-[#F2F8F4]/98 border-[#C8DEC8] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
              <Mountain className="w-4 h-4 text-[#285943]" />
            </span>
            <h1 className="text-lg sm:text-xl font-black text-[#1A2E22]">
              {currentTrail?.name || "Himalayan 3D Digital Twin"}
            </h1>
          </div>
          <p className="text-xs text-[#486350] max-w-2xl">
            {currentTrail?.subtitle || "Explore authentic Himalayan topography, local microclimates, and alpine transitions in 3D WebGL."}
          </p>
        </div>

        {/* 4 Dedicated Trail Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#E2EFE5] p-1.5 rounded-2xl border border-[#C8DEC8]">
          {TRAILS_DATA.slice(0, 4).map((tr) => {
            const isActive = tr.id === trailId;
            const icon = tr.id === 'hampta-pass' ? '🌲' : tr.id === 'triund-ridge' ? '🏕️' : tr.id === 'chandrashila-peak' ? '🛕' : '❄️';
            return (
              <button
                key={tr.id}
                onClick={() => onSelectTrail && onSelectTrail(tr.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#285943] text-[#FBF8EF] shadow-md font-extrabold'
                    : 'bg-[#F2F8F4] text-[#486350] hover:text-[#1A2E22] hover:bg-white border border-[#C8DEC8]'
                }`}
              >
                <span>{icon}</span>
                <span className="whitespace-nowrap">{tr.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photorealistic 3D Model Dynamic Viewport */}
      <TrailTopo3D 
        currentTrail={currentTrail} 
        audioMuted={audioMuted} 
        onSelectTrail={onSelectTrail} 
      />
    </div>
  );
}
