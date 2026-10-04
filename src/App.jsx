import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBanner from './components/HeaderBanner';
import BottomCards from './components/BottomCards';
import PackingManifestCard from './components/PackingManifestCard';
import ComparisonModal from './components/ComparisonModal';
import MemoryVaultModal from './components/MemoryVaultModal';
import GemmaInspectorModal from './components/GemmaInspectorModal';
import RoomSceneViewer from './components/3d/RoomSceneViewer';
import RoomReconstructionStudio from './components/RoomReconstructionStudio';
import SponsorPrizeHubModal from './components/SponsorPrizeHubModal';

// Dedicated Full-Page Views
import MemoryVaultView from './views/MemoryVaultView';
import CompareTripsView from './views/CompareTripsView';
import AudioCoachView from './views/AudioCoachView';
import GemmaCoreView from './views/GemmaCoreView';
import MyChecklistsView from './views/MyChecklistsView';
import NewTripView from './views/NewTripView';
import SettingsView from './views/SettingsView';

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

import { Sparkles, Menu, X } from 'lucide-react';

export default function App() {
  const friendName = "Kanwal";
  const [activeNav, setActiveNav] = useState("Home");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scenarios & Context Parameters
  const [scenarios, setScenarios] = useState(PRESET_SCENARIOS);
  const [currentScenario, setCurrentScenario] = useState(PRESET_SCENARIOS[0]);
  const [tripType, setTripType] = useState("College Presentation");
  const [duration, setDuration] = useState("2-3 Days (Weekend)");
  const [weather, setWeather] = useState("Rain Forecast (18°C)");
  const [mode, setMode] = useState("departure");

  // Memory & Checklist State
  const [memoryList, setMemoryList] = useState(loadMemory);
  const [checklistData, setChecklistData] = useState(null);
  const [items, setItems] = useState([]);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 3D Room Twin State
  const [roomPhotoUrl, setRoomPhotoUrl] = useState("/assets/kanwal-room-original.jpg");
  const [roomTitle, setRoomTitle] = useState("Kanwal's Reconstructed Hostel Room (Block C-402)");
  const [spaceViewTab, setSpaceViewTab] = useState("3d");

  // Audio / Voice State
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    ollamaUrl: "",
    elevenLabsKey: ""
  });

  // Modals Visibility
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAiInspectorOpen, setIsAiInspectorOpen] = useState(false);
  const [isPrizeHubOpen, setIsPrizeHubOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run AI Synthesis
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
      showToast("Checklist synthesized for " + tripType + " ✨");
    } catch (err) {
      console.error("Failed to generate checklist:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [currentScenario, tripType, duration, weather, memoryList, mode, customSettings]);

  useEffect(() => {
    runSynthesis();
  }, [currentScenario.id, tripType, duration, weather, mode]);

  // Voice exit briefing
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

  const handleCustomImageUpload = (imgSrc, filename) => {
    setRoomPhotoUrl(imgSrc);
    setRoomTitle(`Reconstructed Room (${filename})`);
    setSpaceViewTab("3d");
    showToast("Custom room photo uploaded! Reconstructed 3D twin with PaliGemma ✨");
  };

  const handleSelectScenarioAndTrip = (scenarioId, selectedTrip) => {
    const target = scenarios.find(s => s.id === scenarioId) || scenarios[0];
    setCurrentScenario(target);
    setTripType(selectedTrip);
    setActiveNav("Home");
  };

  const handleStartNewTrip = (tripConfig) => {
    setTripType(tripConfig.purpose);
    setDuration(tripConfig.duration);
    setWeather(tripConfig.weather);
    setMode(tripConfig.mode || "departure");
    setActiveNav("Home");
    showToast(`Started packing for ${tripConfig.name}!`);
  };

  const handleDeleteMemoryRecord = (id) => {
    const updated = memoryList.filter(m => m.id !== id);
    setMemoryList(updated);
    saveMemory(updated);
    showToast("Incident record deleted.");
  };

  const handleResetAllData = () => {
    const reset = resetMemoryToDefault();
    setMemoryList(reset);
    showToast("Reset all memory data to defaults.");
  };

  return (
    <div className="min-h-screen bg-transparent text-[#241746] flex flex-col md:flex-row font-sans selection:bg-purple-500 selection:text-white relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1e1b4b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-purple-800">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Mobile Top Header (with hamburger button) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-[#ece7de] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg text-[#1e1b4b]">CheckMate</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar & Mobile Drawer */}
      <div className={`
        ${isMobileSidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden md:flex shrink-0'}
      `}>
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <div className="relative z-50 p-3 sm:p-4 md:pr-0 sticky top-0 h-screen flex flex-col justify-start">
          <Sidebar
            activeNav={activeNav}
            onSelectNav={(nav) => {
              setActiveNav(nav);
              setIsMobileSidebarOpen(false);
            }}
            onOpenMemory={() => setIsMemoryOpen(true)}
            onOpenComparison={() => setIsComparisonOpen(true)}
            onOpenAiInspector={() => setIsAiInspectorOpen(true)}
            onOpenPrizeHub={() => setIsPrizeHubOpen(true)}
            onTriggerVoice={handleTriggerVoice}
            memoryCount={memoryList.length}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6 overflow-y-auto max-w-[1380px] mx-auto w-full">
        
        {/* Top Hackathon Prize Hub Banner Button */}
        <div className="flex items-center justify-between pb-3 select-none">
          <button
            onClick={() => setIsPrizeHubOpen(true)}
            className="faded-glass-pill px-3.5 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-xs border border-white/80 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-[#1e1b4b]">
              🏆 Hackathon Prize Suite: <span className="text-[#7054E8]">16 Sponsor Categories Activated</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              $2,200 Potential
            </span>
            <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform font-bold">
              Inspect Telemetry →
            </span>
          </button>
        </div>
        
        {/* Render View based on activeNav */}
        {activeNav === "Home" && (
          <div className="space-y-4">
            <HeaderBanner
              tripType={tripType}
              setTripType={setTripType}
              duration={duration}
              setDuration={setDuration}
              weather={weather}
              setWeather={setWeather}
              mode={mode}
              setMode={setMode}
              onGenerate={runSynthesis}
              isGenerating={isGenerating}
              onTriggerVoice={handleTriggerVoice}
              isVoicePlaying={isVoicePlaying}
              userName={friendName}
            />

            {/* 2-Column Balanced Hero Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Left Column: 3D Room Twin (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <RoomSceneViewer
                  highlightedItemId={highlightedItemId}
                  onSelectItem={(item) => {
                    setHighlightedItemId(item.id);
                    showToast(`Selected "${item.name}" in 3D room.`);
                  }}
                  onHoverItem={setHighlightedItemId}
                  onReconstructRoom={() => setActiveNav("NewRoom")}
                  photoUrl={roomPhotoUrl}
                  roomTitle={roomTitle}
                />
              </div>

              {/* Right Column: Your Packing Manifest (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <PackingManifestCard
                  items={items}
                  onToggleItem={(id) => {
                    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
                  }}
                  onMarkAllPacked={() => {
                    setItems(prev => prev.map(i => ({ ...i, checked: true })));
                    showToast("All items marked as packed! Have a great trip, Kanwal! 🎒");
                  }}
                  onTriggerVoice={handleTriggerVoice}
                  isVoicePlaying={isVoicePlaying}
                  onOpenComparison={() => setIsComparisonOpen(true)}
                  onOpenAiInspector={() => setIsAiInspectorOpen(true)}
                  highlightedItemId={highlightedItemId}
                  onHoverItem={setHighlightedItemId}
                />
              </div>
            </div>

            {/* Full-Width Trip Stats & Scenarios Section */}
            <BottomCards
              tripType={tripType}
              duration={duration}
              weather={weather}
              mode={mode}
              onOpenComparison={() => setIsComparisonOpen(true)}
              onOpenMemory={() => setIsMemoryOpen(true)}
              onOpenAiInspector={() => setIsAiInspectorOpen(true)}
            />

            {/* Bottom Cute Doodle Banner Requested by User */}
            <div className="w-full pt-1 pb-3 flex justify-center select-none">
              <div className="max-w-[760px] w-full px-2">
                <img
                  src="/assets/footer_banner.png"
                  alt="Small checklist. Big peace of mind. Pack Explore Learn Repeat ♡"
                  className="w-full h-auto block drop-shadow-sm transition-transform duration-200 hover:scale-[1.01]"
                />
              </div>
            </div>

          </div>
        )}

        {activeNav === "NewRoom" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveNav("Home")}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-[#ede7dd] cursor-pointer"
              >
                ← Back to 3D Room
              </button>
              <span className="text-xs font-bold text-[#7054E8] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                PaliGemma Vision 3D Reconstruction Pipeline
              </span>
            </div>
            <RoomReconstructionStudio
              onReconstructionComplete={(url, filename) => {
                setRoomPhotoUrl(url);
                setRoomTitle(`Reconstructed Room (${filename})`);
                setActiveNav("Home");
                setSpaceViewTab("3d");
                showToast("3D Digital Twin successfully generated! ✨");
              }}
              onExploreDemo={() => {
                setActiveNav("Home");
                setSpaceViewTab("3d");
              }}
            />
          </div>
        )}

        {activeNav === "NewTrip" && (
          <NewTripView onStartTrip={handleStartNewTrip} />
        )}

        {activeNav === "MyChecklists" && (
          <MyChecklistsView
            onSelectTrip={(trip) => {
              setTripType(trip.title);
              setActiveNav("Home");
            }}
            onNewTrip={() => setActiveNav("NewTrip")}
          />
        )}

        {activeNav === "MemoryVault" && (
          <MemoryVaultView
            memoryList={memoryList}
            onAddIncident={(name, ctx, note, rule) => {
              const updated = recordForgottenItem(memoryList, name, ctx, note, rule);
              setMemoryList(updated);
              showToast(`Recorded incident for "${name}"!`);
            }}
            onDeleteRecord={handleDeleteMemoryRecord}
            onResetMemory={handleResetAllData}
            friendName={friendName}
          />
        )}

        {activeNav === "CompareTrips" && (
          <CompareTripsView
            onSelectScenarioAndTrip={handleSelectScenarioAndTrip}
          />
        )}

        {activeNav === "AudioCoach" && (
          <AudioCoachView
            tripType={tripType}
            items={items}
            memoryList={memoryList}
            friendName={friendName}
          />
        )}

        {activeNav === "GemmaCore" && (
          <GemmaCoreView />
        )}

        {activeNav === "Settings" && (
          <SettingsView
            onResetAllData={handleResetAllData}
            showToast={showToast}
          />
        )}

      </div>

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
        onAddIncident={(name, ctx, note) => {
          const updated = recordForgottenItem(memoryList, name, ctx, note);
          setMemoryList(updated);
          showToast(`CheckMate learned: "${name}" marked as high-risk alert!`);
        }}
        onResetMemory={handleResetAllData}
        friendName={friendName}
      />

      <GemmaInspectorModal
        isOpen={isAiInspectorOpen}
        onClose={() => setIsAiInspectorOpen(false)}
        rawPrompt={checklistData?.rawPrompt}
        modelUsed={checklistData?.modelUsed}
        onSaveCustomSettings={(settings) => {
          setCustomSettings(settings);
          showToast("Custom settings saved successfully!");
        }}
      />

      {/* Hackathon Sponsor Prize Suite Modal */}
      <SponsorPrizeHubModal
        isOpen={isPrizeHubOpen}
        onClose={() => setIsPrizeHubOpen(false)}
      />

    </div>
  );
}
