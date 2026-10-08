import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function TrailEcosystemsCard({ currentTrail, onSelectTrail, onOpenTrailsView }) {
  const ecosystems = [
    {
      id: "hampta-pass",
      name: "Hampta Pass Crossover",
      thumb: "/assets/eco_sunburst.jpg",
      sub: "Kullu to Spiti • 4,270 m"
    },
    {
      id: "triund-ridge",
      name: "Triund & Indrahar Ridge",
      thumb: "/assets/eco_whispering_pines.jpg",
      sub: "Dhauladhar Wall • 4,342 m"
    },
    {
      id: "chandrashila-peak",
      name: "Chandrashila & Tungnath",
      thumb: "/assets/eco_bear_mountain.jpg",
      sub: "Highest Shiva Shrine • 4,000 m"
    },
    {
      id: "kedarnath-ridge",
      name: "Kedarnath Summit Ridge",
      thumb: "/assets/eco_frost_peak.jpg",
      sub: "Colossal Glacial Wall • 6,940 m"
    }
  ];

  return (
    <div className="outdoor-card p-4 bg-[#F2F8F4] border-[#C8DEC8] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-extrabold text-[#1A2E22]">
          Trail Ecosystems
        </h3>

        <button 
          onClick={onOpenTrailsView}
          className="text-[10px] text-[#285943] font-bold hover:underline flex items-center"
        >
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Ecosystem Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ecosystems.map((eco) => {
          const isSelected = currentTrail?.id === eco.id;
          return (
            <div
              key={eco.id}
              onClick={() => onSelectTrail(eco.id)}
              className={`p-1.5 rounded-xl border cursor-pointer transition flex flex-col justify-between group ${
                isSelected
                  ? 'border-[#285943] bg-[#E2EFE5] shadow-sm ring-1 ring-[#285943]'
                  : 'border-[#C8DEC8] bg-[#F2F8F4] hover:bg-[#EAF3EC] hover:border-[#285943]/60'
              }`}
            >
              <div className="w-full h-11 rounded-lg overflow-hidden mb-1">
                <img 
                  src={eco.thumb} 
                  alt={eco.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-[#20332A] line-clamp-1 leading-tight">
                  {eco.name}
                </h4>
                <span className="text-[8px] text-[#6F7B72] block">
                  {eco.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
