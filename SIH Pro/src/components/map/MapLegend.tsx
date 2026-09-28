import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';

export const MapLegend: React.FC = () => {
  const { forecastHorizon } = useMapStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const legendItems = [
    { label: 'EXTREME (80% - 100%)', color: 'bg-rose-500 ring-rose-400/50', border: 'border-rose-400', isPulse: true },
    { label: 'HIGH (60% - 80%)', color: 'bg-orange-500 ring-orange-400/50', border: 'border-orange-400' },
    { label: 'MODERATE (30% - 60%)', color: 'bg-yellow-500 ring-yellow-400/50', border: 'border-yellow-400' },
    { label: 'LOW (0% - 30%)', color: 'bg-emerald-500 ring-emerald-400/50', border: 'border-emerald-400' },
    { label: 'CWC River Gauge', color: 'bg-cyan-500 ring-cyan-400/50', shape: 'circle' },
    { label: 'IMD Rain Station', color: 'bg-blue-500 ring-blue-400/50', shape: 'circle' },
    { label: 'Historical Flood', color: 'bg-amber-600 ring-amber-400/50', shape: 'square' },
    { label: 'Relocation Shelter', color: 'bg-indigo-600 ring-indigo-400/50', shape: 'square' },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl text-white text-xs overflow-hidden max-w-xs transition-all duration-200">
      {/* Legend Header / Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2.5 hover:bg-slate-800/60 transition-colors select-none text-left"
        title="Toggle Map Legend"
      >
        <div className="flex items-center gap-1.5 font-bold text-slate-200 text-xs">
          <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span>Legend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-950/70 px-1.5 py-0.5 rounded border border-indigo-700/50 uppercase">
            {forecastHorizon}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Legend Content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-800 animate-in fade-in duration-150">
          <div className="text-[9px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">
            Predicted Local Flood Zones & Telemetry
          </div>

          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 ${item.shape === 'square' ? 'rounded-sm' : 'rounded-full'} ${item.color} ring-1 flex-shrink-0 ${
                    item.isPulse ? 'animate-pulse' : ''
                  }`}
                ></span>
                <span className="text-[10px] text-slate-300 font-medium truncate">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[9px] text-slate-400 italic">
            * Localized organic footprints around telemetry stations. Administrative boundaries remain neutral.
          </div>
        </div>
      )}
    </div>
  );
};
