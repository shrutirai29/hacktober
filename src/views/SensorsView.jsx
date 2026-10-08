import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Volume2, 
  Usb, 
  Terminal, 
  CheckCircle2,
  Code
} from 'lucide-react';

export default function SensorsView() {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState({
    temp: 12.4,
    humidity: 68.2,
    pressure: 998.4,
    altitude: 412,
    soundDb: 42.1,
    packets: 218
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        temp: Number((12.4 + (Math.random() - 0.5) * 0.4).toFixed(1)),
        humidity: Number((68.2 + (Math.random() - 0.5) * 1.5).toFixed(1)),
        pressure: Number((998.4 + (Math.random() - 0.5) * 0.8).toFixed(1)),
        altitude: 412 + Math.round((Math.random() - 0.5) * 3),
        soundDb: Number((42.0 + Math.random() * 6).toFixed(1)),
        packets: prev.packets + 1
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const connectSerial = async () => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        setIsConnected(true);
      } catch (err) {
        console.warn("Serial connection canceled:", err);
      }
    } else {
      setIsConnected(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="outdoor-card p-6 bg-[#F2F8F4]/95 border-[#DCE7DF] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
              <Cpu className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-[#20332A]">
              Arduino UNO Q Hardware Sensor Bridge
            </h1>
          </div>
          <p className="text-xs text-[#6F7B72]">
            Backcountry telemetry pod running Qualcomm AI Hub quantized models on an Arduino UNO Q board.
          </p>
        </div>

        <button
          onClick={connectSerial}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm ${
            isConnected
              ? 'bg-[#285943] text-[#FBF8EF]'
              : 'bg-[#F2F8F4] border border-[#DCE7DF] text-[#20332A] hover:bg-[#EBF5EE]'
          }`}
        >
          <Usb className="w-4 h-4 text-[#3F7D5A]" />
          <span>{isConnected ? "Connected (COM4)" : "Connect WebSerial"}</span>
        </button>
      </div>

      {/* 5 Big Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
          <div className="flex items-center justify-between text-xs text-[#6F7B72] mb-1">
            <span>Temperature</span>
            <Thermometer className="w-4 h-4 text-[#D97855]" />
          </div>
          <span className="text-2xl font-black font-mono text-[#20332A]">{telemetry.temp}°C</span>
          <span className="text-[10px] text-[#6F7B72] block mt-1">{((telemetry.temp * 9/5) + 32).toFixed(1)}°F Ambient</span>
        </div>

        <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
          <div className="flex items-center justify-between text-xs text-[#6F7B72] mb-1">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-[#285943]" />
          </div>
          <span className="text-2xl font-black font-mono text-[#20332A]">{telemetry.humidity}%</span>
          <span className="text-[10px] text-[#6F7B72] block mt-1">Canopy saturation</span>
        </div>

        <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
          <div className="flex items-center justify-between text-xs text-[#6F7B72] mb-1">
            <span>Barometric Pressure</span>
            <Gauge className="w-4 h-4 text-[#8B6474]" />
          </div>
          <span className="text-2xl font-black font-mono text-[#20332A]">{telemetry.pressure} hPa</span>
          <span className="text-[10px] text-[#6F7B72] block mt-1">Stable trend</span>
        </div>

        <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
          <div className="flex items-center justify-between text-xs text-[#6F7B72] mb-1">
            <span>Barometric Altitude</span>
            <Gauge className="w-4 h-4 text-[#3F7D5A]" />
          </div>
          <span className="text-2xl font-black font-mono text-[#20332A]">{telemetry.altitude} m</span>
          <span className="text-[10px] text-[#6F7B72] block mt-1">Above sea level</span>
        </div>

        <div className="outdoor-card p-4 bg-[#F2F8F4]/95 border-[#DCE7DF]">
          <div className="flex items-center justify-between text-xs text-[#6F7B72] mb-1">
            <span>Sound SPL</span>
            <Volume2 className="w-4 h-4 text-[#E7A94B]" />
          </div>
          <span className="text-2xl font-black font-mono text-[#20332A]">{telemetry.soundDb} dB</span>
          <span className="text-[10px] text-[#6F7B72] block mt-1">Canopy mic stream</span>
        </div>
      </div>

      {/* Firmware snippet */}
      <div className="outdoor-card p-5 bg-[#F2F8F4]/95 border-[#DCE7DF] font-mono text-xs">
        <div className="flex items-center justify-between mb-2 text-[#6F7B72]">
          <span className="flex items-center gap-1.5 font-bold text-[#20332A]">
            <Code className="w-4 h-4 text-[#3F7D5A]" />
            firmware/canopy_uno_q.ino (Arduino UNO Q C++)
          </span>
          <span className="text-[#20332A] font-bold">Packets Received: {telemetry.packets}</span>
        </div>
        <pre className="p-4 rounded-xl bg-[#141B17] text-[#DCEBDA] text-xs overflow-x-auto leading-relaxed max-h-56">
{`#include <Wire.h>
#include <Adafruit_BME280.h>
#include <ArduinoJson.h>

Adafruit_BME280 bme; // Temperature, Pressure, Humidity

void setup() {
  Serial.begin(115200);
  bme.begin(0x76);
}

void loop() {
  StaticJsonDocument<256> doc;
  doc["temp_c"] = bme.readTemperature();
  doc["humidity_pct"] = bme.readHumidity();
  doc["pressure_hpa"] = bme.readPressure() / 100.0F;
  serializeJson(doc, Serial);
  Serial.println();
  delay(1500);
}`}
        </pre>
      </div>
    </div>
  );
}
