# BUILD STORYS ERP - CUSTOMER TRAINING & OPERATIONS MANUAL
## End-to-End Module-Wise Step-by-Step Training Guide

---

### Document Overview
* **Application Title:** Build Storys ERP (Architecture • Interiors • Renovation • Turnkey Construction)
* **Design Standard:** Microsoft Dynamics 365 Business Central Role Center & Modern Job Card Architecture
* **Target Audience:** Property Owners, Enterprise Clients, Managing Directors, Project Managers, Architects, Quantity Surveyors, Site Engineers, Procurement Leads, and Finance Officers.
* **Document Purpose:** This manual provides a complete, module-wise sequential training curriculum. Each module is documented step-by-step with prerequisites, exact user interface workflows, business logic, validation rules, and expected milestones.

---

## TABLE OF CONTENTS
1. [System Fundamentals & User Role Center](#1-system-fundamentals--user-role-center)
2. [Global Setup: Company Profile, Multi-State GST & Chart of Accounts](#2-global-setup-company-profile-multi-state-gst--chart-of-accounts)
3. [Stage 1: Enquiry & CRM Pipeline (M01, M02)](#3-stage-1-enquiry--crm-pipeline-m01-m02)
4. [Stage 2: Survey, Architecture & Material Palette (M03, M04, M05)](#4-stage-2-survey-architecture--material-palette-m03-m04-m05)
5. [Stage 3: Estimation, BOQ & Cost Traceability (M06, M07, M08, M09)](#5-stage-3-estimation-boq--cost-traceability-m06-m07-m08-m09)
6. [Stage 4: Commercial Proposals, Contracts & Variations (M10, M11, M12)](#6-stage-4-commercial-proposals-contracts--variations-m10-m11-m12)
7. [Stage 5: Site Operations, Procurement & Quality Control (M29, M13, M14, M15, M16, M17, M27, M28, M18, M24)](#7-stage-5-site-operations-procurement--quality-control)
8. [Stage 6: Customer Billing, RA Invoices & Financial Ledger (M19, M20)](#8-stage-6-customer-billing-ra-invoices--financial-ledger-m19-m20)
9. [Stage 7: Project Handover, Warranty & Mandatory Reports (M21, M22, M23, M26)](#9-stage-7-project-handover-warranty--mandatory-reports-m21-m22-m23-m26)
10. [Stage 8: Agentic AI Copilot, Transmittals & Administration](#10-stage-8-agentic-ai-copilot-transmittals--administration)

---

## 1. SYSTEM FUNDAMENTALS & USER ROLE CENTER

### 1.1 Understanding the User Interface Layout
Build Storys ERP is structured according to Microsoft Dynamics 365 Business Central design principles:
1. **Top Navigation Ribbon:**
   - **Company / Project Selector:** Switch between active architectural/interior projects or create a new Job Card.
   - **Tell Me Search Bar (Alt+Q):** Instant omni-search to jump to any of the 30+ modules, reports, or setup forms.
   - **Data Inspector (Ctrl+Alt+F1):** Inspect technical table fields, primary keys, and audit timestamps.
   - **Audit Logs & System Status:** Track user activities, login sessions, and permission telemetry.
   - **User Profile & Switcher:** View your active role, security credentials, and project permissions.
2. **Left Navigation Sidebar:**
   - Hierarchical breakdown into **7 Lifecycle Stages** (Enquiry → Survey/Design → Estimation/BOQ → Commercial → Execution → Billing → Handover) plus Administration.
   - Expandable and collapsible to maximize screen workspace.
3. **Main Document Work Area:**
   - Displays the active module form, editable data grid, or interactive dashboard.
4. **Docked Right FactBox Pane:**
   - Displays real-time project metrics (Total Contract Sum, Budget Cost, Invoiced to Date, Margin %, Pending Snags, Schedule Variance).

### 1.2 Role-Based Access Control (RBAC)
The application automatically tailors menus, approval buttons, and editable grids to the user's role:
* **Administrator (`ADMIN`):** Unrestricted access across all company configurations, user provisioning, audit trails, and financial baselines.
* **Principal Architect (`ARCHITECT`):** Authority over CAD drawings, 3D renders, revision approvals, material samples, and design compliance.
* **Senior Estimator / QS (`ESTIMATOR`):** Authority over Master Schedule of Rates (Table 27), BOQ takeoffs, unit rate analysis, and baseline budget freezes.
* **Project / Commercial Manager (`PROJECT_MANAGER`):** Authority over customer quotations, value engineering packages, contract sign-offs, variation orders (VOs), and milestone billings.
* **Site Engineer / Execution Lead (`SITE_ENGINEER`):** Authority over Daily Progress Reports (DPR), material inward (GRN), subcontractor measurement books, timesheets, and snag rectifications.
* **Client / Property Owner (`CLIENT`):** Read-only transparency portal to inspect project progress, approve design revisions, view photos, and pay milestone invoices.

---

## 2. GLOBAL SETUP: COMPANY PROFILE, MULTI-STATE GST & CHART OF ACCOUNTS

### Module: Company Setup Master (Finance & Corporate Entity)
* **Access Path:** Left Sidebar → Stage 6 • Billing & Finance → *Company Setup Master (Finance)*
* **Target Roles:** Administrator, Managing Director, Chief Financial Officer.
* **Purpose:** Establishes legal compliance, corporate identity, multi-state GST registrations, banking payment gateways, and General Ledger (GL) accounts.

#### Step-by-Step Walkthrough:
* **Step 1 - Corporate Entity Profile:**
  1. Open **Company Setup Master**.
  2. Under the **General Information** FastTab, enter the Legal Entity Name (e.g., `Build Storys Turnkey Projects Pvt Ltd`), CIN, Registered Address, Official Email, and Support Hotline.
  3. Upload the corporate logo to ensure automatic rendering on Quotations, Invoices, and Handover Certificates.
* **Step 2 - Multi-State GST & Tax Profiles:**
  1. Navigate to the **Tax & GST Setup** tab.
  2. Enter the primary State Code and 15-digit GSTIN (e.g., `29AABCB1234F1Z5` for Karnataka).
  3. Specify applicable tax splits: CGST (9%) + SGST (9%) for intra-state supplies, or IGST (18%) for inter-state contracts.
* **Step 3 - Bank Accounts & Payment Gateways:**
  1. Navigate to the **Banking & Settlement** tab.
  2. Input Primary Corporate Bank Name, Account Number, Branch IFSC Code, and Virtual Account details for client wire transfers.
* **Step 4 - Chart of Accounts (GL) Mapping:**
  1. Verify the standard General Ledger account codes:
     - `GL-4010`: Architectural & Design Service Revenue
     - `GL-4020`: Turnkey Civil & Interior Contracting Revenue
     - `GL-5010`: Direct Raw Material Purchases
     - `GL-5020`: Subcontractor Trade Labor
     - `GL-5030`: Machinery & Scaffolding Rentals
  2. Click **Save Company Master Setup**.

---

## 3. STAGE 1: ENQUIRY & CRM PIPELINE (M01, M02)

### Module M01: CRM & Lead Funnel Pipeline
* **Access Path:** Left Sidebar → Stage 1 • Enquiry & CRM → *CRM & Lead Funnel*
* **Target Roles:** Commercial Manager, Business Development Lead, Design Consultant.
* **Objective:** Capture incoming architectural/interior leads, qualify project budget, and schedule the mandatory site visit.

#### Step-by-Step Walkthrough:
* **Step 1 - Register New Client Enquiry:**
  1. Open **CRM & Lead Funnel**.
  2. Click the **+ New Lead** action button.
  3. Fill out the lead card:
     - **Client Name:** (e.g., `Dr. Rajesh Mehra`)
     - **Contact Number & Email:** (e.g., `+91 98860 12345`, `dr.rajesh@gmail.com`)
     - **Project Typology:** Choose from *Luxury Residential Apartment*, *Independent Villa*, *Commercial Office*, *Retail / Showroom*, or *Heritage Renovation*.
     - **Tentative Carpet Area:** Enter in Square Feet (e.g., `4,200 sq.ft`).
     - **Client Anticipated Budget:** Enter budget in INR (e.g., `₹ 85,00,000`).
     - **Lead Source:** Select *Referral*, *Instagram / Social*, *Architectural Consultant*, or *Walk-in*.
  4. Click **Create Lead**.
* **Step 2 - Lead Qualification & Site Visit Scheduling:**
  1. Move the lead through the Kanban stages: `New Inquiry` → `Contacted` → `Needs Assessment` → `Site Visit Scheduled`.
  2. Click **Schedule Site Survey** on the lead card.
  3. Assign the Lead Surveyor / Architect and set the survey date/time.
* **Step 3 - Convert Lead to Active Job Card:**
  1. Once qualified, click **Promote to Project (Job Card)**.
  2. The system automatically provisions a unique Project Code (e.g., `PROJ-MEHRA-4200`) and transfers customer details to the Directory.

---

### Module M02: Customers & Contacts Directory
* **Access Path:** Left Sidebar → Stage 1 • Enquiry & CRM → *Customers & Contacts Directory*
* **Target Roles:** Account Manager, Project Manager, Finance Officer.
* **Objective:** Manage corporate and individual customer dossiers, authorized signatories, billing addresses, and tax exemption certificates.

#### Step-by-Step Walkthrough:
* **Step 1 - Inspect Customer Record:**
  1. Select the newly generated customer record.
  2. Review the **Billing Address**, **Site Delivery Address**, and **Primary Contact**.
* **Step 2 - Assign Stakeholders:**
  1. Add project stakeholders: Client Representative, Turnkey Contractor, MEP Consultant, and Structural Auditor.
  2. Set portal login permissions if the client will access the digital satisfaction portal.

---

## 4. STAGE 2: SURVEY, ARCHITECTURE & MATERIAL PALETTE (M03, M04, M05)

### Module M03: Site Survey & Laser Scan Hub
* **Access Path:** Left Sidebar → Stage 2 • Survey & Design → *Site Survey & Laser Scan Hub*
* **Target Roles:** Site Engineer, Lead Architect, Quantity Surveyor.
* **Objective:** Record precise digital measurements, structural beam heights, and physical site constraints.

#### Step-by-Step Walkthrough:
* **Step 1 - Record Laser Measurements:**
  1. Open **Site Survey & Laser Scan Hub**.
  2. Connect digital tool or manually input Bosch GLM 50 laser scan readings.
  3. Define room-by-room dimensions:
     - *Living & Foyer:* Length (28.5 ft) × Width (18.2 ft) × Clear Ceiling Height (10.5 ft).
     - *Master Bedroom Suite:* Length (22.0 ft) × Width (16.0 ft) × Height (10.5 ft).
     - *Modular Kitchen:* Length (14.0 ft) × Width (11.5 ft) × Height (10.5 ft).
* **Step 2 - Identify Structural & MEP Constraints:**
  1. Check constraint flags: Existing plumbing shaft location, structural shear wall (no-chasing zone), low beam soffit, or AC copper line routing.
  2. Upload pre-existing site photos and video walkthroughs.
* **Step 3 - Lock & Validate Survey:**
  1. Click **Submit & Lock Survey Dimensions**.
  2. These dimensions serve as the single source of truth for the subsequent CAD layout and BOQ area calculations.

---

### Module M04: Architectural Drawings & 3D Renderings
* **Access Path:** Left Sidebar → Stage 2 • Survey & Design → *Architectural Drawings & 3D*
* **Target Roles:** Principal Architect, 3D Visualizer, Project Manager.
* **Objective:** Manage CAD 2D layouts, MEP schematics, 3D photorealistic visualizations, and Good-for-Construction (GFC) drawings.

#### Step-by-Step Walkthrough:
* **Step 1 - Upload Drawing Packages:**
  1. Open **Architectural Drawings & 3D**.
  2. Click **Upload Drawing Sheet**.
  3. Select category: *2D Architectural Layout*, *Reflected Ceiling Plan (RCP)*, *MEP & Electrical Chasing*, or *Joinery Millwork Details*.
  4. Specify Revision Number: `Rev A (Concept)` or `Rev B (Approved for Construction)`.
* **Step 2 - Review 3D Photorealistic Views:**
  1. Switch to the **3D Virtual Renderings** view.
  2. Review the spatial materials: Italian Statuario marble flooring, fluted oak wall paneling, magnetic profile lighting.
* **Step 3 - Grant GFC (Good-for-Construction) Stamp:**
  1. Architect reviews the compliance checklist.
  2. Click **Approve as GFC (Good-for-Construction)**.
  3. The drawing is stamped with a digital watermark and made available immediately to the site execution team.

---

### Module M05: Material & Sample Approval Matrix
* **Access Path:** Left Sidebar → Stage 2 • Survey & Design → *Material & Sample Approvals*
* **Target Roles:** Interior Designer, Architect, Client.
* **Objective:** Formally log physical material swatches, brand selections, and obtain client sign-off prior to procurement.

#### Step-by-Step Walkthrough:
* **Step 1 - Register Sample Items:**
  1. Open **Material & Sample Approvals**.
  2. Add new sample cards:
     - Veneer: *Smoked Eucalyptus 0.5mm* (Brand: Decowood / Greenlam).
     - Sanitary Fittings: *Concealed Thermostatic Mixer - Brushed Gunmetal* (Brand: Grohe).
     - Plywood: *IS:710 Marine Grade BWP Calibrated Plywood* (Brand: CenturyPly Club Prime).
* **Step 2 - Track Physical Sample Status:**
  1. Set status: `Requested from Vendor` → `Sample Received at Studio` → `Presented to Client`.
* **Step 3 - Record Client Sign-off:**
  1. Capture digital client signature or upload countersigned swatch tag.
  2. Set status to `Approved by Client`. Procurement is now unlocked for these items.

---

## 5. STAGE 3: ESTIMATION, BOQ & COST TRACEABILITY (M06, M07, M08, M09)

### Module M06: Master Schedule of Rates (Table 27)
* **Access Path:** Left Sidebar → Stage 3 • Estimation & BOQ → *Master Schedule of Rates*
* **Target Roles:** Chief QS, Cost Controller, Estimator.
* **Objective:** Standardize standardized unit rate libraries across civil, carpentry, electrical, plumbing, painting, and HVAC works.

#### Step-by-Step Walkthrough:
* **Step 1 - Browse Standard Rate Items:**
  1. Open **Master Schedule of Rates**.
  2. Search by Item Code or Category (e.g., `CIVIL-CONC-01`, `WOOD-VENEER-04`, `PAINT-PU-02`).
* **Step 2 - Inspect Rate Breakdown:**
  1. Click any item to inspect its components:
     - **Base Material Cost:** (e.g., ₹ 420 per sq.ft)
     - **Direct Skilled/Unskilled Labor:** (e.g., ₹ 180 per sq.ft)
     - **Equipment & Consumables:** (e.g., ₹ 45 per sq.ft)
     - **Standard Markup (Profit + Overheads):** (e.g., 20%)
* **Step 3 - Update or Add New Custom Item:**
  1. Click **+ Add Master Rate Item**.
  2. Provide Item Code, Description, Standard UOM (`SQFT`, `RFT`, `NOS`, `LUMPSUM`), Base Cost, and Default Sales Price.
  3. Click **Save Rate Item**.

---

### Module M07: BOQ Estimating Engine & Job Planning Lines
* **Access Path:** Left Sidebar → Stage 3 • Estimation & BOQ → *BOQ Estimating Engine* (or Job Card → Tab *Job Planning Lines*)
* **Target Roles:** Senior Quantity Surveyor, Lead Estimator, Project Manager.
* **Objective:** Produce comprehensive, itemized Bill of Quantities with automatic rate calculation, room tagging, and revision baselining.

#### Step-by-Step Walkthrough:
* **Step 1 - Generate BOQ Lines via AI or Manual Selection:**
  1. Open the **BOQ Estimating Engine**.
  2. Option A: Click **✨ AI Takeoff from Survey Dimensions** to auto-populate all civil, false ceiling, and joinery lines based on room dimensions.
  3. Option B: Click **+ Add Line Item** to select from the Master Schedule of Rates.
* **Step 2 - Configure Planning Line Attributes:**
  1. For each line, verify:
     - **Line Description:** (e.g., *Full-height bedroom wardrobes with marine ply carcass, veneer shutters & Blum soft-close hinges*).
     - **Room Location:** (e.g., `Master Suite`, `Living Room`, `Kitchen`).
     - **Quantity & UOM:** (e.g., `180.00 SQFT`).
     - **Unit Cost:** Derived from Table 27 (e.g., `₹ 1,850.00`).
     - **Markup %:** (e.g., `22.5%`).
     - **Unit Price & Total Price:** Computed automatically (`₹ 2,266.25` / line total: `₹ 4,07,925.00`).
* **Step 3 - Baseline the Revision:**
  1. Click **Approve as Official Budget Baseline**.
  2. This creates an unalterable snapshot (e.g., `Revision B - Baseline Approved`) against which all future variations and costs will be tracked.

---

### Module M08: Cost Budget & Margin Analysis
* **Access Path:** Left Sidebar → Stage 3 • Estimation & BOQ → *Cost Budget & Margin Analysis*
* **Target Roles:** Commercial Manager, Managing Director, Project Manager.
* **Objective:** Analyze estimated direct costs, indirect overheads, project contingency reserve, and targeted profit margins.

#### Step-by-Step Walkthrough:
* **Step 1 - Review Direct vs Indirect Cost Allocations:**
  1. Open **Cost Budget & Margin Analysis**.
  2. Inspect cost groupings:
     - **Material Cost:** ~55% of budget.
     - **Labor Cost:** ~25% of budget.
     - **Subcontractor & Specialized MEP:** ~10% of budget.
* **Step 2 - Verify Statutory Overheads & Contingency:**
  1. Confirm **Site Overheads** (Site office, electricity, water, security) set at `8.0%`.
  2. Confirm **Unforeseen Contingency Reserve** set at `5.0%`.
* **Step 3 - Margin Health Guardrail:**
  1. Review the projected **Gross Profit Margin** (Target: ≥ 18.5%).
  2. If margin is below target threshold, the system displays an amber warning prompting rate optimization before customer quotation issuance.

---

### Module M09: Cost Traceability Matrix
* **Access Path:** Left Sidebar → Stage 3 • Estimation & BOQ → *Cost Traceability Matrix*
* **Target Roles:** Cost Controller, Quantity Surveyor, Internal Auditor.
* **Objective:** Perform end-to-end reconciliation connecting every BOQ item to its underlying Budget, Purchase Orders, Subcontracts, and Actual Incurred Cost.

#### Step-by-Step Walkthrough:
* **Step 1 - Inspect Traceability Line-by-Line:**
  1. Open **Cost Traceability Matrix**.
  2. Observe the 4-tier audit columns:
     `[BOQ Item Code]` → `[Baseline Budget Allocation]` → `[Committed PO / WO Amount]` → `[Actual Incurred / Paid]`.
* **Step 2 - Detect Cost Leakages:**
  1. Items with Committed Cost > Budget Allocation are flagged with a **Red Variance Indicator**.
  2. Click the variance indicator to see the offending Purchase Order or Subcontract claim.

---

## 6. STAGE 4: COMMERCIAL PROPOSALS, CONTRACTS & VARIATIONS (M10, M11, M12)

### Module M10: Customer Quotation & Sales
* **Access Path:** Left Sidebar → Stage 4 • Commercial & Contracts → *Customer Quotation & Sales*
* **Target Roles:** Commercial Director, Business Development Lead.
* **Objective:** Produce branded customer proposals with tiered Value Engineering options and payment milestone tranches.

#### Step-by-Step Walkthrough:
* **Step 1 - Select Tiered Package (Value Engineering):**
  1. Open **Customer Quotation & Sales**.
  2. Choose the targeted proposal package:
     - **Economy Package:** Melamine polish, commercial BWR plywood, standard sanitaryware.
     - **Standard Package (Recommended):** Natural teak veneer with PU matte finish, marine ply, Hafele hardware.
     - **Premium Luxury Package:** Imported Italian marble, exotic smoked eucalyptus veneers, Blum motorized servo-drive hardware, smart home automation.
* **Step 2 - Configure Milestone Payment Tranches:**
  1. Establish progressive client payment schedule:
     - *Tranche 1 (Mobilization Advance):* 20% on contract signing.
     - *Tranche 2 (Civil & MEP Rough-in Completion):* 25%.
     - *Tranche 3 (Carpentry & Woodwork Carcass):* 30%.
     - *Tranche 4 (Finishing, Painting & Fixtures):* 20%.
     - *Tranche 5 (Final Handover & Zero Snag):* 5%.
* **Step 3 - Generate & Export Formal Quotation:**
  1. Click **Post & Generate Formal Quotation**.
  2. System issues a registered Quotation ID (e.g., `QT-2026-0891`).
  3. Click **Print / Export PDF** to download a print-ready client document with company letterhead, terms, and payment details.

---

### Module M11: Commercial Contracts & Legal Terms
* **Access Path:** Left Sidebar → Stage 4 • Commercial & Contracts → *Commercial Contracts & Terms*
* **Target Roles:** Project Manager, Legal Advisor, Managing Director.
* **Objective:** Formalize turnkey interior contracting agreement, retention policies, and Defect Liability Period (DLP).

#### Step-by-Step Walkthrough:
* **Step 1 - Review Contract Terms FastTab:**
  1. Verify Total Lump-Sum Contract Amount inclusive of GST.
  2. Specify **Retention Money Clause:** 5.0% withheld from each RA bill, released upon DLP expiration (12 months post-handover).
  3. Specify **Liquidated Damages (LD):** 0.5% per week of unjustified delay, capped at 5.0% of contract value.
* **Step 2 - Digital Signing & Counter-Sign:**
  1. Upload signed customer agreement PDF.
  2. Mark contract status as `Executed & Legally Binding`.

---

### Module M12: Variation Orders & Scope Change Control
* **Access Path:** Left Sidebar → Stage 4 • Commercial & Contracts → *Variation Orders & Scope Changes*
* **Target Roles:** Project Manager, Quantity Surveyor, Client.
* **Objective:** Manage mid-execution client scope additions or deletions without eroding project profitability.

#### Step-by-Step Walkthrough:
* **Step 1 - Log Scope Change Request:**
  1. Click **+ New Variation Order (VO)**.
  2. Enter VO Number (e.g., `VO-01: Additional Balcony Decking & Pergola`).
  3. Specify scope description, required extra quantities, and unit rates.
* **Step 2 - Calculate Schedule & Cost Impact:**
  1. Additional Cost Impact: (e.g., `+ ₹ 2,85,000 + GST`).
  2. Schedule Extension: (e.g., `+ 7 Working Days`).
* **Step 3 - Obtain Customer Approval:**
  1. Send VO approval request to the Customer Portal.
  2. Once signed off, click **Merge VO into Job Card Budget**.
  3. Active contract value and budget lines update automatically in real-time.

---

## 7. STAGE 5: SITE OPERATIONS, PROCUREMENT & QUALITY CONTROL

### Module M29: Project Management Hub & Kanban Tasks
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Project Management & Tasks*
* **Target Roles:** Project Manager, Site Supervisor, Trade Contractors.
* **Objective:** Organize sprint activities and daily tasks across a multi-column Kanban board.

#### Step-by-Step Walkthrough:
1. Open **Project Management & Tasks**.
2. View columns: `Backlog`, `Scheduled This Week`, `In Progress`, `Quality Inspection`, `Completed`.
3. Drag and drop task cards (e.g., *Kitchen Dado Tile Laying*, *False Ceiling Framing*).
4. Click any card to set priority (`Urgent`, `High`, `Normal`), assignees, and checklist sub-items.

---

### Module M13: Master Site Schedule & WBS Gantt
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Site Schedule & Master WBS*
* **Target Roles:** Planning Engineer, Project Manager.
* **Objective:** Monitor critical path milestones, task dependencies, and scheduled vs actual progress.

#### Step-by-Step Walkthrough:
1. Open **Site Schedule & Master WBS**.
2. Review the timeline phases: `Civil & Demolition` → `MEP First Fix` → `Carpentry Carcass` → `Polishing & Painting` → `MEP Second Fix` → `Deep Cleaning & Snagging`.
3. Check Planned Start/End dates against Actual Site Progress %.
4. Identify schedule slippage early to trigger resource redeployment.

---

### Module M14: Daily Progress Reports (DPR)
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Daily Progress Reports (DPR)*
* **Target Roles:** Site Engineer, Site Supervisor.
* **Objective:** Document daily site activities, trade attendance, weather conditions, material arrivals, and site progress photos.

#### Step-by-Step Walkthrough:
* **Step 1 - Create Today's DPR:**
  1. Open **Daily Progress Reports (DPR)**.
  2. Click **+ New Daily Report**. System auto-fills current date and weather.
* **Step 2 - Log Manpower Attendance:**
  1. Input headcount by trade:
     - Carpenters: 8 | Helpers: 4
     - Electricians: 2 | Plumbers: 2
     - Painters: 4 | Tile Masons: 3
* **Step 3 - Detail Activities Completed Today:**
  1. Record progress: *Completed gypsum ceiling framing in Dining area (100%); 2nd coat primer applied in Bed 2; Master bathroom tiling ongoing (65%)*.
* **Step 4 - Upload Site Photos:**
  1. Upload minimum 3 timestamped site photos.
  2. Click **Submit DPR for Project Manager Review**.

---

### Module M15: Procurement & Purchase Orders
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Procurement & Purchase Orders*
* **Target Roles:** Procurement Officer, Purchase Manager, Quantity Surveyor.
* **Objective:** Issue approved vendor Purchase Orders (POs), track lead times, and control committed costs against budget caps.

#### Step-by-Step Walkthrough:
1. Open **Procurement & Purchase Orders**.
2. Click **+ Create Purchase Order**.
3. Select Approved Vendor from Table 23 (e.g., *St. Gobain Glass World*, *Century Plywood Depot*).
4. Add line items matched to BOQ Item Codes.
5. Verify that PO total does not exceed the line item budget.
6. Click **Approve & Dispatch PO to Vendor**.

---

### Module M16: Material Inward & GRN Stock Register
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Material Inward & GRN Stock*
* **Target Roles:** Storekeeper, Site Engineer.
* **Objective:** Verify physical deliveries against POs, issue Goods Received Notes (GRN), and inspect material quality.

#### Step-by-Step Walkthrough:
1. When delivery vehicle arrives at site, open **Material Inward & GRN Stock**.
2. Click **+ Record Material Inward (GRN)**.
3. Select PO Number. Verify Vendor Delivery Challan and Invoice Number.
4. Input Quantity Received vs Quantity Damaged/Rejected.
5. Capture photo of delivery challan.
6. Click **Post GRN**. Site inventory is updated immediately.

---

### Module M17: Subcontractors & Joint Measurement Book (MB)
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Subcontractors & Joint MB*
* **Target Roles:** Site Engineer, Subcontractor, Quantity Surveyor.
* **Objective:** Record jointly verified physical site measurements to certify subcontractor labor bills.

#### Step-by-Step Walkthrough:
1. Open **Subcontractors & Joint MB**.
2. Select Trade Contractor (e.g., *Suresh Interiors - Gypsum Ceilings*).
3. Record measurements: Length × Breadth = Certified Area (e.g., `1,250 SQFT @ ₹ 45/SQFT`).
4. Site Engineer and Subcontractor provide joint sign-off.
5. Certified amount feeds directly into the Subcontractor Payment Voucher.

---

### Module M27: Employee Timesheet Management
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Employee Timesheet Log*
* **Target Roles:** Architects, Project Managers, Site Engineers, Interns.
* **Objective:** Track exact billable working hours against projects with an interactive live stopwatch.

#### Step-by-Step Walkthrough:
1. Open **Employee Timesheet Log**.
2. Select Task Type: *Site Inspection*, *CAD Detailing*, *Client Meeting*, or *Material Procurement*.
3. Option A: Click **Start Live Timer** while performing the task, then click **Stop & Log Hours**.
4. Option B: Manually input hours worked and detailed notes.
5. Billable cost is calculated automatically based on employee hourly rate.

---

### Module M28: Resource Deployment Matrix
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Resource Deployment Matrix*
* **Target Roles:** General Superintendent, Project Manager.
* **Objective:** Allocate and balance labor crews, specialized tools, and machinery across active project sites.

#### Step-by-Step Walkthrough:
1. Open **Resource Deployment Matrix**.
2. View active trade allocations across all active sites.
3. If Site A has excess carpentry capacity while Site B has a deadline, reallocate resources seamlessly with drag-and-drop.

---

### Module M18: Quality Audits & Snag List Management
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Quality Audits & Snags*
* **Target Roles:** QA/QC Auditor, Lead Architect, Site Engineer.
* **Objective:** Log defects, assign rectification owners, enforce SLA deadlines, and verify photographic evidence before closing items.

#### Step-by-Step Walkthrough:
* **Step 1 - Log Defect / Snag Item:**
  1. Open **Quality Audits & Snags**.
  2. Click **+ Log Snag Item**.
  3. Specify:
     - **Location:** (e.g., *Master Bedroom - West Wall*).
     - **Defect Description:** (e.g., *Paint brush marks and uneven patch visible under natural light*).
     - **Severity Level:** Select `Critical`, `Major`, or `Minor Cosmetic`.
     - **Assigned Trade:** (e.g., *Painting Contractor*).
     - **Rectification Due Date:** (e.g., *Within 48 hours*).
  4. Upload photo showing the defect.
* **Step 2 - Verify Rectification:**
  1. Once rectified by the trade, contractor uploads after-rectification photo.
  2. Site Engineer inspects work and clicks **Verify & Close Snag**.
  3. Item is archived with full audit timestamp.

---

### Module M24: Compliance, Licenses & Permits to Work (PTW)
* **Access Path:** Left Sidebar → Stage 5 • Execution & Site Ops → *Compliance, Licenses & PTW*
* **Target Roles:** EHS Safety Officer, Site Manager.
* **Objective:** Manage building society permissions, hot work permits, fire safety clearances, and labor insurance policies.

#### Step-by-Step Walkthrough:
1. Open **Compliance, Licenses & PTW**.
2. Verify checklist:
   - *Apartment Owners Association (AOA) Work Permit:* Valid until project completion.
   - *Hot Work Permit (Welding & Cutting):* Fire extinguisher on standby verified.
   - *Workers Compensation Policy (CAR Policy):* Active.
3. Upload permit copies for instant access during site inspections.

---

## 8. STAGE 6: CUSTOMER BILLING, RA INVOICES & FINANCIAL LEDGER (M19, M20)

### Module M19: Customer Billing & Running Account (RA) Invoices
* **Access Path:** Left Sidebar → Stage 6 • Billing & Finance → *Customer Billing & RA Invoices*
* **Target Roles:** Finance Officer, Project Manager, Client.
* **Objective:** Generate formal GST Running Account (RA) bills against certified milestones with cumulative retention deductions.

#### Step-by-Step Walkthrough:
* **Step 1 - Create Running Account (RA) Bill:**
  1. Open **Customer Billing & RA Invoices**.
  2. Click **+ Generate New RA Bill**.
  3. System assigns bill sequence (e.g., `RA-BILL-01`, `RA-BILL-02`).
* **Step 2 - Compute Bill Value & Retention:**
  1. Select certified milestone or input completed percentage.
  2. System automatically applies statutory deductions:
     - **Gross Progress Claim:** (e.g., ₹ 20,00,000)
     - **Less: 5% Retention Withheld:** (- ₹ 1,00,000)
     - **Less: Pro-rata Mobilization Advance Recovery (if applicable):** (- ₹ 2,00,000)
     - **Taxable Amount:** ₹ 17,00,000
     - **Add: GST @ 18% (9% CGST + 9% SGST):** + ₹ 3,06,000
     - **Net Payable by Client:** ₹ 20,06,000
* **Step 3 - Issue Tax Invoice:**
  1. Click **Authorize & Issue Tax Invoice**.
  2. System generates official GSTR-compliant invoice with QR code and bank settlement instructions.

---

### Module M20: Financial Ledger & Real-Time Cash Flow
* **Access Path:** Left Sidebar → Stage 6 • Billing & Finance → *Financial Ledger & Cash Flow*
* **Target Roles:** Chief Financial Officer, Managing Director, Project Accountant.
* **Objective:** Monitor project-level cash inflows vs cash outflows, committed liabilities, and net realized profitability.

#### Step-by-Step Walkthrough:
1. Open **Financial Ledger & Cash Flow**.
2. Inspect the cash waterfall:
   - **Total Client Collections Received to Date:** (Actual Inflows).
   - **Vendor Material Payments & Subcontractor Payouts:** (Actual Outflows).
   - **Committed Pending Liabilities (Open POs):** (Near-term Outflows).
   - **Net Liquid Project Operating Margin:** (Current Cash Position).
3. Review the **Cash Flow Forecast Curve** to prevent liquidity crunches in subsequent phases.

---

## 9. STAGE 7: PROJECT HANDOVER, WARRANTY & MANDATORY REPORTS (M21, M22, M23, M26)

### Module M21: Project Handover & Key Release
* **Access Path:** Left Sidebar → Stage 7 • Handover & Reports → *Project Handover & Keys*
* **Target Roles:** Lead Architect, Project Manager, Client.
* **Objective:** Formal completion verification, zero-snag certification, keys turnover, and asset manual transmittal.

#### Step-by-Step Walkthrough:
* **Step 1 - Final Handover Checklist:**
  1. Open **Project Handover & Keys**.
  2. Confirm prerequisite conditions:
     - All Snag items resolved (0 open snags).
     - Final cleaning and polishing completed.
     - As-Built Drawings compiled.
     - Final financial reconciliation completed.
* **Step 2 - Digital Sign-off & Key Delivery:**
  1. Client and Project Manager execute digital sign-off.
  2. Generate official **Certificate of Practical Completion (CPC)**.

---

### Module M22: Warranty Registry & Defect Liability (DLP)
* **Access Path:** Left Sidebar → Stage 7 • Handover & Reports → *Warranty Registry & DLP*
* **Target Roles:** Service Manager, Client, Project Manager.
* **Objective:** Track OEM warranties (plywood, hardware, air conditioning, waterproofing) and manage 12-month Defect Liability Period service tickets.

#### Step-by-Step Walkthrough:
1. Open **Warranty Registry & DLP**.
2. View registered warranty assets:
   - Plywood Borer & Termite Warranty: 25 Years (CenturyPly).
   - Hardware Soft-close Mechanisms: 5 Years (Hafele / Blum).
   - Waterproofing Guarantee: 10 Years (Dr. Fixit / Fosroc).
3. Clients can submit one-click DLP service requests for prompt rectification during the 1-year guarantee period.

---

### Module M23: Customer Satisfaction Portal
* **Access Path:** Left Sidebar → Stage 7 • Handover & Reports → *Customer Satisfaction Portal*
* **Target Roles:** Client, Customer Success Manager.
* **Objective:** Provide clients with complete visibility into milestones, photos, warranties, and collect formal Net Promoter Score (NPS) feedback.

#### Step-by-Step Walkthrough:
1. Open **Customer Satisfaction Portal**.
2. Client views project overview, approved GFC drawings, and timeline.
3. Rate project experience on a 1–10 NPS scale with specific feedback on Design, Quality, Timeliness, and Communication.

---

### Module M26: Mandatory Reports Hub (All 22 Project Reports)
* **Access Path:** Left Sidebar → Stage 7 • Handover & Reports → *Mandatory Reports Hub (22 Reports)*
* **Target Roles:** All Stakeholders (Filtered by Role).
* **Objective:** Access the centralized reporting suite containing all 22 required management, executive, and operational reports.

#### The 22 Reports Directory & Usage Guide:
1. **Executive Project Health & Financial Dashboard:** High-level summary of budget, revenue, and gross profit.
2. **EVM Earned Value Management Analysis:** CPI (Cost Performance Index) and SPI (Schedule Performance Index) indicators.
3. **Project Cash Flow & Milestone Realization:** Historical and projected cash inflows/outflows.
4. **WBS Level Cost Variance & Budget Overrun Warning:** Detailed breakdown of deviations across every WBS code.
5. **Customer Billing, RA Invoices & Retention Aging:** Aging matrix of receivables and withheld retentions.
6. **Procurement Pipeline & Vendor Commitment Summary:** Status of open vs closed Purchase Orders.
7. **Site Inventory Balance & Material Reconciliation:** Theoretical vs actual material consumption analysis.
8. **Subcontractor Certified Works & Measurement Book Ledger:** Certified progress vs payouts per trade.
9. **Daily Progress Report (DPR) & Activity Log Summary:** Consolidated daily execution logs.
10. **Comprehensive Snag List & Zero-Defect Handover:** Tracking of defects and rectification turn-around times.
11. **Comprehensive Project Audit Trail & Change Log:** Immutability log of all changes, approvals, and logins.
12. **Material Approval & Physical Sample Tracking Status:** Status of design selections.
13. **Drawing Register & GFC Approval Matrix:** Drawing lifecycle from concept to GFC release.
14. **Variation Order (VO) Register & Scope Impact Log:** All client-directed changes with cost/time impact.
15. **Statutory GST ITC & GSTR-2B Reconciliation:** Tax compliance report matching vendor invoices with GST portal.
16. **Environmental, Health & Safety (EHS) Compliance:** Safe working hours, accidents (zero-target), safety audits.
17. **Employee Timesheet & Labor Productivity:** Billable hours and work efficiency metrics.
18. **Asset & Equipment Deployment Log:** Machine utilization and maintenance records.
19. **Client Satisfaction & NPS Feedback Analytics:** Client ratings and feedback metrics.
20. **Defect Liability Period (DLP) & Warranty Tracker:** Active warranties and post-handover tickets.
21. **Commercial Terms & Contract Compliance Audit:** Compliance with contractual obligations and insurance.
22. **Project Closure & Final Account Settlement:** Final settlement statement closing the project file.

---

## 10. STAGE 8: AGENTIC AI COPILOT, TRANSMITTALS & ADMINISTRATION

### Module: Agentic AI Action Center
* **Access Path:** Left Sidebar → Intelligence & Administration → *Agentic AI Copilot Action Center*
* **Target Roles:** Project Manager, Estimator, Lead Architect, Managing Director.
* **Objective:** Autonomous Copilot scanning the active project to deliver proactive warnings, margin optimizations, and automated actions.

#### Step-by-Step Walkthrough:
1. Open **Agentic AI Copilot Action Center**.
2. Review autonomous recommendations:
   - *Cost Variance Alert:* Detected 12% price hike on imported marble; recommended local supplier alternative.
   - *Schedule Optimization:* Carpentry work is 3 days ahead of schedule; recommendation to advance painting mobilization.
   - *BOQ Audit Check:* Verified all room dimensions from laser scan are accounted for in the takeoff lines.
3. Click **Accept & Apply Recommendation** to automatically execute the action.

---

### Module M25: Documents & Transmittals Cloud Store
* **Access Path:** Left Sidebar → Intelligence & Administration → *Documents & Transmittals Cloud Store*
* **Target Roles:** Document Controller, All Team Members.
* **Objective:** Centralized cloud storage for signed agreements, municipal clearances, structural certificates, and supplier warranties.

#### Step-by-Step Walkthrough:
1. Open **Documents & Transmittals Cloud Store**.
2. Browse categorized folders: `Contracts & Legal`, `GFC Drawings`, `Municipal Permits`, `Invoices & Receipts`, `Handover Dossiers`.
3. Upload new files with automatic revision numbering and metadata tagging.

---

### Module: User Administration & RBAC Security
* **Access Path:** Left Sidebar → Intelligence & Administration → *User Administration & Security*
* **Target Roles:** Administrator Only.
* **Objective:** Provision team accounts, configure secure passwords, assign role responsibilities, and manage project-level access controls.

#### Step-by-Step Walkthrough:
1. Open **User Administration & Security**.
2. Click **+ Add User Account**.
3. Provide Full Name, Work Email, Username, Password, and System Role.
4. Set Assigned Projects (leave blank for global enterprise access or select specific project codes).
5. Click **Save User**. The new team member can now log in immediately.

---

## TRAINING SUMMARY & WORKFLOW CHEATSHEET

| Stage | Module Code | Module Name | Primary Role | Key Milestone Output |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1** | **M01** | CRM & Lead Funnel | BD / Sales Lead | Qualified Lead & Scheduled Site Visit |
| **Stage 1** | **M02** | Customers Directory | Account Manager | Customer Profile & Project Code Generation |
| **Stage 2** | **M03** | Site Survey & Laser Scan | Site Engineer / QS | Bosch Laser Room Dimensions Verified |
| **Stage 2** | **M04** | Architectural Drawings & 3D | Principal Architect | Approved GFC Drawing Set & 3D Views |
| **Stage 2** | **M05** | Material Sample Palette | Interior Designer | Signed-off Physical Material Swatches |
| **Stage 3** | **M06** | Master Schedule of Rates | Senior QS | Standard Unit Rates (Table 27) Maintained |
| **Stage 3** | **M07** | BOQ Estimating Engine | Quantity Surveyor | Job Planning Lines & Baselined BOQ |
| **Stage 3** | **M08** | Cost Budget & Margins | Commercial Manager | Overhead, Contingency & Target Margin % |
| **Stage 3** | **M09** | Cost Traceability Matrix | Cost Controller | 4-Way Match (BOQ → Budget → PO → Actual) |
| **Stage 4** | **M10** | Customer Quotations | Sales Lead / PM | Tiered VE Proposal & Milestone Tranches |
| **Stage 4** | **M11** | Commercial Contracts | Project Director | Executed Contract & 5% Retention Clause |
| **Stage 4** | **M12** | Variation Orders (VO) | Project Manager | Client Signed-off Scope Change & Cost Delta |
| **Stage 5** | **M29** | Project Tasks & Kanban | Site Supervisor | Sprint Tasks & Daily Work Allocation |
| **Stage 5** | **M13** | Master Site Schedule | Planning Engineer | Critical Path Milestones & WBS Gantt |
| **Stage 5** | **M14** | Daily Progress Reports | Site Engineer | Daily Trade Headcount, Progress & Site Photos |
| **Stage 5** | **M15** | Procurement & POs | Purchase Manager | Approved Vendor Purchase Orders within Budget |
| **Stage 5** | **M16** | Material Inward & GRN | Storekeeper | Physical Challan Verified & Stock Updated |
| **Stage 5** | **M17** | Subcontractors & Joint MB | Site QS | Jointly Certified Measurement Book |
| **Stage 5** | **M27** | Employee Timesheets | All Team Members | Billable Hours & Time Logs Recorded |
| **Stage 5** | **M28** | Resource Deployment | Superintendent | Labor & Equipment Mobilization Across Sites |
| **Stage 5** | **M18** | Quality & Snag Audits | QA Auditor | Zero Snag Resolution & Photo Evidence |
| **Stage 5** | **M24** | Compliance & PTW | EHS Safety Officer | Society NOC & Safe Work Permits Active |
| **Stage 6** | **M19** | Customer Billing & RA | Finance Lead | Progressive GST Invoices & Retention Accounting |
| **Stage 6** | **M20** | Financial Ledger & Cash Flow | CFO / Director | Real-Time Cash Waterfall & Realized Profit |
| **Stage 7** | **M21** | Project Handover & Keys | Project Manager | Certificate of Practical Completion & Keys |
| **Stage 7** | **M22** | Warranty & DLP Registry | Service Lead | Active OEM Warranties & DLP Service Log |
| **Stage 7** | **M23** | Customer Satisfaction Portal | Client | Client Review & NPS Feedback Rating |
| **Stage 7** | **M26** | Mandatory Reports Hub | All Stakeholders | 22 Standard Executive, MIS & Ops Reports |
| **System** | **AI** | Agentic AI Copilot | All Users | Proactive Risk Alerts & Margin Optimization |
| **System** | **M25** | Cloud Transmittals | Document Controller | Centralized Drawings, Specs & Legal Store |
| **System** | **USR** | User Admin & Security | System Admin | User Credentials & Project Permissions |

---
*Build Storys ERP • Microsoft Dynamics 365 Business Central Role Center & Modern Job Card Architecture*
*Customer Operations & Comprehensive Training Manual • Version 2.6 Enterprise*
