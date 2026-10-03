import React, { useState } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Sun, 
  Sparkles, 
  ArrowRight,
  Luggage,
  ShieldCheck
} from 'lucide-react';

export default function NewTripView({ onStartTrip }) {
  const [tripName, setTripName] = useState("");
  const [purpose, setPurpose] = useState("College Presentation");
  const [duration, setDuration] = useState("2-3 Days (Weekend)");
  const [weather, setWeather] = useState("Rain Forecast (18°C)");
  const [mode, setMode] = useState("departure");
  const [bagType, setBagType] = useState("Travel Backpack");

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartTrip({
      name: tripName.trim() || purpose,
      purpose,
      duration,
      weather,
      mode,
      bagType
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ede7dd] shadow-sm text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7054E8] flex items-center justify-center font-bold mx-auto mb-1">
          <PlusCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
          Plan a New Journey
        </h2>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          Tell CheckMate where you are traveling. Our open AI model will adapt your packing manifest and flag high-risk items.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ede7dd] shadow-sm space-y-5">
        
        {/* Destination Name */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#7054E8]" />
            <span>Trip Destination or Event Name</span>
          </label>
          <input
            type="text"
            placeholder="e.g. AI Innovation Summit 2026, Home Visit, City Tech Center..."
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7054E8]"
          />
        </div>

        {/* 2-Col Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Trip Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
            >
              <option value="College Presentation">College Presentation</option>
              <option value="Hostel to Home">Hostel to Home</option>
              <option value="Weekend Trip">Weekend Trip</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Conference">Conference</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Trip Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
            >
              <option value="2-3 Days (Weekend)">2-3 Days (Weekend)</option>
              <option value="Day Trip (8h)">Day Trip (8h)</option>
              <option value="1 Week">1 Week</option>
              <option value="Overnight">Overnight</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Weather Condition
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
            >
              <option value="Rain Forecast (18°C)">Rain Forecast (18°C)</option>
              <option value="Pleasant (24°C)">Pleasant (24°C)</option>
              <option value="Hot & Sunny (32°C)">Hot & Sunny (32°C)</option>
              <option value="Cold / Windy (12°C)">Cold / Windy (12°C)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Primary Luggage
            </label>
            <select
              value={bagType}
              onChange={(e) => setBagType(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
            >
              <option value="Travel Backpack">Travel Backpack</option>
              <option value="Weekend Canvas Duffel">Weekend Canvas Duffel</option>
              <option value="Rolling Cabin Suitcase">Rolling Cabin Suitcase</option>
            </select>
          </div>

        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white font-black text-xs sm:text-sm shadow-md shadow-purple-500/25 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Synthesize Manifest & Open Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
