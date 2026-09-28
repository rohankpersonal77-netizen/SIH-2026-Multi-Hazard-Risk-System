import React from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import type { HazardAlert } from '../../types';

interface AlertPanelProps {
  alerts: HazardAlert[];
  onViewAll?: () => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onViewAll }) => {
  const getSeverityBadge = (severity: HazardAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'MODERATE':
        return 'bg-yellow-50 border-yellow-200 text-yellow-600';
      default:
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Active Disaster Warning Feed</h3>
            <p className="text-[11px] text-slate-500">Real-time alerts from SDMA Telemetry & Geotechnical Sensors</p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[380px]">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border transition-all duration-150 ${getSeverityBadge(alert.severity)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white border-rose-700 animate-pulse' :
                  alert.severity === 'HIGH' ? 'bg-amber-600 text-white border-amber-700' :
                  'bg-yellow-500 text-slate-900 border-yellow-600'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-xs font-bold text-slate-900">{alert.district}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{alert.timestamp}</span>
            </div>

            <h4 className="font-bold text-xs text-slate-900 mt-2">{alert.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>

            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700">
                Affected Population: <strong className="text-slate-900">{alert.affectedCount} persons</strong>
              </span>
              <button className="text-indigo-600 font-bold hover:underline">
                Dispatch NDRF / SDRF Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
