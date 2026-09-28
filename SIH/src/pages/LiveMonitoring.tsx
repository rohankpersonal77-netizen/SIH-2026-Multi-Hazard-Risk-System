import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { LiveTelemetry, HazardAlert } from '../types';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { 
  CloudRain, 
  Droplets, 
  Mountain, 
  Wifi 
} from 'lucide-react';

export const LiveMonitoring: React.FC = () => {
  const [telemetry, setTelemetry] = useState<LiveTelemetry[]>([]);
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [telData, alertData] = await Promise.all([
        apiService.getLiveTelemetry(),
        apiService.getHazardAlerts()
      ]);
      setTelemetry(telData);
      setAlerts(alertData);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Telemetry & Early Warning Monitoring
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time automated weather station feeds, soil moisture sensors, and slope displacement telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 w-fit">
          <Wifi className="w-4 h-4 text-emerald-600 animate-pulse flex-shrink-0" />
          <span>5/5 Telemetry Stations Connected</span>
        </div>
      </div>

      {/* Sensor Station Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {telemetry.map((sensor) => (
          <div
            key={sensor.stationId}
            className={`bg-white border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 ${
              sensor.status === 'CRITICAL'
                ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/10'
                : 'border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  {sensor.stationId}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">{sensor.stationName}</h3>
                <p className="text-xs text-slate-500">{sensor.district} District</p>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                sensor.status === 'CRITICAL'
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : sensor.status === 'WARNING'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-emerald-500 text-white border-emerald-600'
              }`}>
                {sensor.status}
              </span>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl">
                <CloudRain className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Rainfall</span>
                <strong className="text-slate-900 font-bold text-xs sm:text-sm">{sensor.rainfallMmHr} <span className="text-[9px]">mm/h</span></strong>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl">
                <Droplets className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Moisture</span>
                <strong className="text-slate-900 font-bold text-xs sm:text-sm">{sensor.soilMoisturePct}%</strong>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl">
                <Mountain className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Shift</span>
                <strong className="text-slate-900 font-bold text-xs sm:text-sm">{sensor.displacementMmDay} <span className="text-[9px]">mm/d</span></strong>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
              <span>Network Active</span>
              <span className="font-semibold text-slate-600">{sensor.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Feed Section */}
      <div className="h-[400px] sm:h-[480px]">
        <AlertPanel alerts={alerts} />
      </div>
    </div>
  );
};
