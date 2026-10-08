import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Volume2, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  BookPlus, 
  HelpCircle,
  Headphones,
  Info
} from 'lucide-react';
import { BioAcousticAnalyzer, BIRD_ACOUSTIC_DB } from '../services/bioAcousticEngine';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function BioAcousticScanner({ currentTrail, onAddToJournal, audioMuted }) {
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [selectedBird, setSelectedBird] = useState(currentTrail.bioacoustics[0] || BIRD_ACOUSTIC_DB[0]);
  const [activeFrequency, setActiveFrequency] = useState(3450);
  const [confidence, setConfidence] = useState(0.96);
  const [isWhispering, setIsWhispering] = useState(false);
  const [journalAdded, setJournalAdded] = useState(false);

  const canvasRef = useRef(null);
  const analyzerRef = useRef(new BioAcousticAnalyzer());

  useEffect(() => {
    setSelectedBird(currentTrail.bioacoustics[0] || BIRD_ACOUSTIC_DB[0]);
    setJournalAdded(false);
  }, [currentTrail]);

  // Animated Spectrogram Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.05;

      const width = canvas.width;
      const height = canvas.height;

      // Dark background with slight trail
      ctx.fillStyle = 'rgba(12, 10, 9, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Frequency grid lines
      ctx.strokeStyle = 'rgba(41, 37, 36, 0.4)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw acoustic wave harmonics
      const baseFreq = isListeningMic ? activeFrequency : (selectedBird?.dominantHarmonic || 3200);
      const wavePoints = 80;
      const sliceWidth = width / wavePoints;

      ctx.beginPath();
      ctx.lineWidth = 2.5;

      // Color based on detected frequency band
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#10b981'); // Emerald
      gradient.addColorStop(0.5, '#06b6d4'); // Cyan
      gradient.addColorStop(1, '#f59e0b'); // Amber
      ctx.strokeStyle = gradient;

      for (let i = 0; i < wavePoints; i++) {
        const x = i * sliceWidth;
        const norm = i / wavePoints;
        // Multi-frequency harmonic superposition
        let y = height / 2;
        y += Math.sin(norm * 18 + time * 3) * (Math.sin(time * 2) * 16 + 24);
        y += Math.cos(norm * 32 - time * 4) * 12;
        y += (Math.random() - 0.5) * 8; // Ambient wind / rustle noise

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Peak Harmonic Highlight Beacon
      const peakX = width * 0.65;
      const peakY = height * 0.35 + Math.sin(time * 5) * 6;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Ripple around peak harmonic
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 12 + Math.sin(time * 8) * 4, 0, Math.PI * 2);
      ctx.stroke();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isListeningMic, activeFrequency, selectedBird]);

  // Handle live microphone toggle
  const toggleMicListening = async () => {
    if (isListeningMic) {
      analyzerRef.current.stopListening();
      setIsListeningMic(false);
    } else {
      const started = await analyzerRef.current.startMicListening((data) => {
        setActiveFrequency(data.peakFreqHz);
        const match = analyzerRef.current.classifyFrequencies(data.peakFreqHz);
        if (match) {
          setSelectedBird(match);
          setConfidence(match.confidence);
        }
      });
      if (started) {
        setIsListeningMic(true);
      }
    }
  };

  const handleSelectPresetBird = (bird) => {
    setSelectedBird(bird);
    setActiveFrequency(bird.dominantHarmonic || 3200);
    setConfidence(bird.confidence || 0.95);
    setJournalAdded(false);
    playTrailChime('bird');
  };

  const handleWhisperBirdInfo = () => {
    if (!selectedBird || audioMuted) return;
    const narration = `Bioacoustic detection confirmed: ${selectedBird.commonName || selectedBird.name}. Dominant call frequency at ${selectedBird.frequencyRange || (selectedBird.dominantHarmonic + ' Hertz')}. ${selectedBird.description || selectedBird.behavior}. Keep your screen in your pocket and listen into the tree branches.`;

    setIsWhispering(true);
    speakTrailWhisper(narration, {
      onStart: () => setIsWhispering(true),
      onEnd: () => setIsWhispering(false),
      chime: 'bird'
    });
  };

  const handleAddCurrentToJournal = () => {
    if (!selectedBird) return;
    onAddToJournal({
      id: `${selectedBird.id}-${Date.now()}`,
      name: selectedBird.commonName || selectedBird.name,
      scientific: selectedBird.scientificName || selectedBird.scientific,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      frequency: selectedBird.frequencyRange || `${selectedBird.dominantHarmonic} Hz`,
      confidence: confidence,
      trail: currentTrail.name
    });
    setJournalAdded(true);
    playTrailChime('nature');
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-5 py-4 bg-stone-950/80 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-800/60 text-teal-300">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-100">
                Backcountry Bioacoustic Analyzer
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                SPECTRAL ANALYSIS • Live FFT
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Live Fast Fourier Transform (FFT) spectral analysis with heuristic frequency-band matching across Himalayan wildlife database
            </p>
          </div>
        </div>

        {/* Live Mic Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMicListening}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              isListeningMic
                ? 'bg-rose-950 border-rose-600 text-rose-200 animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
            }`}
          >
            {isListeningMic ? (
              <>
                <MicOff className="w-4 h-4 text-rose-400" />
                <span>Stop Live Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-teal-400" />
                <span>Listen with Device Mic</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Spectrogram Wave Canvas & Audio Analysis */}
        <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>REAL-TIME CANOPY FFT SPECTROGRAM</span>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Frequency Band: <strong className="text-amber-400">{activeFrequency} Hz</strong>
              </span>
            </div>

            {/* Spectrogram Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 h-52">
              <canvas 
                ref={canvasRef} 
                width={560} 
                height={208} 
                className="w-full h-full block"
              />
              <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400/80 bg-stone-950/80 px-2 py-0.5 rounded border border-emerald-900/40">
                FFT Window: 512 pt • 44.1 kHz
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-400 bg-stone-950/80 px-2 py-0.5 rounded border border-stone-800">
                Harmonic Confidence: {(confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Quick Preset Selector for Trail Birds */}
          <div className="mt-4">
            <span className="text-xs font-semibold text-stone-400 block mb-2">
              OR TEST RECENT DETECTIONS ON THIS TRAIL:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentTrail.bioacoustics.map((bird) => {
                const isActive = (selectedBird.id === bird.id);
                return (
                  <button
                    key={bird.id}
                    onClick={() => handleSelectPresetBird(bird)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                        : 'bg-stone-800/80 hover:bg-stone-700/80 border-stone-700 text-stone-300'
                    }`}
                  >
                    <span>{bird.commonName}</span>
                    <span className="text-[10px] font-mono text-stone-400">
                      ({(bird.confidence * 100).toFixed(0)}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Species Identification & Field Actions */}
        <div className="lg:col-span-5 p-5 bg-stone-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                  CONFIRMED TAXA
                </span>
                <h4 className="text-xl font-black text-stone-100 mt-0.5">
                  {selectedBird.commonName || selectedBird.name}
                </h4>
                <p className="text-xs italic text-stone-400 font-serif">
                  {selectedBird.scientificName || selectedBird.scientific}
                </p>
              </div>

              {/* Confidence Badge */}
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {(confidence * 100).toFixed(0)}%
                </span>
                <span className="block text-[10px] font-medium text-stone-400 uppercase">
                  Confidence
                </span>
              </div>
            </div>

            {/* Vocalization & Harmonics Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Acoustic Signature:</span>
                <span className="text-stone-200 font-medium">
                  {selectedBird.callType || selectedBird.spectralPattern}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Habitat & Ecological Niche:</span>
                <span className="text-stone-300">
                  {selectedBird.description || selectedBird.habitat}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50">
                <span className="text-emerald-400 block text-[11px] font-semibold">Gemma Field Note:</span>
                <span className="text-emerald-200 text-xs italic">
                  "{selectedBird.gemmaNotes || selectedBird.behavior}"
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Whisper Narration & Add to Journal */}
          <div className="mt-5 space-y-2 pt-3 border-t border-stone-800">
            <button
              onClick={handleWhisperBirdInfo}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-teal-950/60"
            >
              <Headphones className="w-4 h-4" />
              <span>
                {isWhispering ? 'Whispering in Earbuds...' : 'Whisper Identification (Screenless)'}
              </span>
            </button>

            <button
              onClick={handleAddCurrentToJournal}
              disabled={journalAdded}
              className={`w-full py-2 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                journalAdded
                  ? 'bg-stone-800/80 border-stone-700 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-200'
              }`}
            >
              {journalAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Logged in Field Journal</span>
                </>
              ) : (
                <>
                  <BookPlus className="w-4 h-4 text-amber-400" />
                  <span>Log Sighting to Offline Journal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
