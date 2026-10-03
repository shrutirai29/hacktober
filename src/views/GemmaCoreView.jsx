import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw,
  Wifi,
  Coins,
  Sliders,
  Database
} from 'lucide-react';

export default function GemmaCoreView() {
  const [copied, setCopied] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    online: false,
    ollama_connected: false,
    model: "gemma2",
    inference_mode: "checking..."
  });

  const checkHealth = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch("http://localhost:5050/api/health");
      if (res.ok) {
        const data = await res.json();
        setBackendStatus({
          loading: false,
          online: true,
          ollama_connected: data.ollama_connected,
          model: data.configured_model || "gemma2",
          inference_mode: data.inference_mode
        });
      } else {
        throw new Error("HTTP error");
      }
    } catch (e) {
      setBackendStatus({
        loading: false,
        online: false,
        ollama_connected: false,
        model: "gemma2",
        inference_mode: "deterministic_rule_engine"
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const samplePrompt = `<start_of_turn>system
You are CheckMate, a travel preparation assistant.
Return structured, trip-relevant packing suggestions.
Use memory records as priority signals.
Do not claim to observe physical states that were not verified.
Ground suggestions in trip purpose, weather, and verified room detections.
<end_of_turn>

<start_of_turn>user
[TRIP CONTEXT]
Trip Purpose: College Presentation
Duration: 2-3 Days (Weekend)
Weather: Rain Forecast (18°C)
Mode: DEPARTURE PACKING

[VERIFIED ROOM DETECTIONS]
- 65W Laptop Charger (Wall Socket area) [Confidence: 94%]
- Laptop (Study Desk) [Confidence: 98%]
- ID Card & Lanyard [Confidence: 90%]
- USB-C Hub & Display Adapter [Confidence: 97%]

[FORGOTTEN ITEM HISTORY]
- Laptop Charger: Forgotten 3x on hostel visits (Wall socket check required)
- HDMI Adapter: Forgotten 2x on presentations (High failure consequence)

Generate categorized packing manifest with causal justifications.
<end_of_turn>
<start_of_turn>model
Structured recommendations generated...
<end_of_turn>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="faded-glass rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7054E8] flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
              Gemma Core: Open-Weight Architecture
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time monitoring of local Gemma 2 inference, Ollama bridge, and privacy guarantees.
            </p>
          </div>
        </div>

        <button
          onClick={checkHealth}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${backendStatus.loading ? 'animate-spin' : ''}`} />
          <span>Refresh Health Check</span>
        </button>
      </div>

      {/* Real Backend Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Python Backend Status */}
        <div className="faded-glass-pill rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Python Backend Bridge
          </span>
          <div className="flex items-center gap-2 mt-1">
            {backendStatus.online ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-black text-emerald-600">Online (:5050)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-sm font-black text-rose-600">Offline (Fallback Active)</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            backend/gemma_engine.py
          </span>
        </div>

        {/* Ollama Connection */}
        <div className="faded-glass-pill rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Local Ollama Engine
          </span>
          <div className="flex items-center gap-2 mt-1">
            {backendStatus.ollama_connected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-black text-emerald-600">Ollama Connected</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-sm font-black text-amber-600">Rule Engine Mode</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Endpoint: http://localhost:11434
          </span>
        </div>

        {/* Configured Model */}
        <div className="faded-glass-pill rounded-2xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Reasoning Engine
          </span>
          <span className="text-sm font-black text-[#7054E8] mt-1 block">
            {backendStatus.ollama_connected ? "Gemma 2 (27B/9B)" : "Deterministic Rule Engine"}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {backendStatus.inference_mode}
          </span>
        </div>

      </div>

      {/* Four Pillars of Open Innovation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="faded-glass-pill rounded-2xl p-4 space-y-1.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black text-[#1e1b4b]">100% Room Privacy</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Personal hostel rooms and messy study desks contain private items. Local weights guarantee photos never leave Alex's laptop.
          </p>
        </div>

        <div className="faded-glass-pill rounded-2xl p-4 space-y-1.5">
          <div className="p-2 rounded-xl bg-purple-50 text-[#7054E8] w-fit">
            <Wifi className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black text-[#1e1b4b]">Transit Resilience</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Hostel Wi-Fi blackouts and transit corridors do not break your packing. CheckMate runs completely offline.
          </p>
        </div>

        <div className="faded-glass-pill rounded-2xl p-4 space-y-1.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 w-fit">
            <Coins className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black text-[#1e1b4b]">Zero API Token Tax</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            College students shouldn't pay 5 cents each time they pack. Open-source inference costs $0 forever.
          </p>
        </div>

        <div className="faded-glass-pill rounded-2xl p-4 space-y-1.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 w-fit">
            <Sliders className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black text-[#1e1b4b]">Fine-Tunable Weights</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Open Gemma weights allow LoRA fine-tuning directly on messy desk photos and student habits without vendor lock-in.
          </p>
        </div>

      </div>

      {/* Prompt Structure Inspector */}
      <div className="faded-glass rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0eae0]">
          <div className="flex items-center gap-2 text-[#1e1b4b]">
            <Terminal className="w-4 h-4 text-[#7054E8]" />
            <h3 className="font-black text-sm">Gemma 2 Conversation Turn Structure</h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-bold text-[#7054E8] hover:text-[#5b3ee0] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Template"}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eee8dd] font-mono text-xs text-slate-700 leading-relaxed overflow-x-auto max-h-72">
          <pre>{samplePrompt}</pre>
        </div>
      </div>

    </div>
  );
}
