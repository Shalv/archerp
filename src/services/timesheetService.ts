import { TimesheetEntry, ResourceDeployment, ProjectTask } from '../types/erp';
import { 
  INITIAL_TIMESHEETS, 
  INITIAL_RESOURCE_DEPLOYMENTS, 
  INITIAL_PROJECT_TASKS, 
  DEMO_RESOURCE_ITEMS, 
  ResourceMasterItem 
} from '../data/timesheetAndResourceSeed';

const TS_STORAGE_KEY = 'buildstorys_timesheets_v1';
const DEP_STORAGE_KEY = 'buildstorys_deployments_v1';
const TASK_STORAGE_KEY = 'buildstorys_project_tasks_v1';
const RES_STORAGE_KEY = 'buildstorys_resources_v1';

class TimesheetService {
  private getStored<T>(key: string, defaultVal: T[]): T[] {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return defaultVal;
  }

  private setStored<T>(key: string, val: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage write error', e);
    }
  }

  // --- Timesheets ---
  public async getTimesheets(projectId?: string, employeeId?: string): Promise<TimesheetEntry[]> {
    // Try backend API first
    try {
      const query = new URLSearchParams();
      if (projectId) query.set('projectId', projectId);
      if (employeeId) query.set('employeeId', employeeId);
      const res = await fetch(`/api/timesheets?${query.toString()}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.setStored(TS_STORAGE_KEY, data);
          return data;
        }
      }
    } catch (e) {}

    // Fallback to localStorage or seed
    let list = this.getStored<TimesheetEntry>(TS_STORAGE_KEY, INITIAL_TIMESHEETS);
    if (projectId) {
      list = list.filter(t => t.projectId === projectId);
    }
    if (employeeId) {
      list = list.filter(t => t.employeeId === employeeId);
    }
    return list;
  }

  public async saveTimesheet(entry: Partial<TimesheetEntry>): Promise<TimesheetEntry> {
    const list = this.getStored<TimesheetEntry>(TS_STORAGE_KEY, INITIAL_TIMESHEETS);
    const existingIndex = entry.id ? list.findIndex(t => t.id === entry.id) : -1;

    const fullEntry: TimesheetEntry = {
      id: entry.id || `TS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId: entry.projectId || 'PROJ-SKYLINE-1402',
      projectCode: entry.projectCode || 'PRJ-SKYLINE-1402',
      projectName: entry.projectName || 'Skyline Residences Unit 1402',
      employeeId: entry.employeeId || 'RES-01',
      employeeName: entry.employeeName || 'Ronnie Hart',
      employeeRole: entry.employeeRole || 'Team Leader',
      employeeAvatar: entry.employeeAvatar || '',
      date: entry.date || new Date().toISOString().split('T')[0],
      weekNumber: entry.weekNumber || 'W47 2024',
      dayOfWeek: entry.dayOfWeek || 'Mon',
      taskId: entry.taskId || '',
      taskTitle: entry.taskTitle || 'General Architectural Scope',
      category: entry.category || 'Design',
      hours: Number(entry.hours) || 0,
      overtimeHours: Number(entry.overtimeHours) || 0,
      billable: entry.billable !== false,
      billableRate: Number(entry.billableRate) || 1500,
      costRate: Number(entry.costRate) || 800,
      totalCost: (Number(entry.hours) || 0) * (Number(entry.costRate) || 800),
      totalBillable: entry.billable !== false ? (Number(entry.hours) || 0) * (Number(entry.billableRate) || 1500) : 0,
      description: entry.description || '',
      status: entry.status || 'DRAFT',
      approvedBy: entry.approvedBy,
      approvedAt: entry.approvedAt,
      rejectionReason: entry.rejectionReason,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      list[existingIndex] = fullEntry;
    } else {
      fullEntry.createdAt = new Date().toISOString();
      list.unshift(fullEntry);
    }

    this.setStored(TS_STORAGE_KEY, list);

    // Sync to backend
    fetch('/api/timesheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullEntry)
    }).catch(() => {});

    return fullEntry;
  }

  public async deleteTimesheet(id: string): Promise<boolean> {
    const list = this.getStored<TimesheetEntry>(TS_STORAGE_KEY, INITIAL_TIMESHEETS);
    const updated = list.filter(t => t.id !== id);
    this.setStored(TS_STORAGE_KEY, updated);

    fetch(`/api/timesheets/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  }

  public async updateTimesheetStatus(id: string, status: TimesheetEntry['status'], reviewer?: string, reason?: string): Promise<TimesheetEntry | null> {
    const list = this.getStored<TimesheetEntry>(TS_STORAGE_KEY, INITIAL_TIMESHEETS);
    const item = list.find(t => t.id === id);
    if (!item) return null;

    item.status = status;
    if (status === 'APPROVED') {
      item.approvedBy = reviewer || 'Project Director';
      item.approvedAt = new Date().toISOString();
    } else if (status === 'REJECTED') {
      item.rejectionReason = reason || 'Clarification required on logged hours';
    }
    item.updatedAt = new Date().toISOString();

    this.setStored(TS_STORAGE_KEY, list);

    fetch(`/api/timesheets/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewer, reason })
    }).catch(() => {});

    return item;
  }

  public async bulkApproveTimesheets(ids: string[], reviewer: string): Promise<number> {
    const list = this.getStored<TimesheetEntry>(TS_STORAGE_KEY, INITIAL_TIMESHEETS);
    let count = 0;
    const now = new Date().toISOString();
    for (const item of list) {
      if (ids.includes(item.id) && (item.status === 'SUBMITTED' || item.status === 'DRAFT')) {
        item.status = 'APPROVED';
        item.approvedBy = reviewer;
        item.approvedAt = now;
        item.updatedAt = now;
        count++;
      }
    }
    this.setStored(TS_STORAGE_KEY, list);
    return count;
  }

  // --- Resource Deployments ---
  public async getDeployments(weekNumber?: string, projectId?: string): Promise<ResourceDeployment[]> {
    try {
      const query = new URLSearchParams();
      if (weekNumber) query.set('week', weekNumber);
      if (projectId) query.set('projectId', projectId);
      const res = await fetch(`/api/resources/deployments?${query.toString()}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.setStored(DEP_STORAGE_KEY, data);
          return data;
        }
      }
    } catch (e) {}

    let list = this.getStored<ResourceDeployment>(DEP_STORAGE_KEY, INITIAL_RESOURCE_DEPLOYMENTS);
    if (projectId) {
      list = list.filter(d => d.projectId === projectId);
    }
    return list;
  }

  public async saveDeployment(dep: Partial<ResourceDeployment>): Promise<ResourceDeployment> {
    const list = this.getStored<ResourceDeployment>(DEP_STORAGE_KEY, INITIAL_RESOURCE_DEPLOYMENTS);
    const existingIndex = dep.id ? list.findIndex(d => d.id === dep.id) : -1;

    const fullDep: ResourceDeployment = {
      id: dep.id || `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      resourceId: dep.resourceId || 'RES-01',
      resourceName: dep.resourceName || 'Ronnie Hart',
      resourceType: dep.resourceType || 'EMPLOYEE',
      roleOrCategory: dep.roleOrCategory || 'Team Leader',
      avatar: dep.avatar || '',
      projectId: dep.projectId || 'PROJ-SKYLINE-1402',
      projectCode: dep.projectCode || 'PRJ-SKYLINE-1402',
      projectTitle: dep.projectTitle || 'Skyline Residences Unit 1402',
      taskName: dep.taskName || 'Project Execution Support',
      date: dep.date || '2024-11-18',
      startTime: dep.startTime || '08:00 AM',
      endTime: dep.endTime || '04:00 PM',
      durationHours: Number(dep.durationHours) || 8.0,
      shiftLabel: dep.shiftLabel || `${dep.startTime || '8:00 AM'} - ${dep.endTime || '4:00 PM'} - ${dep.taskName || 'Site'}`,
      colorTheme: dep.colorTheme || 'orange',
      utilizationPercent: Number(dep.utilizationPercent) || 100,
      status: dep.status || 'CONFIRMED',
      notes: dep.notes || ''
    };

    if (existingIndex >= 0) {
      list[existingIndex] = fullDep;
    } else {
      list.push(fullDep);
    }

    this.setStored(DEP_STORAGE_KEY, list);

    fetch('/api/resources/deployments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullDep)
    }).catch(() => {});

    return fullDep;
  }

  public async deleteDeployment(id: string): Promise<boolean> {
    const list = this.getStored<ResourceDeployment>(DEP_STORAGE_KEY, INITIAL_RESOURCE_DEPLOYMENTS);
    const updated = list.filter(d => d.id !== id);
    this.setStored(DEP_STORAGE_KEY, updated);

    fetch(`/api/resources/deployments/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  }

  // --- Master Resources (People & Equipment) ---
  public getResources(): ResourceMasterItem[] {
    return this.getStored<ResourceMasterItem>(RES_STORAGE_KEY, DEMO_RESOURCE_ITEMS);
  }

  public saveResource(res: ResourceMasterItem): ResourceMasterItem {
    const list = this.getResources();
    const idx = list.findIndex(r => r.id === res.id);
    if (idx >= 0) {
      list[idx] = res;
    } else {
      list.push(res);
    }
    this.setStored(RES_STORAGE_KEY, list);
    return res;
  }

  // --- Project Tasks Kanban ---
  public async getProjectTasks(projectId?: string): Promise<ProjectTask[]> {
    try {
      const res = await fetch(`/api/project-tasks${projectId ? `?projectId=${projectId}` : ''}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.setStored(TASK_STORAGE_KEY, data);
          return data;
        }
      }
    } catch (e) {}

    let list = this.getStored<ProjectTask>(TASK_STORAGE_KEY, INITIAL_PROJECT_TASKS);
    if (projectId) {
      list = list.filter(t => t.projectId === projectId);
    }
    return list;
  }

  public async saveProjectTask(task: Partial<ProjectTask>): Promise<ProjectTask> {
    const list = this.getStored<ProjectTask>(TASK_STORAGE_KEY, INITIAL_PROJECT_TASKS);
    const existingIndex = task.id ? list.findIndex(t => t.id === task.id) : -1;

    const fullTask: ProjectTask = {
      id: task.id || `TASK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId: task.projectId || 'PROJ-SKYLINE-1402',
      projectCode: task.projectCode || 'PRJ-SKYLINE-1402',
      projectName: task.projectName || 'Skyline Residences Unit 1402',
      clientName: task.clientName || 'Vikram Malhotra',
      title: task.title || 'Untitled Architectural Task',
      stage: task.stage || 'New',
      category: task.category || 'Design',
      assigneeId: task.assigneeId || 'RES-01',
      assigneeName: task.assigneeName || 'Ronnie Hart',
      assigneeAvatar: task.assigneeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      plannedHours: task.plannedHours || '04:00',
      loggedHours: task.loggedHours || '00:00',
      checklistTotal: Number(task.checklistTotal) || 3,
      checklistCompleted: Number(task.checklistCompleted) || 0,
      priority: task.priority || 2,
      isMilestone: task.isMilestone || false,
      hasWarning: task.hasWarning,
      imagePreview: task.imagePreview,
      dueDate: task.dueDate || '2024-11-25',
      description: task.description || ''
    };

    if (existingIndex >= 0) {
      list[existingIndex] = fullTask;
    } else {
      list.unshift(fullTask);
    }

    this.setStored(TASK_STORAGE_KEY, list);

    fetch('/api/project-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullTask)
    }).catch(() => {});

    return fullTask;
  }

  public async updateTaskStage(id: string, stage: ProjectTask['stage']): Promise<boolean> {
    const list = this.getStored<ProjectTask>(TASK_STORAGE_KEY, INITIAL_PROJECT_TASKS);
    const task = list.find(t => t.id === id);
    if (!task) return false;
    task.stage = stage;
    this.setStored(TASK_STORAGE_KEY, list);

    fetch(`/api/project-tasks/${id}/stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage })
    }).catch(() => {});

    return true;
  }

  public async deleteTask(id: string): Promise<boolean> {
    const list = this.getStored<ProjectTask>(TASK_STORAGE_KEY, INITIAL_PROJECT_TASKS);
    const updated = list.filter(t => t.id !== id);
    this.setStored(TASK_STORAGE_KEY, updated);

    fetch(`/api/project-tasks/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  }
}

export const timesheetService = new TimesheetService();
