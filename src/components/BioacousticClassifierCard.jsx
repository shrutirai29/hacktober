import React, { useState, useEffect, useRef } from 'react';
import { 
  Bird, 
  Volume2, 
  BookPlus, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Activity, 
  Info,
  ChevronRight
} from 'lucide-react';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function BioacousticClassifierCard({ onAddToJournal, audioMuted, onOpenDetails }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const canvasRef = useRef(null);

  // Animated Spectrogram Canvas with 512-pt FFT styling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      // Dark nocturnal canvas background
      ctx.fillStyle = '#141F1A';
      ctx.fillRect(0, 0, w, h);

      // Horizontal grid lines for frequency steps
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Vertical moving spectral bands (spectrogram waterfalls)
      const bars = 64;
      const barW = w / bars;
      for (let i = 0; i < bars; i++) {
        const x = i * barW;
        // Hermit Thrush signature: prominent harmonics in middle band (around 3.5 kHz)
        const norm = i / bars;
        const wave = Math.sin(norm * 14 + time * 2) * Math.cos(time * 3);
        const intensity = Math.max(0.1, Math.min(0.95, 0.4 + wave * 0.4 + Math.random() * 0.15));

        const barH = (h * 0.6) * intensity;
        const y = h * 0.4 - (barH / 2) + Math.sin(norm * 20 + time * 4) * 8;

        // Spectrogram heat gradient: Autumn Gold -> Autumn Coral -> Mountain Berry
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, '#E7A94B');
        grad.addColorStop(0.5, '#D97855');
        grad.addColorStop(1, '#8B6474');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW - 1, barH);
      }

      // Peak Indicator Marker at 3,450 Hz
      const peakX = w * 0.68;
      const peakY = h * 0.38;

      ctx.strokeStyle = '#E7A94B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(peakX, 0);
      ctx.lineTo(peakX, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Peak circle
      ctx.fillStyle = '#E7A94B';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePlayBirdCall = () => {
    if (audioMuted) return;
    setIsPlayingAudio(true);
    playTrailChime('bird');
    speakTrailWhisper("Detected: Himalayan Monal. Ringing whistled flight notes echoing from the Juda Ka Talab deodar slopes.", {
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      chime: 'bird'
    });
  };

  const handleLogJournal = () => {
    setIsLogged(true);
    playTrailChime('nature');
    if (onAddToJournal) {
      onAddToJournal({
        id: `himalayan-monal-${Date.now()}`,
        name: "Himalayan Monal",
        scientific: "Lophophorus impejanus",
        time: "07:15 AM",
        frequency: "3,850 Hz",
        confidence: 0.96,
        trail: "Kedarkantha Summit Ridge"
      });
    }
    setTimeout(() => setIsLogged(false), 3000);
  };

  return (
    <div className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#C8DEC8] flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
              <Bird className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#20332A]">
              Bioacoustic Spectral Analyzer
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DCEBDA] text-[#285943] border border-[#A8C5A0] text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5A] animate-pulse"></span>
              Live FFT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#8B6474]/15 text-[#8B6474] text-[9px] font-bold">
              Spectral Heuristic Analysis
            </span>
          </div>
        </div>

        {/* Real-time 512-pt FFT Spectrogram Viewport */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C8DEC8] h-32 bg-[#141F1A] shadow-inner mb-3">
          
          {/* Y-Axis Frequency Scales */}
          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-[9px] font-mono text-[#A8C5A0] pointer-events-none py-1.5 z-10">
            <span>10 kHz</span>
            <span>5 kHz</span>
            <span>2 kHz</span>
            <span>0 Hz</span>
          </div>

          <canvas 
            ref={canvasRef} 
            width={480} 
            height={128} 
            className="w-full h-full block" 
          />

          {/* 3,850 Hz Peak Callout Badge */}
          <div className="absolute right-[24%] top-3 px-2 py-0.5 rounded-md bg-[#20332A]/90 backdrop-blur-sm border border-[#E7A94B] text-[#E7A94B] text-[10px] font-mono font-bold shadow-md">
            3,850 Hz
          </div>
        </div>

        {/* Detected Species Card */}
        <div className="p-3 rounded-2xl bg-[#EBF5EE] border border-[#C8DEC8] flex items-center justify-between gap-3 mb-2">
          
          <div className="flex items-center gap-3">
            {/* Bird photo thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#C8DEC8] shrink-0">
              <img 
                src="/assets/hermit_thrush.jpg" 
                alt="Himalayan Monal"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=150&fit=crop";
                }}
                className="w-full h-full object-cover" 
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-[#20332A]">
                  Himalayan Monal
                </h4>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#3F7D5A]">
                  <span className="w-1 h-1 rounded-full bg-[#3F7D5A]"></span>
                  96%
                </span>
              </div>

              <span className="text-[10px] italic text-[#6F7B72] font-serif block">
                Lophophorus impejanus
              </span>

              <span className="text-[10px] font-mono text-[#6F7B72] mt-0.5 block">
                3.2 – 5.8 kHz
              </span>
            </div>
          </div>

          {/* Soundwave graphic & audio button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayBirdCall}
              title="Play Audio Whisper"
              className="p-2 rounded-xl bg-[#F2F8F4] border border-[#C8DEC8] text-[#285943] hover:bg-[#DCEBDA] transition shadow-sm"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-[#3F7D5A]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Taxonomic Badge & Description */}
        <div className="flex items-start gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-[#DCEBDA] text-[#285943] font-extrabold text-[9px] shrink-0 mt-0.5">
            Uttarakhand State Bird
          </span>
          <p className="text-[11px] text-[#6F7B72] leading-snug">
            Nine-colored iridescent pheasant whistling across the Kedarkantha oak & deodar canopy.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#C8DEC8]">
        <button
          onClick={onOpenDetails}
          className="flex-1 py-2 px-3 rounded-xl border border-[#C8DEC8] bg-[#F2F8F4] hover:bg-[#EBF5EE] text-[#20332A] font-bold text-xs transition text-center shadow-sm"
        >
          View Details
        </button>

        <button
          onClick={handleLogJournal}
          className="flex-1 py-2 px-3 rounded-xl bg-[#285943] hover:bg-[#204936] text-[#FBF8EF] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
        >
          {isLogged ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Logged!</span>
            </>
          ) : (
            <>
              <BookPlus className="w-3.5 h-3.5" />
              <span>Log to Journal</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
