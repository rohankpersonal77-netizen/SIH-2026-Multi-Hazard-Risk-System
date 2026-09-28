import React, { useEffect, useState } from 'react';
import { SiteCard } from '../components/relocation/SiteCard';
import { apiService } from '../services/api';
import type { RelocationSite } from '../types';
import { useDashboardStore } from '../store/dashboardStore';

export const RelocationSites: React.FC = () => {
  const { selectedDistrict } = useDashboardStore();
  const [sites, setSites] = useState<RelocationSite[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getRelocationSites(selectedDistrict);
      setSites(data);
    };
    fetchData();
  }, [selectedDistrict]);

  const totalCapacity = sites.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalAssigned = sites.reduce((acc, s) => acc + s.assignedCount, 0);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Candidate Relocation Sites (RS Hubs)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Geotechnically verified safe zone hubs for permanent disaster resettlement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 w-fit">
            Total Safe Capacity: {totalAssigned.toLocaleString()} / {totalCapacity.toLocaleString()} Persons
          </div>
        </div>
      </div>

      {/* Grid of Site Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
};
