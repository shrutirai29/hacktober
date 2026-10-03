import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Eye, 
  AlertTriangle, 
  Crosshair, 
  Scan,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function ScannerView({ 
  scenarios, 
  currentScenario, 
  onSelectScenario, 
  onCustomImageUpload, 
  highlightedItemId, 
  onHoverItem 
}) {
  const [activePin, setActivePin] = useState(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCustomImageUpload(event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const presetIcons = {
    hostel_desk: "🏫",
    presentation_prep: "💼",
    weekend_home: "🏡"
  };

  return (
    <div className="glass-panel-glow rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
      
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Preset Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-sky-500/20 border border-cyan-500/40 text-cyan-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 tracking-tight">
                <span>Room & Desk Spatial Scanner</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  PaliGemma Vision Live
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pinpoint cables plugged in walls, chargers, and clutter before you zip your bag.
              </p>
            </div>
          </div>
        </div>

        {/* Scene Presets Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {scenarios.map((sc) => {
            const isSelected = currentScenario.id === sc.id;
            const emoji = presetIcons[sc.id] || "📍";
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/30 scale-105 border border-cyan-300/40'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <span>{emoji}</span>
                <span>{sc.title.split(" ")[0]}</span>
              </button>
            );
          })}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-dashed border-cyan-500/40 hover:border-cyan-400 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Upload custom room photo from camera or files"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Main Image Scanner Canvas with Laser Beam and Pins */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800/90 flex items-center justify-center group select-none shadow-2xl">
        
        {/* Background Room Photo / Vector Scene */}
        <img
          src={currentScenario.image}
          alt={currentScenario.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
        />

        {/* Ambient Darkened HUD Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Animated Laser Scan Line (The Computer Vision Effect!) */}
        {isScanningActive && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_3px_rgba(34,211,238,0.7)] pointer-events-none animate-scanline z-10" />
        )}

        {/* Spatial Pins & Bounding Overlays */}
        {showBoundingBoxes && currentScenario.detectedItems?.map((item) => {
          const isHighlighted = highlightedItemId === item.id || activePin === item.id;
          const isCritical = item.pastForgottenCount > 0 || item.warning?.includes("CRITICAL");

          return (
            <div
              key={item.id}
              style={{
                left: `${item.coords?.x || 50}%`,
                top: `${item.coords?.y || 50}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              onMouseEnter={() => {
                setActivePin(item.id);
                onHoverItem?.(item.id);
              }}
              onMouseLeave={() => {
                setActivePin(null);
                onHoverItem?.(null);
              }}
            >
              {/* Sonar Radar Rings */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`absolute w-9 h-9 rounded-full animate-sonar pointer-events-none ${
                    isCritical ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                />
                
                {/* Pin Button */}
                <button
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-300 ${
                    isCritical
                      ? 'bg-gradient-to-tr from-amber-600 to-orange-500 border-white text-slate-950 scale-110 shadow-amber-500/50'
                      : isHighlighted
                      ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 border-white text-white scale-125 shadow-cyan-400/60'
                      : 'bg-slate-900/95 border-cyan-400 text-cyan-400 hover:scale-115 shadow-black/80'
                  }`}
                >
                  {isCritical ? (
                    <AlertTriangle className="w-4 h-4 fill-current text-white drop-shadow" />
                  ) : (
                    <Crosshair className="w-4 h-4 text-cyan-200" />
                  )}
                </button>
              </div>

              {/* Hover Tooltip / Detail Card */}
              {isHighlighted && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-72 glass-panel-glow rounded-2xl p-3.5 shadow-2xl text-left pointer-events-none z-30 transition-all animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-start justify-between gap-1.5 mb-1.5">
                    <span className="font-extrabold text-xs text-white leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 shrink-0">
                      {(item.confidence * 100).toFixed(0)}% Match
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mb-2">
                    <span className="text-slate-400 font-medium">Category:</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-200 font-semibold">{item.category}</span>
                  </div>

                  {item.warning && (
                    <div className="text-[11px] p-2 rounded-xl bg-amber-950/80 border border-amber-600/80 text-amber-200 flex items-start gap-1.5 shadow-inner">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item.warning}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* HUD Overlay Stats (Top Left) */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs shadow-lg">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-200 font-bold">{currentScenario.detectedItems?.length || 0} objects mapped</span>
        </div>

        {/* HUD Controls (Bottom Right) */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
          <button
            onClick={() => setIsScanningActive(!isScanningActive)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              isScanningActive
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600/70 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
          >
            {isScanningActive ? "Laser Scan: ON" : "Laser Scan: OFF"}
          </button>
          
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className="bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-[11px] font-bold text-slate-300 transition-all shadow-sm"
          >
            {showBoundingBoxes ? "Hide Markers" : "Show Markers"}
          </button>
        </div>
      </div>

      {/* Quick Spotted Item Tags (Clickable chips to explore detected items) */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" /> Detected Objects in Room (Hover to inspect on image):
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {currentScenario.detectedItems?.map((item) => {
            const isCritical = item.pastForgottenCount > 0;
            const isHovered = highlightedItemId === item.id;
            return (
              <button
                key={item.id}
                onMouseEnter={() => onHoverItem?.(item.id)}
                onMouseLeave={() => onHoverItem?.(null)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                  isHovered
                    ? 'bg-cyan-500 text-slate-950 border-white shadow-md shadow-cyan-500/30 scale-105'
                    : isCritical
                    ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 hover:border-amber-400'
                    : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isCritical && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
                <span>{item.name.split("(")[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Context Blurb */}
      <div className="flex items-center justify-between text-xs px-3.5 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-slate-400 shadow-inner">
        <div className="flex items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
          <span><strong className="text-white">Active Context:</strong> {currentScenario.notes}</span>
        </div>
      </div>

    </div>
  );
}
