import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Habitation } from '../../types';
import { 
  ArrowUpDown, 
  Users, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface PriorityTableProps {
  habitations: Habitation[];
}

export const PriorityTable: React.FC<PriorityTableProps> = ({ habitations }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Habitation>('priorityScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleSort = (field: keyof Habitation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHabitations = habitations
    .filter(h => statusFilter === 'ALL' || h.riskStatus === statusFilter)
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const getBadgeClass = (status: Habitation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-rose-50 border-rose-200 text-rose-600 font-bold';
      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-600 font-bold';
      case 'MODERATE':
        return 'bg-yellow-50 border-yellow-200 text-yellow-600 font-medium';
      default:
        return 'bg-emerald-50 border-emerald-200 text-emerald-600 font-medium';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Vulnerability & Relocation Priority Matrix</h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full w-full sm:w-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'SAFE'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] whitespace-nowrap ${
                statusFilter === f ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left text-xs text-slate-700 min-w-[640px]">
          <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Habitation & District</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('population')}>
                <div className="flex items-center gap-1">
                  <span>Population</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Hazard Scores</th>
              <th className="py-3 px-4">Risk Status</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('priorityScore')}>
                <div className="flex items-center gap-1">
                  <span>Priority Index</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredHabitations.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 text-sm">{h.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {h.district} District • {h.taluka} Taluka
                  </div>
                </td>

                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{h.population} persons</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{h.households} households</div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Landslide</span>
                      <span className="font-bold text-rose-600">{h.hazardScores.landslide}%</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Flood</span>
                      <span className="font-bold text-blue-600">{h.hazardScores.flood}%</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] border ${getBadgeClass(h.riskStatus)}`}>
                    {h.riskStatus}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold text-sm text-indigo-700">{h.priorityScore.toFixed(1)}</div>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          h.priorityScore > 85 ? 'bg-rose-500' : h.priorityScore > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${h.priorityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => navigate(`/habitations/${h.id}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg font-semibold text-xs transition-all duration-150 inline-flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
