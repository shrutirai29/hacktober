import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Volume2, 
  Headphones, 
  Compass, 
  EyeOff, 
  Flame, 
  TreePine,
  Play
} from 'lucide-react';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function PocketModeModal({ isOpen, onClose, currentTrail, audioMuted }) {
  const [screenOnSeconds, setScreenOnSeconds] = useState(38);
  const [outdoorSeconds, setOutdoorSeconds] = useState(2460); // 41 minutes
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [isWhispering, setIsWhispering] = useState(false);
  const [lastWhisper, setLastWhisper] = useState(
    currentTrail.waypoints[0]?.audioWhisper || "Pocket mode active. Eyes on the trail."
  );

  useEffect(() => {
    let interval = null;
    if (isOpen) {
      interval = setInterval(() => {
        setOutdoorSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentWp = currentTrail.waypoints[currentStepIndex] || currentTrail.waypoints[0];

  const handleSimulateNextWaypoint = () => {
    const nextIdx = (currentStepIndex + 1) % currentTrail.waypoints.length;
    setCurrentStepIndex(nextIdx);
    const wp = currentTrail.waypoints[nextIdx];
    setLastWhisper(wp.audioWhisper);

    if (!audioMuted) {
      setIsWhispering(true);
      speakTrailWhisper(wp.audioWhisper, {
        onStart: () => setIsWhispering(true),
        onEnd: () => setIsWhispering(false),
        chime: 'nature'
      });
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141B17]/98 text-stone-100 flex flex-col justify-between p-6 select-none animate-fadeIn backdrop-blur-md">
      {/* Top Bar: Minimal OLED status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F7D5A] animate-ping"></span>
          <span className="text-xs font-mono tracking-widest text-[#A8C5A0] font-bold uppercase">
            POCKET MODE ACTIVE
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B2620] border border-[#2A3830] text-stone-300 text-xs font-medium hover:bg-[#285943]/40 transition"
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Exit to Screen</span>
        </button>
      </div>

      {/* Center: Tactile Touch-Grass Core */}
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Pulsing Nature Beacon */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#3F7D5A]/15 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-[#3F7D5A]/25"></div>
          <div className="w-28 h-28 rounded-full bg-[#1B2620] border border-[#3F7D5A]/50 flex flex-col items-center justify-center shadow-2xl shadow-black/80">
            <TreePine className="w-10 h-10 text-[#DCEBDA] mb-1" />
            <span className="text-[10px] font-mono uppercase text-[#A8C5A0] tracking-wider">
              TOUCH GRASS
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#FBF8EF] tracking-tight">
            Put Phone in Your Pocket
          </h2>
          <p className="text-xs text-[#95A59B] max-w-xs mx-auto mt-1 leading-relaxed">
            Canopy whispers bird calls and trail landmarks through your earbuds. Keep your head up and your eyes on nature.
          </p>
        </div>

        {/* Real Screen Time vs Outdoor Time Ratio */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#1B2620] border border-[#2A3830]">
          <div className="text-left border-r border-[#2A3830] pr-3">
            <span className="text-[10px] font-mono uppercase text-[#6F7B72] block">
              SCREEN-ON TIME
            </span>
            <span className="text-lg font-black font-mono text-[#DCEBDA]">
              {formatTime(screenOnSeconds)}
            </span>
            <span className="text-[9px] text-[#6F7B72] block">Shortest part of hike</span>
          </div>
          <div className="text-left pl-3">
            <span className="text-[10px] font-mono uppercase text-[#6F7B72] block">
              TIME OUTDOORS
            </span>
            <span className="text-lg font-black font-mono text-[#E7A94B]">
              {formatTime(outdoorSeconds)}
            </span>
            <span className="text-[9px] text-[#6F7B72] block">Breathing fresh air</span>
          </div>
        </div>

        {/* Current Headphone Whisper */}
        <div className="p-4 rounded-xl bg-[#1B2620]/80 border border-[#2A3830] text-left">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <div className="flex items-center gap-1.5 text-[#A8C5A0] font-semibold">
              <Headphones className="w-3.5 h-3.5" />
              <span>Earbud Whisper:</span>
            </div>
            <span className="font-mono text-[10px] text-[#6F7B72]">
              {currentWp.name}
            </span>
          </div>
          <p className="text-xs text-stone-200 italic leading-relaxed">
            "{lastWhisper}"
          </p>
        </div>
      </div>

      {/* Bottom Bar: Large Blind-Tap Tactile Controls */}
      <div className="max-w-md mx-auto w-full space-y-3">
        <button
          onClick={handleSimulateNextWaypoint}
          className="w-full py-4 px-6 rounded-2xl bg-[#285943] hover:bg-[#3F7D5A] active:scale-95 text-[#FBF8EF] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-black/60 transition"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Tap to Trigger Next Trail Whisper</span>
        </button>
        <p className="text-[11px] text-[#6F7B72] text-center">
          Designed for no-look thumb tapping while walking on the trail.
        </p>
      </div>
    </div>
  );
}
