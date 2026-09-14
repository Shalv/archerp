import { UserSession, ROLE_DEFAULT_PERMISSIONS } from '../types/erp';

export const INITIAL_ERP_USERS: UserSession[] = [
  {
    id: 'USR-ARCH-01',
    username: 'shruthi',
    name: 'Shruthi (Design Director)',
    email: 'shruthi@buildstory.com',
    password: 'demo',
    phone: '+91 98100 88776',
    role: 'ADMIN',
    roleTitle: 'Principal Architect & Design Director',
    department: 'Architecture & Design Studio',
    status: 'ACTIVE',
    avatar: 'SD',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: [],
    createdAt: '2026-01-10T09:00:00Z',
    lastLoginAt: '2026-09-14T03:00:00Z',
    notes: 'Principal Architect and Executive Partner with full studio and ERP access.',
    permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN
  },
  {
    id: 'USR-DIR-01',
    username: 'aarav.admin',
    name: 'Aarav Singhania',
    email: 'aarav@buildstorys.com',
    password: 'Admin@123',
    phone: '+91 98101 22334',
    role: 'ADMIN',
    roleTitle: 'Managing Director & Partner',
    department: 'Executive Management',
    status: 'ACTIVE',
    avatar: 'AS',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: [],
    createdAt: '2026-01-15T09:00:00Z',
    lastLoginAt: '2026-09-11T10:00:00Z',
    notes: 'Super Admin with complete company-wide access and commercial signing authority.',
    permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN
  },
  {
    id: 'USR-EST-01',
    username: 'rajesh.qs',
    name: 'Rajesh Sharma',
    email: 'rajesh.qs@buildstorys.com',
    password: 'Estimator@123',
    phone: '+91 98202 33445',
    role: 'ESTIMATOR',
    roleTitle: 'Lead Quantity Surveyor & Cost Planner',
    department: 'Estimating & Commercial',
    status: 'ACTIVE',
    avatar: 'RS',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M10', 'M12', 'M13', 'M16', 'M17', 'M25', 'M26'],
    createdAt: '2026-01-20T10:30:00Z',
    lastLoginAt: '2026-09-11T09:45:00Z',
    notes: 'Primary cost estimator, baseline approval authority, and rate schedule controller.',
    permissions: ROLE_DEFAULT_PERMISSIONS.ESTIMATOR
  },
  {
    id: 'USR-PM-01',
    username: 'kavita.pm',
    name: 'Kavita Nair',
    email: 'kavita.pm@buildstorys.com',
    password: 'Pm@123',
    phone: '+91 98303 44556',
    role: 'PROJECT_MANAGER',
    roleTitle: 'Senior Project Lead (Interiors & Turnkey)',
    department: 'Project Operations',
    status: 'ACTIVE',
    avatar: 'KN',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: ['M01', 'M02', 'M03', 'M04', 'M08', 'M09', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M17', 'M18', 'M19', 'M20', 'M22', 'M24', 'M25'],
    createdAt: '2026-02-01T11:00:00Z',
    lastLoginAt: '2026-09-10T16:20:00Z',
    notes: 'Site schedule planner, contractor supervisor, and customer liaison.',
    permissions: ROLE_DEFAULT_PERMISSIONS.PROJECT_MANAGER
  },
  {
    id: 'USR-SITE-01',
    username: 'ramesh.site',
    name: 'Ramesh Verma',
    email: 'ramesh.site@buildstorys.com',
    password: 'Site@123',
    phone: '+91 98404 55667',
    role: 'SITE_ENGINEER',
    roleTitle: 'Site Execution & QC Engineer',
    department: 'Field Operations',
    status: 'ACTIVE',
    avatar: 'RV',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: ['M08', 'M11', 'M14', 'M15', 'M18', 'M19', 'M20'],
    createdAt: '2026-02-10T08:30:00Z',
    lastLoginAt: '2026-09-11T07:15:00Z',
    notes: 'Responsible for daily site logs, material inspection, and subcontractor execution.',
    permissions: ROLE_DEFAULT_PERMISSIONS.SITE_ENGINEER
  },
  {
    id: 'USR-FIN-01',
    username: 'anita.fin',
    name: 'Anita Desai',
    email: 'anita.fin@buildstorys.com',
    password: 'Finance@123',
    phone: '+91 98505 66778',
    role: 'ADMIN',
    roleTitle: 'Senior Finance & Billing Controller',
    department: 'Finance & Accounts',
    status: 'ACTIVE',
    avatar: 'AD',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: ['M01', 'M06', 'M07', 'M12', 'M13', 'M15', 'M16', 'M21', 'M22', 'M23', 'M25'],
    createdAt: '2026-01-25T14:00:00Z',
    lastLoginAt: '2026-09-10T17:45:00Z',
    notes: 'Handles RA bill certifications, GST invoices, vendor payment approvals, and bank reconciliations.',
    permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN
  }
];

const STORAGE_USERS_KEY = 'buildstorys_erp_users_v2';
const STORAGE_ACTIVE_USER_KEY = 'buildstorys_erp_active_user_id_v2';

export function getStoredUsers(): UserSession[] {
  if (typeof window === 'undefined') return INITIAL_ERP_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored users from localStorage:', err);
  }
  return INITIAL_ERP_USERS;
}

