# 🌿 Canopy — Backcountry Guardian
### Offline-First Open-Weight AI Backcountry Safety & Terrain Intelligence System
**Built for the Touch Grass Open-Source AI Challenge**

> *"Build something with open-source/open-weight AI at its core that gets people off the screen and into the world."*

[![Open-Weight AI](https://img.shields.io/badge/Open--Weight_AI-SmolLM2_%2F_Gemma_2-285943.svg)](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct)
[![Inference Runtime](https://img.shields.io/badge/Runtime-WebGPU_%2B_Local_Daemon-16a34a.svg)](#)
[![Deterministic Safety](https://img.shields.io/badge/Safety_Layer-Deterministic_Hard_Overrides-dc2626.svg)](#)
[![License: Apache 2.0 / MIT](https://img.shields.io/badge/License-Apache_2.0_%2F_MIT-blue.svg)](LICENSE)
[![Challenge Alignment](https://img.shields.io/badge/Touch_Grass_Challenge-Verified_Alignment-forestgreen.svg)](#-10-touch-grass-alignment-rubric--judging-verification)

---

## 🏔️ 1. Project Overview & Philosophy

Outdoor safety cannot depend on cellular signal or cloud APIs. The moment an alpine trekker crosses 3,500 meters or enters an exposed couloir, cloud connectivity drops to zero. If safety intelligence lives exclusively on remote servers, it fails precisely when human lives depend on it most.

**Canopy (Backcountry Guardian)** is an offline-first backcountry safety, microclimate, and terrain intelligence system built with open-weight AI at its core.

### The Touch Grass Architecture
Canopy is architected to get users **off screens and into the natural world**:

```text
REAL-WORLD SENSORS & ENVIRONMENT
             ↓
CANOPY TELEMETRY CONTEXT ENGINE
             ↓
OPEN-WEIGHT LOCAL AI (SmolLM2 / Gemma 2) + NEURAL FALLBACK (Canopy Net)
             ↓
DETERMINISTIC SAFETY ENGINE (Final Authority)
             ↓
VOICE GUIDANCE & MINIMAL FIELD UI
             ↓
USER GOES OUTSIDE & EXPLORES SAFELY
```

---

## 📸 Visual Showcase & Application Gallery

### 1. Interactive 3D Terrain & Dynamic Telemetry Dashboard
High-resolution 3D mountain elevation mesh with raycasted trail splines, live slope angles, dynamic risk gauges, and context-aware guidance cards.

![Canopy 3D Terrain & Live Dashboard](public/screenshots/hero_terrain_dashboard.jpg)

<br/>

### 2. High-Altitude Topographic Elevation & Ecosystem Mapping
Himalayan topo visualizer rendering ridge contours, elevation profiles, water availability, and ecosystem indicators.

![Himalayan Topographic Map](public/screenshots/topo_3d_landscape.png)

<br/>

### 3. Open-Weight AI Field Guardian & Context Reasoning
Context-grounded assistant powered by SmolLM2-135M on WebGPU, supervised by the deterministic safety engine.

![Safety Advisor Guidance](public/screenshots/safety_advisor_guidance.png)

<br/>

### 4. Minimalist High-Contrast OLED Field Mode
Zero-distraction high-contrast interface designed for bright mountain sunlight or night hikes, maximizing battery life and field glanceability.

![Minimalist OLED Field Mode](public/screenshots/field_mode_oled.png)

<br/>

### 5. Physical Sensor Telemetry Bridge (Arduino UNO Q / WebSerial)
Real-time environmental sensor ingestion via WebSerial (BME280 temperature, pressure, humidity, peak microphone harmonics) with transparent synthetic simulation mode.

![Arduino Physical Sensor Bridge](public/screenshots/sensors_arduino_telemetry.png)

<br/>

### 6. Developer & Judge Diagnostics Console (`/diagnostics`)
Dedicated live runtime audit dashboard displaying real WebGPU device status, active model weights, deterministic safety health, and one-click self-test execution.

![Developer Diagnostics](public/screenshots/developer_diagnostics.png)

---

## 🏛️ 2. Open-Weight AI Architecture

Canopy implements a strict, pluggable, multi-tiered local AI provider architecture with **zero reliance on proprietary cloud APIs** (no OpenAI, no Anthropic, no Gemini API keys):

```text
                            ┌──────────────────────────────┐
                            │   USER QUERY / VOICE INPUT   │
                            └──────────────┬───────────────┘
                                           │
                                           ▼
                            ┌──────────────────────────────┐
                            │    CANOPY CONTEXT ENGINE     │
                            │  Elevation • Slope • Risk    │
                            │  Curfew • Weather • Sensors  │
                            └──────────────┬───────────────┘
                                           │
                                           ▼
              ┌─────────────────────────────────────────────────────────┐
              │           TIERED OPEN-WEIGHT AI PROVIDERS               │
              │                                                         │
              │  1. PRIMARY: WebLLM In-Browser Engine                   │
              │     Model: SmolLM2-135M-Instruct (Apache 2.0)           │
              │     Runtime: Browser WebGPU (100% On-Device VRAM)       │
              │                                                         │
              │  2. SECONDARY: Local Ollama Desktop Daemon              │
              │     Model: Google Gemma 2 9B-IT (Gemma Open License)    │
              │     Runtime: Localhost:11434 (Zero Cloud)               │
              │                                                         │
              │  3. EMERGENCY FALLBACK: Canopy Backcountry Net          │
              │     Model: Custom On-Device Neural Fallback (MIT)       │
              │     Runtime: Pure JavaScript CPU (Zero Dependencies)    │
              └────────────────────────────┬────────────────────────────┘
                                           │ Proposed Response
                                           ▼
              ┌─────────────────────────────────────────────────────────┐
              │               DETERMINISTIC SAFETY ENGINE               │
              │                     (FINAL AUTHORITY)                   │
              │  • Hard Turnaround Curfew Intercept                     │
              │  • Extreme Risk Threshold Check (>75/100)               │
              │  • Whiteout Disorientation S.T.O.P. Protocol            │
              │  • Sub-Zero Thermal & Hypothermia Gate                  │
              │  • Post-Inference Sanitization & Medical Filter         │
              └────────────────────────────┬────────────────────────────┘
                                           │ Verified Safe Directive
                                           ▼
              ┌─────────────────────────────────────────────────────────┐
              │            HANDS-FREE FIELD GUIDANCE & VOICE            │
              │  • Native Web Speech API (Offline TTS)                  │
              │  • Procedural Web Audio Harmonic Chimes                 │
              │  • High-Contrast Minimalist OLED Field Mode             │
              └─────────────────────────────────────────────────────────┘
```

### Provider Hierarchy & Truthful Metadata
Every inference returns dynamic, truthful runtime metadata. The MLP fallback is **never falsely labeled as an LLM**:

```json
{
  "provider": "WebLLM Open-Weight Engine",
  "model": "SmolLM2-135M-Instruct (Apache 2.0)",
  "runtime": "WebGPU",
  "local": true,
  "offline": true,
  "fallback": false,
  "latency": 42
}
```

If WebGPU is unavailable or fails, Canopy degrades gracefully and truthfully:

```json
{
  "provider": "Canopy On-Device Emergency Net",
  "model": "Canopy Neural Fallback (3-Layer Deep MLP)",
  "runtime": "CPU / JavaScript",
  "local": true,
  "offline": true,
  "fallback": true,
  "latency": 2
}
```

---

## 🛡️ 3. Deterministic Safety Engine: Final Authority

The local open-weight AI model is **never the sole safety authority**. Canopy enforces a hard deterministic safety layer that intercepts and overrides model proposals whenever environmental safety thresholds are violated.

1. **Hard Turnaround Curfew (`HARD_TURNAROUND_CURFEW`):**
   If current time exceeds the trail cutoff (e.g., 4:00 PM vs. mandatory 2:30 PM cutoff), ascent queries are unconditionally overridden with:  
   `"Turn back immediately. You are beyond the mandatory turnaround window."`
2. **Extreme Risk Threshold (`EXTREME_RISK_THRESHOLD`):**
   If the composite risk score exceeds 75/100, continuation is strictly prohibited.
3. **Whiteout Disorientation Protocol (`WHITEOUT_DISORIENTATION_HAZARD`):**
   Zero visibility triggers the S.T.O.P. protocol (Stop, Think, Observe, Plan).
4. **Post-Inference Validation Layer:**
   If a model proposes *"Yes, you can continue"* under hazardous conditions, the validation layer intercepts and suppresses the unsafe recommendation, replacing it with the deterministic safety directive.

---

## 🏥 4. Medical Safety & Zero Casual Prescribing

Canopy complies with backcountry safety standards:
- **Zero Casual Prescribing:** No specific drug dosages (Diamox / Acetazolamide dosages, Ibuprofen / Paracetamol dosages, Nifedipine, Dexamethasone) are prescribed.
- **Conservative Mountain Protocols:** AMS guidance enforces halting ascent, resting, hydrating with electrolytes, descending 500–1,000 meters if symptoms worsen, and initiating satellite emergency evacuation.
- **Universal Medical Disclaimer:** Every medical or altitude advisory includes:  
  > *"⚠️ Medical Disclaimer: Canopy provides backcountry safety information, not medical advice. Consult a healthcare professional. In an emergency, initiate evacuation."*

---

## 📡 5. Truthful Sensors, Bioacoustics & Microclimate

- **Hardware Telemetry Bridge:** The Chromium WebSerial bridge clearly distinguishes between `LIVE SENSOR STREAM` (physical USB connection) and `SIMULATED TELEMETRY` (synthetic stream). Simulation mode is never disguised as live hardware.
- **Bioacoustics:** Honestly labeled as `SPECTRAL AUDIO ANALYSIS` (rule-based heuristic frequency matching and offline acoustic database; not an artificial deep neural claim).
- **Microclimate Service:** Predicts elevation-adjusted lapse rates ($\Delta T = -6.5^\circ\text{C} / 1000\text{m}$) and nocturnal radiative frost hazards, truthfully labeled as `PHYSICS FALLBACK`.

---

## 🛠️ 6. Developer & Judge Diagnostics: `/diagnostics`

Canopy includes a dedicated developer diagnostics route for judging and verification:
- **URL:** Navigate to `http://localhost:5174/diagnostics` (or click the header badge / footer link).
- **Real Runtime Polling:** Displays live, non-hardcoded status for 13 system components:
  - WebLLM Loaded (`GREEN` / `YELLOW` / `RED`)
  - Actual Model Name & Permissive License
  - Provider Currently Answering
  - Local Inference (`TRUE` / `FALSE`)
  - Offline State (`!navigator.onLine`)
  - Deterministic Safety Engine & Context Engine
  - Voice Provider (Native Web Speech API)
  - Sensor Hardware Status (`LIVE` vs `SIMULATED`)
  - Microclimate & Bioacoustic Providers
  - Browser CacheStorage & PWA Storage
- **Automated Self-Test:** Includes a **"Run Self Test"** button executing 6 automated live checks with real latency and PASS/FAIL reporting.

---

## 🚀 7. Installation & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node 20+)
- Chromium browser (Google Chrome, Microsoft Edge, Brave, Opera) with WebGPU support enabled.

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/shrutirai29/hacktober.git
cd hacktober

# 2. Install dependencies
npm install

# 3. Start the Vite local development server
npm run dev
```

The application will be live at:  
👉 **`http://localhost:5174/`** (or `http://localhost:5173/`)

### Optional: Local Ollama Daemon Setup
If you wish to test Tier 2 desktop inference:
```bash
# Install and run Ollama
ollama run gemma2:9b

# Ensure Ollama serves on localhost port 11434
# Canopy will automatically discover it via http://localhost:11434/api/tags
```

---

## 📶 8. Offline Operation & Model Caching Prerequisites

- **Initial Download (Requires Network):** On initial launch when selecting the WebLLM engine, the browser downloads the quantized open-weight model weights (~140MB for `SmolLM2-135M-Instruct-q0f16-MLC`) into the browser's `CacheStorage` / `IndexedDB`.
- **Subsequent Operation (Offline-Capable):** Once weights and core PWA assets are cached, the application is designed to operate offline on-device without internet access.
- **Hardware Prerequisite:** WebLLM requires a browser and GPU supporting the modern WebGPU standard. If WebGPU is unsupported or unavailable (e.g., in headless CI or older hardware), Canopy degrades gracefully to its on-device neural fallback (pure CPU JavaScript with zero external dependencies).
- **Desktop Daemon (Ollama):** If using the secondary Ollama tier (Gemma 2 9B), the local Ollama daemon must be installed and running on `localhost:11434`.

---

## 🧪 9. Red Team End-to-End Verification & Diagnostics

### Automated Test Suites
Run the verified test suites directly via Node:
```bash
# 1. Dedicated Unit & Adversarial Regression Suite (16 checks)
node scripts/unit_regression_suite.js

# 2. Comprehensive Red Team Audit Suite (15 checks)
node scripts/redteam_audit.js

# 3. Complete 28-Vector End-to-End Harness
node scripts/complete_redteam_e2e.js
```

### Developer Diagnostics Route (`/diagnostics`)
For judges and developer verification, Canopy includes an inspectable diagnostics route:
- **URL:** [http://localhost:5174/diagnostics](http://localhost:5174/diagnostics)
- **Live Runtime State:** Real-time indicators for WebGPU hardware, WebLLM engine status, active provider, deterministic safety engine, microclimate physics fallback, bioacoustic spectral analyzer, and PWA cache.
- **Interactive Self-Tests:**
  - **Run Full Self Test:** Exercises context assembly, scenario cutoffs, zero-hallucination guards, medical sanitization, microclimate physics fallback, and offline synthesis.
  - **Run WebLLM Self Test:** The authoritative in-browser verification testing WebGPU detection, `CreateMLCEngine` initialization, `SmolLM2-135M` weight loading, and live prompt inference.

### Manual Interactive Scenarios (Sandbox in UI)

| Scenario | Conditions | User Query | Expected Result |
| :--- | :--- | :--- | :--- |
| **Scenario A (Safe Morning)** | 2,500m, 15°C, Risk 20, 10:00 AM | *"Should I continue?"* | ✅ **Safe Approved** — Conversational pace & hydration advice. Override: `false`. |
| **Scenario B (Dangerous Cutoff)** | 4,270m, 2°C, Risk 85, 4:00 PM (Cutoff 2:30 PM) | *"Should I continue?"* | ⚠️ **Hard Override Active** — `HARD_TURNAROUND_CURFEW`. Command to turn back immediately. |
| **Hallucination Test** | Unknown waypoint "Checkpoint XYZ" | *"Temp at checkpoint XYZ?"* | 🔍 **Grounded Refusal** — Identifies XYZ as non-existent; lists valid monitored waypoints. |
| **Unmonitored Metric Test** | Sensor metric: UV Index | *"What is the UV index?"* | 📡 **Telemetry Grounding** — Refuses to fabricate; lists actively monitored metrics. |
| **Model Failure Test** | Simulate AI Failure Toggle | *"Should I continue?"* | 🛡️ **Graceful Failsafe** — Deterministic safety engine takes over without crashing. |

---

## 🏆 10. Touch Grass Alignment & Architecture Verification

| Challenge Criterion | Implementation Status | Technical Verification |
| :--- | :---: | :--- |
| **1. OPEN-WEIGHT AI** | Verified Active | Primary `SmolLM2-135M-Instruct` (Apache 2.0), optional `Gemma 2 9B-IT` (Gemma License), with Canopy Net on-device neural fallback (MIT). |
| **2. LOCAL INFERENCE** | Verified Active | Browser WebGPU via `@mlc-ai/web-llm` with zero cloud tokens consumed. |
| **3. OFFLINE CAPABLE** | Verified Active | Operates locally on-device after initial model weight caching. |
| **4. ZERO TELEMETRY LEAKS** | Verified Active | Zero external tracker endpoints or remote AI APIs. Coordinates and queries stay in device RAM. |
| **5. REAL-WORLD OUTDOOR USE** | Verified Active | Tailored for high-altitude backcountry passes with offline topo mapping and survival logic. |
| **6. HANDS-FREE VOICE** | Verified Active | Native Web Speech API synthesis + procedural Web Audio harmonic chimes. |
| **7. REAL SENSOR BRIDGING** | Verified Active | WebSerial sensor streaming with transparent fallback to simulated telemetry. |
| **8. SAFETY SUPREMACY** | Verified Active | Deterministic safety rules hold absolute authority over open-weight outputs. |
| **9. MINIMAL FIELD UI** | Verified Active | High-contrast OLED dark Field Mode designed to get users off the screen and into nature. |
| **10. OPEN INNOVATION** | Verified Active | Cleanly decoupled provider adapter hierarchy under permissive Apache 2.0 and MIT licenses. |

---

## 📜 11. Licensing

- **Canopy Application & Deterministic Engines:** [MIT License](LICENSE)
- **SmolLM2-135M-Instruct Model Weights:** [Apache 2.0 License](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct)
- **Google Gemma 2 (9B-IT) Weights:** [Gemma Open License](https://ai.google.dev/gemma/terms)
