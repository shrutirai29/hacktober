import React, { useState } from 'react';
import { 
  X, 
  History, 
  Plus, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function MemoryVaultModal({ 
  isOpen, 
  onClose, 
  memoryList, 
  onAddIncident, 
  onResetMemory,
  friendName = "Alex"
}) {
  const [newItemName, setNewItemName] = useState("");
  const [newTripContext, setNewTripContext] = useState("Hostel to Home");
  const [newIncidentNote, setNewIncidentNote] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddIncident(newItemName.trim(), newTripContext, newIncidentNote.trim());
    setNewItemName("");
    setNewIncidentNote("");
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{friendName}'s Forgotten Items Memory</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                  {memoryList.length} Active Rules
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                The clever learning loop: items recorded here are perpetually flagged in future packing manifests.
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Quick Explanation */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">How CheckMate Learns: </span>
              Every time {friendName} leaves an item behind (like a charger on the wall or gate pass on the desk), CheckMate records the spatial failure pattern and injects proactive countermeasures into future scans.
            </div>
          </div>

          {/* Memory List */}
          <div className="space-y-3">
            {memoryList.map((mem) => {
              const isCritical = mem.urgency === "critical" || mem.timesForgotten >= 3;
              return (
                <div
                  key={mem.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCritical
                      ? 'bg-amber-950/20 border-amber-700/60'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white">
                        {mem.itemName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {mem.tripContext}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isCritical 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        Forgotten {mem.timesForgotten} time{mem.timesForgotten > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-1.5 italic">
                    "{mem.lastIncident}"
                  </p>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-sky-300 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Active Countermeasure:</strong> {mem.learningRule}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Incident Form Toggle */}
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-white block">
                Record Newly Forgotten Item
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Toothbrush, Power Strip..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">
                    Trip Context
                  </label>
                  <select
                    value={newTripContext}
                    onChange={(e) => setNewTripContext(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Hostel to Home">Hostel to Home</option>
                    <option value="College Presentation">College Presentation</option>
                    <option value="Weekend Trip">Weekend Trip</option>
                    <option value="General Travel">General Travel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  What happened? (Incident Context)
                </label>
                <input
                  type="text"
                  value={newIncidentNote}
                  onChange={(e) => setNewIncidentNote(e.target.value)}
                  placeholder="e.g. Left on the bathroom counter; had to purchase a replacement."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors"
                >
                  Save & Teach CheckMate
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record New Forgotten Item Incident</span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={onResetMemory}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
            title="Reset memory back to demo defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Memory</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
