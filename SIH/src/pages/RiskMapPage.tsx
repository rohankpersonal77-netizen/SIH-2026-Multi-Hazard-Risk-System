import React, { useState, useEffect } from 'react';
import { RiskMap } from '../components/map/RiskMap';
import { apiService } from '../services/api';
import type { Habitation, RelocationSite } from '../types';
import { useDashboardStore } from '../store/dashboardStore';
import { useMapStore } from '../store/mapStore';
import { Map, RefreshCw } from 'lucide-react';

export const RiskMapPage: React.FC = () => {
  const { selectedDistrict } = useDashboardStore();
  const { resetMap } = useMapStore();
  const [habitations, setHabitations] = useState<Habitation[]>([]);
  const [sites, setSites] = useState<RelocationSite[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      const [habData, siteData] = await Promise.all([
        apiService.getHabitations(selectedDistrict, riskFilter),
        apiService.getRelocationSites(selectedDistrict)
      ]);
      setHabitations(habData);
      setSites(siteData);
    };
    fetchData();
  }, [selectedDistrict, riskFilter]);

  return (
    <div className="space-y-4 h-[calc(100vh-80px)] sm:h-[calc(100vh-100px)] flex flex-col">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900">Multi-Hazard GIS Intelligence Map</h1>
            <p className="text-[11px] sm:text-xs text-slate-500">Interactive spatial layer analysis and relocation site matching</p>
          </div>
        </div>

        {/* Risk Level Filter Toolbar */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full no-scrollbar">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'SAFE'].map((status) => (
              <button
                key={status}
                onClick={() => setRiskFilter(status)}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap text-[11px] ${
                  riskFilter === status
                    ? 'bg-white text-indigo-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={resetMap}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
            title="Reset Map View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Body Container */}
      <div className="flex-1 min-h-[350px] relative">
        <RiskMap habitations={habitations} sites={sites} height="h-full" showControls={true} />
      </div>
    </div>
  );
};

