import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Radio, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Zap,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { canopyAI } from '../services/localAIProvider';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function OpenAIPanel({ currentTrail, audioMuted }) {
  const [activeProvider, setActiveProvider] = useState(canopyAI.activeProviderKey);
  const [aiStatus, setAiStatus] = useState(canopyAI.getStatus());
  const [demoState, setDemoState] = useState('initial'); // 'initial' | 'unsafe' | 'safe'
  const [demoResponse, setDemoResponse] = useState(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isFailureSimulated, setIsFailureSimulated] = useState(false);

  useEffect(() => {
    return canopyAI.subscribe((status) => {
      setAiStatus(status);
    });
  }, []);

  const handleSwitchProvider = async (key) => {
    setActiveProvider(key);
    await canopyAI.setProvider(key);
  };

  const toggleModelFailure = () => {
    const nextState = !isFailureSimulated;
    setIsFailureSimulated(nextState);
    canopyAI.simulateFailure(nextState);
  };

  const runDemoScenario = async (type) => {
    setIsDemoLoading(true);
    setDemoState(type);

    if (type === 'scenario_b') {
      // SCENARIO B: 4,270m, 2°C, Poor visibility, Risk 85, Time 4:00 PM, Turnaround 2:30 PM
      const res = await canopyAI.askCanopy({
        userQuery: "Should I continue?",
        rawContext: {
          trail: currentTrail,
          elevation: "4,270m",
          temperature: "2°C",
          tempNum: 2,
          riskScore: 85,
          visibility: "Poor (<50m whiteout)",
          currentTime: "4:00 PM",
          turnaroundTime: "2:30 PM",
          weatherCondition: "Severe Ridge Freeze"
        }
      });
      setDemoResponse(res);
      if (!audioMuted) {
        speakTrailWhisper("Deterministic Safety Override Active. Turn back immediately. You are beyond the mandatory turnaround window.", { chime: 'warning' });
      }
    } else if (type === 'scenario_a') {
      // SCENARIO A: 2,500m, 15°C, Good visibility, Risk 20, Time 10:00 AM, Turnaround 2:30 PM
      const res = await canopyAI.askCanopy({
        userQuery: "Should I continue?",
        rawContext: {
          trail: currentTrail,
          elevation: "2,500m",
          temperature: "15°C",
          tempNum: 15,
          riskScore: 20,
          visibility: "Good (>15 km)",
          currentTime: "10:00 AM",
          turnaroundTime: "2:30 PM",
          weatherCondition: "Clear Alpine Morning"
        }
      });
      setDemoResponse(res);
      if (!audioMuted) {
        speakTrailWhisper("Conditions are safe. Maintain conversational pace and monitor high pass weather.", { chime: 'nature' });
      }
    } else if (type === 'hallucination') {
      // Zero Hallucination Test: unknown checkpoint
      const res = await canopyAI.askCanopy({
        userQuery: "What is the temperature at checkpoint XYZ?",
        rawContext: {
          trail: currentTrail,
          elevation: "4,270m",
          temperature: "8°C",
          riskScore: 45,
          turnaroundTime: "2:30 PM",
          currentTime: "11:00 AM"
        }
      });
      setDemoResponse(res);
    } else if (type === 'unmonitored') {
      // Unknown Sensor Metric Test
      const res = await canopyAI.askCanopy({
        userQuery: "What is the UV index at checkpoint 2?",
        rawContext: {
          trail: currentTrail,
          elevation: "4,270m",
          temperature: "8°C"
        }
      });
      setDemoResponse(res);
    }
    setIsDemoLoading(false);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* 1. Header Banner: Why Open AI & Live Truthful Status */}
      <div className="outdoor-card p-6 bg-[#F2F8F4]/98 border-[#C8DEC8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#285943] text-emerald-100 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-200" />
            </span>
            <h2 className="text-lg font-black text-[#1A2E22]">
              Why Open-Weight AI & Local Inference Matters
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#DCEBDA] text-[#285943] text-[10px] font-bold border border-[#A8C8AF]">
              Offline Sovereign AI
            </span>
          </div>
          <p className="text-xs text-[#486350] max-w-2xl leading-relaxed">
            Canopy executes its intelligence directly on your device via browser WebGPU or local wasm. Your real-time mountain location, sensor packets, and safety questions never leave your machine.
          </p>
        </div>

        {/* Live Truthful Status Pill */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 ${
          aiStatus?.isFallback
            ? 'bg-amber-100 border-amber-300'
            : aiStatus?.state === 'LOADING'
            ? 'bg-blue-100 border-blue-300'
            : 'bg-[#E2EFE5] border-[#C8DEC8]'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            aiStatus?.state === 'LOADING' ? 'bg-blue-600 animate-ping' :
            aiStatus?.isFallback ? 'bg-amber-600' : 'bg-emerald-600 animate-pulse'
          }`} />
          <div className="text-left">
            <span className="text-[10px] font-bold block text-[#1A2E22] uppercase tracking-wider font-mono">
              ● {aiStatus?.badge || 'LOCAL AI ACTIVE'}
            </span>
            <span className="text-[9px] text-[#486350] block font-medium max-w-[220px] truncate" title={aiStatus?.label}>
              {aiStatus?.label || '100% On-Device • Zero Cloud API'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Open Innovation Pipeline Graphic */}
      <div className="outdoor-card p-6 bg-[#F2F8F4]/98 border-[#C8DEC8] shadow-sm">
        <h3 className="text-xs font-black text-[#1A2E22] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#285943]" />
          <span>Canopy Open Architecture Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-[#E2EFE5] border border-[#C8DEC8] flex flex-col items-center justify-center space-y-1">
            <span className="text-lg">📦</span>
            <strong className="text-xs text-[#1A2E22]">OPEN WEIGHTS</strong>
            <span className="text-[10px] text-[#486350]">SmolLM2-135M / Deep MLP</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-[#285943]">
            <ChevronRight className="w-5 h-5" />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E2EFE5] border border-[#C8DEC8] flex flex-col items-center justify-center space-y-1">
            <span className="text-lg">⚡</span>
            <strong className="text-xs text-[#1A2E22]">LOCAL INFERENCE</strong>
            <span className="text-[10px] text-[#486350]">Browser WebGPU & WebAssembly</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-[#285943]">
            <ChevronRight className="w-5 h-5" />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E2EFE5] border border-[#C8DEC8] flex flex-col items-center justify-center space-y-1">
            <span className="text-lg">🛡️</span>
            <strong className="text-xs text-[#1A2E22]">SAFETY ENGINE</strong>
            <span className="text-[10px] text-[#486350]">Deterministic Hard Cutoffs</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#C8DEC8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#486350]">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#285943] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1A2E22] block font-bold">100% Private Data:</strong>
              <span>GPS coords, telemetry, and queries remain in device memory.</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Radio className="w-4 h-4 text-[#285943] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1A2E22] block font-bold">Zero Cloud Cost:</strong>
              <span>Runs with airplane mode active on remote backcountry passes.</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-[#285943] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1A2E22] block font-bold">Model Swappable:</strong>
              <span>Pluggable provider architecture with deterministic fallbacks.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Model Swapper & Active License Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 outdoor-card p-5 bg-[#F2F8F4]/98 border-[#C8DEC8] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#1A2E22] uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#285943]" />
              <span>Pluggable Local AI Providers</span>
            </h3>
            <span className="text-[10px] font-mono text-[#285943] font-bold">
              3 Adapters Ready
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Provider 1: WebLLM Open-Weight Model (Primary Challenge Architecture) */}
            <div 
              onClick={() => handleSwitchProvider('webllm')}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                activeProvider === 'webllm'
                  ? 'bg-[#E2EFE5] border-[#285943] shadow-xs'
                  : 'bg-[#F2F8F4] border-[#C8DEC8] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#1A2E22] mb-1">
                <span className="flex items-center gap-1.5">
                  <span>WebLLM SmolLM2-135M</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-800 text-[9px] text-emerald-100 font-bold uppercase">Primary</span>
                </span>
                {activeProvider === 'webllm' && <CheckCircle2 className="w-3.5 h-3.5 text-[#285943]" />}
              </div>
              <p className="text-[11px] text-[#486350] leading-snug">
                Small instruction-tuned language model executed in-browser via WebGPU with zero remote API or backend dependency.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[#285943]">
                <span className="bg-[#DCEBDA] px-2 py-0.5 rounded font-bold">License: Apache 2.0</span>
                <span>Runtime: WebGPU / MLC</span>
              </div>
            </div>

            {/* Provider 2: On-Device Deep MLP (Fallback) */}
            <div 
              onClick={() => handleSwitchProvider('mlp')}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                activeProvider === 'mlp'
                  ? 'bg-[#E2EFE5] border-[#285943] shadow-xs'
                  : 'bg-[#F2F8F4] border-[#C8DEC8] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#1A2E22] mb-1">
                <span className="flex items-center gap-1.5">
                  <span>Canopy Backcountry Net (On-Device MLP)</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#C8DEC8] text-[9px] text-[#1A2E22] font-bold uppercase">Fallback</span>
                </span>
                {activeProvider === 'mlp' && <CheckCircle2 className="w-3.5 h-3.5 text-[#285943]" />}
              </div>
              <p className="text-[11px] text-[#486350] leading-snug">
                3-Layer neural network trained in-browser. 100% offline, zero download, instant deterministic response.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[#285943]">
                <span className="bg-[#DCEBDA] px-2 py-0.5 rounded font-bold">License: MIT</span>
                <span>Latency: ~1.2ms</span>
              </div>
            </div>

            {/* Provider 3: Local Ollama Gemma 2 */}
            <div 
              onClick={() => handleSwitchProvider('ollama')}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                activeProvider === 'ollama'
                  ? 'bg-[#E2EFE5] border-[#285943] shadow-xs'
                  : 'bg-[#F2F8F4] border-[#C8DEC8] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#1A2E22] mb-1">
                <span>Local Gemma 2 (9B-IT) via Ollama</span>
                {activeProvider === 'ollama' && <CheckCircle2 className="w-3.5 h-3.5 text-[#285943]" />}
              </div>
              <p className="text-[11px] text-[#486350] leading-snug">
                Localhost daemon connection (port 11434). Sovereign open-weight reasoning without remote cloud telemetry.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[#285943]">
                <span className="bg-[#DCEBDA] px-2 py-0.5 rounded font-bold">License: Gemma Open License</span>
                <span>Host: localhost:11434</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Deterministic Demo Verification Console */}
        <div className="lg:col-span-7 outdoor-card p-5 bg-[#F2F8F4]/98 border-[#C8DEC8] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-[#1A2E22] uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#285943]" />
                <span>Deterministic Verification Sandbox</span>
              </h3>
              <span className="text-[10px] text-[#486350] font-bold">
                Verification Sandbox
              </span>
            </div>
            <p className="text-xs text-[#486350] leading-relaxed">
              Verify how Canopy's Deterministic Safety Engine intercepts unsafe conditions versus clear conditions for the query: <code className="bg-[#E2EFE5] px-1.5 py-0.5 rounded text-[#1A2E22] font-bold">"Should I continue?"</code>
            </p>

            {/* Scenario Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 my-3">
              <button
                onClick={() => runDemoScenario('scenario_a')}
                disabled={isDemoLoading}
                className={`p-2.5 rounded-xl border text-left transition ${
                  demoState === 'scenario_a'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                    : 'bg-[#E2EFE5] border-[#C8DEC8] hover:bg-white text-[#1A2E22]'
                }`}
              >
                <div className="text-[11px] font-extrabold flex items-center gap-1 text-emerald-700">
                  <span>☀️ Scenario A: Safe Morning</span>
                </div>
                <div className="text-[10px] text-[#486350] mt-0.5">
                  2,500m • 15°C • Risk 20 • 10:00 AM
                </div>
              </button>

              <button
                onClick={() => runDemoScenario('scenario_b')}
                disabled={isDemoLoading}
                className={`p-2.5 rounded-xl border text-left transition ${
                  demoState === 'scenario_b'
                    ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs'
                    : 'bg-[#E2EFE5] border-[#C8DEC8] hover:bg-white text-[#1A2E22]'
                }`}
              >
                <div className="text-[11px] font-extrabold flex items-center gap-1 text-rose-700">
                  <span>🚨 Scenario B: Dangerous Cutoff</span>
                </div>
                <div className="text-[10px] text-[#486350] mt-0.5">
                  4,270m • 2°C • Risk 85 • 4:00 PM (Cutoff 2:30 PM)
                </div>
              </button>

              <button
                onClick={() => runDemoScenario('hallucination')}
                disabled={isDemoLoading}
                className={`p-2.5 rounded-xl border text-left transition ${
                  demoState === 'hallucination'
                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                    : 'bg-[#E2EFE5] border-[#C8DEC8] hover:bg-white text-[#1A2E22]'
                }`}
              >
                <div className="text-[11px] font-extrabold flex items-center gap-1 text-amber-700">
                  <span>🔍 Hallucination Test</span>
                </div>
                <div className="text-[10px] text-[#486350] mt-0.5">
                  Query: "Temp at checkpoint XYZ?"
                </div>
              </button>

              <button
                onClick={() => runDemoScenario('unmonitored')}
                disabled={isDemoLoading}
                className={`p-2.5 rounded-xl border text-left transition ${
                  demoState === 'unmonitored'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold shadow-xs'
                    : 'bg-[#E2EFE5] border-[#C8DEC8] hover:bg-white text-[#1A2E22]'
                }`}
              >
                <div className="text-[11px] font-extrabold flex items-center gap-1 text-teal-700">
                  <span>📡 Unmonitored Metric Test</span>
                </div>
                <div className="text-[10px] text-[#486350] mt-0.5">
                  Query: "UV index at checkpoint 2?"
                </div>
              </button>
            </div>

            {/* Model Failure Simulation Toggle */}
            <div className="p-2.5 rounded-xl bg-[#E2EFE5] border border-[#C8DEC8] flex items-center justify-between gap-2 mb-3">
              <div className="text-[11px] text-[#1A2E22]">
                <strong className="block font-bold">Model Failure Failsafe Test:</strong>
                <span className="text-[10px] text-[#486350]">Simulate AI unavailable and test deterministic safety engine fallback</span>
              </div>
              <button
                onClick={toggleModelFailure}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  isFailureSimulated
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                    : 'bg-stone-200 text-stone-800 border-stone-300 hover:bg-stone-300'
                }`}
              >
                {isFailureSimulated ? "AI Offline (Click to Restore)" : "Simulate AI Failure"}
              </button>
            </div>

            {/* Console Output */}
            <div className="p-4 rounded-2xl bg-[#EAF3EC] border border-[#C8DEC8] text-xs font-mono min-h-[160px] whitespace-pre-line leading-relaxed text-[#1A2E22]">
              {isDemoLoading ? (
                <div className="flex items-center gap-2 text-[#486350] py-10 justify-center">
                  <Activity className="w-4 h-4 animate-spin text-[#285943]" />
                  <span>Evaluating context and deterministic safety rules...</span>
                </div>
              ) : demoResponse ? (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#C8DEC8] text-[10px] text-[#486350]">
                    <span>Provider: {demoResponse.providerName} | Model: {demoResponse.modelName}</span>
                    <span className={demoResponse.isDeterministicOverride ? "text-rose-700 font-bold" : "text-emerald-700 font-bold"}>
                      {demoResponse.isDeterministicOverride ? "⚠️ HARD OVERRIDE ACTIVE" : "✅ SAFETY APPROVED"}
                    </span>
                  </div>
                  {demoResponse.response}
                </div>
              ) : (
                <span className="text-[#486350] italic">
                  Select Scenario A or B above to observe how the AI output dynamically alters based on the strict environmental context.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
