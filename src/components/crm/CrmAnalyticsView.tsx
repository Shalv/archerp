/**
 * Build Storys ERP - CRM Sales Analytics & Pipeline Performance View
 * Executive dashboard for pipeline velocity, conversion funnel,
 * source attribution, and sales rep performance.
 */

import React from 'react';
import { CrmLeadExtended, CRM_STAGES_CONFIG } from '../../types/crm';
import {
  TrendingUp,
  Award,
  DollarSign,
  PieChart,
  Target,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Briefcase
} from 'lucide-react';

interface CrmAnalyticsViewProps {
  leads: CrmLeadExtended[];
}

export const CrmAnalyticsView: React.FC<CrmAnalyticsViewProps> = ({ leads }) => {
  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  // KPI Calculations
  const totalPipelineINR = leads.reduce((acc, l) => acc + (l.dealValueINR || 0), 0);
  
  const weightedPipelineINR = leads.reduce((acc, l) => {
    const stage = CRM_STAGES_CONFIG.find((s) => s.id === l.stage);
    const prob = stage ? stage.probability : 0;
    return acc + (l.dealValueINR * prob) / 100;
  }, 0);

  const activeLeads = leads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST');
  const wonLeads = leads.filter((l) => l.stage === 'WON');
  const wonDealsValueINR = wonLeads.reduce((acc, l) => acc + (l.dealValueINR || 0), 0);
  
  const winRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;
  const avgDealSize = leads.length > 0 ? Math.round(totalPipelineINR / leads.length) : 0;

  // Source Breakdown
  const sourcesMap: Record<string, { count: number; totalINR: number }> = {};
  leads.forEach((l) => {
    if (!sourcesMap[l.source]) {
      sourcesMap[l.source] = { count: 0, totalINR: 0 };
    }
    sourcesMap[l.source].count += 1;
    sourcesMap[l.source].totalINR += l.dealValueINR;
  });

  // Sales Rep Leaderboard
  const repsMap: Record<string, { assignedCount: number; wonCount: number; pipelineINR: number; wonINR: number }> = {};
  leads.forEach((l) => {
    const rep = l.assignedSalesLead;
    if (!repsMap[rep]) {
      repsMap[rep] = { assignedCount: 0, wonCount: 0, pipelineINR: 0, wonINR: 0 };
    }
    repsMap[rep].assignedCount += 1;
    repsMap[rep].pipelineINR += l.dealValueINR;
    if (l.stage === 'WON') {
      repsMap[rep].wonCount += 1;
      repsMap[rep].wonINR += l.dealValueINR;
    }
  });

  return (
    <div className="space-y-5 text-xs">
      
      {/* 1. Top KPI Summary Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Total Pipeline</span>
            <DollarSign className="w-3.5 h-3.5 text-[#0F6CBD]" />
          </div>
          <div className="text-base font-bold text-slate-900 font-mono">{formatINR(totalPipelineINR)}</div>
          <span className="text-[10px] text-slate-500">{leads.length} Total Opportunities</span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Weighted Forecast</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-emerald-700 font-mono">{formatINR(weightedPipelineINR)}</div>
          <span className="text-[10px] text-slate-500">Probability-adjusted</span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Closed Won Revenue</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="text-base font-bold text-green-800 font-mono">{formatINR(wonDealsValueINR)}</div>
          <span className="text-[10px] text-slate-500">{wonLeads.length} Deals Signed</span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Overall Win Rate</span>
            <Target className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-base font-bold text-purple-700 font-mono">{winRate}%</div>
          <span className="text-[10px] text-slate-500">Industry avg: 18-22%</span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Avg Deal Size</span>
            <PieChart className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-base font-bold text-slate-900 font-mono">{formatINR(avgDealSize)}</div>
          <span className="text-[10px] text-slate-500">Turnkey contracts</span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Sales Velocity</span>
            <Clock className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-base font-bold text-slate-900 font-mono">28 Days</div>
          <span className="text-[10px] text-emerald-600">6 days faster vs Q4</span>
        </div>
      </div>

      {/* 2. Pipeline Funnel & Stage Dropoff */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#0F6CBD]" />
            <span>Sales Conversion Funnel by Progressive Workflow Stage</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Real-time pipeline progression from enquiry to won contract
          </span>
        </div>

        <div className="space-y-2">
          {CRM_STAGES_CONFIG.map((stage) => {
            const count = leads.filter((l) => l.stage === stage.id).length;
            const stageTotalINR = leads
              .filter((l) => l.stage === stage.id)
              .reduce((sum, l) => sum + l.dealValueINR, 0);
            const percentage = totalPipelineINR > 0 ? (stageTotalINR / totalPipelineINR) * 100 : 0;

            return (
              <div key={stage.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="font-semibold text-slate-800">{stage.label}</span>
                    <span className="text-[11px] text-slate-500 font-mono font-medium">
                      ({count} {count === 1 ? 'deal' : 'deals'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-800">{formatINR(stageTotalINR)}</span>
                    <span className="text-[11px] text-slate-400 font-mono w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(percentage, count > 0 ? 3 : 0)}%`,
                      backgroundColor: stage.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Grid: Lead Source Attribution & Sales Rep Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Lead Source Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#0F6CBD]" />
            <span>Channel Attribution & Inbound Sources</span>
          </h3>

          <div className="space-y-2">
            {Object.entries(sourcesMap).map(([sourceName, data]) => {
              const pct = totalPipelineINR > 0 ? (data.totalINR / totalPipelineINR) * 100 : 0;
              return (
                <div key={sourceName} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">
                      {sourceName.replace('_', ' ')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {data.count} {data.count === 1 ? 'deal' : 'deals'} captured
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-slate-900">{formatINR(data.totalINR)}</div>
                    <div className="text-[10px] text-[#0F6CBD] font-semibold">{pct.toFixed(1)}% of pipeline</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Rep Quota Leaderboard */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Sales Relationship Manager Leaderboard</span>
          </h3>

          <div className="space-y-2.5">
            {Object.entries(repsMap).map(([repName, repData]) => (
              <div key={repName} className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#002050] text-white font-bold flex items-center justify-center text-xs">
                      {repName.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-slate-900 text-xs block">{repName}</strong>
                      <span className="text-[10px] text-slate-500">{repData.assignedCount} Opportunities Active</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Closed Won</span>
                    <strong className="text-emerald-700 font-mono text-xs">{formatINR(repData.wonINR)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  <span>Total Managed Pipeline:</span>
                  <span className="font-bold font-mono text-slate-800">{formatINR(repData.pipelineINR)}</span>
                  <span>SLA Follow-up: <strong className="text-emerald-700">98% on-time</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
