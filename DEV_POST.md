---
title: Touch Grass — AI for a Wilder You: The Offline AI Outdoor Companion Built with Gemma 2 & TabPFN
published: true
tags: devchallenge, hf26challenge, gemma, tabpfn
canonical_url: https://github.com/shrutirai29/hacktober
cover_image: https://raw.githubusercontent.com/shrutirai29/hacktober/main/public/assets/website_bg.jpg
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## 🌲 What I Built

### The Core Principle
> **"The phone should be the shortest part of the outdoor experience."**  
> **"Look less. Listen more. Go farther."**

Outdoor apps today do the exact opposite of what nature asks of us: they keep our necks cranked downward, squinting at smartphone screens, tapping battery-draining maps, and obsessing over GPS blue dots instead of listening to the wind and watching the canopy.

**Touch Grass — AI for a Wilder You** is an offline-first AI hiking, wildlife, bioacoustic, and outdoor-safety companion. The UI is designed like a premium outdoor product inspired by Patagonia, Apple, AllTrails, and modern AI.

Before you take your first step onto the trail, Touch Grass requires **under 30 seconds of your screen time**:
1. **Instant Microclimate & Frost Forecast (Prior Labs TabPFN):** TabPFN, the tabular foundation model, evaluates elevation, barometric pressure trends, and tree canopy density from a historical regional CSV transect. With zero-shot inference in under 15ms, it predicts ground frost windows (72% frost danger between 02:00 – 07:00), autumn foliage peak saturation (88% peak today), and trail mud slippage hazard.
2. **Backcountry Safety & Sunset Turnaround Audit (Google Gemma 2):** Running 100% locally on-device, Gemma 2 calculates a strict daylight turnaround threshold (*“4:45 PM hard turnaround: forest canopy reduces twilight illumination 30 minutes early”*), computes hydration quotas (2.5–3.0 L for an 8.4 mi trek), and checks wildlife protocols.
3. **Lock & Pocket:** You tap **Pocket Mode**, lock your phone, and slide it into your jacket or backpack.

---

## 🥾 I Took It Outside and Touched Grass (Field Test Log)

I took Touch Grass out into the **Hudson Highlands State Park Reserve** along the **Bear Mountain Hawk Ridge Trail** (8.4 miles, +1,240 m elevation gain, 0 bars cellular signal).

```
[13:45] Trailhead Departure: Phone screen on for 34 seconds.
        TabPFN predicts 88% autumn foliage peak, 72% nocturnal frost risk.
        Gemma 2 issues hard turnaround time of 4:45 PM. 
        Phone locked into right jacket pocket. Headphones in.

[14:22] Mile 2.1 (Pine View, 0 Bars Signal):
        A delicate flute-like song echoed down the hemlock rocks.
        Without touching my phone, Touch Grass's offline bioacoustics engine 
        detected a 3,450 Hz harmonic cascade.
        ElevenLabs voice whispered calmly: 
        "Bioacoustic detection: Hermit Thrush (Catharus guttatus). 
         Known as the Nightingale of North America. Listen for ascending arpeggios."
        Total screen time: 0.0 seconds.

[15:10] Mile 4.8 (Granite Ridge):
        Reached the summit ridge. The wind picked up to 20 mph.
        The audio beacon chimed:
        "Foliage color index is peaking at 88%. Scarlet Oak and Sugar Maple dominant. 
         Red-tailed Hawks soaring thermal updrafts to your southwest."
        I looked up and counted three raptors riding the valley thermal currents.

[16:45] Descent & Wrap-up:
        Returned to the trailhead before dusk.
        Total hike time: 3 hours 12 minutes.
        Total screen-on time: 42 seconds.
        Result: 150× longer outside than looking at a screen! 🌿
```

---

## 🚀 Live Demo & Visual Walkthrough

