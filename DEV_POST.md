---
title: Touch Grass with Canopy: The Sovereign Offline-First AI Backcountry Guardian & 3D Topo Explorer
published: true
tags: devchallenge, hf26challenge, webgpu, ai
canonical_url: https://github.com/shrutirai29/hacktober
cover_image: https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/hero_terrain_dashboard.jpg
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

Modern outdoor technology suffers from a deep irony: apps designed to help us explore nature often end up trapping us on our screens. Hikers find themselves craning their necks down at battery-hungry maps, refreshing disconnected cloud services, and obsessing over GPS dots instead of immersing themselves in the wilderness. Worse, when hikers venture into remote backcountry areas where cellular signal drops to zero, proprietary cloud apps freeze completely.

**Canopy (Touch Grass / Backcountry Guardian)** is an open-source, 100% sovereign, offline-first backcountry AI companion engineered to help hikers, mountaineers, and nature enthusiasts **safely disconnect from digital distractions and "Touch Grass"**.

<p align="center">
  <img src="https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/hero_terrain_dashboard.jpg" alt="Canopy 3D Terrain & Live Dashboard" width="100%" />
</p>

### Engineered to Get You Off the Screen
Canopy is intentionally built to minimize screen time rather than maximize digital engagement:
* **Pocket Mode & Audio Whispers:** Slide your phone into your jacket or backpack. Canopy runs background environmental monitoring and speaks subtle spatial audio chimes only when safety-critical events occur (e.g., approaching a turnaround deadline or sudden barometric drops).
* **Minimalist OLED Field Mode:** In bright alpine sunlight or extreme battery-saving states, Canopy switches to a pure-black, high-contrast OLED interface displaying only essential telemetry: altitude, pressure delta, temperature, and hard turnaround countdowns.
* **Screen vs. Outdoor Ratio:** Actively measures your trail time versus screen-on time, encouraging a 150× ratio of being present in nature.

<p align="center">
  <img src="https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/field_mode_oled.png" alt="Minimalist OLED Field Mode" width="100%" />
</p>

### Key Wilderness Capabilities
1. **Interactive 3D Digital Twin Himalayan Topography (WebGL/Three.js):** Procedural 3D alpine terrains for legendary routes (Hampta Pass, Kedarnath Summit Ridge, Triund, Chandrashila Peak) with real-time raycasted elevation inspectors, slope hazard gradients, snowpack coverage, and waypoint flythroughs.
2. **On-Device Spectral Bioacoustics:** Real-time Web Audio FFT spectrogram analyzing high-altitude avian calls (Alpine Chough, Himalayan Monal, Snow Partridge, Hermit Thrush) with zero cloud roundtrips.
3. **Microclimate Physics Engine:** Local barometric lapse rate and radiative frost prediction modeling temperature drop per 1,000 m of ascent without requiring internet weather forecasts.
4. **Physical Sensor Bridge (Web Serial API):** Connects directly over USB/Bluetooth to hardware microcontrollers (such as Arduino UNO Q with BME280) for real-time barometric and temperature ingestion.
5. **Deterministic Safety Engine:** A strict guardrail layer that prevents dangerous AI hallucinations—enforcing non-negotiable turnaround curfews, hypothermia warnings, and strictly refusing prescription drug recommendations.

<p align="center">
  <img src="https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/topo_3d_landscape.png" alt="3D Himalayan Topographic Digital Twin" width="100%" />
</p>

---

## Demo

