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
      desc: 'Dark Vector Basemap'
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
      desc: 'Esri World Topographic'
    }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-2xl text-white flex items-center gap-1">
      {baseLayers.map((layer) => {
        const Icon = layer.icon;
        const isActive = activeBaseLayer === layer.id;

        return (
          <button
            key={layer.id}
            onClick={() => setActiveBaseLayer(layer.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-semibold cursor-pointer border ${
              isActive
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400/50'
                : 'bg-transparent border-transparent text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title={layer.desc}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span className="text-[11px]">{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
};
