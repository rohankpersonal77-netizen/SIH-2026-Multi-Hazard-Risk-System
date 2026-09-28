import React from 'react';
import { Map, Globe, Mountain } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';
import type { BaseLayerType } from '../../store/mapStore';

export const BaseLayerControl: React.FC = () => {
  const { activeBaseLayer, setActiveBaseLayer } = useMapStore();

  const baseLayers: { id: BaseLayerType; label: string; icon: React.ElementType; desc: string }[] = [
    {
      id: 'vector',
      label: 'Vector',
      icon: Map,
      desc: 'CartoDB Voyager'
    },
    {
      id: 'satellite',
      label: 'Satellite',
      icon: Globe,
      desc: 'Esri World Imagery'
    },
    {
      id: 'terrain',
      label: 'Terrain',
      icon: Mountain,
      desc: 'OpenTopoMap'
    }
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-2xl text-white">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
        Basemap Layer
      </div>

      <div className="flex items-center gap-1.5">
        {baseLayers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeBaseLayer === layer.id;

          return (
            <button
              key={layer.id}
              onClick={() => setActiveBaseLayer(layer.id)}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all duration-150 border text-xs font-medium cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md ring-2 ring-indigo-500/40 font-bold scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
              title={layer.desc}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[11px]">{layer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
