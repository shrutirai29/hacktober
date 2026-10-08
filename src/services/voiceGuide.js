// VoiceGuide service: ElevenLabs API integration + Offline Web Speech API fallback + Web Audio Chimes

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  return audioCtx;
}

// Gentle natural audio chime using Web Audio API synthesis (zero audio asset download needed!)
export function playTrailChime(type = 'nature') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'bird') {
      // Ethereal Hermit Thrush flute arpeggio (intro whistle + harmonic cascade)
      const freqs = [1760, 2637, 3520]; // A6, E7, A7
      freqs.forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        const startT = now + idx * 0.12;
        o.frequency.setValueAtTime(f, startT);
        o.frequency.exponentialRampToValueAtTime(f * 1.15, startT + 0.1);
        g.gain.setValueAtTime(0.09, startT);
        g.gain.exponentialRampToValueAtTime(0.001, startT + 0.28);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(startT);
        o.stop(startT + 0.28);
      });
    } else if (type === 'warning') {
      // Gentle dual tone low chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Natural serene outdoor bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (err) {
    console.warn("Audio chime prevented or unsupported:", err);
  }
}

// Global audio mute state
let isGlobalAudioMuted = false;

export function setGlobalAudioMute(muted) {
  isGlobalAudioMuted = !!muted;
  if (isGlobalAudioMuted) {
    stopSpeaking();
  }
}

export function getGlobalAudioMute() {
  return isGlobalAudioMuted;
}

export async function speakTrailWhisper(text, options = {}) {
  const {
    voiceId = "21m00Tcm4TlvDq8ikWAM",
    apiKey = "",
    onStart = () => {},
    onEnd = () => {},
    chime = "nature",
    muted = false
  } = options;

  if (muted || isGlobalAudioMuted || !text || typeof text !== 'string') {
    onEnd();
    return { provider: "none", success: false, muted: true };
  }

  playTrailChime(chime);

  // 1. Offline Native Web Speech API (Primary 100% Offline Trail Voice with zero cloud dependencies)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Calm, clear trail pacing
      utterance.pitch = 1.0;

      // Pick a natural English voice if present
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => onStart();
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();

      window.speechSynthesis.speak(utterance);
      return { provider: "webspeech", success: true };
    } catch (e) {
      console.warn("Offline Web Speech error:", e);
    }
  }

  // 2. Optional ElevenLabs if key provided and online
  if (apiKey && apiKey.trim().length > 10 && typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      onStart();
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          onEnd();
        };
        audio.onerror = () => {
          onEnd();
        };

        await audio.play();
        return { provider: "elevenlabs", success: true };
      }
    } catch (err) {
      console.warn("ElevenLabs TTS fallback failed:", err);
    }
  }

  onEnd();
  return { provider: "none", success: false };
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
