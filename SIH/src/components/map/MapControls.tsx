import React, { useState } from 'react';
import { Layers, ShieldAlert, Waves, CloudRain, Mountain, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';

export const MapControls: React.FC = () => {
  const { layers, toggleLayer } = useMapStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleItems = [
    { key: 'multiHazard' as const, label: 'Multi-Hazard Index', icon: ShieldAlert, color: 'text-rose-500' },
    { key: 'flood' as const, label: 'Flood Risk Inundation', icon: Waves, color: 'text-blue-500' },
    { key: 'landslide' as const, label: 'Landslide Susceptibility', icon: Mountain, color: 'text-amber-500' },
    { key: 'rainfall' as const, label: 'Rainfall Isohyet Overlay', icon: CloudRain, color: 'text-indigo-500' },
    { key: 'candidateSites' as const, label: 'Candidate Sites (RS)', icon: Building2, color: 'text-emerald-500' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 sm:p-3.5 shadow-2xl text-white w-64 sm:w-72">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-300 select-none"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>GIS Layer Controller</span>
        </div>
        <button className="sm:hidden p-1 hover:text-white">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className={`space-y-2 mt-2.5 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        {toggleItems.map((item) => {
          const Icon = item.icon;
          const active = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-150 border ${
                active
                  ? 'bg-slate-800 border-indigo-500/60 text-white shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${active ? item.color : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                active ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
              }`}>
                {active && <span className="text-[10px] font-bold">✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