* **Live GitHub Repository:** [https://github.com/shrutirai29/hacktober](https://github.com/shrutirai29/hacktober)
* **Interactive Web App:** [https://shrutirai29.github.io/hacktober/](https://shrutirai29.github.io/hacktober/)
* **Developer Diagnostics:** Visit `/diagnostics` within the app to run the live WebLLM validation contract self-test, verify sensor streams, and inspect the red-team safety suites.

<p align="center">
  <img src="https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/safety_advisor_guidance.png" alt="Safety Advisor Guidance" width="100%" />
</p>

---

## Code

{% github shrutirai29/hacktober %}

The complete project is open source under the MIT License. It contains **zero cloud AI API keys, zero remote tracking scripts, and zero paid subscription gates**.

```bash
# Clone and launch in 3 steps
git clone https://github.com/shrutirai29/hacktober.git
cd hacktober/t2
npm install
npm run dev
```

---

## How I Built It

### The 3-Tier Sovereign AI Fallback Pipeline
In deep mountain valleys, cellular data does not exist. Canopy solves this with a **strictly local, 3-tier sovereign AI architecture**:

```
User Query + Trail Telemetry
           ↓
[Tier 1: WebGPU WebLLM (SmolLM2-135M / Qwen2.5-0.5B)]
     ├─► Success: Instant client-side inference (100% on-device)
     └─► Failure/No WebGPU:
           ↓
     [Tier 2: Localhost Daemon (Ollama / Gemma 2 / Qwen)]
          ├─► Success: Local rugged field tablet / basecamp laptop
          └─► Failure/Unavailable:
                ↓
          [Tier 3: Micro-MLP & Deterministic Safety Engine]
               └─► Guarantees offline, non-crashing safety advice
```

1. **Tier 1 — In-Browser WebGPU WebLLM (`@mlc-ai/web-llm`):** Runs lightweight open-weight models (`SmolLM2-135M-Instruct` or `Qwen2.5-0.5B-Instruct`) compiled to WebAssembly and executed on the client's GPU via WebGPU. Model weights are cached locally in browser CacheStorage.
2. **Tier 2 — Localhost Daemon (Ollama):** Connects via local HTTP loopback (`http://localhost:11434`) to execute open-weight models like `gemma2:2b` or `qwen2.5:0.5b` for field workstations.
3. **Tier 3 — Deterministic Safety Engine & Micro-MLP:** A browser-native fallback that parses telemetry matrices and delivers instantaneous rule-based safety directives even on low-power devices without WebGPU.

<p align="center">
  <img src="https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/sensors_arduino_telemetry.png" alt="Physical Sensor Telemetry Bridge" width="100%" />
</p>

### Safety-First: The Deterministic Guardrail Layer
LLMs are creative, but backcountry safety requires deterministic boundaries. Canopy implements an uncompromised safety layer:
* **Curfew Enforcer:** If the clock passes the turnaround time (e.g., 1:30 PM on Hampta Pass), any model output encouraging further ascent is intercepted and overridden with a mandatory `TURN BACK IMMEDIATELY` directive.
* **Medical Sanitization Protocol:** Strictly strips and blocks prescription drug dosages (e.g., Diamox/Acetazolamide milligrams) and forces conservative hydration, rest, and immediate descent protocols.
* **Telemetry Fabrication Rejection:** If requested to evaluate an unmonitored metric or non-existent sensor, the system refuses to hallucinate data.

### Rigorous Red-Team & Unit Verification
Every capability claimed is backed by automated tests:
* **16 Unit Regression Tests (`npm test`):** Validates the WebLLM self-test contract (`CANOPY_WEBLLM_OK`), adversarial prompt injection neutralization, medical sanitization, and audio FFT edge cases.
* **15 Red-Team Audit Tests (`npm run test:audit`):** Validates the 3-tier fallback chain, 0 cloud API key leak audit across all source files, Vite dev server startup, and extreme environmental inputs (-50°C to +50°C, 0 m to 10,000 m).

<p align="center">
  <img src="https://raw.githubusercontent.com/shrutirai29/hacktober/main/docs/screenshots/developer_diagnostics.png" alt="Developer Diagnostics Suite" width="100%" />
</p>

---

## Why Does Open Innovation Matter?

Open innovation is not just an ideological preference for Canopy—**it is the only architecture that makes wilderness survival AI possible.**

1. **Closed Cloud APIs Fail in the Wild:** If an AI assistant requires an internet connection to reach a cloud server, it is completely useless the second you step off the trailhead. Open-weight models (SmolLM, Gemma, Qwen) allow weights to live directly on personal devices, providing true computational sovereignty.
2. **Safety Must Be Inspectable:** When software provides advice on alpine hypothermia, avalanche hazards, or mountain sickness, proprietary black-box APIs are unacceptable. Open-source development enables open-weight inspection, deterministic guardrail wrapping, and transparent peer auditing.
3. **Privacy and Zero Telemetry Tracking:** The outdoors is where people go for tranquility and privacy. Canopy uses open-source software to ensure that no biometric data, GPS coordinates, or voice audio ever leave your local machine.

---

## My Agent Session

<!-- Optional, but judges love it. Save your session with DevRelay and embed it with the agent_session tag (see the challenge page), or link to it. -->
During development, the entire iterative engineering loop—implementing the WebGPU WebLLM provider, Three.js Himalayan topographic math, deterministic red-team suites, and automated validation tests—was completed with pair-programming assistance. Full audit logs and automated test reports are open and verifiable in the repository under `/scripts`.

---

## Prize Categories

* **Main Challenge:** Open-Source AI Challenge Week 1: Touch Grass
* **Best Use of Open-Weight Models:** SmolLM2 / Gemma 2 via WebGPU and local Ollama inference
* **Edge & On-Device AI:** 100% in-browser WebGPU WebLLM execution with zero network dependency
* **Responsible & Safe AI:** Open-weight LLMs wrapped in deterministic safety and medical guardrails