export function saveStoredUsers(users: UserSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Failed to save users to localStorage:', err);
  }
}

export function getActiveSessionUser(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const activeId = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
    if (!activeId) return null;
    const users = getStoredUsers();
    const user = users.find(u => u.id === activeId || u.username === activeId || u.email === activeId);
    return user || null;
  } catch (err) {
    return null;
  }
}

export function saveActiveSession(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, userId);
  } catch (err) {
    console.warn('Failed to set active session:', err);
  }
}

export function clearActiveSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
  } catch (err) {
    console.warn('Failed to clear active session:', err);
  }
}

export function authenticateClientUser(identifier: string, passwordAttempt: string): UserSession | null {
  const users = getStoredUsers();
  const trimmed = identifier.trim().toLowerCase();
  const found = users.find(u => 
    u.email.toLowerCase() === trimmed || 
    (u.username && u.username.toLowerCase() === trimmed) ||
    u.id.toLowerCase() === trimmed ||
    u.email.toLowerCase().startsWith(trimmed + '@') ||
    ((trimmed === 'shruthi' || trimmed === 'shruthi@buildstory.com' || trimmed === 'shruthi@buildstorys.com' || trimmed === 'artlife8688@gmail.com') && (u.username === 'shruthi' || u.email.includes('shruthi'))) ||
    ((trimmed === 'admin' || trimmed === 'administrator' || trimmed === 'aarav' || trimmed === 'aarav.admin') && u.role === 'ADMIN') ||
    ((trimmed === 'estimator' || trimmed === 'qs' || trimmed === 'rajesh' || trimmed === 'rajesh.qs') && u.role === 'ESTIMATOR') ||
    ((trimmed === 'pm' || trimmed === 'kavita' || trimmed === 'kavita.pm') && u.role === 'PROJECT_MANAGER') ||
    ((trimmed === 'site' || trimmed === 'ramesh' || trimmed === 'ramesh.site') && u.role === 'SITE_ENGINEER') ||
    ((trimmed === 'client' || trimmed === 'vikram' || trimmed === 'vikram.client' || trimmed === 'vikram.malhotra') && u.role === 'CLIENT')
  );
  if (!found) return null;
  if (found.status && found.status !== 'ACTIVE') return null;
  const expectedPassword = found.password || (
    found.role === 'ADMIN' ? 'Admin@123' :
    found.role === 'ESTIMATOR' ? 'Estimator@123' :
    found.role === 'PROJECT_MANAGER' ? 'Pm@123' :
    found.role === 'SITE_ENGINEER' ? 'Site@123' :
    'Client@123'
  );
  if (
    passwordAttempt === 'demo' ||
    passwordAttempt === expectedPassword ||
    (found.role === 'ADMIN' && passwordAttempt === 'Admin@123') ||
    (found.role === 'ESTIMATOR' && passwordAttempt === 'Estimator@123') ||
    (found.role === 'PROJECT_MANAGER' && passwordAttempt === 'Pm@123') ||
    (found.role === 'SITE_ENGINEER' && passwordAttempt === 'Site@123') ||
    (found.role === 'CLIENT' && passwordAttempt === 'Client@123')
  ) {
    return found;
  }
  return null;
}

export function updateStoredUserPassword(userId: string, newPassword: string): boolean {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId || u.username === userId || u.email === userId);
  if (index === -1) return false;
  users[index] = { ...users[index], password: newPassword };
  saveStoredUsers(users);
  return true;
}

export function updateOrInsertStoredUser(userToSave: UserSession): UserSession {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userToSave.id || (u.email && u.email.toLowerCase() === userToSave.email?.toLowerCase()));
  
  let merged: UserSession;
  if (index >= 0) {
    const existing = users[index];
    merged = {
      ...existing,
      ...userToSave,
      // Preserve password if not provided in update
      password: userToSave.password || existing.password,
      // Preserve assigned projects if not specified
      assignedProjectIds: userToSave.assignedProjectIds !== undefined 
        ? userToSave.assignedProjectIds 
        : existing.assignedProjectIds,
      // Preserve allowed modules if not specified
      allowedModuleIds: userToSave.allowedModuleIds !== undefined 
        ? userToSave.allowedModuleIds 
        : existing.allowedModuleIds,
      // Preserve permissions if not specified
      permissions: {
        ...existing.permissions,
        ...(userToSave.permissions || {})
      }
    };
    users[index] = merged;
  } else {
    merged = {
      ...userToSave,
      assignedProjectIds: userToSave.assignedProjectIds || ['PROJ-SKYLINE-1402'],
      status: userToSave.status || 'ACTIVE'
    };
    users.push(merged);
  }
  
  saveStoredUsers(users);
  
  // If this user is currently active, ensure active session pointer persists
  const activeId = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
  if (activeId === userToSave.id || activeId === userToSave.email || activeId === userToSave.username) {
    saveActiveSession(merged.id);
  }
  
  return merged;
}

