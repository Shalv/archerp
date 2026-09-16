-- ==============================================================================
-- Build Storys ERP - Hostinger MySQL Production Database Schema
-- Database: u571508785_arch_erp
-- User: u571508785_Arch
-- Architecture • Interior Design • Renovation • Turnkey Construction Lifecycle
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & ACCESS CONTROL (RBAC)
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(64) PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `role_title` VARCHAR(150),
    `department` VARCHAR(100),
    `phone` VARCHAR(50),
    `status` VARCHAR(50) DEFAULT 'ACTIVE',
    `avatar` VARCHAR(50),
    `assigned_project_ids` TEXT,
    `allowed_module_ids` TEXT,
    `permissions_json` TEXT,
    `notes` TEXT,
    `last_login_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_username` (`username`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. MASTER RATE LIBRARY (QS & ESTIMATION)
CREATE TABLE IF NOT EXISTS `master_rates` (
    `id` VARCHAR(64) PRIMARY KEY,
    `item_code` VARCHAR(50) NOT NULL,
    `trade` VARCHAR(100) NOT NULL,
    `work_package` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `specification` TEXT,
    `brand_grade` VARCHAR(200),
    `unit` VARCHAR(30) NOT NULL,
    `material_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `labour_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `equipment_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `subcontract_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_unit_cost` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `default_markup_percent` DECIMAL(5, 2) DEFAULT 25.00,
    `suggested_selling_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `rate_source` VARCHAR(100) DEFAULT 'APPROVED_MASTER',
    `location` VARCHAR(100) DEFAULT 'NCR / Metro Urban',
    `effective_date` DATE,
    `status` VARCHAR(50) DEFAULT 'APPROVED',
    `hsn_sac_code` VARCHAR(20),
    `gst_rate` DECIMAL(5, 2) DEFAULT 18.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_rates_code` (`item_code`),
    INDEX `idx_rates_trade` (`trade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CUSTOMER MASTER DIRECTORY
CREATE TABLE IF NOT EXISTS `customers` (
    `id` VARCHAR(64) PRIMARY KEY,
    `customer_no` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `phone` VARCHAR(50),
    `company` VARCHAR(255),
    `gstin` VARCHAR(30),
    `billing_address` TEXT,
    `city` VARCHAR(100),
    `status` VARCHAR(50) DEFAULT 'ACTIVE',
    `payment_terms` VARCHAR(100),
    `notes` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_customers_no` (`customer_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. VENDOR & SUBCONTRACTOR DIRECTORY
CREATE TABLE IF NOT EXISTS `vendors` (
    `id` VARCHAR(64) PRIMARY KEY,
    `vendor_no` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100),
    `trade` VARCHAR(100),
    `contact_person` VARCHAR(150),
    `phone` VARCHAR(50),
    `email` VARCHAR(255),
    `city` VARCHAR(100),
    `gstin` VARCHAR(30),
    `pan` VARCHAR(30),
    `rating` DECIMAL(3, 1) DEFAULT 4.5,
    `status` VARCHAR(50) DEFAULT 'ACTIVE',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_vendors_trade` (`trade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. RESOURCE MASTER (LABOUR, PLANT, EQUIPMENT)
CREATE TABLE IF NOT EXISTS `resources` (
    `id` VARCHAR(64) PRIMARY KEY,
    `resource_no` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `trade` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(30) NOT NULL,
    `hourly_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `daily_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `skill_level` VARCHAR(50),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_resources_trade` (`trade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. WORK PACKAGES MASTER
CREATE TABLE IF NOT EXISTS `work_packages` (
    `id` VARCHAR(64) PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `trade` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `sequence_order` INT DEFAULT 0,
    `default_uom` VARCHAR(30),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. UOM LIST MASTER
CREATE TABLE IF NOT EXISTS `uom_list` (
    `code` VARCHAR(30) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50),
    `is_active` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TAX RULES MASTER
CREATE TABLE IF NOT EXISTS `tax_rules` (
    `id` VARCHAR(64) PRIMARY KEY,
    `rule_code` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `rate_percent` DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
    `is_default` BOOLEAN DEFAULT FALSE,
    `hsn_sac_prefix` VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. COMPANY FINANCE & ERP SETUP
CREATE TABLE IF NOT EXISTS `company_setup` (
    `id` VARCHAR(64) PRIMARY KEY,
    `company_name` VARCHAR(255) NOT NULL,
    `gstin` VARCHAR(30),
    `pan` VARCHAR(30),
    `currency` VARCHAR(10) DEFAULT 'INR',
    `financial_year` VARCHAR(20),
    `setup_json` LONGTEXT NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PROJECTS & ENQUIRIES
CREATE TABLE IF NOT EXISTS `projects` (
    `id` VARCHAR(64) PRIMARY KEY,
    `project_code` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `client_name` VARCHAR(255) NOT NULL,
    `client_phone` VARCHAR(50) NOT NULL,
    `client_email` VARCHAR(255) NOT NULL,
    `project_type` VARCHAR(50) NOT NULL,
    `project_scope` VARCHAR(50) NOT NULL,
    `site_address` TEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `stage` VARCHAR(50) NOT NULL DEFAULT 'ENQUIRY',
    `carpet_area_sqft` DECIMAL(10, 2) DEFAULT 0.00,
    `built_up_area_sqft` DECIMAL(10, 2) DEFAULT 0.00,
    `estimated_budget` DECIMAL(14, 2) DEFAULT 0.00,
    `active_revision_id` VARCHAR(64),
    `project_data_json` LONGTEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_projects_code` (`project_code`),
    INDEX `idx_projects_stage` (`stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. BOQ REVISIONS
CREATE TABLE IF NOT EXISTS `boq_revisions` (
    `id` VARCHAR(64) PRIMARY KEY,
    `project_id` VARCHAR(64) NOT NULL,
    `revision_number` INT NOT NULL,
    `revision_label` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'DRAFT',
    `created_by` VARCHAR(150) NOT NULL,
    `approved_by` VARCHAR(150),
    `approved_at` DATETIME,
    `notes` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_boq_rev_proj` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. BOQ ITEMS
CREATE TABLE IF NOT EXISTS `boq_items` (
    `id` VARCHAR(64) PRIMARY KEY,
    `boq_revision_id` VARCHAR(64) NOT NULL,
    `item_code` VARCHAR(50) NOT NULL,
    `trade` VARCHAR(100) NOT NULL,
    `work_package` VARCHAR(150) NOT NULL,
    `floor` VARCHAR(50) NOT NULL,
    `room_zone` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `specification` TEXT,
    `brand_grade` VARCHAR(200),
    `unit` VARCHAR(30) NOT NULL,
    `length` DECIMAL(8, 2),
    `width` DECIMAL(8, 2),
    `height` DECIMAL(8, 2),
    `quantity_formula` TEXT,
    `base_quantity` DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    `wastage_percent` DECIMAL(5, 2) DEFAULT 5.00,
    `final_quantity` DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    `quantity_type` VARCHAR(50) DEFAULT 'MEASURED',
    `material_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `labour_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `equipment_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `subcontract_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `unit_cost` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_cost` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `markup_percent` DECIMAL(5, 2) DEFAULT 25.00,
    `selling_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `selling_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `rate_source` VARCHAR(100) DEFAULT 'APPROVED_MASTER',
    `rate_status` VARCHAR(50) DEFAULT 'APPROVED',
    `is_approved_by_estimator` BOOLEAN DEFAULT FALSE,
    `reviewed_by` VARCHAR(150),
    `item_data_json` LONGTEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_boq_items_rev` (`boq_revision_id`),
    INDEX `idx_boq_items_trade` (`trade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. CUSTOMER QUOTATIONS
CREATE TABLE IF NOT EXISTS `customer_quotations` (
    `id` VARCHAR(64) PRIMARY KEY,
    `project_id` VARCHAR(64) NOT NULL,
    `boq_revision_id` VARCHAR(64),
    `quotation_number` VARCHAR(100) NOT NULL,
    `selected_package_tier` VARCHAR(50) DEFAULT 'STANDARD',
    `customer_name` VARCHAR(255) NOT NULL,
    `quotation_date` DATE,
    `validity_days` INT DEFAULT 30,
    `subtotal_selling_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `gst_percent` DECIMAL(5, 2) DEFAULT 18.00,
    `gst_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `total_quotation_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(50) DEFAULT 'DRAFT',
    `quotation_data_json` LONGTEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_quote_proj` (`project_id`),
    INDEX `idx_quote_no` (`quotation_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. AUDIT TRAIL LOG
CREATE TABLE IF NOT EXISTS `erp_audit_logs` (
    `id` VARCHAR(64) PRIMARY KEY,
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `user_id` VARCHAR(64) NOT NULL,
    `user_name` VARCHAR(150) NOT NULL,
    `user_role` VARCHAR(50) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(100) NOT NULL,
    `entity_id` VARCHAR(100) NOT NULL,
    `details` TEXT,
    INDEX `idx_audit_time` (`timestamp`),
    INDEX `idx_audit_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. OPERATIONAL RECORDS (SITE EXECUTION, PROCUREMENT, QUALITY, ETC.)
CREATE TABLE IF NOT EXISTS `erp_operations` (
    `id` VARCHAR(64) PRIMARY KEY,
    `project_id` VARCHAR(64) NOT NULL,
    `module_id` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `payload_json` LONGTEXT NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_by` VARCHAR(150),
    INDEX `idx_ops_proj_mod` (`project_id`, `module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. ARCHITECTURE STUDIO STORE
CREATE TABLE IF NOT EXISTS `architecture_store` (
    `id` VARCHAR(64) PRIMARY KEY,
    `revision` INT DEFAULT 1,
    `payload_json` LONGTEXT NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
