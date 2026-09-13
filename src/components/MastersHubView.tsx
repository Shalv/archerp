import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  Truck, 
  HardHat, 
  Layers, 
  Scale, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Percent, 
  DollarSign, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { 
  MasterRateItem, 
  TradeCategory, 
  UserSession, 
  CustomerMaster, 
  VendorMaster, 
  ResourceMaster, 
  WorkPackageMaster, 
  UOMMaster, 
  TaxRuleMaster,
  MeasurementUnit
} from '../types/erp';

interface MastersHubViewProps {
  currentUser: UserSession;
  masterRates: MasterRateItem[];
  onUpdateRate: (rate: MasterRateItem) => void;
  onAddRate: (rate: MasterRateItem) => void;
  onDeleteRate?: (id: string) => void;
  onCreateNewProject?: (projectData: any) => void;
  onSelectProject?: (projId: string) => void;
  onNavigateToCompanySetup?: () => void;
}

export const MastersHubView: React.FC<MastersHubViewProps> = ({
  currentUser,
  masterRates,
  onUpdateRate,
  onAddRate,
  onDeleteRate,
  onCreateNewProject,
  onSelectProject,
  onNavigateToCompanySetup
}) => {
  // Navigation tabs in Masters Hub
  const [activeMasterTab, setActiveMasterTab] = useState<
    'ITEMS' | 'CUSTOMERS' | 'VENDORS' | 'RESOURCES' | 'PACKAGES' | 'UOM_TAX' | 'NEW_PROJECT'
  >('ITEMS');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');

  // Master State from API
  const [customers, setCustomers] = useState<CustomerMaster[]>([]);
  const [vendors, setVendors] = useState<VendorMaster[]>([]);
  const [resources, setResources] = useState<ResourceMaster[]>([]);
  const [workPackages, setWorkPackages] = useState<WorkPackageMaster[]>([]);
  const [uomList, setUomList] = useState<UOMMaster[]>([]);
  const [taxRules, setTaxRules] = useState<TaxRuleMaster[]>([]);

  // Modal / Editing states
  const [editingItem, setEditingItem] = useState<MasterRateItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<CustomerMaster | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [editingVendor, setEditingVendor] = useState<VendorMaster | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const [editingResource, setEditingResource] = useState<ResourceMaster | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  const [editingWorkPackage, setEditingWorkPackage] = useState<WorkPackageMaster | null>(null);
  const [isWorkPackageModalOpen, setIsWorkPackageModalOpen] = useState(false);

  // New Project Wizard State
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    customerId: '',
    projectType: 'RESIDENTIAL',
    projectScope: 'TURNKEY_INTERIORS',
    siteAddress: '',
    city: 'NCR (Gurugram / Delhi)',
    carpetAreaSqFt: 2200,
    builtUpAreaSqFt: 2600,
    customerBudgetMin: 3500000,
    customerBudgetMax: 5000000,
    targetCompletionDate: '2026-12-31',
    preferredDesignStyle: 'Modern Minimalist with Warm Wood Accents',
    surveyNotes: 'Initial client briefing captured. Site access permitted 8 AM - 6 PM.'
  });

  const isEstimatorOrAdmin = currentUser?.role === 'ESTIMATOR' || currentUser?.role === 'ADMIN';

  // Load Masters from Backend
  useEffect(() => {
    fetchCustomers();
    fetchVendors();
    fetchResources();
    fetchWorkPackages();
    fetchUOMAndTax();
  }, []);

  const fetchCustomers = () => {
    fetch('/api/masters/customers')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setCustomers(data))
      .catch(console.error);
  };

  const fetchVendors = () => {
    fetch('/api/masters/vendors')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setVendors(data))
      .catch(console.error);
  };

  const fetchResources = () => {
    fetch('/api/masters/resources')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setResources(data))
      .catch(console.error);
  };

  const fetchWorkPackages = () => {
    fetch('/api/masters/work-packages')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setWorkPackages(data))
      .catch(console.error);
  };

  const fetchUOMAndTax = () => {
    fetch('/api/masters/uom-tax')
      .then(r => r.json())
      .then(data => {
        if (data.uomList) setUomList(data.uomList);
        if (data.taxRules) setTaxRules(data.taxRules);
      })
      .catch(console.error);
  };

  // --- ITEM MASTER ACTIONS ---
  const handleOpenNewItem = () => {
    const newItem: MasterRateItem = {
      id: `RATE-MANUAL-${Date.now()}`,
      itemCode: `ITM-0${masterRates.length + 1}`,
      trade: 'CARPENTRY_JOINERY',
      workPackage: 'General Millwork Package',
      description: '',
      specification: '',
      brandGrade: 'Commercial Grade A',
      unit: 'sq.ft',
      materialRate: 0,
      labourRate: 0,
      equipmentRate: 0,
      subcontractRate: 0,
      totalUnitCost: 0,
      defaultMarkupPercent: 25,
      suggestedSellingRate: 0,
      rateSource: 'APPROVED_MASTER',
      location: 'NCR / Metro Urban',
      effectiveDate: '2026-09-11',
      status: 'APPROVED',
      hsnSacCode: '995426',
      gstRate: 18
    };
    setEditingItem(newItem);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Recalculate deterministic costs
    const mat = Number(editingItem.materialRate) || 0;
    const lab = Number(editingItem.labourRate) || 0;
    const eq = Number(editingItem.equipmentRate) || 0;
    const sub = Number(editingItem.subcontractRate) || 0;
    const totalCost = mat + lab + eq + sub;
    const markup = Number(editingItem.defaultMarkupPercent) || 25;
    const selling = Math.round(totalCost * (1 + markup / 100));

    const finalItem: MasterRateItem = {
      ...editingItem,
      totalUnitCost: totalCost,
      suggestedSellingRate: selling
    };

    const exists = masterRates.some(r => r.id === finalItem.id);
    if (exists) {
      onUpdateRate(finalItem);
    } else {
      onAddRate(finalItem);
    }

    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDuplicateItem = (item: MasterRateItem) => {
    const duplicated: MasterRateItem = {
      ...item,
      id: `RATE-COPY-${Date.now()}`,
      itemCode: `${item.itemCode}-COPY`,
      description: `${item.description} (Copy)`,
      status: 'PROVISIONAL'
    };
    onAddRate(duplicated);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this master rate item?')) {
      if (onDeleteRate) {
        onDeleteRate(id);
      } else {
        await fetch(`/api/masters/rates/${id}`, {
          method: 'DELETE',
          headers: { 'x-user-id': currentUser.id }
        });
      }
    }
  };

  // --- CUSTOMER MASTER ACTIONS ---
  const handleOpenNewCustomer = () => {
    const newCust: CustomerMaster = {
      id: `CUST-${Date.now()}`,
      customerNo: `CUST-${1000 + customers.length + 1}`,
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      billingAddress: '',
      city: 'NCR (Gurugram / Delhi)',
      state: 'Haryana',
      pincode: '122001',
      customerType: 'INDIVIDUAL_HOMEOWNER',
      creditLimit: 5000000,
      paymentTerms: 'Milestone Based (10% Adv, 30% Civil, 25% Joinery, 20% Finishes, 15% Handover)',
      status: 'ACTIVE',
      totalProjectsCount: 0,
      createdAt: new Date().toISOString()
    };
    setEditingCustomer(newCust);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const exists = customers.some(c => c.id === editingCustomer.id);
    const method = exists ? 'PUT' : 'POST';
    const url = exists ? `/api/masters/customers/${editingCustomer.id}` : '/api/masters/customers';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUser.id
      },
      body: JSON.stringify(editingCustomer)
    });

    if (res.ok) {
      fetchCustomers();
      setIsCustomerModalOpen(false);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Delete this customer master record?')) {
      await fetch(`/api/masters/customers/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      fetchCustomers();
    }
  };

  // --- VENDOR MASTER ACTIONS ---
  const handleOpenNewVendor = () => {
    const newVend: VendorMaster = {
      id: `VEND-${Date.now()}`,
      vendorNo: `VEND-${2000 + vendors.length + 1}`,
      name: '',
      tradeSpecialty: 'CARPENTRY_JOINERY',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: 'Delhi NCR',
      rating: 4.5,
      paymentTerms: '30 Days Net',
      complianceStatus: 'VERIFIED',
      leadTimeDays: 7,
      status: 'ACTIVE'
    };
    setEditingVendor(newVend);
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    const exists = vendors.some(v => v.id === editingVendor.id);
    const method = exists ? 'PUT' : 'POST';
    const url = exists ? `/api/masters/vendors/${editingVendor.id}` : '/api/masters/vendors';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUser.id
      },
      body: JSON.stringify(editingVendor)
    });

    if (res.ok) {
      fetchVendors();
      setIsVendorModalOpen(false);
      setEditingVendor(null);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (confirm('Delete this vendor master record?')) {
      await fetch(`/api/masters/vendors/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      fetchVendors();
    }
  };

  // --- RESOURCE MASTER ACTIONS ---
  const handleOpenNewResource = () => {
    const newRes: ResourceMaster = {
      id: `RES-${Date.now()}`,
      resourceNo: `RES-${3000 + resources.length + 1}`,
      name: '',
      trade: 'CARPENTRY_JOINERY',
      skillLevel: 'MASTER_CRAFTSMAN',
      dailyWageRate: 1200,
      hourlyRate: 150,
      overtimeMultiplier: 1.5,
      standardDailyOutput: '25 sq.ft / day',
      employmentType: 'DIRECT_PAYROLL',
      phone: '',
      crewSize: 1,
      status: 'AVAILABLE'
    };
    setEditingResource(newRes);
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    const exists = resources.some(r => r.id === editingResource.id);
    const method = exists ? 'PUT' : 'POST';
    const url = exists ? `/api/masters/resources/${editingResource.id}` : '/api/masters/resources';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUser.id
      },
      body: JSON.stringify(editingResource)
    });

    if (res.ok) {
      fetchResources();
      setIsResourceModalOpen(false);
      setEditingResource(null);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('Delete this resource master record?')) {
      await fetch(`/api/masters/resources/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      fetchResources();
    }
  };

  // --- WORK PACKAGE MASTER ACTIONS ---
  const handleSaveWorkPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkPackage) return;

    const res = await fetch('/api/masters/work-packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUser.id
      },
      body: JSON.stringify(editingWorkPackage)
    });

    if (res.ok) {
      fetchWorkPackages();
      setIsWorkPackageModalOpen(false);
      setEditingWorkPackage(null);
    }
  };

  // --- CREATE NEW PROJECT FROM MASTERS WIZARD ---
  const handleSelectCustomerForProject = (cust: CustomerMaster) => {
    setNewProjectData(prev => ({
      ...prev,
      customerId: cust.id,
      clientName: cust.name,
      clientPhone: cust.phone,
      clientEmail: cust.email,
      siteAddress: cust.billingAddress,
      city: cust.city,
      title: `${cust.name} - Turnkey Interior Residence`
    }));
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectData.title || !newProjectData.clientName || !newProjectData.clientPhone) {
      alert('Please provide project title, client name, and phone number.');
      return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          title: newProjectData.title,
          clientName: newProjectData.clientName,
          clientPhone: newProjectData.clientPhone,
          clientEmail: newProjectData.clientEmail,
          projectType: newProjectData.projectType,
          projectScope: newProjectData.projectScope,
          siteAddress: newProjectData.siteAddress,
          city: newProjectData.city,
          carpetAreaSqFt: Number(newProjectData.carpetAreaSqFt) || 2000,
          customerBudgetMin: Number(newProjectData.customerBudgetMin) || 3000000,
          customerBudgetMax: Number(newProjectData.customerBudgetMax) || 5000000,
          targetCompletionDate: newProjectData.targetCompletionDate,
          preferredDesignStyle: newProjectData.preferredDesignStyle,
          surveyNotes: newProjectData.surveyNotes,
          preventDuplicate: false
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (onCreateNewProject) {
          onCreateNewProject(data);
        } else if (onSelectProject) {
          onSelectProject(data.id);
        }
      } else {
        alert(data.error || 'Failed to create project');
      }
    } catch (err) {
      alert('Error creating project');
    }
  };

  // Filtered Master Rates
  const filteredRates = masterRates.filter(rate => {
    const matchesSearch = 
      rate.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.brandGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.workPackage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrade = selectedTrade === 'ALL' || rate.trade === selectedTrade;
    return matchesSearch && matchesTrade;
  });

  return (
    <div className="space-y-4">
      {/* 1. D365 MASTER SECTION HEADER */}
      <div className="bg-white border border-[#E1DFDD] p-4 rounded shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#605E5C] uppercase tracking-wider">
                Enterprise Setup &amp; Governance
              </span>
              <span className="bg-[#EFF6FC] text-[#0F6CBD] font-mono text-xs font-bold px-2 py-0.5 rounded border border-[#C7E0F4]">
                Administration &amp; Master Data
              </span>
              <span className="bg-[#DFF6DD] text-[#107C41] text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                D365 BC Compliant (ACID Store)
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#201F1E] mt-1 tracking-tight">
              Master Section &amp; Operational Foundation
            </h1>
            <p className="text-xs text-[#605E5C] mt-0.5">
              Create and manage all mandatory master items, rates, customer registers, vendor networks, labour resource crews, trade packages, and tax rules required to run the full turnkey enterprise.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMasterTab('NEW_PROJECT')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#107C41] text-white hover:bg-[#0E6A38] text-xs font-semibold shadow-2xs transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch New Job Card Wizard</span>
            </button>
          </div>
        </div>

        {/* Master Section Navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-[#EDEBE9] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveMasterTab('ITEMS')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'ITEMS'
                ? 'bg-[#0F6CBD] text-white shadow-2xs'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Items &amp; Unit Rates ({masterRates.length})</span>
          </button>

          <button
            onClick={() => setActiveMasterTab('CUSTOMERS')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'CUSTOMERS'
                ? 'bg-[#0F6CBD] text-white shadow-2xs'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Customers Master ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveMasterTab('VENDORS')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'VENDORS'
                ? 'bg-[#0F6CBD] text-white shadow-2xs'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Vendors &amp; Subcontractors ({vendors.length})</span>
          </button>

          <button
            onClick={() => setActiveMasterTab('RESOURCES')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'RESOURCES'
                ? 'bg-[#0F6CBD] text-white shadow-2xs'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}
          >
            <HardHat className="h-4 w-4" />
            <span>Resources &amp; Labour Crews ({resources.length})</span>
          </button>

          <button
            onClick={() => setActiveMasterTab('PACKAGES')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'PACKAGES'
                ? 'bg-[#0F6CBD] text-white shadow-2xs'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Trade Packages &amp; WBS ({workPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveMasterTab('UOM_TAX')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'UOM_TAX'
                ? 'bg-[#0F6CBD] text-white shadow-2xs'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>UOM &amp; Tax Rules (GST)</span>
          </button>

          {onNavigateToCompanySetup && (
            <button
              onClick={onNavigateToCompanySetup}
              className="px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-2xs"
              title="Open Company Setup Master (Finance, Multi-State GST, Banking, GL Mapping & Series)"
            >
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span>Company Setup (Finance)</span>
            </button>
          )}

          <button
            onClick={() => setActiveMasterTab('NEW_PROJECT')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition ${
              activeMasterTab === 'NEW_PROJECT'
                ? 'bg-[#107C41] text-white shadow-2xs'
                : 'text-[#107C41] hover:bg-[#DFF6DD]'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>+ Create New Job</span>
          </button>
        </div>
      </div>

      {/* 2. MASTER ITEMS & PRICE CATALOG TAB */}
      {activeMasterTab === 'ITEMS' && (
        <div className="space-y-3">
          {/* Action Ribbon & Search */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#E1DFDD] rounded shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-72">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#605E5C]" />
                <input
                  type="text"
                  placeholder="Search item code, description, brand, package..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
                />
              </div>

              <select
                value={selectedTrade}
                onChange={e => setSelectedTrade(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
              >
                <option value="ALL">All Trades ({masterRates.length})</option>
                <option value="DEMOLITION_DISPOSAL">Demolition &amp; Disposal</option>
                <option value="CIVIL_MASONRY">Civil &amp; Masonry</option>
                <option value="WATERPROOFING">Waterproofing</option>
                <option value="FLOORING_TILING">Flooring &amp; Tiling</option>
                <option value="FALSE_CEILINGS">False Ceilings</option>
                <option value="PAINTING_POLISHING">Painting &amp; PolISHING</option>
                <option value="CARPENTRY_JOINERY">Carpentry &amp; Joinery</option>
                <option value="MODULAR_KITCHEN">Modular Kitchen</option>
                <option value="WARDROBES_STORAGE">Wardrobes &amp; Storage</option>
                <option value="ELECTRICAL_AUTOMATION">Electrical &amp; Automation</option>
                <option value="PLUMBING_SANITARY">Plumbing &amp; Sanitary</option>
                <option value="DOORS_WINDOWS_GLAZING">Doors, Windows &amp; Glazing</option>
                <option value="HVAC_VENTILATION">HVAC &amp; Ventilation</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#605E5C]">
                Showing <strong>{filteredRates.length}</strong> items
              </span>

              {isEstimatorOrAdmin && (
                <button
                  onClick={handleOpenNewItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-2xs transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Create Master Item</span>
                </button>
              )}
            </div>
          </div>

          {/* D365 High-Density Item Master Grid */}
          <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#F3F2F1] text-[#323130] font-semibold border-b border-[#E1DFDD] z-10">
                  <tr>
                    <th className="p-2.5 border-r border-[#E1DFDD] w-24">Item No.</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] w-36">Trade Discipline</th>
                    <th className="p-2.5 border-r border-[#E1DFDD]">Description &amp; Specifications</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] w-32">Brand / Grade</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-16">Unit</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20">Material</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20">Labour</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20">Equip/Sub</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-24">Unit Cost</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-16">Margin %</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-right w-24">Sell Price</th>
                    <th className="p-2.5 border-r border-[#E1DFDD] text-center w-20">Status</th>
                    {isEstimatorOrAdmin && <th className="p-2.5 text-center w-24">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBE9]">
                  {filteredRates.map(rate => (
                    <tr key={rate.id} className="hover:bg-[#FAF9F8] transition">
                      <td className="p-2.5 font-mono font-semibold text-[#0F6CBD] border-r border-[#EDEBE9]">
                        {rate.itemCode}
                      </td>
                      <td className="p-2.5 text-[#201F1E] border-r border-[#EDEBE9]">
                        <span className="px-1.5 py-0.5 rounded bg-[#FAF9F8] border border-[#EDEBE9] text-[10px] font-medium">
                          {rate.trade.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-2.5 border-r border-[#EDEBE9]">
                        <div className="font-semibold text-[#201F1E]">{rate.description}</div>
                        <div className="text-[11px] text-[#605E5C] truncate max-w-md">{rate.specification}</div>
                        {rate.hsnSacCode && (
                          <span className="text-[10px] text-[#8A8886] font-mono">SAC: {rate.hsnSacCode} • GST: {rate.gstRate}%</span>
                        )}
                      </td>
                      <td className="p-2.5 text-[#201F1E] border-r border-[#EDEBE9]">
                        {rate.brandGrade}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                        {rate.unit}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                        ₹{rate.materialRate.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                        ₹{rate.labourRate.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                        ₹{(rate.equipmentRate + rate.subcontractRate).toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono font-semibold text-[#201F1E] border-r border-[#EDEBE9]">
                        ₹{rate.totalUnitCost.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#107C41] border-r border-[#EDEBE9]">
                        {rate.defaultMarkupPercent}%
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#0F6CBD] border-r border-[#EDEBE9]">
                        ₹{rate.suggestedSellingRate.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-center border-r border-[#EDEBE9]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          rate.status === 'APPROVED' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FFF4CE] text-[#797673]'
                        }`}>
                          {rate.status}
                        </span>
                      </td>
                      {isEstimatorOrAdmin && (
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingItem({ ...rate });
                                setIsItemModalOpen(true);
                              }}
                              className="p-1 text-[#605E5C] hover:text-[#0F6CBD] rounded hover:bg-[#F3F2F1]"
                              title="Edit Master Item"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateItem(rate)}
                              className="p-1 text-[#605E5C] hover:text-[#107C41] rounded hover:bg-[#F3F2F1]"
                              title="Duplicate Item"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(rate.id)}
                              className="p-1 text-[#605E5C] hover:text-[#A80000] rounded hover:bg-[#F3F2F1]"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOMERS MASTER TAB */}
      {activeMasterTab === 'CUSTOMERS' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#E1DFDD] rounded shadow-2xs">
            <div className="text-xs text-[#605E5C]">
              <strong>Table 18 &quot;Customer&quot;</strong> — Client directory with GSTIN, billing addresses, and payment profiles.
            </div>

            <button
              onClick={handleOpenNewCustomer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-2xs transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create New Customer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customers.map(cust => (
              <div key={cust.id} className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 hover:border-[#0F6CBD] transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                      {cust.customerNo}
                    </span>
                    <h3 className="font-bold text-sm text-[#201F1E] mt-1.5">{cust.name}</h3>
                    {cust.companyName && <div className="text-xs text-[#605E5C]">{cust.companyName}</div>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    cust.status === 'ACTIVE' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FFF4CE] text-[#797673]'
                  }`}>
                    {cust.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-[#605E5C] border-t border-[#EDEBE9] pt-3">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#8A8886]" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#8A8886]" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#8A8886] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{cust.billingAddress}, {cust.city}</span>
                  </div>
                  {cust.gstin && (
                    <div className="text-[11px] font-mono text-[#201F1E] bg-[#FAF9F8] p-1 rounded">
                      GSTIN: {cust.gstin}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#8A8886]">Credit Limit:</span>
                    <span className="font-semibold text-[#201F1E]">₹{(cust.creditLimit || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDEBE9] flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleSelectCustomerForProject(cust);
                      setActiveMasterTab('NEW_PROJECT');
                    }}
                    className="text-xs text-[#107C41] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Create Job</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCustomer({ ...cust });
                        setIsCustomerModalOpen(true);
                      }}
                      className="text-xs text-[#0F6CBD] hover:underline font-medium"
                    >
                      Edit Card
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(cust.id)}
                      className="text-xs text-[#A80000] hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VENDORS & SUBCONTRACTORS TAB */}
      {activeMasterTab === 'VENDORS' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#E1DFDD] rounded shadow-2xs">
            <div className="text-xs text-[#605E5C]">
              <strong>Table 23 &quot;Vendor&quot;</strong> — Verified trade suppliers, millwork fabricators, glass distributors, and MEP subcontractors.
            </div>

            <button
              onClick={handleOpenNewVendor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-2xs transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create New Vendor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vendors.map(vend => (
              <div key={vend.id} className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 hover:border-[#0F6CBD] transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                      {vend.vendorNo}
                    </span>
                    <h3 className="font-bold text-sm text-[#201F1E] mt-1.5">{vend.name}</h3>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-[#FAF9F8] border border-[#EDEBE9] text-[10px] font-medium text-[#605E5C]">
                      {vend.tradeSpecialty.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFF4CE] text-[#797673] px-1.5 py-0.5 rounded text-xs font-bold">
                    <Star className="h-3 w-3 fill-current text-[#D83B01]" />
                    <span>{vend.rating}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-[#605E5C] border-t border-[#EDEBE9] pt-3">
                  <div>Contact: <strong>{vend.contactPerson}</strong></div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#8A8886]" />
                    <span>{vend.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#8A8886]" />
                    <span className="truncate">{vend.email}</span>
                  </div>
                  <div>City: <strong>{vend.city}</strong> • Lead time: <strong>{vend.leadTimeDays} days</strong></div>
                  {vend.gstin && (
                    <div className="text-[11px] font-mono text-[#201F1E] bg-[#FAF9F8] p-1 rounded">
                      GSTIN: {vend.gstin}
                    </div>
                  )}
                  {vend.notes && (
                    <div className="text-[11px] text-[#605E5C] italic line-clamp-2">
                      &quot;{vend.notes}&quot;
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDEBE9] flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    vend.complianceStatus === 'VERIFIED' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FFF4CE] text-[#797673]'
                  }`}>
                    {vend.complianceStatus}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingVendor({ ...vend });
                        setIsVendorModalOpen(true);
                      }}
                      className="text-xs text-[#0F6CBD] hover:underline font-medium"
                    >
                      Edit Card
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vend.id)}
                      className="text-xs text-[#A80000] hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RESOURCES & LABOUR CREWS TAB */}
      {activeMasterTab === 'RESOURCES' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#E1DFDD] rounded shadow-2xs">
            <div className="text-xs text-[#605E5C]">
              <strong>Table 156 &quot;Resource&quot;</strong> — Site labor trades, daily wage masters, output benchmarks, and specialist craftsman crews.
            </div>

            <button
              onClick={handleOpenNewResource}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-2xs transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create New Resource</span>
            </button>
          </div>

          <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F3F2F1] text-[#323130] font-semibold border-b border-[#E1DFDD]">
                <tr>
                  <th className="p-2.5 border-r border-[#E1DFDD] w-24">Resource No.</th>
                  <th className="p-2.5 border-r border-[#E1DFDD]">Resource / Gang Name</th>
                  <th className="p-2.5 border-r border-[#E1DFDD] w-36">Trade Discipline</th>
                  <th className="p-2.5 border-r border-[#E1DFDD] w-32">Skill Level</th>
                  <th className="p-2.5 border-r border-[#E1DFDD] text-right w-24">Daily Wage (8h)</th>
                  <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20">Hourly (₹)</th>
                  <th className="p-2.5 border-r border-[#E1DFDD]">Standard Output Benchmark</th>
                  <th className="p-2.5 border-r border-[#E1DFDD] w-28">Type</th>
                  <th className="p-2.5 border-r border-[#E1DFDD] text-center w-24">Status</th>
                  <th className="p-2.5 text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE9]">
                {resources.map(res => (
                  <tr key={res.id} className="hover:bg-[#FAF9F8]">
                    <td className="p-2.5 font-mono font-semibold text-[#0F6CBD] border-r border-[#EDEBE9]">
                      {res.resourceNo}
                    </td>
                    <td className="p-2.5 border-r border-[#EDEBE9]">
                      <div className="font-semibold text-[#201F1E]">{res.name}</div>
                      {res.phone && <div className="text-[11px] text-[#605E5C]">{res.phone}</div>}
                    </td>
                    <td className="p-2.5 border-r border-[#EDEBE9]">
                      <span className="px-1.5 py-0.5 rounded bg-[#FAF9F8] border border-[#EDEBE9] text-[10px]">
                        {res.trade.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-[#EDEBE9] text-[#201F1E]">
                      {res.skillLevel.replace(/_/g, ' ')}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#107C41] border-r border-[#EDEBE9]">
                      ₹{res.dailyWageRate.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                      ₹{res.hourlyRate}
                    </td>
                    <td className="p-2.5 border-r border-[#EDEBE9] text-[#201F1E]">
                      {res.standardDailyOutput}
                    </td>
                    <td className="p-2.5 border-r border-[#EDEBE9] text-[11px] text-[#605E5C]">
                      {res.employmentType.replace(/_/g, ' ')}
                    </td>
                    <td className="p-2.5 text-center border-r border-[#EDEBE9]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        res.status === 'AVAILABLE' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#EFF6FC] text-[#0F6CBD]'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingResource({ ...res });
                            setIsResourceModalOpen(true);
                          }}
                          className="p-1 text-[#605E5C] hover:text-[#0F6CBD] rounded hover:bg-[#F3F2F1]"
                          title="Edit Resource"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-1 text-[#605E5C] hover:text-[#A80000] rounded hover:bg-[#F3F2F1]"
                          title="Delete Resource"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TRADE PACKAGES & WBS TAB */}
      {activeMasterTab === 'PACKAGES' && (
        <div className="space-y-3">
          <div className="p-2.5 bg-white border border-[#E1DFDD] rounded shadow-2xs text-xs text-[#605E5C]">
            Standard Work Breakdown Structure (WBS) trade packages with normative wastage thresholds, standard inclusions, and legal exclusions.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workPackages.map(wp => (
              <div key={wp.id} className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded">
                      {wp.code}
                    </span>
                    <h3 className="font-bold text-sm text-[#201F1E] mt-1.5">{wp.name}</h3>
                    <div className="text-[11px] text-[#605E5C] mt-0.5 font-mono">SAC: {wp.hsnSacCode} • GST: {wp.defaultGstPercent}%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A8886] block">Std. Wastage</span>
                    <span className="font-mono font-bold text-xs text-[#D83B01]">{wp.standardWastagePercent}%</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs border-t border-[#EDEBE9] pt-3">
                  <div>
                    <span className="font-semibold text-[#107C41] block mb-1">Mandatory Inclusions:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#323130]">
                      {wp.mandatoryInclusions.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-[#A80000] block mb-1">Standard Exclusions:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#605E5C]">
                      {wp.standardExclusions.map((exc, i) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. UOM & TAX SETUP TAB */}
      {activeMasterTab === 'UOM_TAX' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UOM List */}
          <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 space-y-3">
            <h3 className="font-bold text-sm text-[#201F1E] pb-2 border-b border-[#EDEBE9]">
              Units of Measure (UOM) Catalog
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3F2F1] font-semibold text-[#323130]">
                  <tr>
                    <th className="p-2">Code</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Dimension</th>
                    <th className="p-2 text-right">Decimals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBE9]">
                  {uomList.map(uom => (
                    <tr key={uom.code}>
                      <td className="p-2 font-mono font-bold text-[#0F6CBD]">{uom.code}</td>
                      <td className="p-2 text-[#201F1E]">{uom.name}</td>
                      <td className="p-2 text-[#605E5C]">{uom.dimensionType}</td>
                      <td className="p-2 text-right font-mono">{uom.precision}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Rules */}
          <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 space-y-3">
            <h3 className="font-bold text-sm text-[#201F1E] pb-2 border-b border-[#EDEBE9]">
              GST Tax Schedules (Works Contracts &amp; Material)
            </h3>
            <div className="space-y-3">
              {taxRules.map(tax => (
                <div key={tax.id} className="p-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0F6CBD]">{tax.code}</span>
                    <span className="px-2 py-0.5 rounded bg-[#EFF6FC] text-[#0F6CBD] font-bold text-xs">
                      {tax.gstRatePercent}% GST
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-[#201F1E] mt-1">{tax.name}</div>
                  <div className="text-[11px] text-[#605E5C] mt-1">{tax.description}</div>
                  <div className="text-[10px] font-mono text-[#8A8886] mt-1">Applicable SAC: {tax.applicableHSNSAC}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. CREATE NEW JOB / PROJECT WIZARD TAB */}
      {activeMasterTab === 'NEW_PROJECT' && (
        <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-5 max-w-4xl mx-auto space-y-5">
          <div>
            <span className="text-xs font-semibold text-[#107C41] uppercase tracking-wider">
              Dynamics 365 Job Initiation Wizard
            </span>
            <h2 className="text-lg font-bold text-[#201F1E] mt-1">
              Initialize New Turnkey Interior / Architectural Construction Project
            </h2>
            <p className="text-xs text-[#605E5C]">
              Spin up a new Job Card directly from Customer &amp; Item masters with full dimensions, survey brief, and budget boundaries.
            </p>
          </div>

          <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
            {/* Quick Customer Auto-fill */}
            <div className="p-3 bg-[#EFF6FC] border border-[#C7E0F4] rounded">
              <label className="block text-xs font-semibold text-[#0F6CBD] mb-1">
                Select Existing Customer Master (Auto-Fills Details):
              </label>
              <select
                onChange={e => {
                  const cust = customers.find(c => c.id === e.target.value);
                  if (cust) handleSelectCustomerForProject(cust);
                }}
                className="w-full text-xs p-2 rounded border border-[#89BBE9] bg-white text-[#201F1E]"
              >
                <option value="">-- Choose from Customer Master or enter manually below --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.customerNo} - {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectData.title}
                  onChange={e => setNewProjectData({ ...newProjectData, title: e.target.value })}
                  placeholder="e.g. Skyline Residences Penthouse 1801 Turnkey Interiors"
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Project Scope *
                </label>
                <select
                  value={newProjectData.projectScope}
                  onChange={e => setNewProjectData({ ...newProjectData, projectScope: e.target.value as any })}
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                >
                  <option value="TURNKEY_INTERIORS">Turnkey Interiors &amp; Fit-out</option>
                  <option value="ARCHITECTURE_BUILD">Architecture &amp; Civil Build</option>
                  <option value="COMPLETE_RENOVATION">Complete Structural Renovation</option>
                  <option value="INTERIOR_FITOUT">Commercial Fitout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Client / Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectData.clientName}
                  onChange={e => setNewProjectData({ ...newProjectData, clientName: e.target.value })}
                  placeholder="e.g. Vikram & Ananya Malhotra"
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Client Phone *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectData.clientPhone}
                  onChange={e => setNewProjectData({ ...newProjectData, clientPhone: e.target.value })}
                  placeholder="+91 98110 00000"
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={newProjectData.clientEmail}
                  onChange={e => setNewProjectData({ ...newProjectData, clientEmail: e.target.value })}
                  placeholder="client@domain.com"
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Carpet Area (sq.ft)
                </label>
                <input
                  type="number"
                  value={newProjectData.carpetAreaSqFt}
                  onChange={e => setNewProjectData({ ...newProjectData, carpetAreaSqFt: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Site / Property Address
                </label>
                <input
                  type="text"
                  value={newProjectData.siteAddress}
                  onChange={e => setNewProjectData({ ...newProjectData, siteAddress: e.target.value })}
                  placeholder="Unit No, Tower, Road, Sector"
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  City / Region
                </label>
                <input
                  type="text"
                  value={newProjectData.city}
                  onChange={e => setNewProjectData({ ...newProjectData, city: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Target Handover Date
                </label>
                <input
                  type="date"
                  value={newProjectData.targetCompletionDate}
                  onChange={e => setNewProjectData({ ...newProjectData, targetCompletionDate: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#201F1E] mb-1">
                  Client Budget Max (₹)
                </label>
                <input
                  type="number"
                  value={newProjectData.customerBudgetMax}
                  onChange={e => setNewProjectData({ ...newProjectData, customerBudgetMax: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#201F1E] mb-1">
                Design &amp; Material Brief Notes
              </label>
              <textarea
                rows={3}
                value={newProjectData.preferredDesignStyle}
                onChange={e => setNewProjectData({ ...newProjectData, preferredDesignStyle: e.target.value })}
                className="w-full text-xs p-2 rounded border border-[#8A8886] bg-white text-[#201F1E]"
                placeholder="Preferred architectural style, brand preferences, special acoustic or civil requirements..."
              />
            </div>

            <div className="pt-3 border-t border-[#EDEBE9] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveMasterTab('ITEMS')}
                className="px-4 py-2 text-xs font-medium text-[#605E5C] hover:bg-[#F3F2F1] rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded bg-[#107C41] text-white hover:bg-[#0E6A38] shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Initialize Project &amp; Open Job Card</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ITEM CARD MODAL */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-2xl border border-[#EDEBE9] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="p-4 bg-[#002050] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#89BBE9]">Table 27 &quot;Item Card&quot;</span>
                <h3 className="font-bold text-sm">
                  {editingItem.id.startsWith('RATE-MANUAL') ? 'New Master Rate Item' : `Edit Item ${editingItem.itemCode}`}
                </h3>
              </div>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Item Code *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.itemCode}
                    onChange={e => setEditingItem({ ...editingItem, itemCode: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono font-bold text-[#0F6CBD]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Trade Discipline *</label>
                  <select
                    value={editingItem.trade}
                    onChange={e => setEditingItem({ ...editingItem, trade: e.target.value as any })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  >
                    <option value="DEMOLITION_DISPOSAL">Demolition &amp; Disposal</option>
                    <option value="CIVIL_MASONRY">Civil &amp; Masonry</option>
                    <option value="WATERPROOFING">Waterproofing</option>
                    <option value="FLOORING_TILING">Flooring &amp; Tiling</option>
                    <option value="FALSE_CEILINGS">False Ceilings</option>
                    <option value="PAINTING_POLISHING">Painting &amp; Polishing</option>
                    <option value="CARPENTRY_JOINERY">Carpentry &amp; Joinery</option>
                    <option value="MODULAR_KITCHEN">Modular Kitchen</option>
                    <option value="WARDROBES_STORAGE">Wardrobes &amp; Storage</option>
                    <option value="ELECTRICAL_AUTOMATION">Electrical &amp; Automation</option>
                    <option value="PLUMBING_SANITARY">Plumbing &amp; Sanitary</option>
                    <option value="DOORS_WINDOWS_GLAZING">Doors, Windows &amp; Glazing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Item Description *</label>
                <input
                  type="text"
                  required
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="e.g. Marine Grade BWP Plywood Wardrobe Carcass with Laminate Lining"
                  className="w-full p-2 border border-[#8A8886] rounded font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Technical Specification</label>
                  <input
                    type="text"
                    value={editingItem.specification}
                    onChange={e => setEditingItem({ ...editingItem, specification: e.target.value })}
                    placeholder="e.g. IS:710 certified, 18mm core, 0.8mm internal off-white liner"
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Brand / Grade Tier</label>
                  <input
                    type="text"
                    value={editingItem.brandGrade}
                    onChange={e => setEditingItem({ ...editingItem, brandGrade: e.target.value })}
                    placeholder="e.g. Greenply Club / Century Architect"
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Unit of Measure (UOM)</label>
                  <select
                    value={editingItem.unit}
                    onChange={e => setEditingItem({ ...editingItem, unit: e.target.value as any })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="r.ft">r.ft</option>
                    <option value="nos">nos</option>
                    <option value="lump sum">lump sum</option>
                    <option value="sq.m">sq.m</option>
                    <option value="cum">cum</option>
                    <option value="cft">cft</option>
                    <option value="kg">kg</option>
                    <option value="point">point</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={e => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  >
                    <option value="APPROVED">APPROVED (Audited)</option>
                    <option value="PROVISIONAL">PROVISIONAL</option>
                    <option value="STALE">STALE</option>
                  </select>
                </div>
              </div>

              {/* Rate Decomposition Box */}
              <div className="p-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-3">
                <span className="font-semibold text-xs text-[#201F1E] block">Deterministic Unit Rate Breakdown (₹)</span>
                
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#605E5C] mb-1">Material Rate (₹)</label>
                    <input
                      type="number"
                      value={editingItem.materialRate}
                      onChange={e => setEditingItem({ ...editingItem, materialRate: Number(e.target.value) })}
                      className="w-full p-1.5 border border-[#8A8886] rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#605E5C] mb-1">Labour Rate (₹)</label>
                    <input
                      type="number"
                      value={editingItem.labourRate}
                      onChange={e => setEditingItem({ ...editingItem, labourRate: Number(e.target.value) })}
                      className="w-full p-1.5 border border-[#8A8886] rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#605E5C] mb-1">Equipment (₹)</label>
                    <input
                      type="number"
                      value={editingItem.equipmentRate}
                      onChange={e => setEditingItem({ ...editingItem, equipmentRate: Number(e.target.value) })}
                      className="w-full p-1.5 border border-[#8A8886] rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#605E5C] mb-1">Subcontract (₹)</label>
                    <input
                      type="number"
                      value={editingItem.subcontractRate}
                      onChange={e => setEditingItem({ ...editingItem, subcontractRate: Number(e.target.value) })}
                      className="w-full p-1.5 border border-[#8A8886] rounded font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                  <div>
                    <span className="text-[11px] text-[#605E5C]">Computed Cost:</span>
                    <span className="font-mono font-bold text-xs text-[#201F1E] ml-1">
                      ₹{((Number(editingItem.materialRate) || 0) + (Number(editingItem.labourRate) || 0) + (Number(editingItem.equipmentRate) || 0) + (Number(editingItem.subcontractRate) || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#605E5C]">Markup:</span>
                    <input
                      type="number"
                      value={editingItem.defaultMarkupPercent}
                      onChange={e => setEditingItem({ ...editingItem, defaultMarkupPercent: Number(e.target.value) })}
                      className="w-16 p-1 border border-[#8A8886] rounded font-mono text-right"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={editingItem.hsnSacCode || '995426'}
                    onChange={e => setEditingItem({ ...editingItem, hsnSacCode: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">GST Rate %</label>
                  <input
                    type="number"
                    value={editingItem.gstRate || 18}
                    onChange={e => setEditingItem({ ...editingItem, gstRate: Number(e.target.value) })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDEBE9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-bold"
                >
                  Save Master Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER CARD MODAL */}
      {isCustomerModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-2xl border border-[#EDEBE9] w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="p-4 bg-[#002050] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#89BBE9]">Table 18 &quot;Customer Card&quot;</span>
                <h3 className="font-bold text-sm">Customer Master Record</h3>
              </div>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Customer No.</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.customerNo}
                    onChange={e => setEditingCustomer({ ...editingCustomer, customerNo: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono font-bold text-[#0F6CBD]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Customer Type</label>
                  <select
                    value={editingCustomer.customerType}
                    onChange={e => setEditingCustomer({ ...editingCustomer, customerType: e.target.value as any })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  >
                    <option value="INDIVIDUAL_HOMEOWNER">Individual Homeowner</option>
                    <option value="COMMERCIAL_ENTERPRISE">Commercial Enterprise</option>
                    <option value="BUILDER_DEVELOPER">Builder / Developer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="e.g. Vikram & Ananya Malhotra"
                  className="w-full p-2 border border-[#8A8886] rounded font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.phone}
                    onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Billing / Site Address</label>
                <input
                  type="text"
                  value={editingCustomer.billingAddress}
                  onChange={e => setEditingCustomer({ ...editingCustomer, billingAddress: e.target.value })}
                  placeholder="Street address, Unit No., Complex"
                  className="w-full p-2 border border-[#8A8886] rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">City</label>
                  <input
                    type="text"
                    value={editingCustomer.city}
                    onChange={e => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">State</label>
                  <input
                    type="text"
                    value={editingCustomer.state}
                    onChange={e => setEditingCustomer({ ...editingCustomer, state: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={editingCustomer.pincode}
                    onChange={e => setEditingCustomer({ ...editingCustomer, pincode: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={editingCustomer.gstin || ''}
                    onChange={e => setEditingCustomer({ ...editingCustomer, gstin: e.target.value })}
                    placeholder="07AAAAA0000A1Z5"
                    className="w-full p-2 border border-[#8A8886] rounded font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={editingCustomer.creditLimit}
                    onChange={e => setEditingCustomer({ ...editingCustomer, creditLimit: Number(e.target.value) })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDEBE9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-bold"
                >
                  Save Customer Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENDOR CARD MODAL */}
      {isVendorModalOpen && editingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-2xl border border-[#EDEBE9] w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="p-4 bg-[#002050] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#89BBE9]">Table 23 &quot;Vendor Card&quot;</span>
                <h3 className="font-bold text-sm">Vendor &amp; Subcontractor Master</h3>
              </div>
              <button
                onClick={() => setIsVendorModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Vendor No.</label>
                  <input
                    type="text"
                    required
                    value={editingVendor.vendorNo}
                    onChange={e => setEditingVendor({ ...editingVendor, vendorNo: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono font-bold text-[#0F6CBD]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Trade Specialty</label>
                  <select
                    value={editingVendor.tradeSpecialty}
                    onChange={e => setEditingVendor({ ...editingVendor, tradeSpecialty: e.target.value as any })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  >
                    <option value="CARPENTRY_JOINERY">Carpentry &amp; Joinery</option>
                    <option value="FLOORING_TILING">Flooring &amp; Tiling</option>
                    <option value="ELECTRICAL_AUTOMATION">Electrical &amp; Automation</option>
                    <option value="PLUMBING_SANITARY">Plumbing &amp; Sanitary</option>
                    <option value="DOORS_WINDOWS_GLAZING">Doors, Windows &amp; Glazing</option>
                    <option value="CIVIL_MASONRY">Civil &amp; Masonry</option>
                    <option value="FALSE_CEILINGS">False Ceilings</option>
                    <option value="PAINTING_POLISHING">Painting &amp; Polishing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Vendor / Agency Name *</label>
                <input
                  type="text"
                  required
                  value={editingVendor.name}
                  onChange={e => setEditingVendor({ ...editingVendor, name: e.target.value })}
                  placeholder="e.g. Saint-Gobain Glass & Glazing Solutions Ltd"
                  className="w-full p-2 border border-[#8A8886] rounded font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingVendor.contactPerson}
                    onChange={e => setEditingVendor({ ...editingVendor, contactPerson: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingVendor.phone}
                    onChange={e => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={editingVendor.gstin || ''}
                    onChange={e => setEditingVendor({ ...editingVendor, gstin: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={editingVendor.leadTimeDays}
                    onChange={e => setEditingVendor({ ...editingVendor, leadTimeDays: Number(e.target.value) })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDEBE9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVendorModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-bold"
                >
                  Save Vendor Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOURCE CARD MODAL */}
      {isResourceModalOpen && editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-2xl border border-[#EDEBE9] w-full max-w-lg animate-in fade-in duration-150">
            <div className="p-4 bg-[#002050] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#89BBE9]">Table 156 &quot;Resource Card&quot;</span>
                <h3 className="font-bold text-sm">Site Labour &amp; Trade Resource</h3>
              </div>
              <button
                onClick={() => setIsResourceModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Resource No.</label>
                  <input
                    type="text"
                    required
                    value={editingResource.resourceNo}
                    onChange={e => setEditingResource({ ...editingResource, resourceNo: e.target.value })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono font-bold text-[#0F6CBD]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Skill Level</label>
                  <select
                    value={editingResource.skillLevel}
                    onChange={e => setEditingResource({ ...editingResource, skillLevel: e.target.value as any })}
                    className="w-full p-2 border border-[#8A8886] rounded"
                  >
                    <option value="MASTER_CRAFTSMAN">Master Craftsman</option>
                    <option value="SKILLED_TRADESMAN">Skilled Tradesman</option>
                    <option value="SEMI_SKILLED">Semi Skilled</option>
                    <option value="GENERAL_HELPER">General Helper</option>
                    <option value="SITE_SUPERVISOR">Site Supervisor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Resource / Lead Name *</label>
                <input
                  type="text"
                  required
                  value={editingResource.name}
                  onChange={e => setEditingResource({ ...editingResource, name: e.target.value })}
                  placeholder="e.g. Ram Avtar Sharma (Master Carpenter)"
                  className="w-full p-2 border border-[#8A8886] rounded font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Daily Wage Rate (₹/8h) *</label>
                  <input
                    type="number"
                    required
                    value={editingResource.dailyWageRate}
                    onChange={e => {
                      const daily = Number(e.target.value);
                      setEditingResource({ 
                        ...editingResource, 
                        dailyWageRate: daily,
                        hourlyRate: Math.round((daily / 8) * 10) / 10
                      });
                    }}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono font-bold text-[#107C41]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={editingResource.hourlyRate}
                    onChange={e => setEditingResource({ ...editingResource, hourlyRate: Number(e.target.value) })}
                    className="w-full p-2 border border-[#8A8886] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#605E5C] mb-1">Standard Daily Output Benchmark</label>
                <input
                  type="text"
                  value={editingResource.standardDailyOutput}
                  onChange={e => setEditingResource({ ...editingResource, standardDailyOutput: e.target.value })}
                  placeholder="e.g. 75 sq.ft tile laying / day"
                  className="w-full p-2 border border-[#8A8886] rounded"
                />
              </div>

              <div className="pt-3 border-t border-[#EDEBE9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-bold"
                >
                  Save Resource Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
