import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Eye, 
  AlertTriangle, 
  Sparkles, 
  Crosshair, 
  Maximize2,
  RefreshCw,
  Info
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

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
      
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-sky-400" />
              Room & Desk Spatial Scanner
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              Open Vision (PaliGemma)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify candidate objects, cables plugged into walls, and clutter before you leave.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {scenarios.map((sc) => {
            const isSelected = currentScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {sc.title.split(" ")[0]} {sc.title.split(" ")[1]}
              </button>
            );
          })}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-dashed border-slate-600 text-xs font-medium transition-all"
            title="Upload custom room/desk photo"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
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

      {/* Main Image Canvas with Spatial Pins */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group select-none">
        
        {/* Background Room Photo / SVG */}
        <img
          src={currentScenario.image}
          alt={currentScenario.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />

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
              {/* Pin indicator */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`absolute w-8 h-8 rounded-full animate-ping opacity-75 ${
                    isCritical ? 'bg-amber-500' : 'bg-sky-400'
                  }`}
                />
                <button
                  className={`relative w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform ${
                    isCritical
                      ? 'bg-amber-500 border-white text-slate-950 scale-110'
                      : isHighlighted
                      ? 'bg-sky-500 border-white text-white scale-125'
                      : 'bg-slate-900/90 border-sky-400 text-sky-400 hover:scale-110'
                  }`}
                >
                  {isCritical ? (
                    <AlertTriangle className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Hover Tooltip / Detail Card */}
              {isHighlighted && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-9 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-2.5 shadow-2xl text-left pointer-events-none z-30 transition-all">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-white leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 block mb-1">
                    Category: <span className="text-slate-300">{item.category}</span>
                  </span>

                  {item.warning && (
                    <div className="text-[10px] p-1.5 rounded bg-amber-950/70 border border-amber-800/80 text-amber-200 flex items-start gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.warning}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Vision Scan Controls Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-300 font-medium">{currentScenario.detectedItems?.length || 0} objects mapped</span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className="bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700 text-[11px] font-medium text-slate-300 transition-all"
          >
            {showBoundingBoxes ? "Hide Markers" : "Show Markers"}
          </button>
        </div>
      </div>

      {/* Scenario Context Blurb */}
      <div className="flex items-center justify-between text-xs px-2 py-1 bg-slate-950/60 rounded-lg border border-slate-800/60 text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span><strong className="text-slate-200">Current Scene:</strong> {currentScenario.notes}</span>
        </div>
      </div>

    </div>
  );
}
