# 🎒 CheckMate — Nothing Gets Left Behind

> **Hacktoberfest 2026 Weekend Challenge: Build for a Friend**  
> An open-source spatial packing companion built with **Gemma 2**, **PaliGemma**, and **ElevenLabs**.

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-ff7849.svg)](https://hacktoberfest.com/)
[![Built with Gemma](https://img.shields.io/badge/Model-Gemma%202%20%2F%20PaliGemma-4285F4.svg)](https://ai.google.dev/gemma)
[![Voice by ElevenLabs](https://img.shields.io/badge/Voice-ElevenLabs-black.svg)](https://elevenlabs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 💡 The Story
Built for **Alex**, a university student who constantly travels between the college hostel, trips back home, and stage presentations — and notoriously forgets essential items (like the laptop charger plugged into the wall behind the desk or the HDMI adapter needed for stage slides).

CheckMate replaces generic checklists with an **open-weight vision and reasoning system**:
1. **Scans photos of the room/desk** to pinpoint objects and cables plugged into wall outlets.
2. **Synthesizes personalized manifests** based on trip purpose, weather, and duration.
3. **Learns from forgotten items** over time, escalating repeated mistakes into high-priority alerts with spatial checks.
4. **Voice Exit Coach:** Speaks out audio warnings before zipping the luggage.

---

## ✨ Features

- 📸 **Room & Desk Spatial Scanner:** Overlays detected object pins and bounding coordinates directly on room photos.
- 🧠 **Open-Weight Gemma Reasoning:** Uses Gemma 2 turn formatting to evaluate failure modes, prune clutter, and ground decisions in visual context.
- 🔁 **The Memory Learning Loop:** Persistent memory vault of past forgotten items, auto-generating active countermeasures.
- ⚡ **Side-by-Side Comparison Demo:** Instant 1-click comparison between *"Weekend at Home"* and *"College Presentation"*, with Gemma explaining the causal differences.
- 🎙️ **Voice Exit Nudge:** Spoken audio briefing via ElevenLabs or offline Web Speech API.
- 🔒 **100% Privacy & Offline Capable:** Runs entirely locally with zero cloud API token costs and zero room photos sent to external servers.

---

## 🚀 Quick Start

### 1. Frontend (Vite + React + Tailwind CSS)
```bash
# Clone the repository
git clone https://github.com/shrut/friendly-hopper.git
cd friendly-hopper

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Optional: Local Gemma 2 Backend (Ollama)
If you wish to run with a live local Gemma 2 model via Ollama:
```bash
# 1. Pull Gemma 2 in Ollama
ollama run gemma2

# 2. Start the CheckMate Python bridge
python backend/gemma_engine.py
```

---

## 🏆 Hacktoberfest Prize Categories Targeted

- 🌟 **Best Use of Gemma ($200):** Built from the ground up around Google's Gemma 2 and PaliGemma open weights.
- 🎙️ **Best Use of ElevenLabs ($100):** Natural spoken exit briefings warning users of forgotten items.
- 🏅 **Overall Winner ($250):** Authentic, high-impact friend project with open-source AI at its core.

---

## 📄 License
MIT License. Built for Hacktoberfest 2026.
