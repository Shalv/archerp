/**
 * Build Storys ERP - Persistent Data Layer
 * File-backed relational JSON store with ACID atomic disk persistence,
 * relational mapping, deterministic calculation helpers, and audit logging.
 */

import fs from 'fs';
import { AsyncLocalStorage } from 'node:async_hooks';
export const databaseContext = new AsyncLocalStorage<{ data: ERPDatabase }>();
import { randomUUID, scryptSync, randomBytes, timingSafeEqual } from 'crypto';
const hashPassword = (password: string) => { const salt = randomBytes(16).toString('hex'); return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`; };
const verifyPassword = (password: string, stored: string) => {
  if (!stored.startsWith('scrypt$')) return password === stored;
  const [, salt, hash] = stored.split('$');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
import path from 'path';
import { 
  ProjectRecord, 
  MasterRateItem, 
  AuditLogEntry, 
  UserSession, 
  UserPermissions,
  ROLE_DEFAULT_PERMISSIONS,
  BOQItem, 
  BOQRevision, 
  CostBudgetSummary,
  CustomerQuotation,
  TradeCategory,
  CustomerMaster,
  VendorMaster,
  ResourceMaster,
  WorkPackageMaster,
  UOMMaster,
  TaxRuleMaster,
  CompanyFinanceSetupMaster
} from '../types/erp';
import { DEFAULT_COMPANY_FINANCE_SETUP } from '../data/defaultCompanySetup';
import { DEFAULT_MASTER_RATES } from './mockMasters';
import { 
  DEFAULT_CUSTOMERS, 
  DEFAULT_VENDORS, 
  DEFAULT_RESOURCES, 
  DEFAULT_WORK_PACKAGES, 
  DEFAULT_UOMS, 
  DEFAULT_TAX_RULES 
} from './mockFoundationData';
import { getSyntheticDemoProject, getAlternativePackages, getValueEngineeringOptions } from './syntheticDemo';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'buildstorys_db.json');

export interface ERPDatabase {
  operations?: Record<string, any[]>;
  architecture?: {projects: any[]; masterData: any; revision: number};
  version: string;
  users: UserSession[];
  masterRates: MasterRateItem[];
  customers: CustomerMaster[];
  vendors: VendorMaster[];
  resources: ResourceMaster[];
  workPackages: WorkPackageMaster[];
  uomList: UOMMaster[];
  taxRules: TaxRuleMaster[];
  companySetup?: CompanyFinanceSetupMaster;
  projects: ProjectRecord[];
  auditLogs: AuditLogEntry[];
}

export const DEMO_USERS: UserSession[] = [
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
    allowedModuleIds: [], // All modules authorized
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
    allowedModuleIds: ['M02', 'M03', 'M04', 'M05', 'M11', 'M14', 'M18', 'M19', 'M20', 'M23', 'M24'],
    createdAt: '2026-02-15T08:30:00Z',
    lastLoginAt: '2026-09-11T08:10:00Z',
    notes: 'Field measurements, laser survey logging, and site daily check-ins. Direct cost & margin visibility disabled.',
    permissions: ROLE_DEFAULT_PERMISSIONS.SITE_ENGINEER
  },
  {
    id: 'USR-CLIENT-01',
    username: 'vikram.client',
    name: 'Vikram & Ananya Malhotra',
    email: 'vikram.malhotra@skyline.org',
    password: 'Client@123',
    phone: '+91 99505 66778',
    role: 'CLIENT',
    roleTitle: 'Property Owner (Unit 1402)',
    department: 'Customer Accounts',
    status: 'ACTIVE',
    avatar: 'VM',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    allowedModuleIds: ['M02', 'M04', 'M05', 'M08', 'M20', 'M21'],
    createdAt: '2026-03-01T09:00:00Z',
    lastLoginAt: '2026-09-11T10:15:00Z',
    notes: 'External client account for reviewing approved quotations and milestone schedules.',
    permissions: ROLE_DEFAULT_PERMISSIONS.CLIENT
  }
];

class DatabaseService {
  private localDb: ERPDatabase;
  private get db(): ERPDatabase { return databaseContext.getStore()?.data || this.localDb; }
  private set db(value: ERPDatabase) {
    const context = databaseContext.getStore();
    if (context) context.data = value; else this.localDb = value;
  }
  public getOperations(projectId: string, moduleId: string) { return this.db.operations?.[projectId+':'+moduleId] || []; }
  public saveOperations(projectId: string, moduleId: string, records: any[]) { this.db.operations ||= {}; this.db.operations[projectId+':'+moduleId] = structuredClone(records); this.persist(); }
  public getArchitecture() { return this.db.architecture || null; }
  public saveArchitecture(data: {projects: any[]; masterData: any; revision: number}) { this.db.architecture = structuredClone(data); this.persist(); }
  public snapshot(): ERPDatabase { return structuredClone(this.db); }

  constructor() {
    this.db = this.loadOrSeedDatabase();
  }

  private loadOrSeedDatabase(): ERPDatabase {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = raw.trim() ? JSON.parse(raw) as ERPDatabase : null;
        if (parsed && Array.isArray(parsed.projects)) {
          parsed.customers = parsed.customers || [...DEFAULT_CUSTOMERS];
          parsed.vendors = parsed.vendors || [...DEFAULT_VENDORS];
          parsed.resources = parsed.resources || [...DEFAULT_RESOURCES];
          parsed.workPackages = parsed.workPackages || [...DEFAULT_WORK_PACKAGES];
          parsed.uomList = parsed.uomList || [...DEFAULT_UOMS];
          parsed.taxRules = parsed.taxRules || [...DEFAULT_TAX_RULES];
          if (!parsed.companySetup) {
            parsed.companySetup = JSON.parse(JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP));
          }

          // Normalize users with full permissions and fields
          if (Array.isArray(parsed.users)) {
            parsed.users = parsed.users.map(u => {
              const defaultPerms = ROLE_DEFAULT_PERMISSIONS[u.role] || ROLE_DEFAULT_PERMISSIONS.ESTIMATOR;
              const initials = u.name ? u.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() : 'US';
              return {
                ...u,
                username: u.username || (u.email ? u.email.split('@')[0] : u.id.toLowerCase()),
                phone: u.phone || '+91 98000 00000',
                department: u.department || (u.role === 'ADMIN' ? 'Executive Management' : u.role === 'ESTIMATOR' ? 'Estimating & Commercial' : u.role === 'PROJECT_MANAGER' ? 'Project Operations' : u.role === 'SITE_ENGINEER' ? 'Field Operations' : 'Customer Accounts'),
                status: u.status || 'ACTIVE',
                avatar: u.avatar || initials,
                assignedProjectIds: u.assignedProjectIds || ['PROJ-SKYLINE-1402'],
                createdAt: u.createdAt || '2026-01-15T09:00:00Z',
                lastLoginAt: u.lastLoginAt || new Date().toISOString(),
                permissions: {
                  ...defaultPerms,
                  ...(u.permissions || {})
                }
              };
            });
          } else {
            parsed.users = [...DEMO_USERS];
          }

          return parsed;
        }
      }
    } catch (err) {
      throw new Error('Database could not be read. Restore the data file from backup; existing data has not been overwritten.');
    }

    // Seed fresh DB
    const initialDb: ERPDatabase = {
      version: '1.0.0',
      users: DEMO_USERS,
      masterRates: [...DEFAULT_MASTER_RATES],
      customers: [...DEFAULT_CUSTOMERS],
      vendors: [...DEFAULT_VENDORS],
      resources: [...DEFAULT_RESOURCES],
      workPackages: [...DEFAULT_WORK_PACKAGES],
      uomList: [...DEFAULT_UOMS],
      taxRules: [...DEFAULT_TAX_RULES],
      companySetup: JSON.parse(JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP)),
      projects: [getSyntheticDemoProject()],
      auditLogs: [
        {
          id: 'LOG-001',
          timestamp: '2026-03-01T09:00:00Z',
          userId: 'USR-EST-01',
          userName: 'Rajesh Sharma',
          userRole: 'ESTIMATOR',
          action: 'CREATE_PROJECT',
          entityType: 'PROJECT',
          entityId: 'PROJ-SKYLINE-1402',
          details: 'Initialized Skyline Residences Unit 1402 turnkey interior project.'
        },
        {
          id: 'LOG-002',
          timestamp: '2026-03-01T10:15:00Z',
          userId: 'USR-EST-01',
          userName: 'Rajesh Sharma',
          userRole: 'ESTIMATOR',
          action: 'AI_BOQ_GENERATION',
          entityType: 'BOQ_REVISION',
          entityId: 'REV-0-AI-DRAFT',
          details: 'Generated Rev 0 AI Draft Takeoff (15 items) from Floor Plan Rev B and Survey Notes.'
        },
        {
          id: 'LOG-003',
          timestamp: '2026-03-02T18:00:00Z',
          userId: 'USR-EST-01',
          userName: 'Rajesh Sharma',
          userRole: 'ESTIMATOR',
          action: 'APPROVE_BASELINE',
          entityType: 'BOQ_REVISION',
          entityId: 'REV-1-ESTIMATOR-APPROVED',
          details: 'Approved Rev 1 baseline after site dimension reconciliation and rate verification.'
        }
      ]
    };

    this.persist(initialDb);
    return initialDb;
  }

  private persist(dataToSave?: ERPDatabase): void {
    if (process.env.VERCEL || process.env.ERP_SERVERLESS === '1') return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.db;
      const temporaryFile = DB_FILE + '.tmp';
      fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(temporaryFile, DB_FILE);
    } catch (err) {
      throw new Error('Unable to save database. Check disk space and data directory write permissions.');
    }
  }

  // --- Audit Logging ---
  public logAudit(user: UserSession, action: string, entityType: string, entityId: string, details: string): void {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      details
    };
    this.db.auditLogs.unshift(entry);
    if (this.db.auditLogs.length > 500) {
      this.db.auditLogs.pop();
    }
    this.persist();
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.db.auditLogs;
  }

  // --- Users & Auth ---
  public getUsers(): UserSession[] {
    return this.db.users.map(({ password, ...user }) => user);
  }

  public getUserById(id: string): UserSession | undefined {
    return this.db.users.find(u => u.id === id);
  }

  public authenticate(loginIdentifier: string, passwordAttempt: string): { success: boolean; user?: UserSession; error?: string } {
    if (typeof loginIdentifier !== 'string' || typeof passwordAttempt !== 'string' || !passwordAttempt) return { success: false, error: 'Username and password are required.' };
    const cleanId = loginIdentifier.trim().toLowerCase();
    const user = this.db.users.find(u => 
      u.email.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase() === cleanId) ||
      u.id.toLowerCase() === cleanId ||
      u.email.toLowerCase().startsWith(cleanId + '@') ||
      ((cleanId === 'admin' || cleanId === 'administrator' || cleanId === 'aarav' || cleanId === 'aarav.admin') && u.role === 'ADMIN') ||
      ((cleanId === 'estimator' || cleanId === 'qs' || cleanId === 'rajesh' || cleanId === 'rajesh.qs') && u.role === 'ESTIMATOR') ||
      ((cleanId === 'pm' || cleanId === 'kavita' || cleanId === 'kavita.pm') && u.role === 'PROJECT_MANAGER') ||
      ((cleanId === 'site' || cleanId === 'ramesh' || cleanId === 'ramesh.site') && u.role === 'SITE_ENGINEER') ||
      ((cleanId === 'client' || cleanId === 'vikram' || cleanId === 'vikram.client' || cleanId === 'vikram.malhotra') && u.role === 'CLIENT')
    );

    if (!user) {
      return { success: false, error: 'User account not found. Please verify your Email or Username.' };
    }

    if (user.status === 'SUSPENDED') {
      return { success: false, error: 'Account Suspended: Access has been disabled by System Administrator. Please contact IT Security.' };
    }

    if (user.status === 'INACTIVE') {
      return { success: false, error: 'Account Inactive: Account setup pending administrator activation.' };
    }

    // Default password resolution (supports custom password or role-based default password)
    const expectedPassword = user.password || (
      user.role === 'ADMIN' ? 'Admin@123' :
      user.role === 'ESTIMATOR' ? 'Estimator@123' :
      user.role === 'PROJECT_MANAGER' ? 'Pm@123' :
      user.role === 'SITE_ENGINEER' ? 'Site@123' :
      'Client@123'
    );

    if (!verifyPassword(passwordAttempt, expectedPassword)) {
      return { success: false, error: 'Invalid password. Please check your credentials or contact administrator to reset.' };
    }

    if (!expectedPassword.startsWith('scrypt$')) user.password = hashPassword(passwordAttempt);
    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    this.persist();

    this.logAudit(
      user,
      'USER_LOGIN',
      'USER_SESSION',
      user.id,
      `User ${user.name} logged in successfully with role ${user.role}.`
    );

    const { password, ...publicUser } = user;
    return { success: true, user: publicUser };
  }

  public saveUser(adminUser: UserSession, userData: Partial<UserSession> & { name: string; email: string; role: any }): UserSession {
    const existingIndex = userData.id ? this.db.users.findIndex(u => u.id === userData.id) : -1;
    if (userData.id && existingIndex < 0) throw new Error('User account not found. Refresh the user register.');
    const previous = existingIndex >= 0 ? this.db.users[existingIndex] : undefined;
    userData = { ...previous, ...userData };
    if (typeof userData.name !== 'string' || !userData.name.trim()) throw new Error('Full name is required.');
    if (typeof userData.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) throw new Error('A valid email address is required.');
    userData.name = userData.name.trim();
    userData.email = userData.email.trim().toLowerCase();
    userData.username = (userData.username || userData.email.split('@')[0]).trim().toLowerCase();
    if (!userData.username || /\s/.test(userData.username)) throw new Error('Username cannot contain spaces.');
    if (!Object.hasOwn(ROLE_DEFAULT_PERMISSIONS, userData.role)) throw new Error('Invalid user role.');
    if (userData.status && !['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(userData.status)) throw new Error('Invalid account status.');
    const identifiers = [userData.email, userData.username];
    if (this.db.users.some(u => u.id !== previous?.id && [u.email.toLowerCase(), u.username?.toLowerCase(), u.id.toLowerCase()].some(v => v && identifiers.includes(v)))) throw new Error('Email or username is already used by another account.');
    if (userData.password && userData.password !== previous?.password) {
      if (userData.password.startsWith('scrypt$')) {
        // Already hashed securely
      } else {
        if (typeof userData.password !== 'string' || userData.password.length < 4) throw new Error('Password must contain at least 4 characters.');
        userData.password = hashPassword(userData.password);
      }
    } else userData.password = previous?.password || hashPassword('Build@2026');
    const initials = userData.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'US';
    const defaultPerms = ROLE_DEFAULT_PERMISSIONS[userData.role as keyof typeof ROLE_DEFAULT_PERMISSIONS] || ROLE_DEFAULT_PERMISSIONS.ESTIMATOR;

    if (existingIndex >= 0) {
      // Update existing user
      const existing = this.db.users[existingIndex];
      const updatedUser: UserSession = {
        ...existing,
        ...userData,
        username: userData.username || existing.username || userData.email.split('@')[0],
        password: userData.password || existing.password || 'Build@2026',
        role: userData.role || existing.role,
        roleTitle: userData.roleTitle || existing.roleTitle,
        department: userData.department !== undefined ? userData.department : existing.department,
        phone: userData.phone !== undefined ? userData.phone : existing.phone,
        status: userData.status || existing.status || 'ACTIVE',
        notes: userData.notes !== undefined ? userData.notes : existing.notes,
        bio: userData.bio !== undefined ? userData.bio : existing.bio,
        assignedProjectIds: userData.assignedProjectIds !== undefined ? userData.assignedProjectIds : (existing.assignedProjectIds || ['PROJ-SKYLINE-1402']),
        allowedModuleIds: userData.allowedModuleIds !== undefined ? userData.allowedModuleIds : existing.allowedModuleIds,
        avatar: userData.avatar || existing.avatar || initials,
        permissions: {
          ...defaultPerms,
          ...(existing.permissions || {}),
          ...(userData.permissions || {})
        }
      };

      this.db.users[existingIndex] = updatedUser;
      this.persist();
      this.logAudit(
        adminUser,
        'UPDATE_USER_PERMISSIONS',
        'USER',
        updatedUser.id,
        `Updated user card for ${updatedUser.name} (${updatedUser.role}). Assigned permissions: ${Object.entries(updatedUser.permissions).filter(([_, v]) => v).map(([k]) => k).join(', ')}`
      );
      const { password, ...safeUser } = updatedUser;
      return safeUser;
    } else {
      // Create new user
      const newUserId = `USR-${randomUUID()}`;
      const newUser: UserSession = {
        id: newUserId,
        username: userData.username || userData.email.split('@')[0],
        name: userData.name,
        email: userData.email,
        password: userData.password || 'Build@2026',
        phone: userData.phone || '+91 98000 00000',
        role: userData.role,
        roleTitle: userData.roleTitle || (userData.role === 'ADMIN' ? 'Administrator' : userData.role === 'ESTIMATOR' ? 'Quantity Surveyor' : userData.role === 'PROJECT_MANAGER' ? 'Project Manager' : userData.role === 'SITE_ENGINEER' ? 'Site Engineer' : 'Client'),
        department: userData.department || 'Operations',
        status: userData.status || 'ACTIVE',
        avatar: userData.avatar || initials,
        assignedProjectIds: userData.assignedProjectIds || ['PROJ-SKYLINE-1402'],
        allowedModuleIds: userData.allowedModuleIds || [],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        notes: userData.notes || '',
        permissions: {
          ...defaultPerms,
          ...(userData.permissions || {})
        }
      };

      this.db.users.push(newUser);
      this.persist();
      this.logAudit(
        adminUser,
        'CREATE_USER',
        'USER',
        newUser.id,
        `Created new user ${newUser.name} [${newUser.id}] with role ${newUser.role} and custom permissions assigned.`
      );
      const { password, ...safeUser } = newUser;
      return safeUser;
    }
  }

  public deleteUser(adminUser: UserSession, userId: string, permanent: boolean = true): boolean {
    const userIndex = this.db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;
    const user = this.db.users[userIndex];

    // Safety: do not delete the last active admin
    if (user.role === 'ADMIN') {
      const remainingAdmins = this.db.users.filter(u => u.role === 'ADMIN' && u.id !== userId && u.status !== 'INACTIVE');
      if (remainingAdmins.length === 0) {
        throw new Error('Cannot delete or remove the only active Administrator in the system.');
      }
    }

    if (permanent) {
      this.db.users.splice(userIndex, 1);
      this.persist();
      this.logAudit(
        adminUser,
        'DELETE_USER',
        'USER',
        userId,
        `Permanently removed user account ${user.name} (${user.id}) from User Master Setup.`
      );
    } else {
      user.status = 'INACTIVE';
      this.persist();
      this.logAudit(
        adminUser,
        'DEACTIVATE_USER',
        'USER',
        userId,
        `Deactivated user account for ${user.name} (${user.id}).`
      );
    }
    return true;
  }

  public changePassword(actorUser: UserSession, targetUserId: string, currentPasswordAttempt?: string, newPassword?: string): { success: boolean; error?: string } {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters long.' };
    }

    const user = this.db.users.find(u => u.id === targetUserId);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    const isSelf = actorUser.id === targetUserId;
    const isAdmin = actorUser.role === 'ADMIN' || actorUser.permissions?.canManageUsers;

    if (!isSelf && !isAdmin) {
      return { success: false, error: 'Permission Denied: You cannot change another user\'s password.' };
    }

    // If changing own password, verify current password if user has one
    if (isSelf && !isAdmin) {
      const expectedPassword = user.password || (
        user.role === 'ADMIN' ? 'Admin@123' :
        user.role === 'ESTIMATOR' ? 'Estimator@123' :
        user.role === 'PROJECT_MANAGER' ? 'Pm@123' :
        user.role === 'SITE_ENGINEER' ? 'Site@123' :
        'Client@123'
      );

      if (currentPasswordAttempt) {
        if (!verifyPassword(currentPasswordAttempt, expectedPassword)) {
          return { success: false, error: 'Current password does not match.' };
        }
      } else if (user.password) {
        return { success: false, error: 'Current password is required to change password.' };
      }
    }

    // Set new hashed password
    user.password = hashPassword(newPassword);
    this.persist();

    this.logAudit(
      actorUser,
      'CHANGE_PASSWORD',
      'USER_CREDENTIALS',
      user.id,
      `Password successfully updated for user ${user.name} (${user.id}) by ${actorUser.name}.`
    );

    return { success: true };
  }

  // --- Master Rates ---
  public getMasterRates(): MasterRateItem[] {
    return this.db.masterRates;
  }

  public getMasterRateByCode(itemCode: string): MasterRateItem | undefined {
    return this.db.masterRates.find(r => r.itemCode.toLowerCase() === itemCode.toLowerCase());
  }

  public updateMasterRate(user: UserSession, updatedRate: MasterRateItem): MasterRateItem {
    const idx = this.db.masterRates.findIndex(r => r.id === updatedRate.id);
    // Recalculate deterministic unit cost
    updatedRate.totalUnitCost = (Number(updatedRate.materialRate) || 0) + 
                               (Number(updatedRate.labourRate) || 0) + 
                               (Number(updatedRate.equipmentRate) || 0) + 
                               (Number(updatedRate.subcontractRate) || 0);
    updatedRate.suggestedSellingRate = Math.round(updatedRate.totalUnitCost * (1 + (updatedRate.defaultMarkupPercent || 25) / 100));

    if (idx >= 0) {
      this.db.masterRates[idx] = updatedRate;
    } else {
      this.db.masterRates.push(updatedRate);
    }
    this.logAudit(user, 'UPDATE_RATE_MASTER', 'MASTER_RATE', updatedRate.itemCode, `Updated rate for ${updatedRate.description}`);
    this.persist();
    return updatedRate;
  }

  public deleteMasterRate(user: UserSession, id: string): boolean {
    const idx = this.db.masterRates.findIndex(r => r.id === id);
    if (idx >= 0) {
      const removed = this.db.masterRates.splice(idx, 1)[0];
      this.logAudit(user, 'DELETE_RATE_MASTER', 'MASTER_RATE', removed.itemCode, `Deleted item: ${removed.description}`);
      this.persist();
      return true;
    }
    return false;
  }

  // --- Customers Master ---
  public getCustomers(): CustomerMaster[] {
    return this.db.customers || [];
  }

  public getCustomerById(id: string): CustomerMaster | undefined {
    return (this.db.customers || []).find(c => c.id === id);
  }

  public saveCustomer(user: UserSession, customer: CustomerMaster): CustomerMaster {
    if (!this.db.customers) this.db.customers = [];
    const idx = this.db.customers.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      this.db.customers[idx] = customer;
      this.logAudit(user, 'UPDATE_CUSTOMER', 'CUSTOMER', customer.customerNo, `Updated customer: ${customer.name}`);
    } else {
      customer.id = customer.id || `CUST-${Date.now()}`;
      customer.createdAt = customer.createdAt || new Date().toISOString();
      customer.totalProjectsCount = customer.totalProjectsCount || 0;
      this.db.customers.push(customer);
      this.logAudit(user, 'CREATE_CUSTOMER', 'CUSTOMER', customer.customerNo, `Created customer: ${customer.name}`);
    }
    this.persist();
    return customer;
  }

  public deleteCustomer(user: UserSession, id: string): boolean {
    if (!this.db.customers) return false;
    const idx = this.db.customers.findIndex(c => c.id === id);
    if (idx >= 0) {
      const removed = this.db.customers.splice(idx, 1)[0];
      this.logAudit(user, 'DELETE_CUSTOMER', 'CUSTOMER', removed.customerNo, `Deleted customer: ${removed.name}`);
      this.persist();
      return true;
    }
    return false;
  }

  // --- Vendors Master ---
  public getVendors(): VendorMaster[] {
    return this.db.vendors || [];
  }

  public getVendorById(id: string): VendorMaster | undefined {
    return (this.db.vendors || []).find(v => v.id === id);
  }

  public saveVendor(user: UserSession, vendor: VendorMaster): VendorMaster {
    if (!this.db.vendors) this.db.vendors = [];
    const idx = this.db.vendors.findIndex(v => v.id === vendor.id);
    if (idx >= 0) {
      this.db.vendors[idx] = vendor;
      this.logAudit(user, 'UPDATE_VENDOR', 'VENDOR', vendor.vendorNo, `Updated vendor: ${vendor.name}`);
    } else {
      vendor.id = vendor.id || `VEND-${Date.now()}`;
      this.db.vendors.push(vendor);
      this.logAudit(user, 'CREATE_VENDOR', 'VENDOR', vendor.vendorNo, `Created vendor: ${vendor.name}`);
    }
    this.persist();
    return vendor;
  }

  public deleteVendor(user: UserSession, id: string): boolean {
    if (!this.db.vendors) return false;
    const idx = this.db.vendors.findIndex(v => v.id === id);
    if (idx >= 0) {
      const removed = this.db.vendors.splice(idx, 1)[0];
      this.logAudit(user, 'DELETE_VENDOR', 'VENDOR', removed.vendorNo, `Deleted vendor: ${removed.name}`);
      this.persist();
      return true;
    }
    return false;
  }

  // --- Resources Master ---
  public getResources(): ResourceMaster[] {
    return this.db.resources || [];
  }

  public getResourceById(id: string): ResourceMaster | undefined {
    return (this.db.resources || []).find(r => r.id === id);
  }

  public saveResource(user: UserSession, resource: ResourceMaster): ResourceMaster {
    if (!this.db.resources) this.db.resources = [];
    const idx = this.db.resources.findIndex(r => r.id === resource.id);
    if (idx >= 0) {
      this.db.resources[idx] = resource;
      this.logAudit(user, 'UPDATE_RESOURCE', 'RESOURCE', resource.resourceNo, `Updated resource: ${resource.name}`);
    } else {
      resource.id = resource.id || `RES-${Date.now()}`;
      this.db.resources.push(resource);
      this.logAudit(user, 'CREATE_RESOURCE', 'RESOURCE', resource.resourceNo, `Created resource: ${resource.name}`);
    }
    this.persist();
    return resource;
  }

  public deleteResource(user: UserSession, id: string): boolean {
    if (!this.db.resources) return false;
    const idx = this.db.resources.findIndex(r => r.id === id);
    if (idx >= 0) {
      const removed = this.db.resources.splice(idx, 1)[0];
      this.logAudit(user, 'DELETE_RESOURCE', 'RESOURCE', removed.resourceNo, `Deleted resource: ${removed.name}`);
      this.persist();
      return true;
    }
    return false;
  }

  // --- Work Packages Master ---
  public getWorkPackages(): WorkPackageMaster[] {
    return this.db.workPackages || [];
  }

  public saveWorkPackage(user: UserSession, wp: WorkPackageMaster): WorkPackageMaster {
    if (!this.db.workPackages) this.db.workPackages = [];
    const idx = this.db.workPackages.findIndex(w => w.id === wp.id);
    if (idx >= 0) {
      this.db.workPackages[idx] = wp;
      this.logAudit(user, 'UPDATE_WORK_PACKAGE', 'WORK_PACKAGE', wp.code, `Updated package: ${wp.name}`);
    } else {
      wp.id = wp.id || `WP-${Date.now()}`;
      this.db.workPackages.push(wp);
      this.logAudit(user, 'CREATE_WORK_PACKAGE', 'WORK_PACKAGE', wp.code, `Created package: ${wp.name}`);
    }
    this.persist();
    return wp;
  }

  // --- UOM & Tax Rules ---
  public getUOMs(): UOMMaster[] {
    return this.db.uomList || [];
  }

  public saveUOM(user: UserSession, uom: UOMMaster): UOMMaster {
    if (!this.db.uomList) this.db.uomList = [];
    const idx = this.db.uomList.findIndex(u => u.code === uom.code);
    if (idx >= 0) {
      this.db.uomList[idx] = uom;
    } else {
      this.db.uomList.push(uom);
    }
    this.logAudit(user, 'SAVE_UOM', 'UOM', uom.code, `Saved unit of measure: ${uom.name}`);
    this.persist();
    return uom;
  }

  public getTaxRules(): TaxRuleMaster[] {
    return this.db.taxRules || [];
  }

  public saveTaxRule(user: UserSession, tax: TaxRuleMaster): TaxRuleMaster {
    if (!this.db.taxRules) this.db.taxRules = [];
    const idx = this.db.taxRules.findIndex(t => t.id === tax.id);
    if (idx >= 0) {
      this.db.taxRules[idx] = tax;
    } else {
      tax.id = tax.id || `TAX-${Date.now()}`;
      this.db.taxRules.push(tax);
    }
    this.logAudit(user, 'SAVE_TAX_RULE', 'TAX_RULE', tax.code, `Saved tax rule: ${tax.name} (${tax.gstRatePercent}%)`);
    this.persist();
    return tax;
  }

  // --- Projects ---
  public getProjects(): ProjectRecord[] {
    return this.db.projects;
  }

  public getProjectById(id: string): ProjectRecord | undefined {
    return this.db.projects.find(p => p.id === id);
  }

  public saveProject(user: UserSession, project: ProjectRecord): ProjectRecord {
    const idx = this.db.projects.findIndex(p => p.id === project.id);
    project.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.db.projects[idx] = project;
      this.logAudit(user, 'UPDATE_PROJECT', 'PROJECT', project.id, `Updated project: ${project.title}`);
    } else {
      this.db.projects.push(project);
      this.logAudit(user, 'CREATE_PROJECT', 'PROJECT', project.id, `Created new project: ${project.title}`);
    }
    this.persist();
    return project;
  }

  // --- Deterministic Cost & Budget Engine ---
  public calculateDeterministicTotals(items: BOQItem[]): CostBudgetSummary {
    let directMaterialCost = 0;
    let directLabourCost = 0;
    let directEquipmentCost = 0;
    let directSubcontractCost = 0;
    let totalSellingBeforeTax = 0;

    const tradeMap = new Map<TradeCategory, { cost: number; selling: number; count: number }>();
    const roomMap = new Map<string, { cost: number; selling: number; count: number }>();

    for (const item of items) {
      // Deterministic calculations:
      const wastage = Number(item.wastagePercent) || 0;
      const baseQty = Number(item.baseQuantity) || 0;
      item.finalQuantity = Number((baseQty * (1 + wastage / 100)).toFixed(2));

      item.unitCost = (Number(item.materialRate) || 0) + 
                      (Number(item.labourRate) || 0) + 
                      (Number(item.equipmentRate) || 0) + 
                      (Number(item.subcontractRate) || 0);

      item.totalCost = Number((item.finalQuantity * item.unitCost).toFixed(2));

      // Calculate selling rate and amount
      if (item.markupPercent) {
        item.sellingRate = Number((item.unitCost * (1 + item.markupPercent / 100)).toFixed(2));
      }
      item.sellingAmount = Number((item.finalQuantity * item.sellingRate).toFixed(2));

      directMaterialCost += item.finalQuantity * (Number(item.materialRate) || 0);
      directLabourCost += item.finalQuantity * (Number(item.labourRate) || 0);
      directEquipmentCost += item.finalQuantity * (Number(item.equipmentRate) || 0);
      directSubcontractCost += item.finalQuantity * (Number(item.subcontractRate) || 0);
      totalSellingBeforeTax += item.sellingAmount;

      // Group by trade
      const t = item.trade;
      const currentTrade = tradeMap.get(t) || { cost: 0, selling: 0, count: 0 };
      currentTrade.cost += item.totalCost;
      currentTrade.selling += item.sellingAmount;
      currentTrade.count += 1;
      tradeMap.set(t, currentTrade);

      // Group by room
      const r = item.roomZone || 'Unassigned Zone';
      const currentRoom = roomMap.get(r) || { cost: 0, selling: 0, count: 0 };
      currentRoom.cost += item.totalCost;
      currentRoom.selling += item.sellingAmount;
      currentRoom.count += 1;
      roomMap.set(r, currentRoom);
    }

    const totalDirectCost = directMaterialCost + directLabourCost + directEquipmentCost + directSubcontractCost;
    const siteLogisticsExpense = Math.round(totalDirectCost * 0.025); // 2.5% logistics
    const siteOverheadsPercent = 5.0; // 5% site supervisor & temporary utilities
    const siteOverheadsAmount = Math.round(totalDirectCost * (siteOverheadsPercent / 100));
    const contingencyPercent = 3.0; // 3% contingency
    const contingencyAmount = Math.round(totalDirectCost * (contingencyPercent / 100));
    const escalationAllowanceAmount = 0; // Fixed price contract

    const totalProjectCost = totalDirectCost + siteLogisticsExpense + siteOverheadsAmount + contingencyAmount + escalationAllowanceAmount;

    const grossMarginAmount = totalSellingBeforeTax - totalProjectCost;
    const grossMarginPercent = totalSellingBeforeTax > 0 ? Number(((grossMarginAmount / totalSellingBeforeTax) * 100).toFixed(2)) : 0;
    const markupOnCostPercent = totalProjectCost > 0 ? Number(((grossMarginAmount / totalProjectCost) * 100).toFixed(2)) : 0;

    const gstRatePercent = 18; // Composite supply of turnkey works contract
    const gstAmount = Number((totalSellingBeforeTax * (gstRatePercent / 100)).toFixed(2));
    const totalClientContractValue = Number((totalSellingBeforeTax + gstAmount).toFixed(2));

    const tradeBreakdown = Array.from(tradeMap.entries()).map(([trade, data]) => ({
      trade,
      cost: Number(data.cost.toFixed(2)),
      sellingAmount: Number(data.selling.toFixed(2)),
      marginPercent: data.selling > 0 ? Number((((data.selling - data.cost) / data.selling) * 100).toFixed(1)) : 0,
      itemsCount: data.count
    }));

    const roomBreakdown = Array.from(roomMap.entries()).map(([roomZone, data]) => ({
      roomZone,
      cost: Number(data.cost.toFixed(2)),
      sellingAmount: Number(data.selling.toFixed(2)),
      itemsCount: data.count
    }));

    return {
      directMaterialCost: Number(directMaterialCost.toFixed(2)),
      directLabourCost: Number(directLabourCost.toFixed(2)),
      directEquipmentCost: Number(directEquipmentCost.toFixed(2)),
      directSubcontractCost: Number(directSubcontractCost.toFixed(2)),
      totalDirectCost: Number(totalDirectCost.toFixed(2)),
      siteLogisticsExpense,
      siteOverheadsPercent,
      siteOverheadsAmount,
      contingencyPercent,
      contingencyAmount,
      escalationAllowanceAmount,
      totalProjectCost: Number(totalProjectCost.toFixed(2)),
      totalSellingBeforeTax: Number(totalSellingBeforeTax.toFixed(2)),
      grossMarginAmount: Number(grossMarginAmount.toFixed(2)),
      grossMarginPercent,
      markupOnCostPercent,
      gstRatePercent,
      gstAmount,
      totalClientContractValue,
      tradeBreakdown,
      roomBreakdown
    };
  }

  // --- Reset to Demo State ---
  public resetToDemo(): void {
    this.db = {
      version: '1.0.0',
      users: DEMO_USERS,
      masterRates: [...DEFAULT_MASTER_RATES],
      customers: [...DEFAULT_CUSTOMERS],
      vendors: [...DEFAULT_VENDORS],
      resources: [...DEFAULT_RESOURCES],
      workPackages: [...DEFAULT_WORK_PACKAGES],
      uomList: [...DEFAULT_UOMS],
      taxRules: [...DEFAULT_TAX_RULES],
      companySetup: JSON.parse(JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP)),
      projects: [getSyntheticDemoProject()],
      auditLogs: [
        {
          id: `LOG-RESET-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: 'USR-DIR-01',
          userName: 'Aarav Singhania',
          userRole: 'ADMIN',
          action: 'RESET_DEMO_DATA',
          entityType: 'DATABASE',
          entityId: 'ALL',
          details: 'Reset system to clean synthetic residential interior turnkey demo project.'
        }
      ]
    };
    this.persist();
  }

  // --- Company Setup Master (Finance) ---
  public getCompanySetup(): CompanyFinanceSetupMaster {
    if (!this.db.companySetup) {
      this.db.companySetup = JSON.parse(JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP));
      this.persist();
    }
    return this.db.companySetup;
  }

  public updateCompanySetup(user: UserSession, updatedSetup: Partial<CompanyFinanceSetupMaster>): CompanyFinanceSetupMaster {
    const current = this.getCompanySetup();
    const merged: CompanyFinanceSetupMaster = {
      ...current,
      ...updatedSetup,
      updatedAt: new Date().toISOString(),
      updatedBy: `${user.name} (${user.roleTitle || user.role})`
    };
    this.db.companySetup = merged;
    this.persist();

    this.logAudit(
      user,
      'UPDATE_COMPANY_SETUP',
      'FINANCE_MASTER',
      'COMPANY_SETUP_MASTER',
      `Updated Financial Company Setup: GSTIN ${merged.taxation?.primaryGstin || 'N/A'}, Fiscal Year ${merged.fiscalYear?.currentYearLabel || 'N/A'}, Currency ${merged.fiscalYear?.baseCurrency || 'INR'}.`
    );

    return merged;
  }

  public resetCompanySetup(user: UserSession): CompanyFinanceSetupMaster {
    this.db.companySetup = JSON.parse(JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP));
    this.db.companySetup.updatedAt = new Date().toISOString();
    this.db.companySetup.updatedBy = `${user.name} (Reset to Standard Compliance Defaults)`;
    this.persist();

    this.logAudit(
      user,
      'RESET_COMPANY_SETUP',
      'FINANCE_MASTER',
      'COMPANY_SETUP_MASTER',
      'Reset Company Setup Master to official statutory and financial compliance baseline.'
    );

    return this.db.companySetup;
  }
}

export const dbService = new DatabaseService();
