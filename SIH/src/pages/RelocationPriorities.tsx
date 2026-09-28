import React, { useEffect, useState } from 'react';
import { PriorityTable } from '../components/relocation/PriorityTable';
import { apiService } from '../services/api';
import type { Habitation } from '../types';
import { useDashboardStore } from '../store/dashboardStore';
import { Download } from 'lucide-react';

export const RelocationPriorities: React.FC = () => {
  const { selectedDistrict } = useDashboardStore();
  const [habitations, setHabitations] = useState<Habitation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getHabitations(selectedDistrict);
      setHabitations(data);
    };
    fetchData();
  }, [selectedDistrict]);

  const exportCSV = () => {
    const headers = 'ID,Name,District,Taluka,Population,RiskStatus,PriorityScore,LandslideRisk,FloodRisk\n';
    const rows = habitations
      .map(
        (h) =>
          `"${h.id}","${h.name}","${h.district}","${h.taluka}",${h.population},"${h.riskStatus}",${h.priorityScore},${h.hazardScores.landslide},${h.hazardScores.flood}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vulnerability_Priority_Matrix_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Vulnerable Habitations & Relocation Priorities
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Geotechnical risk rank index calculated from multi-hazard AI modeling
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Matrix (CSV)</span>
        </button>
      </div>

      {/* Priority Matrix Table */}
      <PriorityTable habitations={habitations} />
    </div>
  );
};
