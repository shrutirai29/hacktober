import React, { useRef } from 'react';
import { 
  Compass, 
  Upload, 
  Camera, 
  MoreHorizontal, 
  Maximize2, 
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function YourSpaceCard({
  scenarios,
  currentScenario,
  onSelectScenario,
  onCustomImageUpload,
  highlightedItemId,
  onHoverItem
}) {
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

  // Detected bounding box overlays matching the design
  const boundingBoxes = [
    {
      id: "wall_charger",
      name: "Wall Charger",
      conf: "94%",
      color: "border-rose-400 text-rose-600 bg-rose-50/90",
      pillColor: "bg-rose-50 text-rose-700 border-rose-300",
      top: "22%",
      left: "29%",
      width: "60px",
      height: "45px"
    },
    {
      id: "laptop",
      name: "Laptop",
      conf: "98%",
      color: "border-purple-400 text-purple-600 bg-purple-50/90",
      pillColor: "bg-purple-50 text-purple-700 border-purple-300",
      top: "43%",
      left: "40%",
      width: "140px",
      height: "90px"
    },
    {
      id: "powerbank",
      name: "Powerbank",
      conf: "89%",
      color: "border-amber-400 text-amber-700 bg-amber-50/90",
      pillColor: "bg-amber-50 text-amber-800 border-amber-300",
      top: "51%",
      left: "25%",
      width: "80px",
      height: "45px"
    },
    {
      id: "earbuds",
      name: "Earbuds",
      conf: "87%",
      color: "border-emerald-400 text-emerald-700 bg-emerald-50/90",
      pillColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
      top: "56%",
      left: "35%",
      width: "45px",
      height: "38px"
    },
    {
      id: "id_card",
      name: "ID Card",
      conf: "90%",
      color: "border-amber-400 text-amber-700 bg-amber-50/90",
      pillColor: "bg-amber-50 text-amber-800 border-amber-300",
      top: "60%",
      left: "49%",
      width: "65px",
      height: "55px"
    },
    {
      id: "water_bottle",
      name: "Water Bottle",
      conf: "91%",
      color: "border-sky-400 text-sky-700 bg-sky-50/90",
      pillColor: "bg-sky-50 text-sky-800 border-sky-300",
      top: "43%",
      left: "53%",
      width: "48px",
      height: "110px"
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#ede7dd] shadow-sm flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#6366f1] flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#1e1b4b]">
              Your Space
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Scan your room or upload a photo to detect items
            </p>
          </div>
        </div>

        {/* Action buttons on top right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#d8d2c7] text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span>Scan with Camera</span>
          </button>

          <button className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <MoreHorizontal className="w-4 h-4" />
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

      {/* Main Image Viewer */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-[#e5ded4] aspect-[16/10] sm:aspect-[16/9.5] group select-none shadow-sm">
        
        {/* Background Desk Image */}
        <img
          src="/assets/desk_scene.jpg"
          alt="Hostel Study Desk"
          className="w-full h-full object-cover object-center"
        />

        {/* Top-Left Scene Dropdown */}
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <span>Hostel Room (Study Desk)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Top-Right Expand Button */}
        <div className="absolute top-3 right-3 z-20">
          <button className="p-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bounding Box Labels (Interactive) */}
        {boundingBoxes.map((b) => (
          <div
            key={b.id}
            style={{
              top: b.top,
              left: b.left
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
            onMouseEnter={() => onHoverItem?.(b.id)}
            onMouseLeave={() => onHoverItem?.(null)}
          >
            {/* Pill Tag */}
            <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-black shadow-md backdrop-blur-sm flex items-center gap-1 ${b.pillColor}`}>
              <span>{b.name}</span>
              <span className="opacity-80 font-mono text-[9px]">{b.conf}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Detected Item Carousel Strip */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#f2ede4]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            6 items detected
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {["Powerbank", "ID Pass", "Earbuds", "Charger", "Laptop", "Flask"].map((name, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#e5decb] flex items-center justify-center text-xs font-bold text-slate-600 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                title={name}
              >
                {idx === 0 && "🔋"}
                {idx === 1 && "🪪"}
                {idx === 2 && "🎧"}
                {idx === 3 && "🔌"}
                {idx === 4 && "💻"}
                {idx === 5 && "🍶"}
              </div>
            ))}
          </div>
        </div>

        <button className="text-xs font-bold text-[#6366f1] hover:text-[#4f46e5] flex items-center gap-1 shrink-0">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
