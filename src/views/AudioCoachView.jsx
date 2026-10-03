import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  ShieldAlert, 
  Radio,
  FileText
} from 'lucide-react';
import { globalVoiceCoach, generateVoiceBriefingText } from '../services/voiceCoach';

export default function AudioCoachView({
  tripType,
  items,
  memoryList,
  friendName = "Alex"
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.05);
  const [pitch, setPitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [briefingText, setBriefingText] = useState("");

  const criticalItems = items.filter(i => i.priority === "critical" && !i.checked);
  const warningItems = items.filter(i => i.priority === "high" && !i.checked);

  // Generate dynamic text based on current trip & memory
  useEffect(() => {
    const text = generateVoiceBriefingText({
      friendName,
      tripType,
      criticalItems,
      warningItems
    });
    setBriefingText(text);
  }, [tripType, items, memoryList, friendName]);

  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const enVoices = voices.filter(v => v.lang.startsWith("en"));
        setAvailableVoices(enVoices.length ? enVoices : voices);
        if (enVoices.length && !selectedVoice) {
          const natural = enVoices.find(v => v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"));
          setSelectedVoice(natural ? natural.name : enVoices[0].name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      globalVoiceCoach.stop();
      setIsPlaying(false);
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(briefingText);
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (selectedVoice) {
        const v = availableVoices.find(voice => voice.name === selectedVoice);
        if (v) utterance.voice = v;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    globalVoiceCoach.stop();
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ede7dd] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
              Audio Exit Coach & Briefing
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Spoken departure briefings synthesized directly from your active trip context and forgotten-item history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-[#7054E8] hover:bg-[#5b3ee0] text-white shadow-purple-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? "Pause Briefing" : "Play Briefing"}</span>
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              title="Stop playback"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Script Preview & High Risk Warnings (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Spoken Text Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede7dd] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0eae0]">
              <div className="flex items-center gap-2 text-[#1e1b4b]">
                <FileText className="w-4 h-4 text-[#7054E8]" />
                <h3 className="font-black text-sm">Synthesized Spoken Script</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7054E8]">
                Trip: {tripType}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eee8dd] text-xs font-medium text-slate-700 leading-relaxed italic">
              "{briefingText}"
            </div>

            {isPlaying && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Audio Coach is speaking to Alex right now...</span>
              </div>
            )}
          </div>

          {/* High-Risk Verbal Focus */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede7dd] shadow-sm space-y-3">
            <h4 className="font-black text-xs text-[#1e1b4b] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Items Given Verbal Prominence:</span>
            </h4>

            {criticalItems.length > 0 ? (
              <div className="space-y-2">
                {criticalItems.map(item => (
                  <div key={item.id} className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
                    <span className="font-extrabold text-rose-900 block">{item.name}</span>
                    <span className="text-[11px] text-rose-700">{item.spatialTip || item.alertReason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                All critical memory items have been packed! The briefing focuses on general safe departure.
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Audio & Voice Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#ede7dd] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] pb-2 border-b border-[#f0eae0]">
              <Sliders className="w-4 h-4 text-[#7054E8]" />
              <h3 className="font-black text-sm">Voice Synthesis Settings</h3>
            </div>

            {/* Voice Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Speech Synthesis Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eee8dd] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7054E8]"
              >
                {availableVoices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Rate Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-600">Speaking Speed</span>
                <span className="text-[#7054E8] font-mono">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-[#7054E8] cursor-pointer"
              />
            </div>

            {/* Pitch Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-600">Voice Pitch</span>
                <span className="text-[#7054E8] font-mono">{pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[#7054E8] cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-[#f0eae0] text-[11px] text-slate-500 leading-relaxed">
              💡 <strong>Offline Capable:</strong> CheckMate utilizes your browser's native SpeechSynthesis engine. Zero voice audio is sent across the cloud, preserving full audio privacy.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
