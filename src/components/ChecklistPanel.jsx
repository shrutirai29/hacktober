import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  ShieldAlert, 
  MapPin, 
  Plus, 
  CheckCircle,
  Eye,
  MinusCircle,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChecklistPanel({
  checklistData,
  items,
  onToggleItem,
  onAddItem,
  onMarkForgotten,
  onHoverItem,
  highlightedItemId,
  onTriggerVoice,
  isVoicePlaying,
  mode
}) {
  const [newItemName, setNewItemName] = useState("");

  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Trigger celebratory confetti when reaching 100%
  const handleToggle = (id) => {
    const targetItem = items.find(i => i.id === id);
    const willBeChecked = !targetItem?.checked;
    onToggleItem(id);

    if (willBeChecked && checkedCount + 1 === totalCount) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#22d3ee', '#818cf8', '#f43f5e', '#f59e0b', '#10b981']
      });
    }
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim());
    setNewItemName("");
  };

  const criticalItems = items.filter(i => i.priority === "critical");
  const regularItems = items.filter(i => i.priority !== "critical");

  const getCategoryColor = (cat) => {
    if (!cat) return "bg-slate-800 text-slate-300 border-slate-700";
    const lower = cat.toLowerCase();
    if (lower.includes("tech") || lower.includes("cable") || lower.includes("av")) return "bg-purple-950/80 text-purple-300 border-purple-800/60";
    if (lower.includes("doc") || lower.includes("pass")) return "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
    if (lower.includes("power") || lower.includes("charger")) return "bg-amber-950/80 text-amber-300 border-amber-800/60";
    if (lower.includes("attire") || lower.includes("footwear")) return "bg-indigo-950/80 text-indigo-300 border-indigo-800/60";
    return "bg-sky-950/80 text-sky-300 border-sky-800/60";
  };

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden border border-slate-700/60">
      
      {/* Header & Progress Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                {mode === "departure" ? "Departure Packing Manifest" : "Return Safe Verification"}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === "departure" 
                ? "Physical inspection before zipping bag and locking door."
                : "Verify all electronics & keys return with you."}
            </p>
          </div>

          {/* Quick Voice Exit Nudge button */}
          <button
            onClick={onTriggerVoice}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold self-start sm:self-auto transition-all shadow-md active:scale-95 ${
              isVoicePlaying
                ? 'bg-rose-950 text-rose-200 border-rose-500 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 hover:scale-[1.02]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isVoicePlaying ? "Playing Briefing..." : "Voice Exit Nudge"}</span>
          </button>
        </div>

        {/* Progress Bar Card */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex flex-col gap-2 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              {progressPercent === 100 ? (
                <>
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-extrabold">100% Packed! You are fully prepared, Alex!</span>
                </>
              ) : (
                <span>Packing Progress: {checkedCount} of {totalCount} items verified</span>
              )}
            </span>
            <span className="font-mono font-extrabold text-cyan-400 text-sm">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className={`h-full transition-all duration-500 rounded-full shadow-lg ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-cyan-500/40'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical Memory Alerts Section */}
      {criticalItems.length > 0 && (
        <div className="glass-amber-glow rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-b border-amber-600/30 pb-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>High-Risk Memory Alerts (Forgotten in Past Trips)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-[10px]">
              {criticalItems.length} High Risks
            </span>
          </div>

          <div className="space-y-2.5">
            {criticalItems.map((item) => {
              const isHighlighted = highlightedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => onHoverItem?.(item.id)}
                  onMouseLeave={() => onHoverItem?.(null)}
                  className={`p-3 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                    item.checked
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : isHighlighted
                      ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/30 scale-[1.01]'
                      : 'bg-slate-950/85 border-amber-500/40 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="mt-0.5 text-amber-400 hover:text-amber-300 transition-transform active:scale-90 cursor-pointer"
                    >
                      {item.checked ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Square className="w-5 h-5 text-amber-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-black tracking-tight ${item.checked ? 'line-through text-slate-500' : 'text-white'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm">
                          {item.pastForgottenCount ? `Forgotten ${item.pastForgottenCount}x Prior` : 'Critical'}
                        </span>
                      </div>
                      {item.alertReason && (
                        <p className="text-[11px] text-amber-200/90 mt-1 leading-snug">
                          {item.alertReason}
                        </p>
                      )}
                      {item.spatialTip && (
                        <p className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5 mt-1.5 font-mono bg-cyan-950/50 px-2 py-1 rounded-lg border border-cyan-800/40">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Spatial Check: {item.spatialTip}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onMarkForgotten?.(item.name)}
                    className="text-[10px] font-bold text-amber-400/80 hover:text-rose-400 hover:underline shrink-0 pt-0.5"
                    title="Log that Alex forgot this item again"
                  >
                    + Forgot Again
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular & Vision-Identified Items */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Vision-Detected & Context Essentials ({regularItems.length})</span>
          <span className="text-[10px] text-slate-500 font-mono">Tap checkbox to verify</span>
        </span>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {regularItems.map((item) => {
            const isHighlighted = highlightedItemId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => onHoverItem?.(item.id)}
                onMouseLeave={() => onHoverItem?.(null)}
                className={`p-3 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                  item.checked
                    ? 'bg-slate-950/30 border-slate-800/80 opacity-55'
                    : isHighlighted
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.01]'
                    : 'bg-slate-950/75 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-transform active:scale-90 cursor-pointer"
                  >
                    {item.checked ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold tracking-tight ${item.checked ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {item.name}
                      </span>
                      {item.category && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      )}
                      {item.source && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {item.source}
                        </span>
                      )}
                    </div>
                    {item.alertReason && (
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {item.alertReason}
                      </p>
                    )}
                    {item.spatialTip && (
                      <p className="text-[10px] text-cyan-300 font-medium flex items-center gap-1 mt-1 font-mono">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Check: {item.spatialTip}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onMarkForgotten?.(item.name)}
                  className="text-[10px] text-slate-500 hover:text-amber-400 shrink-0 pt-0.5"
                  title="Mark this item as repeatedly forgotten"
                >
                  Mark Risk
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddNew} className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="+ Add specific item to Alex's packing list..."
          className="flex-1 bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-cyan-600/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Items to Leave Behind (Anti-Clutter Advice) */}
      {checklistData?.itemsToLeaveBehind?.length > 0 && (
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5 shadow-inner">
          <MinusCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-slate-300">Gemma Spatial Advice (Leave in Room): </span>
            <span>Do not pack {checklistData.itemsToLeaveBehind.join(", ")}. Avoid carrying unnecessary weight.</span>
          </div>
        </div>
      )}

    </div>
  );
}
