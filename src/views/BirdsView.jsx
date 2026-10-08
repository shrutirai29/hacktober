import React, { useState } from 'react';
import { 
  Bird, 
  Volume2, 
  Search, 
  Radio, 
  Filter, 
  Sparkles, 
  BookPlus, 
  CheckCircle2,
  Mic,
  ShieldCheck
} from 'lucide-react';
import { BIRD_ACOUSTIC_DB } from '../services/bioAcousticEngine';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function BirdsView({ onAddToJournal, audioMuted }) {
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [playingId, setPlayingId] = useState(null);
  const [loggedIds, setLoggedIds] = useState({});

  const families = ['All', 'Phasianidae', 'Accipitridae', 'Corvidae', 'Turdidae'];

  const filteredBirds = BIRD_ACOUSTIC_DB.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || 
                          b.scientific.toLowerCase().includes(search.toLowerCase()) ||
                          b.habitat.toLowerCase().includes(search.toLowerCase());
    const matchesFamily = selectedFamily === 'All' || b.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  const handlePlayAudio = (bird) => {
    if (audioMuted) return;
    setPlayingId(bird.id);
    playTrailChime('bird');
    speakTrailWhisper(`Bioacoustic profile: ${bird.name}. ${bird.spectralPattern}. Recorded frequency between ${bird.minFreq} and ${bird.maxFreq} Hertz. ${bird.behavior}.`, {
      onStart: () => setPlayingId(bird.id),
      onEnd: () => setPlayingId(null),
      chime: 'bird'
    });
  };

  const handleLog = (bird) => {
    setLoggedIds(prev => ({ ...prev, [bird.id]: true }));
    playTrailChime('nature');
    if (onAddToJournal) {
      onAddToJournal({
        id: `${bird.id}-${Date.now()}`,
        name: bird.name,
        scientific: bird.scientific,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        frequency: `${bird.dominantHarmonic} Hz`,
        confidence: bird.confidenceBoost,
        trail: "Backcountry Transect"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="outdoor-card p-6 bg-[#F2F8F4]/95 border-[#DCE7DF] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
              <Bird className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-[#20332A]">
              Offline Bioacoustic Species Vault
            </h1>
          </div>
          <p className="text-xs text-[#6F7B72]">
            All spectral signatures and harmonic patterns are stored locally on-device. Zero network requests required on the trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#DCEBDA] text-[#285943] border border-[#A8C5A0] text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3F7D5A] animate-ping"></span>
            <span>100% Offline Database</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7B72]" />
          <input
            type="text"
            placeholder="Search by common name, Latin name, or habitat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F2F8F4] border border-[#DCE7DF] rounded-xl text-[#20332A] focus:outline-none focus:border-[#3F7D5A]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {families.map(fam => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedFamily === fam
                  ? 'bg-[#285943] text-[#FBF8EF] shadow-sm'
                  : 'bg-[#F2F8F4] border border-[#DCE7DF] text-[#6F7B72] hover:bg-[#EBF5EE]'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>
      </div>

      {/* Species Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBirds.map(bird => (
          <div key={bird.id} className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#DCE7DF] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{bird.audioSampleIcon}</span>
                    <h3 className="text-sm font-extrabold text-[#20332A]">
                      {bird.name}
                    </h3>
                  </div>
                  <span className="text-xs italic text-[#6F7B72] font-serif block">
                    {bird.scientific} ({bird.family})
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-[#DCEBDA] text-[#285943] font-extrabold text-[9px]">
                  LC
                </span>
              </div>

              {/* Spectral specs */}
              <div className="p-3 rounded-xl bg-[#EBF5EE] border border-[#DCE7DF] text-xs space-y-1.5 my-3">
                <div className="flex justify-between">
                  <span className="text-[#6F7B72]">Dominant Harmonic:</span>
                  <strong className="text-[#E7A94B] font-mono">{bird.dominantHarmonic} Hz</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F7B72]">Frequency Range:</span>
                  <span className="font-mono text-[#20332A]">{bird.minFreq} – {bird.maxFreq} Hz</span>
                </div>
                <div className="text-[11px] text-[#6F7B72] pt-1 border-t border-[#DCE7DF]">
                  <strong>Pattern:</strong> {bird.spectralPattern}
                </div>
              </div>

              <p className="text-xs text-[#20332A] leading-relaxed mb-2">
                <strong>Habitat:</strong> {bird.habitat}
              </p>
              <p className="text-xs text-[#6F7B72] leading-relaxed italic">
                "{bird.behavior}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#DCE7DF] mt-4">
              <button
                onClick={() => handlePlayAudio(bird)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#3F7D5A] hover:bg-[#34684a] text-[#FBF8EF] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Volume2 className={`w-3.5 h-3.5 ${playingId === bird.id ? 'animate-pulse text-[#DCEBDA]' : ''}`} />
                <span>{playingId === bird.id ? 'Whispering...' : 'Audio Whisper'}</span>
              </button>

              <button
                onClick={() => handleLog(bird)}
                className="py-2 px-3 rounded-xl border border-[#DCE7DF] bg-[#F2F8F4] hover:bg-[#EBF5EE] text-[#20332A] font-bold text-xs flex items-center gap-1 transition shadow-sm"
              >
                {loggedIds[bird.id] ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7D5A]" /> : <BookPlus className="w-3.5 h-3.5 text-[#285943]" />}
                <span>{loggedIds[bird.id] ? 'Logged' : 'Journal'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
