import React, { useState } from 'react';
import { 
  History, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Trash2, 
  Edit3, 
  RotateCcw,
  CheckCircle2,
  BookOpen,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export default function MemoryVaultView({
  memoryList,
  onAddIncident,
  onUpdateRule,
  onDeleteRecord,
  onResetMemory,
  friendName = "Alex"
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContext, setSelectedContext] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newTripContext, setNewTripContext] = useState("Hostel to Home");
  const [newIncidentNote, setNewIncidentNote] = useState("");
  const [newRule, setNewRule] = useState("");

  const filteredList = memoryList.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.lastIncident?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContext = selectedContext === "all" || item.tripContext === selectedContext;
    return matchesSearch && matchesContext;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddIncident(newItemName.trim(), newTripContext, newIncidentNote.trim(), newRule.trim());
    setNewItemName("");
    setNewIncidentNote("");
    setNewRule("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="faded-glass rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
                {friendName}'s Memory Vault
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                The clever learning loop: items recorded here perpetually influence future checklist priorities and spatial alerts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Incident</span>
          </button>

          <button
            onClick={onResetMemory}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            title="Reset to default sample incidents"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="faded-glass-pill rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Memory Rules
          </span>
          <span className="text-2xl font-black text-[#1e1b4b] mt-1 block">
            {memoryList.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Guarding all future packing sessions
          </span>
        </div>

        <div className="faded-glass-pill rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Highest Risk Hazard
          </span>
          <span className="text-sm font-black text-rose-600 mt-1 block truncate">
            Laptop Charger (Wall Outlet)
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Forgotten 3x on Hostel to Home visits
          </span>
        </div>

        <div className="faded-glass-pill rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Incident Reduction Rate
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            -60%
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Down from 4 items/month to 1
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="faded-glass rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search forgotten items or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#eee8dd] text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7054E8]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {["all", "Hostel to Home", "College Presentation", "Weekend Trip"].map((ctx) => (
            <button
              key={ctx}
              onClick={() => setSelectedContext(ctx)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedContext === ctx
                  ? 'bg-[#7054E8] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ctx === "all" ? "All Trips" : ctx}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((mem) => {
          const isCritical = mem.timesForgotten >= 3 || mem.urgency === "critical";
          return (
            <div
              key={mem.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between gap-3 ${
                isCritical ? 'border-rose-300 ring-1 ring-rose-200' : 'border-[#ede7dd]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-[#1e1b4b]">
                        {mem.itemName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Forgotten {mem.timesForgotten}x
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block">
                      Context: <strong className="text-slate-600">{mem.tripContext}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteRecord(mem.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 italic bg-[#faf8f5] p-2.5 rounded-xl border border-[#eee8dd] mb-3">
                  "{mem.lastIncident}"
                </p>

                {/* Active Prevention Rule */}
                <div className="p-3 rounded-xl bg-[#f5f3ff] border border-[#ede9fe] text-xs text-[#5b21b6]">
                  <span className="font-extrabold flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7054E8]" />
                    Active Spatial Countermeasure:
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {mem.learningRule}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#f4efe6]">
                <span>Status: Escalated in Future Checklists</span>
                <span className="font-mono">ID: {mem.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log New Incident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-[#1e1b4b] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Log Forgotten Item Incident</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDMI Display Adapter, Laptop Charger, Powerbank..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Trip Type
                </label>
                <select
                  value={newTripContext}
                  onChange={(e) => setNewTripContext(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
                >
                  <option value="Hostel to Home">Hostel to Home</option>
                  <option value="College Presentation">College Presentation</option>
                  <option value="Weekend Trip">Weekend Trip</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  What happened? (Incident Context)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Left behind in hostel room socket; couldn't work on laptop during weekend."
                  value={newIncidentNote}
                  onChange={(e) => setNewIncidentNote(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7054E8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Custom Prevention Rule (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Check wall socket behind desk before door is locked."
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7054E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black shadow-md shadow-purple-500/20"
                >
                  Save Incident & Teach CheckMate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
