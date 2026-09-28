import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  ShieldAlert,
  Waves,
  CloudRain,
  Mountain,
  Building2,
  ChevronDown,
  Droplets,
  Landmark,
  Compass,
  Check,
  RotateCcw,
  CheckSquare
} from 'lucide-react';
import { useMapStore } from '../../store/mapStore';
import type { GISLayerState } from '../../types';

export const MapControls: React.FC = () => {
  const { layers, toggleLayer } = useMapStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleItems = [
    { key: 'multiHazard' as const, label: 'Multi-Hazard Index', icon: ShieldAlert, color: 'text-rose-400' },
    { key: 'flood' as const, label: 'Predicted Flood Hazard Footprints', icon: Waves, color: 'text-blue-400' },
    { key: 'landslide' as const, label: 'Landslide Susceptibility', icon: Mountain, color: 'text-orange-400' },
    { key: 'riverStations' as const, label: 'CWC River Gauges (53)', icon: Droplets, color: 'text-cyan-400' },
    { key: 'rainfall' as const, label: 'IMD Rain Stations (37)', icon: CloudRain, color: 'text-indigo-400' },
    { key: 'historicalFloods' as const, label: 'Historical Flood Events (5)', icon: Landmark, color: 'text-amber-400' },
    { key: 'riverNetwork' as const, label: 'Maharashtra River Traces', icon: Waves, color: 'text-sky-400' },
    { key: 'districtBoundaries' as const, label: 'District Boundaries', icon: Compass, color: 'text-slate-400' },
    { key: 'candidateSites' as const, label: 'Relocation Shelters (DDMA)', icon: Building2, color: 'text-emerald-400' }
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  const handleSelectAll = () => {
    toggleItems.forEach((item) => {
      if (!layers[item.key]) {
        toggleLayer(item.key);
      }
    });
  };

  const handleResetDefaults = () => {
    const defaults: Record<keyof GISLayerState, boolean> = {
      multiHazard: true,
      flood: true,
      landslide: true,
      rainfall: false,
      candidateSites: true,
      districtBoundaries: true,
      riverStations: true,
      riverNetwork: true,
      historicalFloods: false
    };
    (Object.keys(defaults) as (keyof GISLayerState)[]).forEach((key) => {
      if (layers[key] !== defaults[key]) {
        toggleLayer(key);
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold shadow-2xl transition-all select-none ${
          isOpen
            ? 'bg-slate-800/95 border-indigo-500 text-white ring-2 ring-indigo-500/40'
            : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800/90'
        }`}
        title="Toggle GIS Layers"
      >
        <Layers className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span className="font-bold">GIS Layers</span>
        <span className="bg-indigo-600/60 text-indigo-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-400/40">
          {activeCount}/{toggleItems.length}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-white z-[1200] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>GIS Layer Controller</span>
              </h4>
              <p className="text-[10px] text-slate-400">Toggle layers on the spatial map</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSelectAll}
                className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors flex items-center gap-1"
                title="Enable all layers"
              >
                <CheckSquare className="w-2.5 h-2.5" />
                All
              </button>
              <button
                onClick={handleResetDefaults}
                className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors flex items-center gap-1"
                title="Reset to default layers"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Layer Items List */}
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {toggleItems.map((item) => {
              const Icon = item.icon;
              const active = !!layers[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => toggleLayer(item.key)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    active
                      ? 'bg-slate-800/90 border-indigo-500/60 text-white shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? item.color : 'text-slate-500'}`} />
                    <span className="truncate text-[11px]">{item.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                      active ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
