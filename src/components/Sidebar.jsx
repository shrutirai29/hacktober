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
    <aside className="w-[260px] bg-[#FAF8F5] border-r border-[#ECE6DC] flex flex-col justify-between shrink-0 min-h-screen select-none overflow-hidden">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col">
        
        {/* Brand Header */}
        <div className="pt-6 pb-4 px-4 flex flex-col items-center text-center">
          {/* 3D Pastel Suitcase Logo */}
          <div className="w-20 h-14 flex items-center justify-center">
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
          <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-tight">
            Pack Smart, Travel Light
          </p>
        </div>

        {/* Navigation Menu List */}
        <nav className="space-y-1.5 px-3 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectNav?.(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EBE6FA] text-[#5B21B6] shadow-xs'
                    : 'text-[#18113C] hover:bg-[#F3EFE8] hover:text-[#18113C]'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 shrink-0 ${
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

      {/* Bottom Adorable 3D Illustration (Cat on Suitcases with Sticky Note) */}
      <div className="mt-auto relative w-full overflow-hidden select-none pointer-events-none">
        <img
          src="/assets/sidebar_cat_decor.png"
          alt="Good Trips, Better Stories"
          className="w-full h-auto object-cover object-bottom block"
        />
      </div>

    </aside>
  );
}
