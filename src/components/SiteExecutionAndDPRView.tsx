/**
 * Build Storys ERP - Site Execution, Daily Progress Reports (DPR) & WBS Scheduling (Pillars 13 & 14)
 * Activity-wise completion %, site diary, labour headcount, material consumption,
 * weather logs, site photographs stream, and Gantt milestone look-ahead planning.
 */

import React, { useState } from 'react';
import {
  HardHat,
  Calendar,
  Clock,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Users,
  Layers,
  CloudSun,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  FileText
} from 'lucide-react';
import { ProjectRecord, UserSession, DailyProgressReport } from '../types/erp';

interface SiteExecutionAndDPRViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

interface DPRRecordExtended extends DailyProgressReport {
  milestonePhase: string;
  overallProgressPercent: number;
}

interface WBSMilestoneTask {
  id: string;
  wbsCode: string;
  taskTitle: string;
  trade: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  completionPercent: number;
  criticalPath: boolean;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' | 'DELAYED';
  varianceDays: number; // 0 = on time, positive = delayed
}

const INITIAL_DPRS: DPRRecordExtended[] = [
  {
    id: 'DPR-001',
    dprCode: 'DPR-2026-03-12',
    date: '2026-03-12',
    weatherCondition: 'Sunny / 31°C Clear Skies (Zero Rain Delay)',
    milestonePhase: 'Phase 3: Civil Waterproofing & Joinery Framing',
    overallProgressPercent: 48,
    labourCountOnSite: {
      masons: 4,
      carpenters: 6,
      electricians: 2,
      plumbers: 2,
      helpers: 8
    },
    activitiesExecuted: [
      'Completed 72-hr ponding test in Master Ensuite sunken slab - 0mm leakage confirmed.',
      'Framing of bedroom 1 & 2 full-height wardrobe carcasses in CenturyPly 18mm BWP.',
      'Chasing wall conduits in Living Room for Lutron lighting keypads and CAT6 cables.'
    ],
    plannedTomorrow: [
      'Apply 2nd coat Dr. Fixit Fastflex in Powder Room and Kitchen wet area.',
      'Delivery of Italian marble slabs from quarry warehouse for living room dry lay.',
      'False ceiling perimeter channel marking with laser level.'
    ],
    issuesDelays: [
      'Freight lift maintenance downtime by society between 1:00 PM - 2:30 PM (No work stoppage, shifted to joinery assembly).'
    ],
    sitePhotographs: [
      { caption: 'Ponding test level marker check', stage: 'Waterproofing', time: '10:30 AM' },
      { caption: 'Master wardrobe carcass plumb verification', stage: 'Carpentry', time: '02:45 PM' }
    ],
    pettyExpensesToday: 2450,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  },
  {
    id: 'DPR-002',
    dprCode: 'DPR-2026-03-11',
    date: '2026-03-11',
    weatherCondition: 'Sunny / 32°C Clear',
    milestonePhase: 'Phase 3: Civil Waterproofing & Joinery Framing',
    overallProgressPercent: 45,
    labourCountOnSite: {
      masons: 4,
      carpenters: 5,
      electricians: 2,
      plumbers: 2,
      helpers: 7
    },
    activitiesExecuted: [
      'Brick partition wall hacking debris bagging and tractor disposal (4 trips).',
      'Surface priming with Dr. Fixit Primeseal over bathroom screed.'
    ],
    plannedTomorrow: [
      'Sunken ponding water filling up to 100mm mark.'
    ],
    issuesDelays: [],
    sitePhotographs: [
      { caption: 'Dining area partition wall dismantled cleanly', stage: 'Demolition', time: '11:15 AM' }
    ],
    pettyExpensesToday: 4800,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  }
];

