import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroTrailCard from './components/HeroTrailCard';
import PocketModeSidebar from './components/PocketModeSidebar';
import BioacousticClassifierCard from './components/BioacousticClassifierCard';
import MicroclimatePredictorCard from './components/MicroclimatePredictorCard';
import AIGuardianCard from './components/AIGuardianCard';
import SensorsCard from './components/SensorsCard';
import JournalCard from './components/JournalCard';
import TrailEcosystemsCard from './components/TrailEcosystemsCard';
import PocketModeModal from './components/PocketModeModal';
import PromptInspectorModal from './components/PromptInspectorModal';
import SponsorCategoryHub from './components/SponsorCategoryHub';

// Dedicated Views
import BirdsView from './views/BirdsView';
import WeatherView from './views/WeatherView';
import AIGuideView from './views/AIGuideView';
import SensorsView from './views/SensorsView';
import JournalView from './views/JournalView';
import TrailsView from './views/TrailsView';
import Map3DView from './views/Map3DView';
import FieldModeView from './views/FieldModeView';
import DiagnosticsView from './views/DiagnosticsView';

import { TRAILS_DATA } from './data/trailData';
import { speakTrailWhisper, playTrailChime } from './services/voiceGuide';

export default function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/diagnostics' || h === '#diagnostics' || h === '#/diagnostics') {
        return 'diagnostics';
      }
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [currentTrail, setCurrentTrail] = useState(TRAILS_DATA[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // Sync /diagnostics route with browser URL history
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/diagnostics' || h === '#diagnostics' || h === '#/diagnostics') {
        setActiveTab('diagnostics');
      } else if (activeTab === 'diagnostics') {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'diagnostics') {
        if (window.location.pathname !== '/diagnostics') {
          window.history.pushState(null, '', '/diagnostics');
        }
      } else {
        if (window.location.pathname === '/diagnostics') {
          window.history.pushState(null, '', '/');
        }
      }
    }
  };

  // Modals
  const [isPocketModalOpen, setIsPocketModalOpen] = useState(false);
  const [isPromptInspectorOpen, setIsPromptInspectorOpen] = useState(false);
  const [isPrizeHubOpen, setIsPrizeHubOpen] = useState(false);

  // Journal Entries
  const [journalEntries, setJournalEntries] = useState([]);

  // Toggle between Daylight Mode and Nocturnal Alpine Night Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectTrailById = (id) => {
    const tr = TRAILS_DATA.find(t => t.id === id);
    if (tr) setCurrentTrail(tr);
  };

  const handleAddToJournal = (entry) => {
    setJournalEntries(prev => [entry, ...prev]);
  };

  const handleTriggerQuickAction = (actionType) => {
    if (actionType === 'briefing') {
      speakTrailWhisper(`Trail briefing for ${currentTrail.name}. ${currentTrail.distance} alpine climb. ${currentTrail.elevationGain} elevation climb. Hard turnaround time is ${currentTrail.microclimateTabPFN?.safeTurnaroundTime || '3:30 PM'}. Screen locked. Listening to the Himalayan canopy.`);
    } else if (actionType === 'waypoint') {
      playTrailChime('nature');
      handleAddToJournal({
        id: `waypoint-${Date.now()}`,
        name: "Trail Waypoint Marked",
        scientific: "Custom Geofence Marker",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        frequency: "GPS Fix",
        confidence: 1.0,
        trail: currentTrail.name
      });
      alert("Waypoint marked and logged to your offline journal!");
    } else if (actionType === 'bird') {
      setActiveTab('birds');
    } else if (actionType === 'ai') {
      setActiveTab('ai-guide');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#DCEBDA] selection:text-[#285943] w-full max-w-full overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        audioMuted={audioMuted}
        onToggleAudioMute={() => setAudioMuted(!audioMuted)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenPrizeHub={() => setIsPrizeHubOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-4 overflow-x-hidden">
        
        {/* TAB 1: HOME DASHBOARD (Matches user reference image pixel-for-pixel!) */}
        {activeTab === 'home' && (
          <div className="flex flex-col lg:flex-row gap-5">
            
            {/* LEFT COLUMN: Pocket Mode, Screen vs Outdoor Time, Quick Actions */}
            <PocketModeSidebar
              onTriggerQuickAction={handleTriggerQuickAction}
              onOpenPocketModeModal={() => setIsPocketModalOpen(true)}
              audioMuted={audioMuted}
            />

            {/* RIGHT COLUMN: Hero Trail Map, 3 Main Cards, Bottom 3 Cards */}
            <div className="flex-1 flex flex-col gap-5 min-w-0">
              
              {/* 1. Large Scenic Hero Trail Map */}
              <HeroTrailCard
                currentTrail={currentTrail}
                audioMuted={audioMuted}
                onOpen3DMap={() => setActiveTab('3d-map')}
                onSelectTrail={handleSelectTrailById}
              />

              {/* 2. Middle Row of 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <BioacousticClassifierCard
                  onAddToJournal={handleAddToJournal}
                  audioMuted={audioMuted}
                  onOpenDetails={() => setActiveTab('birds')}
                />

                <MicroclimatePredictorCard
                  onOpenFullMatrix={() => setActiveTab('weather')}
                />

                <AIGuardianCard
                  currentTrail={currentTrail}
                  onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
                  audioMuted={audioMuted}
                />
              </div>

              {/* 3. Bottom Row of 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SensorsCard
                  onOpenSensorPanel={() => setActiveTab('sensors')}
                />

                <JournalCard
                  onOpenJournal={() => setActiveTab('journal')}
                />

                <TrailEcosystemsCard
                  currentTrail={currentTrail}
                  onSelectTrail={handleSelectTrailById}
                  onOpenTrailsView={() => setActiveTab('trails')}
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 1.5: FIELD MODE (Dedicated Hands-Free Outdoor Voice View) */}
        {activeTab === 'field-mode' && (
          <FieldModeView
            currentTrail={currentTrail}
            audioMuted={audioMuted}
            onExit={() => setActiveTab('home')}
          />
        )}

        {/* TAB 2: BIRDS (Offline Bioacoustics Vault) */}
        {activeTab === 'birds' && (
          <BirdsView
            onAddToJournal={handleAddToJournal}
            audioMuted={audioMuted}
          />
        )}

        {/* TAB 3: WEATHER (Prior Labs TabPFN Lab) */}
        {activeTab === 'weather' && (
          <WeatherView />
        )}

        {/* TAB 4: AI GUIDE (Google Gemma 2 Backcountry Guardian) */}
        {activeTab === 'ai-guide' && (
          <AIGuideView
            currentTrail={currentTrail}
            onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
            audioMuted={audioMuted}
          />
        )}

        {/* TAB 5: 3D MAP (Three.js 3D Ridge Explorer) */}
        {activeTab === '3d-map' && (
          <Map3DView
            currentTrail={currentTrail}
            audioMuted={audioMuted}
            onSelectTrail={handleSelectTrailById}
          />
        )}

        {/* TAB 6: SENSORS (Arduino UNO Q Hardware Bridge) */}
        {activeTab === 'sensors' && (
          <SensorsView />
        )}

        {/* TAB 7: JOURNAL (Field Journal & Bio-Vault) */}
        {activeTab === 'journal' && (
          <JournalView
            journalEntries={journalEntries}
          />
        )}

        {/* TAB 8: TRAILS (Ecosystem Explorer) */}
        {activeTab === 'trails' && (
          <TrailsView
            currentTrail={currentTrail}
            onSelectTrail={(id) => {
              handleSelectTrailById(id);
              handleNavigateTab('home');
            }}
          />
        )}

        {/* TAB 9: DEVELOPER DIAGNOSTICS (/diagnostics Route) */}
        {activeTab === 'diagnostics' && (
          <DiagnosticsView
            currentTrail={currentTrail}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE7DF] bg-[#F2F8F4] py-4 text-xs text-[#6F7B72] shadow-sm relative z-30">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-[#20332A]">Touch Grass</span>
            <span className="text-[#6F7B72]">•</span>
            <span className="text-[#6F7B72] font-semibold">AI for a Wilder You</span>
            <span className="text-[#6F7B72]">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#DCEBDA] text-[#285943] font-extrabold text-[11px] border border-[#A8C5A0]">
              100% Offline AI
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <button 
              onClick={() => handleNavigateTab('diagnostics')} 
              className="text-[#285943] hover:text-[#1A2E22] font-mono text-[11px] font-bold px-2 py-1 rounded bg-[#E2EFE5] border border-[#C8DEC8] hover:bg-white transition flex items-center gap-1 shadow-xs"
            >
              <span>🛠️ /diagnostics (Demo & Judge Mode)</span>
            </button>
            <button 
              onClick={() => setIsPocketModalOpen(true)} 
              className="text-[#20332A] hover:text-[#285943] transition underline-offset-4 hover:underline"
            >
              Pocket Mode
            </button>
            <button 
              onClick={() => setIsPrizeHubOpen(true)} 
              className="text-[#20332A] hover:text-[#E7A94B] transition underline-offset-4 hover:underline"
            >
              Hacktoberfest Prize Hub (8 Categories)
            </button>
            <button 
              onClick={() => setIsPromptInspectorOpen(true)} 
              className="text-[#20332A] hover:text-[#8B6474] transition underline-offset-4 hover:underline"
            >
              Gemma 2 Tokens
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PocketModeModal
        isOpen={isPocketModalOpen}
        onClose={() => setIsPocketModalOpen(false)}
        currentTrail={currentTrail}
        audioMuted={audioMuted}
      />

      <PromptInspectorModal
        isOpen={isPromptInspectorOpen}
        onClose={() => setIsPromptInspectorOpen(false)}
        currentTrail={currentTrail}
      />

      <SponsorCategoryHub
        isOpen={isPrizeHubOpen}
        onClose={() => setIsPrizeHubOpen(false)}
      />
    </div>
  );
}
