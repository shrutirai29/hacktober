# 🌿 Canopy — Backcountry Guardian
### Offline-First Open-Weight AI Outdoor Safety & Terrain Intelligence System
**Built for the Touch Grass Open-Source AI Challenge**

> *"Build something with open-source AI at its core that gets people off the screen and into the world."*

[![Open-Weight AI](https://img.shields.io/badge/Open--Weight_AI-SmolLM2_%2F_Gemma_2_%2F_Deep_MLP-285943.svg)](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct)
[![Offline First](https://img.shields.io/badge/Inference-100%25_Browser_Local-16a34a.svg)](#)
[![Deterministic Safety](https://img.shields.io/badge/Safety_Layer-Deterministic_Override_Engine-dc2626.svg)](#)
[![License: Apache 2.0 / MIT](https://img.shields.io/badge/License-Apache_2.0_%2F_MIT-blue.svg)](LICENSE)

---

## 🏔️ Overview

**Canopy (Backcountry Guardian)** is an offline-first backcountry safety, microclimate, terrain intelligence, and outdoor guidance system. Designed to minimize screen time in the outdoors, Canopy provides hands-free voice-first guidance, real-time environmental telemetry grounding, and a multi-tiered open-weight AI architecture protected by a deterministic safety engine.

---

## 🏛️ System Architecture

```text
                        ┌────────────────────────────────────────────────────────┐
                        │                    USER INTERFACE                      │
                        │  Hands-Free Field Mode / Voice Outdoors / 3D Topo Map  │
                        └───────────────────────────┬────────────────────────────┘
                                                    │ User Prompt / Voice Query
                                                    ▼
                        ┌────────────────────────────────────────────────────────┐
                        │             CANOPY TELEMETRY CONTEXT ENGINE            │
                        │  Trail • Elevation • Slope • Weather • Risk • Curfew   │
                        │  Water • Wildlife • Sensors (Simulated vs Live USB)    │
                        └───────────────────────────┬────────────────────────────┘
                                                    │ Grounded Structured Context
                                                    ▼
                        ┌────────────────────────────────────────────────────────┐
                        │             OPEN-WEIGHT AI INFERENCE CORE              │
                        │  Tier 1: WebLLM (SmolLM2-135M-IT via WebGPU)           │
                        │  Tier 2: Localhost Daemon (Gemma 2 9B-IT via Ollama)   │
                        │  Tier 3: Browser-Local Deep Neural MLP (Zero Cloud)    │
                        └───────────────────────────┬────────────────────────────┘
                                                    │ Model Proposal
                                                    ▼
                        ┌────────────────────────────────────────────────────────┐
                        │              DETERMINISTIC SAFETY ENGINE               │
                        │  Hard Cutoff Curfew • Extreme Risk Threshold (>75)     │
                        │  Whiteout Disorientation • Sub-zero Thermal • Hypoxia  │
                        └───────────────────────────┬────────────────────────────┘
                                                    │ Intercept & Override (if unsafe)
                                                    ▼
                        ┌────────────────────────────────────────────────────────┐
                        │                AUDIO / SPEECH SYNTHESIS                │
                        │     Hands-Free Verbal Warnings & Route Navigation      │
                        └────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

1. **Open-Weight AI at the Core:**
   - **Zero Cloud APIs, Zero API Keys:** Runs 100% on the user's device with zero telemetry leaving the browser.
   - **Tiered Model Runtimes:**
     - **WebLLM:** In-browser WebGPU execution of `SmolLM2-135M-Instruct` (Apache 2.0).
     - **Local Ollama Daemon:** Localhost port 11434 connection for Google's `gemma2:9b-instruct` (Gemma Open License).
     - **On-Device Deep MLP:** Pure JavaScript 3-layer neural network with backprop and strict telemetry grounding (MIT).
2. **Deterministic Safety Engine:**
   - Ensures the LLM is **never the sole safety authority**.
   - Enforces 5 hard safety rules (Mandatory turnaround cutoff, extreme risk threshold, whiteout disorientation, sub-zero hypothermia, hypoxia protocols).
   - If conditions violate hard safety thresholds, the safety engine overrides the model proposal with high-priority warnings.
3. **Dedicated Hands-Free Field Mode:**
   - High-contrast, minimal OLED interface designed to get users off the screen.
   - Touch-to-speak voice copilot using native browser Speech Recognition and Speech Synthesis.
   - One-tap Emergency SOS beacon and glanceable trail telemetry.
4. **Interactive 3D Topographic Terrain:**
   - Procedural PBR canvas normal and roughness maps (0 external texture downloads).
   - Multi-touch orbit, pinch-zoom, and terrain raycasting to inspect elevation and slope angles.
5. **Hardware Telemetry Bridge:**
   - Chromium WebSerial API bridge connecting to physical Arduino / ESP32 sensor pods.
   - Clear distinction between `LIVE SENSOR (Physical Hardware)` and `SIMULATED SENSOR (Synthetic Stream)`.
6. **Microclimate & Bioacoustics:**
   - Environmental lapse rate physics model ($\Delta T = -6.5^\circ\text{C} / 1000\text{m}$) with frost danger predictions (`PHYSICS FALLBACK`).
   - Web Audio 512-pt FFT live spectral analysis with native species frequency matching (`SPECTRAL ANALYSIS`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Modern Chromium browser (Chrome / Edge / Opera) with WebGPU and WebSerial support.

### Installation
```bash
# Clone the repository
git clone https://github.com/shrutirai29/canopy-touch-grass.git
cd canopy-touch-grass

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```

The application will be live at **`http://localhost:5174/`**.

---

## 🧪 Testing & Verification

1. **Offline Mode:** Disconnect your internet connection or toggle DevTools to *Offline*. All 3D maps, AI guidance, voice synthesis, and safety checks remain 100% functional.
2. **Open AI Verification Sandbox:** Navigate to **AI Guide** $\rightarrow$ **Open AI & Why** tab to test:
   - **Scenario A (Safe Morning):** $2,500\text{m}$, $15^\circ\text{C}$, Risk 20 $\rightarrow$ Ascent permitted.
   - **Scenario B (Dangerous Cutoff):** $4,270\text{m}$, $2^\circ\text{C}$, Past 2:30 PM cutoff, Risk 85 $\rightarrow$ Deterministic Override: **TURN BACK**.
   - **Hallucination Protection:** Inquire about nonexistent checkpoints (e.g., *"Temp at checkpoint XYZ?"*) to observe strict grounding.
   - **Model Failure Failsafe:** Click *"Simulate AI Failure"* to observe the deterministic safety engine take over without crashing.

---

## 📜 Licensing

- **Canopy Software & On-Device Models:** [MIT License](LICENSE)
- **SmolLM2-135M-Instruct:** Apache 2.0 License
- **Gemma 2 (9B-IT):** Gemma Terms of Use / Gemma Open License
