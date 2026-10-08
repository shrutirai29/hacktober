import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  BookOpen, 
  Compass, 
  CheckCircle2, 
  Trash2, 
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FieldJournalModal({ isOpen, onClose, journalEntries, onClearJournal, currentTrail }) {
  if (!isOpen) return null;

  const handleExportGPX = () => {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Canopy AI - Touch Grass Field Agent">
  <metadata>
    <name>${currentTrail.name} Field Log</name>
    <desc>Offline Bioacoustic & Microclimate hike recorded with Canopy AI</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${currentTrail.name}</name>
    <trkseg>
      <trkpt lat="${currentTrail.coordinates.lat}" lon="${currentTrail.coordinates.lon}">
        <ele>180</ele>
        <time>${new Date().toISOString()}</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTrail.id}-field-track.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    const mdContent = `# 🌲 Canopy Field Journal: ${currentTrail.name}
**Date:** ${new Date().toLocaleDateString()}
**Location:** ${currentTrail.park}
**Distance:** ${currentTrail.distance} | **Elevation Gain:** ${currentTrail.elevationGain}
**Autumn Foliage Saturation:** ${currentTrail.foliageMetrics.peakPercentage}% (${currentTrail.foliageMetrics.status})

---

## 🎧 Offline Bioacoustic Detections
${journalEntries.length === 0 ? '_No species logged yet during this session._' : journalEntries.map((e, idx) => `
### ${idx + 1}. ${e.name} (*${e.scientific}*)
- **Time Logged:** ${e.time}
- **Dominant Frequency:** ${e.frequency}
- **Model Confidence:** ${(e.confidence * 100).toFixed(0)}%
- **Trail:** ${e.trail}
`).join('\n')}

---

## 🍂 TabPFN Microclimate Summary
- **Predicted Temperature Range:** ${currentTrail.microclimateTabPFN.predictedTempRange}
- **Frost Hazard Probability:** ${currentTrail.microclimateTabPFN.frostProbability}%
- **Sunset Checkpoint:** ${currentTrail.microclimateTabPFN.sunsetTime} (Hard turnaround: ${currentTrail.microclimateTabPFN.safeTurnaroundTime})

*Logged with Canopy AI (100% Offline Open-Source AI)*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canopy-field-journal-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F2F8F4] border border-[#DCE7DF] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-[#DCE7DF] flex items-center justify-between bg-[#EBF5EE]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E7A94B]/20 text-[#D97855]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#20332A]">
                Offline Field Journal & Bio-Vault
              </h3>
              <p className="text-xs text-[#6F7B72]">
                All wildlife sightings and microclimate points logged locally with zero cloud storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6F7B72] hover:text-[#20332A] hover:bg-[#DCE7DF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {journalEntries.length === 0 ? (
            <div className="text-center py-12 text-[#6F7B72] space-y-2">
              <Compass className="w-10 h-10 mx-auto text-[#6F7B72]/60" />
              <p className="text-sm font-medium text-[#20332A]">No field sightings logged yet.</p>
              <p className="text-xs text-[#6F7B72] max-w-xs mx-auto">
                Go to the Bioacoustics tab and click "Log Sighting to Offline Journal" to preserve bird songs.
              </p>
            </div>
          ) : (
            journalEntries.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl bg-[#EBF5EE] border border-[#DCE7DF] flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#20332A]">{item.name}</span>
                    <span className="text-xs italic text-[#6F7B72] font-serif">({item.scientific})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#6F7B72] mt-1 font-mono">
                    <span>Logged at {item.time}</span>
                    <span>•</span>
                    <span className="text-[#3F7D5A] font-bold">{item.frequency}</span>
                    <span>•</span>
                    <span className="text-[#D97855] font-bold">{(item.confidence * 100).toFixed(0)}% match</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#DCE7DF] text-[#20332A] font-mono font-semibold">
                    {item.trail}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#DCE7DF] bg-[#EBF5EE] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClearJournal}
            disabled={journalEntries.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#6F7B72] hover:text-[#D97855] disabled:opacity-40 transition font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportGPX}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F2F8F4] hover:bg-[#DCEBDA] text-[#20332A] text-xs font-semibold border border-[#DCE7DF] transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#3F7D5A]" />
              <span>Export GPX</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#285943] hover:bg-[#204936] text-[#FBF8EF] font-bold text-xs transition shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Field Journal (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