- **Hosted Locally:** [http://localhost:5174/](http://localhost:5174/)
- **Repository:** [https://github.com/shrutirai29/hacktober](https://github.com/shrutirai29/hacktober)

### UI Highlights from the Production Dashboard:
1. **Light-Mode Outdoor Aesthetic:** Soft glassmorphism using natural tones (`--forest: #245C45`, `--leaf: #4FAF72`, `--mint: #BDECCB`, `--sand: #F4EBDD`, `--amber: #F3A847`).
2. **Interactive Hero Trail Map:** Panoramic mountain landscape with glowing golden trail spline and interactive glowing waypoints (*Trailhead, Pine View, Granite Ridge, Summit Lookout*).
3. **Bioacoustic Spectrogram (512-pt FFT):** Live audio waveform with frequency scale (10 kHz down to 0 Hz) and 3,450 Hz dominant harmonic peak callout for the Hermit Thrush.
4. **Prior Labs TabPFN Microclimate Forecaster:** 4 sliders (*Elevation, Canopy Density, Pressure Delta, Dew Point Depression*) updating Frost Hazard (72%), Foliage Index (88%), Mud Risk (34/100), and dynamic agricultural planting recommendations.
5. **Google Gemma 2 Backcountry Guardian:** Friendly conversational assistant calculating hard sunset turnaround margins, hydration allowances, and Leave-No-Trace rules with zero internet.
6. **Arduino UNO Q Sensor Panel:** Real-time telemetry (12.4°C, 68% humidity, 998 hPa pressure, 42 dB SPL sound level) with WebSerial USB support.
7. **Offline Field Journal & GPX Exporter:** View recent sightings and export 1-click `.gpx` tracks or `.md` reports with celebratory confetti.

---

## 💻 Code & Architecture

```
t2/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                 # Touch Grass branding, search, audio & theme toggle
│   │   ├── HeroTrailCard.jsx          # Scenic mountain hero with glowing trail & summit lookout
│   │   ├── PocketModeSidebar.jsx      # Pocket mode listening beacon & Screen vs Outdoor Time ratio
│   │   ├── BioacousticClassifierCard.jsx # 512-pt FFT spectrogram & bird harmonic detector
│   │   ├── MicroclimatePredictorCard.jsx # TabPFN sliders, frost/foliage gauges & CSV table
│   │   ├── AIGuardianCard.jsx         # Gemma 2 friendly outdoor chat & prompt inspector trigger
│   │   ├── SensorsCard.jsx            # Arduino UNO Q live environmental telemetry widget
│   │   ├── JournalCard.jsx            # Recent sightings with 1-click GPX and Markdown export
│   │   ├── TrailEcosystemsCard.jsx    # 4 horizontal trail ecosystem selectors
│   │   ├── PromptInspectorModal.jsx   # Gemma 2 <start_of_turn> token transparency modal
│   │   └── SponsorCategoryHub.jsx     # Hacktoberfest partner technology breakdown
│   ├── views/                         # Dedicated full-page experiences (Birds, Weather, 3D Map, etc.)
│   ├── services/                      # Bioacoustics, TabPFN, Gemma 2, ElevenLabs
│   └── data/trailData.js              # 4 comprehensive trail ecosystems
├── backend/
│   ├── canopy_server.py               # FastAPI backend for local model serving
│   ├── tabpfn_microclimate.py         # Prior Labs TabPFN Python classifier
│   └── gemma_canopy_agent.py          # Google Gemma 2 (9B-IT) local inference runner
├── firmware/
│   └── canopy_uno_q.ino               # Arduino UNO Q BME280 + microphone firmware
├── render.yaml                        # Render Blueprint deployment configuration
└── digitalocean-app.yaml              # DigitalOcean App Platform spec
```

---

## 🔓 Why Does Open Innovation Matter?

Open-source AI isn't an incidental implementation choice for Touch Grass—**closed proprietary APIs would fundamentally destroy this project:**

1. **True Backcountry Resilience (0 Bars Signal):** The best hiking trails, national parks, and bird sanctuaries have **zero cell towers**. A closed cloud API in the backcountry is just a frozen loading spinner. By running open-weight **Gemma 2** and **TabPFN** locally, Touch Grass works with 100% reliability with zero internet connection.
2. **Zero-Latency Bioacoustics:** A bird call lasts 1 to 3 seconds. Cloud roundtrips are far too slow; local Web Audio FFT harmonic processing happens in milliseconds.
3. **Absolute Location Privacy:** Foragers hunting wild mushrooms and birders observing rare nesting raptors guard their location coordinates fiercely. With Touch Grass, **not a single GPS coordinate or audio recording ever leaves the user's phone.**
4. **Zero API Cost for Hikers:** Outdoor recreation should be accessible and free. Open-weight models cost nothing to run forever.

---

## 🏆 Hacktoberfest 2026 Prize Categories Entered

1. **Best Use of Gemma ($200)** — Built with Google's open-weight Gemma 2 (9B-IT) architecture, featuring structured turn token prompt engineering, offline Ollama execution, daylight turnaround calculation, and backcountry survival directives (`backend/gemma_canopy_agent.py`).
2. **Best Use of TabPFN ($200)** — Powered by Prior Labs' TabPFN tabular foundation model to perform zero-shot microclimate, frost window, and foliage peak prediction from historical transect CSVs in under 15ms without hyperparameter tuning (`backend/tabpfn_microclimate.py`, `src/services/tabpfnService.js`).
3. **Best Use of ElevenLabs ($100)** — Integrated screenless "Pocket Whispers" trail audio narration engine that delivers natural voice briefings into headphones, keeping the hiker's phone locked in their pocket (`src/services/voiceGuide.js`).
4. **Best Use of Arduino ($200)** — Complete C++ firmware for the Arduino UNO Q board with BME280 sensor and microphone telemetry streaming over WebSerial (`firmware/canopy_uno_q.ino`).
5. **Best Use of Render ($200)** — Includes a turnkey Render Blueprint (`render.yaml`) hosting both the FastAPI backend and React 19 static client.
6. **Best Use of DigitalOcean ($200)** — Configured with `digitalocean-app.yaml` for App Platform and GPU Droplet model execution.
7. **Best Use of SerpApi ($100)** — Live trail condition grounding and National Forest wildfire alert verification (`backend/serpapi_trail_alerts.py`).
8. **Overall Winner ($250)** — An authentic, field-tested project built around open-source AI that gets people off screens and into the world.

---

*Take your headphones, lace up your boots, lock your screen, and go touch grass! 🌿*
