import React, { useState, useMemo } from 'react';
import {
  Database,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Phone,
  Mail,
  Edit2,
  Trash2,
  RotateCcw,
  Tag,
  Hammer,
  DollarSign,
  UserCheck,
  Building,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { formatINR } from '../utils/currency';
import {
  MasterTabType,
  TradeCategoryMaster,
  MaterialMaster,
  SpaceZoneMaster,
  VendorMaster,
  MilestoneTemplateMaster,
  TeamMemberMaster,
  EngagementType,
} from '../types';

export const MasterDataView: React.FC = () => {
  const {
    masterData,
    addTradeMaster,
    updateTradeMaster,
    deleteTradeMaster,
    addMaterialMaster,
    updateMaterialMaster,
    deleteMaterialMaster,
    addSpaceZoneMaster,
    updateSpaceZoneMaster,
    deleteSpaceZoneMaster,
    addVendorMaster,
    updateVendorMaster,
    deleteVendorMaster,
    addMilestoneTemplateMaster,
    updateMilestoneTemplateMaster,
    deleteMilestoneTemplateMaster,
    addTeamMemberMaster,
    updateTeamMemberMaster,
    deleteTeamMemberMaster,
    resetMastersToDefault,
  } = useProject();

  const [activeTab, setActiveTab] = useState<MasterTabType>('trades');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states for Trade
  const [tradeCode, setTradeCode] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [tradeDesc, setTradeDesc] = useState('');
  const [tradeMargin, setTradeMargin] = useState<number>(15);
  const [tradeContingency, setTradeContingency] = useState<number>(5);
  const [tradeLeadDays, setTradeLeadDays] = useState<number>(14);

  // Form states for Material
  const [matCode, setMatCode] = useState('');
  const [matName, setMatName] = useState('');
  const [matCat, setMatCat] = useState('Flooring');
  const [matUnit, setMatUnit] = useState('sq.ft');
  const [matRate, setMatRate] = useState<number>(25);
  const [matEco, setMatEco] = useState('Low-VOC / FSC Certified');
  const [matSupplier, setMatSupplier] = useState('');
  const [matLeadDays, setMatLeadDays] = useState<number>(14);
  const [matSpecs, setMatSpecs] = useState('');

  // Form states for Space Zone
  const [zoneCode, setZoneCode] = useState('');
  const [zoneRoomName, setZoneRoomName] = useState('');
  const [zoneTypology, setZoneTypology] = useState<SpaceZoneMaster['spaceTypology']>('Residential');
  const [zoneArea, setZoneArea] = useState<number>(300);
  const [zoneBudgetPerSqFt, setZoneBudgetPerSqFt] = useState<number>(180);
  const [zoneFinishes, setZoneFinishes] = useState('');

  // Form states for Vendor
  const [vndCode, setVndCode] = useState('');
  const [vndCompanyName, setVndCompanyName] = useState('');
  const [vndTrade, setVndTrade] = useState('Carpentry & Millwork');
  const [vndContact, setVndContact] = useState('');
  const [vndPhone, setVndPhone] = useState('');
  const [vndEmail, setVndEmail] = useState('');
  const [vndRating, setVndRating] = useState<number>(4.8);
  const [vndCompliance, setVndCompliance] = useState<VendorMaster['complianceStatus']>('Verified & Insured');
  const [vndActiveSites, setVndActiveSites] = useState<number>(2);
  const [vndTerms, setVndTerms] = useState('30% Advance, 50% Site Delivery, 20% Post Snag');

  // Form states for Milestone Template
  const [tmplCode, setTmplCode] = useState('');
  const [tmplName, setTmplName] = useState('');
  const [tmplEngagement, setTmplEngagement] = useState<EngagementType>('Interior turnkey');
  const [tmplRetention, setTmplRetention] = useState<number>(5);
  const [tmplStages, setTmplStages] = useState<{ stageName: string; percentage: number; triggerCondition: string }[]>([
    { stageName: 'Mobilization & Procurement Advance', percentage: 10, triggerCondition: 'Contract Execution' },
    { stageName: 'MEP Rough-in & Wall Framing', percentage: 30, triggerCondition: 'Site Clearance' },
    { stageName: 'Joinery & Cabinet Installation', percentage: 35, triggerCondition: 'Drywall Closure' },
    { stageName: 'Final Finishes & Handover', percentage: 25, triggerCondition: 'Punchlist Rectification' },
  ]);

  // Form states for Team Member
  const [tmCode, setTmCode] = useState('');
  const [tmFullName, setTmFullName] = useState('');
  const [tmRole, setTmRole] = useState('Senior Project Architect');
  const [tmDept, setTmDept] = useState<TeamMemberMaster['department']>('Architecture');
  const [tmEmail, setTmEmail] = useState('');
  const [tmPhone, setTmPhone] = useState('');
  const [tmProjectsCount, setTmProjectsCount] = useState<number>(3);

  const resetForms = () => {
    setEditingItem(null);
    setTradeCode(`TRD-${Date.now().toString().slice(-4)}`);
    setTradeName('');
    setTradeDesc('');
    setTradeMargin(15);
    setTradeContingency(5);
    setTradeLeadDays(14);

    setMatCode(`MAT-${Date.now().toString().slice(-4)}`);
    setMatName('');
    setMatCat('Flooring');
    setMatUnit('sq.ft');
    setMatRate(25);
    setMatEco('Low-VOC / FSC Certified');
    setMatSupplier('');
    setMatLeadDays(14);
    setMatSpecs('');

    setZoneCode(`ZN-${Date.now().toString().slice(-4)}`);
    setZoneRoomName('');
    setZoneTypology('Residential');
    setZoneArea(300);
    setZoneBudgetPerSqFt(180);
    setZoneFinishes('Oak Flooring, Cove Lighting, Acoustic Wall');

    setVndCode(`VND-${Date.now().toString().slice(-4)}`);
    setVndCompanyName('');
    setVndTrade('Carpentry & Millwork');
    setVndContact('');
    setVndPhone('');
    setVndEmail('');
    setVndRating(4.8);
    setVndCompliance('Verified & Insured');
    setVndActiveSites(2);
    setVndTerms('30% Advance, 50% Site Delivery, 20% Post Snag');

    setTmplCode(`MS-${Date.now().toString().slice(-4)}`);
    setTmplName('');
    setTmplEngagement('Interior turnkey');
    setTmplRetention(5);
    setTmplStages([
      { stageName: 'Mobilization Advance', percentage: 10, triggerCondition: 'Contract Execution' },
      { stageName: 'Structural & MEP Framing', percentage: 35, triggerCondition: 'Inspection Clearance' },
      { stageName: 'Joinery & Surface Finishes', percentage: 35, triggerCondition: 'Cabinetry Assembly' },
      { stageName: 'Zero-Snag Client Handover', percentage: 20, triggerCondition: 'Joint Punchlist Clearance' },
    ]);

    setTmCode(`TM-${Date.now().toString().slice(-4)}`);
    setTmFullName('');
    setTmRole('Senior Project Architect');
    setTmDept('Architecture');
    setTmEmail('');
    setTmPhone('');
    setTmProjectsCount(3);
  };

  const handleOpenAddModal = () => {
    resetForms();
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'trades') {
      if (!tradeName) return;
      if (editingItem) {
        updateTradeMaster(editingItem.id, {
          code: tradeCode,
          name: tradeName,
          description: tradeDesc,
          defaultMarginPercent: tradeMargin,
          defaultContingencyPercent: tradeContingency,
          defaultLeadDays: tradeLeadDays,
        });
      } else {
        addTradeMaster({
          code: tradeCode || `TRD-${Date.now().toString().slice(-4)}`,
          name: tradeName,
          description: tradeDesc,
          defaultMarginPercent: tradeMargin,
          defaultContingencyPercent: tradeContingency,
          defaultLeadDays: tradeLeadDays,
          status: 'Active',
        });
      }
    } else if (activeTab === 'materials') {
      if (!matName) return;
      if (editingItem) {
        updateMaterialMaster(editingItem.id, {
          code: matCode,
          name: matName,
          category: matCat,
          unit: matUnit,
          standardRate: matRate,
          ecoRating: matEco,
          preferredSupplier: matSupplier,
          leadTimeDays: matLeadDays,
          specs: matSpecs,
        });
      } else {
        addMaterialMaster({
          code: matCode || `MAT-${Date.now().toString().slice(-4)}`,
          name: matName,
          category: matCat,
          unit: matUnit,
          standardRate: matRate,
          ecoRating: matEco,
          preferredSupplier: matSupplier,
          leadTimeDays: matLeadDays,
          specs: matSpecs,
          status: 'Active',
        });
      }
    } else if (activeTab === 'zones') {
      if (!zoneRoomName) return;
      const finishesList = zoneFinishes.split(',').map((f) => f.trim()).filter(Boolean);
      if (editingItem) {
        updateSpaceZoneMaster(editingItem.id, {
          code: zoneCode,
          roomName: zoneRoomName,
          spaceTypology: zoneTypology,
          typicalAreaSqFt: zoneArea,
          typicalBudgetPerSqFt: zoneBudgetPerSqFt,
          priorityFinishes: finishesList,
        });
      } else {
        addSpaceZoneMaster({
          code: zoneCode || `ZN-${Date.now().toString().slice(-4)}`,
          roomName: zoneRoomName,
          spaceTypology: zoneTypology,
          typicalAreaSqFt: zoneArea,
          typicalBudgetPerSqFt: zoneBudgetPerSqFt,
          priorityFinishes: finishesList,
          status: 'Active',
        });
      }
    } else if (activeTab === 'vendors') {
      if (!vndCompanyName) return;
      if (editingItem) {
        updateVendorMaster(editingItem.id, {
          code: vndCode,
          companyName: vndCompanyName,
          tradeCategory: vndTrade,
          contactPerson: vndContact,
          phone: vndPhone,
          email: vndEmail,
          rating: vndRating,
          complianceStatus: vndCompliance,
          activeSitesCount: vndActiveSites,
          paymentTerms: vndTerms,
        });
      } else {
        addVendorMaster({
          code: vndCode || `VND-${Date.now().toString().slice(-4)}`,
          companyName: vndCompanyName,
          tradeCategory: vndTrade,
          contactPerson: vndContact,
          phone: vndPhone,
          email: vndEmail,
          rating: vndRating,
          complianceStatus: vndCompliance,
          activeSitesCount: vndActiveSites,
          paymentTerms: vndTerms,
          status: 'Active',
        });
      }
    } else if (activeTab === 'milestones') {
      if (!tmplName) return;
      if (editingItem) {
        updateMilestoneTemplateMaster(editingItem.id, {
          code: tmplCode,
          templateName: tmplName,
          engagementType: tmplEngagement,
          retentionPercent: tmplRetention,
          stages: tmplStages,
        });
      } else {
        addMilestoneTemplateMaster({
          code: tmplCode || `MS-${Date.now().toString().slice(-4)}`,
          templateName: tmplName,
          engagementType: tmplEngagement,
          stages: tmplStages,
          retentionPercent: tmplRetention,
          status: 'Active',
        });
      }
    } else if (activeTab === 'team') {
      if (!tmFullName) return;
      if (editingItem) {
        updateTeamMemberMaster(editingItem.id, {
          code: tmCode,
          fullName: tmFullName,
          role: tmRole,
          department: tmDept,
          email: tmEmail,
          phone: tmPhone,
          activeProjectsCount: tmProjectsCount,
        });
      } else {
        addTeamMemberMaster({
          code: tmCode || `TM-${Date.now().toString().slice(-4)}`,
          fullName: tmFullName,
          role: tmRole,
          department: tmDept,
          email: tmEmail,
          phone: tmPhone,
          activeProjectsCount: tmProjectsCount,
          status: 'Active',
        });
      }
    }

    setIsModalOpen(false);
    resetForms();
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'trades') {
      setTradeCode(item.code);
      setTradeName(item.name);
      setTradeDesc(item.description);
      setTradeMargin(item.defaultMarginPercent);
      setTradeContingency(item.defaultContingencyPercent);
      setTradeLeadDays(item.defaultLeadDays);
    } else if (activeTab === 'materials') {
      setMatCode(item.code);
      setMatName(item.name);
      setMatCat(item.category);
      setMatUnit(item.unit);
      setMatRate(item.standardRate);
      setMatEco(item.ecoRating);
      setMatSupplier(item.preferredSupplier);
      setMatLeadDays(item.leadTimeDays);
      setMatSpecs(item.specs);
    } else if (activeTab === 'zones') {
      setZoneCode(item.code);
      setZoneRoomName(item.roomName);
      setZoneTypology(item.spaceTypology);
      setZoneArea(item.typicalAreaSqFt);
      setZoneBudgetPerSqFt(item.typicalBudgetPerSqFt);
      setZoneFinishes(item.priorityFinishes.join(', '));
    } else if (activeTab === 'vendors') {
      setVndCode(item.code);
      setVndCompanyName(item.companyName);
      setVndTrade(item.tradeCategory);
      setVndContact(item.contactPerson);
      setVndPhone(item.phone);
      setVndEmail(item.email);
      setVndRating(item.rating);
      setVndCompliance(item.complianceStatus);
      setVndActiveSites(item.activeSitesCount);
      setVndTerms(item.paymentTerms);
    } else if (activeTab === 'milestones') {
      setTmplCode(item.code);
      setTmplName(item.templateName);
      setTmplEngagement(item.engagementType);
      setTmplRetention(item.retentionPercent);
      setTmplStages(item.stages || []);
    } else if (activeTab === 'team') {
      setTmCode(item.code);
      setTmFullName(item.fullName);
      setTmRole(item.role);
      setTmDept(item.department);
      setTmEmail(item.email);
      setTmPhone(item.phone);
      setTmProjectsCount(item.activeProjectsCount);
    }
    setIsModalOpen(true);
  };

  // Master Items Counts
  const counts = {
    trades: masterData.trades.length,
    materials: masterData.materials.length,
    zones: masterData.zones.length,
    vendors: masterData.vendors.length,
    milestones: masterData.milestones.length,
    team: masterData.team.length,
  };

  const navTabs: { id: MasterTabType; label: string; count: number; icon: any }[] = [
    { id: 'trades', label: 'Trade & Work Categories', count: counts.trades, icon: Hammer },
    { id: 'materials', label: 'Material & Finishes Catalog', count: counts.materials, icon: Layers },
    { id: 'zones', label: 'Space Zones & Rooms', count: counts.zones, icon: Building },
    { id: 'vendors', label: 'Contractors & Suppliers', count: counts.vendors, icon: Shield },
    { id: 'milestones', label: 'Milestone Billing Templates', count: counts.milestones, icon: FileSpreadsheet },
    { id: 'team', label: 'Team & Staff Roles', count: counts.team, icon: UserCheck },
  ];

  // Filtering
  const filteredTrades = useMemo(() => {
    return masterData.trades.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.description.toLowerCase().includes(searchFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [masterData.trades, searchFilter, statusFilter]);

  const filteredMaterials = useMemo(() => {
    return masterData.materials.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.preferredSupplier.toLowerCase().includes(searchFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [masterData.materials, searchFilter, statusFilter]);

  const filteredZones = useMemo(() => {
    return masterData.zones.filter((z) => {
      const matchSearch =
        z.roomName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        z.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        z.spaceTypology.toLowerCase().includes(searchFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || z.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [masterData.zones, searchFilter, statusFilter]);

  const filteredVendors = useMemo(() => {
    return masterData.vendors.filter((v) => {
      const matchSearch =
        v.companyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.tradeCategory.toLowerCase().includes(searchFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [masterData.vendors, searchFilter, statusFilter]);

  const filteredMilestones = useMemo(() => {
    return masterData.milestones.filter((tmpl) => {
      const matchSearch =
        tmpl.templateName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        tmpl.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        tmpl.engagementType.toLowerCase().includes(searchFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || tmpl.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [masterData.milestones, searchFilter, statusFilter]);

  const filteredTeam = useMemo(() => {
    return masterData.team.filter((tm) => {
      const matchSearch =
        tm.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        tm.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        tm.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
        tm.department.toLowerCase().includes(searchFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || tm.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [masterData.team, searchFilter, statusFilter]);

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono">
              Enterprise Master Data
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Standards, Rates, Vendors, Spaces &amp; Team Roles
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Master Data Management Module
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Configure central master records used across all customer estimates, AI concept generations, BOQ line items, site assignments, and milestone payment schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all Master Data to system default standards?')) {
                resetMastersToDefault();
              }
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1.5"
            title="Reset master entities to architectural default standards"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New {activeTab === 'trades' ? 'Trade' : activeTab === 'materials' ? 'Material' : activeTab === 'zones' ? 'Space Zone' : activeTab === 'vendors' ? 'Contractor' : activeTab === 'milestones' ? 'Billing Template' : 'Team Member'}</span>
          </button>
        </div>
      </div>

      {/* Master Tabs Sub-Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-1 overflow-x-auto scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSearchFilter('');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-slate-400 font-medium">Status:</span>
          {(['All', 'Active', 'Inactive'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: TRADE CATEGORIES */}
      {activeTab === 'trades' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredTrades.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block font-bold">{t.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{t.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2.5 min-h-[36px] line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Margin</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{t.defaultMarginPercent}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Contingency</span>
                    <span className="text-xs font-mono font-bold text-amber-700">{t.defaultContingencyPercent}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Lead Time</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{t.defaultLeadDays}d</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    updateTradeMaster(t.id, {
                      status: t.status === 'Active' ? 'Inactive' : 'Active',
                    })
                  }
                  className="text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                >
                  Toggle {t.status === 'Active' ? 'Inactive' : 'Active'}
                </button>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditItem(t)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Edit trade parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete trade master ${t.name}?`)) deleteTradeMaster(t.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete trade"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: MATERIAL & FINISHES CATALOG */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Material Specification</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Unit</th>
                  <th className="py-3 px-4 text-right">Standard Rate</th>
                  <th className="py-3 px-4">Eco / Green Rating</th>
                  <th className="py-3 px-4">Preferred Supplier</th>
                  <th className="py-3 px-4 text-center">Lead Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{m.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-400 max-w-sm truncate">{m.specs}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">{m.unit}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatINR(m.standardRate)} / {m.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {m.ecoRating}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{m.preferredSupplier}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">{m.leadTimeDays} days</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => handleEditItem(m)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete material ${m.name}?`)) deleteMaterialMaster(m.id);
                          }}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* VIEW: SPACE ZONES & ROOMS */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredZones.map((z) => (
            <div key={z.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block font-bold">{z.code}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{z.roomName}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {z.spaceTypology}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Typical Allocation</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{z.typicalAreaSqFt} sq.ft</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Typical Fitout Rate</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{formatINR(z.typicalBudgetPerSqFt)} / sq.ft</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Priority Architectural Finishes Checklist
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {z.priorityFinishes.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400">Status: <strong>{z.status}</strong></span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditItem(z)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete zone ${z.roomName}?`)) deleteSpaceZoneMaster(z.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: CONTRACTORS & VENDORS */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredVendors.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block font-bold">{v.code}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{v.companyName}</h3>
                  <span className="text-xs text-indigo-700 font-semibold">{v.tradeCategory}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {v.complianceStatus}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">{v.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{v.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{v.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Quality Rating</span>
                  <span className="text-xs font-mono font-bold text-slate-900">⭐ {v.rating} / 5.0</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Active Sites</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{v.activeSitesCount} Projects</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <strong className="text-slate-700">Terms:</strong> {v.paymentTerms}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-slate-400">Status: <strong>{v.status}</strong></span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditItem(v)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete vendor ${v.companyName}?`)) deleteVendorMaster(v.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: MILESTONE BILLING TEMPLATES */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {filteredMilestones.map((tmpl) => (
            <div key={tmpl.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block font-bold">{tmpl.code}</span>
                  <h3 className="text-base font-bold text-slate-900">{tmpl.templateName}</h3>
                  <span className="text-xs text-slate-500">Pipeline Route: <strong>{tmpl.engagementType}</strong></span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg font-mono font-bold">
                    {tmpl.retentionPercent}% Retention Withheld
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEditItem(tmpl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete milestone template ${tmpl.templateName}?`)) deleteMilestoneTemplateMaster(tmpl.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stages list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {tmpl.stages.map((stg, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                        Stage {idx + 1}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-900">{stg.percentage}%</span>
                    </div>
                    <div className="font-bold text-slate-900 pt-1">{stg.stageName}</div>
                    <div className="text-[11px] text-slate-500">Trigger: {stg.triggerCondition}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: TEAM & STAFF ROLES */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTeam.map((tm) => (
            <div key={tm.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block font-bold">{tm.code}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{tm.fullName}</h3>
                  <span className="text-xs text-indigo-700 font-semibold">{tm.role}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {tm.department}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tm.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tm.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500">Active Workloads: <strong>{tm.activeProjectsCount} Projects</strong></span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditItem(tm)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete team member ${tm.fullName}?`)) deleteTeamMemberMaster(tm.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit' : 'Create New'} {activeTab === 'trades' ? 'Trade Category' : activeTab === 'materials' ? 'Material Specification' : activeTab === 'zones' ? 'Space Zone' : activeTab === 'vendors' ? 'Contractor / Supplier' : activeTab === 'milestones' ? 'Milestone Template' : 'Team Member'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {/* TRADE FORM */}
              {activeTab === 'trades' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Code</label>
                      <input
                        type="text"
                        required
                        value={tradeCode}
                        onChange={(e) => setTradeCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Trade Name</label>
                      <input
                        type="text"
                        required
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        placeholder="e.g. Joinery & Woodwork"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Description & Scope</label>
                    <textarea
                      rows={2}
                      value={tradeDesc}
                      onChange={(e) => setTradeDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Default Margin %</label>
                      <input
                        type="number"
                        value={tradeMargin}
                        onChange={(e) => setTradeMargin(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Contingency %</label>
                      <input
                        type="number"
                        value={tradeContingency}
                        onChange={(e) => setTradeContingency(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Lead Days</label>
                      <input
                        type="number"
                        value={tradeLeadDays}
                        onChange={(e) => setTradeLeadDays(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* MATERIAL FORM */}
              {activeTab === 'materials' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Material Code</label>
                      <input
                        type="text"
                        required
                        value={matCode}
                        onChange={(e) => setMatCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Material Name</label>
                      <input
                        type="text"
                        required
                        value={matName}
                        onChange={(e) => setMatName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                      <input
                        type="text"
                        value={matCat}
                        onChange={(e) => setMatCat(e.target.value)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Unit</label>
                      <input
                        type="text"
                        value={matUnit}
                        onChange={(e) => setMatUnit(e.target.value)}
                        placeholder="sq.ft, nos, r.ft"
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Standard Rate ($)</label>
                      <input
                        type="number"
                        value={matRate}
                        onChange={(e) => setMatRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Eco / Green Rating</label>
                      <input
                        type="text"
                        value={matEco}
                        onChange={(e) => setMatEco(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Supplier</label>
                      <input
                        type="text"
                        value={matSupplier}
                        onChange={(e) => setMatSupplier(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Technical Specs</label>
                    <textarea
                      rows={2}
                      value={matSpecs}
                      onChange={(e) => setMatSpecs(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {/* SPACE ZONE FORM */}
              {activeTab === 'zones' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Zone Code</label>
                      <input
                        type="text"
                        required
                        value={zoneCode}
                        onChange={(e) => setZoneCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Room / Zone Name</label>
                      <input
                        type="text"
                        required
                        value={zoneRoomName}
                        onChange={(e) => setZoneRoomName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Typology</label>
                      <select
                        value={zoneTypology}
                        onChange={(e) => setZoneTypology(e.target.value as any)}
                        className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Institutional">Institutional</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Area (sq.ft)</label>
                      <input
                        type="number"
                        value={zoneArea}
                        onChange={(e) => setZoneArea(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Budget / sq.ft ($)</label>
                      <input
                        type="number"
                        value={zoneBudgetPerSqFt}
                        onChange={(e) => setZoneBudgetPerSqFt(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Priority Finishes (comma separated)
                    </label>
                    <input
                      type="text"
                      value={zoneFinishes}
                      onChange={(e) => setZoneFinishes(e.target.value)}
                      placeholder="e.g. French Oak, Shadowline Plaster, Cove Light"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {/* VENDOR FORM */}
              {activeTab === 'vendors' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Code</label>
                      <input
                        type="text"
                        required
                        value={vndCode}
                        onChange={(e) => setVndCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        value={vndCompanyName}
                        onChange={(e) => setVndCompanyName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Trade Specialization</label>
                      <input
                        type="text"
                        value={vndTrade}
                        onChange={(e) => setVndTrade(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={vndContact}
                        onChange={(e) => setVndContact(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                      <input
                        type="text"
                        value={vndPhone}
                        onChange={(e) => setVndPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                      <input
                        type="email"
                        value={vndEmail}
                        onChange={(e) => setVndEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Compliance Status</label>
                      <select
                        value={vndCompliance}
                        onChange={(e) => setVndCompliance(e.target.value as any)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Verified & Insured">Verified &amp; Insured</option>
                        <option value="Pending Audit">Pending Audit</option>
                        <option value="Probationary">Probationary</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Rating (1 - 5)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vndRating}
                        onChange={(e) => setVndRating(parseFloat(e.target.value) || 4.5)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Commercial Payment Terms</label>
                    <input
                      type="text"
                      value={vndTerms}
                      onChange={(e) => setVndTerms(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {/* MILESTONE TEMPLATE FORM */}
              {activeTab === 'milestones' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Template Code</label>
                      <input
                        type="text"
                        required
                        value={tmplCode}
                        onChange={(e) => setTmplCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Template Name</label>
                      <input
                        type="text"
                        required
                        value={tmplName}
                        onChange={(e) => setTmplName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Pipeline Route</label>
                      <select
                        value={tmplEngagement}
                        onChange={(e) => setTmplEngagement(e.target.value as any)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Interior turnkey">Interior turnkey</option>
                        <option value="Architecture consultancy">Architecture consultancy</option>
                        <option value="Complete design-and-build">Complete design-and-build</option>
                        <option value="Interior design consultancy">Interior design consultancy</option>
                        <option value="Construction execution">Construction execution</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Retention % (Defect Liability)</label>
                      <input
                        type="number"
                        value={tmplRetention}
                        onChange={(e) => setTmplRetention(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Stage Gates (Total {tmplStages.reduce((a, b) => a + b.percentage, 0)}%)
                    </label>
                    <div className="space-y-2">
                      {tmplStages.map((stg, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={stg.stageName}
                            onChange={(e) => {
                              const updated = [...tmplStages];
                              updated[i].stageName = e.target.value;
                              setTmplStages(updated);
                            }}
                            className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                            placeholder="Stage Name"
                          />
                          <input
                            type="number"
                            value={stg.percentage}
                            onChange={(e) => {
                              const updated = [...tmplStages];
                              updated[i].percentage = parseFloat(e.target.value) || 0;
                              setTmplStages(updated);
                            }}
                            className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-center"
                            placeholder="%"
                          />
                          <button
                            type="button"
                            onClick={() => setTmplStages(tmplStages.filter((_, idx) => idx !== i))}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setTmplStages([
                            ...tmplStages,
                            { stageName: 'New Stage', percentage: 10, triggerCondition: 'Site Milestone' },
                          ])
                        }
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        + Add Stage Gate
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TEAM MEMBER FORM */}
              {activeTab === 'team' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Staff Code</label>
                      <input
                        type="text"
                        required
                        value={tmCode}
                        onChange={(e) => setTmCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={tmFullName}
                        onChange={(e) => setTmFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Role / Title</label>
                      <input
                        type="text"
                        value={tmRole}
                        onChange={(e) => setTmRole(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                      <select
                        value={tmDept}
                        onChange={(e) => setTmDept(e.target.value as any)}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Architecture">Architecture</option>
                        <option value="Interior Design">Interior Design</option>
                        <option value="Project Management">Project Management</option>
                        <option value="MEP Engineering">MEP Engineering</option>
                        <option value="Commercials & Estimation">Commercials &amp; Estimation</option>
                        <option value="Site Supervision">Site Supervision</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                      <input
                        type="email"
                        value={tmEmail}
                        onChange={(e) => setTmEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                      <input
                        type="text"
                        value={tmPhone}
                        onChange={(e) => setTmPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  {editingItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
