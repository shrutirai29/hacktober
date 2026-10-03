import React from 'react';
import { 
  Home, 
  PlusCircle, 
  ClipboardList, 
  History, 
  Split, 
  Volume2, 
  Cpu, 
  Settings,
  Sparkles,
  Luggage,
  Heart,
  Box
} from 'lucide-react';

export default function Sidebar({
  activeNav = "Home",
  onSelectNav,
  onOpenMemory,
  onOpenComparison,
  onOpenAiInspector,
  onTriggerVoice,
  memoryCount = 4
}) {
  const navItems = [
    { id: "Home", label: "Home", icon: Home, badge: null },
    { id: "NewRoom", label: "Create 3D Room", icon: Box, badge: "AI" },
    { id: "NewTrip", label: "New Trip", icon: PlusCircle, badge: null },
    { id: "MyChecklists", label: "My Checklists", icon: ClipboardList, badge: null },
    { id: "MemoryVault", label: "Memory Vault", icon: History, badge: memoryCount },
    { id: "CompareTrips", label: "Compare Trips", icon: Split, badge: null },
    { id: "AudioCoach", label: "Audio Coach", icon: Volume2, badge: null },
    { id: "GemmaCore", label: "Gemma Core", icon: Cpu, badge: null },
    { id: "Settings", label: "Settings", icon: Settings, badge: null },
  ];

  const handleNavClick = (id) => {
    onSelectNav?.(id);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#ece7de] flex flex-col justify-between p-4 shrink-0 min-h-screen">
      
      {/* Brand & Menu */}
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-purple-500/25 text-white">
            <Luggage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-xl text-[#1e1b4b] tracking-tight leading-none flex items-center gap-1">
              Check<span className="text-[#6366f1]">Mate</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              Pack Smart, Travel Light
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#ede9fe] text-[#5b21b6] shadow-sm'
                    : 'text-slate-600 hover:bg-[#f5f2eb] hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#6366f1]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sticky Note & Cozy Illustration */}
      <div className="space-y-3 pt-4 border-t border-[#f0ebe3]">
        
        {/* Tilted Sticky Note */}
        <div className="relative mx-1 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="bg-[#fffbeb] border border-[#fef08a] rounded-xl p-3 shadow-md shadow-amber-900/5 text-center">
            <div className="text-[11px] font-bold text-slate-700 leading-tight">
              Same you,
            </div>
            <div className="text-[11px] font-bold text-slate-700 leading-tight">
              Fewer
            </div>
            <div className="text-xs font-extrabold text-[#7c3aed] mt-0.5 flex items-center justify-center gap-1">
              <span>'Oops' moments</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            </div>
          </div>
        </div>

        {/* Cute Backpack Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-inner border border-[#ece7de] bg-[#fdfcfa]">
          <img
            src="/assets/backpack_decor.jpg"
            alt="CheckMate backpack"
            className="w-full h-36 object-cover object-center"
          />
        </div>

      </div>

    </aside>
  );
}
