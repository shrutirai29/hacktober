import React from 'react';
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Briefcase,
  Home,
  Laptop
} from 'lucide-react';

export default function MyChecklistsView({ onSelectTrip, onNewTrip }) {
  const savedTrips = [
    {
      id: "trip_1",
      title: "College Presentation & Conference",
      destination: "Main Auditorium, Block A",
      date: "Oct 5, 2026",
      itemsTotal: 18,
      itemsPacked: 6,
      status: "In Progress",
      icon: Briefcase,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200"
    },
    {
      id: "trip_2",
      title: "Weekend at Family Home",
      destination: "Greenwood Suburbs",
      date: "Sep 26, 2026",
      itemsTotal: 14,
      itemsPacked: 14,
      status: "Completed",
      icon: Home,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      id: "trip_3",
      title: "AI Innovation Hackathon",
      destination: "City Tech Hub",
      date: "Sep 12, 2026",
      itemsTotal: 16,
      itemsPacked: 16,
      status: "Completed",
      icon: Laptop,
      color: "text-purple-600 bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ede7dd] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-[#7054E8] flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
              My Checklists & Trip History
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Review active packing lists, return audit logs, and past verified journeys.
            </p>
          </div>
        </div>

        <button
          onClick={onNewTrip}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7054E8] hover:bg-[#5b3ee0] text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savedTrips.map(trip => {
          const Icon = trip.icon;
          const isDone = trip.status === "Completed";
          const progressPercent = Math.round((trip.itemsPacked / trip.itemsTotal) * 100);

          return (
            <div
              key={trip.id}
              className="bg-white rounded-3xl p-5 border border-[#ede7dd] shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2.5 rounded-2xl border ${trip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-[#7054E8]'
                  }`}>
                    {trip.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-[#1e1b4b]">
                    {trip.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {trip.destination}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{trip.date}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">{trip.itemsPacked} of {trip.itemsTotal} packed</span>
                    <span className="text-[#7054E8] font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-[#7054E8]'}`}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectTrip(trip)}
                className="w-full py-2 rounded-xl bg-[#faf8f5] hover:bg-[#ede9fe] text-slate-700 hover:text-[#5b21b6] font-bold text-xs border border-[#eee8dd] hover:border-purple-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isDone ? "Review Manifest" : "Resume Packing"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
