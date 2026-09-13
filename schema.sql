-- ==============================================================================
-- Build Storys ERP - Production PostgreSQL Relational Database Schema
-- Architecture, Interior Design, Renovation & Turnkey Construction Lifecycle
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ACCESS CONTROL (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'ESTIMATOR', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'CLIENT')),
    role_title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MASTER RATE LIBRARY (QS & ESTIMATION)
CREATE TABLE IF NOT EXISTS master_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    trade VARCHAR(100) NOT NULL,
    work_package VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    specification TEXT NOT NULL,
    brand_grade VARCHAR(200),
    unit VARCHAR(30) NOT NULL,
    material_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    labour_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    equipment_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    subcontract_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_unit_cost NUMERIC(12, 2) GENERATED ALWAYS AS (material_rate + labour_rate + equipment_rate + subcontract_rate) STORED,
    default_markup_percent NUMERIC(5, 2) DEFAULT 25.00,
    suggested_selling_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    rate_source VARCHAR(100) DEFAULT 'APPROVED_MASTER',
    location VARCHAR(100) DEFAULT 'NCR / Metro Urban',
    effective_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'PROVISIONAL', 'MISSING', 'STALE')),
    hsn_sac_code VARCHAR(20),
    gst_rate NUMERIC(5, 2) DEFAULT 18.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMER ENQUIRIES & PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    project_scope VARCHAR(50) NOT NULL,
    site_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'ENQUIRY',
    carpet_area_sqft NUMERIC(10, 2) DEFAULT 0.00,
    built_up_area_sqft NUMERIC(10, 2) DEFAULT 0.00,
    estimated_budget NUMERIC(14, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CUSTOMER REQUIREMENTS & SITE SURVEY
CREATE TABLE IF NOT EXISTS project_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    preferred_design_style TEXT,
    materials_brands_preferences TEXT,
    civil_requirements TEXT,
    electrical_requirements TEXT,
    plumbing_requirements TEXT,
    hvac_requirements TEXT,
    joinery_kitchen_preferences TEXT,
    customer_budget_min NUMERIC(14, 2),
    customer_budget_max NUMERIC(14, 2),
    target_completion_date DATE,
    exclusions_customer_supplied TEXT,
    site_access_constraints TEXT,
    survey_notes TEXT,
    raw_brief_hinglish TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ROOM SPACES & MEASUREMENTS
CREATE TABLE IF NOT EXISTS project_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    room_name VARCHAR(150) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    length_ft NUMERIC(8, 2) NOT NULL,
    width_ft NUMERIC(8, 2) NOT NULL,
    height_ft NUMERIC(8, 2) NOT NULL,
    carpet_area_sqft NUMERIC(10, 2) GENERATED ALWAYS AS (length_ft * width_ft) STORED,
    perimeter_ft NUMERIC(10, 2) GENERATED ALWAYS AS (2 * (length_ft + width_ft)) STORED,
    wall_area_sqft NUMERIC(10, 2) GENERATED ALWAYS AS (2 * (length_ft + width_ft) * height_ft) STORED,
    ceiling_area_sqft NUMERIC(10, 2) GENERATED ALWAYS AS (length_ft * width_ft) STORED,
    existing_condition TEXT,
    demolition_required BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- 6. UPLOADED DOCUMENTS & DRAWINGS
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    size_kb INTEGER NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    version VARCHAR(20) DEFAULT 'v1.0',
    scale_confirmed BOOLEAN DEFAULT FALSE,
    scale_ratio VARCHAR(50),
    file_storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BOQ REVISIONS
CREATE TABLE IF NOT EXISTS boq_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    revision_number INTEGER NOT NULL,
    revision_label VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ESTIMATOR_REVIEW', 'APPROVED', 'FROZEN_BASELINE')),
    created_by VARCHAR(100) NOT NULL,
    approved_by VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BOQ LINE ITEMS (DETERMINISTIC FORMULAS)
CREATE TABLE IF NOT EXISTS boq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boq_revision_id UUID REFERENCES boq_revisions(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    trade VARCHAR(100) NOT NULL,
    work_package VARCHAR(150) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    room_zone VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    specification TEXT NOT NULL,
    brand_grade VARCHAR(200),
    inclusions TEXT,
    exclusions TEXT,
    unit VARCHAR(30) NOT NULL,
    length NUMERIC(8, 2),
    width NUMERIC(8, 2),
    height NUMERIC(8, 2),
    quantity_formula TEXT NOT NULL,
    base_quantity NUMERIC(12, 3) NOT NULL,
    wastage_percent NUMERIC(5, 2) DEFAULT 5.00,
    final_quantity NUMERIC(12, 3) NOT NULL,
    quantity_type VARCHAR(50) DEFAULT 'MEASURED' CHECK (quantity_type IN ('MEASURED', 'USER_ENTERED', 'PROVISIONAL_ALLOWANCE')),
    
    -- Costing Components
    material_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    labour_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    equipment_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    subcontract_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unit_cost NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(14, 2) NOT NULL,
    
    -- Commercial Pricing
    markup_percent NUMERIC(5, 2) DEFAULT 25.00,
    selling_rate NUMERIC(12, 2) NOT NULL,
    selling_amount NUMERIC(14, 2) NOT NULL,
    
    rate_source VARCHAR(100) DEFAULT 'APPROVED_MASTER',
    rate_status VARCHAR(50) DEFAULT 'APPROVED',
    source_document_ref TEXT,
    assumptions TEXT,
    uncertainty_flags TEXT,
    is_approved_by_estimator BOOLEAN DEFAULT FALSE,
    reviewed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CUSTOMER QUOTATIONS & MILESTONES
CREATE TABLE IF NOT EXISTS customer_quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    boq_revision_id UUID REFERENCES boq_revisions(id),
    quotation_number VARCHAR(100) UNIQUE NOT NULL,
    selected_package_tier VARCHAR(50) DEFAULT 'STANDARD',
    quotation_date DATE DEFAULT CURRENT_DATE,
    validity_days INTEGER DEFAULT 30,
    subtotal_selling_amount NUMERIC(14, 2) NOT NULL,
    gst_percent NUMERIC(5, 2) DEFAULT 18.00,
    gst_amount NUMERIC(14, 2) NOT NULL,
    total_quotation_amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotation_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID REFERENCES customer_quotations(id) ON DELETE CASCADE,
    milestone_name VARCHAR(150) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    stage_trigger TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING'
);

-- 10. AUDIT TRAIL LOG
CREATE TABLE IF NOT EXISTS erp_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT
);
