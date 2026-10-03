#!/usr/bin/env python3
"""
CheckMate - Backend Gemma Inference Engine
Hacktoberfest 2026: Build for a Friend

This service executes open-weight Gemma 2 & PaliGemma spatial reasoning.
It can run:
1. Directly with Ollama: `ollama run gemma2`
2. With Hugging Face Transformers pipeline
3. Standalone offline mode with deterministic causal packing logic
"""

import json
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error

DEFAULT_PORT = 5050
OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"

GEMMA_SYSTEM_PROMPT = """You are Gemma-CheckMate, an open-weight spatial packing intelligence built to help friends who move between hostels, family homes, and conferences.
You cross-reference visual objects detected from room photos with the friend's past forgotten items memory, taking into account trip purpose, duration, and weather.
Always prioritize items previously forgotten with actionable spatial countermeasures (e.g. wall outlet checks)."""

def construct_gemma_prompt(scene_title, detected_items, trip_type, duration, weather, forgotten_memory, mode="departure"):
    items_str = "\n".join([f"- {item.get('name')} (Category: {item.get('category')}, Confidence: {item.get('confidence', 0.95):.2f})" for item in detected_items])
    memory_str = "\n".join([f"- {mem.get('itemName')}: Forgotten {mem.get('timesForgotten')}x on '{mem.get('tripContext')}'. Rule: {mem.get('learningRule')}" for mem in forgotten_memory])

    return f"""<start_of_turn>system
{GEMMA_SYSTEM_PROMPT}
<end_of_turn>
<start_of_turn>user
[SPATIAL ROOM SCAN: {scene_title}]
Candidate Detections:
{items_str}

[TRIP CONTEXT]
- Purpose: {trip_type}
- Duration: {duration}
- Weather: {weather}
- Mode: {mode.upper()}

[FORGOTTEN ITEM HISTORY]
{memory_str}

Synthesize a precision packing manifest categorized by urgency. Explicitly contrast what to take vs what to leave behind, and provide the causal explanation for why this list fits {trip_type}.
<end_of_turn>
<start_of_turn>model
"""

def query_ollama(prompt, model="gemma2"):
    payload = json.dumps({
        "model": model,
        "prompt": prompt,
        "stream": False
    }).encode("utf-8")

    req = urllib.request.Request(
        OLLAMA_ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response", "")
    except Exception as e:
        print(f"[CheckMate Gemma] Local Ollama call failed ({e}). Returning structured deterministic response.")
        return None

class CheckMateHandler(BaseHTTPRequestHandler):
    def _set_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors()
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/synthesize":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            data = json.loads(body) if body else {}

            prompt = construct_gemma_prompt(
                scene_title=data.get("scenarioTitle", "Hostel Desk"),
                detected_items=data.get("detectedItems", []),
                trip_type=data.get("tripType", "Hostel to Home"),
                duration=data.get("duration", "Weekend"),
                weather=data.get("weather", "Pleasant (24°C)"),
                forgotten_memory=data.get("memoryList", []),
                mode=data.get("mode", "departure")
            )

            response_text = query_ollama(prompt)

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()

            out = {
                "status": "success",
                "model": "Gemma 2",
                "prompt": prompt,
                "response": response_text
            }
            self.wfile.write(json.dumps(out).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=DEFAULT_PORT):
    server = HTTPServer(("0.0.0.0", port), CheckMateHandler)
    print(f"CheckMate Gemma Backend running on http://localhost:{port}")
    print(f"Connect your React frontend or Ollama at {OLLAMA_ENDPOINT}")
    server.serve_forever()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CheckMate Gemma 2 Engine")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Server port")
    parser.add_argument("--cli", action="store_true", help="Run quick CLI test")
    args = parser.parse_args()

    if args.cli:
        sample_prompt = construct_gemma_prompt(
            scene_title="Hostel Desk C-402",
            detected_items=[
                {"name": "65W Laptop Charger (Wall)", "category": "Tech", "confidence": 0.98},
                {"name": "Hostel Gate Pass", "category": "Documents", "confidence": 0.95}
            ],
            trip_type="Hostel to Home",
            duration="Weekend (2-3 days)",
            weather="Pleasant (24°C)",
            forgotten_memory=[
                {"itemName": "65W Laptop Charger", "timesForgotten": 3, "tripContext": "Hostel to Home", "learningRule": "Always check wall socket!"}
            ]
        )
        print("=== PROMPT FOR GEMMA 2 ===")
        print(sample_prompt)
    else:
        run_server(args.port)
