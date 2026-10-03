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
  X, 
  CheckCircle,
  Eye,
  CornerDownRight,
  MinusCircle
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
  const [activeFilter, setActiveFilter] = useState("all");

  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Trigger celebratory confetti if user hits 100%
  const handleToggle = (id) => {
    const willBeChecked = !items.find(i => i.id === id)?.checked;
    onToggleItem(id);

    if (willBeChecked && checkedCount + 1 === totalCount) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
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

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      
      {/* Header & Progress Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>{mode === "departure" ? "Departure Packing Manifest" : "Return Safe Verification"}</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {checkedCount}/{totalCount} Packed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === "departure" 
                ? "Physical inspection before zipping bag and locking door."
                : "Verify all items return with you to prevent hostel/hotel loss."}
            </p>
          </div>

          {/* Quick Voice Briefing button */}
          <button
            onClick={onTriggerVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold self-start sm:self-auto transition-all ${
              isVoicePlaying
                ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-800/80'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isVoicePlaying ? "Playing Briefing..." : "Voice Exit Nudge"}</span>
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercent === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-sky-500 to-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Critical Memory Alerts Section */}
      {criticalItems.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 sm:p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High-Risk Memory Alerts (Forgotten in Past Trips)</span>
          </div>

          <div className="space-y-2">
            {criticalItems.map((item) => {
              const isHighlighted = highlightedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => onHoverItem?.(item.id)}
                  onMouseLeave={() => onHoverItem?.(null)}
                  className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    item.checked
                      ? 'bg-slate-900/50 border-slate-800 opacity-60'
                      : isHighlighted
                      ? 'bg-amber-900/40 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/80 border-amber-700/60 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="mt-0.5 text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {item.checked ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${item.checked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {item.pastForgottenCount ? `Forgotten ${item.pastForgottenCount}x` : 'Critical'}
                        </span>
                      </div>
                      {item.alertReason && (
                        <p className="text-[11px] text-amber-200/90 mt-0.5">
                          {item.alertReason}
                        </p>
                      )}
                      {item.spatialTip && (
                        <p className="text-[10px] text-sky-400 flex items-center gap-1 mt-1 font-mono">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>Check: {item.spatialTip}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onMarkForgotten?.(item.name)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 hover:underline shrink-0 pt-0.5"
                    title="Report that you forgot this item on a trip"
                  >
                    Log Incident
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular & Vision-Identified Items */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Vision-Detected & Context Essentials ({regularItems.length})
        </span>

        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
          {regularItems.map((item) => {
            const isHighlighted = highlightedItemId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => onHoverItem?.(item.id)}
                onMouseLeave={() => onHoverItem?.(null)}
                className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  item.checked
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    : isHighlighted
                    ? 'bg-sky-950/40 border-sky-400 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    {item.checked ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold ${item.checked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {item.name}
                      </span>
                      {item.category && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          [{item.category}]
                        </span>
                      )}
                      {item.source && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {item.source}
                        </span>
                      )}
                    </div>
                    {item.alertReason && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.alertReason}
                      </p>
                    )}
                    {item.spatialTip && (
                      <p className="text-[10px] text-sky-400 flex items-center gap-1 mt-1 font-mono">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{item.spatialTip}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onMarkForgotten?.(item.name)}
                  className="text-[10px] text-slate-500 hover:text-amber-400 shrink-0 pt-0.5"
                  title="Mark as repeatedly forgotten"
                >
                  Mark Risk
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddNew} className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="+ Add specific item to packing list..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Items to Leave Behind (Anti-Clutter) */}
      {checklistData?.itemsToLeaveBehind?.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <MinusCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">Gemma Advice (Leave in Room): </span>
            <span>Do not pack {checklistData.itemsToLeaveBehind.join(", ")}. Avoid unnecessary baggage weight.</span>
          </div>
        </div>
      )}

    </div>
  );
}
