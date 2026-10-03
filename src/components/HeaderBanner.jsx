import React from 'react';
import { 
  Briefcase, 
  Calendar, 
  Sun, 
  RefreshCw, 
  Sparkles,
  Volume2,
  VolumeX,
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
  isVoicePlaying,
  userName = "Kanwal"
}) {
  return (
    <div className="space-y-3.5">
      
      {/* Top Banner: Exact Artwork Personalized for User */}
      <div className="relative rounded-3xl overflow-hidden border border-[#e8ded1] shadow-xs bg-[#dcd7f2] select-none">
        <img
          src="/assets/header_banner.png"
          alt={`Hey ${userName}! Where are you off to next? Tell me about your trip and I'll create a personalized checklist just for you`}
          className="w-full h-36 sm:h-44 md:h-48 object-cover object-center block rounded-3xl"
        />
      </div>

      {/* Horizontal Trip Parameter Strip */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#ede6dc] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Dropdown Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
          
          {/* 1. Trip Purpose */}
          <div className="bg-[#faf8f5] hover:bg-white rounded-xl px-3 py-2 border border-[#eee7dc] hover:border-purple-300 transition-colors flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
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
          <div className="bg-[#faf8f5] hover:bg-white rounded-xl px-3 py-2 border border-[#eee7dc] hover:border-purple-300 transition-colors flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
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
          <div className="bg-[#faf8f5] hover:bg-white rounded-xl px-3 py-2 border border-[#eee7dc] hover:border-purple-300 transition-colors flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
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
          <div className="bg-[#faf8f5] hover:bg-white rounded-xl px-3 py-2 border border-[#eee7dc] hover:border-purple-300 transition-colors flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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

        {/* Action Buttons: Voice Briefing & Synthesize */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
          {onTriggerVoice && (
            <button
              onClick={onTriggerVoice}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isVoicePlaying
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-[#faf8f5] hover:bg-[#f2ede4] text-slate-700 border-[#e5ded4]'
              }`}
              title="Departure Audio Briefing"
            >
              {isVoicePlaying ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-500" />
                  <span>Stop</span>
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
            className="px-4 py-2.5 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? "Synthesizing..." : "Synthesize Manifest ✨"}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
