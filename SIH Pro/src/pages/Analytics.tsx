import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Habitation } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [habitations, setHabitations] = useState<Habitation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.getHabitations();
      setHabitations(data);
    };
    fetchData();
  }, []);

  // Pie chart data: Risk Status Distribution
  const riskCounts = habitations.reduce(
    (acc, h) => {
      acc[h.riskStatus] = (acc[h.riskStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = [
    { name: 'Critical Risk (P1)', value: riskCounts['CRITICAL'] || 0, color: '#f43f5e' },
    { name: 'High Risk (P2)', value: riskCounts['HIGH'] || 0, color: '#f59e0b' },
    { name: 'Moderate Risk (P3)', value: riskCounts['MODERATE'] || 0, color: '#eab308' },
    { name: 'Safe Habitation (P4)', value: riskCounts['SAFE'] || 0, color: '#10b981' },
  ];

  // Bar chart data: Average Priority Index by District
  const districtMap = habitations.reduce((acc, h) => {
    if (!acc[h.district]) {
      acc[h.district] = { district: h.district, totalScore: 0, count: 0, criticalCount: 0 };
    }
    acc[h.district].totalScore += h.priorityScore;
    acc[h.district].count += 1;
    if (h.riskStatus === 'CRITICAL') acc[h.district].criticalCount += 1;
    return acc;
  }, {} as Record<string, { district: string; totalScore: number; count: number; criticalCount: number }>);

  const barData = Object.values(districtMap).map((d) => ({
    district: d.district,
    avgPriority: parseFloat((d.totalScore / d.count).toFixed(1)),
    criticalCount: d.criticalCount
  }));

  // Area chart data: Hazard comparison across villages
  const areaData = habitations.map((h) => ({
    name: h.name.split(' ')[0],
    landslide: h.hazardScores.landslide,
    flood: h.hazardScores.flood,
    rainfall: h.hazardScores.rainfall
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Multi-Hazard Risk Analytics & SDMA Intelligence
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Statistical vulnerability breakdown across districts, hazard types, and priority indices
          </p>
        </div>
      </div>

      {/* Grid of Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Habitation Risk Severity Breakdown</h3>
          </div>

          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District-wise Priority Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Average Priority Index by District</h3>
          </div>

          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="avgPriority" name="Avg Priority Score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Hazard Correlation Area Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Landslide vs Flood Risk Correlation Across Habitations</h3>
        </div>

        <div className="h-60 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="landslide" name="Landslide Risk %" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              <Area type="monotone" dataKey="flood" name="Flood Risk %" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="rainfall" name="Rainfall Exposure %" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
