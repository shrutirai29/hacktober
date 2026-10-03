import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Volume2, 
  Sparkles,
  Eye,
  MinusCircle,
  Laptop,
  CheckCircle2,
  Plug,
  CreditCard,
  Tv
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PackingManifestCard({
  items = [],
  onToggleItem,
  onMarkAllPacked,
  onTriggerVoice,
  isVoicePlaying,
  onOpenComparison,
  onOpenAiInspector,
  highlightedItemId = null,
  onHoverItem = null
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [accordionOpen, setAccordionOpen] = useState({
    vision: false,
    suggested: false,
    leaveBehind: false
  });

  const [checkedMap, setCheckedMap] = useState({
    charger: false,
    id_card: false,
    hdmi: false,
    laptop: false
  });

  const toggleCheck = (key) => {
    setCheckedMap(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const allChecked = Object.values(next).every(Boolean);
      if (allChecked) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return next;
    });
  };

  const handleMarkAll = () => {
    setCheckedMap({
      charger: true,
      id_card: true,
      hdmi: true,
      laptop: true
    });
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });
    onMarkAllPacked?.();
  };

  const toggleAccordion = (sec) => {
    setAccordionOpen(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#ede7dd] shadow-sm flex flex-col justify-between gap-5 h-full">
      
      {/* Top Header & Progress Bar */}
      <div className="space-y-3">
        
        {/* Title & Fraction Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h3 className="font-extrabold text-base text-[#1e1b4b] tracking-tight">
              Your Packing Manifest
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              6/18 packed
            </span>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[#6366f1] rounded-full" />
            </div>
            <span className="text-xs font-bold text-[#6366f1]">
              33%
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              activeFilter === "all"
                ? 'bg-[#ede9fe] text-[#5b21b6]'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            All Items (18)
          </button>

          <button
            onClick={() => setActiveFilter("high_risk")}
            className={`px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              activeFilter === "high_risk"
                ? 'bg-rose-100 text-rose-700'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <span>🚨 High-Risk (4)</span>
          </button>

          <button
            onClick={() => setActiveFilter("detected")}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              activeFilter === "detected"
                ? 'bg-[#ede9fe] text-[#5b21b6]'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Detected (6)
          </button>

          <button
            onClick={() => setActiveFilter("suggested")}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              activeFilter === "suggested"
                ? 'bg-[#ede9fe] text-[#5b21b6]'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Suggested (5)
          </button>

          <button
            onClick={() => setActiveFilter("leave_behind")}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              activeFilter === "leave_behind"
                ? 'bg-slate-200 text-slate-800'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Leave Behind (3)
          </button>
        </div>

        {/* 1. High-Risk Memory Alerts Card */}
        <div className="rounded-2xl border border-rose-200/90 bg-[#fff5f5] p-3.5 space-y-2.5 shadow-2xs">
          
          {/* Card Sub-Header */}
          <div className="flex items-center justify-between pb-1 border-b border-rose-200/60">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-black text-rose-900 block leading-tight">
                  High-Risk Memory Alerts
                </span>
                <span className="text-[10px] text-rose-700/80 font-medium">
                  Items you've forgotten before
                </span>
              </div>
            </div>

            <button
              onClick={onOpenComparison}
              className="text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100/70 hover:bg-rose-200/70 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
            >
              Why this matters?
            </button>
          </div>

          {/* List of High-Risk Items */}
          <div className="space-y-1.5">
            
            {/* Item 1: Laptop Charger */}
            <div 
              onMouseEnter={() => onHoverItem?.("charger")}
              onMouseLeave={() => onHoverItem?.(null)}
              className={`p-2.5 rounded-xl bg-white border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                checkedMap.charger ? 'opacity-60 border-slate-200' : 'border-rose-100'
              } ${highlightedItemId === "charger" ? 'ring-2 ring-[#7054E8] bg-purple-50/70 scale-[1.02]' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => toggleCheck("charger")}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    checkedMap.charger ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {checkedMap.charger && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                  <Plug className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold leading-tight ${checkedMap.charger ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      Laptop Charger
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px]">
                      Forgotten 3x
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    Check behind the desk and wall socket!
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                  Detected in room
                </span>
                <button className="text-slate-400 hover:text-slate-600 p-0.5">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Item 2: College ID / Gate Pass */}
            <div 
              onMouseEnter={() => onHoverItem?.("id_card")}
              onMouseLeave={() => onHoverItem?.(null)}
              className={`p-2.5 rounded-xl bg-white border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                checkedMap.id_card ? 'opacity-60 border-slate-200' : 'border-rose-100'
              } ${highlightedItemId === "id_card" ? 'ring-2 ring-[#7054E8] bg-purple-50/70 scale-[1.02]' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => toggleCheck("id_card")}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    checkedMap.id_card ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {checkedMap.id_card && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div className="p-1 rounded-lg bg-purple-50 text-purple-600">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold leading-tight ${checkedMap.id_card ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      College ID / Gate Pass
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px]">
                      Forgotten 2x
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    Usually kept on desk near laptop
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                  Detected in room
                </span>
                <button className="text-slate-400 hover:text-slate-600 p-0.5">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Item 3: USB-C to HDMI Adapter */}
            <div 
              onMouseEnter={() => onHoverItem?.("hdmi")}
              onMouseLeave={() => onHoverItem?.(null)}
              className={`p-2.5 rounded-xl bg-white border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                checkedMap.hdmi ? 'opacity-60 border-slate-200' : 'border-rose-100'
              } ${highlightedItemId === "hdmi" ? 'ring-2 ring-[#7054E8] bg-purple-50/70 scale-[1.02]' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => toggleCheck("hdmi")}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    checkedMap.hdmi ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {checkedMap.hdmi && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                  <Tv className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold leading-tight ${checkedMap.hdmi ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      USB-C to HDMI Adapter
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px]">
                      Forgotten 2x
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    Essential for presentations
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-bold">
                  Suggested
                </span>
                <button className="text-slate-400 hover:text-slate-600 p-0.5">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Item 4: Laptop / Device */}
            <div 
              onMouseEnter={() => onHoverItem?.("laptop")}
              onMouseLeave={() => onHoverItem?.(null)}
              className={`p-2.5 rounded-xl bg-white border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                checkedMap.laptop ? 'opacity-60 border-slate-200' : 'border-slate-100'
              } ${highlightedItemId === "laptop" ? 'ring-2 ring-[#7054E8] bg-purple-50/70 scale-[1.02]' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => toggleCheck("laptop")}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    checkedMap.laptop ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {checkedMap.laptop && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
                  <Laptop className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold leading-tight ${checkedMap.laptop ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      Laptop / Device
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px]">
                      Forgotten 1x
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    Your main device for the presentation
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                  Detected in room
                </span>
                <button className="text-slate-400 hover:text-slate-600 p-0.5">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Vision-Detected & Context Essentials Accordion */}
        <div className="rounded-2xl border border-[#ede7dd] bg-[#faf8f5] overflow-hidden">
          <button
            onClick={() => toggleAccordion("vision")}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-[#f3ede3] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Vision-Detected & Context Essentials</span>
              <span className="text-[10px] text-slate-400 font-normal">6 items</span>
            </div>
            {accordionOpen.vision ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {accordionOpen.vision && (
            <div className="p-3 bg-white border-t border-[#ede7dd] space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Insulated Water Flask</span>
                <span className="text-[10px] text-emerald-600 font-bold">Detected in room</span>
              </div>
              <div className="flex items-center justify-between">
                <span>20,000mAh Power Bank</span>
                <span className="text-[10px] text-emerald-600 font-bold">Detected in room</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Wireless Earbuds Case</span>
                <span className="text-[10px] text-emerald-600 font-bold">Detected in room</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. AI Suggested Based on Trip Accordion */}
        <div className="rounded-2xl border border-[#ede7dd] bg-[#faf8f5] overflow-hidden">
          <button
            onClick={() => toggleAccordion("suggested")}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-[#f3ede3] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Suggested Based on Trip</span>
              <span className="text-[10px] text-slate-400 font-normal">5 items</span>
            </div>
            {accordionOpen.suggested ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {accordionOpen.suggested && (
            <div className="p-3 bg-white border-t border-[#ede7dd] space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Offline Slides on USB Backup Drive</span>
                <span className="text-[10px] text-indigo-600 font-bold">Gemma Reasoning</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Backpack Rain Cover (Rain Forecast)</span>
                <span className="text-[10px] text-cyan-600 font-bold">Weather Trigger</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Leave Behind (Save Space) Accordion */}
        <div className="rounded-2xl border border-[#ede7dd] bg-[#faf8f5] overflow-hidden">
          <button
            onClick={() => toggleAccordion("leaveBehind")}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-[#f3ede3] transition-colors"
          >
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-rose-500" />
              <span>Leave Behind (Save Space)</span>
              <span className="text-[10px] text-slate-400 font-normal">3 items</span>
            </div>
            {accordionOpen.leaveBehind ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {accordionOpen.leaveBehind && (
            <div className="p-3 bg-white border-t border-[#ede7dd] space-y-2 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Dirty Laundry Sack</span>
                <span className="text-[10px] text-rose-500 font-bold">Not needed for presentation</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Heavy Semester Textbooks</span>
                <span className="text-[10px] text-rose-500 font-bold">Leave on hostel desk</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onTriggerVoice}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
            isVoicePlaying
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-white hover:bg-slate-50 border-[#d8d2c7] text-[#6366f1]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isVoicePlaying ? "Playing..." : "Voice Exit Nudge"}</span>
        </button>

        <button
          onClick={handleMarkAll}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-black shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Mark All as Packed</span>
        </button>
      </div>

    </div>
  );
}
