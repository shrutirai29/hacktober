import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  WifiOff, 
  Coins, 
  Sliders, 
  Copy, 
  Check, 
  Terminal,
  ExternalLink
} from 'lucide-react';

export default function GemmaInspectorModal({ 
  isOpen, 
  onClose, 
  rawPrompt, 
  modelUsed = "Gemma 2 (27B-IT) / PaliGemma",
  onSaveCustomSettings
}) {
  const [copied, setCopied] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434/api/generate");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (rawPrompt) {
      navigator.clipboard.writeText(rawPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onSaveCustomSettings?.({ ollamaUrl, elevenLabsKey });
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gemma Open-Weight Architecture</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                  {modelUsed}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Why open innovation and local inference are essential for CheckMate.
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
          
          {/* 4 Pillars of Open Innovation for CheckMate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Absolute Room Privacy</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Hostel rooms and private bedrooms contain sensitive personal items. Open weights ensure room scans never leave the user's laptop.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Offline Hostel & Transit Operation</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Hostel Wi-Fi outages or packing in transit shouldn't break your checklist. CheckMate runs on-device without cloud dependency.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Zero API Token Tax</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  A student packing multiple times a week shouldn't run up a cloud bill. Open-weight inference costs exactly $0.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Fine-Tunable Spatial Memory</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Gemma open weights can be LoRA fine-tuned on real student room photos and packing logs without commercial API lock-in.
                </p>
              </div>
            </div>
          </div>

          {/* Prompt Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                Raw Gemma Prompt Template & Turn Structure
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy Prompt"}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-[11px] font-mono text-slate-300 max-h-56 leading-relaxed">
              <pre>{rawPrompt || "Prompt will populate when synthesis runs."}</pre>
            </div>
          </div>

          {/* Model Connection Settings (Optional for advanced testers) */}
          <form onSubmit={handleSaveSettings} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white block">
              Optional: Connect Local Ollama / ElevenLabs
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Local Ollama URL (e.g. Gemma 2)
                </label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434/api/generate"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  ElevenLabs API Key (Optional audio voice)
                </label>
                <input
                  type="password"
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  placeholder="xi-..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                * CheckMate runs seamlessly offline using built-in deterministic reasoning if left blank.
              </span>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
              >
                {savedSettingsMsg ? "Saved!" : "Save Settings"}
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
