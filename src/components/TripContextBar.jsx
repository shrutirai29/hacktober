import React from 'react';
import { 
  Compass, 
  Clock, 
  CloudRain, 
  Sun, 
  CloudSun, 
  Snowflake, 
  ArrowRightLeft, 
  Sparkles,
  PlaneTakeoff,
  PlaneLanding
} from 'lucide-react';

const TRIP_PURPOSES = [
  "Hostel to Home",
  "College Presentation",
  "Weekend Trip",
  "Hackathon / Tech Conference",
  "Daily Commute"
];

const DURATIONS = [
  "Day Trip (8h)",
  "Weekend (2-3 days)",
  "1 Week",
  "Overnight"
];

const WEATHER_OPTIONS = [
  { label: "Pleasant (24°C)", icon: CloudSun },
  { label: "Rain Forecast (18°C)", icon: CloudRain },
  { label: "Hot & Sunny (32°C)", icon: Sun },
  { label: "Cold / Windy (12°C)", icon: Snowflake }
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
      
      {/* Top row: Mode Switcher (Departure vs Return) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Trip Synthesis Parameters
          </span>
        </div>

        {/* Phase Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setMode("departure")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === "departure"
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlaneTakeoff className="w-3.5 h-3.5" />
            <span>Departure Packing</span>
          </button>
          <button
            onClick={() => setMode("return")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === "return"
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlaneLanding className="w-3.5 h-3.5" />
            <span>Return Safe Audit</span>
          </button>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Purpose */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400">
            Trip Purpose / Destination
          </label>
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {TRIP_PURPOSES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400">
            Trip Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Weather */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400">
            Local Weather Condition
          </label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {WEATHER_OPTIONS.map((w) => (
              <option key={w.label} value={w.label}>{w.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Re-generate trigger bar */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 italic">
          * Changing trip context prompts Gemma to synthesize tailored items and omit irrelevant gear.
        </span>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing...' : 'Synthesize with Gemma'}</span>
        </button>
      </div>

    </div>
  );
}
