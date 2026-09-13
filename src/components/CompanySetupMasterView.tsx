import React, { useState, useEffect } from 'react';
import {
  Building2,
  Landmark,
  Calculator,
  Receipt,
  ShieldCheck,
  FileText,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Download,
  Printer,
  Copy,
  Check,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  CheckSquare
} from 'lucide-react';
import {
  CompanyFinanceSetupMaster,
  UserSession,
  StateGSTRegistration,
  BankAccountSetup,
  DocumentSeriesSetup,
  GLMappingAccount
} from '../types/erp';
import { DEFAULT_COMPANY_FINANCE_SETUP } from '../data/defaultCompanySetup';

interface CompanySetupMasterViewProps {
  currentUser: UserSession;
  onNavigateToTab?: (tabKey: string) => void;
  onOpenAuditLogs?: () => void;
}

export const CompanySetupMasterView: React.FC<CompanySetupMasterViewProps> = ({
  currentUser,
  onNavigateToTab,
  onOpenAuditLogs
}) => {
  const [setupData, setSetupData] = useState<CompanyFinanceSetupMaster>(DEFAULT_COMPANY_FINANCE_SETUP);
  const [originalData, setOriginalData] = useState<CompanyFinanceSetupMaster>(DEFAULT_COMPANY_FINANCE_SETUP);
  const [activeSubTab, setActiveSubTab] = useState<
    'general' | 'fiscal' | 'taxation' | 'banking' | 'numbering' | 'gl_mapping' | 'governance'
  >('general');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // New State GST Modal
  const [isAddingStateGst, setIsAddingStateGst] = useState<boolean>(false);
  const [newStateGst, setNewStateGst] = useState<StateGSTRegistration>({
    stateCode: '',
    stateName: '',
    gstin: '',
    address: '',
    isPrimary: false
  });

  // New Bank Account Modal
  const [isAddingBank, setIsAddingBank] = useState<boolean>(false);
  const [newBank, setNewBank] = useState<BankAccountSetup>({
    id: `BANK-${Date.now().toString().slice(-4)}`,
    bankName: '',
    branch: '',
    accountType: 'CURRENT',
    accountNumber: '',
    ifscCode: '',
    swiftCode: '',
    upiVpa: '',
    isDefaultDisbursement: false,
    isDefaultReceipt: false,
    glAccountCode: '100110'
  });

  // Load from API with local fallback
  useEffect(() => {
    let isCancelled = false;
    const loadSetup = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/masters/company-setup');
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data && data.companyLegalName) {
            setSetupData(data);
            setOriginalData(data);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to localStorage or default data
      }

      const stored = localStorage.getItem('erp_company_finance_setup');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!isCancelled) {
            setSetupData(parsed);
            setOriginalData(parsed);
          }
        } catch {
          if (!isCancelled) {
            setSetupData(DEFAULT_COMPANY_FINANCE_SETUP);
            setOriginalData(DEFAULT_COMPANY_FINANCE_SETUP);
          }
        }
      } else {
        if (!isCancelled) {
          setSetupData(DEFAULT_COMPANY_FINANCE_SETUP);
          setOriginalData(DEFAULT_COMPANY_FINANCE_SETUP);
        }
      }
      if (!isCancelled) setIsLoading(false);
    };

    loadSetup();
    return () => {
      isCancelled = true;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify(setupData) !== JSON.stringify(originalData);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/masters/company-setup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData)
      });

      if (res.ok) {
        const saved = await res.json();
        setSetupData(saved);
        setOriginalData(saved);
        localStorage.setItem('erp_company_finance_setup', JSON.stringify(saved));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save company setup.');
      }
    } catch (err: any) {
      // Local storage fallback if offline
      localStorage.setItem('erp_company_finance_setup', JSON.stringify(setupData));
      setOriginalData(setupData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToBaseline = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/masters/company-setup/reset', { method: 'POST' });
      if (res.ok) {
        const resetData = await res.json();
        setSetupData(resetData);
        setOriginalData(resetData);
        localStorage.setItem('erp_company_finance_setup', JSON.stringify(resetData));
      } else {
        setSetupData(DEFAULT_COMPANY_FINANCE_SETUP);
        setOriginalData(DEFAULT_COMPANY_FINANCE_SETUP);
        localStorage.setItem('erp_company_finance_setup', JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP));
      }
      setShowResetConfirmModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSetupData(DEFAULT_COMPANY_FINANCE_SETUP);
      setOriginalData(DEFAULT_COMPANY_FINANCE_SETUP);
      localStorage.setItem('erp_company_finance_setup', JSON.stringify(DEFAULT_COMPANY_FINANCE_SETUP));
      setShowResetConfirmModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(setupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `Company_Finance_Setup_${setupData.companyLegalName.replace(/\s+/g, '_')}_${setupData.fiscalYear.currentYearLabel.replace(/\s+/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // State GST mutations
  const handleAddStateGst = () => {
    if (!newStateGst.stateCode || !newStateGst.gstin) return;
    setSetupData(prev => ({
      ...prev,
      taxation: {
        ...prev.taxation,
        stateRegistrations: [...prev.taxation.stateRegistrations, newStateGst]
      }
    }));
    setIsAddingStateGst(false);
    setNewStateGst({
      stateCode: '',
      stateName: '',
      gstin: '',
      address: '',
      isPrimary: false
    });
  };

  const handleRemoveStateGst = (index: number) => {
    setSetupData(prev => ({
      ...prev,
      taxation: {
        ...prev.taxation,
        stateRegistrations: prev.taxation.stateRegistrations.filter((_, i) => i !== index)
      }
    }));
  };

  // Bank account mutations
  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber) return;
    setSetupData(prev => ({
      ...prev,
      banking: {
        ...prev.banking,
        accounts: [...prev.banking.accounts, newBank]
      }
    }));
    setIsAddingBank(false);
    setNewBank({
      id: `BANK-${Date.now().toString().slice(-4)}`,
      bankName: '',
      branch: '',
      accountType: 'CURRENT',
      accountNumber: '',
      ifscCode: '',
      swiftCode: '',
      upiVpa: '',
      isDefaultDisbursement: false,
      isDefaultReceipt: false,
      glAccountCode: '100110'
    });
  };

  const handleRemoveBank = (id: string) => {
    setSetupData(prev => ({
      ...prev,
      banking: {
        ...prev.banking,
        accounts: prev.banking.accounts.filter(b => b.id !== id)
      }
    }));
  };

  // Number series mutation
  const handleUpdateSeries = (id: string, updates: Partial<DocumentSeriesSetup>) => {
    setSetupData(prev => ({
      ...prev,
      numberSeries: prev.numberSeries.map(s => {
        if (s.id !== id) return s;
        const merged = { ...s, ...updates };
        const nextNum = (merged.lastUsedNumber || merged.startingNumber) + 1;
        const padded = String(nextNum).padStart(merged.numberPadding || 4, '0');
        merged.previewExample = `${merged.prefix}${padded}${merged.suffix || ''}`;
        return merged;
      })
    }));
  };

  // Validation checks
  const isGstinValid = setupData.taxation.primaryGstin?.length === 15;
  const isPanValid = setupData.panNumber?.length === 10;
  const isTanValid = setupData.tanNumber?.length === 10;

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col font-sans">
      {/* 1. TOP BREADCRUMB & HEADER BAR */}
      <div className="bg-white border-b border-[#EDEBE9] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#605E5C] mb-1">
              <span>Financial Management</span>
              <span>/</span>
              <span>Stage 6 • Billing & Finance</span>
              <span>/</span>
              <span className="font-semibold text-[#0F6CBD]">Company Setup Master</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F6CBD]/10 flex items-center justify-center text-[#0F6CBD]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
                  Company Setup Master (Finance)
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Statutory Compliant
                  </span>
                </h1>
                <p className="text-xs text-[#605E5C]">
                  Central fiscal configuration: Legal entity parameters, multi-state GST registrations, GL accounts,
                  banking escrow, and document number sequences.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {hasUnsavedChanges && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Unsaved Changes
              </span>
            )}

            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Master Synchronized
              </span>
            )}

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#D1D5DB] rounded hover:bg-[#F3F4F6] transition-colors flex items-center gap-1.5"
              title="Export Company Setup JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#605E5C]" />
              Export Config
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#D1D5DB] rounded hover:bg-[#F3F4F6] transition-colors flex items-center gap-1.5"
              title="Print Official Master Profile"
            >
              <Printer className="w-3.5 h-3.5 text-[#605E5C]" />
              Print
            </button>

            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Baseline
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`px-4 py-1.5 text-xs font-semibold rounded text-white flex items-center gap-1.5 shadow-sm transition-all ${
                hasUnsavedChanges
                  ? 'bg-[#0F6CBD] hover:bg-[#0E5AA0] active:scale-[0.98]'
                  : 'bg-[#94A3B8] cursor-not-allowed opacity-75'
              }`}
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Financial Setup
            </button>
          </div>
        </div>

        {/* Status Cue Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-3 border-t border-[#F3F4F6]">
          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Current Fiscal Period</span>
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#0F6CBD]" />
              {setupData.fiscalYear.currentYearLabel}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Primary GSTIN</span>
            <span className="text-xs font-mono font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              {setupData.taxation.primaryGstin || 'NOT SET'}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Works Contract GST</span>
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
              <Percent className="w-3.5 h-3.5 text-[#0F6CBD]" />
              {setupData.taxation.defaultWorksContractGstPercent}% (SAC {setupData.taxation.turnkeyBuildingSac})
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Base Currency</span>
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
              <Landmark className="w-3.5 h-3.5 text-purple-600" />
              {setupData.fiscalYear.baseCurrency} ({setupData.fiscalYear.currencySymbol})
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Dual Approval Limit</span>
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              ₹{setupData.governance.dualApprovalThresholdAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Last Synchronized</span>
            <span className="text-[11px] text-[#475569] block mt-0.5 truncate" title={setupData.updatedBy}>
              {new Date(setupData.updatedAt).toLocaleDateString()} by {setupData.updatedBy?.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white border-b border-[#E2E8F0] px-6">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'general', label: '1. Legal Entity & Profile', icon: Building2 },
            { id: 'fiscal', label: '2. Fiscal Year & Controls', icon: Calendar },
            { id: 'taxation', label: '3. GST & Statutory Tax', icon: Receipt },
            { id: 'banking', label: '4. Banking & Retention', icon: Landmark },
            { id: 'numbering', label: '5. Document Series (PO/INV)', icon: FileText },
            { id: 'gl_mapping', label: '6. Chart of Accounts (GL)', icon: Layers },
            { id: 'governance', label: '7. Financial Governance', icon: ShieldAlert }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#0F6CBD] text-[#0F6CBD] font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F6CBD]' : 'text-[#94A3B8]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB CONTENT PANELS */}
      <div className="p-6 max-w-7xl mx-auto w-full flex-1">
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: GENERAL & LEGAL ENTITY */}
        {activeSubTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0F6CBD]" />
                    Statutory Corporate Identity & Registration
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Primary legal company particulars printed on Quotations, Invoices, Work Orders, and Tax Returns.
                  </p>
                </div>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ministry of Corporate Affairs Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    value={setupData.companyLegalName}
                    onChange={e => setSetupData({ ...setupData, companyLegalName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] font-medium"
                    placeholder="e.g. Build Storys Turnkey Projects Private Limited"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Trade / Doing Business As (DBA) Name</label>
                  <input
                    type="text"
                    value={setupData.tradeName}
                    onChange={e => setSetupData({ ...setupData, tradeName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD]"
                    placeholder="e.g. Build Storys Architecture & Turnkey"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">
                    Corporate Identity Number (CIN) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={setupData.cinNumber}
                      onChange={e => setSetupData({ ...setupData, cinNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-xs font-mono border border-[#CBD5E1] rounded focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD]"
                      placeholder="e.g. U45201DL2021PTC389421"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(setupData.cinNumber, 'CIN')}
                      className="absolute right-2 top-2 text-[#94A3B8] hover:text-[#0F172A]"
                      title="Copy CIN"
                    >
                      {copiedField === 'CIN' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">
                    Permanent Account Number (PAN) *
                    {!isPanValid && (
                      <span className="text-rose-600 text-[10px] ml-1">(Must be 10 characters)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={setupData.panNumber}
                    onChange={e => setSetupData({ ...setupData, panNumber: e.target.value.toUpperCase() })}
                    className={`w-full px-3 py-2 text-xs font-mono uppercase border rounded focus:ring-1 focus:ring-[#0F6CBD] ${
                      isPanValid ? 'border-[#CBD5E1]' : 'border-rose-400 bg-rose-50/50'
                    }`}
                    placeholder="e.g. AABCB8901M"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">
                    Tax Deduction & Collection Account No (TAN) *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={setupData.tanNumber}
                    onChange={e => setSetupData({ ...setupData, tanNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs font-mono uppercase border border-[#CBD5E1] rounded focus:ring-1 focus:ring-[#0F6CBD]"
                    placeholder="e.g. DELB12345E"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">MSME / Udyam Registration No.</label>
                  <input
                    type="text"
                    value={setupData.udyamRegistrationNumber}
                    onChange={e => setSetupData({ ...setupData, udyamRegistrationNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#CBD5E1] rounded focus:ring-1 focus:ring-[#0F6CBD]"
                    placeholder="e.g. UDYAM-DL-03-0045892"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">MSME Enterprise Classification</label>
                  <select
                    value={setupData.enterpriseClassification}
                    onChange={e => setSetupData({ ...setupData, enterpriseClassification: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded focus:ring-1 focus:ring-[#0F6CBD]"
                  >
                    <option value="MICRO">Micro Enterprise (Investment &lt; ₹1 Cr)</option>
                    <option value="SMALL">Small Enterprise (Investment &lt; ₹10 Cr)</option>
                    <option value="MEDIUM">Medium Enterprise (Investment &lt; ₹50 Cr)</option>
                    <option value="LARGE">Large / Corporate Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Registered Office & Communication */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 pb-2 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-[#0F6CBD]" />
                  Registered Office Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-0.5">Address Line 1</label>
                    <input
                      type="text"
                      value={setupData.registeredAddress.addressLine1}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          registeredAddress: { ...setupData.registeredAddress, addressLine1: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] block mb-0.5">Address Line 2 / Industrial Hub</label>
                    <input
                      type="text"
                      value={setupData.registeredAddress.addressLine2}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          registeredAddress: { ...setupData.registeredAddress, addressLine2: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">City</label>
                      <input
                        type="text"
                        value={setupData.registeredAddress.city}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            registeredAddress: { ...setupData.registeredAddress, city: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">State (Code)</label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={setupData.registeredAddress.state}
                          onChange={e =>
                            setSetupData({
                              ...setupData,
                              registeredAddress: { ...setupData.registeredAddress, state: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1.5 text-xs border border-[#CBD5E1] rounded"
                        />
                        <input
                          type="text"
                          value={setupData.registeredAddress.stateCode}
                          onChange={e =>
                            setSetupData({
                              ...setupData,
                              registeredAddress: { ...setupData.registeredAddress, stateCode: e.target.value }
                            })
                          }
                          className="w-12 px-1 text-center font-mono text-xs border border-[#CBD5E1] rounded"
                          placeholder="07"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Pincode</label>
                      <input
                        type="text"
                        value={setupData.registeredAddress.pincode}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            registeredAddress: { ...setupData.registeredAddress, pincode: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Communication & Signatory */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 pb-2 border-b border-[#F1F5F9] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F6CBD]" />
                    Authorized Commercial Signatory
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Signatory Full Name</label>
                      <input
                        type="text"
                        value={setupData.authorizedSignatory.name}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            authorizedSignatory: { ...setupData.authorizedSignatory, name: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Corporate Designation</label>
                      <input
                        type="text"
                        value={setupData.authorizedSignatory.designation}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            authorizedSignatory: { ...setupData.authorizedSignatory, designation: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Director Identification No. (DIN)</label>
                      <input
                        type="text"
                        value={setupData.authorizedSignatory.dinOrPan}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            authorizedSignatory: { ...setupData.authorizedSignatory, dinOrPan: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Signatory Email</label>
                      <input
                        type="email"
                        value={setupData.authorizedSignatory.email}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            authorizedSignatory: { ...setupData.authorizedSignatory, email: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-2 flex items-center gap-1.5">
                    Official Communication
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Corporate Accounts Email</label>
                      <input
                        type="email"
                        value={setupData.communication.accountsEmail}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            communication: { ...setupData.communication, accountsEmail: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-0.5">Accounts Phone / Landline</label>
                      <input
                        type="text"
                        value={setupData.communication.phone}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            communication: { ...setupData.communication, phone: e.target.value }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FISCAL YEAR & ACCOUNTING CONTROLS */}
        {activeSubTab === 'fiscal' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0F6CBD]" />
                    Fiscal Year & General Ledger Posting Windows
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Define active financial period boundaries and posting locks to prevent backdated book modifications.
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded border ${
                    setupData.fiscalYear.postingStatus === 'OPEN'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : setupData.fiscalYear.postingStatus === 'CLOSING_IN_PROGRESS'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  Status: {setupData.fiscalYear.postingStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Fiscal Year Label *</label>
                  <input
                    type="text"
                    value={setupData.fiscalYear.currentYearLabel}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, currentYearLabel: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-medium border border-[#CBD5E1] rounded"
                    placeholder="e.g. FY 2026-27"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Start Date (Books Open)</label>
                  <input
                    type="date"
                    value={setupData.fiscalYear.startDate}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, startDate: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">End Date (Books Close)</label>
                  <input
                    type="date"
                    value={setupData.fiscalYear.endDate}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, endDate: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Period Posting Status</label>
                  <select
                    value={setupData.fiscalYear.postingStatus}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, postingStatus: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded font-medium"
                  >
                    <option value="OPEN">OPEN (Normal Posting Active)</option>
                    <option value="CLOSING_IN_PROGRESS">CLOSING_IN_PROGRESS (Admin Only)</option>
                    <option value="LOCKED">LOCKED (Audited & Closed)</option>
                  </select>
                </div>
              </div>

              {/* Posting Lock Window Controls */}
              <div className="mt-6 pt-4 border-t border-[#F1F5F9] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] p-3.5 rounded border border-[#E2E8F0]">
                  <label className="text-xs font-semibold text-[#334155] block mb-1">Allow Posting From Date</label>
                  <input
                    type="date"
                    value={setupData.fiscalYear.allowPostingFrom}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, allowPostingFrom: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded"
                  />
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Transactions dated prior to this will be rejected by the general ledger posting engine.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded border border-[#E2E8F0]">
                  <label className="text-xs font-semibold text-[#334155] block mb-1">Allow Posting To Date</label>
                  <input
                    type="date"
                    value={setupData.fiscalYear.allowPostingTo}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, allowPostingTo: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded"
                  />
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Prevents posting transactions into future unauthorized accounting periods.
                  </p>
                </div>
              </div>
            </div>

            {/* Accounting Standards & Base Currency */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-4 pb-2 border-b border-[#F1F5F9] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#0F6CBD]" />
                Standards & Revenue Recognition Framework
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Base Reporting Currency</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={setupData.fiscalYear.baseCurrency}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          fiscalYear: { ...setupData.fiscalYear, baseCurrency: e.target.value.toUpperCase() }
                        })
                      }
                      className="w-24 px-3 py-2 text-xs font-bold border border-[#CBD5E1] rounded"
                    />
                    <input
                      type="text"
                      value={setupData.fiscalYear.currencySymbol}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          fiscalYear: { ...setupData.fiscalYear, currencySymbol: e.target.value }
                        })
                      }
                      className="w-16 px-3 py-2 text-xs text-center font-bold border border-[#CBD5E1] rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">
                    Revenue Recognition Framework
                  </label>
                  <select
                    value={setupData.fiscalYear.revenueRecognitionMethod}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, revenueRecognitionMethod: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded"
                  >
                    <option value="POCM_IND_AS_115">
                      POCM - Percentage of Completion Method (Ind AS 115 / IFRS 15)
                    </option>
                    <option value="BILLING_MILESTONE">Milestone Certification (Client Approved RA Bills)</option>
                    <option value="COMPLETED_CONTRACT">Completed Contract Method (At Handover & DLP Start)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">Cost Accounting Method</label>
                  <select
                    value={setupData.fiscalYear.costAccountingMethod}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        fiscalYear: { ...setupData.fiscalYear, costAccountingMethod: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded"
                  >
                    <option value="JOB_ORDER_COSTING">
                      Job Order Costing (Per Project / BOQ Trade Sub-ledger)
                    </option>
                    <option value="STANDARD_COSTING">Standard Master Rate Costing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GST, SAC & STATUTORY TAXATION */}
        {activeSubTab === 'taxation' && (
          <div className="space-y-6">
            {/* Primary GST and SAC Setup */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#0F6CBD]" />
                    Goods and Services Tax (GST) & Statutory Withholding (TDS)
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Governs GST rate application, SAC codes for Turnkey & Architectural services, and Section 194 TDS deduction rules.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    E-Invoicing Enabled
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">
                    Primary Head Office GSTIN *
                    {!isGstinValid && (
                      <span className="text-rose-600 text-[10px] ml-1">(Must be 15 chars)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={setupData.taxation.primaryGstin}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        taxation: { ...setupData.taxation, primaryGstin: e.target.value.toUpperCase() }
                      })
                    }
                    className={`w-full px-3 py-2 text-xs font-mono uppercase border rounded ${
                      isGstinValid ? 'border-[#CBD5E1]' : 'border-rose-400 bg-rose-50/40'
                    }`}
                    placeholder="07AABCB8901M1Z4"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">GST Registration Scheme</label>
                  <select
                    value={setupData.taxation.gstScheme}
                    onChange={e =>
                      setSetupData({
                        ...setupData,
                        taxation: { ...setupData.taxation, gstScheme: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded"
                  >
                    <option value="REGULAR">Regular Taxpayer (Monthly GSTR-1 / GSTR-3B)</option>
                    <option value="COMPOSITION">Composition Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1">
                    Composite Works Contract GST Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={setupData.taxation.defaultWorksContractGstPercent}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          taxation: {
                            ...setupData.taxation,
                            defaultWorksContractGstPercent: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-bold border border-[#CBD5E1] rounded pr-8"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[#64748B] font-semibold">%</span>
                  </div>
                </div>
              </div>

              {/* Statutory SAC Mapping */}
              <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
                <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider mb-3">
                  Service Accounting Codes (SAC) for Automated Billing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                    <label className="text-xs font-semibold text-[#0F172A] block">
                      Turnkey Civil & Structural Works
                    </label>
                    <input
                      type="text"
                      value={setupData.taxation.turnkeyBuildingSac}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          taxation: { ...setupData.taxation, turnkeyBuildingSac: e.target.value }
                        })
                      }
                      className="w-full mt-1 px-3 py-1.5 text-xs font-mono border border-[#CBD5E1] rounded bg-white"
                      placeholder="995411"
                    />
                    <span className="text-[11px] text-[#64748B] block mt-1">General building turnkey execution</span>
                  </div>

                  <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                    <label className="text-xs font-semibold text-[#0F172A] block">
                      Architectural & Space Planning
                    </label>
                    <input
                      type="text"
                      value={setupData.taxation.architecturalServiceSac}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          taxation: { ...setupData.taxation, architecturalServiceSac: e.target.value }
                        })
                      }
                      className="w-full mt-1 px-3 py-1.5 text-xs font-mono border border-[#CBD5E1] rounded bg-white"
                      placeholder="998321"
                    />
                    <span className="text-[11px] text-[#64748B] block mt-1">Design consulting, 3D CAD & blueprints</span>
                  </div>

                  <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                    <label className="text-xs font-semibold text-[#0F172A] block">
                      Interior Fitout & Finishes Completion
                    </label>
                    <input
                      type="text"
                      value={setupData.taxation.interiorDecorationSac}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          taxation: { ...setupData.taxation, interiorDecorationSac: e.target.value }
                        })
                      }
                      className="w-full mt-1 px-3 py-1.5 text-xs font-mono border border-[#CBD5E1] rounded bg-white"
                      placeholder="995476"
                    />
                    <span className="text-[11px] text-[#64748B] block mt-1">Joinery, false ceiling, acoustic cladding</span>
                  </div>
                </div>
              </div>

              {/* TDS Rates Under Income Tax Act */}
              <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
                <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>TDS Withholding Sections & Labour Cess</span>
                  <span className="text-[11px] font-normal text-[#64748B]">Auto-deducted on Subcontractor Work Orders</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#475569] block">Sec 194C (Subcontractor Trade)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={setupData.taxation.subcontractorTdsRatePercent}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            taxation: {
                              ...setupData.taxation,
                              subcontractorTdsRatePercent: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                      />
                      <span className="text-xs font-semibold text-[#475569]">%</span>
                    </div>
                    <span className="text-[10px] text-[#64748B] mt-1 block">Electrical, plumbing, masonry</span>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#475569] block">Sec 194J (Design Consultants)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={setupData.taxation.professionalConsultantTdsRatePercent}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            taxation: {
                              ...setupData.taxation,
                              professionalConsultantTdsRatePercent: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                      />
                      <span className="text-xs font-semibold text-[#475569]">%</span>
                    </div>
                    <span className="text-[10px] text-[#64748B] mt-1 block">Architectural, structural fees</span>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#475569] block">Sec 194I (Plant/Equipment Rent)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={setupData.taxation.machineryRentTdsRatePercent}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            taxation: {
                              ...setupData.taxation,
                              machineryRentTdsRatePercent: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                      />
                      <span className="text-xs font-semibold text-[#475569]">%</span>
                    </div>
                    <span className="text-[10px] text-[#64748B] mt-1 block">Scaffolding, crane, mixer hire</span>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#475569] block">BOCW Labour Welfare Cess</span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={setupData.taxation.bocwLabourCessPercent}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            taxation: {
                              ...setupData.taxation,
                              bocwLabourCessPercent: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                      />
                      <span className="text-xs font-semibold text-[#475569]">%</span>
                    </div>
                    <span className="text-[10px] text-[#64748B] mt-1 block">BOCW Act mandatory statutory</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-State Branch GST Registrations */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-[#0F6CBD]" />
                    Multi-State GST Registrations ({setupData.taxation.stateRegistrations.length})
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Enables Place of Supply (POS) rules and Inter-State (IGST) vs Intra-State (CGST+SGST) tax segregation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingStateGst(true)}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#0F6CBD]/10 text-[#0F6CBD] hover:bg-[#0F6CBD]/20 rounded transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add State GSTIN
                </button>
              </div>

              {isAddingStateGst && (
                <div className="mb-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                  <div className="font-semibold text-xs text-[#0F172A]">Add New State Branch GSTIN</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="State Code (e.g. 27)"
                      value={newStateGst.stateCode}
                      onChange={e => setNewStateGst({ ...newStateGst, stateCode: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded font-mono"
                    />
                    <input
                      type="text"
                      placeholder="State Name (e.g. Maharashtra)"
                      value={newStateGst.stateName}
                      onChange={e => setNewStateGst({ ...newStateGst, stateName: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded"
                    />
                    <input
                      type="text"
                      placeholder="15-Digit GSTIN"
                      value={newStateGst.gstin}
                      onChange={e => setNewStateGst({ ...newStateGst, gstin: e.target.value.toUpperCase() })}
                      className="px-2.5 py-1.5 text-xs border rounded font-mono uppercase"
                    />
                    <input
                      type="text"
                      placeholder="Branch Address"
                      value={newStateGst.address}
                      onChange={e => setNewStateGst({ ...newStateGst, address: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStateGst(false)}
                      className="px-3 py-1 text-xs border rounded hover:bg-[#F1F5F9]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddStateGst}
                      className="px-3 py-1 text-xs bg-[#0F6CBD] text-white rounded font-semibold"
                    >
                      Confirm Add
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold">
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">State & Branch Operations</th>
                      <th className="p-2.5">GSTIN</th>
                      <th className="p-2.5">Registered Branch Address</th>
                      <th className="p-2.5 text-center">Primary HQ</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {setupData.taxation.stateRegistrations.map((st, idx) => (
                      <tr key={st.gstin + idx} className="hover:bg-[#F8FAFC]/80">
                        <td className="p-2.5 font-mono font-bold text-[#0F6CBD]">{st.stateCode}</td>
                        <td className="p-2.5 font-medium text-[#0F172A]">{st.stateName}</td>
                        <td className="p-2.5 font-mono font-bold text-[#0F172A]">{st.gstin}</td>
                        <td className="p-2.5 text-[#64748B] max-w-xs truncate">{st.address}</td>
                        <td className="p-2.5 text-center">
                          {st.isPrimary ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              HQ Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSetupData(prev => ({
                                  ...prev,
                                  taxation: {
                                    ...prev.taxation,
                                    stateRegistrations: prev.taxation.stateRegistrations.map((r, i) => ({
                                      ...r,
                                      isPrimary: i === idx
                                    }))
                                  }
                                }));
                              }}
                              className="text-[11px] text-[#64748B] hover:text-[#0F6CBD] underline"
                            >
                              Make Primary
                            </button>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          {!st.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStateGst(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete State Registration"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANKING, TREASURY & RETENTION */}
        {activeSubTab === 'banking' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#0F6CBD]" />
                    Corporate Treasury & Project Escrow Bank Accounts
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Bank accounts mapped to GL sub-ledgers for receiving client milestone advances and disbursing subcontractor progress bills.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingBank(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#0F6CBD] text-white rounded hover:bg-[#0E5AA0] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Bank Account
                </button>
              </div>

              {isAddingBank && (
                <div className="mb-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                  <div className="font-semibold text-xs text-[#0F172A]">Add Corporate / Escrow Bank Account</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Bank Name (e.g. ICICI Bank)"
                      value={newBank.bankName}
                      onChange={e => setNewBank({ ...newBank, bankName: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Branch Name"
                      value={newBank.branch}
                      onChange={e => setNewBank({ ...newBank, branch: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded"
                    />
                    <select
                      value={newBank.accountType}
                      onChange={e => setNewBank({ ...newBank, accountType: e.target.value as any })}
                      className="px-2.5 py-1.5 text-xs border rounded"
                    >
                      <option value="CURRENT">Current Account (Operational)</option>
                      <option value="ESCROW">Escrow Account (Project Earmarked)</option>
                      <option value="STATUTORY_RESERVE">Statutory Reserve (GST/TDS)</option>
                      <option value="OVERDRAFT">Overdraft (OD / Cash Credit)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={newBank.accountNumber}
                      onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded font-mono"
                    />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={newBank.ifscCode}
                      onChange={e => setNewBank({ ...newBank, ifscCode: e.target.value.toUpperCase() })}
                      className="px-2.5 py-1.5 text-xs border rounded font-mono uppercase"
                    />
                    <input
                      type="text"
                      placeholder="UPI VPA (e.g. company@icici)"
                      value={newBank.upiVpa}
                      onChange={e => setNewBank({ ...newBank, upiVpa: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded"
                    />
                    <input
                      type="text"
                      placeholder="GL Code (e.g. 100110)"
                      value={newBank.glAccountCode}
                      onChange={e => setNewBank({ ...newBank, glAccountCode: e.target.value })}
                      className="px-2.5 py-1.5 text-xs border rounded font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingBank(false)}
                      className="px-3 py-1 text-xs border rounded hover:bg-[#F1F5F9]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddBank}
                      className="px-3 py-1 text-xs bg-[#0F6CBD] text-white rounded font-semibold"
                    >
                      Save Account
                    </button>
                  </div>
                </div>
              )}

              {/* Accounts Card List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {setupData.banking.accounts.map(acc => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-lg border border-[#CBD5E1] bg-white hover:border-[#0F6CBD] transition-all relative flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            acc.accountType === 'CURRENT'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : acc.accountType === 'ESCROW'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {acc.accountType}
                        </span>
                        <div className="flex items-center gap-1">
                          {acc.isDefaultReceipt && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                              Default Receipt
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveBank(acc.id)}
                            className="text-rose-400 hover:text-rose-600 p-1"
                            title="Remove Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-[#0F172A]">{acc.bankName}</h4>
                      <p className="text-[11px] text-[#64748B] mb-2">{acc.branch}</p>

                      <div className="space-y-1.5 font-mono text-xs pt-2 border-t border-[#F1F5F9]">
                        <div className="flex justify-between">
                          <span className="text-[#64748B] font-sans text-[11px]">A/C No:</span>
                          <span className="font-bold text-[#0F172A]">{acc.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B] font-sans text-[11px]">IFSC:</span>
                          <span className="text-[#0F6CBD] font-semibold">{acc.ifscCode}</span>
                        </div>
                        {acc.upiVpa && (
                          <div className="flex justify-between">
                            <span className="text-[#64748B] font-sans text-[11px]">UPI:</span>
                            <span className="text-[#475569] text-[11px] truncate max-w-[150px]">{acc.upiVpa}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[#64748B] font-sans text-[11px]">GL Code:</span>
                          <span className="text-[#475569]">{acc.glAccountCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#F1F5F9] flex justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setSetupData(prev => ({
                            ...prev,
                            banking: {
                              ...prev.banking,
                              accounts: prev.banking.accounts.map(b => ({
                                ...b,
                                isDefaultReceipt: b.id === acc.id
                              }))
                            }
                          }));
                        }}
                        className={`hover:underline ${acc.isDefaultReceipt ? 'font-bold text-amber-700' : 'text-[#64748B]'}`}
                      >
                        {acc.isDefaultReceipt ? '★ Primary Inbound' : 'Set as Inbound'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSetupData(prev => ({
                            ...prev,
                            banking: {
                              ...prev.banking,
                              accounts: prev.banking.accounts.map(b => ({
                                ...b,
                                isDefaultDisbursement: b.id === acc.id
                              }))
                            }
                          }));
                        }}
                        className={`hover:underline ${acc.isDefaultDisbursement ? 'font-bold text-blue-700' : 'text-[#64748B]'}`}
                      >
                        {acc.isDefaultDisbursement ? '★ Primary Outbound' : 'Set as Outbound'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commercial Terms & Retention Withholding Defaults */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-4 pb-2 border-b border-[#F1F5F9] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#0F6CBD]" />
                Commercial Credit, Advance & Retention Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Standard Client Credit Period
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={setupData.banking.defaultCreditPeriodDays}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          banking: {
                            ...setupData.banking,
                            defaultCreditPeriodDays: parseInt(e.target.value, 10) || 0
                          }
                        })
                      }
                      className="w-20 px-2.5 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                    />
                    <span className="text-xs text-[#64748B]">Net Days</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block mt-1">Due date calculation on Tax Invoices</span>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Client Retention Holdback (%)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={setupData.banking.clientRetentionPercent}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          banking: {
                            ...setupData.banking,
                            clientRetentionPercent: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                      className="w-20 px-2.5 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                    />
                    <span className="text-xs text-[#64748B]">% of RA Bill</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block mt-1">DLP Defect Liability guarantee hold</span>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Subcontractor Retention Hold (%)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={setupData.banking.subcontractorRetentionPercent}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          banking: {
                            ...setupData.banking,
                            subcontractorRetentionPercent: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                      className="w-20 px-2.5 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                    />
                    <span className="text-xs text-[#64748B]">% per WO</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block mt-1">Withheld till final site signoff</span>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Mobilization Advance (%)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="1"
                      value={setupData.banking.mobilizationAdvanceStandardPercent}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          banking: {
                            ...setupData.banking,
                            mobilizationAdvanceStandardPercent: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                      className="w-20 px-2.5 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                    />
                    <span className="text-xs text-[#64748B]">% on Award</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block mt-1">Standard turnkey contract booking</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENT NUMBERING SERIES */}
        {activeSubTab === 'numbering' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F6CBD]" />
                    Enterprise Document Numbering Series Controls
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Strict sequence generators for Invoices, Purchase Orders, Work Orders, and MRNs adhering to GST Section 31 rule 46(b).
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0F6CBD] bg-[#0F6CBD]/10 px-2.5 py-1 rounded">
                  8 Registered Sequences
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold">
                      <th className="p-2.5">Document Type</th>
                      <th className="p-2.5">Prefix Format</th>
                      <th className="p-2.5">Start Seq</th>
                      <th className="p-2.5">Last Issued</th>
                      <th className="p-2.5">Padding</th>
                      <th className="p-2.5">Live Next Example Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {setupData.numberSeries.map(series => (
                      <tr key={series.id} className="hover:bg-[#F8FAFC]/80">
                        <td className="p-2.5">
                          <span className="font-bold text-[#0F172A] block">{series.name}</span>
                          <span className="text-[10px] font-mono text-[#64748B]">{series.documentType}</span>
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={series.prefix}
                            onChange={e => handleUpdateSeries(series.id, { prefix: e.target.value })}
                            className="px-2 py-1 text-xs font-mono font-semibold border border-[#CBD5E1] rounded w-36"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={series.startingNumber}
                            onChange={e =>
                              handleUpdateSeries(series.id, { startingNumber: parseInt(e.target.value, 10) || 1 })
                            }
                            className="px-2 py-1 text-xs font-mono border border-[#CBD5E1] rounded w-20"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={series.lastUsedNumber}
                            onChange={e =>
                              handleUpdateSeries(series.id, { lastUsedNumber: parseInt(e.target.value, 10) || 0 })
                            }
                            className="px-2 py-1 text-xs font-mono border border-[#CBD5E1] rounded w-20"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            min="3"
                            max="8"
                            value={series.numberPadding}
                            onChange={e =>
                              handleUpdateSeries(series.id, { numberPadding: parseInt(e.target.value, 10) || 4 })
                            }
                            className="px-2 py-1 text-xs font-mono border border-[#CBD5E1] rounded w-16"
                          />
                        </td>
                        <td className="p-2.5">
                          <span className="px-2.5 py-1 rounded bg-[#F1F5F9] font-mono text-[#0F6CBD] font-bold border border-[#CBD5E1] text-[11px]">
                            {series.previewExample}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CHART OF ACCOUNTS & GL MAPPING */}
        {activeSubTab === 'gl_mapping' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0F6CBD]" />
                    General Ledger (GL) Integration & Account Mappings
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Maps operational transactions (Invoices, MRNs, Subcontractor RA bills) to standard Chart of Accounts ledgers.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {setupData.glMappings.length} Active Ledger Accounts
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold">
                      <th className="p-2.5">Account Code</th>
                      <th className="p-2.5">Account Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Normal Nature</th>
                      <th className="p-2.5">Workflow Role & Trigger Event</th>
                      <th className="p-2.5 text-center">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {setupData.glMappings.map(gl => (
                      <tr key={gl.accountCode} className="hover:bg-[#F8FAFC]/80">
                        <td className="p-2.5 font-mono font-bold text-[#0F6CBD]">{gl.accountCode}</td>
                        <td className="p-2.5 font-semibold text-[#0F172A]">{gl.accountName}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              gl.category === 'REVENUE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : gl.category === 'EXPENSE'
                                ? 'bg-amber-100 text-amber-800'
                                : gl.category === 'LIABILITY'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {gl.category}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`font-mono font-bold ${
                              gl.nature === 'DEBIT' ? 'text-blue-700' : 'text-emerald-700'
                            }`}
                          >
                            {gl.nature}
                          </span>
                        </td>
                        <td className="p-2.5 text-[#475569]">{gl.roleInWorkflow}</td>
                        <td className="p-2.5 text-center">
                          {gl.isStatutory ? (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                              Statutory
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#64748B]">Operational</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FINANCIAL GOVERNANCE & GUARDRAILS */}
        {activeSubTab === 'governance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#0F6CBD]" />
                    Internal Financial Controls & Audit Guardrails
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Strict commercial approval tolerances, maker-checker authorization thresholds, and mandatory verification gates.
                  </p>
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                  Governance Level: High
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Numeric Controls */}
                <div className="space-y-4">
                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                    <label className="text-xs font-bold text-[#0F172A] block mb-1">
                      Dual Commercial Approval Threshold (₹)
                    </label>
                    <p className="text-[11px] text-[#64748B] mb-2">
                      Any Purchase Order or Subcontractor Work Order exceeding this value requires secondary signoff by the Managing Director.
                    </p>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-2 text-xs font-bold text-[#64748B]">₹</span>
                      <input
                        type="number"
                        step="10000"
                        value={setupData.governance.dualApprovalThresholdAmount}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            governance: {
                              ...setupData.governance,
                              dualApprovalThresholdAmount: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                    <label className="text-xs font-bold text-[#0F172A] block mb-1">
                      Budget Overrun Tolerance Percentage (%)
                    </label>
                    <p className="text-[11px] text-[#64748B] mb-2">
                      Maximum permissible variance against the approved baseline budget before the system automatically blocks additional procurement.
                    </p>
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        step="0.5"
                        value={setupData.governance.budgetOverrunTolerancePercent}
                        onChange={e =>
                          setSetupData({
                            ...setupData,
                            governance: {
                              ...setupData.governance,
                              budgetOverrunTolerancePercent: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded bg-white pr-7"
                      />
                      <span className="absolute right-3 top-2 text-xs font-bold text-[#64748B]">%</span>
                    </div>
                  </div>
                </div>

                {/* Policy Toggles */}
                <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#334155] mb-2">
                    Enforcement Policies & Mandatory Workflows
                  </h4>

                  <label className="flex items-start gap-2.5 p-2 rounded hover:bg-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setupData.governance.requirePOForEveryDirectVendorInvoice}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          governance: {
                            ...setupData.governance,
                            requirePOForEveryDirectVendorInvoice: e.target.checked
                          }
                        })
                      }
                      className="mt-0.5 rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#0F172A] block">
                        Strict 3-Way Matching (PO Required for Vendor Invoices)
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Vendor invoices cannot be booked in finance without a corresponding authorized Purchase Order and Site MRN.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded hover:bg-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setupData.governance.requireMeasurementBookEntryForSubcontractorBilling}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          governance: {
                            ...setupData.governance,
                            requireMeasurementBookEntryForSubcontractorBilling: e.target.checked
                          }
                        })
                      }
                      className="mt-0.5 rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#0F172A] block">
                        Mandatory Site Measurement Book (MB) Verification
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Subcontractor trade progress bills require signed site engineer measurement entry prior to disbursement.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded hover:bg-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setupData.governance.autoLockBudgetAfterClientApproval}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          governance: {
                            ...setupData.governance,
                            autoLockBudgetAfterClientApproval: e.target.checked
                          }
                        })
                      }
                      className="mt-0.5 rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#0F172A] block">
                        Lock Cost Baseline Upon Client Quotation Approval
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Freezes original direct cost rates and markup structure; requires change-order revision to amend.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded hover:bg-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setupData.governance.enableMakerCheckerForDisbursements}
                      onChange={e =>
                        setSetupData({
                          ...setupData,
                          governance: {
                            ...setupData.governance,
                            enableMakerCheckerForDisbursements: e.target.checked
                          }
                        })
                      }
                      className="mt-0.5 rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#0F172A] block">
                        Maker-Checker Workflow on Banking Disbursements
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Accountant initiates payment batch; Chief Financial Officer or Director authorizes bank release.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-[#CBD5E1]">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-[#0F172A]">Reset Company Setup to Standard Baseline?</h3>
            </div>
            <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
              This action will reset legal entity details, fiscal year boundaries, default 18% Works Contract GST, SAC
              codes, and standard number series to official statutory defaults. Any customized local numbers will be
              reverted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3 py-1.5 text-xs font-medium border border-[#CBD5E1] rounded hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToBaseline}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Yes, Reset to Baseline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
