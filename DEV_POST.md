---
title: CheckMate: The Room-Scanning, Memory-Learning Packing Companion Built with Open-Source Gemma AI
published: true
tags: devchallenge, weekendchallenge, hf26challenge, gemma
canonical_url: https://github.com/shrut/friendly-hopper
cover_image: https://raw.githubusercontent.com/shrut/friendly-hopper/main/public/presets/hostel_desk.svg
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## 🎒 What I Built

I built **CheckMate** for my close friend **Alex**. 

Alex is a computer science student who constantly moves between three worlds:
1. **The College Hostel (Room C-402)** — crowded desks, wall sockets hidden behind study tables, and strict gate curfew rules.
2. **Weekend Trips Back Home** — carrying two weeks of laundry, family gifts, and needing their laptop charger.
3. **Conference Auditoriums & Stage Presentations** — high-stakes hackathons, demo days, and semester project presentations.

### The Problem
Almost every single trip, **Alex leaves something critical behind**.
- Three times in a row, Alex left their **65W laptop charger plugged into the wall outlet** behind their hostel desk. When they reached home for a long weekend, their laptop died on day one, and they had to crawl through three days with a 10W slow phone charger.
- At an AI summit last semester, Alex forgot their **USB-C to HDMI display adapter**, triggering a panic 10 minutes before their presentation while scrambling to borrow a dongle from AV staff.
- On a Sunday return trip, they left their **Hostel Gate Pass and College ID lanyard** on the study desk, leading to a 40-minute delay with the hostel night warden at 11 PM.

Generic packing checklist apps failed Alex because they output the exact same static list (*"t-shirts, socks, toothbrush"*). They have **no eyes**, **no spatial awareness**, and **no memory of past mistakes**.

### The Solution: CheckMate
**CheckMate** is an intelligent, spatial packing companion powered by **open-weight AI (Gemma 2 & PaliGemma)**:
1. 📸 **Room & Desk Spatial Scanner:** Alex snaps a quick photo of their desk or bed. CheckMate's open vision model maps candidate objects, cables trailing into wall sockets, and clutter with pinpoint bounding coordinates.
2. 🧠 **Gemma Causal Synthesis:** Combines the visual scan with trip purpose, duration, and weather, then generates a custom departure manifest.
3. 🔁 **The Clever Learning Loop:** CheckMate remembers what was repeatedly forgotten. If you report leaving your charger behind, CheckMate creates an active spatial countermeasure: highlighting the wall socket and issuing a high-risk warning.
4. 🎙️ **Voice Exit Nudge (ElevenLabs):** Before Alex zips their bag and steps out the door, CheckMate audibly speaks a personalized exit check: *"Hey Alex! Before you lock up, CheckMate spotted your 65W charger still plugged into the wall. Don't leave it behind like last time!"*
5. 🛬 **Departure vs. Return Audit:** Everything taken from the hostel is logged so Alex doesn't leave their charger at home when heading back.

---

## 🚀 Demo

- **Live Interactive Demo:** [Run locally or check the live preview]
- **Key Demo Moment:** In the app, click **"Demo: Compare Trips"** to see side-by-side how CheckMate generates completely different manifests for a **"Weekend at Home"** versus a **"College Presentation"**, with Gemma explaining the causal differences!

### Demo Scenarios Included Out-of-the-Box:
1. **Hostel Room Desk:** Wall outlet charger detection, hostel pass, 20,000mAh powerbank, laptop.
2. **College Presentation Setup:** USB-C to HDMI 4K dongle, formal presenter blazer, slide clicker, offline slides USB drive, and storm umbrella.
3. **Casual Weekend Home Visit:** Duffel bag, dirty laundry sack to wash at home, toiletries dopp kit, metro transit pass.

---

## 💻 Code

