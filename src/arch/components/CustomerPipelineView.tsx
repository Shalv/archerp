import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building,
  User,
  Calendar,
  ChevronRight,
  MapPin,
  TrendingUp,
  LayoutGrid,
  ListFilter,
  Columns3,
  DollarSign,
  Briefcase,
  Layers,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  BrainCircuit,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateProjectDataScienceProfile } from '../utils/dataScienceEngine';
import { formatINR, formatINRCompact } from '../utils/currency';
import {
  EngagementType,
  SalesStage,
  CRM_SALES_STAGES_ORDER,
  STAGE_WIN_PROBABILITIES,
  ProjectCustomer,
} from '../types';
import {
  SalesStageBadge,
  DesignStatusBadge,
  ExecutionStatusBadge,
  BillingStatusBadge,
  CollectionStatusBadge,
  WarrantyStatusBadge,
  EngagementBadge,
} from './StatusBadges';

interface CustomerPipelineViewProps {
  onSelectProjectTab: (tab: string, projectId: string) => void;
  onOpenNewEnquiry: () => void;
}

type ViewMode = 'kanban' | 'table';
type SortOption = 'value-desc' | 'value-asc' | 'date-desc' | 'urgency';

export const CustomerPipelineView: React.FC<CustomerPipelineViewProps> = ({
  onSelectProjectTab,
  onOpenNewEnquiry,
}) => {
  const {
    projects,
    setActiveProjectId,
    searchQuery,
    setSearchQuery,
    selectedEngagementFilter,
    setSelectedEngagementFilter,
    selectedStageFilter,
    setSelectedStageFilter,
    updateProject,
    advanceProjectStage,
    masterData,
  } = useProject();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [sortOption, setSortOption] = useState<SortOption>('value-desc');
  const [expandedMetric, setExpandedMetric] = useState<
    'pipeline' | 'forecast' | 'winrate' | 'avgdeal' | 'design' | null
  >(null);

  const toggleMetric = (key: 'pipeline' | 'forecast' | 'winrate' | 'avgdeal' | 'design') => {
    setExpandedMetric((current) => (current === key ? null : key));
  };

  const engagementTypes: (EngagementType | 'All')[] = [
    'All',
    'Architecture consultancy',
    'Interior turnkey',
    'Interior design consultancy',
    'Complete design-and-build',
    'Construction execution',
    'Renovation',
    'Landscape',
    'Modular furniture',
  ];

  const salesStages: (SalesStage | 'All')[] = [
    'All',
    'New Enquiry',
    'Site Survey',
    'Requirement Confirmed',
    'Concept Pitch',
    'Commercial Proposal',
    'Negotiation',
    'Won / Contract Signed',
    'Lost',
  ];

  // Pipeline Filtering & Sorting
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          searchQuery === '' ||
          p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.siteCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.organizationOrFamily.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesEngagement =
          selectedEngagementFilter === 'All' || p.engagementType === selectedEngagementFilter;

        const matchesStage =
          selectedStageFilter === 'All' || p.salesStage === selectedStageFilter;

        return matchesSearch && matchesEngagement && matchesStage;
      })
      .sort((a, b) => {
        if (sortOption === 'value-desc') return b.targetBudget - a.targetBudget;
        if (sortOption === 'value-asc') return a.targetBudget - b.targetBudget;
        if (sortOption === 'date-desc')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortOption === 'urgency') {
          const priorityWeight = { Critical: 3, Urgent: 2, Normal: 1 };
          return (
            (priorityWeight[b.nextAction.priority] || 0) -
            (priorityWeight[a.nextAction.priority] || 0)
          );
        }
        return 0;
      });
  }, [projects, searchQuery, selectedEngagementFilter, selectedStageFilter, sortOption]);

  // Financial Metrics Calculation
  const metrics = useMemo(() => {
    const totalCount = projects.length;
    const totalPipelineValue = projects.reduce((sum, p) => sum + (p.targetBudget || 0), 0);
    const weightedForecast = projects.reduce((sum, p) => {
      const prob = p.winProbability ?? STAGE_WIN_PROBABILITIES[p.salesStage] ?? 50;
      return sum + ((p.targetBudget || 0) * prob) / 100;
    }, 0);
    const wonProjects = projects.filter((p) => p.salesStage === 'Won / Contract Signed');
    const wonCount = wonProjects.length;
    const winRatePercent = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;
    const avgDealSize = totalCount > 0 ? Math.round(totalPipelineValue / totalCount) : 0;

    return {
      totalCount,
      totalPipelineValue,
      weightedForecast: Math.round(weightedForecast),
      winRatePercent,
      avgDealSize,
    };
  }, [projects]);

  // Drill-down detail breakdowns surfaced when a KPI tile is clicked
  const metricBreakdowns = useMemo(() => {
    // Pipeline value grouped by engagement route
    const byEngagement: Record<string, { count: number; value: number }> = {};
    projects.forEach((p) => {
      if (!byEngagement[p.engagementType]) byEngagement[p.engagementType] = { count: 0, value: 0 };
      byEngagement[p.engagementType].count += 1;
      byEngagement[p.engagementType].value += p.targetBudget || 0;
    });

    // Weighted forecast grouped by sales stage
    const byStage: Record<string, { count: number; forecast: number }> = {};
    projects.forEach((p) => {
      const prob = p.winProbability ?? STAGE_WIN_PROBABILITIES[p.salesStage] ?? 50;
      if (!byStage[p.salesStage]) byStage[p.salesStage] = { count: 0, forecast: 0 };
      byStage[p.salesStage].count += 1;
      byStage[p.salesStage].forecast += ((p.targetBudget || 0) * prob) / 100;
    });

    // Win / loss / active split
    const won = projects.filter((p) => p.salesStage === 'Won / Contract Signed').length;
    const lost = projects.filter((p) => p.salesStage === 'Lost').length;
    const active = projects.length - won - lost;

    // Average deal size grouped by budget tier
    const byTier: Record<string, { count: number; total: number }> = {};
    projects.forEach((p) => {
      if (!byTier[p.budgetTier]) byTier[p.budgetTier] = { count: 0, total: 0 };
      byTier[p.budgetTier].count += 1;
      byTier[p.budgetTier].total += p.targetBudget || 0;
    });

    // Active design & site execution studios
    const activeStudios = projects.filter((p) => p.conceptOptions.length > 0);

    return { byEngagement, byStage, won, lost, active, byTier, activeStudios };
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider font-mono">
              Enterprise CRM Flow
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Stage Gating &amp; Lifecycle Velocity</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Commercial Pipeline &amp; Deal Flow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Drive deals from initial enquiry and site reconnaissance through 4-5 AI concept options, itemized BOQs, contract execution, and site delivery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Master Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenNewEnquiry}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <span>+ Add New Enquiry</span>
          </button>
        </div>
      </div>

      {/* CRM Financial & Funnel Metrics Bar — every tile is clickable and expands into a detail breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <button
          type="button"
          onClick={() => toggleMetric('pipeline')}
          className={`text-left bg-white p-4 rounded-xl border shadow-xs transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5 ${
            expandedMetric === 'pipeline' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Pipeline Value
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-slate-300 transition-transform shrink-0 ${
                expandedMetric === 'pipeline' ? 'rotate-90 text-slate-700' : ''
              }`}
            />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatINRCompact(metrics.totalPipelineValue)}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Across {metrics.totalCount} active customer deals
          </span>
        </button>

        <button
          type="button"
          onClick={() => toggleMetric('forecast')}
          className={`text-left bg-white p-4 rounded-xl border shadow-xs transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5 ${
            expandedMetric === 'forecast' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider block">
              Weighted Forecast
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-indigo-200 transition-transform shrink-0 ${
                expandedMetric === 'forecast' ? 'rotate-90 text-indigo-600' : ''
              }`}
            />
          </div>
          <p className="text-xl font-bold text-indigo-700 mt-1">
            {formatINRCompact(metrics.weightedForecast)}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Probability-adjusted expected revenue
          </span>
        </button>

        <button
          type="button"
          onClick={() => toggleMetric('winrate')}
          className={`text-left bg-white p-4 rounded-xl border shadow-xs transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5 ${
            expandedMetric === 'winrate' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Win Rate
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-emerald-200 transition-transform shrink-0 ${
                expandedMetric === 'winrate' ? 'rotate-90 text-emerald-600' : ''
              }`}
            />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1">
            {metrics.winRatePercent}%
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Contract executed ratio
          </span>
        </button>

        <button
          type="button"
          onClick={() => toggleMetric('avgdeal')}
          className={`text-left bg-white p-4 rounded-xl border shadow-xs transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5 ${
            expandedMetric === 'avgdeal' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Average Deal Size
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-slate-300 transition-transform shrink-0 ${
                expandedMetric === 'avgdeal' ? 'rotate-90 text-slate-700' : ''
              }`}
            />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatINRCompact(metrics.avgDealSize)}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Per client engagement
          </span>
        </button>

        <button
          type="button"
          onClick={() => toggleMetric('design')}
          className={`text-left bg-white p-4 rounded-xl border shadow-xs transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5 col-span-2 sm:col-span-1 ${
            expandedMetric === 'design' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider block">
              Active Design &amp; Sites
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-amber-200 transition-transform shrink-0 ${
                expandedMetric === 'design' ? 'rotate-90 text-amber-600' : ''
              }`}
            />
          </div>
          <p className="text-xl font-bold text-amber-700 mt-1">
            {metricBreakdowns.activeStudios.length} Studios
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Concept &amp; site execution live
          </span>
        </button>
      </div>

      {/* Drill-Down Detail Panel — populated based on which KPI tile was clicked */}
      {expandedMetric && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs animate-in fade-in duration-150">
          {expandedMetric === 'pipeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pipeline Value by Engagement Route
                </h3>
                <span className="text-[11px] text-slate-400">
                  {formatINRCompact(metrics.totalPipelineValue)} across {metrics.totalCount} deals
                </span>
              </div>
              <div className="space-y-1.5">
                {(Object.entries(metricBreakdowns.byEngagement) as [string, { count: number; value: number }][])
                  .sort((a, b) => b[1].value - a[1].value)
                  .map(([engagement, data]) => (
                    <button
                      key={engagement}
                      type="button"
                      onClick={() => {
                        setSelectedEngagementFilter(engagement as EngagementType);
                        setExpandedMetric(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-slate-700">{engagement}</span>
                      <span className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">{data.count} deals</span>
                        <span className="font-bold text-slate-900 font-mono">{formatINRCompact(data.value)}</span>
                      </span>
                    </button>
                  ))}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">Click a route to filter the board below.</p>
            </div>
          )}

          {expandedMetric === 'forecast' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Weighted Forecast by Sales Stage
                </h3>
                <span className="text-[11px] text-slate-400">Probability-adjusted revenue</span>
              </div>
              <div className="space-y-1.5">
                {CRM_SALES_STAGES_ORDER.map((stage) => {
                  const data = metricBreakdowns.byStage[stage];
                  if (!data) return null;
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => {
                        setSelectedStageFilter(stage);
                        setExpandedMetric(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/70 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-indigo-900">{stage}</span>
                      <span className="flex items-center gap-2 text-xs">
                        <span className="text-indigo-400">{data.count} deals</span>
                        <span className="font-bold text-indigo-700 font-mono">
                          {formatINRCompact(Math.round(data.forecast))}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">Click a stage to filter the board below.</p>
            </div>
          )}

          {expandedMetric === 'winrate' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Deal Outcome Split
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStageFilter('Won / Contract Signed');
                    setExpandedMetric(null);
                  }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Won</span>
                  <span className="text-lg font-bold text-emerald-800">{metricBreakdowns.won}</span>
                </button>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active</span>
                  <span className="text-lg font-bold text-slate-800">{metricBreakdowns.active}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStageFilter('Lost');
                    setExpandedMetric(null);
                  }}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-bold text-rose-700 uppercase block">Lost</span>
                  <span className="text-lg font-bold text-rose-800">{metricBreakdowns.lost}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Win rate of {metrics.winRatePercent}% is calculated as Won ÷ Total across all customer records.
              </p>
            </div>
          )}

          {expandedMetric === 'avgdeal' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Average Deal Size by Budget Tier
              </h3>
              <div className="space-y-1.5">
                {(Object.entries(metricBreakdowns.byTier) as [string, { count: number; total: number }][])
                  .sort((a, b) => b[1].total / b[1].count - a[1].total / a[1].count)
                  .map(([tier, data]) => (
                    <div
                      key={tier}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50"
                    >
                      <span className="text-xs font-semibold text-slate-700">{tier}</span>
                      <span className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">{data.count} deals</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {formatINRCompact(Math.round(data.total / data.count))} avg
                        </span>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {expandedMetric === 'design' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Design &amp; Site Execution Studios
              </h3>
              {metricBreakdowns.activeStudios.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No project currently has generated concept options.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {metricBreakdowns.activeStudios.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setActiveProjectId(p.id);
                        onSelectProjectTab('ai-studio', p.id);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50/60 hover:bg-amber-100/70 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-xs">
                        <span className="font-bold text-amber-900">{p.clientName}</span>
                        <span className="text-amber-600 mx-1.5">•</span>
                        <span className="text-amber-700">{p.siteCity}</span>
                      </span>
                      <span className="flex items-center gap-2 text-[11px] text-amber-700">
                        <span>{p.conceptOptions.length} concepts</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-400 pt-1">Click a project to jump into its AI Concept Studio.</p>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by client name, enquiry ID, address or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Sort and Stage filters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
              >
                <option value="value-desc">Value (High to Low)</option>
                <option value="value-asc">Value (Low to High)</option>
                <option value="urgency">Action Urgency</option>
                <option value="date-desc">Recently Created</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium whitespace-nowrap">Stage:</span>
              <select
                value={selectedStageFilter}
                onChange={(e) => setSelectedStageFilter(e.target.value as SalesStage | 'All')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
              >
                {salesStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage === 'All' ? 'All Sales Stages' : stage}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Engagement Route Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-100 pt-2.5">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Engagement Route:</span>
          {engagementTypes.map((type) => {
            const isSelected = selectedEngagementFilter === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedEngagementFilter(type)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1550px] items-start">
            {CRM_SALES_STAGES_ORDER.map((stage, idx) => {
              const stageDeals = filteredProjects.filter((p) => p.salesStage === stage);
              const stageValue = stageDeals.reduce((sum, p) => sum + (p.targetBudget || 0), 0);
              const probability = STAGE_WIN_PROBABILITIES[stage];

              return (
                <div
                  key={stage}
                  className="flex-1 min-w-[250px] max-w-[300px] bg-slate-100/70 rounded-2xl border border-slate-200/80 flex flex-col max-h-[calc(100vh-280px)]"
                >
                  {/* Stage Column Header */}
                  <div className="p-3.5 border-b border-slate-200 bg-white/70 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 truncate">{stage}</h3>
                      </div>
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="font-semibold text-slate-700">
                        {formatINRCompact(stageValue)}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                        {probability}% Win Prob
                      </span>
                    </div>
                  </div>

                  {/* Deals Stack in Stage */}
                  <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1 min-h-[140px]">
                    {stageDeals.length === 0 ? (
                      <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <span className="text-[11px] text-slate-400 font-medium">No deals in this stage</span>
                      </div>
                    ) : (
                      stageDeals.map((project) => {
                        const hasConcepts = project.conceptOptions.length > 0;
                        const gatesCount = Object.values(
                          project.qualificationChecklist || {}
                        ).filter(Boolean).length;

                        return (
                          <div
                            key={project.id}
                            className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2.5"
                          >
                            {/* Card Top: Client & Enquiry */}
                            <div>
                              <div className="flex items-start justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveProjectId(project.id);
                                    onSelectProjectTab('workspace', project.id);
                                  }}
                                  className="text-xs font-bold text-slate-900 hover:text-indigo-600 text-left transition-colors cursor-pointer truncate block flex-1"
                                >
                                  {project.clientName}
                                </button>
                                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                  {project.enquiryNumber}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {project.organizationOrFamily}
                              </p>
                            </div>

                            {/* Route Pill & Location */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <EngagementBadge type={project.engagementType} />
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[90px]">{project.siteCity}</span>
                              </span>
                            </div>

                            {/* Financials & Scale */}
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Deal Budget</span>
                                <span className="font-bold text-slate-900">
                                  {formatINRCompact(project.targetBudget)}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block font-medium">Area</span>
                                <span className="font-semibold text-slate-700">
                                  {project.builtUpAreaSqFt.toLocaleString()} sq.ft
                                </span>
                              </div>
                            </div>

                            {/* Next Action Banner */}
                            <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100 text-[11px] space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-900">
                                  Next Action
                                </span>
                                <span
                                  className={
                                    project.nextAction.priority === 'Urgent' ||
                                    project.nextAction.priority === 'Critical'
                                      ? 'text-rose-600 font-bold text-[10px]'
                                      : 'text-slate-500 text-[10px]'
                                  }
                                >
                                  Due {project.nextAction.dueDate}
                                </span>
                              </div>
                              <p className="text-slate-800 font-medium line-clamp-1">
                                {project.nextAction.actionTitle}
                              </p>
                              <span className="text-slate-500 text-[10px] block">
                                Assignee: {project.nextAction.assigneeName}
                              </span>
                            </div>

                            {/* ML Predictive Metric Strip */}
                            {(() => {
                              const dsProfile = calculateProjectDataScienceProfile(project, masterData);
                              return (
                                <div className="px-2 py-1 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1 text-slate-700">
                                    <BrainCircuit className="w-3 h-3 text-indigo-600 shrink-0" />
                                    <span className="font-semibold">ML Win:</span>
                                    <span className="font-bold font-mono text-indigo-700">
                                      {dsProfile.predictedWinProbability}%
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveProjectId(project.id);
                                      onSelectProjectTab('analytics', project.id);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 font-bold hover:underline cursor-pointer"
                                  >
                                    Econometrics &rarr;
                                  </button>
                                </div>
                              );
                            })()}

                            {/* Card Footer: Quick Actions */}
                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveProjectId(project.id);
                                  onSelectProjectTab('workspace', project.id);
                                }}
                                className="text-[11px] font-bold text-slate-700 hover:text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <span>Workspace</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                              <div className="flex items-center gap-1">
                                {/* Stage Advance Button */}
                                {idx < CRM_SALES_STAGES_ORDER.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => advanceProjectStage(project.id)}
                                    title={`Advance to ${CRM_SALES_STAGES_ORDER[idx + 1]}`}
                                    className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span>Advance</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveProjectId(project.id);
                                    onSelectProjectTab('ai-studio', project.id);
                                  }}
                                  title="Open AI Design Studio"
                                  className="p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MASTER TABULAR LIST */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Client &amp; Enquiry</th>
                  <th className="py-3 px-4">Route &amp; Typology</th>
                  <th className="py-3 px-4">Deal Value &amp; Scale</th>
                  <th className="py-3 px-4">Sales Stage</th>
                  <th className="py-3 px-4">Design &amp; Execution</th>
                  <th className="py-3 px-4">Next Action</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No project records match the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const winProb =
                      project.winProbability ??
                      STAGE_WIN_PROBABILITIES[project.salesStage] ??
                      50;

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* Client info */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProjectId(project.id);
                              onSelectProjectTab('workspace', project.id);
                            }}
                            className="font-bold text-slate-900 hover:text-indigo-600 text-left block text-xs cursor-pointer"
                          >
                            {project.clientName}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono text-slate-400">
                              {project.enquiryNumber}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">{project.siteCity}</span>
                          </div>
                        </td>

                        {/* Route */}
                        <td className="py-3.5 px-4">
                          <EngagementBadge type={project.engagementType} />
                          <span className="text-[11px] text-slate-500 block mt-1">
                            {project.budgetTier}
                          </span>
                        </td>

                        {/* Value & Area */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            {formatINRCompact(project.targetBudget)}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {project.builtUpAreaSqFt.toLocaleString()} sq.ft
                          </span>
                        </td>

                        {/* Sales Stage with Quick Selector */}
                        <td className="py-3.5 px-4">
                          {(() => {
                            const dsProfile = calculateProjectDataScienceProfile(project, masterData);
                            return (
                              <div className="space-y-1">
                                <select
                                  value={project.salesStage}
                                  onChange={(e) =>
                                    advanceProjectStage(project.id, e.target.value as SalesStage)
                                  }
                                  className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                                >
                                  {CRM_SALES_STAGES_ORDER.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                  <option value="Lost">Lost</option>
                                </select>
                                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                                  <span className="text-slate-400">Stage: {winProb}%</span>
                                  <span>•</span>
                                  <span className="text-indigo-600 font-bold">
                                    ML: {dsProfile.predictedWinProbability}%
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </td>

                        {/* Design & Execution Statuses */}
                        <td className="py-3.5 px-4 space-y-1">
                          <DesignStatusBadge status={project.designStatus} />
                          <div className="pt-0.5">
                            <ExecutionStatusBadge status={project.executionStatus} />
                          </div>
                        </td>

                        {/* Next Action */}
                        <td className="py-3.5 px-4">
                          <p className="text-xs font-medium text-slate-800 max-w-xs truncate">
                            {project.nextAction.actionTitle}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{project.nextAction.assigneeName}</span>
                            <span>•</span>
                            <span
                              className={
                                project.nextAction.priority === 'Urgent' ||
                                project.nextAction.priority === 'Critical'
                                  ? 'text-rose-600 font-bold'
                                  : ''
                              }
                            >
                              Due {project.nextAction.dueDate}
                            </span>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveProjectId(project.id);
                                onSelectProjectTab('analytics', project.id);
                              }}
                              className="p-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                              title="Inspect in ML Predictive Econometrics Hub"
                            >
                              <BrainCircuit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveProjectId(project.id);
                                onSelectProjectTab('workspace', project.id);
                              }}
                              className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                              title="Open Project Workspace"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
