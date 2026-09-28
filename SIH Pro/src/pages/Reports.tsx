import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Habitation, RelocationSite } from '../types';
import { Printer, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Reports: React.FC = () => {
  const { user } = useAuthStore();
  const [district, setDistrict] = useState<string>('ALL');
  const [reportType, setReportType] = useState<string>('EXECUTIVE_SUMMARY');
  const [habitations, setHabitations] = useState<Habitation[]>([]);
  const [sites, setSites] = useState<RelocationSite[]>([]);
  const [generatedDate] = useState<string>(new Date().toLocaleDateString('en-IN', { dateStyle: 'full' }));

  useEffect(() => {
    const fetchData = async () => {
      const [hData, sData] = await Promise.all([
        apiService.getHabitations(district),
        apiService.getRelocationSites(district)
      ]);
      setHabitations(hData);
      setSites(sData);
    };
    fetchData();
  }, [district]);

  const criticalHabitations = habitations.filter((h) => h.riskStatus === 'CRITICAL');
  const totalPopulationAtRisk = habitations.reduce((acc, h) => acc + h.population, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            SDMA Relocation Briefing Generator
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated official report generation for State & Central Disaster Management Authorities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Briefing (PDF)</span>
          </button>
        </div>
      </div>

      {/* Control Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Districts (Maharashtra State)</option>
              <option value="Pune">Pune District</option>
              <option value="Raigad">Raigad District</option>
              <option value="Ratnagiri">Ratnagiri District</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Report Classification</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="EXECUTIVE_SUMMARY">Executive Command Briefing</option>
              <option value="EVACUATION_PRIORITY">Evacuation Priority Register</option>
              <option value="CARRYING_CAPACITY">Carrying Capacity Compliance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Official Briefing Document */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-8 shadow-md max-w-4xl mx-auto text-slate-900 font-sans space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 sm:pb-5 flex flex-col sm:flex-row items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 flex-shrink-0" />
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight uppercase">
                STATE DISASTER MANAGEMENT AUTHORITY
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1">
              RESettleAI Disaster Relocation & Risk Intelligence Assessment
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-extrabold text-indigo-700">CONFIDENTIAL / OFFICIAL</div>
            <div className="text-slate-500 font-medium">{generatedDate}</div>
            <div className="text-slate-500">Ref: SDMA/RELOC/2026/08</div>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase text-slate-800">1. Executive Overview</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            This briefing presents the AI multi-criteria spatial risk assessment for vulnerable habitations in <strong>{district === 'ALL' ? 'Maharashtra State' : district}</strong>. Geotechnical and hydrological sensors flag <strong>{criticalHabitations.length} habitations</strong> as P1 Immediate Evacuation zones affecting <strong>{totalPopulationAtRisk.toLocaleString()} citizens</strong>.
          </p>
        </div>

        {/* Priority Matrix Table Summary */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase text-slate-800">2. Critical Priority Relocation Matrix</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Habitation Name</th>
                  <th className="p-2.5">District</th>
                  <th className="p-2.5">Population</th>
                  <th className="p-2.5">Landslide Risk</th>
                  <th className="p-2.5">Flood Risk</th>
                  <th className="p-2.5">Recommended RS Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {habitations.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold">{h.name}</td>
                    <td className="p-2.5">{h.district}</td>
                    <td className="p-2.5 font-semibold">{h.population}</td>
                    <td className="p-2.5 font-bold text-rose-600">{h.hazardScores.landslide}%</td>
                    <td className="p-2.5 font-bold text-blue-600">{h.hazardScores.flood}%</td>
                    <td className="p-2.5 font-semibold text-indigo-700">{h.recommendedSiteId.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Sites Capacity Summary */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase text-slate-800">3. Verified Candidate Resettlement Hubs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {sites.slice(0, 4).map((s) => (
              <div key={s.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <div className="font-bold text-slate-900">{s.name} ({s.code})</div>
                <div className="text-slate-600 mt-0.5">
                  Suitability: <strong className="text-emerald-600">{s.suitability}%</strong> • Capacity: <strong>{s.assignedCount}/{s.totalCapacity}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-700">
          <div>
            <div className="font-bold">{user?.name || 'Dr. Rajesh Sharma'}</div>
            <div>{user?.role?.replace('_', ' ') || 'SDMA Senior Nodal Officer'}</div>
            <div className="text-slate-400">Maharashtra State SDMA HQ</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-bold">Shri Vikram Deshmukh, IAS</div>
            <div>District Magistrate & Relief Commissioner</div>
            <div className="text-slate-400">Command Control Center</div>
          </div>
        </div>
      </div>
    </div>
  );
};
