import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Database, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Check, 
  Save,
  Volume2
} from 'lucide-react';

export default function SettingsView({ onResetAllData, showToast }) {
  const [backendUrl, setBackendUrl] = useState("http://localhost:5050");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [modelName, setModelName] = useState("gemma2:latest");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    showToast?.("Settings saved successfully!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all demo incidents, checklists, and local data?")) {
      onResetAllData?.();
      showToast?.("All local data reset to initial demo state.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="faded-glass rounded-3xl p-6 sm:p-7 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
            Settings & Local Storage
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Configure local AI inference servers, speech behavior, and manage local storage.
          </p>
        </div>
      </div>

      {/* AI Server Config Form */}
      <form onSubmit={handleSave} className="faded-glass rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#f0eae0] text-[#1e1b4b]">
          <Server className="w-4 h-4 text-[#7054E8]" />
          <h3 className="font-black text-sm">Local AI Inference Endpoints</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Python Backend Bridge URL
            </label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 font-mono focus:outline-none focus:border-[#7054E8]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Ollama Server Endpoint
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 font-mono focus:outline-none focus:border-[#7054E8]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Configured Gemma Model
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 font-mono focus:outline-none focus:border-[#7054E8]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f0eae0]">
          <span className="text-[11px] text-slate-400 font-medium">
            * CheckMate falls back to a deterministic rule engine if Ollama is unreachable.
          </span>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-black shadow-md shadow-purple-500/20 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? "Saved" : "Save Changes"}</span>
          </button>
        </div>
      </form>

      {/* Storage Reset Section */}
      <div className="faded-glass rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#f0eae0] text-[#1e1b4b]">
          <Database className="w-4 h-4 text-rose-500" />
          <h3 className="font-black text-sm">Demo Data & Storage Reset</h3>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Reset all recorded forgotten items, incident histories, and packing checklists back to the original demo state.
        </p>

        <div className="pt-1">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data to Defaults</span>
          </button>
        </div>
      </div>

    </div>
  );
}
