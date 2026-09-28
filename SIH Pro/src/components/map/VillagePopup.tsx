import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, ShieldAlert } from 'lucide-react';
import type { Habitation } from '../../types';

interface VillagePopupProps {
  habitation: Habitation;
}

export const VillagePopup: React.FC<VillagePopupProps> = ({ habitation }) => {
  const navigate = useNavigate();

  const getRiskColor = (status: Habitation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'MODERATE':
        return 'bg-yellow-500 text-slate-900';
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="w-64 p-4 bg-white rounded-xl shadow-lg font-sans">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900 leading-tight">{habitation.name}</h4>
          <p className="text-[11px] text-slate-500 font-medium">
            {habitation.district} District • {habitation.taluka} Taluka
          </p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getRiskColor(habitation.riskStatus)}`}>
          {habitation.riskStatus}
        </span>
      </div>

      {/* Quick Metrics */}
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs mb-3">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>Population:</span>
        </div>
        <strong className="text-slate-900 font-bold">{habitation.population} persons</strong>
      </div>

      {/* Hazard Score Bars */}
      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
            <span>Landslide Risk Score</span>
            <span className="text-rose-600 font-bold">{habitation.hazardScores.landslide}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full"
              style={{ width: `${habitation.hazardScores.landslide}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
            <span>Flood Risk Inundation</span>
            <span className="text-blue-600 font-bold">{habitation.hazardScores.flood}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${habitation.hazardScores.flood}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Immediate Badge if Critical */}
      {habitation.riskStatus === 'CRITICAL' && (
        <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5 text-[11px] font-bold text-rose-700">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Requires Immediate Relocation</span>
        </div>
      )}

      {/* Action Route Button */}
      <button
        onClick={() => navigate(`/habitations/${habitation.id}`)}
        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
      >
        <span>View Full Risk Intelligence</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
