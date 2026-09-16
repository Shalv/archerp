/**
 * Build Storys ERP - Hostinger MySQL Integration Service
 * Database: u571508785_arch_erp
 * User: u571508785_Arch
 * 
 * Provides connection pooling, automatic DDL schema initialization,
 * two-way sync with local JSON store, and detailed connection diagnostics.
 */

import mysql, { Pool } from 'mysql2/promise';
import { ERPDatabase } from './db';

export interface MySQLStatusReport {
  configured: boolean;
  connected: boolean;
  database: string;
  user: string;
  host: string;
  port: number;
  message: string;
  error?: string;
  errorCode?: string;
  tableCount?: number;
  lastSyncAt?: string;
  remoteAccessGuide?: string[];
}

export class MySQLService {
  private pool: Pool | null = null;
  private isConnecting: boolean = false;
  private lastStatus: MySQLStatusReport = {
    configured: false,
    connected: false,
    database: process.env.MYSQL_DATABASE || 'u571508785_arch_erp',
    user: process.env.MYSQL_USER || 'u571508785_Arch',
    host: process.env.MYSQL_HOST || '',
    port: Number(process.env.MYSQL_PORT) || 3306,
    message: 'Hostinger MySQL database credentials initialized. Awaiting host and password in environment settings.'
  };
  private lastSyncTime: string | null = null;

  constructor() {
    this.initPool();
  }

  /**
   * Parse configuration from individual environment variables or DATABASE_URL
   */
  public getConfig() {
    let host = process.env.MYSQL_HOST || '';
    let port = Number(process.env.MYSQL_PORT) || 3306;
    let user = process.env.MYSQL_USER || 'u571508785_Arch';
    let password = process.env.MYSQL_PASSWORD || '';
    let database = process.env.MYSQL_DATABASE || 'u571508785_arch_erp';

    if (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('mysql://') || process.env.DATABASE_URL.startsWith('mysql2://'))) {
      try {
        const url = new URL(process.env.DATABASE_URL);
        host = url.hostname || host;
        port = url.port ? Number(url.port) : port;
        user = url.username ? decodeURIComponent(url.username) : user;
        password = url.password ? decodeURIComponent(url.password) : password;
        if (url.pathname && url.pathname.length > 1) {
          database = url.pathname.substring(1);
        }
      } catch (err) {
        console.warn('[Hostinger MySQL] Could not parse DATABASE_URL, using individual env variables.');
      }
    }

