import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Clock, 
  Calendar, 
  CheckSquare, 
  Star, 
  AlertCircle, 
  Plus, 
  Filter, 
  FileText, 
  DollarSign, 
  Receipt, 
  BarChart3, 
  Layers, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  Users,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ProjectTask, ProjectRecord, UserSession } from '../types/erp';
import { timesheetService } from '../services/timesheetService';
import { TimesheetManagementView } from './TimesheetManagementView';
import { ResourceDeploymentView } from './ResourceDeploymentView';

interface ProjectManagementHubViewProps {
  project?: ProjectRecord;
  projects?: ProjectRecord[];
  currentUser: UserSession;
  onNavigateToTab?: (tab: string) => void;
}

export const ProjectManagementHubView: React.FC<ProjectManagementHubViewProps> = ({
  project,
  projects = [],
  currentUser,
  onNavigateToTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'TASKS' | 'TIMESHEETS' | 'RESOURCES' | 'DOCUMENTS' | 'SALES' | 'INVOICES' | 'ANALYTICS'
  >('TASKS');
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Partial<ProjectTask> | null>(null);

  const stages: ProjectTask['stage'][] = ['New', 'Assessment', 'Ongoing', 'Customer feedback', 'Done'];

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await timesheetService.getProjectTasks(project?.id);
      setTasks(data);
    } catch (e) {
      console.error('Error loading project tasks', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [project?.id]);

  const handleMoveStage = async (taskId: string, newStage: ProjectTask['stage']) => {
    await timesheetService.updateTaskStage(taskId, newStage);
    loadTasks();
  };

  const handleOpenTaskModal = (defaults?: Partial<ProjectTask>) => {
    setEditingTask({
      id: '',
      projectId: project?.id || 'PROJ-SKYLINE-1402',
      projectCode: project?.projectCode || 'PRJ-SKYLINE-1402',
      projectName: project?.title || 'Skyline Residences Unit 1402',
      clientName: project?.clientName || 'Vikram Malhotra',
      title: 'Detailed Electrical Layout',
      stage: 'Ongoing',
      category: 'Design',
      assigneeId: 'RES-03',
      assigneeName: 'Suman Oza',
      assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      plannedHours: '06:00',
      loggedHours: '00:00',
      checklistTotal: 3,
      checklistCompleted: 0,
      priority: 2,
      isMilestone: false,
      dueDate: '2024-11-28',
      description: 'Prepare switchboard coordinates, two-way light switching circuits, and DB load schedule.',
      ...defaults
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    await timesheetService.saveProjectTask(editingTask);
    setIsTaskModalOpen(false);
    setEditingTask(null);
    loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    await timesheetService.deleteTask(id);
    loadTasks();
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Onsite': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Procurement': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Design': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Admin': return 'bg-slate-100 text-slate-900 border-slate-300';
      default: return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Project Top Bar Header (Matches Image 3) */}
      <div className="bg-white border border-[#EDEBE9] rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#F3F2F1] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F6CBD] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                  {project?.projectCode || 'PRJ-SKYLINE-1402'}
                </span>
                <span className="text-xs text-[#107C41] font-semibold bg-[#DFF6DD] px-2 py-0.5 rounded border border-[#8AD68A]">
                  Active Execution
                </span>
              </div>
              <h1 className="text-lg font-bold text-[#201F1E] mt-0.5">
                {project?.title || 'Skyline Residences Unit 1402'} — Project Management Hub
              </h1>
              <p className="text-xs text-[#605E5C]">
                Client: <span className="font-semibold text-[#201F1E]">{project?.clientName || 'Vikram Malhotra'}</span> • Location: Skyline Heights Tower B, Worli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenTaskModal()}
              className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Project Sub-tabs (Matching Screenshot 3) */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 border-b border-[#EDEBE9] text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('TASKS')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'TASKS'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tasks ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TIMESHEETS')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'TIMESHEETS'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timesheets</span>
          </button>

          <button
            onClick={() => setActiveSubTab('RESOURCES')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'RESOURCES'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Resource Schedule</span>
          </button>

          <button
            onClick={() => setActiveSubTab('DOCUMENTS')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'DOCUMENTS'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents &amp; Plans</span>
          </button>

          <button
            onClick={() => setActiveSubTab('SALES')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'SALES'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Sales Orders &amp; Quotation</span>
          </button>

          <button
            onClick={() => setActiveSubTab('INVOICES')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'INVOICES'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices &amp; Billing</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ANALYTICS')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'ANALYTICS'
                ? 'border-[#0F6CBD] text-[#0F6CBD]'
                : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics &amp; Variance</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: KANBAN TASKS BOARD (Matching Image 3) */}
      {activeSubTab === 'TASKS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
          {stages.map(stage => {
            const stageTasks = tasks.filter(t => t.stage === stage);

            return (
              <div key={stage} className="bg-[#F8F9FA] rounded-lg border border-[#EDEBE9] p-3 min-h-[500px] flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 border-b border-[#EDEBE9] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#201F1E]">{stage}</span>
                    <span className="text-[10px] font-semibold text-[#605E5C] bg-[#EDEBE9] px-1.5 py-0.2 rounded-full">
                      {stageTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenTaskModal({ stage })}
                    className="text-[#605E5C] hover:text-[#0F6CBD] text-sm font-bold"
                    title={`Add task to ${stage}`}
                  >
                    +
                  </button>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1">
                  {stageTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg border border-[#EDEBE9] p-3 shadow-2xs hover:shadow-xs transition space-y-2 group"
                    >
                      {/* Image Thumbnail Preview (e.g. for CAD Floor Plan, 3D Images, Moodboard) */}
                      {task.imagePreview && (
                        <div className="rounded overflow-hidden border border-[#EDEBE9] max-h-32 bg-slate-100">
                          <img
                            src={task.imagePreview}
                            alt={task.title}
                            className="w-full h-24 object-cover group-hover:scale-105 transition duration-200"
                          />
                        </div>
                      )}

                      {/* Header Title */}
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-[#201F1E] leading-tight">
                          {task.title}
                        </h4>
                        {task.isMilestone && (
                          <span title="Key Project Milestone">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          </span>
                        )}
                      </div>

                      {/* Trade Category Tag */}
                      <div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-block ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                      </div>

                      {/* Metrics: Hours & Checklist (Matching Screenshot 3) */}
                      <div className="flex items-center justify-between text-[11px] text-[#605E5C] pt-1 border-t border-[#F3F2F1]">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#F3F2F1] text-[#201F1E] font-mono px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {task.plannedHours}
                          </span>
                          <span className="text-[10px] text-[#8A8886] flex items-center gap-1">
                            <CheckSquare className="w-3 h-3" />
                            <span>{task.checklistCompleted}/{task.checklistTotal}</span>
                          </span>
                        </div>

                        {/* Priority Stars */}
                        <div className="flex items-center">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= task.priority ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Footer: Assignee Avatar + Move Stage dropdown */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          {task.assigneeAvatar ? (
                            <img
                              src={task.assigneeAvatar}
                              alt={task.assigneeName}
                              className="w-5 h-5 rounded-full object-cover border border-slate-200"
                              title={task.assigneeName}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#0F6CBD] text-white text-[9px] font-bold flex items-center justify-center">
                              {task.assigneeName.slice(0, 1)}
                            </div>
                          )}
                          <span className="text-[10px] text-[#605E5C] font-medium truncate max-w-20">
                            {task.assigneeName.split(' ')[0]}
                          </span>
                        </div>

                        {/* Stage Selector */}
                        <select
                          value={task.stage}
                          onChange={e => handleMoveStage(task.id, e.target.value as any)}
                          className="text-[10px] bg-[#F8F9FA] border border-[#EDEBE9] rounded px-1.5 py-0.5 font-medium text-[#605E5C] focus:outline-none"
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageTasks.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-[#8A8886] border border-dashed border-[#EDEBE9] rounded">
                      No tasks in {stage}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: EMBEDDED PROJECT TIMESHEETS */}
      {activeSubTab === 'TIMESHEETS' && (
        <TimesheetManagementView
          project={project}
          projects={projects}
          currentUser={currentUser}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* SUB-TAB 3: EMBEDDED PROJECT RESOURCE SCHEDULE */}
      {activeSubTab === 'RESOURCES' && (
        <ResourceDeploymentView
          project={project}
          projects={projects}
          currentUser={currentUser}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* SUB-TAB 4: DOCUMENTS & PLANS */}
      {activeSubTab === 'DOCUMENTS' && (
        <div className="bg-white border border-[#EDEBE9] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#201F1E]">GFC Drawings &amp; 3D Visual Asset Vault</h3>
              <p className="text-xs text-[#605E5C]">Architectural floor plans, elevation sections, and high-resolution VR renders linked to this project.</p>
            </div>
            <button 
              onClick={() => onNavigateToTab?.('drawings')}
              className="text-xs text-[#0F6CBD] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Open Drawing Register</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-[#EDEBE9] rounded-lg overflow-hidden group">
              <img
                src="/assets/images/cad_floor_plan_1789216705163.jpg"
                alt="CAD Floor Plan"
                className="w-full h-44 object-cover group-hover:scale-102 transition"
              />
              <div className="p-3 bg-white">
                <span className="text-[10px] font-mono text-[#0F6CBD] font-semibold">GFC-DWG-001 (Rev B)</span>
                <h4 className="font-bold text-xs text-[#201F1E]">Full Apartment Furniture &amp; Partition Layout</h4>
                <p className="text-[11px] text-[#605E5C] mt-0.5">Approved by Aarav Singhania on 15 Nov 2024</p>
              </div>
            </div>

            <div className="border border-[#EDEBE9] rounded-lg overflow-hidden group">
              <img
                src="/assets/images/materials_moodboard_1789218106559.jpg"
                alt="Materials Moodboard"
                className="w-full h-44 object-cover group-hover:scale-102 transition"
              />
              <div className="p-3 bg-white">
                <span className="text-[10px] font-mono text-purple-700 font-semibold">MMB-PALETTE-04</span>
                <h4 className="font-bold text-xs text-[#201F1E]">Physical Material Moodboard &amp; Swatches</h4>
                <p className="text-[11px] text-[#605E5C] mt-0.5">Statuario Marble, Fluted Walnut, Champagne Brass</p>
              </div>
            </div>

            <div className="border border-[#EDEBE9] rounded-lg overflow-hidden group">
              <img
                src="/assets/images/cad_section_drawing_1789218091254.jpg"
                alt="CAD Section Drawing"
                className="w-full h-44 object-cover group-hover:scale-102 transition"
              />
              <div className="p-3 bg-white">
                <span className="text-[10px] font-mono text-[#107C41] font-semibold">SEC-ELEV-002</span>
                <h4 className="font-bold text-xs text-[#201F1E]">Double-Height Living Room Section</h4>
                <p className="text-[11px] text-[#605E5C] mt-0.5">Ceiling cove drops and HVAC plenum clearances</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SALES ORDERS */}
      {activeSubTab === 'SALES' && (
        <div className="bg-white border border-[#EDEBE9] rounded-lg p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#201F1E] mb-1">Commercial Sales Contract &amp; Agreed Scope</h3>
          <p className="text-xs text-[#605E5C] mb-4">Turnkey design and fit-out contract commercial breakdown.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">Total Contract Value</span>
              <div className="text-xl font-bold text-[#107C41] mt-1 font-mono">₹85,00,000</div>
              <span className="text-[11px] text-[#605E5C]">Turnkey Design &amp; Build</span>
            </div>
            <div className="p-3.5 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">Labor &amp; Professional Services</span>
              <div className="text-xl font-bold text-[#0F6CBD] mt-1 font-mono">₹18,50,000</div>
              <span className="text-[11px] text-[#605E5C]">Based on estimated 850 hours</span>
            </div>
            <div className="p-3.5 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">Civil, Millwork &amp; Materials</span>
              <div className="text-xl font-bold text-[#201F1E] mt-1 font-mono">₹66,50,000</div>
              <span className="text-[11px] text-[#605E5C]">Direct procurement pass-through</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: INVOICES & BILLING */}
      {activeSubTab === 'INVOICES' && (
        <div className="bg-white border border-[#EDEBE9] rounded-lg p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#201F1E] mb-1">Project Milestone Invoicing &amp; Timesheet RA Bills</h3>
          <p className="text-xs text-[#605E5C] mb-4">Invoices generated from approved timesheets and milestone signoffs.</p>
          <div className="border border-[#EDEBE9] rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8F9FA] text-[#605E5C] border-b border-[#EDEBE9]">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Milestone / Work Package</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE9]">
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0F6CBD]">INV-2024-001</td>
                  <td className="p-3">Mobilization Advance (20%)</td>
                  <td className="p-3 text-right font-mono font-bold">₹17,00,000</td>
                  <td className="p-3 text-[#605E5C]">01 Nov 2024</td>
                  <td className="p-3"><span className="bg-[#DFF6DD] text-[#107C41] px-2 py-0.5 rounded font-bold text-[10px]">PAID</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0F6CBD]">INV-2024-002</td>
                  <td className="p-3">Concept &amp; 3D Render Signoff (15%)</td>
                  <td className="p-3 text-right font-mono font-bold">₹12,75,000</td>
                  <td className="p-3 text-[#605E5C]">18 Nov 2024</td>
                  <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">SUBMITTED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: ANALYTICS */}
      {activeSubTab === 'ANALYTICS' && (
        <div className="bg-white border border-[#EDEBE9] rounded-lg p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#201F1E]">Labor Hours &amp; Budget Variance Analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">Budgeted Design Hours</span>
              <div className="text-lg font-bold text-[#201F1E] mt-0.5 font-mono">120.0 hrs</div>
              <span className="text-[10px] text-[#107C41]">Actual to Date: 46.5 hrs</span>
            </div>
            <div className="p-3 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">Budgeted Onsite Hours</span>
              <div className="text-lg font-bold text-[#201F1E] mt-0.5 font-mono">200.0 hrs</div>
              <span className="text-[10px] text-[#0F6CBD]">Actual to Date: 32.0 hrs</span>
            </div>
            <div className="p-3 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">Labor Margin Health</span>
              <div className="text-lg font-bold text-[#107C41] mt-0.5 font-mono">54.8%</div>
              <span className="text-[10px] text-[#107C41]">Billing ₹1,950 vs Cost ₹880</span>
            </div>
            <div className="p-3 bg-[#F8F9FA] rounded border border-[#EDEBE9]">
              <span className="text-xs text-[#605E5C]">On-Time Milestone Index</span>
              <div className="text-lg font-bold text-[#0F6CBD] mt-0.5 font-mono">94.2%</div>
              <span className="text-[10px] text-[#605E5C]">2 days ahead of schedule</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PROJECT TASK */}
      {isTaskModalOpen && editingTask && (
        <div 
          role="dialog" 
          aria-modal="true" 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#EDEBE9] overflow-hidden">
            <div className="bg-[#0F6CBD] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingTask.id ? 'Edit Project Task' : 'Create New Architectural Task'}
              </h3>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="text-white/80 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#201F1E] block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={editingTask.title || ''}
                  onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="e.g. Worksite follow-up, 3D Images, Floor Plan"
                  className="w-full border border-[#EDEBE9] rounded p-2 focus:ring-1 focus:ring-[#0F6CBD]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Board Column (Stage) *</label>
                  <select
                    value={editingTask.stage || 'Ongoing'}
                    onChange={e => setEditingTask({ ...editingTask, stage: e.target.value as any })}
                    className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                    required
                  >
                    {stages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Category Badge *</label>
                  <select
                    value={editingTask.category || 'Design'}
                    onChange={e => setEditingTask({ ...editingTask, category: e.target.value as any })}
                    className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                    required
                  >
                    <option value="Design">Design</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Admin">Admin</option>
                    <option value="MEP">MEP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Assignee</label>
                  <input
                    type="text"
                    value={editingTask.assigneeName || ''}
                    onChange={e => setEditingTask({ ...editingTask, assigneeName: e.target.value })}
                    placeholder="e.g. Sharlene Rhodes"
                    className="w-full border border-[#EDEBE9] rounded p-2"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Planned Hours (HH:MM)</label>
                  <input
                    type="text"
                    value={editingTask.plannedHours || '04:00'}
                    onChange={e => setEditingTask({ ...editingTask, plannedHours: e.target.value })}
                    placeholder="04:00"
                    className="w-full border border-[#EDEBE9] rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Priority Rating</label>
                  <select
                    value={editingTask.priority || 2}
                    onChange={e => setEditingTask({ ...editingTask, priority: parseInt(e.target.value) as any })}
                    className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                  >
                    <option value={1}>★☆☆ Normal Priority</option>
                    <option value={2}>★★☆ High Priority</option>
                    <option value={3}>★★★ Urgent / Critical Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#201F1E] block mb-1">Drawing / Render Attachment</label>
                  <select
                    value={editingTask.imagePreview || ''}
                    onChange={e => setEditingTask({ ...editingTask, imagePreview: e.target.value })}
                    className="w-full border border-[#EDEBE9] rounded p-2 bg-white"
                  >
                    <option value="">No Image Attachment</option>
                    <option value="/assets/images/cad_floor_plan_1789216705163.jpg">Floor Plan CAD Drawing</option>
                    <option value="/assets/images/materials_moodboard_1789218106559.jpg">Materials Swatch Moodboard</option>
                    <option value="/assets/images/minimalist_concept_render_1789216644600.jpg">Minimalist 3D Concept Render</option>
                    <option value="/assets/images/biophilic_concept_render_1789216627991.jpg">Biophilic Living Room Render</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#201F1E] block mb-1">Description &amp; Deliverables</label>
                <textarea
                  rows={3}
                  value={editingTask.description || ''}
                  onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full border border-[#EDEBE9] rounded p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDEBE9]">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="border border-[#EDEBE9] text-[#323130] hover:bg-[#F3F2F1] rounded px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white rounded px-5 py-2 font-semibold shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
