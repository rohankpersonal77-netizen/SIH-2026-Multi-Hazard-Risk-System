import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OptimizerForm } from '../components/relocation/OptimizerForm';
import { SiteCard } from '../components/relocation/SiteCard';
import { CapacityCard } from '../components/relocation/CapacityCard';
import { apiService } from '../services/api';
import type { Habitation, OptimizerInput, OptimizerResult } from '../types';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RelocationOptimizer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialHabitationId = searchParams.get('habitationId');
  const [habitations, setHabitations] = useState<Habitation[]>([]);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const habData = await apiService.getHabitations();
      setHabitations(habData);

      const targetHab = habData.find((h) => h.id === initialHabitationId) || habData[0];
      if (targetHab) {
        setLoading(true);
        const res = await apiService.runRelocationOptimizer({
          habitationId: targetHab.id,
          maxDistanceKm: 20,
          minSuitabilityPct: 80,
          prioritizeInfrastructure: true,
          preserveCommunityCohesion: true
        });
        setResult(res);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [initialHabitationId]);

  const handleSolve = async (input: OptimizerInput) => {
    setLoading(true);
    const res = await apiService.runRelocationOptimizer(input);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Multi-Criteria Relocation Solver
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Spatial optimization engine matching high-risk habitations to verified safe resettlement sites
          </p>
        </div>
      </div>

      {/* Main Solver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form */}
        <div className="space-y-4">
          {habitations.length > 0 && (
            <OptimizerForm habitations={habitations} onSubmit={handleSolve} isLoading={loading} />
          )}
        </div>

        {/* Right 2 Columns: Results Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* Primary Recommended Safe Match Card */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-[#0F172A] text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-700/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Sparkles className="w-48 h-48 text-indigo-400" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>PRIMARY SAFE MATCH IDENTIFIED ({result.matchScore}%)</span>
                  </div>

                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Match ID: #OPT-2026-X8</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Target Habitation</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{result.habitation.name}</h3>
                    <p className="text-xs text-slate-300">
                      Population: {result.habitation.population} persons [{result.habitation.riskStatus} RISK]
                    </p>
                  </div>

                  <div className="md:border-l border-slate-700 md:pl-4">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Matched Relocation Site</span>
                    <h3 className="text-lg font-bold text-emerald-400 mt-0.5">{result.primarySite.name} ({result.primarySite.code})</h3>
                    <p className="text-xs text-slate-300">
                      Distance: <strong>{result.primarySite.distanceKm} km</strong> • Suitability: <strong>{result.primarySite.suitability}%</strong>
                    </p>
                  </div>
                </div>

                {/* AI Rationale Box */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs text-indigo-100 leading-relaxed mb-5">
                  <strong>AI Model Rationale:</strong> {result.recommendationReason}
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Budget</span>
                    <strong className="text-white text-sm">{result.estimatedCostINR}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Relocation Timeline</span>
                    <strong className="text-white text-sm">{result.relocationTimeframeWeeks} Weeks</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Safe Capacity Limit</span>
                    <strong className="text-emerald-400 text-sm">{result.carryingCapacityStatus.maxSafeCapacity} Persons</strong>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full mt-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Allocate Relocation Plan</span>
                </button>
              </div>

              {/* Carrying Capacity Assessment */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Target Site Carrying Capacity Assessment</h3>
                <CapacityCard capacity={result.carryingCapacityStatus} />
              </div>

              {/* Fallback Alternatives List */}
              {result.alternativeSites.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Alternative Secondary Safe Matches</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.alternativeSites.map((site) => (
                      <SiteCard key={site.id} site={site} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Confirm Relocation Allocation</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are approving the official SDMA relocation order transferring <strong>{result.habitation.population} residents</strong> from {result.habitation.name} to <strong>{result.primarySite.code} ({result.primarySite.name})</strong>.
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Sanctioned Budget:</span>
                <strong className="text-slate-900">{result.estimatedCostINR}</strong>
              </div>
              <div className="flex justify-between">
                <span>Target Execution Period:</span>
                <strong className="text-slate-900">{result.relocationTimeframeWeeks} Weeks</strong>
              </div>
              <div className="flex justify-between">
                <span>Resource Bottleneck Check:</span>
                <strong className="text-emerald-600">Passed ({result.carryingCapacityStatus.maxSafeCapacity} Capacity)</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Relocation order officially logged in State Disaster Management Registry!');
                  setShowModal(false);
                }}
                className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Confirm Allocation Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