    return { host, port, user, password, database };
  }

  /**
   * Initializes the MySQL connection pool
   */
  public initPool(): void {
    const config = this.getConfig();
    this.lastStatus.host = config.host;
    this.lastStatus.port = config.port;
    this.lastStatus.user = config.user;
    this.lastStatus.database = config.database;

    if (!config.host || !config.password) {
      this.lastStatus.configured = false;
      this.lastStatus.connected = false;
      this.lastStatus.message = !config.host
        ? 'Awaiting MYSQL_HOST (Hostinger server IP or domain) in Settings / .env'
        : 'Awaiting MYSQL_PASSWORD in Settings / .env';
      this.lastStatus.remoteAccessGuide = this.getRemoteAccessGuide();
      return;
    }

    this.lastStatus.configured = true;

    try {
      if (this.pool) {
        this.pool.end().catch(() => {});
      }

      this.pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        ssl: {
          rejectUnauthorized: false
        }
      });

      // Test in background
      this.testConnection();
    } catch (err: any) {
      this.lastStatus.connected = false;
      this.lastStatus.error = err.message;
      this.lastStatus.message = `Failed to create MySQL pool: ${err.message}`;
    }
  }

  /**
   * Helper guide for Hostinger Remote MySQL activation
   */
  public getRemoteAccessGuide(): string[] {
    return [
      '1. Log in to your Hostinger Control Panel (hPanel).',
      '2. Navigate to Databases -> Remote MySQL.',
      '3. In "Allow IP", enter "%" (without quotes) or your specific container IP to allow remote connections.',
      '4. In "Database", select "u571508785_arch_erp". Click "Create".',
      '5. Under Host / Server IP, copy the MySQL server hostname or IP (e.g. 185.xxx.xxx.xxx or srvXXX.main-hosting.eu).',
      '6. Set MYSQL_HOST and MYSQL_PASSWORD in your environment variables via AI Studio Settings.'
    ];
  }

  /**
   * Test current connection and verify tables
   */
  public async testConnection(): Promise<MySQLStatusReport> {
    const config = this.getConfig();
    if (!config.host || !config.password) {
      this.lastStatus.configured = false;
      this.lastStatus.connected = false;
      this.lastStatus.message = !config.host
        ? 'MYSQL_HOST is not set. Please provide Hostinger host in environment settings.'
        : 'MYSQL_PASSWORD is not set. Please provide your Hostinger database password.';
      this.lastStatus.remoteAccessGuide = this.getRemoteAccessGuide();
      return this.lastStatus;
    }

    if (!this.pool) {
      this.initPool();
    }

    if (!this.pool) {
      return this.lastStatus;
    }

    try {
      this.isConnecting = true;
      const connection = await this.pool.getConnection();
      
      // Ping database and count tables
      const [rows] = await connection.query('SHOW TABLES');
      const tableCount = Array.isArray(rows) ? rows.length : 0;
      connection.release();

      this.lastStatus.configured = true;
      this.lastStatus.connected = true;
      this.lastStatus.tableCount = tableCount;
      this.lastStatus.error = undefined;
      this.lastStatus.errorCode = undefined;
      this.lastStatus.message = `Successfully connected to Hostinger MySQL (${config.database} on ${config.host}:${config.port})! Detected ${tableCount} tables.`;
      
      // If connected but no tables exist, auto-create tables
      if (tableCount === 0) {
        await this.initializeTables();
      }

      return this.lastStatus;
    } catch (err: any) {
      this.lastStatus.connected = false;
      this.lastStatus.error = err.message;
      this.lastStatus.errorCode = err.code;

      let advice = '';
      if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        advice = ' Access denied: Verify user "u571508785_Arch" and password in Hostinger hPanel.';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
        advice = ' Connection timed out: Check if Remote MySQL is enabled with IP "%" in Hostinger hPanel.';
      } else if (err.code === 'ER_BAD_DB_ERROR') {
        advice = ' Database not found: Verify that "u571508785_arch_erp" exists in Hostinger MySQL Databases.';
      }

      this.lastStatus.message = `Connection failed (${err.code || 'UNKNOWN'}): ${err.message}.${advice}`;
      this.lastStatus.remoteAccessGuide = this.getRemoteAccessGuide();
      return this.lastStatus;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Initializes all required ERP tables if they don't exist
   */
  public async initializeTables(): Promise<{ success: boolean; message: string }> {
    if (!this.pool || !this.lastStatus.connected) {
      return { success: false, message: 'MySQL is not connected' };
    }

    const ddlStatements = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        role_title VARCHAR(150),
        department VARCHAR(100),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        avatar VARCHAR(50),
        assigned_project_ids TEXT,
        allowed_module_ids TEXT,
        permissions_json TEXT,
        notes TEXT,
        last_login_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS master_rates (
        id VARCHAR(64) PRIMARY KEY,
        item_code VARCHAR(50) NOT NULL,
        trade VARCHAR(100) NOT NULL,
        work_package VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        specification TEXT,
        brand_grade VARCHAR(200),
        unit VARCHAR(30) NOT NULL,
        material_rate DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        labour_rate DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        equipment_rate DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        subcontract_rate DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        total_unit_cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        default_markup_percent DECIMAL(5, 2) DEFAULT 25.00,
        suggested_selling_rate DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        rate_source VARCHAR(100) DEFAULT 'APPROVED_MASTER',
        location VARCHAR(100) DEFAULT 'NCR / Metro Urban',
        status VARCHAR(50) DEFAULT 'APPROVED',
        hsn_sac_code VARCHAR(20),
        gst_rate DECIMAL(5, 2) DEFAULT 18.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_rates_code (item_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(64) PRIMARY KEY,
        customer_no VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        gstin VARCHAR(30),
        billing_address TEXT,
        city VARCHAR(100),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        payment_terms VARCHAR(100),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_customers_no (customer_no)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS vendors (
        id VARCHAR(64) PRIMARY KEY,
        vendor_no VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        trade VARCHAR(100),
        contact_person VARCHAR(150),
        phone VARCHAR(50),
        email VARCHAR(255),
        city VARCHAR(100),
        gstin VARCHAR(30),
        rating DECIMAL(3, 1) DEFAULT 4.5,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS resources (
        id VARCHAR(64) PRIMARY KEY,
        resource_no VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        trade VARCHAR(100) NOT NULL,
        unit VARCHAR(30) NOT NULL,
        hourly_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        daily_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(64) PRIMARY KEY,
        project_code VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        project_type VARCHAR(50) NOT NULL,
        project_scope VARCHAR(50) NOT NULL,
        site_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        stage VARCHAR(50) NOT NULL DEFAULT 'ENQUIRY',
        carpet_area_sqft DECIMAL(10, 2) DEFAULT 0.00,
        built_up_area_sqft DECIMAL(10, 2) DEFAULT 0.00,
        estimated_budget DECIMAL(14, 2) DEFAULT 0.00,
        active_revision_id VARCHAR(64),
        project_data_json LONGTEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_projects_code (project_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS erp_audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(64) NOT NULL,
        user_name VARCHAR(150) NOT NULL,
        user_role VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        details TEXT,
        INDEX idx_audit_time (timestamp)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS erp_operations (
        id VARCHAR(64) PRIMARY KEY,
        project_id VARCHAR(64) NOT NULL,
        module_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        payload_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(150),
        INDEX idx_ops_proj_mod (project_id, module_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS company_setup (
        id VARCHAR(64) PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        setup_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS architecture_store (
        id VARCHAR(64) PRIMARY KEY,
        revision INT DEFAULT 1,
        payload_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    try {
      const conn = await this.pool.getConnection();
      for (const sql of ddlStatements) {
        await conn.query(sql);
      }
      const [rows] = await conn.query('SHOW TABLES');
      this.lastStatus.tableCount = Array.isArray(rows) ? rows.length : 0;
      conn.release();
      return { success: true, message: `Initialized ${this.lastStatus.tableCount} tables in Hostinger MySQL.` };
    } catch (err: any) {
      console.error('[Hostinger MySQL] Table creation failed:', err);
      return { success: false, message: err.message };
    }
  }

  /**
   * Sync active ERP in-memory / JSON store to Hostinger MySQL
   */
  public async syncToMySQL(db: ERPDatabase): Promise<{ success: boolean; message: string; rowsSynced?: number }> {
    if (!this.pool || !this.lastStatus.connected) {
      return { success: false, message: 'Hostinger MySQL is not currently connected' };
    }

    try {
      const conn = await this.pool.getConnection();
      let totalSynced = 0;

      // 1. Sync Projects
      if (Array.isArray(db.projects)) {
        for (const proj of db.projects) {
          await conn.execute(
            `INSERT INTO projects (id, project_code, title, client_name, client_phone, client_email, project_type, project_scope, site_address, city, stage, carpet_area_sqft, built_up_area_sqft, estimated_budget, active_revision_id, project_data_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             title = VALUES(title), stage = VALUES(stage), estimated_budget = VALUES(estimated_budget), active_revision_id = VALUES(active_revision_id), project_data_json = VALUES(project_data_json)`,
            [
              proj.id,
              proj.projectCode || proj.id,
              proj.title || 'Untitled Project',
              proj.clientName || '',
              proj.clientPhone || '',
              proj.clientEmail || '',
              proj.projectType || 'RESIDENTIAL_INTERIOR',
              proj.projectScope || 'TURNKEY_EXECUTION',
              proj.siteAddress || '',
              proj.city || 'Gurugram / NCR',
              proj.stage || 'ENQUIRY',
              proj.carpetAreaSqFt || 0,
              proj.requirement?.builtUpAreaSqFt || (proj.carpetAreaSqFt ? Math.round(proj.carpetAreaSqFt * 1.25) : 0),
              proj.estimatedBudget || 0,
              proj.activeRevisionId || null,
              JSON.stringify(proj)
            ]
          );
          totalSynced++;
        }
      }

      // 2. Sync Users
      if (Array.isArray(db.users)) {
        for (const u of db.users) {
          await conn.execute(
            `INSERT INTO users (id, username, email, name, password_hash, role, role_title, department, phone, status, avatar, assigned_project_ids, allowed_module_ids, permissions_json, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             name = VALUES(name), role = VALUES(role), role_title = VALUES(role_title), permissions_json = VALUES(permissions_json), status = VALUES(status)`,
            [
              u.id,
              u.username || u.id.toLowerCase(),
              u.email || `${u.id.toLowerCase()}@buildstorys.com`,
              u.name,
              u.password || 'demo',
              u.role,
              u.roleTitle || '',
              u.department || '',
              u.phone || '',
              u.status || 'ACTIVE',
              u.avatar || '',
              JSON.stringify(u.assignedProjectIds || []),
              JSON.stringify(u.allowedModuleIds || []),
              JSON.stringify(u.permissions || {}),
              u.notes || ''
            ]
          );
          totalSynced++;
        }
      }

      // 3. Sync Company Setup
      if (db.companySetup) {
        await conn.execute(
          `INSERT INTO company_setup (id, company_name, setup_json)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE
           company_name = VALUES(company_name), setup_json = VALUES(setup_json)`,
          [
            'SETUP-DEFAULT',
            db.companySetup.companyLegalName || 'Build Storys Private Limited',
            JSON.stringify(db.companySetup)
          ]
        );
        totalSynced++;
      }

      // 4. Sync Audit Logs (recent 100)
      if (Array.isArray(db.auditLogs)) {
        const recentLogs = db.auditLogs.slice(0, 100);
        for (const log of recentLogs) {
          await conn.execute(
            `INSERT INTO erp_audit_logs (id, user_id, user_name, user_role, action, entity_type, entity_id, details)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE action = VALUES(action)`,
            [
              log.id,
              log.userId,
              log.userName,
              log.userRole,
              log.action,
              log.entityType,
              log.entityId,
              log.details
            ]
          );
          totalSynced++;
        }
      }

      conn.release();
      this.lastSyncTime = new Date().toISOString();
      this.lastStatus.lastSyncAt = this.lastSyncTime;

      return {
        success: true,
        message: `Successfully synchronized ${totalSynced} records to Hostinger MySQL.`,
        rowsSynced: totalSynced
      };
    } catch (err: any) {
      console.error('[Hostinger MySQL] Sync error:', err);
      return { success: false, message: err.message };
    }
  }

  /**
   * Get current status report
   */
  public getStatus(): MySQLStatusReport {
    return {
      ...this.lastStatus,
      lastSyncAt: this.lastSyncTime || undefined
    };
  }
}

export const mySQLService = new MySQLService();
