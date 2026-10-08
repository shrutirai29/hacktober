import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Play, 
  MapPin, 
  Bird, 
  Mic, 
  ChevronRight, 
  Smartphone, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function PocketModeSidebar({ 
  onTriggerQuickAction, 
  onOpenPocketModeModal,
  audioMuted 
}) {
  const [pocketActive, setPocketActive] = useState(true);
  const [screenSeconds, setScreenSeconds] = useState(42);
  const [outdoorMinutes, setOutdoorMinutes] = useState(105); // 1h 45m

  useEffect(() => {
    // Subtle outdoor time increment
    const interval = setInterval(() => {
      setOutdoorMinutes(m => m + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePocket = () => {
    const nextState = !pocketActive;
    setPocketActive(nextState);
    if (nextState) {
      playTrailChime('nature');
      if (!audioMuted) {
        speakTrailWhisper("Pocket mode engaged. Keep your phone in your pocket, look up, and listen to the forest.");
      }
    }
  };

  const outdoorHours = Math.floor(outdoorMinutes / 60);
  const outdoorMinsRemaining = outdoorMinutes % 60;
  const ratioMultiple = Math.round((outdoorMinutes * 60) / Math.max(1, screenSeconds));

  return (
    <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 select-none shrink-0">
      
      {/* CARD 1: POCKET MODE & SCREEN VS OUTDOOR TIME */}
      <div className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#C8DEC8]">
        
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
              <Leaf className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-sm font-extrabold text-[#20332A]">
              Pocket Mode
            </h3>
          </div>

          {/* iOS-style toggle */}
          <button
            onClick={handleTogglePocket}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              pocketActive ? 'bg-[#3F7D5A]' : 'bg-[#DCE7DF]'
            }`}
          >
            <div
              className={`bg-[#F2F8F4] w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                pocketActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <p className="text-[11px] text-[#6F7B72] mb-4">
          Keep your phone in your pocket. We'll guide you.
        </p>

        {/* Animated Nature Listening Circle */}
        <div 
          onClick={onOpenPocketModeModal}
          className="relative py-4 flex flex-col items-center justify-center cursor-pointer group"
          title="Click to launch full-screen OLED Pocket Mode"
        >
          {/* Sound wave bars left and right */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-0.5 h-6">
            <span className="w-0.5 bg-[#3F7D5A] rounded-full animate-wave-1"></span>
            <span className="w-0.5 bg-[#3F7D5A] rounded-full animate-wave-2"></span>
            <span className="w-0.5 bg-[#3F7D5A] rounded-full animate-wave-3"></span>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-0.5 h-6">
            <span className="w-0.5 bg-[#3F7D5A] rounded-full animate-wave-3"></span>
            <span className="w-0.5 bg-[#3F7D5A] rounded-full animate-wave-2"></span>
            <span className="w-0.5 bg-[#3F7D5A] rounded-full animate-wave-1"></span>
          </div>

          {/* Pulsing Concentric Circles */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {pocketActive && (
              <>
                <div className="absolute inset-0 rounded-full bg-[#DCEBDA]/60 animate-nature-pulse"></div>
                <div className="absolute inset-2 rounded-full border border-[#3F7D5A]/30 animate-ping" style={{ animationDuration: '3s' }}></div>
              </>
            )}
            
            <div className="w-14 h-14 rounded-full bg-[#DCEBDA] border-2 border-[#3F7D5A] flex items-center justify-center shadow-md transition group-hover:scale-105">
              <Leaf className="w-6 h-6 text-[#285943] fill-current" />
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[#3F7D5A] mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5A] animate-pulse"></span>
            Listening to the world...
          </span>
        </div>

        {/* Divider */}
        <hr className="my-4 border-[#C8DEC8]" />

        {/* Screen vs. Outdoor Time */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#20332A] mb-2">
            <span>Screen vs. Outdoor Time</span>
            <span className="text-[10px] text-[#6F7B72] cursor-pointer">v</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D97855]/15 flex items-center justify-center text-[#D97855]">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#20332A] font-mono block">
                  {screenSeconds}s
                </span>
                <span className="text-[10px] text-[#6F7B72]">Screen time</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#DCEBDA] flex items-center justify-center text-[#3F7D5A]">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#285943] font-mono block">
                  {outdoorHours}h {outdoorMinsRemaining}m
                </span>
                <span className="text-[10px] text-[#6F7B72]">Outdoor time</span>
              </div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#DCE7DF] overflow-hidden flex mb-2.5">
            <div className="w-[3%] bg-[#D97855]" title="Screen Time: 42s"></div>
            <div className="w-[97%] bg-[#3F7D5A] rounded-r-full" title="Outdoor Time: 1h 45m"></div>
          </div>

          {/* Ratio Badge */}
          <div className="p-2 rounded-xl bg-[#DCEBDA] border border-[#A8C5A0] text-center">
            <span className="text-xs font-extrabold text-[#285943]">
              {ratioMultiple}× longer outside! 🌿
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: QUICK ACTIONS */}
      <div className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#C8DEC8]">
        <h3 className="text-xs font-bold text-[#20332A] uppercase tracking-wider mb-3">
          Quick Actions
        </h3>

        <div className="space-y-2">
          {/* Play Trail Briefing */}
          <button
            onClick={() => onTriggerQuickAction('briefing')}
            className="w-full p-2.5 rounded-xl border border-[#C8DEC8] hover:border-[#3F7D5A] hover:bg-[#EBF5EE] flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#D97855]/15 flex items-center justify-center text-[#D97855]">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-[#20332A]">
                Play Trail Briefing
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F7B72] group-hover:translate-x-0.5 transition" />
          </button>

          {/* Mark Waypoint */}
          <button
            onClick={() => onTriggerQuickAction('waypoint')}
            className="w-full p-2.5 rounded-xl border border-[#C8DEC8] hover:border-[#3F7D5A] hover:bg-[#EBF5EE] flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#8B6474]/15 flex items-center justify-center text-[#8B6474]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#20332A]">
                Mark Waypoint
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F7B72] group-hover:translate-x-0.5 transition" />
          </button>

          {/* Identify Bird Call */}
          <button
            onClick={() => onTriggerQuickAction('bird')}
            className="w-full p-2.5 rounded-xl border border-[#C8DEC8] hover:border-[#3F7D5A] hover:bg-[#EBF5EE] flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
                <Bird className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#20332A]">
                Identify Bird Call
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F7B72] group-hover:translate-x-0.5 transition" />
          </button>

          {/* Ask AI (Voice) */}
          <button
            onClick={() => onTriggerQuickAction('ai')}
            className="w-full p-2.5 rounded-xl border border-[#C8DEC8] hover:border-[#3F7D5A] hover:bg-[#EBF5EE] flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#E7A94B]/20 flex items-center justify-center text-[#E7A94B]">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#20332A]">
                Ask AI (Voice)
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F7B72] group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* INSPIRATIONAL SCRIPT BADGE */}
      <div className="outdoor-card p-4 bg-[#F2F8F4]/90 backdrop-blur-md overflow-hidden text-center shadow-sm border border-[#C8DEC8]">
        <p className="font-['Caveat',cursive] text-lg font-bold text-[#285943] leading-tight">
          Shorter Screen Time <br />
          Happier Trails, Brighter You ✨
        </p>
      </div>

    </div>
  );
}
