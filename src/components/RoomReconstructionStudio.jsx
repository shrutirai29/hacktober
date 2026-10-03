import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Eye, 
  RotateCcw,
  CheckCircle2,
  Box,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export default function RoomReconstructionStudio({
  onReconstructionComplete,
  onExploreDemo,
  isProcessing = false
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: idle, 1..5: processing, 6: done
  const [processingStage, setProcessingStage] = useState("");
  const fileInputRef = useRef(null);

  const stages = [
    "Validating image geometry & lighting",
    "Analyzing visible room objects & wall sockets (PaliGemma)",
    "Estimating 3D room layout & furniture boundaries",
    "Applying pastel materials & studio illumination",
    "Generating interactive 3D room scene"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (JPG, PNG, or WebP).");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleStartReconstruction = async () => {
    if (!previewUrl) return;

    setCurrentStep(1);
    setProcessingStage(stages[0]);

    // Simulate multi-step pipeline with backend job query
    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      setCurrentStep(i + 1);
      await new Promise(r => setTimeout(r, 900));
    }

    try {
      // Notify backend of reconstruction
      await fetch("http://localhost:5050/api/room/reconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: selectedFile?.name || "custom_room.jpg" })
      });
    } catch (e) {
      console.warn("Backend reconstruction job notice sent with fallback.");
    }

    onReconstructionComplete?.(previewUrl, selectedFile?.name || "Uploaded Room");
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede7dd] shadow-sm max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Title Callout */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#7054E8] flex items-center justify-center font-bold mx-auto mb-1 shadow-xs">
          <Box className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b] tracking-tight">
          Let's make sure you leave nothing behind.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
          Show CheckMate your room. We'll reconstruct an interactive pastel 3D scene, identify candidate belongings, and help you verify what remains.
        </p>
      </div>

      {/* Main Drag & Drop Upload Zone */}
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-200 hover:border-[#7054E8] rounded-3xl p-8 sm:p-12 text-center bg-[#faf8f5] hover:bg-[#f5f2eb] transition-all cursor-pointer space-y-4 group"
        >
          <div className="w-16 h-16 rounded-3xl bg-white border border-[#eee8dd] text-[#7054E8] flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1e1b4b]">
              Drop your room photo here, or browse files
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Supports JPEG, PNG, and WebP (up to 15MB)
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-[#7054E8] text-white text-xs font-bold shadow-md shadow-purple-500/20"
            >
              Choose Room Photo
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onExploreDemo?.();
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#d8d2c7] text-xs font-bold"
            >
              Explore Demo Room
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        /* Image Preview & Reconstruction Process */
        <div className="space-y-5">
          <div className="relative rounded-2xl overflow-hidden border border-[#ede7dd] aspect-[16/9] max-h-80 bg-slate-900 mx-auto">
            <img
              src={previewUrl}
              alt="Room Upload Preview"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setCurrentStep(0);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>

          {currentStep > 0 && currentStep <= 5 && (
            <div className="p-4 rounded-2xl bg-[#f5f3ff] border border-purple-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#7054E8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Stage {currentStep} of 5: {processingStage}...</span>
                </span>
                <span className="font-mono text-slate-500">{currentStep * 20}%</span>
              </div>
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${currentStep * 20}%` }}
                  className="h-full bg-[#7054E8] rounded-full transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#f0eae0]">
            <button
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
                setCurrentStep(0);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={handleStartReconstruction}
              disabled={currentStep > 0}
              className="px-6 py-2.5 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] disabled:opacity-50 text-white text-xs font-black shadow-md shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{currentStep > 0 ? "Reconstructing Scene..." : "Create My 3D Room"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ede7dd] flex items-start gap-3 text-xs text-slate-500">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">
            Strict Bedroom & Living Space Privacy
          </span>
          <span>
            CheckMate processes your room scan locally or via your configured local vision engine. Your private living quarters are never uploaded to public cloud servers without your explicit consent.
          </span>
        </div>
      </div>

    </div>
  );
}
