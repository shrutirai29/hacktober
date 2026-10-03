import React from 'react';
import { 
  Briefcase, 
  Calendar, 
  Sun, 
  RefreshCw, 
  Sparkles,
  Plane,
  ChevronDown
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
  isGenerating
}) {
  return (
    <div className="space-y-4">
      
      {/* Top Greeting & Pastel Cloud Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fdfbf7] via-[#faf5ee] to-[#f4e8e1] p-6 sm:p-7 border border-[#ede5da] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Greeting */}
        <div className="space-y-1.5 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b] tracking-tight">
              Hey Alex! 👋
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Scan your room, tell me your trip, and let's make sure you don't leave anything behind.
          </p>
        </div>

        {/* Right: Decorative Banner (Airplane + Wooden Signs) */}
        <div className="relative z-10 shrink-0 self-end md:self-auto h-24 sm:h-28 flex items-center">
          <img
            src="/assets/top_banner.jpg"
            alt="Travel inspiration banner"
            className="h-full object-contain rounded-2xl drop-shadow-sm"
          />
        </div>

        {/* Soft background pastel glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Horizontal Filter Bar Card */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#ede7dd] shadow-sm shadow-slate-200/50 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Form Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          
          {/* Trip Purpose */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eee8dd]">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Trip Purpose
              </span>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
              >
                <option value="College Presentation">College Presentation</option>
                <option value="Hostel to Home">Hostel to Home</option>
                <option value="Weekend Trip">Weekend Trip</option>
                <option value="Hackathon / Tech Conference">Hackathon</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eee8dd]">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Duration
              </span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
              >
                <option value="2-3 Days (Weekend)">2-3 Days (Weekend)</option>
                <option value="Day Trip (8h)">Day Trip (8h)</option>
                <option value="1 Week">1 Week</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>
          </div>

          {/* Weather */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eee8dd]">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Weather
              </span>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
              >
                <option value="Rain Forecast (18°C)">Rain Forecast (18°C)</option>
                <option value="Pleasant (24°C)">Pleasant (24°C)</option>
                <option value="Hot & Sunny (32°C)">Hot & Sunny (32°C)</option>
                <option value="Cold / Windy (12°C)">Cold / Windy (12°C)</option>
              </select>
            </div>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eee8dd]">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Mode
              </span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
              >
                <option value="departure">Departure Packing</option>
                <option value="return">Return Safe Audit</option>
              </select>
            </div>
          </div>

        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-5 py-3 rounded-xl bg-[#1e1b4b] hover:bg-[#2e2a72] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isGenerating ? "Generating..." : "Generate Checklist ✨"}</span>
        </button>

      </div>

    </div>
  );
}