const INITIAL_WBS: WBSMilestoneTask[] = [
  { id: 'WBS-01', wbsCode: '1.0', taskTitle: 'Demolition & Debris Disposal', trade: 'Civil', durationDays: 10, startDate: '2026-02-15', endDate: '2026-02-25', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 0 },
  { id: 'WBS-02', wbsCode: '2.0', taskTitle: 'Wet Area Waterproofing & Ponding Test', trade: 'Waterproofing', durationDays: 14, startDate: '2026-02-26', endDate: '2026-03-12', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 0 },
  { id: 'WBS-03', wbsCode: '3.0', taskTitle: 'Wardrobe & Kitchen Carcass Joinery Framing', trade: 'Carpentry', durationDays: 20, startDate: '2026-03-08', endDate: '2026-03-28', completionPercent: 45, criticalPath: false, status: 'IN_PROGRESS', varianceDays: 0 },
  { id: 'WBS-04', wbsCode: '4.0', taskTitle: 'Electrical Conduit Chasing & Automation Cabling', trade: 'Electrical', durationDays: 18, startDate: '2026-03-10', endDate: '2026-03-28', completionPercent: 35, criticalPath: true, status: 'IN_PROGRESS', varianceDays: 0 },
  { id: 'WBS-05', wbsCode: '5.0', taskTitle: 'Italian Botticino Marble Laying & Crystallization', trade: 'Flooring', durationDays: 25, startDate: '2026-03-24', endDate: '2026-04-18', completionPercent: 0, criticalPath: true, status: 'UPCOMING', varianceDays: 0 },
  { id: 'WBS-06', wbsCode: '6.0', taskTitle: 'Gypsum False Ceiling Framing & Cove Lighting', trade: 'Ceilings', durationDays: 15, startDate: '2026-04-05', endDate: '2026-04-20', completionPercent: 0, criticalPath: false, status: 'UPCOMING', varianceDays: 0 },
  { id: 'WBS-07', wbsCode: '7.0', taskTitle: 'Veneer Paneling & PU Polish Finishing', trade: 'Polishing', durationDays: 20, startDate: '2026-04-15', endDate: '2026-05-05', completionPercent: 0, criticalPath: true, status: 'UPCOMING', varianceDays: 0 },
  { id: 'WBS-08', wbsCode: '8.0', taskTitle: 'Snagging, Deep Cleaning & Client Handover', trade: 'PMC Handover', durationDays: 10, startDate: '2026-05-06', endDate: '2026-05-16', completionPercent: 0, criticalPath: true, status: 'UPCOMING', varianceDays: 0 }
];

