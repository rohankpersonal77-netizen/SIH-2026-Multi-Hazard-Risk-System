import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  severity?: 'critical' | 'high' | 'moderate' | 'safe' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  severity = 'indigo',
  onClick
}) => {
  const getSeverityStyle = () => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-300';
      case 'high':
        return 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:border-yellow-300';
      case 'safe':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300';
      default:
        return 'bg-white border-slate-200 hover:border-slate-300';
    }
  };

  const getIconBg = () => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-100 text-rose-600';
      case 'high':
        return 'bg-amber-100 text-amber-600';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-600';
      case 'safe':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-indigo-50 text-indigo-600';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl border shadow-sm transition-all duration-200 flex flex-col justify-between ${getSeverityStyle()} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${getIconBg()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
          {trend && (
            <div className={`flex items-center gap-1 font-semibold ${
              trend.direction === 'up' ? 'text-rose-600' : trend.direction === 'down' ? 'text-emerald-600' : 'text-slate-500'
            }`}>
              {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
              <span className="text-slate-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
