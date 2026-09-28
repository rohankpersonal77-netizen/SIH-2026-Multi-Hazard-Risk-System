import React from 'react';
import { Info } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const legendItems = [
    { label: 'Critical Risk (P1)', color: 'bg-rose-500 ring-rose-400/50', border: 'border-rose-400' },
    { label: 'High Risk (P2)', color: 'bg-amber-500 ring-amber-400/50', border: 'border-amber-400' },
    { label: 'Moderate Risk (P3)', color: 'bg-yellow-500 ring-yellow-400/50', border: 'border-yellow-400' },
    { label: 'Safe Habitation (P4)', color: 'bg-emerald-500 ring-emerald-400/50', border: 'border-emerald-400' },
    { label: 'Relocation Site (RS)', color: 'bg-indigo-600 ring-indigo-400/50', shape: 'square' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-white text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-2">
        <Info className="w-3.5 h-3.5 text-indigo-400" />
        <span>Map Legend</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={`w-3 h-3 ${item.shape === 'square' ? 'rounded' : 'rounded-full'} ${item.color} ring-2 flex-shrink-0`}
            ></span>
            <span className="text-[11px] text-slate-300 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
