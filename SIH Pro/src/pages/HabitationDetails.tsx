import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Habitation, RelocationSite } from '../types';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  Cpu, 
  ArrowLeft, 
  History,
  Printer
} from 'lucide-react';

export const HabitationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habitation, setHabitation] = useState<Habitation | null>(null);
  const [recommendedSite, setRecommendedSite] = useState<RelocationSite | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        const habData = await apiService.getHabitationById(id);
        if (habData) {
          setHabitation(habData);
          const siteData = await apiService.getRelocationSiteById(habData.recommendedSiteId);
          setRecommendedSite(siteData || null);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">Fetching Geotechnical Profile...</p>
        </div>
      </div>
    );
  }

  if (!habitation) {
    return (
      <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-900">Habitation Profile Not Found</h3>
        <button
          onClick={() => navigate('/habitations')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Habitations Matrix
        </button>
      </div>
    );
  }

  const getRiskBadge = (status: Habitation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-rose-50 border-rose-200 text-rose-600 font-extrabold';
      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-600 font-extrabold';
      case 'MODERATE':
        return 'bg-yellow-50 border-yellow-200 text-yellow-600 font-semibold';
      default:
        return 'bg-emerald-50 border-emerald-200 text-emerald-600 font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back & Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/habitations')}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Habitations Matrix</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => window.print()}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
            title="Print Profile"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/optimizer?habitationId=${habitation.id}`)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <Cpu className="w-4 h-4 text-amber-300" />
            <span>Run Relocation Solver</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[11px] sm:text-xs border ${getRiskBadge(habitation.riskStatus)}`}>
                {habitation.riskStatus} RISK ZONE
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
                {habitation.priorityLevel}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{habitation.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span>{habitation.district} District • {habitation.taluka} Taluka • Coordinates: [{habitation.coordinates.join(', ')}]</span>
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl">
            <div className="text-center px-1 sm:px-3 sm:border-r border-slate-200">
              <div className="text-lg sm:text-2xl font-extrabold text-slate-900">{habitation.population}</div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">Population</span>
            </div>
            <div className="text-center px-1 sm:px-3 sm:border-r border-slate-200">
              <div className="text-lg sm:text-2xl font-extrabold text-slate-900">{habitation.households}</div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">Households</span>
            </div>
            <div className="text-center px-1 sm:px-3">
              <div className="text-lg sm:text-2xl font-extrabold text-indigo-600">{habitation.priorityScore.toFixed(1)}</div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">Priority Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Hazard Gauges & Disaster Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hazard Breakdown Progress Bars */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 text-sm">Geotechnical & Climate Vulnerability Index</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Landslide Susceptibility Index</span>
                <span className="text-rose-600 font-bold">{habitation.hazardScores.landslide}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                  style={{ width: `${habitation.hazardScores.landslide}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Extreme slope stability risk along basaltic weathered layers</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Flood Inundation Index</span>
                <span className="text-blue-600 font-bold">{habitation.hazardScores.flood}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{ width: `${habitation.hazardScores.flood}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">High surface stream discharge exposure during monsoon peaks</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Rainfall Anomaly Exposure</span>
                <span className="text-indigo-600 font-bold">{habitation.hazardScores.rainfall}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                  style={{ width: `${habitation.hazardScores.rainfall}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Social & Structural Vulnerability</span>
                <span className="text-amber-600 font-bold">{habitation.hazardScores.vulnerability}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  style={{ width: `${habitation.hazardScores.vulnerability}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Relocation Recommendation Card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-indigo-700/50">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Top AI Recommended Match</span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed mb-4">
              AI optimization model matched this habitation to <strong>RS-017 Malin-West Plateau</strong> with a 91% suitability score and 4.8 km safe distance.
            </p>

            {recommendedSite && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl mb-4 text-xs">
                <div className="font-bold text-white text-sm">{recommendedSite.name}</div>
                <div className="text-indigo-300 text-[11px] mt-0.5">
                  Suitability: {recommendedSite.suitability}% • Distance: {recommendedSite.distanceKm} km
                </div>
              </div>
            )}

            <button
              onClick={() => navigate(`/optimizer?habitationId=${habitation.id}`)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-xs transition-colors shadow-sm"
            >
              Open Relocation Solver Model
            </button>
          </div>
        </div>
      </div>

      {/* Historical Disaster Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Historical Disaster Timeline & Geotechnical Reports</h3>
        </div>

        {habitation.disasterHistory.length === 0 ? (
          <p className="text-xs text-slate-500">No major disaster occurrences recorded in the last 15 years.</p>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
            {habitation.disasterHistory.map((event) => (
              <div key={event.id} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100"></span>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-md">
                    {event.year}
                  </span>
                  <span>{event.type} Disaster</span>
                  <span className="text-slate-400 font-normal">| Estimated Damage: {event.damageEstimate}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium">{event.impact}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
