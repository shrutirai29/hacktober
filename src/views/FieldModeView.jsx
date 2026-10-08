import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  AlertTriangle, 
  Mountain, 
  Clock, 
  Thermometer, 
  Sun, 
  Radio, 
  Mic, 
  MicOff, 
  ArrowRight,
  EyeOff,
  Flame,
  CheckCircle2,
  TreePine,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { askGemmaAgent } from '../services/gemmaTrailAgent';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function FieldModeView({ currentTrail, audioMuted, onExit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceModeActive, setVoiceModeActive] = useState(true);

  // Field checkpoints
  const checkpoints = currentTrail?.waypoints || [
    { name: "Trailhead (Jobra)", elevation: "2,870 m", terrain: "Forest Floor", tip: "Start early." },
    { name: "Chika Campsite", elevation: "3,200 m", terrain: "Valley Basin", tip: "Cross river gently." },
    { name: "Balu Ka Ghera", elevation: "3,600 m", terrain: "Moraine Scree", tip: "Pre-pass staging." },
    { name: "Hampta Pass Crest", elevation: "4,270 m", terrain: "Glacial Saddle", tip: "Turnaround at 2:30 PM." },
    { name: "Shea Goru", elevation: "3,900 m", terrain: "Rain Shadow Scree", tip: "Cold Spiti winds." }
  ];

  const currentCp = checkpoints[activeStep] || checkpoints[0];
  const nextCp = checkpoints[activeStep + 1] || null;

  // Real-time calculated daylight and risk
  const elevNum = parseInt(currentCp.elevation?.replace(/[^0-9]/g, '') || '3600', 10);
  const riskScore = Math.min(92, Math.max(28, Math.round((elevNum / 4270) * 75 + (activeStep >= 3 ? 12 : 0))));
  const tempEst = Math.round(18 - (elevNum - 2000) * 0.0065);

  const handleNextCheckpoint = () => {
    if (activeStep < checkpoints.length - 1) {
      const nextIdx = activeStep + 1;
      setActiveStep(nextIdx);
      const wp = checkpoints[nextIdx];
      playTrailChime('nature');
      if (voiceModeActive && !audioMuted) {
        speakTrailWhisper(`Approaching ${wp.name}. Elevation ${wp.elevation}. Terrain is ${wp.terrain}. ${wp.tip}`);
      }
    }
  };

  const handleAskFieldVoice = async (queryText) => {
    if (!queryText) return;
    setIsProcessing(true);
    setTranscript(queryText);

    try {
      const res = await askGemmaAgent(currentTrail, queryText, {
        elevation: elevNum,
        temperature: tempEst,
        riskScore: riskScore,
        visibility: "Alpine Ridge Standard",
        turnaroundTime: currentTrail?.turnaroundTime || "2:30 PM"
      });
      setAiAnswer(res.response);

      if (voiceModeActive && !audioMuted) {
        const spoken = res.response.split('\n')[0].replace(/[#*]/g, '');
        speakTrailWhisper(spoken, { chime: res.isDeterministicOverride ? 'warning' : 'nature' });
      }
    } catch (e) {
      setAiAnswer("Safety rule: Maintain buddy checks and strictly turn back at 2:30 PM.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: prompt user
      const typed = prompt("Voice query for Backcountry Guardian:", "Should I continue?");
      if (typed) handleAskFieldVoice(typed);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        playTrailChime('nature');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setIsListening(false);
        handleAskFieldVoice(text);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-[82vh] bg-[#0E1712] text-[#E2EFE5] rounded-3xl p-5 sm:p-7 border border-[#274535] flex flex-col justify-between select-none shadow-2xl font-mono">
      {/* 1. TOP STATUS BAR: OLED Minimal */}
      <div className="flex items-center justify-between pb-4 border-b border-[#274535]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
            FIELD MODE • ACTIVE
          </span>
          <span className="text-[10px] text-[#86A390] hidden sm:inline">
            (Phone in Pocket • Eyes on Trail)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceModeActive(!voiceModeActive)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              voiceModeActive 
                ? 'bg-[#1D3628] border-emerald-500/50 text-emerald-300' 
                : 'bg-[#15231B] border-[#274535] text-[#86A390]'
            }`}
          >
            {voiceModeActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Voice First</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1 rounded-xl bg-[#15231B] border border-[#274535] text-xs font-bold hover:bg-[#1D3628] transition text-[#E2EFE5]"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* 2. CORE TELEMETRY METRICS: High Contrast, Legible at a Glance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* Metric 1: Location */}
        <div className="p-3.5 rounded-2xl bg-[#15231B] border border-[#274535]">
          <span className="text-[10px] font-bold text-[#86A390] uppercase block">CURRENT POINT</span>
          <strong className="text-sm font-extrabold text-[#FBF8EF] block truncate mt-0.5">
            {currentCp.name}
          </strong>
          <span className="text-[10px] text-emerald-400 font-mono">Stage {activeStep + 1} of {checkpoints.length}</span>
        </div>

        {/* Metric 2: Elevation */}
        <div className="p-3.5 rounded-2xl bg-[#15231B] border border-[#274535]">
          <span className="text-[10px] font-bold text-[#86A390] uppercase block">ALTITUDE</span>
          <strong className="text-xl font-black text-[#FBF8EF] block mt-0.5">
            {currentCp.elevation}
          </strong>
          <span className="text-[10px] text-stone-400 font-mono">{tempEst}°C ambient</span>
        </div>

        {/* Metric 3: Risk Score */}
        <div className="p-3.5 rounded-2xl bg-[#15231B] border border-[#274535]">
          <span className="text-[10px] font-bold text-[#86A390] uppercase block">TRAIL RISK</span>
          <strong className={`text-xl font-black block mt-0.5 ${riskScore >= 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {riskScore} / 100
          </strong>
          <span className="text-[10px] text-stone-400 font-mono">
            {riskScore >= 70 ? 'High Hazard Zone' : 'Manageable Incline'}
          </span>
        </div>

        {/* Metric 4: Turnaround */}
        <div className="p-3.5 rounded-2xl bg-[#15231B] border border-[#274535]">
          <span className="text-[10px] font-bold text-[#86A390] uppercase block">HARD CURFEW</span>
          <strong className="text-xl font-black text-amber-400 block mt-0.5">
            {currentTrail?.turnaroundTime || "2:30 PM"}
          </strong>
          <span className="text-[10px] text-stone-400 font-mono">Sunset 5:45 PM</span>
        </div>
      </div>

      {/* 3. CENTER: HANDS-FREE VOICE ASSISTANT */}
      <div className="p-5 rounded-2xl bg-[#15231B] border border-[#274535] space-y-4 my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-[#FBF8EF] uppercase tracking-wider">
              VOICE COPILOT (HANDS-FREE TRAIL ADVISOR)
            </span>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-[#1D3628] px-2 py-0.5 rounded">
            Local AI Engine Active
          </span>
        </div>

        {/* Big Touch-to-Speak Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={toggleSpeechRecognition}
            className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition shadow-lg ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-[#0E1712]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListening ? "Listening to Trail Query..." : "Tap to Ask Voice Copilot"}</span>
          </button>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleAskFieldVoice("Should I continue to the next checkpoint?")}
              className="px-3 py-2 rounded-xl bg-[#1E3025] hover:bg-[#284333] text-stone-200 transition text-[11px]"
            >
              "Should I continue?"
            </button>
            <button
              onClick={() => handleAskFieldVoice("How much water should I carry?")}
              className="px-3 py-2 rounded-xl bg-[#1E3025] hover:bg-[#284333] text-stone-200 transition text-[11px]"
            >
              "How much water?"
            </button>
            <button
              onClick={() => handleAskFieldVoice("What should I do if visibility drops?")}
              className="px-3 py-2 rounded-xl bg-[#1E3025] hover:bg-[#284333] text-stone-200 transition text-[11px]"
            >
              "Visibility drops?"
            </button>
          </div>
        </div>

        {/* AI Answer Stream */}
        {(transcript || aiAnswer || isProcessing) && (
          <div className="p-4 rounded-xl bg-[#0E1712] border border-[#274535] space-y-2 text-xs leading-relaxed">
            {transcript && (
              <div className="text-[#86A390]">
                <strong>You Asked:</strong> "{transcript}"
              </div>
            )}
            {isProcessing ? (
              <div className="text-emerald-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Local AI reasoning through mountain context & safety rules...</span>
              </div>
            ) : aiAnswer ? (
              <div className="text-[#E2EFE5] whitespace-pre-line">
                {aiAnswer}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION ROW: NEXT CHECKPOINT & EMERGENCY SOS */}
      <div className="pt-4 border-t border-[#274535] flex flex-wrap items-center justify-between gap-3">
        {nextCp ? (
          <button
            onClick={handleNextCheckpoint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D3628] hover:bg-[#284a37] text-emerald-300 font-bold text-xs border border-emerald-600/40 transition"
          >
            <span>Advance to Checkpoint {activeStep + 2}: {nextCp.name} ({nextCp.elevation})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs font-bold text-emerald-400">
            ✓ Final Summit Crest Reached. Begin Descent Before Curfew.
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTrailChime('warning');
              speakTrailWhisper("Emergency SOS beacon activated. Hold your position and prepare emergency foil shelter.");
            }}
            className="px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-900 transition"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
