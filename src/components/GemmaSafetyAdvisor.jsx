import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  Send, 
  Clock, 
  Droplet, 
  Compass, 
  AlertOctagon,
  Sparkles,
  Lock
} from 'lucide-react';
import { askGemmaAgent, formatGemma2Prompt } from '../services/gemmaTrailAgent';

export default function GemmaSafetyAdvisor({ currentTrail }) {
  const [userQuery, setUserQuery] = useState("What is my strict turnaround time and hydration plan?");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);

  const handleRunGemma = async (query = userQuery) => {
    setIsLoading(true);
    const res = await askGemmaAgent(currentTrail, query);
    setResponse(res);
    setIsLoading(false);
  };

  const sampleQuestions = [
    "What is my strict turnaround time and hydration plan?",
    "How to handle a sudden black bear encounter on the ridge?",
    "How do I recognize hypothermia symptoms in my hiking partner?",
    "Explain Leave-No-Trace rules for alpine summit mosses."
  ];

  const rawPrompt = formatGemma2Prompt(currentTrail, userQuery);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-5 py-4 bg-stone-950/80 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-300">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-100">
                Gemma 2 Offline Backcountry Guardian
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Google Gemma 2 (9B-IT) • Local Inference
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Open-weight reasoning for daylight turnaround times, wilderness survival & Leave-No-Trace
            </p>
          </div>
        </div>

        {/* Prompt Inspector Toggle */}
        <button
          onClick={() => setShowPromptInspector(!showPromptInspector)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono border border-stone-700 transition"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>{showPromptInspector ? "Hide System Turn" : "Inspect Gemma Tokens"}</span>
        </button>
      </div>

      {/* Quick Prompt Inspector (Open Weights & Turn Engineering) */}
      {showPromptInspector && (
        <div className="p-4 bg-stone-950 border-b border-stone-800 text-xs font-mono text-stone-300 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="font-bold">Gemma 2 Turn-Formatted Prompt Template:</span>
            <span className="text-[10px] text-stone-500">Zero Cloud Leakage • Local Tokenizer</span>
          </div>
          <pre className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] overflow-x-auto text-indigo-200/90 leading-relaxed max-h-48 scrollbar-none">
            {rawPrompt}
          </pre>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Trail Safety Pillars */}
        <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-stone-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-300 uppercase tracking-wider">
            <span>OFFLINE SAFETY AUDIT ({currentTrail.name})</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Turnaround Time */}
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[11px]">Hard Turnaround Threshold:</span>
                <span className="text-stone-100 font-bold font-mono text-sm">
                  {currentTrail.microclimateTabPFN.safeTurnaroundTime}
                </span>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Sunset is at {currentTrail.microclimateTabPFN.sunsetTime}. Forest canopy causes dusk to darken 30m early.
                </p>
              </div>
            </div>

            {/* Hydration Plan */}
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <Droplet className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[11px]">Hydration Budget:</span>
                <span className="text-stone-100 font-bold">
                  {currentTrail.gemmaSafetyBriefing.hydrationNeeded}
                </span>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Based on {currentTrail.distance} and {currentTrail.elevationGain} elevation burn.
                </p>
              </div>
            </div>

            {/* Wildlife Protocol */}
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[11px]">Wildlife Interaction Protocol:</span>
                <span className="text-stone-200">
                  {currentTrail.gemmaSafetyBriefing.wildlifeAdvisory}
                </span>
              </div>
            </div>

            {/* Leave-No-Trace */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-start gap-3">
              <Compass className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-emerald-400 block text-[11px] font-semibold">Leave-No-Trace Ethics:</span>
                <span className="text-emerald-200 text-xs">
                  {currentTrail.gemmaSafetyBriefing.leaveNoTrace}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Gemma Reasoning Engine */}
        <div className="lg:col-span-7 p-5 bg-stone-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                QUERY GEMMA 2 LOCALLY
              </span>
              <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Zero Network Activity
              </span>
            </div>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserQuery(q);
                    handleRunGemma(q);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border border-stone-700/60 transition text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask Gemma about backcountry safety, edible plants, or weather..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleRunGemma(userQuery)}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-[#285943] hover:bg-[#204936] text-[#FBF8EF] font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Box */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 min-h-[160px] text-xs leading-relaxed text-stone-200">
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-stone-400 gap-2">
                  <Cpu className="w-5 h-5 animate-spin text-indigo-400" />
                  <span>Gemma 2 is synthesizing offline telemetry & safety protocols...</span>
                </div>
              ) : response ? (
                <div className="space-y-2 whitespace-pre-line">
                  {response.response}
                  <div className="mt-3 pt-2 border-t border-stone-800 text-[10px] font-mono text-stone-500 flex justify-between">
                    <span>Engine: {response.model}</span>
                    <span>Offline Status: 100% On-Device</span>
                  </div>
                </div>
              ) : (
                <div className="text-stone-400 italic py-6 text-center">
                  Click one of the questions above or type your own to invoke Gemma 2's offline reasoning model.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
