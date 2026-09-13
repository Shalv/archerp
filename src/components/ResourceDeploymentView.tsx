import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  Wrench, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Edit3, 
  Trash2, 
  Sparkles, 
  RefreshCw,
  Eye,
  SlidersHorizontal,
  FolderKanban
} from 'lucide-react';
import { ResourceDeployment, ProjectRecord, UserSession } from '../types/erp';
import { timesheetService } from '../services/timesheetService';
import { ResourceMasterItem } from '../data/timesheetAndResourceSeed';

interface ResourceDeploymentViewProps {
  project?: ProjectRecord;
  projects?: ProjectRecord[];
  currentUser: UserSession;
  onNavigateToTab?: (tab: string) => void;
}

export const ResourceDeploymentView: React.FC<ResourceDeploymentViewProps> = ({
  project,
  projects = [],
  currentUser,
  onNavigateToTab
}) => {
  const [deployments, setDeployments] = useState<ResourceDeployment[]>([]);
  const [resources, setResources] = useState<ResourceMasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWeek, setSelectedWeek] = useState<string>('W47 2024');
  const [resourceTypeTab, setResourceTypeTab] = useState<'ALL' | 'EMPLOYEE' | 'EQUIPMENT'>('ALL');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(project?.id || 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDep, setEditingDep] = useState<Partial<ResourceDeployment> | null>(null);

  const weekDays = [
    { name: 'Mon', date: '2024-11-18', label: '18 Nov' },
    { name: 'Tue', date: '2024-11-19', label: '19 Nov' },
    { name: 'Wed', date: '2024-11-20', label: '20 Nov' },
    { name: 'Thu', date: '2024-11-21', label: '21 Nov' },
    { name: 'Fri', date: '2024-11-22', label: '22 Nov' },
    { name: 'Sat', date: '2024-11-23', label: '23 Nov' },
    { name: 'Sun', date: '2024-11-24', label: '24 Nov' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const projId = selectedProjectFilter === 'ALL' ? undefined : selectedProjectFilter;
      const deps = await timesheetService.getDeployments(selectedWeek, projId);
      setDeployments(deps);
      setResources(timesheetService.getResources());
    } catch (e) {
      console.error('Error loading deployments', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedWeek, selectedProjectFilter]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      if (resourceTypeTab !== 'ALL' && res.type !== resourceTypeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.name.toLowerCase().includes(q) ||
          res.roleOrCategory.toLowerCase().includes(q) ||
          (res.department && res.department.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [resources, resourceTypeTab, searchQuery]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalResources = resources.length;
    const totalPeople = resources.filter(r => r.type === 'EMPLOYEE').length;
    const totalEquipment = resources.filter(r => r.type === 'EQUIPMENT').length;
    const totalAllocatedHours = deployments.reduce((acc, d) => acc + d.durationHours, 0);
    const activeDeploymentsCount = deployments.length;

    return {
      totalResources,
      totalPeople,
      totalEquipment,
      totalAllocatedHours: totalAllocatedHours.toFixed(1),
      activeDeploymentsCount
    };
  }, [resources, deployments]);

  // Handle Deploy Modal
  const handleOpenDeployModal = (defaults?: Partial<ResourceDeployment>) => {
    const firstRes = resources[0];
    setEditingDep({
      id: '',
      resourceId: firstRes?.id || 'RES-01',
      resourceName: firstRes?.name || 'Ronnie Hart',
      resourceType: firstRes?.type || 'EMPLOYEE',
      roleOrCategory: firstRes?.roleOrCategory || 'Team Leader',
      avatar: firstRes?.avatar || '',
      projectId: project?.id || 'PROJ-SKYLINE-1402',
      projectCode: project?.projectCode || 'PRJ-SKYLINE-1402',
      projectTitle: project?.title || 'Skyline Residences Unit 1402',
      taskName: 'Site Execution Oversight',
      date: '2024-11-18',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      durationHours: 8.0,
      shiftLabel: '8:00 AM - 4:00 PM - Site Execution',
      colorTheme: 'orange',
      utilizationPercent: 100,
      status: 'CONFIRMED',
      ...defaults
    });
    setIsModalOpen(true);
  };

  const handleSaveDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDep) return;

    await timesheetService.saveDeployment(editingDep);
    setIsModalOpen(false);
    setEditingDep(null);
    loadData();
  };

  const handleDeleteDeployment = async (id: string) => {
    if (!confirm('Remove this resource deployment schedule?')) return;
    await timesheetService.deleteDeployment(id);
    loadData();
  };

  // Color helper matching Image 2
  const getColorClasses = (colorTheme: ResourceDeployment['colorTheme']) => {
    switch (colorTheme) {
      case 'orange':
        return 'bg-[#FFF4CE] text-[#795B00] border border-[#FFD335] hover:bg-[#FFE885]';
      case 'blue':
        return 'bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] hover:bg-[#DEECF9]';
      case 'teal':
        return 'bg-[#E1DFDD]/30 text-[#004E8C] border border-[#00B7C3]/50 hover:bg-[#00B7C3]/10';
      case 'purple':
        return 'bg-[#F3E8FF] text-[#6B21A8] border border-[#D8B4FE] hover:bg-[#E9D5FF]';
      case 'green':
        return 'bg-[#DFF6DD] text-[#107C41] border border-[#8AD68A] hover:bg-[#C8F0C6]';
      case 'amber':
        return 'bg-[#FFF1D2] text-[#8F4700] border border-[#F6BD60] hover:bg-[#FFE3A7]';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Context Card */}
      <div className="bg-white border border-[#EDEBE9] rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F3F2F1] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#DFF6DD] text-[#107C41] font-semibold text-xs px-2.5 py-0.5 rounded border border-[#8AD68A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Project-Wise Resource Deployment</span>
              </span>
              <span className="text-xs text-[#605E5C] font-mono">
                {selectedWeek} • Visual Team &amp; Asset Matrix
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#201F1E] mt-1 tracking-tight">
              Schedule: Resource Deployment Matrix
            </h1>
            <p className="text-xs text-[#605E5C] mt-0.5 max-w-2xl">
              Coordinate architects, project managers, MEP consultants, LiDAR 3D scanners, and specialized carpentry equipment across all turnkey projects.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Week navigation */}
            <div className="flex items-center bg-[#F3F2F1] rounded border border-[#EDEBE9] px-2.5 py-1">
              <button
                onClick={() => setSelectedWeek('W46 2024')}
                className="text-[#605E5C] hover:text-[#201F1E] p-0.5"
                title="Previous week"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-xs px-2 text-[#201F1E] font-mono">
                {selectedWeek} (18 - 24 Nov 2024)
              </span>
              <button
                onClick={() => setSelectedWeek('W48 2024')}
                className="text-[#605E5C] hover:text-[#201F1E] p-0.5"
                title="Next week"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setSelectedWeek('W47 2024')}
              className="border border-[#D1D1D1] bg-white text-[#323130] hover:bg-[#F3F2F1] rounded px-3 py-1.5 text-xs font-semibold"
            >
              Today
            </button>

            <button
              onClick={() => handleOpenDeployModal()}
              className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white rounded px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deploy Resource</span>
            </button>
          </div>
        </div>

        {/* Quick Legend & Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#605E5C] font-semibold">Filter View:</span>
            <div className="flex items-center bg-[#F3F2F1] p-0.5 rounded border border-[#EDEBE9]">
              <button
                onClick={() => setResourceTypeTab('ALL')}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  resourceTypeTab === 'ALL'
                    ? 'bg-white text-[#0F6CBD] shadow-2xs'
                    : 'text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                All Resources ({resources.length})
              </button>
              <button
                onClick={() => setResourceTypeTab('EMPLOYEE')}
                className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1 ${
                  resourceTypeTab === 'EMPLOYEE'
                    ? 'bg-white text-[#0F6CBD] shadow-2xs'
                    : 'text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Team Members ({summaryMetrics.totalPeople})</span>
              </button>
              <button
                onClick={() => setResourceTypeTab('EQUIPMENT')}
                className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1 ${
                  resourceTypeTab === 'EQUIPMENT'
                    ? 'bg-white text-[#0F6CBD] shadow-2xs'
                    : 'text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Equipment &amp; Tools ({summaryMetrics.totalEquipment})</span>
              </button>
            </div>
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#605E5C] font-medium">Project:</span>
            <select
              value={selectedProjectFilter}
              onChange={e => setSelectedProjectFilter(e.target.value)}
              className="border border-[#EDEBE9] rounded px-2.5 py-1 bg-white focus:ring-1 focus:ring-[#0F6CBD] text-xs font-medium max-w-56"
            >
              <option value="ALL">All Active Projects</option>
              <option value="PROJ-SKYLINE-1402">Skyline Residences Unit 1402</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3 h-3 text-[#8A8886] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resource..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-7 pr-2.5 py-1 border border-[#EDEBE9] rounded text-xs focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none w-36"
              />
            </div>
          </div>
        </div>

        {/* Trade Color Theme Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#F3F2F1] text-[11px] text-[#605E5C]">
          <span className="font-semibold text-[#201F1E]">Trade Codes:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD335]" />
            <span>Senior Architectural / Design</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#107C41]" />
            <span>CAD Drafting &amp; Detailing</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F6CBD]" />
            <span>Material Selection &amp; Moodboards</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B7C3]" />
            <span>MEP Engineering &amp; LiDAR Scan</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" />
            <span>Client Review &amp; Sign-off</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F6BD60]" />
            <span>Millwork Pre-fabrication</span>
          </span>
        </div>
      </div>

      {/* THE RESOURCE TIMELINE MATRIX (Replicating Image 2) */}
      <div className="bg-white border border-[#EDEBE9] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[900px]">
            {/* Header: Resource column + 7 Days of the week */}
            <thead>
              <tr className="bg-[#F8F9FA] text-[#605E5C] border-b border-[#EDEBE9]">
                <th className="p-3 w-64 border-r border-[#EDEBE9] font-bold text-xs uppercase tracking-wider">
                  Resource Name &amp; Role
                </th>
                {weekDays.map(day => (
                  <th key={day.name} className="p-2 text-center border-r border-[#EDEBE9] min-w-36">
                    <span className="font-bold text-xs text-[#201F1E] block">{day.name}</span>
                    <span className="text-[10px] text-[#605E5C] font-mono block">{day.label}</span>
                  </th>
                ))}
                <th className="p-2 text-center w-28 font-bold text-[#0F6CBD] bg-[#EFF6FC]">
                  Weekly Load
                </th>
              </tr>
            </thead>

            {/* Body: Resources Grouped */}
            <tbody className="divide-y divide-[#EDEBE9]">
              {/* Group 1: Team Members / People */}
              {(resourceTypeTab === 'ALL' || resourceTypeTab === 'EMPLOYEE') && (
                <>
                  <tr className="bg-[#F3F2F1]/80">
                    <td colSpan={9} className="py-1.5 px-3 font-bold text-[10px] text-[#605E5C] uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-[#0F6CBD]" />
                      <span>Team Members ({resources.filter(r => r.type === 'EMPLOYEE').length})</span>
                    </td>
                  </tr>

                  {filteredResources.filter(r => r.type === 'EMPLOYEE').map(res => {
                    const resDeployments = deployments.filter(d => d.resourceId === res.id);
                    const totalScheduledHours = resDeployments.reduce((acc, d) => acc + d.durationHours, 0);
                    const isOverloaded = totalScheduledHours > 40;

                    return (
                      <tr key={res.id} className="hover:bg-[#FAF9F8] transition">
                        {/* Resource Profile Cell */}
                        <td className="p-3 border-r border-[#EDEBE9] bg-white align-top">
                          <div className="flex items-center gap-2.5">
                            {res.avatar ? (
                              <img
                                src={res.avatar}
                                alt={res.name}
                                className="w-9 h-9 rounded-full object-cover border border-[#EDEBE9] shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#0F6CBD] text-white font-bold flex items-center justify-center text-xs shrink-0">
                                {res.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                            <div className="truncate">
                              <span className="font-bold text-[#201F1E] block truncate">
                                {res.name}
                              </span>
                              <span className="text-[11px] text-[#605E5C] block truncate">
                                {res.roleOrCategory}
                              </span>
                              <span className="text-[9px] text-[#0F6CBD] font-mono block mt-0.5">
                                ₹{res.hourlyBillableRate}/hr
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 7 Days Matrix Cells */}
                        {weekDays.map(day => {
                          const dayDeps = resDeployments.filter(d => d.date === day.date);
                          const dayHours = dayDeps.reduce((acc, d) => acc + d.durationHours, 0);
                          const isDayOverallocated = dayHours > 8.5;

                          return (
                            <td 
                              key={day.name} 
                              className="p-1.5 border-r border-[#EDEBE9] align-top bg-white relative group"
                            >
                              <div className="space-y-1 min-h-16 flex flex-col justify-start">
                                {dayDeps.map(dep => (
                                  <div
                                    key={dep.id}
                                    onClick={() => {
                                      setEditingDep(dep);
                                      setIsModalOpen(true);
                                    }}
                                    className={`p-1.5 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs relative group/card ${getColorClasses(dep.colorTheme)}`}
                                    title={`${dep.shiftLabel || dep.taskName} (${dep.projectTitle})`}
                                  >
                                    <div className="font-semibold truncate text-[10px] leading-tight">
                                      {dep.shiftLabel || `${dep.startTime} - ${dep.endTime}`}
                                    </div>
                                    <div className="text-[9px] opacity-90 truncate font-medium mt-0.5">
                                      {dep.taskName}
                                    </div>
                                    <div className="flex items-center justify-between text-[8px] font-mono mt-0.5 opacity-80">
                                      <span>{dep.durationHours}h</span>
                                      <span>{dep.projectCode.replace('PRJ-', '')}</span>
                                    </div>
                                  </div>
                                ))}

                                {dayDeps.length === 0 && (
                                  <button
                                    onClick={() => handleOpenDeployModal({
                                      resourceId: res.id,
                                      resourceName: res.name,
                                      resourceType: res.type,
                                      roleOrCategory: res.roleOrCategory,
                                      avatar: res.avatar,
                                      date: day.date
                                    })}
                                    className="w-full h-12 border border-dashed border-transparent hover:border-[#0F6CBD]/40 rounded text-center text-transparent hover:text-[#0F6CBD] text-xs font-semibold flex items-center justify-center transition"
                                    title={`Schedule shift for ${res.name} on ${day.name}`}
                                  >
                                    + Add Shift
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        {/* Weekly Load Summary Cell */}
                        <td className="p-2 border-r border-[#EDEBE9] text-center align-middle bg-[#F8F9FA]">
                          <span className={`text-xs font-bold font-mono block ${isOverloaded ? 'text-[#D83B01]' : 'text-[#0F6CBD]'}`}>
                            {totalScheduledHours.toFixed(1)}h
                          </span>
                          <span className="text-[10px] text-[#605E5C] block">/ 40h target</span>
                          {isOverloaded && (
                            <span className="inline-block text-[9px] bg-rose-100 text-rose-800 font-bold px-1 rounded mt-0.5">
                              Overloaded
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}

              {/* Group 2: Equipment & Tools */}
              {(resourceTypeTab === 'ALL' || resourceTypeTab === 'EQUIPMENT') && (
                <>
                  <tr className="bg-[#F3F2F1]/80">
                    <td colSpan={9} className="py-1.5 px-3 font-bold text-[10px] text-[#605E5C] uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-3 h-3 text-[#107C41]" />
                      <span>Equipment &amp; Precision Tools ({resources.filter(r => r.type === 'EQUIPMENT').length})</span>
                    </td>
                  </tr>

                  {filteredResources.filter(r => r.type === 'EQUIPMENT').map(tool => {
                    const toolDeps = deployments.filter(d => d.resourceId === tool.id);
                    const totalScheduledHours = toolDeps.reduce((acc, d) => acc + d.durationHours, 0);

                    return (
                      <tr key={tool.id} className="hover:bg-[#FAF9F8] transition">
                        <td className="p-3 border-r border-[#EDEBE9] bg-white align-top">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded bg-[#EDEBE9] text-[#323130] font-bold flex items-center justify-center shrink-0 border border-slate-300">
                              <Wrench className="w-4 h-4 text-[#0F6CBD]" />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-[#201F1E] block truncate">
                                {tool.name}
                              </span>
                              <span className="text-[11px] text-[#605E5C] block truncate">
                                {tool.roleOrCategory}
                              </span>
                              <span className="text-[9px] text-[#107C41] font-mono block mt-0.5">
                                {tool.skillsOrSpecs?.[0] || 'Hardware Asset'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {weekDays.map(day => {
                          const dayDeps = toolDeps.filter(d => d.date === day.date);

                          return (
                            <td 
                              key={day.name} 
                              className="p-1.5 border-r border-[#EDEBE9] align-top bg-white relative group"
                            >
                              <div className="space-y-1 min-h-16 flex flex-col justify-start">
                                {dayDeps.map(dep => (
                                  <div
                                    key={dep.id}
                                    onClick={() => {
                                      setEditingDep(dep);
                                      setIsModalOpen(true);
                                    }}
                                    className={`p-1.5 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs ${getColorClasses(dep.colorTheme)}`}
                                    title={`${dep.shiftLabel || dep.taskName} (${dep.projectTitle})`}
                                  >
                                    <div className="font-semibold truncate text-[10px]">
                                      {dep.shiftLabel || `${dep.startTime} - ${dep.endTime}`}
                                    </div>
                                    <div className="text-[9px] opacity-90 truncate mt-0.5">
                                      {dep.taskName}
                                    </div>
                                    <div className="text-[8px] font-mono mt-0.5 text-right opacity-80">
                                      {dep.durationHours}h
                                    </div>
                                  </div>
                                ))}

                                {dayDeps.length === 0 && (
                                  <button
                                    onClick={() => handleOpenDeployModal({
                                      resourceId: tool.id,
                                      resourceName: tool.name,
                                      resourceType: tool.type,
                                      roleOrCategory: tool.roleOrCategory,
                                      date: day.date
                                    })}
                                    className="w-full h-12 border border-dashed border-transparent hover:border-[#0F6CBD]/40 rounded text-center text-transparent hover:text-[#0F6CBD] text-xs font-semibold flex items-center justify-center transition"
                                    title={`Allocate ${tool.name} on ${day.name}`}
                                  >
                                    + Assign
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        <td className="p-2 border-r border-[#EDEBE9] text-center align-middle bg-[#F8F9FA]">
                          <span className="text-xs font-bold font-mono block text-[#107C41]">
                            {totalScheduledHours.toFixed(1)}h
                          </span>
                          <span className="text-[10px] text-[#605E5C] block">Site Active</span>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DEPLOY / ALLOCATE RESOURCE */}
      {isModalOpen && editingDep && (
        <div 
          role="dialog" 
          aria-modal="true" 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#EDEBE9] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#107C41] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <h3 className="font-bold text-sm">
                  {editingDep.id ? 'Edit Resource Deployment' : 'Deploy Resource to Project'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDeployment} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Resource Selection */}
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Resource (Person / Equipment) *</label>
                  <select
                    value={editingDep.resourceId}
                    onChange={e => {
                      const res = resources.find(r => r.id === e.target.value);
                      if (res) {
                        setEditingDep({
                          ...editingDep,
                          resourceId: res.id,
                          resourceName: res.name,
                          resourceType: res.type,
                          roleOrCategory: res.roleOrCategory,
                          avatar: res.avatar
                        });
                      }
                    }}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41] bg-white font-medium"
                    required
                  >
                    {resources.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.type === 'EMPLOYEE' ? '👤 ' : '🔧 '}
                        {r.name} ({r.roleOrCategory})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Project */}
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Assigned Project *</label>
                  <select
                    value={editingDep.projectId}
                    onChange={e => {
                      const p = projects.find(prj => prj.id === e.target.value) || project;
                      setEditingDep({
                        ...editingDep,
                        projectId: e.target.value,
                        projectCode: p?.projectCode || 'PRJ-SKYLINE-1402',
                        projectTitle: p?.title || 'Skyline Residences Unit 1402'
                      });
                    }}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41] bg-white font-medium"
                    required
                  >
                    <option value="PROJ-SKYLINE-1402">Skyline Residences Unit 1402</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Title */}
              <div>
                <label className="font-semibold text-[#201F1E] block mb-1">Activity / Shift Role *</label>
                <input
                  type="text"
                  value={editingDep.taskName || ''}
                  onChange={e => setEditingDep({ 
                    ...editingDep, 
                    taskName: e.target.value,
                    shiftLabel: `${editingDep.startTime || '8:00 AM'} - ${editingDep.endTime || '4:00 PM'} - ${e.target.value}`
                  })}
                  placeholder="e.g. Senior Architect Site Inspection"
                  className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41]"
                  required
                />
              </div>

              {/* Date, Start Time, End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    value={editingDep.date || ''}
                    onChange={e => setEditingDep({ ...editingDep, date: e.target.value })}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Start Time</label>
                  <input
                    type="text"
                    value={editingDep.startTime || '08:00 AM'}
                    onChange={e => setEditingDep({ ...editingDep, startTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">End Time</label>
                  <input
                    type="text"
                    value={editingDep.endTime || '04:00 PM'}
                    onChange={e => setEditingDep({ ...editingDep, endTime: e.target.value })}
                    placeholder="04:00 PM"
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41]"
                  />
                </div>
              </div>

              {/* Duration & Color Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Shift Duration (Hours) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={editingDep.durationHours || 8}
                    onChange={e => setEditingDep({ ...editingDep, durationHours: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#107C41]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Card Color Theme</label>
                  <select
                    value={editingDep.colorTheme || 'orange'}
                    onChange={e => setEditingDep({ ...editingDep, colorTheme: e.target.value as any })}
                    className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                  >
                    <option value="orange">Orange (Concept Design)</option>
                    <option value="green">Green (Architect CAD)</option>
                    <option value="blue">Blue (Materials / Joinery)</option>
                    <option value="teal">Teal (MEP &amp; LiDAR Scan)</option>
                    <option value="purple">Purple (Client Review)</option>
                    <option value="amber">Amber (Millwork Pre-fab)</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="font-semibold text-[#201F1E] block mb-1">Deployment Status</label>
                <select
                  value={editingDep.status || 'CONFIRMED'}
                  onChange={e => setEditingDep({ ...editingDep, status: e.target.value as any })}
                  className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                >
                  <option value="CONFIRMED">Confirmed Deployment</option>
                  <option value="TENTATIVE">Tentative / Proposed</option>
                  <option value="COMPLETED">Completed Shift</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EDEBE9]">
                {editingDep.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingDep.id) handleDeleteDeployment(editingDep.id);
                      setIsModalOpen(false);
                    }}
                    className="text-rose-700 hover:text-rose-800 font-semibold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Schedule</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-[#EDEBE9] text-[#323130] hover:bg-[#F3F2F1] rounded px-4 py-2 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#107C41] hover:bg-[#0B5A2E] text-white rounded px-5 py-2 font-semibold shadow-xs"
                  >
                    Save Deployment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