export const SiteExecutionAndDPRView: React.FC<SiteExecutionAndDPRViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'dpr' | 'gantt' | 'photos' | 'issues'>('dpr');
  const [dprs, setDprs] = useState<DPRRecordExtended[]>(INITIAL_DPRS);
  const [selectedDpr, setSelectedDpr] = useState<DPRRecordExtended>(INITIAL_DPRS[0]);
  const [wbsTasks, setWbsTasks] = useState<WBSMilestoneTask[]>(INITIAL_WBS);

  // New DPR quick log state
  const [isAddingDPR, setIsAddingDPR] = useState(false);
  const [newActivity, setNewActivity] = useState('');

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setSelectedDpr({
      ...selectedDpr,
      activitiesExecuted: [...selectedDpr.activitiesExecuted, newActivity.trim()]
    });
    setNewActivity('');
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillars 13 & 14: Site Execution, DPR & WBS Milestone Planning
              </h1>
              <span className="text-xs bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded font-bold">
                Live Site Diary • Critical Path Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Daily Progress Reports (DPR), Labour Attendance Headcount, Weather Delays & Gantt Schedule Look-ahead.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('dpr')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'dpr' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Daily Progress Reports (DPR)
          </button>
          <button
            onClick={() => setActiveTab('gantt')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'gantt' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            WBS Master Gantt Schedule
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('timesheets')}
            className="px-3 py-1.5 rounded text-xs font-bold bg-blue-50 text-[#004a99] hover:bg-blue-100 transition flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>Employee Timesheets (M27)</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('resources')}
            className="px-3 py-1.5 rounded text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            <span>Resource Deployment (M28)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY PROGRESS REPORT (DPR) */}
      {activeTab === 'dpr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: DPR Archives (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Site DPR Logs ({dprs.length})
              </span>
              <button
                onClick={() => alert('New DPR for today created!')}
                className="px-2 py-1 rounded bg-[#004a99] text-white text-[11px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Today's DPR
              </button>
            </div>

            <div className="space-y-2">
              {dprs.map((dpr) => {
                const isSelected = selectedDpr.id === dpr.id;
                const totalLabour = Object.values(dpr.labourCountOnSite).reduce((a, b) => a + b, 0);

                return (
                  <div
                    key={dpr.id}
                    onClick={() => setSelectedDpr(dpr)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-amber-50/60 border-amber-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs font-mono">{dpr.date}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {dpr.overallProgressPercent}% Complete
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 mb-1">
                      Labour: <strong>{totalLabour} Tradesmen on site</strong>
                    </div>

                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {dpr.weatherCondition}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected DPR Deep Dive (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5 text-xs">
            
            {/* DPR Header */}
            <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#004a99] text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                    {selectedDpr.dprCode}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{selectedDpr.milestonePhase}</h2>
                </div>
                <div className="text-slate-500 text-xs mt-1 flex items-center gap-3">
                  <span>Weather: <strong className="text-slate-700">{selectedDpr.weatherCondition}</strong></span>
                  <span>Supervisor: <strong className="text-slate-700">{selectedDpr.siteEngineer}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Overall Project Progress</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">
                  {selectedDpr.overallProgressPercent}%
                </span>
                <span className="block text-[10px] text-slate-400">Petty Cash Today: ₹{selectedDpr.pettyExpensesToday}</span>
              </div>
            </div>

            {/* Labour Attendance Headcount Breakdown */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#004a99]" />
                <span>Daily Labour Force Deployment ({Object.values(selectedDpr.labourCountOnSite).reduce((a, b) => a + b, 0)} Heads)</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Masons</span>
                  <strong className="text-slate-900 text-sm">{selectedDpr.labourCountOnSite.masons}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Carpenters</span>
                  <strong className="text-slate-900 text-sm">{selectedDpr.labourCountOnSite.carpenters}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Electricians</span>
                  <strong className="text-slate-900 text-sm">{selectedDpr.labourCountOnSite.electricians}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Plumbers</span>
                  <strong className="text-slate-900 text-sm">{selectedDpr.labourCountOnSite.plumbers}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Helpers / Labourers</span>
                  <strong className="text-slate-900 text-sm">{selectedDpr.labourCountOnSite.helpers}</strong>
                </div>
              </div>
            </div>

            {/* Activities Executed Today vs Planned Tomorrow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Work Completed Today</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDpr.activitiesExecuted.map((act, idx) => (
                    <div key={idx} className="p-2 bg-emerald-50/60 border border-emerald-200 rounded text-slate-800 text-xs">
                      • {act}
                    </div>
                  ))}
                </div>

                {/* Quick Add Activity Input */}
                <div className="flex items-center gap-1 mt-2">
                  <input
                    type="text"
                    placeholder="Log additional completed activity..."
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="flex-1 p-1.5 border border-slate-300 rounded text-xs"
                  />
                  <button
                    onClick={handleAddActivity}
                    className="px-2.5 py-1.5 bg-[#004a99] text-white rounded font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Planned for Tomorrow</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDpr.plannedTomorrow.map((plan, idx) => (
                    <div key={idx} className="p-2 bg-blue-50/60 border border-blue-200 rounded text-slate-800 text-xs">
                      → {plan}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Issues & Constraints */}
            {selectedDpr.issuesDelays.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Site Delays & Constraints Logged:</span>
                </div>
                {selectedDpr.issuesDelays.map((iss, idx) => (
                  <p key={idx} className="text-amber-950 text-[11px]">{iss}</p>
                ))}
              </div>
            )}

            {/* Site Photographs Stream */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#004a99]" />
                <span>Geotagged Site Photographs ({selectedDpr.sitePhotographs.length})</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedDpr.sitePhotographs.map((photo, idx) => (
                  <div key={idx} className="p-2 rounded border border-slate-200 bg-slate-50 space-y-1">
                    <div className="h-28 bg-slate-800 rounded flex items-center justify-center text-slate-400 font-mono text-[10px]">
                      [Geotagged Site Photo - {photo.stage}]
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800">{photo.caption}</span>
                      <span>{photo.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: WBS MASTER GANTT SCHEDULE (Pillar 14) */}
      {activeTab === 'gantt' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">WBS Project Master Schedule & Critical Path</h3>
              <p className="text-slate-500 text-[11px]">Baseline Start vs Revised Target Completion with Critical Path Identification.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical Path Item
              </span>
              <span className="flex items-center gap-1 text-[11px] ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">WBS</th>
                  <th className="p-3">Milestone Activity</th>
                  <th className="p-3">Trade</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Critical Path</th>
                  <th className="p-3 text-right">Schedule Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wbsTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#004a99]">{t.wbsCode}</td>
                    <td className="p-3 font-bold text-slate-900">{t.taskTitle}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{t.trade}</td>
                    <td className="p-3 text-slate-700">{t.durationDays} Days</td>
                    <td className="p-3 font-mono text-slate-600">{t.startDate}</td>
                    <td className="p-3 font-mono text-slate-600">{t.endDate}</td>
                    <td className="p-3">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${t.completionPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          style={{ width: `${t.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">{t.completionPercent}%</span>
                    </td>
                    <td className="p-3">
                      {t.criticalPath ? (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                          CRITICAL
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
