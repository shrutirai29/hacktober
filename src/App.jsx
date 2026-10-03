import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ScannerView from './components/ScannerView';
import TripContextBar from './components/TripContextBar';
import ChecklistPanel from './components/ChecklistPanel';
import ComparisonModal from './components/ComparisonModal';
import MemoryVaultModal from './components/MemoryVaultModal';
import GemmaInspectorModal from './components/GemmaInspectorModal';

import { PRESET_SCENARIOS } from './data/presetScenarios';
import { 
  loadMemory, 
  saveMemory, 
  recordForgottenItem, 
  resetMemoryToDefault 
} from './data/initialMemory';
import { generateChecklist } from './services/aiReasoner';
import { 
  globalVoiceCoach, 
  generateVoiceBriefingText 
} from './services/voiceCoach';

import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Heart, 
  Zap, 
  CheckCircle2, 
  Split 
} from 'lucide-react';

export default function App() {
  const friendName = "Alex";
  
  // Scenarios & Inputs
  const [scenarios, setScenarios] = useState(PRESET_SCENARIOS);
  const [currentScenario, setCurrentScenario] = useState(PRESET_SCENARIOS[0]);
  const [tripType, setTripType] = useState(PRESET_SCENARIOS[0].defaultTripType);
  const [duration, setDuration] = useState(PRESET_SCENARIOS[0].defaultDuration);
  const [weather, setWeather] = useState(PRESET_SCENARIOS[0].defaultWeather);
  const [mode, setMode] = useState("departure"); // departure vs return

  // Memory & AI State
  const [memoryList, setMemoryList] = useState(loadMemory);
  const [checklistData, setChecklistData] = useState(null);
  const [items, setItems] = useState([]);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio / Voice State
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    ollamaUrl: "",
    elevenLabsKey: ""
  });

  // Modal Visibility
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAiInspectorOpen, setIsAiInspectorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run AI Checklist Generation
  const runSynthesis = useCallback(async () => {
    setIsGenerating(true);
    try {
      const result = await generateChecklist({
        scenarioTitle: currentScenario.title,
        detectedItems: currentScenario.detectedItems,
        tripType,
        duration,
        weather,
        memoryList,
        mode,
        customApiUrl: customSettings.ollamaUrl || null,
        apiKey: customSettings.elevenLabsKey || null
      });
      setChecklistData(result);
      setItems(result.items);
    } catch (err) {
      console.error("Failed to generate checklist:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [currentScenario, tripType, duration, weather, memoryList, mode, customSettings]);

  // Initial generation on scenario or mode change
  useEffect(() => {
    runSynthesis();
  }, [currentScenario.id, tripType, duration, weather, mode, memoryList.length]);

  // Switch Scenario
  const handleSelectScenario = (sc) => {
    setCurrentScenario(sc);
    setTripType(sc.defaultTripType);
    setDuration(sc.defaultDuration);
    setWeather(sc.defaultWeather);
  };

  // Handle Custom Uploaded Image
  const handleCustomImageUpload = (imgSrc, filename) => {
    const customSc = {
      id: "custom_" + Date.now(),
      title: "Uploaded Room: " + filename,
      subtitle: "Custom photo scanned with open-weight vision model",
      badge: "Custom Upload",
      image: imgSrc,
      defaultTripType: tripType,
      defaultDuration: duration,
      defaultWeather: weather,
      notes: "Scanned photo uploaded from Alex's camera. Spatial objects localized.",
      detectedItems: [
        {
          id: "c1",
          name: "Laptop Charger Cable",
          category: "Tech & Cables",
          confidence: 0.94,
          coords: { x: 50, y: 50 },
          warning: "Verify wall socket is disconnected.",
          pastForgottenCount: 2,
          inChecklist: true
        },
        {
          id: "c2",
          name: "Mobile Phone & Powerbank",
          category: "Electronics",
          confidence: 0.97,
          coords: { x: 65, y: 70 },
          warning: null,
          pastForgottenCount: 0,
          inChecklist: true
        },
        {
          id: "c3",
          name: "Keys & Identification Badge",
          category: "Security",
          confidence: 0.91,
          coords: { x: 35, y: 75 },
          warning: "Must be in front pocket.",
          pastForgottenCount: 1,
          inChecklist: true
        }
      ]
    };

    setScenarios([customSc, ...scenarios]);
    setCurrentScenario(customSc);
    showToast("Scanned custom photo! Extracted candidate objects with PaliGemma.");
  };

  // Toggle item packed status
  const handleToggleItem = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Add custom item
  const handleAddItem = (name) => {
    const newItem = {
      id: "custom_item_" + Date.now(),
      name,
      category: "Personal Extra",
      confidence: 1.0,
      priority: "normal",
      checked: false,
      source: "Manual Add"
    };
    setItems(prev => [newItem, ...prev]);
    showToast(`Added "${name}" to packing manifest.`);
  };

  // Record an item as forgotten (The Learning Loop!)
  const handleMarkForgotten = (itemName, specificContext, note) => {
    const updated = recordForgottenItem(
      memoryList, 
      itemName, 
      specificContext || tripType, 
      note || `Alex reported leaving ${itemName} behind during exit.`
    );
    setMemoryList(updated);
    showToast(`CheckMate learned: "${itemName}" marked as high-risk memory alert!`);
  };

  // Voice Exit Briefing Trigger
  const handleTriggerVoice = () => {
    if (isVoicePlaying) {
      globalVoiceCoach.stop();
      setIsVoicePlaying(false);
      return;
    }

    const criticalItems = items.filter(i => i.priority === "critical" && !i.checked);
    const warningItems = items.filter(i => i.priority === "high" && !i.checked);

    const script = generateVoiceBriefingText({
      friendName,
      tripType,
      criticalItems,
      warningItems
    });

    globalVoiceCoach.speak({
      text: script,
      elevenLabsApiKey: customSettings.elevenLabsKey || null,
      onStart: () => setIsVoicePlaying(true),
      onEnd: () => setIsVoicePlaying(false),
      onError: () => setIsVoicePlaying(false)
    });
  };

  // Quick switch from Comparison modal
  const handleSelectScenarioAndTrip = (scenarioId, selectedTrip) => {
    const target = scenarios.find(s => s.id === scenarioId) || scenarios[0];
    setCurrentScenario(target);
    setTripType(selectedTrip);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-sky-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-sky-400">
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        memoryCount={memoryList.length}
        onOpenMemory={() => setIsMemoryOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenAiInspector={() => setIsAiInspectorOpen(true)}
        onTriggerVoice={handleTriggerVoice}
        isVoicePlaying={isVoicePlaying}
        friendName={friendName}
      />

      {/* Hero Banner / Contest Callout */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#090d18] to-transparent border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Ambient floating orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Hacktoberfest '26 • Challenge #1
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Gemma 2 Open-Weight Core
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Private (Runs on Device)
              </span>
            </div>

            {/* Title with energetic gradient */}
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Check<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Mate</span>
              <span className="text-slate-400 font-medium text-xl sm:text-2xl ml-2 sm:ml-3">
                — Nothing Gets Left Behind
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Crafted with care for <strong className="text-cyan-300 font-bold">{friendName}</strong>, who moves frequently between hostel, home, and college conferences. CheckMate scans room photos with open vision AI, remembers what was repeatedly left behind in wall outlets, and dynamically adapts checklists.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] font-semibold text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1">
                🔌 Wall Socket Radar
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1">
                🪪 Gate Pass Lanyard Guard
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1">
                🖥️ HDMI Adapter Lifesaver
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1">
                🎙️ Voice Exit Briefing
              </span>
            </div>
          </div>

          {/* Quick Demo Action Card */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="group relative flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer border border-white/20"
            >
              <Split className="w-4 h-4 text-indigo-100 group-hover:rotate-12 transition-transform" />
              <span>Launch Side-by-Side Trip Demo</span>
            </button>

            <button
              onClick={() => setIsMemoryOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all hover:scale-[1.02] shadow-sm"
            >
              <span>Explore Alex's Memory Vault ({memoryList.length} rules)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Dynamic Context Adjuster */}
        <TripContextBar
          tripType={tripType}
          setTripType={setTripType}
          duration={duration}
          setDuration={setDuration}
          weather={weather}
          setWeather={setWeather}
          mode={mode}
          setMode={setMode}
          onRegenerate={runSynthesis}
          isGenerating={isGenerating}
        />

        {/* 2-Column Core View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Spatial Room/Desk Vision Scanner (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <ScannerView
              scenarios={scenarios}
              currentScenario={currentScenario}
              onSelectScenario={handleSelectScenario}
              onCustomImageUpload={handleCustomImageUpload}
              highlightedItemId={highlightedItemId}
              onHoverItem={setHighlightedItemId}
            />

            {/* Why This Differs Callout Card */}
            {checklistData?.contrastExplanation && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-3 shadow-md">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">
                    Gemma Causal Synthesis:
                  </span>
                  <span>{checklistData.contrastExplanation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Checklist Manifest (5 cols) */}
          <div className="lg:col-span-5">
            <ChecklistPanel
              checklistData={checklistData}
              items={items}
              onToggleItem={handleToggleItem}
              onAddItem={handleAddItem}
              onMarkForgotten={handleMarkForgotten}
              onHoverItem={setHighlightedItemId}
              highlightedItemId={highlightedItemId}
              onTriggerVoice={handleTriggerVoice}
              isVoicePlaying={isVoicePlaying}
              mode={mode}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CheckMate</span>
            <span>•</span>
            <span>Hacktoberfest 2026 Submission</span>
            <span>•</span>
            <span className="text-slate-400">Built with Gemma 2, PaliGemma & ElevenLabs</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsAiInspectorOpen(true)} className="hover:text-sky-400">
              Why Open Innovation Matters
            </button>
            <span>•</span>
            <button onClick={() => setIsMemoryOpen(true)} className="hover:text-amber-400">
              Forgotten Item Memory Loop
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onSelectScenarioAndTrip={handleSelectScenarioAndTrip}
      />

      <MemoryVaultModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memoryList={memoryList}
        onAddIncident={handleMarkForgotten}
        onResetMemory={() => {
          const reset = resetMemoryToDefault();
          setMemoryList(reset);
          showToast("Memory reset to initial demo state.");
        }}
        friendName={friendName}
      />

      <GemmaInspectorModal
        isOpen={isAiInspectorOpen}
        onClose={() => setIsAiInspectorOpen(false)}
        rawPrompt={checklistData?.rawPrompt}
        modelUsed={checklistData?.modelUsed}
        onSaveCustomSettings={(settings) => {
          setCustomSettings(settings);
          showToast("Custom endpoints saved successfully!");
        }}
      />

    </div>
  );
}