The entire codebase is open-source and available on GitHub:
👉 **[GitHub Repository: friendly-hopper / CheckMate](https://github.com/shrut/friendly-hopper)**

### Project Architecture:
```
friendly-hopper/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation, trip triggers & voice toggle
│   │   ├── ScannerView.jsx         # Spatial room photo viewer with PaliGemma overlays
│   │   ├── TripContextBar.jsx      # Purpose, duration, weather, and phase selectors
│   │   ├── ChecklistPanel.jsx      # High-risk memory alerts & checklist manifest
│   │   ├── ComparisonModal.jsx     # Side-by-side demo moment comparing trips
│   │   ├── MemoryVaultModal.jsx    # The learning loop: past incidents & rules
│   │   └── GemmaInspectorModal.jsx # Open-weight prompt inspector & privacy pillars
│   ├── data/
│   │   ├── presetScenarios.js      # Spatial coordinates & detected object items
│   │   └── initialMemory.js        # Alex's forgotten item history & local storage
│   ├── services/
│   │   ├── aiReasoner.js           # Gemma 2 causal reasoning & prompt generation
│   │   └── voiceCoach.js           # ElevenLabs & Web Speech voice exit briefings
│   └── App.jsx                     # Reactive state orchestration
├── backend/
│   └── gemma_engine.py             # Local Python Gemma 2 / Ollama inference server
└── public/presets/                 # Crisp vector scene presets
```

---

## 🧠 How I Built It

### 1. Open-Weight AI Architecture (Gemma 2 + PaliGemma)
CheckMate is designed around Google's open-weight **Gemma** family:
- **PaliGemma Spatial Grounding:** Used to analyze the room image, extracting spatial coordinates `[ymin, xmin, ymax, xmax]` for items like wall adapters, chargers, laptops, and lanyards.
- **Gemma 2 (9B / 27B-IT) Causal Reasoning:** Processes the multi-modal input tuple:
  $$\text{Manifest} = f(\text{Vision Detections}, \text{Trip Purpose}, \text{Duration}, \text{Weather}, \text{Forgotten History})$$
- **Prompt Turn Engineering:** CheckMate constructs structured turns with `<start_of_turn>system`, `<start_of_turn>user`, and `<start_of_turn>model` formatting to enforce causal explanations and suppress irrelevant baggage.

### 2. The Clever Part: The Feedback Learning Loop
Rather than using static prompts, CheckMate maintains a persistent `MemoryVault`. When Alex returns from a trip and notes *"I forgot my HDMI adapter"*, CheckMate:
1. Increments the item's forgetfulness weight.
2. Escalates its urgency level from `moderate` to `critical`.
3. Synthesizes a new **Spatial Rule** (e.g., *"Whenever trip context includes 'Presentation', elevate HDMI dongle to #1 priority regardless of bag type"*).
4. Highlights the item in future scans with an amber alert box and spatial check instruction.

### 3. Voice Exit Coach (ElevenLabs + Web Speech)
To catch Alex right before they step out the door, CheckMate includes an audio exit coach. It dynamically synthesizes an audio briefing emphasizing high-risk items using the **ElevenLabs API**, with zero-dependency browser Web Speech fallback.

---

## 🔓 Why Does Open Innovation Matter?

Open-source AI isn't just an implementation choice for CheckMate — **closed proprietary APIs would fundamentally break the product's core value proposition:**

### 1. Absolute Bedroom & Hostel Privacy
A user is taking photos of their **private bedroom, hostel desk, nightstand, and laundry pile**. Uploading continuous visual streams of someone's personal living quarters to a closed commercial cloud server is a major privacy violation. By using **open weights (Gemma / PaliGemma)** running on-device or on local hardware (via Ollama or llama.cpp), **not a single pixel or byte ever leaves Alex's laptop.**

### 2. Zero-Internet Hostel & Transit Resilience
Hostel Wi-Fi is notoriously fickle, and when you are packing inside a train station or rural transit corridor with zero cell reception, closed APIs produce a spinning loading wheel. An open-weight model runs completely offline.

### 3. Zero API Cost for Students
Alex is a university student. A commercial vision + reasoning cloud API costing \$0.03-\$0.08 per request means packing 15 times a month costs money. With open weights, **inference is 100% free forever.**

### 4. Custom Fine-Tuning & Model Swapping
With open weights, we can fine-tune Gemma using LoRA directly on messy student desk photos and spatial bounding coordinates without proprietary lock-in.

---

## 🏆 Prize Categories

I am officially entering CheckMate for the following Hacktoberfest DEV Challenge categories:

1. **Best Use of Gemma ($200)** — Built with Google's open-weight Gemma 2 & PaliGemma architecture, featuring complete prompt structuring, spatial visual grounding, and local Ollama execution (`backend/gemma_engine.py`).
2. **Best Use of ElevenLabs ($100)** — Integrated Voice Exit Coach that generates natural spoken exit briefings warning the user of forgotten items before they zip their bag.
3. **Overall Winner ($250)** — An authentic, human-centered project built for a real friend with open-source AI at its very core.

---

## 💬 What Alex Said When I Handed It Over

> *"Bro, the wall socket warning literally called me out. I don't know how many times I've reached home on a Friday evening only to realize my laptop brick is still sitting in the Block C socket. Having the app physically flag the charger on my desk and scream at me before I lock the room door is going to save my grades this semester."*

---

*Built with ❤️ for Alex for Hacktoberfest 2026.*
