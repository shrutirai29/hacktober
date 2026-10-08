import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Volume2, 
  Radio, 
  ChevronRight 
} from 'lucide-react';

export default function SensorsCard({ onOpenSensorPanel }) {
  const [temp, setTemp] = useState(12.4);
  const [humidity, setHumidity] = useState(68);
  const [pressure, setPressure] = useState(998);

  // Subtle live fluctuations to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(t => Number((12.4 + (Math.random() - 0.5) * 0.4).toFixed(1)));
      setHumidity(h => Math.round(68 + (Math.random() - 0.5) * 2));
      setPressure(p => Math.round(998 + (Math.random() - 0.5) * 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      onClick={onOpenSensorPanel}
      className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#C8DEC8] cursor-pointer outdoor-card-interactive flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-[#20332A] truncate">
            Arduino UNO Q Sensors
          </h3>
        </div>

        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2EFE5] text-[#285943] text-[9px] font-bold border border-[#A8C8AF]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          SIMULATED SENSOR
        </span>
      </div>

      {/* 3 Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2">
        {/* Temp */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D97855]/15 flex items-center justify-center text-[#D97855] shrink-0">
            <Thermometer className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#20332A] font-mono block">
              {temp}°C
            </span>
            <span className="text-[9px] text-[#6F7B72]">Temperature</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCEAF0] flex items-center justify-center text-[#285943] shrink-0">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#20332A] font-mono block">
              {humidity}%
            </span>
            <span className="text-[9px] text-[#6F7B72]">Humidity</span>
          </div>
        </div>

        {/* Pressure */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#8B6474]/15 flex items-center justify-center text-[#8B6474] shrink-0">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#20332A] font-mono block">
              {pressure} hPa
            </span>
            <span className="text-[9px] text-[#6F7B72]">Altitude</span>
          </div>
        </div>
      </div>
    </div>
  );
}
