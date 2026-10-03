import React from 'react';
import { 
  Briefcase, 
  Calendar, 
  Sun, 
  RefreshCw, 
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  CloudRain
} from 'lucide-react';

export default function HeaderBanner({
  tripType,
  setTripType,
  duration,
  setDuration,
  weather,
  setWeather,
  mode,
  setMode,
  onGenerate,
  isGenerating,
  onTriggerVoice,
  isVoicePlaying
}) {
  return (
    <div className="space-y-3">
      
      {/* Top Banner Card: Clean, Modern, Purpose-driven */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ece6dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Destination & Mission */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] text-[11px] font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-ping" />
              Departure Station • Room C-402
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs font-bold text-slate-500">
              Alex's Personal Exit Guard
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight flex items-center gap-2">
            <span>Leaving for</span>
            <span className="text-[#6366f1] underline decoration-indigo-200 decoration-wavy underline-offset-4">
              {tripType}
            </span>
            <span>🎒</span>
          </h2>

          <p className="text-xs text-slate-400 font-medium max-w-xl">
            Gemma cross-references your physical room scan with previously forgotten essentials to protect your departure.
          </p>
        </div>

        {/* Right: Quick Actions (Voice Briefing + Synthesize) */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          {onTriggerVoice && (
            <button
              onClick={onTriggerVoice}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                isVoicePlaying
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-[#faf8f5] hover:bg-[#f3eee5] text-[#241746] border-[#e7e0d3]'
              }`}
            >
              {isVoicePlaying ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-500" />
                  <span>Stop Briefing</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#7054E8]" />
                  <span>Voice Briefing</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-2xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? "Synthesizing..." : "Synthesize Manifest"}</span>
          </button>
        </div>

      </div>

      {/* Horizontal Context Chips Strip (Crisp, clean, compact) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* 1. Trip Purpose */}
        <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#ece6dc] shadow-xs flex items-center gap-2.5 hover:border-purple-300 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider leading-none mb-1">
              Purpose
            </span>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#1e1b4b] focus:outline-none cursor-pointer truncate"
            >
              <option value="College Presentation">College Presentation</option>
              <option value="Hostel to Home">Hostel to Home</option>
              <option value="Weekend Trip">Weekend Trip</option>
              <option value="Hackathon / Tech Conference">Hackathon</option>
            </select>
          </div>
        </div>

        {/* 2. Duration */}
        <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#ece6dc] shadow-xs flex items-center gap-2.5 hover:border-purple-300 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider leading-none mb-1">
              Duration
            </span>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#1e1b4b] focus:outline-none cursor-pointer truncate"
            >
              <option value="2-3 Days (Weekend)">2-3 Days (Weekend)</option>
              <option value="Day Trip (8h)">Day Trip (8h)</option>
              <option value="1 Week">1 Week</option>
              <option value="Overnight">Overnight</option>
            </select>
          </div>
        </div>

        {/* 3. Weather */}
        <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#ece6dc] shadow-xs flex items-center gap-2.5 hover:border-purple-300 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            {weather.includes("Rain") ? (
              <CloudRain className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider leading-none mb-1">
              Weather
            </span>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#1e1b4b] focus:outline-none cursor-pointer truncate"
            >
              <option value="Rain Forecast (18°C)">Rain Forecast (18°C)</option>
              <option value="Pleasant (24°C)">Pleasant (24°C)</option>
              <option value="Hot & Sunny (32°C)">Hot & Sunny (32°C)</option>
              <option value="Cold / Windy (12°C)">Cold / Windy (12°C)</option>
            </select>
          </div>
        </div>

        {/* 4. Mode */}
        <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#ece6dc] shadow-xs flex items-center gap-2.5 hover:border-purple-300 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider leading-none mb-1">
              Mode
            </span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#1e1b4b] focus:outline-none cursor-pointer truncate"
            >
              <option value="departure">Departure Packing</option>
              <option value="return">Return Safe Audit</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
