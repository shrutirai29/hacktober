import React from 'react';
import { 
  Home, 
  PlusCircle, 
  Layers, 
  Camera, 
  History, 
  Lightbulb, 
  Settings 
} from 'lucide-react';

export default function Sidebar({
  activeNav = "Home",
  onSelectNav
}) {
  const navItems = [
    { id: "Home", label: "Home", icon: Home },
    { id: "NewTrip", label: "New Trip", icon: PlusCircle },
    { id: "MyChecklists", label: "My Checklists", icon: Layers },
    { id: "NewRoom", label: "Scan My Room", icon: Camera },
    { id: "CompareTrips", label: "Past Trips", icon: History },
    { id: "MemoryVault", label: "Forgotten Items", icon: Lightbulb },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-[240px] faded-glass-sidebar rounded-3xl flex flex-col justify-between shrink-0 select-none overflow-hidden h-[calc(100vh-2rem)]">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col">
        
        {/* Brand Header */}
        <div className="pt-5 pb-2 px-4 flex flex-col items-center text-center">
          {/* 3D Pastel Suitcase Logo */}
          <div className="w-16 h-12 flex items-center justify-center">
            <img 
              src="/assets/sidebar_logo_suitcase.png" 
              alt="CheckMate 3D Suitcase"
              className="max-h-full max-w-full object-contain drop-shadow-xs"
            />
          </div>

          {/* Brand Name & Tagline */}
          <h1 className="font-extrabold text-2xl text-[#18113C] tracking-tight mt-1">
            CheckMate
          </h1>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5 tracking-tight">
            Pack Smart, Travel Light
          </p>
        </div>

        {/* Navigation Menu List */}
        <nav className="space-y-1 px-3 mt-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectNav?.(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EBE6FA]/90 backdrop-blur-xs text-[#5B21B6] shadow-xs border border-white/60'
                    : 'text-[#18113C] hover:bg-white/50 hover:text-[#18113C]'
                }`}
              >
                <Icon 
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isActive ? 'text-[#5B21B6]' : 'text-[#18113C]'
                  }`} 
                  strokeWidth={2}
                />
                <span className="text-[13px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Adorable 3D Illustration - Seamless Edge-to-Edge Artwork clipped by rounded bottom corners */}
      <div className="mt-auto relative w-full overflow-hidden select-none pointer-events-none rounded-b-3xl">
        <img
          src="/assets/sidebar_cat_decor.png"
          alt="Good Trips, Better Stories"
          className="w-full h-auto object-cover object-bottom block"
        />
      </div>

    </aside>
  );
}
