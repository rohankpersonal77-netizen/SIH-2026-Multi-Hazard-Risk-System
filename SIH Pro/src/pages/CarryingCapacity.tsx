import React, { useEffect, useState } from 'react';
import { CapacityCard } from '../components/relocation/CapacityCard';
import { apiService } from '../services/api';
import type { CarryingCapacity as CarryingCapacityType } from '../types';
import { AlertTriangle } from 'lucide-react';

export const CarryingCapacity: React.FC = () => {
  const [capacities, setCapacities] = useState<CarryingCapacityType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getCarryingCapacities();
      setCapacities(data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Environmental & Infrastructure Carrying Capacity
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Resource threshold analyzer enforcing safe population limits based on bottleneck resources
          </p>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="bg-indigo-900 text-white rounded-xl p-4 sm:p-5 shadow-lg border border-indigo-700/60 flex items-start gap-3 sm:gap-4">
        <div className="p-2.5 sm:p-3 bg-indigo-800 rounded-xl flex-shrink-0 text-amber-400">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-white">Carrying Capacity Bottleneck Principle</h3>
          <p className="text-[11px] sm:text-xs text-indigo-200 mt-1 leading-relaxed">
            The maximum safe resettlement population for any site is determined strictly by its <strong>most restrictive infrastructure limit</strong> (the Bottleneck Resource). Even if land allows 4,000 persons, a water supply limit of 2,400 caps total safe capacity at 2,400 to prevent environmental degradation or social strain.
          </p>
        </div>
      </div>

      {/* Capacity Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {capacities.map((cap) => (
          <CapacityCard key={cap.siteId} capacity={cap} />
        ))}
      </div>
    </div>
  );
};
