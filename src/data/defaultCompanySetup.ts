import { CompanyFinanceSetupMaster } from '../types/erp';

export const DEFAULT_COMPANY_FINANCE_SETUP: CompanyFinanceSetupMaster = {
  // 1. Legal Entity & Brand Details
  companyLegalName: 'Build Storys Turnkey Projects Private Limited',
  tradeName: 'Build Storys Architecture & Turnkey EPC',
  cinNumber: 'U45201DL2021PTC389421',
  panNumber: 'AABCB8901M',
  tanNumber: 'DELB12345E',
  udyamRegistrationNumber: 'UDYAM-DL-03-0045892',
  enterpriseClassification: 'MEDIUM',
  registeredAddress: {
    addressLine1: 'Plot No. 42, DLF Prime Tower, 4th Floor',
    addressLine2: 'Okhla Industrial Area Phase III',
    city: 'New Delhi',
    state: 'Delhi',
    stateCode: '07',
    pincode: '110020',
    country: 'India'
  },
  communication: {
    officialEmail: 'corporate@buildstorys.com',
    accountsEmail: 'finance@buildstorys.com',
    phone: '+91 11 4982 3300',
    website: 'https://buildstorys.com'
  },
  authorizedSignatory: {
    name: 'Aarav Singhania',
    designation: 'Managing Director & Partner',
    dinOrPan: 'DIN: 08492019',
    email: 'aarav@buildstorys.com'
  },
  logoUrl: '/favicon.ico',

  // 2. Fiscal Year & Accounting Controls
  fiscalYear: {
    currentYearLabel: 'FY 2026-27',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    postingStatus: 'OPEN',
    allowPostingFrom: '2026-04-01',
    allowPostingTo: '2027-03-31',
    baseCurrency: 'INR',
    currencySymbol: '₹',
    decimalPlaces: 2,
    revenueRecognitionMethod: 'POCM_IND_AS_115',
    costAccountingMethod: 'JOB_ORDER_COSTING'
  },

  // 3. Taxation & Statutory Rates Master
  taxation: {
    primaryGstin: '07AABCB8901M1Z4',
    gstScheme: 'REGULAR',
    stateRegistrations: [
      {
        stateCode: '07',
        stateName: 'Delhi (HQ & North Projects)',
        gstin: '07AABCB8901M1Z4',
        address: 'Plot 42, Okhla Phase III, New Delhi 110020',
        isPrimary: true
      },
      {
        stateCode: '27',
        stateName: 'Maharashtra (Western Hub & Luxury Villas)',
        gstin: '27AABCB8901M1Z1',
        address: 'Floor 8, Peninsula Corporate Park, Lower Parel, Mumbai 400013',
        isPrimary: false
      },
      {
        stateCode: '29',
        stateName: 'Karnataka (Southern Techspaces & Residences)',
        gstin: '29AABCB8901M1Z8',
        address: '14/3, Prestige Tech Cloud, Hebbal, Bengaluru 560024',
        isPrimary: false
      }
    ],
    defaultWorksContractGstPercent: 18.0,
    architecturalServiceSac: '998321', // Architectural Advisory, Layout & Master Planning
    interiorDecorationSac: '995476', // Interior decoration & fitout completion services
    turnkeyBuildingSac: '995411', // General turnkey construction of civil & structural buildings
    subcontractorTdsRatePercent: 2.0, // Section 194C (2% for corporate subcontractor entities)
    professionalConsultantTdsRatePercent: 10.0, // Section 194J (10% for professional architectural fees)
    machineryRentTdsRatePercent: 2.0, // Section 194I (2% for plant, machinery & equipment hire)
    bocwLabourCessPercent: 1.0, // Building and Other Construction Workers Welfare Cess Act
    eInvoicingEnabled: true,
    eWayBillThreshold: 50000,
    reverseChargeApplicable: false
  },

  // 4. Banking & Treasury Setup
  banking: {
    accounts: [
      {
        id: 'BANK-01',
        bankName: 'ICICI Bank Limited',
        branch: 'Nehru Place Corporate Banking Branch, New Delhi',
        accountType: 'CURRENT',
        accountNumber: '000705018942',
        ifscCode: 'ICIC0000007',
        swiftCode: 'ICICINBBCTS',
        upiVpa: 'buildstorys.turnkey@icici',
        isDefaultDisbursement: true,
        isDefaultReceipt: true,
        glAccountCode: '100110',
        balanceLimit: 10000000
      },
      {
        id: 'BANK-02',
        bankName: 'HDFC Bank Limited',
        branch: 'Okhla Phase III Special Escrow Branch',
        accountType: 'ESCROW',
        accountNumber: '50200088912345',
        ifscCode: 'HDFC0000043',
        swiftCode: 'HDFCINBBXXX',
        upiVpa: 'buildstorys.escrow@hdfcbank',
        isDefaultDisbursement: false,
        isDefaultReceipt: false,
        glAccountCode: '100120',
        balanceLimit: 50000000
      },
      {
        id: 'BANK-03',
        bankName: 'State Bank of India',
        branch: 'CAG Corporate Accounts Group Branch, New Delhi',
        accountType: 'STATUTORY_RESERVE',
        accountNumber: '39480112948',
        ifscCode: 'SBIN0004261',
        swiftCode: 'SBININBB426',
        isDefaultDisbursement: false,
        isDefaultReceipt: false,
        glAccountCode: '100130'
      }
    ],
    defaultCreditPeriodDays: 30,
    clientRetentionPercent: 5.0,
    subcontractorRetentionPercent: 5.0,
    mobilizationAdvanceStandardPercent: 10.0,
    interestOnDelayedPaymentPercent: 18.0
  },

  // 5. Document Numbering Series Controls
  numberSeries: [
    {
      id: 'SERIES-QT',
      documentType: 'QUOTATION',
      name: 'Client Estimation & Quotation',
      prefix: 'BS-QT/26-27/',
      startingNumber: 1001,
      lastUsedNumber: 1042,
      numberPadding: 4,
      previewExample: 'BS-QT/26-27/1043'
    },
    {
      id: 'SERIES-INV',
      documentType: 'SALES_INVOICE',
      name: 'GST Tax Invoice & Running Account (RA) Bill',
      prefix: 'BS-INV/26-27/',
      startingNumber: 2001,
      lastUsedNumber: 2018,
      numberPadding: 4,
      previewExample: 'BS-INV/26-27/2019'
    },
    {
      id: 'SERIES-PO',
      documentType: 'PURCHASE_ORDER',
      name: 'Material Procurement Purchase Order (PO)',
      prefix: 'BS-PO/26-27/',
      startingNumber: 3001,
      lastUsedNumber: 3056,
      numberPadding: 4,
      previewExample: 'BS-PO/26-27/3057'
    },
    {
      id: 'SERIES-WO',
      documentType: 'WORK_ORDER',
      name: 'Subcontractor Trade Work Order (WO)',
      prefix: 'BS-WO/26-27/',
      startingNumber: 4001,
      lastUsedNumber: 4029,
      numberPadding: 4,
      previewExample: 'BS-WO/26-27/4030'
    },
    {
      id: 'SERIES-MRN',
      documentType: 'MATERIAL_RECEIPT',
      name: 'Site Material Receipt Note (MRN)',
      prefix: 'BS-MRN/26-27/',
      startingNumber: 5001,
      lastUsedNumber: 5084,
      numberPadding: 4,
      previewExample: 'BS-MRN/26-27/5085'
    },
    {
      id: 'SERIES-RCT',
      documentType: 'PAYMENT_RECEIPT',
      name: 'Client Payment Receipt Voucher',
      prefix: 'BS-RCT/26-27/',
      startingNumber: 6001,
      lastUsedNumber: 6031,
      numberPadding: 4,
      previewExample: 'BS-RCT/26-27/6032'
    },
    {
      id: 'SERIES-CN',
      documentType: 'CREDIT_NOTE',
      name: 'GST Credit Note (Rate Revision / De-scope)',
      prefix: 'BS-CN/26-27/',
      startingNumber: 7001,
      lastUsedNumber: 7004,
      numberPadding: 4,
      previewExample: 'BS-CN/26-27/7005'
    },
    {
      id: 'SERIES-DN',
      documentType: 'DEBIT_NOTE',
      name: 'Vendor Debit Note (Material Rejection / Penalty)',
      prefix: 'BS-DN/26-27/',
      startingNumber: 8001,
      lastUsedNumber: 8007,
      numberPadding: 4,
      previewExample: 'BS-DN/26-27/8008'
    }
  ],

  // 6. Chart of Accounts & GL Mapping
  glMappings: [
    {
      accountCode: '300100',
      accountName: 'Turnkey Contract Execution Revenue (Works Contract)',
      category: 'REVENUE',
      nature: 'CREDIT',
      roleInWorkflow: 'Credit on Sales Tax Invoices & Milestones (SAC 995411)',
      isStatutory: true
    },
    {
      accountCode: '300200',
      accountName: 'Architectural & Space Planning Fees',
      category: 'REVENUE',
      nature: 'CREDIT',
      roleInWorkflow: 'Credit on Architectural Design Retainers (SAC 998321)',
      isStatutory: true
    },
    {
      accountCode: '400100',
      accountName: 'Direct Raw Materials & Interior Finishes Consumed',
      category: 'EXPENSE',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Material Receipt Notes & PO Invoices',
      isStatutory: false
    },
    {
      accountCode: '400200',
      accountName: 'Direct Site Construction & Carpentry Labour Wages',
      category: 'EXPENSE',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Muster Roll & Site Labour Timesheet Certification',
      isStatutory: false
    },
    {
      accountCode: '400300',
      accountName: 'Subcontractor Trade Package Charges',
      category: 'EXPENSE',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Subcontractor RA Bills (Electrical, HVAC, Plumbing)',
      isStatutory: true
    },
    {
      accountCode: '400400',
      accountName: 'Plant, Scaffolding & Heavy Equipment Rental',
      category: 'EXPENSE',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Machinery Hire Vouchers (TDS 194I applicable)',
      isStatutory: true
    },
    {
      accountCode: '400500',
      accountName: 'Site Preliminaries, Testing & Temporary Utilities',
      category: 'EXPENSE',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Site Electricity, Water, Cube Testing & Security',
      isStatutory: false
    },
    {
      accountCode: '200110',
      accountName: 'Output GST - CGST (9.0% Central Tax)',
      category: 'LIABILITY',
      nature: 'CREDIT',
      roleInWorkflow: 'Credit on Intra-State Client Invoices',
      isStatutory: true
    },
    {
      accountCode: '200120',
      accountName: 'Output GST - SGST (9.0% State Tax)',
      category: 'LIABILITY',
      nature: 'CREDIT',
      roleInWorkflow: 'Credit on Intra-State Client Invoices',
      isStatutory: true
    },
    {
      accountCode: '200130',
      accountName: 'Output GST - IGST (18.0% Integrated Tax)',
      category: 'LIABILITY',
      nature: 'CREDIT',
      roleInWorkflow: 'Credit on Inter-State Client Invoices',
      isStatutory: true
    },
    {
      accountCode: '100210',
      accountName: 'Input Tax Credit (ITC) - CGST Paid',
      category: 'ASSET',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Eligible Material Procurement & Subcontractor POs',
      isStatutory: true
    },
    {
      accountCode: '100220',
      accountName: 'Input Tax Credit (ITC) - SGST Paid',
      category: 'ASSET',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Eligible Material Procurement & Subcontractor POs',
      isStatutory: true
    },
    {
      accountCode: '100230',
      accountName: 'Input Tax Credit (ITC) - IGST Paid',
      category: 'ASSET',
      nature: 'DEBIT',
      roleInWorkflow: 'Debit on Interstate Cement, Steel & Glazing Purchases',
      isStatutory: true
    },
    {
      accountCode: '200200',
      accountName: 'Statutory TDS Payable (Section 194C / 194J / 194I)',
      category: 'LIABILITY',
      nature: 'CREDIT',
      roleInWorkflow: 'Withholding on Subcontractor Bills & Consultants',
      isStatutory: true
    },
    {
      accountCode: '100300',
      accountName: 'Client Retention Money Receivable (DLP Hold)',
      category: 'ASSET',
      nature: 'DEBIT',
      roleInWorkflow: '5% Contract amount withheld by client during Defect Liability Period',
      isStatutory: false
    },
    {
      accountCode: '200300',
      accountName: 'Retention Money Withheld from Trade Subcontractors',
      category: 'LIABILITY',
      nature: 'CREDIT',
      roleInWorkflow: '5% Withheld from Subcontractor bills until warranty release',
      isStatutory: false
    },
    {
      accountCode: '200400',
      accountName: 'Mobilization Advance Received from Clients',
      category: 'LIABILITY',
      nature: 'CREDIT',
      roleInWorkflow: 'Initial contract deposit before milestone recovery',
      isStatutory: true
    }
  ],

  // 7. Audit & Financial Governance Guardrails
  governance: {
    dualApprovalThresholdAmount: 100000,
    budgetOverrunTolerancePercent: 3.0,
    autoLockBudgetAfterClientApproval: true,
    requirePOForEveryDirectVendorInvoice: true,
    requireMeasurementBookEntryForSubcontractorBilling: true,
    strictCostCenterAllocation: true,
    enableMakerCheckerForDisbursements: true
  },

  updatedAt: '2026-09-13T09:45:00Z',
  updatedBy: 'Aarav Singhania (Managing Director)'
};
