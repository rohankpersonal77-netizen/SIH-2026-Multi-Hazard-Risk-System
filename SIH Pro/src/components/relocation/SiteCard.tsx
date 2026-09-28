import React from 'react';
import type { RelocationSite } from '../../types';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SiteCardProps {
  site: RelocationSite;
  onSelect?: (site: RelocationSite) => void;
  isSelected?: boolean;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, onSelect, isSelected }) => {
  const capacityPct = Math.round((site.assignedCount / site.totalCapacity) * 100);

  return (
    <div
      onClick={() => onSelect && onSelect(site)}
      className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10 shadow-md'
          : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md uppercase">
            {site.code}
          </span>
          <h3 className="font-bold text-base text-slate-900 mt-1.5">{site.name}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{site.district} District • {site.taluka} Taluka</span>
          </p>
        </div>

        <div className="text-right">
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-extrabold text-sm inline-flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{site.suitability}%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Suitability Score</span>
        </div>
      </div>

      {/* Capacity Usage */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
          <span>Assigned Population Capacity</span>
          <span className="text-slate-900 font-bold">{site.assignedCount} / {site.totalCapacity} persons</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              capacityPct > 85 ? 'bg-rose-500' : capacityPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${capacityPct}%` }}
          ></div>
        </div>
      </div>

      {/* Sub-Score Breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-400 font-medium block">Hazard Safety</span>
          <strong className="text-slate-900 font-bold text-sm">{site.subScores.hazard}%</strong>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-400 font-medium block">Water Security</span>
          <strong className="text-slate-900 font-bold text-sm">{site.subScores.water}%</strong>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-400 font-medium block">Road Access</span>
          <strong className="text-slate-900 font-bold text-sm">{site.subScores.roads}%</strong>
        </div>
      </div>

      {/* Amenities Tags */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
        {site.amenities.map((amenity) => (
          <span
            key={amenity}
            className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>{amenity}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
