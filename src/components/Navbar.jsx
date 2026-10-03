import React from 'react';
import { 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  History, 
  Volume2, 
  VolumeX, 
  Split, 
  Cpu, 
  Heart,
  ExternalLink
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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-[1.5px] shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">Check<span className="text-sky-400">Mate</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/60 hidden sm:inline-flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" /> Built for {friendName}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Nothing gets left behind • Open-Source AI Packing Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Comparison Demo Button */}
          <button
            onClick={onOpenComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-xs font-semibold transition-all shadow-sm hover:scale-[1.02]"
            title="Compare Weekend Home vs College Presentation checklists"
          >
            <Split className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Demo:</span> Compare Trips
          </button>

          {/* Forgotten Items Memory Vault */}
          <button
            onClick={onOpenMemory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            title="View items Alex previously forgot and learned rules"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Memory</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
              {memoryCount}
            </span>
          </button>

          {/* Voice Exit Coach */}
          <button
            onClick={onTriggerVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isVoicePlaying
                ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Play Audio Exit Briefing (Voice Coach)"
          >
            {isVoicePlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Audio Briefing</span>
              </>
            )}
          </button>

          {/* Gemma AI Inspector */}
          <button
            onClick={onOpenAiInspector}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/50 text-xs font-medium transition-all"
            title="Inspect Gemma 2 Open-Weight Architecture & Prompt"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Gemma Core</span>
          </button>

        </div>
      </div>
    </header>
  );
}
