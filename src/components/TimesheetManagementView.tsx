import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  Square, 
  Download, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Edit3, 
  Trash2, 
  Briefcase, 
  DollarSign, 
  FileText,
  Sparkles,
  RefreshCw,
  Users
} from 'lucide-react';
import { TimesheetEntry, ProjectRecord, UserSession } from '../types/erp';
import { timesheetService } from '../services/timesheetService';
import { ResourceMasterItem } from '../data/timesheetAndResourceSeed';

interface TimesheetManagementViewProps {
  project?: ProjectRecord;
  projects?: ProjectRecord[];
  currentUser: UserSession;
  onNavigateToTab?: (tab: string) => void;
  onLogHoursFromTask?: (taskTitle: string, category: string) => void;
}

export const TimesheetManagementView: React.FC<TimesheetManagementViewProps> = ({
  project,
  projects = [],
  currentUser,
  onNavigateToTab
}) => {
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [resources, setResources] = useState<ResourceMasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(project?.id || 'ALL');
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeViewMode, setActiveViewMode] = useState<'LIST' | 'WEEKLY_GRID' | 'TIMER'>('LIST');

  // Week selection state (W47 2024 as in the user's reference)
  const [selectedWeek, setSelectedWeek] = useState<string>('W47 2024');
  const weekDays = [
    { name: 'Mon', date: '2024-11-18', label: '18 Nov' },
    { name: 'Tue', date: '2024-11-19', label: '19 Nov' },
    { name: 'Wed', date: '2024-11-20', label: '20 Nov' },
    { name: 'Thu', date: '2024-11-21', label: '21 Nov' },
    { name: 'Fri', date: '2024-11-22', label: '22 Nov' },
    { name: 'Sat', date: '2024-11-23', label: '23 Nov' },
    { name: 'Sun', date: '2024-11-24', label: '24 Nov' }
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<Partial<TimesheetEntry> | null>(null);

  // Live Timer State
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerTaskTitle, setTimerTaskTitle] = useState<string>('3D Living Room Perspectives');
  const [timerProjectId, setTimerProjectId] = useState<string>(project?.id || 'PROJ-SKYLINE-1402');
  const [timerCategory, setTimerCategory] = useState<TimesheetEntry['category']>('Design');

  const loadData = async () => {
    setLoading(true);
    try {
      const projId = selectedProjectFilter === 'ALL' ? undefined : selectedProjectFilter;
      const empId = selectedEmployeeFilter === 'ALL' ? undefined : selectedEmployeeFilter;
      const data = await timesheetService.getTimesheets(projId, empId);
      setTimesheets(data);
      setResources(timesheetService.getResources().filter(r => r.type === 'EMPLOYEE'));
    } catch (e) {
      console.error('Error loading timesheets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectFilter, selectedEmployeeFilter]);

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSaveTimerEntry = async () => {
    if (timerSeconds < 60) {
      alert('Log at least 1 minute of recorded time.');
      return;
    }
    const loggedHours = Number((timerSeconds / 3600).toFixed(2));
    const matchedEmployee = resources.find(r => r.name.toLowerCase().includes(currentUser.name.toLowerCase())) || resources[0];
    const targetProject = projects.find(p => p.id === timerProjectId) || project;

    await timesheetService.saveTimesheet({
      projectId: timerProjectId,
      projectCode: targetProject?.projectCode || 'PRJ-SKYLINE-1402',
      projectName: targetProject?.title || 'Skyline Residences Unit 1402',
      employeeId: matchedEmployee.id,
      employeeName: matchedEmployee.name,
      employeeRole: matchedEmployee.roleOrCategory,
      employeeAvatar: matchedEmployee.avatar,
      taskTitle: timerTaskTitle,
      category: timerCategory,
      hours: loggedHours,
      date: new Date().toISOString().split('T')[0],
      weekNumber: selectedWeek,
      dayOfWeek: 'Mon',
      billable: true,
      billableRate: matchedEmployee.hourlyBillableRate,
      costRate: matchedEmployee.hourlyCostRate,
      description: `Live session tracker log: ${timerTaskTitle}`,
      status: 'SUBMITTED'
    });

    setTimerActive(false);
    setTimerSeconds(0);
    loadData();
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return timesheets.filter(t => {
      if (selectedProjectFilter !== 'ALL' && t.projectId !== selectedProjectFilter) return false;
      if (selectedEmployeeFilter !== 'ALL' && t.employeeId !== selectedEmployeeFilter) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.employeeName.toLowerCase().includes(q) ||
          t.taskTitle.toLowerCase().includes(q) ||
          t.projectName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [timesheets, selectedProjectFilter, selectedEmployeeFilter, statusFilter, searchQuery]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalHours = filteredEntries.reduce((acc, t) => acc + t.hours, 0);
    const billableHours = filteredEntries.filter(t => t.billable).reduce((acc, t) => acc + t.hours, 0);
    const billableAmount = filteredEntries.reduce((acc, t) => acc + t.totalBillable, 0);
    const totalCost = filteredEntries.reduce((acc, t) => acc + t.totalCost, 0);
    const pendingCount = filteredEntries.filter(t => t.status === 'SUBMITTED').length;
    const utilizationRate = totalHours > 0 ? ((billableHours / totalHours) * 100).toFixed(1) : '0';

    return {
      totalHours: totalHours.toFixed(1),
      billableHours: billableHours.toFixed(1),
      billableAmount,
      totalCost,
      pendingCount,
      utilizationRate
    };
  }, [filteredEntries]);

  // Bulk Approve
  const handleBulkApprove = async () => {
    const pendingIds = filteredEntries.filter(t => t.status === 'SUBMITTED' || t.status === 'DRAFT').map(t => t.id);
    if (pendingIds.length === 0) {
      alert('No pending timesheets to approve.');
      return;
    }
    const count = await timesheetService.bulkApproveTimesheets(pendingIds, currentUser.name);
    alert(`Successfully approved ${count} timesheet entries!`);
    loadData();
  };

  const handleOpenNewEntryModal = (defaults?: Partial<TimesheetEntry>) => {
    const defaultEmp = resources[0] || {
      id: 'RES-01',
      name: 'Ronnie Hart',
      roleOrCategory: 'Team Leader',
      hourlyBillableRate: 2200,
      hourlyCostRate: 1100,
      avatar: ''
    };

    setEditingEntry({
      id: '',
      projectId: project?.id || 'PROJ-SKYLINE-1402',
      projectCode: project?.projectCode || 'PRJ-SKYLINE-1402',
      projectName: project?.title || 'Skyline Residences Unit 1402',
      employeeId: defaultEmp.id,
      employeeName: defaultEmp.name,
      employeeRole: defaultEmp.roleOrCategory,
      employeeAvatar: defaultEmp.avatar,
      taskTitle: 'Floor Plan CAD & GFC Detailing',
      category: 'Design',
      date: '2024-11-18',
      weekNumber: selectedWeek,
      hours: 4.0,
      overtimeHours: 0,
      billable: true,
      billableRate: defaultEmp.hourlyBillableRate,
      costRate: defaultEmp.hourlyCostRate,
      description: '',
      status: 'SUBMITTED',
      ...defaults
    });
    setIsModalOpen(true);
  };

  const handleSaveModalEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    await timesheetService.saveTimesheet(editingEntry);
    setIsModalOpen(false);
    setEditingEntry(null);
    loadData();
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timesheet entry?')) return;
    await timesheetService.deleteTimesheet(id);
    loadData();
  };

  const handleStatusChange = async (id: string, status: TimesheetEntry['status']) => {
    await timesheetService.updateTimesheetStatus(id, status, currentUser.name);
    loadData();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Employee', 'Role', 'Project', 'Task', 'Category', 'Date', 'Week', 'Hours', 'Billable', 'Billable Rate', 'Total Billable (INR)', 'Status', 'Description'];
    const rows = filteredEntries.map(e => [
      e.id,
      `"${e.employeeName}"`,
      `"${e.employeeRole}"`,
      `"${e.projectName}"`,
      `"${e.taskTitle}"`,
      e.category,
      e.date,
      e.weekNumber,
      e.hours,
      e.billable ? 'YES' : 'NO',
      e.billableRate,
      e.totalBillable,
      e.status,
      `"${(e.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Timesheets-${selectedWeek.replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Context Header */}
      <div className="bg-white border border-[#EDEBE9] rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F3F2F1] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#EFF6FC] text-[#0F6CBD] font-semibold text-xs px-2.5 py-0.5 rounded border border-[#C7E0F4] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0F6CBD]" />
                <span>Integrated Project Timesheets</span>
              </span>
              <span className="text-xs text-[#605E5C] font-mono">
                {selectedWeek} • {filteredEntries.length} entries
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#201F1E] mt-1 tracking-tight">
              Timesheets &amp; Employee Hour Allocation
            </h1>
            <p className="text-xs text-[#605E5C] mt-0.5 max-w-2xl">
              Logging team member hours right from the project management app. Track design CAD drafting, site visits, procurement hours, and client billing in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveViewMode('LIST')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                activeViewMode === 'LIST'
                  ? 'bg-[#0F6CBD] text-white shadow-xs'
                  : 'bg-[#F3F2F1] text-[#323130] hover:bg-[#EDEBE9]'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveViewMode('WEEKLY_GRID')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                activeViewMode === 'WEEKLY_GRID'
                  ? 'bg-[#0F6CBD] text-white shadow-xs'
                  : 'bg-[#F3F2F1] text-[#323130] hover:bg-[#EDEBE9]'
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setActiveViewMode('TIMER')}
              className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition ${
                activeViewMode === 'TIMER'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>Live Stopwatch</span>
            </button>
            <button
              onClick={exportCSV}
              className="border border-[#D1D1D1] bg-white text-[#323130] hover:bg-[#F3F2F1] rounded px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#605E5C]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleOpenNewEntryModal()}
              className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white rounded px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Hours</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
          <div className="bg-[#F8F9FA] rounded p-2.5 border border-[#EDEBE9]">
            <span className="text-[11px] font-semibold text-[#605E5C] uppercase tracking-wider block">
              Total Logged
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-[#201F1E]">{stats.totalHours}</span>
              <span className="text-[11px] text-[#605E5C]">hrs</span>
            </div>
            <span className="text-[10px] text-[#0F6CBD] font-medium block mt-0.5">Across all trades</span>
          </div>

          <div className="bg-[#F8F9FA] rounded p-2.5 border border-[#EDEBE9]">
            <span className="text-[11px] font-semibold text-[#605E5C] uppercase tracking-wider block">
              Billable Hours
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-[#107C41]">{stats.billableHours}</span>
              <span className="text-[11px] text-[#605E5C]">hrs</span>
            </div>
            <span className="text-[10px] text-[#107C41] font-semibold block mt-0.5">
              {stats.utilizationRate}% Billable Rate
            </span>
          </div>

          <div className="bg-[#F8F9FA] rounded p-2.5 border border-[#EDEBE9]">
            <span className="text-[11px] font-semibold text-[#605E5C] uppercase tracking-wider block">
              Billable Value
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-[#107C41]">
                ₹{(stats.billableAmount / 1000).toFixed(1)}k
              </span>
            </div>
            <span className="text-[10px] text-[#605E5C] font-mono block mt-0.5">
              ₹{stats.billableAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-[#F8F9FA] rounded p-2.5 border border-[#EDEBE9]">
            <span className="text-[11px] font-semibold text-[#605E5C] uppercase tracking-wider block">
              Direct Cost
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-[#A80000]">
                ₹{(stats.totalCost / 1000).toFixed(1)}k
              </span>
            </div>
            <span className="text-[10px] text-[#605E5C] font-mono block mt-0.5">
              Margin: ₹{(stats.billableAmount - stats.totalCost).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-[#F8F9FA] rounded p-2.5 border border-[#EDEBE9]">
            <span className="text-[11px] font-semibold text-[#605E5C] uppercase tracking-wider block">
              Pending Approvals
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-lg font-bold ${stats.pendingCount > 0 ? 'text-[#D83B01]' : 'text-[#107C41]'}`}>
                {stats.pendingCount}
              </span>
              <span className="text-[11px] text-[#605E5C]">entries</span>
            </div>
            {stats.pendingCount > 0 ? (
              <button 
                onClick={handleBulkApprove} 
                className="text-[10px] text-[#0F6CBD] hover:underline font-semibold block mt-0.5"
              >
                Approve All Pending
              </button>
            ) : (
              <span className="text-[10px] text-[#107C41] font-medium block mt-0.5">All up to date</span>
            )}
          </div>

          <div className="bg-[#F8F9FA] rounded p-2.5 border border-[#EDEBE9]">
            <span className="text-[11px] font-semibold text-[#605E5C] uppercase tracking-wider block">
              Active Team
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-[#201F1E]">{resources.length}</span>
              <span className="text-[11px] text-[#605E5C]">members</span>
            </div>
            <span className="text-[10px] text-[#0F6CBD] font-medium block mt-0.5">Architects &amp; PMs</span>
          </div>
        </div>
      </div>

      {/* Live Stopwatch Tracker Section (When active or toggled) */}
      {activeViewMode === 'TIMER' && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-lg p-5 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="bg-purple-700/60 text-purple-200 text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border border-purple-500/30">
                Live Interactive Time Tracker
              </span>
              <h2 className="text-xl font-bold mt-1 text-white">
                Task Stopwatch &amp; Direct Timesheet Logger
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Run this live stopwatch while working on AutoCAD drawings, 3D renders, or client meetings to automatically post exact billable minutes.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-purple-950/60 border border-purple-700/40 rounded-xl px-5 py-3 shadow-inner">
              <Clock className={`w-6 h-6 ${timerActive ? 'text-amber-400 animate-pulse' : 'text-purple-300'}`} />
              <div className="text-3xl font-mono font-bold tracking-wider text-amber-300">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex items-center gap-2">
                {!timerActive ? (
                  <button
                    onClick={() => setTimerActive(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg flex items-center gap-1 font-semibold text-xs shadow"
                    title="Start Live Timer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setTimerActive(false)}
                    className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg flex items-center gap-1 font-semibold text-xs shadow"
                    title="Pause Timer"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  onClick={handleSaveTimerEntry}
                  disabled={timerSeconds === 0}
                  className="bg-[#0F6CBD] hover:bg-[#005A9E] disabled:opacity-50 text-white px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Save to Timesheet</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-purple-800/60">
            <div>
              <label className="text-[11px] text-purple-200 font-semibold block mb-1">Target Project</label>
              <select
                value={timerProjectId}
                onChange={e => setTimerProjectId(e.target.value)}
                className="w-full bg-purple-950/80 border border-purple-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value="PROJ-SKYLINE-1402">Skyline Residences Unit 1402 (Turnkey)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.projectCode})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-purple-200 font-semibold block mb-1">Task Name</label>
              <input
                type="text"
                value={timerTaskTitle}
                onChange={e => setTimerTaskTitle(e.target.value)}
                placeholder="e.g. 3D Living Room Perspectives"
                className="w-full bg-purple-950/80 border border-purple-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-purple-200 font-semibold block mb-1">Category &amp; Trade</label>
              <select
                value={timerCategory}
                onChange={e => setTimerCategory(e.target.value as any)}
                className="w-full bg-purple-950/80 border border-purple-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value="Design">Design &amp; 3D Render</option>
                <option value="Onsite">Onsite Supervision &amp; Survey</option>
                <option value="MEP">MEP &amp; HVAC Coordination</option>
                <option value="Procurement">Materials &amp; Procurement</option>
                <option value="Admin">Admin &amp; Approvals</option>
                <option value="Consulting">Consulting &amp; Review</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Control Bar */}
      <div className="bg-white border border-[#EDEBE9] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Week Selector */}
          <div className="flex items-center bg-[#F3F2F1] rounded border border-[#EDEBE9] px-2 py-1">
            <button
              onClick={() => setSelectedWeek('W46 2024')}
              className="text-[#605E5C] hover:text-[#201F1E] p-0.5"
              title="Previous week"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold text-xs px-2 text-[#201F1E] font-mono">
              {selectedWeek} (18-24 Nov)
            </span>
            <button
              onClick={() => setSelectedWeek('W48 2024')}
              className="text-[#605E5C] hover:text-[#201F1E] p-0.5"
              title="Next week"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#605E5C] font-medium">Project:</span>
            <select
              value={selectedProjectFilter}
              onChange={e => setSelectedProjectFilter(e.target.value)}
              className="border border-[#EDEBE9] rounded px-2.5 py-1 bg-white focus:ring-1 focus:ring-[#0F6CBD] text-xs max-w-44"
            >
              <option value="ALL">All Projects</option>
              <option value="PROJ-SKYLINE-1402">Skyline Residences Unit 1402</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Employee Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#605E5C] font-medium">Employee:</span>
            <select
              value={selectedEmployeeFilter}
              onChange={e => setSelectedEmployeeFilter(e.target.value)}
              className="border border-[#EDEBE9] rounded px-2.5 py-1 bg-white focus:ring-1 focus:ring-[#0F6CBD] text-xs max-w-44"
            >
              <option value="ALL">All Team Members</option>
              {resources.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.roleOrCategory})</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F3F2F1] p-0.5 rounded border border-[#EDEBE9]">
            {['ALL', 'DRAFT', 'SUBMITTED', 'APPROVED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  statusFilter === status
                    ? 'bg-white text-[#0F6CBD] shadow-2xs'
                    : 'text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-48">
          <Search className="w-3.5 h-3.5 text-[#8A8886] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task, notes, person…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 border border-[#EDEBE9] rounded text-xs focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none"
          />
        </div>
      </div>

      {/* VIEW 1: DETAILED LIST TABLE */}
      {activeViewMode === 'LIST' && (
        <div className="bg-white border border-[#EDEBE9] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] text-[#605E5C] font-semibold border-b border-[#EDEBE9] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Employee &amp; Role</th>
                  <th className="py-2.5 px-3">Project &amp; Work Package</th>
                  <th className="py-2.5 px-3">Task &amp; Deliverable</th>
                  <th className="py-2.5 px-2">Date</th>
                  <th className="py-2.5 px-2 text-center">Hours</th>
                  <th className="py-2.5 px-2 text-center">Billable</th>
                  <th className="py-2.5 px-3 text-right">Rates (Cost / Bill)</th>
                  <th className="py-2.5 px-3 text-right">Total Billable</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE9]">
                {filteredEntries.map(entry => {
                  const isSubmitted = entry.status === 'SUBMITTED';
                  const isApproved = entry.status === 'APPROVED';

                  return (
                    <tr key={entry.id} className="hover:bg-[#F8F9FA] transition">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {entry.employeeAvatar ? (
                            <img
                              src={entry.employeeAvatar}
                              alt={entry.employeeName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#EFF6FC] text-[#0F6CBD] font-bold flex items-center justify-center text-[10px]">
                              {entry.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-[#201F1E] block">
                              {entry.employeeName}
                            </span>
                            <span className="text-[10px] text-[#605E5C] block">
                              {entry.employeeRole}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-medium text-[#201F1E] block">
                          {entry.projectName}
                        </span>
                        <span className="text-[10px] font-mono text-[#0F6CBD]">
                          {entry.projectCode}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            entry.category === 'Design' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            entry.category === 'Onsite' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            entry.category === 'MEP' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {entry.category}
                          </span>
                          <span className="font-semibold text-[#201F1E] truncate">
                            {entry.taskTitle}
                          </span>
                        </div>
                        {entry.description && (
                          <p className="text-[11px] text-[#605E5C] mt-0.5 line-clamp-1">
                            {entry.description}
                          </p>
                        )}
                      </td>

                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className="text-[#201F1E] font-medium block">{entry.date}</span>
                        <span className="text-[10px] text-[#8A8886]">{entry.dayOfWeek || 'Mon'}</span>
                      </td>

                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className="font-bold text-sm text-[#201F1E] font-mono">
                          {entry.hours.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-[#605E5C]"> hrs</span>
                        {entry.overtimeHours && entry.overtimeHours > 0 ? (
                          <span className="block text-[9px] text-[#D83B01] font-semibold">
                            +{entry.overtimeHours}h OT
                          </span>
                        ) : null}
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        {entry.billable ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                            Billable
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-1.5 py-0.5 rounded">
                            Non-Billable
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                        <span className="text-[#605E5C] block">₹{entry.costRate}/h cost</span>
                        <span className="text-[#107C41] font-semibold block">₹{entry.billableRate}/h bill</span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold font-mono text-sm text-[#107C41] block">
                          ₹{entry.totalBillable.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#8A8886] font-mono block">
                          Cost: ₹{entry.totalCost.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        {entry.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 bg-[#DFF6DD] text-[#107C41] text-[10px] font-bold px-2 py-0.5 rounded border border-[#107C41]/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        ) : entry.status === 'SUBMITTED' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Submitted</span>
                          </span>
                        ) : entry.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-300">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            <span>Draft</span>
                          </span>
                        )}
                        {entry.approvedBy && (
                          <span className="text-[9px] text-[#8A8886] block mt-0.5">
                            by {entry.approvedBy}
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {isSubmitted && (
                            <button
                              onClick={() => handleStatusChange(entry.id, 'APPROVED')}
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Approve timesheet"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingEntry(entry);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-[#0F6CBD] hover:bg-[#EFF6FC] rounded"
                            title="Edit entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredEntries.length === 0 && (
              <div className="py-12 text-center text-xs text-[#605E5C]">
                <Clock className="w-8 h-8 text-[#C8C6C4] mx-auto mb-2" />
                <p className="font-semibold text-sm text-[#323130]">No timesheet records found.</p>
                <p className="mt-1">Click "Log Hours" to log your first work session or adjust filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: WEEKLY GRID MATRIX (Employees x Mon-Sun Days) */}
      {activeViewMode === 'WEEKLY_GRID' && (
        <div className="bg-white border border-[#EDEBE9] rounded-lg shadow-xs p-4">
          <div className="flex items-center justify-between mb-3 border-b border-[#EDEBE9] pb-2">
            <div>
              <h3 className="font-bold text-sm text-[#201F1E]">Weekly Employee Timesheet Matrix</h3>
              <p className="text-xs text-[#605E5C]">Click on any cell to log or adjust hours for that specific day.</p>
            </div>
            <div className="text-xs text-[#605E5C]">
              Standard capacity: <span className="font-bold text-[#201F1E]">40 hrs / week</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] text-[#605E5C] border-b border-[#EDEBE9]">
                  <th className="p-3 w-56">Employee &amp; Role</th>
                  {weekDays.map(day => (
                    <th key={day.name} className="p-3 text-center border-l border-[#EDEBE9]">
                      <span className="font-bold text-[#201F1E] block">{day.name}</span>
                      <span className="text-[10px] text-[#605E5C] block">{day.label}</span>
                    </th>
                  ))}
                  <th className="p-3 text-center border-l border-[#EDEBE9] bg-[#EFF6FC] text-[#0F6CBD] font-bold">
                    Total
                  </th>
                  <th className="p-3 text-center border-l border-[#EDEBE9]">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE9]">
                {resources.map(res => {
                  const resEntries = timesheets.filter(t => t.employeeId === res.id);
                  const totalWeeklyHours = resEntries.reduce((acc, t) => acc + t.hours, 0);
                  const capacityPercent = Math.min(100, Math.round((totalWeeklyHours / 40) * 100));

                  return (
                    <tr key={res.id} className="hover:bg-[#F8F9FA]">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {res.avatar ? (
                            <img src={res.avatar} alt={res.name} className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#0F6CBD] text-white font-bold flex items-center justify-center text-[10px]">
                              {res.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-[#201F1E] block">{res.name}</span>
                            <span className="text-[10px] text-[#605E5C] block">{res.roleOrCategory}</span>
                          </div>
                        </div>
                      </td>

                      {weekDays.map(day => {
                        const dayEntries = resEntries.filter(t => t.date === day.date);
                        const dayHours = dayEntries.reduce((acc, t) => acc + t.hours, 0);

                        return (
                          <td 
                            key={day.name} 
                            onClick={() => handleOpenNewEntryModal({
                              employeeId: res.id,
                              employeeName: res.name,
                              employeeRole: res.roleOrCategory,
                              employeeAvatar: res.avatar,
                              date: day.date,
                              dayOfWeek: day.name,
                              billableRate: res.hourlyBillableRate,
                              costRate: res.hourlyCostRate
                            })}
                            className="p-2.5 text-center border-l border-[#EDEBE9] hover:bg-[#EFF6FC] cursor-pointer transition"
                            title={`Log time for ${res.name} on ${day.name} ${day.label}`}
                          >
                            {dayHours > 0 ? (
                              <div className="inline-block px-2 py-1 rounded bg-[#EFF6FC] border border-[#C7E0F4]">
                                <span className={`font-mono font-bold text-xs ${dayHours > 8 ? 'text-[#D83B01]' : 'text-[#0F6CBD]'}`}>
                                  {dayHours.toFixed(1)}h
                                </span>
                              </div>
                            ) : (
                              <span className="text-[#C8C6C4] hover:text-[#0F6CBD] text-xs font-semibold">+</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="p-3 text-center border-l border-[#EDEBE9] bg-[#EFF6FC]/50 font-bold font-mono text-sm text-[#0F6CBD]">
                        {totalWeeklyHours.toFixed(1)}h
                      </td>

                      <td className="p-3 border-l border-[#EDEBE9] w-36">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-[#EDEBE9] rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                capacityPercent >= 100 ? 'bg-[#107C41]' :
                                capacityPercent >= 50 ? 'bg-[#0F6CBD]' : 'bg-amber-500'
                              }`}
                              style={{ width: `${capacityPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[#605E5C] shrink-0">
                            {capacityPercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: LOG / EDIT TIMESHEET ENTRY */}
      {isModalOpen && editingEntry && (
        <div 
          role="dialog" 
          aria-modal="true" 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#EDEBE9] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0F6CBD] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <h3 className="font-bold text-sm">
                  {editingEntry.id ? 'Edit Timesheet Entry' : 'Log New Project Hours'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModalEntry} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Employee Selection */}
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Team Member *</label>
                  <select
                    value={editingEntry.employeeId}
                    onChange={e => {
                      const found = resources.find(r => r.id === e.target.value);
                      if (found) {
                        setEditingEntry({
                          ...editingEntry,
                          employeeId: found.id,
                          employeeName: found.name,
                          employeeRole: found.roleOrCategory,
                          employeeAvatar: found.avatar,
                          billableRate: found.hourlyBillableRate,
                          costRate: found.hourlyCostRate
                        });
                      }
                    }}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD] bg-white font-medium"
                    required
                  >
                    {resources.map(r => (
                      <option key={r.id} value={r.id}>{r.name} — {r.roleOrCategory}</option>
                    ))}
                  </select>
                </div>

                {/* Project Selection */}
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Project *</label>
                  <select
                    value={editingEntry.projectId}
                    onChange={e => {
                      const p = projects.find(prj => prj.id === e.target.value) || project;
                      setEditingEntry({
                        ...editingEntry,
                        projectId: e.target.value,
                        projectCode: p?.projectCode || 'PRJ-SKYLINE-1402',
                        projectName: p?.title || 'Skyline Residences Unit 1402'
                      });
                    }}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD] bg-white font-medium"
                    required
                  >
                    <option value="PROJ-SKYLINE-1402">Skyline Residences Unit 1402</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#201F1E] block mb-1">Task / Activity *</label>
                  <input
                    type="text"
                    value={editingEntry.taskTitle || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, taskTitle: e.target.value })}
                    placeholder="e.g. 3D Living Room Perspectives"
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Category</label>
                  <select
                    value={editingEntry.category || 'Design'}
                    onChange={e => setEditingEntry({ ...editingEntry, category: e.target.value as any })}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD] bg-white"
                  >
                    <option value="Design">Design &amp; 3D</option>
                    <option value="Onsite">Onsite Execution</option>
                    <option value="MEP">MEP &amp; HVAC</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Admin">Admin &amp; Approvals</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
              </div>

              {/* Date, Hours, Overtime */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Date *</label>
                  <input
                    type="date"
                    value={editingEntry.date || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, date: e.target.value })}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Regular Hours *</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="24"
                    value={editingEntry.hours || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, hours: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="12"
                    value={editingEntry.overtimeHours || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, overtimeHours: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD]"
                  />
                </div>
              </div>

              {/* Billable Rates & Checkbox */}
              <div className="p-3 bg-[#F8F9FA] rounded border border-[#EDEBE9] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 sm:col-span-1 pt-3">
                  <input
                    type="checkbox"
                    id="billableCheck"
                    checked={editingEntry.billable !== false}
                    onChange={e => setEditingEntry({ ...editingEntry, billable: e.target.checked })}
                    className="w-4 h-4 text-[#0F6CBD] rounded"
                  />
                  <label htmlFor="billableCheck" className="font-semibold text-[#201F1E] cursor-pointer">
                    Client Billable
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-[#605E5C] font-semibold block mb-0.5">Billing Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={editingEntry.billableRate || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, billableRate: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[#EDEBE9] rounded p-1.5 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#605E5C] font-semibold block mb-0.5">Internal Cost (₹/hr)</label>
                  <input
                    type="number"
                    value={editingEntry.costRate || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, costRate: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[#EDEBE9] rounded p-1.5 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-[#201F1E] block mb-1">Description &amp; Deliverables Completed</label>
                <textarea
                  rows={3}
                  value={editingEntry.description || ''}
                  onChange={e => setEditingEntry({ ...editingEntry, description: e.target.value })}
                  placeholder="Detail work performed, drawing sheets completed, or site issues identified..."
                  className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="font-semibold text-[#201F1E] block mb-1">Workflow Status</label>
                <select
                  value={editingEntry.status || 'SUBMITTED'}
                  onChange={e => setEditingEntry({ ...editingEntry, status: e.target.value as any })}
                  className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                >
                  <option value="DRAFT">Draft (Save only)</option>
                  <option value="SUBMITTED">Submitted (Pending PM review)</option>
                  <option value="APPROVED">Approved</option>
                  <option value="INVOICED">Invoiced to Client</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDEBE9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-[#EDEBE9] text-[#323130] hover:bg-[#F3F2F1] rounded px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white rounded px-5 py-2 font-semibold shadow-xs"
                >
                  Save Timesheet Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
