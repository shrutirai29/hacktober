import React, { useState } from 'react';
import { 
  Split, 
  Home, 
  Briefcase, 
  Check, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Clock, 
  CloudRain, 
  Sun 
} from 'lucide-react';

export default function CompareTripsView({ onSelectScenarioAndTrip }) {
  const [scenarioA, setScenarioA] = useState({
    title: "Weekend at Home",
    purpose: "Hostel to Home",
    duration: "2-3 Days (Weekend)",
    weather: "Pleasant (24°C)",
    highRisk: [
      { name: "65W Laptop Charger", note: "Forgotten 3x! Left in Block C wall socket behind desk." },
      { name: "Hostel Gate Pass & ID", note: "Forgotten 2x! Needed for Sunday night return past curfew." }
    ],
    essentials: [
      "Dirty Laundry Sack (Wash at home)",
      "Toiletry Dopp Kit & Allergy Meds",
      "Casual Hoodie & Loungewear",
      "Metro Transit Smart Card",
      "Hostel Room Padlock & Key"
    ],
    leaveBehind: [
      "Stage presentation laser clicker",
      "Formal presentation blazer",
      "Heavy semester project binders"
    ]
  });

  const [scenarioB, setScenarioB] = useState({
    title: "College Presentation",
    purpose: "College Presentation",
    duration: "Day Trip (8h)",
    weather: "Rain Forecast (18°C)",
    highRisk: [
      { name: "USB-C to HDMI 4K Adapter", note: "Forgotten 2x! Critical failure risk: auditorium projector has no USB-C." },
      { name: "Laptop with Final Slides", note: "Must have offline PDF copy ready on desktop." }
    ],
    essentials: [
      "Navy Formal Presentation Blazer",
      "Wireless Slide Remote / Clicker",
      "Offline Slides on Backup USB Drive",
      "Compact Travel Storm Umbrella",
      "Printed Speaker Cue Cards"
    ],
    leaveBehind: [
      "Dirty laundry bag",
      "Casual gym sneakers",
      "Weekend toiletry bulk pouch"
    ]
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="faded-glass rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-[#7054E8] flex items-center justify-center font-bold">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
              Compare Trips: Causal AI Differential
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Analyze how CheckMate's open-weight Gemma reasoning adapts packing manifests based on trip purpose and risk asymmetry.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Scenario A Card */}
        <div className="faded-glass rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae0]">
              <div className="flex items-center gap-2 text-[#1e1b4b]">
                <Home className="w-5 h-5 text-sky-600" />
                <h3 className="font-black text-base">{scenarioA.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black">
                {scenarioA.purpose}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {scenarioA.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> {scenarioA.weather}
              </span>
            </div>

            {/* High-Risk Items */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
                🚨 Critical Memory Alerts:
              </span>
              {scenarioA.highRisk.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 text-xs">
                  <span className="font-extrabold text-rose-900 block">{item.name}</span>
                  <span className="text-[11px] text-rose-700/90">{item.note}</span>
                </div>
              ))}
            </div>

            {/* Recommended Essentials */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                ✅ Trip Essentials:
              </span>
              {scenarioA.essentials.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-1.5 rounded-lg bg-[#faf8f5]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Intentionally Omitted */}
            <div className="space-y-1 pt-1 border-t border-[#f4efe6]">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                🚫 Intentionally Omitted (Anti-Clutter):
              </span>
              <div className="text-xs text-slate-500 italic">
                {scenarioA.leaveBehind.join(", ")}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectScenarioAndTrip?.("hostel_desk", "Hostel to Home")}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Activate Scenario A in Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scenario B Card */}
        <div className="faded-glass rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae0]">
              <div className="flex items-center gap-2 text-[#1e1b4b]">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-base">{scenarioB.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black">
                {scenarioB.purpose}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {scenarioB.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-sky-500" /> {scenarioB.weather}
              </span>
            </div>

            {/* High-Risk Items */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
                🚨 Critical Memory Alerts:
              </span>
              {scenarioB.highRisk.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 text-xs">
                  <span className="font-extrabold text-rose-900 block">{item.name}</span>
                  <span className="text-[11px] text-rose-700/90">{item.note}</span>
                </div>
              ))}
            </div>

            {/* Recommended Essentials */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                ✅ Trip Essentials:
              </span>
              {scenarioB.essentials.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-1.5 rounded-lg bg-[#faf8f5]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Intentionally Omitted */}
            <div className="space-y-1 pt-1 border-t border-[#f4efe6]">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                🚫 Intentionally Omitted (Anti-Clutter):
              </span>
              <div className="text-xs text-slate-500 italic">
                {scenarioB.leaveBehind.join(", ")}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectScenarioAndTrip?.("presentation_prep", "College Presentation")}
            className="w-full py-2.5 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Activate Scenario B in Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Causal Explanation Section */}
      <div className="faded-glass rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#7054E8]">
          <Zap className="w-5 h-5" />
          <h3 className="font-black text-base text-[#1e1b4b]">
            Why These Trips Differ: The Gemma Causal Explanation
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Traditional packing applications display identical generic checklists (*"socks, shirts, toiletries"*). 
          <strong> CheckMate's AI applies three causal principles to produce divergent manifests:</strong>
        </p>
        <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-slate-900">Failure-Mode Asymmetry:</strong> For the <em>Presentation</em>, missing the HDMI adapter results in catastrophic stage failure (inability to project slides). Hence, Gemma elevates it to Priority #1. For the <em>Weekend Home Visit</em>, the failure mode is a dead laptop battery at home, making the wall socket charger the primary hazard.
          </li>
          <li>
            <strong className="text-slate-900">Clutter Pruning:</strong> Gemma automatically suppresses contextually irrelevant baggage. You do not carry a 2-week dirty laundry sack to an auditorium summit, nor do you carry an presentation slide clicker while relaxing at home.
          </li>
          <li>
            <strong className="text-slate-900">Spatial Localization:</strong> Every recommendation is verified against Alex's actual room detections (wall outlet, desk surface, chair).
          </li>
        </ul>
      </div>

    </div>
  );
}
