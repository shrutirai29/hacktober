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
  Box,
  ShieldCheck,
  Luggage,
  Wand2,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({
  activeNav = "Home",
  onSelectNav,
  memoryCount = 4
}) {
  const workspaceNav = [
    { id: "Home", label: "3D Room Twin", icon: Box, badge: "Hero" },
    { id: "NewRoom", label: "Scan & Reconstruct", icon: Wand2, badge: "AI" },
    { id: "NewTrip", label: "Plan New Trip", icon: PlusCircle, badge: null },
    { id: "MyChecklists", label: "Trip History", icon: ClipboardList, badge: null },
  ];

  const intelligenceNav = [
    { id: "MemoryVault", label: "Memory Vault", icon: History, badge: memoryCount },
    { id: "CompareTrips", label: "Compare Trips", icon: Split, badge: null },
    { id: "AudioCoach", label: "Voice Exit Coach", icon: Volume2, badge: null },
    { id: "GemmaCore", label: "Gemma Inspector", icon: Cpu, badge: "Core" },
  ];

  const systemNav = [
    { id: "Settings", label: "Settings & Models", icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#ece6dc] flex flex-col justify-between p-4 shrink-0 min-h-screen select-none">
      
      {/* Brand & Menu Container */}
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="px-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7054E8] via-[#6366f1] to-purple-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white shrink-0">
              <Luggage className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-[#1e1b4b] tracking-tight">
                  Check<span className="text-[#7054E8]">Mate</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-[#7054E8] text-[9px] font-black uppercase tracking-wider">
                  v2.2
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                Pack Smart • Leave Nothing
              </p>
            </div>
          </div>

          {/* Engine Status Micro-Pill */}
          <div className="mt-3 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#faf8f5] border border-[#ede7dd] text-[10px] font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Gemma 2.2 + PaliGemma Vision Active</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          
          {/* Group 1: Workspace */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Workspace
            </span>
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#ede9fe] text-[#5b21b6] shadow-xs'
                      : 'text-slate-600 hover:bg-[#faf7f2] hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#7054E8]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                      isActive 
                        ? 'bg-purple-200 text-purple-800' 
                        : 'bg-purple-100/70 text-purple-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 2: Intelligence & Memory */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              AI & Memory
            </span>
            {intelligenceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#ede9fe] text-[#5b21b6] shadow-xs'
                      : 'text-slate-600 hover:bg-[#faf7f2] hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#7054E8]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                      item.id === "MemoryVault"
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-purple-100/70 text-purple-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 3: System */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              System
            </span>
            {systemNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#ede9fe] text-[#5b21b6] shadow-xs'
                      : 'text-slate-600 hover:bg-[#faf7f2] hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#7054E8]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Bottom User Card: Alex @ Hostel C-402 */}
      <div className="pt-4 border-t border-[#f0eae0]">
        <div className="bg-[#faf8f5] rounded-2xl p-3 border border-[#ede7dd] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
            AC
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1e1b4b] truncate">
                Alex Chen
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">
              Hostel Room C-402
            </span>
          </div>
        </div>

        {/* Protection Note */}
        <div className="mt-2 px-1 flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-3 h-3" />
            <span>4 items guarded</span>
          </span>
          <span className="text-slate-400 font-mono">Local-First</span>
        </div>
      </div>

    </aside>
  );
}
