import React from 'react';
import { 
  Calendar, 
  CloudRain, 
  ArrowRight, 
  Split, 
  History, 
  Cpu, 
  TrendingDown,
  Briefcase
} from 'lucide-react';

export default function BottomCards({
  tripType,
  duration,
  weather,
  mode,
  onOpenComparison,
  onOpenMemory,
  onOpenAiInspector
}) {
  // Bar chart data for the past trips
  const monthlyStats = [
    { month: "Apr", count: 4, height: "70%" },
    { month: "May", count: 3, height: "55%" },
    { month: "Jun", count: 3, height: "55%" },
    { month: "Jul", count: 2, height: "40%" },
    { month: "Aug", count: 2, height: "35%" },
    { month: "Sep", count: 1, height: "20%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* 1. Trip Preview Card */}
      <div className="faded-glass soft-card-hover rounded-3xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-2.5">
            <span className="text-xs font-black text-rose-500 flex items-center gap-1.5">
              <span>🎒</span> Trip Preview
            </span>
            <button className="text-[11px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5">
              <span>Edit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/assets/campus_thumb.jpg"
              alt="College Campus"
              className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-white/60 shadow-2xs"
            />
            <div className="space-y-0.5 min-w-0">
              <h4 className="font-extrabold text-xs text-[#1e1b4b] truncate">
                {tripType || "College Presentation"}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{duration || "2-3 Days"}</span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-slate-400" />
                <span>{weather || "Rainy (18°C)"}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/60 text-[10px] text-slate-400 font-bold mt-2">
          <span>{mode === "departure" ? "Departure Packing" : "Return Audit"}</span>
          <span>💼</span>
        </div>
      </div>

      {/* 2. Past Trip Stats Card */}
      <div className="faded-glass soft-card-hover rounded-3xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-extrabold text-[#1e1b4b]">
              Past Trip Stats
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-700 font-bold text-[10px] flex items-center gap-0.5 border border-emerald-200/50">
              <TrendingDown className="w-3 h-3" />
              <span>-60%</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-tight mb-2.5">
            You've forgotten 12 items in the last 6 trips 😅
          </p>

          {/* Bar Chart */}
          <div className="h-16 flex items-end justify-between gap-1.5 px-1 pt-1">
            {monthlyStats.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  style={{ height: item.height }}
                  className="w-full max-w-[16px] bg-[#fca5a5]/90 hover:bg-[#f87171] rounded-t-md transition-all shadow-2xs"
                  title={`${item.count} items forgotten in ${item.month}`}
                />
                <span className="text-[9px] font-bold text-slate-400">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Card */}
      <div className="faded-glass soft-card-hover rounded-3xl p-4 flex flex-col justify-between">
        <h4 className="text-xs font-extrabold text-[#1e1b4b] mb-2">
          Quick Actions
        </h4>

        <div className="space-y-1.5">
          <button
            onClick={onOpenComparison}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 text-[#5b21b6] text-xs font-bold transition-all border border-purple-100/50 cursor-pointer text-left shadow-2xs"
          >
            <Split className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Demo: Compare Trips</span>
          </button>

          <button
            onClick={onOpenMemory}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50/70 hover:bg-sky-100/80 text-[#0369a1] text-xs font-bold transition-all border border-sky-100/50 cursor-pointer text-left shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>View Memory Vault</span>
          </button>

          <button
            onClick={onOpenAiInspector}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-fuchsia-50/70 hover:bg-fuchsia-100/80 text-[#86198f] text-xs font-bold transition-all border border-fuchsia-100/50 cursor-pointer text-left shadow-2xs"
          >
            <Cpu className="w-3.5 h-3.5 text-[#c026d3]" />
            <span>Gemma Core (How it works)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
