import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Volume2, 
  VolumeX,
  Sparkles,
  Eye,
  MinusCircle,
  Laptop,
  CheckCircle2,
  Plug,
  CreditCard,
  Tv,
  Box,
  Battery,
  Headphones,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PackingManifestCard({
  items = [],
  onToggleItem,
  onMarkAllPacked,
  onTriggerVoice,
  isVoicePlaying = false,
  onOpenComparison,
  onOpenAiInspector,
  highlightedItemId = null,
  onHoverItem = null
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [accordionOpen, setAccordionOpen] = useState({
    vision: true,
    suggested: false,
    leaveBehind: false
  });

  // Default fallback items if AI reasoner is still initializing
  const defaultItems = useMemo(() => [
    {
      id: "charger",
      name: "65W Laptop Charger",
      priority: "critical",
      forgottenTimes: 3,
      spatialTip: "Check behind the desk and wall socket!",
      status: "Detected in room",
      category: "Tech & Power",
      checked: false
    },
    {
      id: "id_card",
      name: "College ID / Gate Pass",
      priority: "high",
      forgottenTimes: 2,
      spatialTip: "Usually kept on desk near laptop lanyard",
      status: "Detected in room",
      category: "Documents",
      checked: false
    },
    {
      id: "hdmi",
      name: "USB-C to HDMI Adapter",
      priority: "critical",
      forgottenTimes: 2,
      spatialTip: "Essential for auditorium projector hookup",
      status: "Suggested",
      category: "AV & Adapters",
      checked: false
    },
    {
      id: "laptop",
      name: "MacBook Pro",
      priority: "normal",
      forgottenTimes: 1,
      spatialTip: "Main presentation device on center desk",
      status: "Detected in room",
      category: "Tech",
      checked: false
    },
    {
      id: "powerbank",
      name: "20,000mAh Power Bank",
      priority: "normal",
      status: "Detected in room",
      spatialTip: "Left corner of study desk",
      category: "Power",
      checked: false
    },
    {
      id: "earbuds",
      name: "Wireless Earbuds Case",
      priority: "normal",
      status: "Detected in room",
      spatialTip: "Front desk center",
      category: "Audio",
      checked: false
    },
    {
      id: "water_bottle",
      name: "Insulated Water Flask",
      priority: "normal",
      status: "Detected in room",
      spatialTip: "Right desk near window",
      category: "Daily",
      checked: false
    },
    {
      id: "backpack",
      name: "Travel Backpack",
      priority: "normal",
      status: "Exit Luggage",
      spatialTip: "Sitting beside chair",
      category: "Luggage",
      checked: false
    },
    {
      id: "ai_pres_1",
      name: "Offline Slides on USB Backup Drive",
      priority: "high",
      status: "Gemma Reasoning",
      spatialTip: "Auditorium Wi-Fi fallback. Keep in front pocket.",
      category: "Tech & AV",
      checked: false
    },
    {
      id: "ai_rain_1",
      name: "Backpack Rain Cover",
      priority: "high",
      status: "Weather Trigger",
      spatialTip: "Rain forecast alert. Stow in bottom pouch.",
      category: "Weather Protection",
      checked: false
    }
  ], []);

  // Active items list: prioritize items from prop, fallback to defaults
  const activeItems = useMemo(() => {
    if (items && items.length > 0) {
      return items.map(item => {
        let forgottenTimes = 0;
        if (item.id === "charger" || item.name.toLowerCase().includes("charger")) forgottenTimes = 3;
        if (item.id === "id_card" || item.name.toLowerCase().includes("id")) forgottenTimes = 2;
        if (item.id === "hdmi" || item.name.toLowerCase().includes("hdmi")) forgottenTimes = 2;
        if (item.id === "laptop" || item.name.toLowerCase().includes("laptop")) forgottenTimes = 1;
        return {
          ...item,
          forgottenTimes: item.forgottenTimes ?? forgottenTimes
        };
      });
    }
    return defaultItems;
  }, [items, defaultItems]);

  // Leave behind items to save weight
  const leaveBehindItems = useMemo(() => [
    { name: "Heavy Semester Textbooks", note: "Leave on hostel shelf to save 4kg", tag: "Not needed" },
    { name: "Hostel Dirty Laundry Sack", note: "Wash at hostel laundromat upon return", tag: "Save space" },
    { name: "Bulky Desk Gaming Headphones", note: "Earbuds are sufficient for commute", tag: "Excess bulk" }
  ], []);

  // Split into categories for rendering
  const highRiskItems = useMemo(() => {
    return activeItems.filter(i => 
      i.priority === "critical" || 
      i.priority === "high" || 
      (i.forgottenTimes && i.forgottenTimes > 0)
    );
  }, [activeItems]);

  const visionDetectedItems = useMemo(() => {
    return activeItems.filter(i => 
      !highRiskItems.some(hr => hr.id === i.id) &&
      (i.source === "Vision Detection" || !i.id?.startsWith("ai_"))
    );
  }, [activeItems, highRiskItems]);

  const suggestedItems = useMemo(() => {
    return activeItems.filter(i => 
      !highRiskItems.some(hr => hr.id === i.id) &&
      (i.source === "Gemma Reasoning" || i.id?.startsWith("ai_"))
    );
  }, [activeItems, highRiskItems]);

  // Dynamic progress calculation
  const totalCount = activeItems.length;
  const packedCount = activeItems.filter(i => i.checked).length;
  const progressPercentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Toggle item packing
  const handleToggle = (id) => {
    onToggleItem?.(id);
    const item = activeItems.find(i => i.id === id);
    const nextPackedCount = (item && !item.checked) ? packedCount + 1 : packedCount - 1;
    if (nextPackedCount === totalCount && totalCount > 0) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Mark all packed
  const handleMarkAll = () => {
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

  const getItemIcon = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("charger") || lower.includes("plug")) return <Plug className="w-3.5 h-3.5" />;
    if (lower.includes("id") || lower.includes("pass")) return <CreditCard className="w-3.5 h-3.5" />;
    if (lower.includes("hdmi") || lower.includes("adapter")) return <Tv className="w-3.5 h-3.5" />;
    if (lower.includes("laptop") || lower.includes("macbook")) return <Laptop className="w-3.5 h-3.5" />;
    if (lower.includes("power") || lower.includes("battery")) return <Battery className="w-3.5 h-3.5" />;
    if (lower.includes("earbuds") || lower.includes("audio")) return <Headphones className="w-3.5 h-3.5" />;
    if (lower.includes("drive") || lower.includes("usb") || lower.includes("slides")) return <FileText className="w-3.5 h-3.5" />;
    return <Box className="w-3.5 h-3.5" />;
  };

  return (
    <div className="faded-glass rounded-3xl p-5 flex flex-col gap-4 min-h-[560px] lg:h-full overflow-hidden shadow-sm border border-white/80">
      
      {/* Top Header & Dynamic Progress Bar */}
      <div className="space-y-3 shrink-0">
        
        {/* Title & Live Fraction Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h3 className="font-extrabold text-base text-[#1e1b4b] tracking-tight">
              Your Packing Manifest
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-slate-600 font-mono">
              {packedCount}/{totalCount} packed
            </span>
            <div className="w-24 h-2.5 bg-white/70 rounded-full overflow-hidden p-0.5 border border-white/80">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-[#7054E8] rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#7054E8] font-mono min-w-8 text-right">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Filter Pills - Clean Horizontal Scroll Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === "all"
                ? 'bg-[#ede9fe] text-[#5b21b6] shadow-xs ring-1 ring-purple-300'
                : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/60'
            }`}
          >
            All Items ({totalCount})
          </button>

          <button
            onClick={() => setActiveFilter("high_risk")}
            className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === "high_risk"
                ? 'bg-rose-100 text-rose-700 shadow-xs ring-1 ring-rose-300'
                : 'bg-white/70 text-rose-600 hover:bg-rose-50 border border-rose-200/60'
            }`}
          >
            <span>🚨 High-Risk ({highRiskItems.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("detected")}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === "detected"
                ? 'bg-[#ede9fe] text-[#5b21b6] shadow-xs ring-1 ring-purple-300'
                : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/60'
            }`}
          >
            Detected ({visionDetectedItems.length + (highRiskItems.filter(i => i.status?.includes("room")).length)})
          </button>

          <button
            onClick={() => setActiveFilter("suggested")}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === "suggested"
                ? 'bg-[#ede9fe] text-[#5b21b6] shadow-xs ring-1 ring-purple-300'
                : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/60'
            }`}
          >
            Suggested ({suggestedItems.length})
          </button>

          <button
            onClick={() => setActiveFilter("leave_behind")}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === "leave_behind"
                ? 'bg-slate-200 text-slate-800 shadow-xs ring-1 ring-slate-300'
                : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/60'
            }`}
          >
            Leave Behind ({leaveBehindItems.length})
          </button>
        </div>
      </div>

      {/* Scrollable Manifest Items Container */}
      <div className="space-y-2.5 flex-1 min-h-0 overflow-y-auto pr-1.5 scrollbar-thin">
        {/* 1. High-Risk Memory Alerts Card (Always shown unless filtering exclusively) */}
        {(activeFilter === "all" || activeFilter === "high_risk") && highRiskItems.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-[#fff5f5] p-3.5 space-y-2.5 shadow-2xs animate-in fade-in duration-200">
            
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
                    Items you've forgotten on past trips
                  </span>
                </div>
              </div>

              {onOpenComparison && (
                <button
                  onClick={onOpenComparison}
                  className="text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100/80 hover:bg-rose-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Why this matters?
                </button>
              )}
            </div>

            {/* List of High-Risk Items */}
            <div className="space-y-1.5">
              {highRiskItems.map((item) => {
                const isHighlighted = highlightedItemId === item.id;
                return (
                  <div 
                    key={item.id}
                    onMouseEnter={() => onHoverItem?.(item.id)}
                    onMouseLeave={() => onHoverItem?.(null)}
                    className={`p-2.5 rounded-xl bg-white border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                      item.checked ? 'opacity-60 border-slate-200' : 'border-rose-100'
                    } ${isHighlighted ? 'ring-2 ring-[#7054E8] bg-purple-50/70 scale-[1.01]' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          item.checked 
                            ? 'bg-[#7054E8] border-[#7054E8] text-white shadow-xs' 
                            : 'border-slate-300 hover:border-purple-400 bg-white'
                        }`}
                      >
                        {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                        {getItemIcon(item.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold leading-tight ${item.checked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {item.name}
                          </span>
                          {item.forgottenTimes > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px]">
                              Forgotten {item.forgottenTimes}x
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block truncate">
                          {item.spatialTip || item.alertReason || "Verify in room"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                        {item.status || "Detected in room"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 2. Vision-Detected & Context Essentials Accordion */}
        {(activeFilter === "all" || activeFilter === "detected") && (
          <div className="rounded-2xl border border-[#ede7dd] bg-[#faf8f5] overflow-hidden">
            <button
              onClick={() => toggleAccordion("vision")}
              className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-[#f3ede3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>Vision-Detected & Context Essentials</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {visionDetectedItems.length} items
                </span>
              </div>
              {accordionOpen.vision ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            
            {accordionOpen.vision && (
              <div className="p-2.5 bg-white border-t border-[#ede7dd] space-y-1.5">
                {visionDetectedItems.map((item) => {
                  const isHighlighted = highlightedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => onHoverItem?.(item.id)}
                      onMouseLeave={() => onHoverItem?.(null)}
                      className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                        item.checked ? 'opacity-60 bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-slate-200'
                      } ${isHighlighted ? 'ring-2 ring-[#7054E8] bg-purple-50/70' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                            item.checked ? 'bg-[#7054E8] border-[#7054E8] text-white' : 'border-slate-300 hover:border-purple-400'
                          }`}
                        >
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                          {getItemIcon(item.name)}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold block truncate ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                          {item.spatialTip && (
                            <span className="text-[10px] text-slate-400 truncate block">
                              {item.spatialTip}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
                        Detected in room
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. AI Suggested Based on Trip Accordion */}
        {(activeFilter === "all" || activeFilter === "suggested") && (
          <div className="rounded-2xl border border-[#ede7dd] bg-[#faf8f5] overflow-hidden">
            <button
              onClick={() => toggleAccordion("suggested")}
              className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-[#f3ede3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Suggested Based on Trip</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {suggestedItems.length} items
                </span>
              </div>
              {accordionOpen.suggested ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            
            {accordionOpen.suggested && (
              <div className="p-2.5 bg-white border-t border-[#ede7dd] space-y-1.5">
                {suggestedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                      item.checked ? 'opacity-60 bg-slate-50 border-slate-200' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          item.checked ? 'bg-[#7054E8] border-[#7054E8] text-white' : 'border-slate-300 hover:border-purple-400'
                        }`}
                      >
                        {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <div className="p-1 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                        {getItemIcon(item.name)}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block truncate ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.name}
                        </span>
                        {item.alertReason && (
                          <span className="text-[10px] text-slate-400 truncate block">
                            {item.alertReason}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 shrink-0">
                      Gemma Rule
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Leave Behind (Save Space) Accordion */}
        {(activeFilter === "all" || activeFilter === "leave_behind") && (
          <div className="rounded-2xl border border-[#ede7dd] bg-[#faf8f5] overflow-hidden">
            <button
              onClick={() => toggleAccordion("leaveBehind")}
              className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 hover:bg-[#f3ede3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MinusCircle className="w-4 h-4 text-rose-500" />
                <span>Leave Behind (Save Space)</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {leaveBehindItems.length} items
                </span>
              </div>
              {accordionOpen.leaveBehind ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            
            {accordionOpen.leaveBehind && (
              <div className="p-2.5 bg-white border-t border-[#ede7dd] space-y-1.5 text-xs text-slate-500">
                {leaveBehindItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.note}</span>
                    </div>
                    <span className="text-[9px] text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-[#f0eae0] shrink-0 mt-auto">
        {onTriggerVoice && (
          <button
            onClick={onTriggerVoice}
            className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isVoicePlaying
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-[#faf8f5] hover:bg-[#f3eee5] text-[#241746] border-[#e7e0d3]'
            }`}
          >
            {isVoicePlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-500" />
                <span>Stop Voice Coach</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#7054E8]" />
                <span>Voice Coach Briefing</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={handleMarkAll}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Mark All Packed</span>
        </button>
      </div>

    </div>
  );
}
