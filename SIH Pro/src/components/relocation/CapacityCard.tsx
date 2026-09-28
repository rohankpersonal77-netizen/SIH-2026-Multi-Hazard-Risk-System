import React from 'react';
import type { CarryingCapacity } from '../../types';
import { AlertCircle, Droplets, Home, Layers, HeartPulse, GraduationCap } from 'lucide-react';

interface CapacityCardProps {
  capacity: CarryingCapacity;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ capacity }) => {
  const resources = [
    { label: 'Water Availability', limit: capacity.waterLimit, usage: capacity.waterUsage, icon: Droplets, type: 'Water' },
    { label: 'Housing Capacity', limit: capacity.housingLimit, usage: capacity.housingUsage, icon: Home, type: 'Housing' },
    { label: 'Land Area Limit', limit: capacity.landLimit, usage: capacity.landUsage, icon: Layers, type: 'Land' },
    { label: 'Healthcare Infra', limit: capacity.healthcareLimit, usage: capacity.healthcareUsage, icon: HeartPulse, type: 'Healthcare' },
    { label: 'Schooling Capacity', limit: capacity.schoolingLimit, usage: capacity.schoolingUsage, icon: GraduationCap, type: 'Schooling' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">{capacity.siteName}</h3>
          <p className="text-xs text-slate-500">Resource Carrying Capacity Breakdown</p>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold text-indigo-700">{capacity.maxSafeCapacity}</div>
          <span className="text-[10px] font-semibold text-slate-400">Max Safe Population</span>
        </div>
      </div>

      {/* Bottleneck Alert Pill */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <div className="text-xs font-bold text-amber-900">
            Critical Resource Bottleneck: <span className="underline">{capacity.bottleneckResource}</span>
          </div>
          <p className="text-[11px] text-amber-700 leading-tight">
            Maximum safe resettlement is constrained to <strong>{capacity.maxSafeCapacity} persons</strong> due to {capacity.bottleneckResource.toLowerCase()} infrastructure threshold limits.
          </p>
        </div>
      </div>

      {/* Resource Breakdown List */}
      <div className="space-y-3">
        {resources.map((res) => {
          const Icon = res.icon;
          const isBottleneck = res.type === capacity.bottleneckResource;
          const usagePct = Math.round((res.usage / res.limit) * 100);

          return (
            <div
              key={res.label}
              className={`p-3 rounded-lg border transition-all ${
                isBottleneck ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isBottleneck ? 'text-amber-600' : 'text-slate-500'}`} />
                  <span className={isBottleneck ? 'text-amber-900 font-bold' : 'text-slate-700'}>
                    {res.label}
                  </span>
                  {isBottleneck && (
                    <span className="text-[9px] font-extrabold bg-amber-600 text-white px-1.5 py-0.2 rounded uppercase">
                      BOTTLENECK
                    </span>
                  )}
                </div>
                <span className="text-slate-900 font-bold">
                  {res.limit} <span className="text-slate-400 font-normal">limit</span>
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isBottleneck ? 'bg-amber-500' : usagePct > 80 ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(100, (res.limit / 6000) * 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
