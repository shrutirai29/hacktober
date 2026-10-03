import React from 'react';
import { 
  Compass, 
  Clock, 
  CloudRain, 
  Sun, 
  CloudSun, 
  Snowflake, 
  Sparkles,
  PlaneTakeoff,
  PlaneLanding,
  Briefcase,
  Home,
  Laptop,
  Car
} from 'lucide-react';

const TRIP_PURPOSES = [
  { label: "Hostel to Home", icon: Home, color: "text-sky-400" },
  { label: "College Presentation", icon: Briefcase, color: "text-indigo-400" },
  { label: "Weekend Trip", icon: Car, color: "text-emerald-400" },
  { label: "Hackathon / Tech Conference", icon: Laptop, color: "text-purple-400" }
];

const DURATIONS = [
  "Day Trip (8h)",
  "Weekend (2-3 days)",
  "1 Week",
  "Overnight"
];

const WEATHER_OPTIONS = [
  { label: "Pleasant (24°C)", icon: CloudSun, color: "text-amber-400" },
  { label: "Rain Forecast (18°C)", icon: CloudRain, color: "text-cyan-400" },
  { label: "Hot & Sunny (32°C)", icon: Sun, color: "text-orange-400" },
  { label: "Cold / Windy (12°C)", icon: Snowflake, color: "text-blue-300" }
];

export default function TripContextBar({
  tripType,
  setTripType,
  duration,
  setDuration,
  weather,
  setWeather,
  mode,
  setMode,
  onRegenerate,
  isGenerating
}) {
  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden border border-slate-700/60">
      
      {/* Top row: Section Header & Phase Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Trip Synthesis Parameters
            </h3>
            <p className="text-[11px] text-slate-400">
              Gemma adapts items dynamically based on where you are going and for how long.
            </p>
          </div>
        </div>

        {/* Phase Toggle (Departure vs Return) */}
        <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setMode("departure")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              mode === "departure"
                ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlaneTakeoff className="w-4 h-4" />
            <span>Departure Packing</span>
          </button>
          
          <button
            onClick={() => setMode("return")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              mode === "return"
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlaneLanding className="w-4 h-4" />
            <span>Return Safe Audit</span>
          </button>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Purpose */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trip Purpose / Destination</span>
          </label>
          <div className="relative">
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer shadow-sm"
            >
              {TRIP_PURPOSES.map((p) => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Trip Duration</span>
          </label>
          <div className="relative">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-400 transition-all cursor-pointer shadow-sm"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weather */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>Local Weather Forecast</span>
          </label>
          <div className="relative">
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer shadow-sm"
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w.label} value={w.label}>{w.label}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Synthesis Re-trigger action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 font-medium">
          💡 <strong>Pro Tip:</strong> Changing trip parameters automatically triggers Gemma's causal reasoning engine to recalibrate high-risk alerts.
        </span>

        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-fuchsia-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className={`w-4 h-4 text-cyan-200 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
          <span>{isGenerating ? 'Synthesizing with Gemma...' : 'Re-synthesize Manifest'}</span>
        </button>
      </div>

    </div>
  );
}
