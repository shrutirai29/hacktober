import React from 'react';
import { 
  X, 
  Split, 
  ArrowRight, 
  Home, 
  Briefcase, 
  ShieldAlert, 
  Check, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export default function ComparisonModal({ isOpen, onClose, onSelectScenarioAndTrip }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Demo Moment: Side-by-Side Trip Comparison</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                  Gemma Causal Reasoning
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Observe how the same friend's packing manifest radically transforms based on destination purpose.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Weekend at Home */}
            <div className="rounded-xl border border-sky-800/60 bg-slate-950/70 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <Home className="w-4 h-4" />
                    <span>Scenario A: Weekend at Home</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Hostel → Home (3 Days)
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Critical: 65W Wall Charger
                    </span>
                    <span className="text-[10px] text-amber-300/80">
                      Forgotten 3 times! Alex notoriously leaves it in the Block C wall socket.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Hostel Gate Pass & ID Lanyard
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Mandatory for returning past 10 PM Sunday night.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Dirty Laundry Sack
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Clothes accumulated over 2 weeks to wash at family home.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Toiletry Kit & Allergy Meds
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Daily Cetirizine medication from bathroom counter.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 italic text-[11px]">
                    🚫 <strong>Intentionally Omitted:</strong> Stage presenter clicker, formal blazer, heavy research textbooks.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectScenarioAndTrip("hostel_desk", "Hostel to Home");
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Load Weekend Home Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: College Presentation */}
            <div className="rounded-xl border border-indigo-800/60 bg-slate-950/70 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span>Scenario B: College Presentation</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    AI Summit (Day Trip)
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Critical: USB-C to HDMI 4K Hub
                    </span>
                    <span className="text-[10px] text-amber-300/80">
                      Forgotten 2 times! Without this, the auditorium projector cannot receive video signal.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Navy Presentation Blazer & Badge
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Draped on room chair; required dress code for main stage.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Wireless Slide Remote Clicker
                    </span>
                    <span className="text-[10px] text-slate-400">
                      For pacing stage slides without touching laptop trackpad.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Offline Slides on USB Backup Drive
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Synthesized by Gemma in case auditorium Wi-Fi fails.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 italic text-[11px]">
                    🚫 <strong>Intentionally Omitted:</strong> Laundry bag, casual sneakers, multiple sets of home loungewear.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectScenarioAndTrip("presentation_prep", "College Presentation");
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Load Presentation Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Gemma AI Causal Explanation Block */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>The Gemma Causal Differential: Why do these checklists differ?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard packing apps generate static, generic lists (e.g. <em>"socks, toothbrush, phone"</em>). 
              <strong> CheckMate uses open-weight Gemma reasoning grounded in two distinct causal anchors:</strong>
            </p>
            <ul className="mt-2 text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-white">Failure-Mode Asymmetry:</strong> For the <em>Presentation</em>, missing the HDMI dongle triggers total failure (cancelled talk), so Gemma escalates it to priority #1 with a desk-pinpoint alert. For <em>Home Visit</em>, the failure mode is a dead laptop battery at home, making the wall socket charger the highest risk.
              </li>
              <li>
                <strong className="text-white">Clutter Pruning:</strong> Gemma automatically suppresses contextually irrelevant baggage. You don't need a dirty laundry sack at an AI conference, nor a presentation clicker while watching TV at home.
              </li>
              <li>
                <strong className="text-white">Spatial Vision Grounding:</strong> The items aren't imagined; they are verified visually in the friend's actual room scan (blazer on the chair, dongle on the desk, charger in the wall).
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
}
