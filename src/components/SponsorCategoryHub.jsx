import React from 'react';
import { 
  X, 
  Award, 
  Cpu, 
  Layers, 
  Headphones, 
  Radio, 
  Cloud, 
  Globe, 
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function SponsorCategoryHub({ isOpen, onClose }) {
  if (!isOpen) return null;

  const categories = [
    {
      title: "Best Use of Gemma ($200)",
      partner: "Google DeepMind / Gemma",
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      color: "from-indigo-950/80 to-purple-950/40 border-indigo-700/60",
      description: "Canopy is built around Google's open-weight Gemma 2 architecture (9B-IT) running on-device with zero internet. Gemma synthesizes real-time daylight margins, safe turnaround calculations, Leave-No-Trace wilderness ethics, and local bioacoustic observations.",
      files: ["backend/gemma_canopy_agent.py", "src/services/gemmaTrailAgent.js", "src/components/GemmaSafetyAdvisor.jsx"]
    },
    {
      title: "Best Use of TabPFN ($200)",
      partner: "Prior Labs / TabPFN",
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      color: "from-amber-950/80 to-yellow-950/40 border-amber-700/60",
      description: "TabPFN, Prior Labs' tabular foundation model, performs zero-shot microclimate forecasting directly from historical regional CSV transects without gradient tuning. It accurately predicts sudden ground frost windows, fall foliage peak saturation, and trail mud/slip indices.",
      files: ["backend/tabpfn_microclimate.py", "src/services/tabpfnService.js", "data/microclimate_trail_history.csv"]
    },
    {
      title: "Best Use of ElevenLabs ($100)",
      partner: "ElevenLabs Voice AI",
      icon: <Headphones className="w-5 h-5 text-teal-400" />,
      color: "from-teal-950/80 to-emerald-950/40 border-teal-700/60",
      description: "Powering Canopy's screen-minimizing 'Pocket Whispers' trail guide. Hikers lock their phones and put them in their backpacks; ElevenLabs synthesizes hyper-natural audio whispers triggered by trail geofences and bird detections.",
      files: ["src/services/voiceGuide.js", "src/components/PocketModeModal.jsx"]
    },
    {
      title: "Best Use of Arduino ($200)",
      partner: "Arduino & Qualcomm AI Hub",
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      color: "from-emerald-950/80 to-teal-950/40 border-emerald-700/60",
      description: "Includes complete Arduino C++ firmware for the Arduino UNO Q microcontroller. Equipped with a BME280 barometric/humidity sensor and electret mic, it streams real-time microclimate pressure trends and bioacoustic harmonics over serial.",
      files: ["firmware/canopy_uno_q.ino", "src/components/ArduinoSensorBridge.jsx"]
    },
    {
      title: "Best Use of Render ($200)",
      partner: "Render Cloud Platform",
      icon: <Cloud className="w-5 h-5 text-rose-400" />,
      color: "from-rose-950/80 to-pink-950/40 border-rose-700/60",
      description: "Configured with a turnkey Render Blueprint (`render.yaml`) hosting both the FastAPI backend runtime and the React 19 static client with automatic health check checks.",
      files: ["render.yaml", "Dockerfile"]
    },
    {
      title: "Best Use of DigitalOcean ($200)",
      partner: "DigitalOcean Gradient AI",
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      color: "from-cyan-950/80 to-blue-950/40 border-cyan-700/60",
      description: "Includes `digitalocean-app.yaml` for 1-Click model hosting on GPU Droplets with Ollama runtime and automated static asset CDN edge delivery.",
      files: ["digitalocean-app.yaml"]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F2F8F4] border border-[#DCE7DF] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-[#DCE7DF] flex items-center justify-between bg-[#EBF5EE]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E7A94B]/20 text-[#D97855] font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#20332A]">
                  Hacktoberfest 2026: Partner Technology & Prize Hub
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DCEBDA] text-[#285943] border border-[#A8C5A0] font-bold">
                  Week 1: Touch Grass
                </span>
              </div>
              <p className="text-xs text-[#6F7B72]">
                Detailed mapping of all open-source AI integrations and partner category implementations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6F7B72] hover:text-[#20332A] hover:bg-[#DCE7DF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#DCE7DF] bg-[#EBF5EE] flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#DCEBDA] text-[#285943]">
                        {cat.icon}
                      </div>
                      <h4 className="text-sm font-bold text-[#20332A]">{cat.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-[#6F7B72] leading-relaxed mb-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DCE7DF]">
                  <span className="text-[10px] font-mono uppercase text-[#6F7B72] font-bold block mb-1">
                    IMPLEMENTATION CODE:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.files.map((f, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F2F8F4] border border-[#DCE7DF] text-[#20332A]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Prompt Harmony Box */}
          <div className="p-4 rounded-xl bg-[#DCEBDA] border border-[#A8C5A0] text-xs text-[#20332A] space-y-1.5">
            <div className="flex items-center gap-2 text-[#285943] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Theme Alignment: Touch Grass ("Make the screen the shortest part of the experience")</span>
            </div>
            <p className="text-[#20332A] leading-relaxed">
              Every technology chosen serves the goal of getting humans into the natural world while keeping their phones in their pockets. Gemma runs offline on backcountry trails without cellular coverage, TabPFN eliminates cloud roundtrips for frost predictions, and ElevenLabs moves interaction into ambient audio whispers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
