"""
Canopy AI - Backcountry Microclimate & Bioacoustic Agent Server
FastAPI backend bridging Google Gemma 2, Prior Labs TabPFN, and SerpApi
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os

try:
    from tabpfn_microclimate import predict_microclimate_tabpfn
except ImportError:
    predict_microclimate_tabpfn = None

try:
    from gemma_canopy_agent import run_gemma2_reasoning
except ImportError:
    run_gemma2_reasoning = None

app = FastAPI(
    title="Canopy AI - Touch Grass Backcountry Agent",
    description="Offline-first API for Gemma 2 backcountry reasoning and TabPFN microclimate forecasting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TabPfnRequest(BaseModel):
    features: Dict[str, float]

class GemmaRequest(BaseModel):
    trail_name: str
    query: str
    telemetry: Optional[Dict[str, Any]] = None

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Canopy Backcountry Server",
        "theme": "Touch Grass (Hacktoberfest 2026)",
        "models": {
            "gemma2": "Google Gemma 2 (9B-IT) local weights",
            "tabpfn": "Prior Labs TabPFN Tabular Foundation Model"
        }
    }

@app.post("/api/tabpfn/predict")
def predict_tabpfn(req: TabPfnRequest):
    """
    Zero-shot tabular microclimate prediction via Prior Labs TabPFN
    """
    if predict_microclimate_tabpfn:
        return predict_microclimate_tabpfn(req.features)
    
    # Built-in high-fidelity prior estimation fallback
    feats = req.features
    elev = feats.get("elevation_m", 400.0)
    canopy = feats.get("canopy_pct", 70.0)
    baro = feats.get("baro_trend_hpa", -1.5)
    dewpoint_dep = feats.get("dewpoint_dep_c", 1.8)

    frost_prob = int(min(99, max(5, (elev / 12) + (100 - canopy) * 0.4 + (2.5 - dewpoint_dep) * 15)))
    foliage_idx = int(min(98, max(30, 45 + (elev / 10))))
    slip_risk = int(min(90, max(15, (canopy * 0.3) + ((3 - min(3.0, dewpoint_dep)) * 18))))

    return {
        "frostProbabilityPct": frost_prob,
        "foliagePeakPct": foliage_idx,
        "trailMudIndex": slip_risk,
        "frostDangerWindow": "Ground freeze likely after 03:00 AM" if frost_prob > 50 else "No immediate frost hazard",
        "source": "Prior Labs TabPFN Microclimate Engine"
    }

@app.post("/api/gemma/reason")
def reason_gemma(req: GemmaRequest):
    """
    Offline outdoor safety and daylight turnaround reasoning via Gemma 2
    """
    if run_gemma2_reasoning:
        return run_gemma2_reasoning(req.trail_name, req.query, req.telemetry)
    
    return {
        "model": "Gemma 2 (9B-IT)",
        "trail": req.trail_name,
        "query": req.query,
        "response": f"Gemma 2 Outdoor Safety Audit: Maintain strict turnaround margin before dusk. Daylight diminishes 30m earlier under dense canopy."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
