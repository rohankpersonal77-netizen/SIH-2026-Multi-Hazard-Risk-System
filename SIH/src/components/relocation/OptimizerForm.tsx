import React, { useState } from 'react';
import type { Habitation, OptimizerInput } from '../../types';
import { Cpu, MapPin, Sparkles, Loader2 } from 'lucide-react';

interface OptimizerFormProps {
  habitations: Habitation[];
  onSubmit: (input: OptimizerInput) => void;
  isLoading?: boolean;
}

export const OptimizerForm: React.FC<OptimizerFormProps> = ({ habitations, onSubmit, isLoading }) => {
  const [selectedHabitationId, setSelectedHabitationId] = useState<string>(habitations[0]?.id || '');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(20);
  const [minSuitabilityPct, setMinSuitabilityPct] = useState<number>(80);
  const [prioritizeInfrastructure, setPrioritizeInfrastructure] = useState<boolean>(true);
  const [preserveCommunityCohesion, setPreserveCommunityCohesion] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      habitationId: selectedHabitationId,
      maxDistanceKm,
      minSuitabilityPct,
      prioritizeInfrastructure,
      preserveCommunityCohesion
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">AI Multi-Criteria Relocation Solver</h3>
          <p className="text-xs text-slate-500">Configure parameters to generate optimal safe resettlement match</p>
        </div>
      </div>

      {/* Target Habitation Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>Select Target High-Risk Habitation</span>
        </label>
        <select
          value={selectedHabitationId}
          onChange={(e) => setSelectedHabitationId(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {habitations.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} ({h.district}) — {h.population} persons [{h.riskStatus}]
            </option>
          ))}
        </select>
      </div>

      {/* Max Distance Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
          <span>Maximum Distance Threshold</span>
          <span className="text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
            {maxDistanceKm} km
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          step="1"
          value={maxDistanceKm}
          onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>5 km (Local)</span>
          <span>50 km (Regional)</span>
        </div>
      </div>

      {/* Min Suitability Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
          <span>Minimum Suitability Threshold</span>
          <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            {minSuitabilityPct}%
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="95"
          step="5"
          value={minSuitabilityPct}
          onChange={(e) => setMinSuitabilityPct(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>50% (Standard)</span>
          <span>95% (High Security)</span>
        </div>
      </div>

      {/* Optimization Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={prioritizeInfrastructure}
            onChange={(e) => setPrioritizeInfrastructure(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Prioritize Healthcare & Education Infrastructure</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={preserveCommunityCohesion}
            onChange={(e) => setPreserveCommunityCohesion(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Preserve Village Community & Caste Cohesion</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 hover:opacity-95 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Computing Spatial Match Matrix...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Execute AI Relocation Solver</span>
          </>
        )}
      </button>
    </form>
  );
};
