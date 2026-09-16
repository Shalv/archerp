/**
 * Build Storys ERP - MongoDB Atlas Integration Service
 * Connects to MongoDB Atlas Cluster with resilience, schema collections,
 * automated persistence syncing, and health diagnostics.
 */

import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { ERPDatabase } from './db';

export interface MongoDBStatusReport {
  configured: boolean;
  connected: boolean;
  database: string;
  cluster: string;
  message: string;
  error?: string;
  collectionsCount?: number;
  lastSyncAt?: string;
}

export class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnecting: boolean = false;
  private lastSyncTime: string | null = null;

  private lastStatus: MongoDBStatusReport = {
    configured: false,
    connected: false,
    database: process.env.MONGODB_DATABASE || 'buildstorys_erp',
    cluster: 'cluster0.cabxpys.mongodb.net',
    message: 'Initializing MongoDB Atlas client...'
  };

  constructor() {
    this.initClient();
  }

  /**
   * Resolves the MongoDB connection URI
   */
  public getUri(): string {
    let uri = process.env.MONGODB_URI || '';
    
    // Resolve password, cleaning up any accidental key= prefixes or quotes
    let pass = process.env.MONGODB_PASSWORD || '';
    if (pass.includes('=')) {
      pass = pass.substring(pass.indexOf('=') + 1);
    }
    pass = pass.replace(/^["']|["']$/g, '').trim();

    // If MONGODB_URI contains the literal placeholder <db_password>, replace it with real password
    if (uri && uri.includes('<db_password>')) {
      return pass ? uri.replace('<db_password>', encodeURIComponent(pass)) : '';
    }

    if (uri && !uri.includes('<db_password>') && uri.startsWith('mongodb')) {
      return uri;
    }

    // Only construct Atlas URI if credentials were provided
    if (!pass && !uri) {
      return '';
    }

    const user = process.env.MONGODB_USERNAME || 'coreenactsolutions_db_user';
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@cluster0.cabxpys.mongodb.net/?retryWrites=true&w=majority`;
  }

  public getDatabaseName(): string {
    return process.env.MONGODB_DATABASE || 'buildstorys_erp';
  }

  /**
   * Initialize MongoClient with connection pooling & retries
   */
  public initClient(): void {
    const uri = this.getUri();
    const dbName = this.getDatabaseName();
    this.lastStatus.database = dbName;

    if (!uri) {
      this.lastStatus.configured = false;
      this.lastStatus.connected = false;
      this.lastStatus.message = 'MONGODB_URI or MONGODB_USERNAME/PASSWORD not configured.';
      return;
    }

    this.lastStatus.configured = true;

    try {
      if (this.client) {
        this.client.close().catch(() => {});
      }

      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: false,
          deprecationErrors: true,
        },
        connectTimeoutMS: 8000,
        socketTimeoutMS: 15000,
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
        minPoolSize: 1,
      });

      // Eager non-blocking ping
      this.testConnection().catch(() => {});
    } catch (err: any) {
      this.lastStatus.connected = false;
      this.lastStatus.error = err.message;
      this.lastStatus.message = `Failed to instantiate MongoDB client: ${err.message}`;
    }
  }

  /**
   * Live ping and health check against MongoDB Atlas
   */
  public async testConnection(): Promise<MongoDBStatusReport> {
    const uri = this.getUri();
    const dbName = this.getDatabaseName();

    if (!uri) {
      this.lastStatus.configured = false;
      this.lastStatus.connected = false;
      this.lastStatus.message = 'MongoDB URI missing.';
      return this.lastStatus;
    }

    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      return this.lastStatus;
    }

    try {
      this.isConnecting = true;
      await this.client.connect();
      this.db = this.client.db(dbName);

      // Ping admin
      await this.client.db('admin').command({ ping: 1 });

      // List existing collections in the ERP database
      const collections = await this.db.listCollections().toArray();
      const colCount = collections.length;

      this.lastStatus.configured = true;
      this.lastStatus.connected = true;
      this.lastStatus.collectionsCount = colCount;
      this.lastStatus.error = undefined;
      this.lastStatus.message = `Successfully connected to MongoDB Atlas (${this.lastStatus.cluster} / DB: ${dbName})! Found ${colCount} collections.`;

      // Create indexes if collections exist or newly created
      await this.ensureIndexes();

      return this.lastStatus;
    } catch (err: any) {
      this.lastStatus.connected = false;
      this.lastStatus.error = err.message;
      const errMsg = String(err.message || '');
      const isFirewallIssue = 
        errMsg.includes('SSL alert number 80') ||
        errMsg.includes('tlsv1 alert internal error') ||
        errMsg.includes('ETIMEDOUT') ||
        errMsg.includes('ENOTFOUND') ||
        errMsg.includes('Server selection timed out');

      if (isFirewallIssue) {
        this.lastStatus.message = 'MongoDB Atlas IP Whitelist required: Your cluster is rejecting incoming connections. In MongoDB Atlas -> Network Access, add IP "0.0.0.0/0" (Allow Access from Anywhere).';
        console.warn('[MongoDB Atlas] Incoming connection blocked by Atlas IP Whitelist. Add 0.0.0.0/0 in MongoDB Atlas Network Access.');
      } else {
        this.lastStatus.message = `MongoDB connection error: ${errMsg}`;
        console.warn('[MongoDB Atlas] Connection attempt notice:', errMsg);
      }
      return this.lastStatus;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Ensure essential unique and search indexes across MongoDB collections
   */
  public async ensureIndexes(): Promise<void> {
    if (!this.db) return;
    try {
      await this.db.collection('projects').createIndex({ id: 1 }, { unique: true });
      await this.db.collection('projects').createIndex({ projectCode: 1 });
      await this.db.collection('users').createIndex({ id: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ email: 1 });
      await this.db.collection('master_rates').createIndex({ id: 1 }, { unique: true });
      await this.db.collection('master_rates').createIndex({ itemCode: 1 });
      await this.db.collection('audit_logs').createIndex({ id: 1 }, { unique: true });
      await this.db.collection('operations').createIndex({ projectModuleKey: 1 }, { unique: true });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Index creation note:', err.message);
    }
  }

  /**
   * Sync complete ERP database state into MongoDB Atlas collections
   */
  public async syncToMongoDB(dbData: ERPDatabase): Promise<{ success: boolean; message: string; documentsSynced?: number }> {
    if (!this.client || !this.lastStatus.connected) {
      const ping = await this.testConnection();
      if (!ping.connected) {
        return { success: false, message: `MongoDB Atlas is not connected: ${ping.message}` };
      }
    }

    if (!this.db) {
      this.db = this.client!.db(this.getDatabaseName());
    }

    try {
      let totalSynced = 0;

      // 1. Projects collection
      if (Array.isArray(dbData.projects) && dbData.projects.length > 0) {
        const projCol = this.db.collection('projects');
        for (const proj of dbData.projects) {
          await projCol.updateOne(
            { id: proj.id },
            { $set: { ...proj, updatedAt: new Date() } },
            { upsert: true }
          );
          totalSynced++;
        }
      }

      // 2. Users collection
      if (Array.isArray(dbData.users) && dbData.users.length > 0) {
        const usersCol = this.db.collection('users');
        for (const u of dbData.users) {
          await usersCol.updateOne(
            { id: u.id },
            { $set: { ...u, updatedAt: new Date() } },
            { upsert: true }
          );
          totalSynced++;
        }
      }

      // 3. Master Rates collection
      if (Array.isArray(dbData.masterRates) && dbData.masterRates.length > 0) {
        const ratesCol = this.db.collection('master_rates');
        for (const r of dbData.masterRates) {
          await ratesCol.updateOne(
            { id: r.id },
            { $set: { ...r, updatedAt: new Date() } },
            { upsert: true }
          );
          totalSynced++;
        }
      }

      // 4. Foundation Masters (Customers, Vendors, Resources, Work Packages, UOMs, Tax Rules)
      if (Array.isArray(dbData.customers) && dbData.customers.length > 0) {
        const col = this.db.collection('customers');
        for (const item of dbData.customers) {
          await col.updateOne({ id: item.id }, { $set: item }, { upsert: true });
          totalSynced++;
        }
      }
      if (Array.isArray(dbData.vendors) && dbData.vendors.length > 0) {
        const col = this.db.collection('vendors');
        for (const item of dbData.vendors) {
          await col.updateOne({ id: item.id }, { $set: item }, { upsert: true });
          totalSynced++;
        }
      }
      if (Array.isArray(dbData.resources) && dbData.resources.length > 0) {
        const col = this.db.collection('resources');
        for (const item of dbData.resources) {
          await col.updateOne({ id: item.id }, { $set: item }, { upsert: true });
          totalSynced++;
        }
      }
      if (Array.isArray(dbData.workPackages) && dbData.workPackages.length > 0) {
        const col = this.db.collection('work_packages');
        for (const item of dbData.workPackages) {
          await col.updateOne({ id: item.id }, { $set: item }, { upsert: true });
          totalSynced++;
        }
      }
      if (Array.isArray(dbData.uomList) && dbData.uomList.length > 0) {
        const col = this.db.collection('uom_list');
        for (const item of dbData.uomList) {
          await col.updateOne({ code: item.code }, { $set: item }, { upsert: true });
          totalSynced++;
        }
      }
      if (Array.isArray(dbData.taxRules) && dbData.taxRules.length > 0) {
        const col = this.db.collection('tax_rules');
        for (const item of dbData.taxRules) {
          await col.updateOne({ id: item.id }, { $set: item }, { upsert: true });
          totalSynced++;
        }
      }

      // 5. Company Setup
      if (dbData.companySetup) {
        const setupCol = this.db.collection('company_setup');
        await setupCol.updateOne(
          { setupKey: 'PRIMARY_COMPANY' },
          { $set: { setupKey: 'PRIMARY_COMPANY', data: dbData.companySetup, updatedAt: new Date() } },
          { upsert: true }
        );
        totalSynced++;
      }

      // 6. Operations
      if (dbData.operations) {
        const opsCol = this.db.collection('operations');
        for (const [key, records] of Object.entries(dbData.operations)) {
          await opsCol.updateOne(
            { projectModuleKey: key },
            { $set: { projectModuleKey: key, records, updatedAt: new Date() } },
            { upsert: true }
          );
          totalSynced++;
        }
      }

      // 7. Architecture State
      if (dbData.architecture) {
        const archCol = this.db.collection('architecture_store');
        await archCol.updateOne(
          { storeKey: 'CURRENT' },
          { $set: { storeKey: 'CURRENT', data: dbData.architecture, updatedAt: new Date() } },
          { upsert: true }
        );
        totalSynced++;
      }

      // 8. Audit Logs (recent 150)
      if (Array.isArray(dbData.auditLogs) && dbData.auditLogs.length > 0) {
        const auditCol = this.db.collection('audit_logs');
        const recent = dbData.auditLogs.slice(0, 150);
        for (const log of recent) {
          await auditCol.updateOne(
            { id: log.id },
            { $set: log },
            { upsert: true }
          );
          totalSynced++;
        }
      }

      // Refresh collection count
      const collections = await this.db.listCollections().toArray();
      this.lastStatus.collectionsCount = collections.length;
      this.lastSyncTime = new Date().toISOString();
      this.lastStatus.lastSyncAt = this.lastSyncTime;

      return {
        success: true,
        message: `Successfully synchronized ${totalSynced} items to MongoDB Atlas (${this.lastStatus.collectionsCount} collections active).`,
        documentsSynced: totalSynced
      };
    } catch (err: any) {
      console.error('[MongoDB Atlas] Sync error:', err);
      return { success: false, message: err.message };
    }
  }

  /**
   * Load initial data from MongoDB Atlas if remote has records
   */
  public async loadFromMongoDB(): Promise<Partial<ERPDatabase> | null> {
    if (!this.client || !this.lastStatus.connected) {
      await this.testConnection();
    }
    if (!this.db) return null;
    try {
      const stripId = (doc: any) => {
        if (!doc) return doc;
        const { _id, ...rest } = doc;
        return rest;
      };

      const projects = (await this.db.collection('projects').find({}).toArray()).map(stripId);
      const users = (await this.db.collection('users').find({}).toArray()).map(stripId);
      const masterRates = (await this.db.collection('master_rates').find({}).toArray()).map(stripId);
      const customers = (await this.db.collection('customers').find({}).toArray()).map(stripId);
      const vendors = (await this.db.collection('vendors').find({}).toArray()).map(stripId);
      const resources = (await this.db.collection('resources').find({}).toArray()).map(stripId);
      const workPackages = (await this.db.collection('work_packages').find({}).toArray()).map(stripId);
      const uomList = (await this.db.collection('uom_list').find({}).toArray()).map(stripId);
      const taxRules = (await this.db.collection('tax_rules').find({}).toArray()).map(stripId);

      const companyDoc = await this.db.collection('company_setup').findOne({ setupKey: 'PRIMARY_COMPANY' });
      const archDoc = await this.db.collection('architecture_store').findOne({ storeKey: 'CURRENT' });

      const opsDocs = await this.db.collection('operations').find({}).toArray();
      const operations: Record<string, any[]> = {};
      for (const op of opsDocs) {
        if (op.projectModuleKey && Array.isArray(op.records)) {
          operations[op.projectModuleKey] = op.records;
        }
      }

      const auditLogs = (await this.db.collection('audit_logs').find({}).sort({ timestamp: -1 }).limit(150).toArray()).map(stripId);

      if (projects.length === 0 && users.length === 0) {
        return null;
      }

      const loaded: Partial<ERPDatabase> = {};
      if (projects.length > 0) loaded.projects = projects as any;
      if (users.length > 0) loaded.users = users as any;
      if (masterRates.length > 0) loaded.masterRates = masterRates as any;
      if (customers.length > 0) loaded.customers = customers as any;
      if (vendors.length > 0) loaded.vendors = vendors as any;
      if (resources.length > 0) loaded.resources = resources as any;
      if (workPackages.length > 0) loaded.workPackages = workPackages as any;
      if (uomList.length > 0) loaded.uomList = uomList as any;
      if (taxRules.length > 0) loaded.taxRules = taxRules as any;
      if (companyDoc?.data) loaded.companySetup = companyDoc.data;
      if (archDoc?.data) loaded.architecture = archDoc.data;
      if (Object.keys(operations).length > 0) loaded.operations = operations;
      if (auditLogs.length > 0) loaded.auditLogs = auditLogs as any;

      return loaded;
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Load from database skipped:', err.message);
      return null;
    }
  }

  public getStatus(): MongoDBStatusReport {
    return {
      ...this.lastStatus,
      lastSyncAt: this.lastSyncTime || undefined
    };
  }
}

export const mongoDBService = new MongoDBService();
