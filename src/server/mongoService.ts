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
    if (process.env.MONGODB_URI) {
      return process.env.MONGODB_URI;
    }
    const user = process.env.MONGODB_USERNAME || 'coreenactsolutions_db_user';
    const pass = process.env.MONGODB_PASSWORD || 'sj2QFFWbaAEMgEGC';
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@cluster0.cabxpys.mongodb.net`;
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

      // 4. Company Setup
      if (dbData.companySetup) {
        const setupCol = this.db.collection('company_setup');
        await setupCol.updateOne(
          { setupKey: 'PRIMARY_COMPANY' },
          { $set: { setupKey: 'PRIMARY_COMPANY', data: dbData.companySetup, updatedAt: new Date() } },
          { upsert: true }
        );
        totalSynced++;
      }

      // 5. Operations
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

      // 6. Architecture State
      if (dbData.architecture) {
        const archCol = this.db.collection('architecture_store');
        await archCol.updateOne(
          { storeKey: 'CURRENT' },
          { $set: { storeKey: 'CURRENT', data: dbData.architecture, updatedAt: new Date() } },
          { upsert: true }
        );
        totalSynced++;
      }

      // 7. Audit Logs (recent 150)
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
    if (!this.db) return null;
    try {
      const projects = await this.db.collection('projects').find({}).toArray();
      const users = await this.db.collection('users').find({}).toArray();
      const masterRates = await this.db.collection('master_rates').find({}).toArray();

      if (projects.length === 0 && users.length === 0) {
        return null;
      }

      return {
        projects: projects as any,
        users: users as any,
        masterRates: masterRates as any
      };
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
