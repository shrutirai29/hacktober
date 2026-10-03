import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  History, 
  Volume2, 
  VolumeX, 
  Split, 
  Cpu, 
  Heart,
  Radio,
  Luggage
} from 'lucide-react';

export default function Navbar({ 
  memoryCount, 
  onOpenMemory, 
  onOpenComparison, 
  onOpenAiInspector,
  onTriggerVoice,
  isVoicePlaying,
  friendName = "Alex"
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand with vibrant glowing gradient */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
            <div className="relative w-11 h-11 bg-slate-950 rounded-xl border border-slate-700/80 flex items-center justify-center shadow-inner">
              <Luggage className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">
                Check<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">Mate</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-bounce" /> Built for {friendName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1.5 mt-0.5">
              <span>Nothing gets left behind</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400/90 font-semibold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" /> Spatial Vision & Gemma AI
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Comparison Demo Button */}
          <button
            onClick={onOpenComparison}
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-indigo-900/80 hover:from-indigo-900 hover:to-purple-900 text-indigo-200 border border-indigo-700/60 text-xs font-bold transition-all shadow-lg shadow-indigo-950/40 hover:scale-[1.03] active:scale-95"
            title="Side-by-side demo: Weekend Home vs College Presentation"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <Split className="w-3.5 h-3.5 text-indigo-300 group-hover:rotate-12 transition-transform" />
            <span>Compare Trips Demo</span>
          </button>

          {/* Forgotten Items Memory Vault */}
          <button
            onClick={onOpenMemory}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-amber-500/30 hover:border-amber-400/60 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
            title="View items Alex previously forgot and learned rules"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Memory</span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] shadow-sm">
              {memoryCount}
            </span>
          </button>

          {/* Voice Exit Coach */}
          <button
            onClick={onTriggerVoice}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-md ${
              isVoicePlaying
                ? 'bg-rose-950/90 text-rose-200 border-rose-500 shadow-rose-900/40'
                : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-600/50 hover:border-emerald-500 hover:scale-[1.02]'
            }`}
            title="Play Audio Exit Briefing (Voice Coach)"
          >
            {isVoicePlaying ? (
              <>
                {/* Audio Equalizer wave bars */}
                <div className="flex items-center gap-0.5 h-4">
                  <div className="w-1 bg-rose-400 rounded-full wave-bar-1" />
                  <div className="w-1 bg-rose-400 rounded-full wave-bar-2" />
                  <div className="w-1 bg-rose-400 rounded-full wave-bar-3" />
                  <div className="w-1 bg-rose-400 rounded-full wave-bar-4" />
                </div>
                <span>Speaking...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Voice Coach</span>
              </>
            )}
          </button>

          {/* Gemma AI Architecture Inspector */}
          <button
            onClick={onOpenAiInspector}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hover:border-cyan-500/60 text-xs font-semibold transition-all hover:scale-[1.02]"
            title="Inspect Gemma 2 Open-Weight Architecture & Prompt"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Gemma Core</span>
          </button>

        </div>
      </div>
    </header>
  );
}
