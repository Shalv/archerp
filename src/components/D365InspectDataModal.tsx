import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Database, 
  Layers, 
  Code, 
  Copy, 
  Check, 
  FileText, 
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ProjectRecord, BOQItem, CostBudgetSummary, UserSession } from '../types/erp';

interface D365InspectDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectRecord | null;
  selectedItem?: BOQItem | null;
  budgetSummary?: CostBudgetSummary | null;
  currentUser: UserSession;
  activeTab: string;
}

export const D365InspectDataModal: React.FC<D365InspectDataModalProps> = ({
  isOpen,
  onClose,
  project,
  selectedItem,
  budgetSummary,
  currentUser,
  activeTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Compile field list for inspection resembling Business Central
  const fields = [
    { no: 1, name: 'No.', type: 'Code[20]', value: project?.projectCode || '' },
    { no: 2, name: 'Description', type: 'Text[100]', value: project?.title || '' },
    { no: 3, name: 'Bill-to Customer No.', type: 'Code[20]', value: project?.clientPhone ? 'CUST-1044' : '' },
    { no: 4, name: 'Bill-to Name', type: 'Text[100]', value: project?.clientName || '' },
    { no: 5, name: 'Project Scope', type: 'Option', value: project?.projectScope || '' },
    { no: 6, name: 'Project Type', type: 'Option', value: project?.projectType || '' },
    { no: 7, name: 'Site City / Area Code', type: 'Code[10]', value: project?.city || '' },
    { no: 8, name: 'Active Revision ID', type: 'Code[30]', value: project?.activeRevisionId || '' },
    { no: 9, name: 'Person Responsible (PM)', type: 'Code[20]', value: 'USR-PM-01 (Vikramaditya Rao)' },
    { no: 10, name: 'Quantity Surveyor (QS)', type: 'Code[20]', value: 'USR-EST-01 (Rajesh Sharma)' },
    { no: 11, name: 'Job Posting Group', type: 'Code[20]', value: 'INTERIOR-RESIDENTIAL-TURNKEY' },
    { no: 12, name: 'Total Direct Cost (LCY)', type: 'Decimal', value: `₹${(budgetSummary?.totalDirectCost || 0).toLocaleString('en-IN')}` },
    { no: 13, name: 'Site Overheads %', type: 'Decimal', value: `${budgetSummary?.siteOverheadsPercent || 5.0}%` },
    { no: 14, name: 'Contingency %', type: 'Decimal', value: `${budgetSummary?.contingencyPercent || 3.0}%` },
    { no: 15, name: 'Total Project Cost (LCY)', type: 'Decimal', value: `₹${(budgetSummary?.totalProjectCost || 0).toLocaleString('en-IN')}` },
    { no: 16, name: 'Gross Margin %', type: 'Decimal', value: `${budgetSummary?.grossMarginPercent || 24.0}%` },
    { no: 17, name: 'Total Contract Value (LCY)', type: 'Decimal', value: `₹${(budgetSummary?.totalClientContractValue || 0).toLocaleString('en-IN')}` },
    { no: 18, name: 'Carpet Area SqFt', type: 'Decimal', value: project?.requirement?.carpetAreaSqFt || 1650 },
    { no: 19, name: 'Selected Line Item Code', type: 'Code[20]', value: selectedItem?.itemCode || 'N/A' },
    { no: 20, name: 'Selected Line Formula', type: 'Text[250]', value: selectedItem?.quantityFormula || 'N/A' },
    { no: 21, name: 'Selected Line Rate Source', type: 'Option', value: selectedItem?.rateSource || 'N/A' },
    { no: 22, name: 'Current User Role', type: 'Option', value: currentUser?.role || 'N/A' },
    { no: 23, name: 'Extension ID', type: 'Guid', value: '426eda71-ed2b-4ed3-b5bb-91f3a6b20ab8' }
  ];

  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(f.value).toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs">
      <div className="w-full max-w-md bg-white border-l border-[#EDEBE9] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#002050] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#0F6CBD]">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide">Page Inspection</div>
              <div className="text-[10px] text-[#C7E0F4]">BuildStorys ERP</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#C7E0F4] hover:text-white rounded hover:bg-[#001833] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Page / Table Summary Info */}
        <div className="bg-[#F3F2F1] border-b border-[#E1DFDD] p-3 text-xs space-y-1.5">
          <div className="flex justify-between items-center text-[#201F1E]">
            <span className="font-semibold text-[13px]">Page 88 &quot;Job Card&quot;</span>
            <span className="text-[10px] font-mono bg-white border border-[#D2D0CE] px-1.5 py-0.5 rounded text-[#605E5C]">
              Document
            </span>
          </div>
          <div className="text-[11px] text-[#605E5C]">
            Source Table: <span className="font-semibold text-[#201F1E]">Table 167 &quot;Job&quot;</span> • Line Table: <span className="font-semibold text-[#201F1E]">Table 1003</span>
          </div>
          <div className="text-[11px] text-[#605E5C]">
            Extension: <span className="text-[#0F6CBD] font-medium">BuildStorys.TurnkeyERP v1.4.0</span> (Published by Build Storys Ltd)
          </div>
          <div className="text-[11px] text-[#605E5C]">
            Active Tab / FastTab: <span className="font-semibold text-[#201F1E]">{activeTab}</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-[#E1DFDD] bg-white">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#605E5C]" />
            <input
              type="text"
              placeholder="Filter fields or values..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded border border-[#8A8886] bg-white pl-8 pr-3 py-1.5 text-xs text-[#201F1E] focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-hidden"
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-[#605E5C]">
            <span>Showing {filteredFields.length} of {fields.length} table fields</span>
            <span className="font-mono text-[10px]">Ctrl+Alt+F1</span>
          </div>
        </div>

        {/* Fields list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EDEBE9]">
          {filteredFields.map(field => (
            <div 
              key={field.no}
              className="p-3 hover:bg-[#F3F2F1] transition group text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-[#8A8886] bg-[#FAF9F8] px-1 rounded border border-[#EDEBE9]">
                    #{field.no}
                  </span>
                  <span className="font-semibold text-[#201F1E]">{field.name}</span>
                </div>
                <span className="font-mono text-[10px] text-[#0F6CBD] bg-[#EFF6FC] px-1.5 py-0.5 rounded">
                  {field.type}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="font-mono text-[#323130] break-all max-w-[280px]">
                  {String(field.value) || <span className="italic text-[#A19F9D]">&lt;Blank&gt;</span>}
                </span>
                <button
                  onClick={() => copyValue(String(field.value), String(field.no))}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#605E5C] hover:text-[#0F6CBD] transition rounded hover:bg-white"
                  title="Copy value"
                >
                  {copiedKey === String(field.no) ? (
                    <Check className="h-3.5 w-3.5 text-[#107C41]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="bg-[#FAF9F8] border-t border-[#E1DFDD] p-3 text-[11px] text-[#605E5C] flex items-center justify-between">
          <span>BuildStorys ERP Core Runtime</span>
          <button 
            onClick={onClose}
            className="px-3 py-1 bg-white border border-[#8A8886] text-[#201F1E] rounded hover:bg-[#F3F2F1] transition font-medium text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
