import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Calendar, 
  MapPin, 
  Bird, 
  Search,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JournalView({ journalEntries = [] }) {
  const [search, setSearch] = useState('');

  const sampleEntries = [
    {
      id: "entry-1",
      name: "Himalayan Monal",
      scientific: "Lophophorus impejanus",
      time: "07:15 AM",
      date: "Oct 12, 2026",
      frequency: "3,850 Hz",
      confidence: 0.96,
      trail: "Kedarkantha Summit Ridge",
      notes: "High whistling territorial call resounding over the Deodar forest line above Juda Ka Talab. Iridescent blue-green plumage spotted on morning snow.",
      thumb: "/assets/journal_bird.jpg"
    },
    {
      id: "entry-2",
      name: "Koklass Pheasant",
      scientific: "Pucrasia macrolopha",
      time: "08:40 AM",
      date: "Oct 12, 2026",
      frequency: "1,650 Hz",
      confidence: 0.92,
      trail: "Kedarkantha Summit Ridge",
      notes: "Distinctive guttural 'kok-kok-kok' call echoing from dense oak-rhododendron ravine at 2,800 m elevation.",
      thumb: "/assets/journal_hawk.jpg"
    },
    {
      id: "entry-3",
      name: "Kedarkantha Summit Lookout",
      scientific: "Garhwal Himalayan Panorama",
      time: "11:20 AM",
      date: "Oct 12, 2026",
      frequency: "Altitude 3,810 m",
      confidence: 1.0,
      trail: "Kedarkantha Summit Ridge",
      notes: "360-degree clear alpenglow vista across Swargarohini I-IV, Bandarpoonch, Black Peak (Kalanag), and Har Ki Dun valley. Prayer flags fluttering at Shiva shrine.",
      thumb: "/assets/journal_viewpoint.jpg"
    }
  ];

  const allEntries = [...sampleEntries, ...journalEntries];
  const filtered = allEntries.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.trail.toLowerCase().includes(search.toLowerCase()));

  const handleExportGPX = () => {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Touch Grass AI">
  <trk><name>Touch Grass Trail Track</name><trkseg><trkpt lat="41.3129" lon="-73.9882"><ele>180</ele></trkpt></trkseg></trk>
</gpx>`;
    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `touch-grass-log.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    const md = `# Touch Grass Field Report
**Date:** Oct 12, 2026
**Trail:** Bear Mountain Hawk Ridge Trail
${filtered.map((item, idx) => `
### ${idx + 1}. ${item.name} (*${item.scientific}*)
- **Time:** ${item.time} (${item.date || 'Oct 12, 2026'})
- **Frequency:** ${item.frequency}
- **Notes:** ${item.notes || 'Identified via on-device bioacoustics.'}
`).join('\n')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `field-journal-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="outdoor-card p-6 bg-[#F2F8F4]/95 border-[#DCE7DF] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[#E7A94B]/20 flex items-center justify-center text-[#E7A94B]">
              <BookOpen className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-[#20332A]">
              Field Journal & Offline Bio-Vault
            </h1>
          </div>
          <p className="text-xs text-[#6F7B72]">
            All observations, acoustic harmonic fingerprints, and GPS waypoint tags saved locally to your device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportGPX}
            className="px-3 py-2 rounded-xl border border-[#DCE7DF] bg-[#F2F8F4] hover:bg-[#EBF5EE] text-xs font-bold text-[#20332A] flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#3F7D5A]" />
            <span>Export GPX Track</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-2 rounded-xl bg-[#285943] hover:bg-[#204936] text-[#FBF8EF] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Markdown (.md)</span>
          </button>
        </div>
      </div>

      {/* Observation Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(entry => (
          <div key={entry.id} className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#DCE7DF] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={entry.thumb || "/assets/journal_bird.jpg"} 
                  alt={entry.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#DCE7DF] shrink-0" 
                />
                <div>
                  <h3 className="text-sm font-extrabold text-[#20332A]">
                    {entry.name}
                  </h3>
                  <span className="text-[11px] italic text-[#6F7B72] font-serif block">
                    {entry.scientific}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-[#6F7B72] mt-0.5 font-mono">
                    <span>{entry.time}</span>
                    <span>•</span>
                    <span className="text-[#3F7D5A] font-bold">{entry.frequency}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#20332A] leading-relaxed p-3 rounded-xl bg-[#EBF5EE] border border-[#DCE7DF]">
                {entry.notes || "Logged during Bear Mountain traverse."}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#E7E1D4] text-[10px] text-[#6F7B72] flex justify-between">
              <span>{entry.trail}</span>
              <span className="text-[#3F7D5A] font-semibold">Verified Offline</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
