/**
 * Voice Exit Coach for CheckMate
 * Supports ElevenLabs Voice API (Hacktoberfest Category) and browser Web Speech API
 */

export function generateVoiceBriefingText({ friendName = "Alex", tripType, criticalItems, warningItems }) {
  let script = `Hey ${friendName}! CheckMate exit briefing before you step out for your ${tripType}. `;

  if (criticalItems && criticalItems.length > 0) {
    const itemNames = criticalItems.map(i => i.name.split("(")[0].trim()).join(" and ");
    script += `High alert warning: Do not forget your ${itemNames}! Especially check the wall sockets and desk corners, remember what happened last time. `;
  } else {
    script += `Everything looks well prepped from your room scan. `;
  }

  if (warningItems && warningItems.length > 0) {
    const firstWarning = warningItems[0];
    script += `Also make sure you packed your ${firstWarning.name.split("(")[0].trim()}. `;
  }

  script += `Double check your bag zipper, lock the door, and have a safe trip!`;
  return script;
}

export class VoiceCoach {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
  }

  speak({ text, elevenLabsApiKey = null, voiceId = "21m00Tcm4TlvDq8ikWAM", onStart, onEnd, onError }) {
    this.stop();

    // If ElevenLabs API key is provided, stream via ElevenLabs
    if (elevenLabsApiKey) {
      this.playElevenLabs({ text, apiKey: elevenLabsApiKey, voiceId, onStart, onEnd, onError });
      return;
    }

    // Default: Browser Web Speech API (Zero-setup, works everywhere)
    if (!this.synth) {
      if (onError) onError(new Error("Speech synthesis not supported in this browser"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  async playElevenLabs({ text, apiKey, voiceId, onStart, onEnd, onError }) {
    try {
      if (onStart) onStart();
      this.isPlaying = true;

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API returned ${response.status}: ${await response.text()}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      this.currentAudio = audio;
      audio.onended = () => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      };
      audio.onerror = (e) => {
        this.isPlaying = false;
        if (onError) onError(e);
      };

      await audio.play();
    } catch (err) {
      console.warn("ElevenLabs TTS failed, falling back to Web Speech:", err);
      // Fallback to Web Speech
      this.speak({ text, onStart, onEnd, onError });
    }
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }
}

export const globalVoiceCoach = new VoiceCoach();
