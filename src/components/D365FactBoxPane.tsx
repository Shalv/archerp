import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FileText, 
  Paperclip, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Building,
  Ruler,
  FileCheck
} from 'lucide-react';
import { ProjectRecord, BOQItem, CostBudgetSummary, UserSession } from '../types/erp';

interface D365FactBoxPaneProps {
  isOpen: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  project: ProjectRecord | null;
  selectedItem: BOQItem | null;
  budgetSummary: CostBudgetSummary | null;
  currentUser: UserSession;
  onInspectField?: () => void;
}

export const D365FactBoxPane: React.FC<D365FactBoxPaneProps> = ({
  isOpen,
  onToggle,
  onClose,
  project,
  selectedItem,
  budgetSummary,
  currentUser,
  onInspectField
}) => {
  const handleToggle = onToggle || onClose || (() => {});
  const [jobStatsOpen, setJobStatsOpen] = useState(true);
  const [lineDetailsOpen, setLineDetailsOpen] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-1.5 bg-[#F3F2F1] border-l border-[#E1DFDD] w-10 shrink-0 shadow-[inset_1px_0_3px_rgba(0,0,0,0.02)]">
        <button
          onClick={handleToggle}
          className="p-1.5 text-[#0F6CBD] hover:bg-white rounded transition shadow-2xs hover:shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          title="Show FactBox Pane (Alt+F2)"
        >
          <Info className="h-4 w-4" />
        </button>
        <div 
          onClick={handleToggle}
          className="mt-6 text-[11px] font-semibold text-[#605E5C] tracking-wider uppercase cursor-pointer select-none hover:text-[#0F6CBD] transition"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          FactBox Details
        </div>
      </div>
    );
  }

  const isClient = currentUser?.role === 'CLIENT';
  const activeRev = project?.revisions.find(r => r.id === project?.activeRevisionId) || project?.revisions[0];

  return (
    <aside className="erp-factbox w-80 shrink-0 bg-[#FAF9F8] border-l border-[#E1DFDD] flex flex-col h-full overflow-y-auto divide-y divide-[#EDEBE9] shadow-[-3px_0_12px_rgba(0,0,0,0.03)]">
      {/* FactBox Title Bar */}
      <div className="bg-[#F3F2F1] px-3 py-2 flex items-center justify-between border-b border-[#E1DFDD] sticky top-0 z-10">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#201F1E]">
          <Info className="h-4 w-4 text-[#0F6CBD]" />
          <span>Details &amp; FactBoxes</span>
        </div>
        <button
          onClick={handleToggle}
          className="text-xs text-[#605E5C] hover:text-[#201F1E] px-1.5 py-0.5 rounded hover:bg-white transition"
          title="Collapse FactBox Pane"
        >
          Hide
        </button>
      </div>

      {/* 1. Job Details FactBox */}
      <div className="bg-white">
        <button
          onClick={() => setJobStatsOpen(!jobStatsOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#201F1E] bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <span className="flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-[#0F6CBD]" />
            <span>Job Statistics</span>
          </span>
          {jobStatsOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#605E5C]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#605E5C]" />}
        </button>

        {jobStatsOpen && (
          <div className="p-3 text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#605E5C]">Job No.:</span>
              <span className="font-semibold text-[#201F1E] font-mono">{project?.projectCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#605E5C]">Customer:</span>
              <span className="font-medium text-[#201F1E] text-right truncate max-w-[160px]">{project?.clientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#605E5C]">Baseline Rev:</span>
              <span className="bg-[#EFF6FC] text-[#0F6CBD] font-semibold px-1.5 py-0.5 rounded text-[11px]">
                {activeRev?.revisionLabel || 'Rev 1'}
              </span>
            </div>

            {!isClient && (
              <>
                <div className="pt-2 border-t border-[#EDEBE9] flex justify-between items-center">
                  <span className="text-[#605E5C]">Total Direct Cost:</span>
                  <span className="font-semibold text-[#201F1E]">
                    ₹{(budgetSummary?.totalDirectCost || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#605E5C]">Total Project Cost:</span>
                  <span className="font-semibold text-[#201F1E]">
                    ₹{(budgetSummary?.totalProjectCost || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#605E5C]">Gross Profit:</span>
                  <span className="font-semibold text-[#107C41]">
                    ₹{(budgetSummary?.grossMarginAmount || 0).toLocaleString('en-IN')} ({budgetSummary?.grossMarginPercent || 24}%)
                  </span>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-[#EDEBE9] flex justify-between items-center bg-[#F3F2F1] p-2 rounded">
              <span className="font-semibold text-[#201F1E]">Total Contract Value:</span>
              <span className="font-bold text-[#0F6CBD] text-sm">
                ₹{(budgetSummary?.totalClientContractValue || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Selected Line Item Details FactBox */}
      <div className="bg-white">
        <button
          onClick={() => setLineDetailsOpen(!lineDetailsOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#201F1E] bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <span className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5 text-[#107C41]" />
            <span>Line Item Details</span>
          </span>
          {lineDetailsOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#605E5C]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#605E5C]" />}
        </button>

        {lineDetailsOpen && (
          <div className="p-3 text-xs space-y-2.5">
            {selectedItem ? (
              <>
                <div>
                  <div className="text-[10px] font-mono text-[#0F6CBD] font-semibold">{selectedItem.itemCode}</div>
                  <div className="font-semibold text-[#201F1E] text-[13px] mt-0.5">{selectedItem.description}</div>
                  <div className="text-[11px] text-[#605E5C] mt-0.5">
                    {selectedItem.trade.replace(/_/g, ' ')} • {selectedItem.roomZone}
                  </div>
                </div>

                <div className="p-2 bg-[#F3F2F1] rounded space-y-1">
                  <div className="text-[11px] text-[#605E5C]">Formula Derivation:</div>
                  <div className="font-mono text-xs font-bold text-[#201F1E] bg-white p-1 rounded border border-[#EDEBE9]">
                    {selectedItem.quantityFormula || 'N/A'}
                  </div>
                  <div className="flex justify-between text-[11px] text-[#605E5C] pt-1">
                    <span>Base: {selectedItem.baseQuantity} {selectedItem.unit}</span>
                    <span>Waste: +{selectedItem.wastagePercent}%</span>
                    <span className="font-bold text-[#201F1E]">Billable: {selectedItem.finalQuantity}</span>
                  </div>
                </div>

                {!isClient && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#EDEBE9]">
                    <div className="bg-[#FAF9F8] p-1.5 rounded border border-[#EDEBE9]">
                      <span className="text-[#605E5C] block">Direct Unit Cost:</span>
                      <span className="font-semibold text-[#201F1E]">₹{selectedItem.unitCost.toLocaleString('en-IN')}/{selectedItem.unit}</span>
                    </div>
                    <div className="bg-[#EFF6FC] p-1.5 rounded border border-[#C7E0F4]">
                      <span className="text-[#0F6CBD] block">Selling Price:</span>
                      <span className="font-semibold text-[#0F6CBD]">₹{selectedItem.sellingRate.toLocaleString('en-IN')}/{selectedItem.unit}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1 pt-1 border-t border-[#EDEBE9]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#605E5C]">Drawing Ref:</span>
                    <span className="font-mono text-[#201F1E] text-right truncate max-w-[170px]" title={selectedItem.sourceDocumentRef}>
                      {selectedItem.sourceDocumentRef || 'Architectural Floor Plan Rev B'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#605E5C]">Rate Source:</span>
                    <span className="font-mono text-[#0F6CBD]">{selectedItem.rateSource || 'APPROVED_MASTER'}</span>
                  </div>
                </div>

                {selectedItem.assumptions && (
                  <div className="p-2 bg-[#FFF4CE] text-[#797673] rounded border border-[#FDE3A7] text-[11px]">
                    <span className="font-semibold text-[#201F1E] block">QS Assumptions:</span>
                    {selectedItem.assumptions}
                  </div>
                )}

                {selectedItem.uncertaintyFlags && (
                  <div className="p-2 bg-[#FDE7E9] text-[#A80000] rounded border border-[#F9C6CA] text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{selectedItem.uncertaintyFlags}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center text-[#605E5C] text-xs">
                <FileText className="h-6 w-6 text-[#A19F9D] mx-auto mb-1.5" />
                Select any row in the Job Planning Lines grid to inspect formulas and drawing sources.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Microsoft Copilot / AI Insights FactBox */}
      <div className="bg-white">
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#201F1E] bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#0F6CBD]" />
            <span>Copilot Takeoff Insights</span>
          </span>
          {copilotOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#605E5C]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#605E5C]" />}
        </button>

        {copilotOpen && (
          <div className="p-3 text-xs space-y-2">
            <div className="flex items-center gap-1.5 bg-[#EFF6FC] border border-[#C7E0F4] p-2 rounded">
              <Sparkles className="h-4 w-4 text-[#0F6CBD] shrink-0" />
              <div>
                <div className="font-semibold text-[#0F6CBD] text-[11px]">Gemini 3.8 Flash AI Model</div>
                <div className="text-[10px] text-[#605E5C]">Turnkey Estimator Co-Pilot Grounded</div>
              </div>
            </div>

            <div className="text-[11px] text-[#323130] leading-relaxed">
              <span className="font-semibold text-[#201F1E]">Multilingual brief analyzed:</span> Parsed Hinglish specifications including <em>&quot;Italian marble lagana hai&quot;</em> and <em>&quot;L-shaped modular kitchen with soft-close Blum hardware&quot;</em>.
            </div>

            <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9] text-[11px] space-y-1">
              <div className="flex justify-between text-[#605E5C]">
                <span>AI Confidence:</span>
                <span className="font-bold text-[#107C41]">98.4%</span>
              </div>
              <div className="flex justify-between text-[#605E5C]">
                <span>Wastage Audit:</span>
                <span className="text-[#201F1E]">IS 1200 Compliant</span>
              </div>
              <div className="flex justify-between text-[#605E5C]">
                <span>NCR Benchmark:</span>
                <span className="text-[#201F1E]">Gurugram Q3-2026</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Attachments & Drawings FactBox */}
      <div className="bg-white">
        <button
          onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#201F1E] bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <span className="flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5 text-[#605E5C]" />
            <span>Attachments &amp; CAD Links (3)</span>
          </span>
          {attachmentsOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#605E5C]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#605E5C]" />}
        </button>

        {attachmentsOpen && (
          <div className="p-3 text-xs space-y-2">
            <div className="flex items-center justify-between p-2 rounded hover:bg-[#F3F2F1] border border-[#EDEBE9] transition cursor-pointer">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0F6CBD]" />
                <div>
                  <div className="font-medium text-[#201F1E] text-[11px]">Skyline_1402_FloorPlan_RevB.pdf</div>
                  <div className="text-[10px] text-[#605E5C]">Architectural Plan • 4.2 MB</div>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#8A8886]" />
            </div>

            <div className="flex items-center justify-between p-2 rounded hover:bg-[#F3F2F1] border border-[#EDEBE9] transition cursor-pointer">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#107C41]" />
                <div>
                  <div className="font-medium text-[#201F1E] text-[11px]">Civil_Demolition_Survey.pdf</div>
                  <div className="text-[10px] text-[#605E5C]">Site Survey Notes • 1.8 MB</div>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#8A8886]" />
            </div>

            <div className="flex items-center justify-between p-2 rounded hover:bg-[#F3F2F1] border border-[#EDEBE9] transition cursor-pointer">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#B87A38]" />
                <div>
                  <div className="font-medium text-[#201F1E] text-[11px]">Kitchen_Hardware_Schedule.xlsx</div>
                  <div className="text-[10px] text-[#605E5C]">Blum Specification • 850 KB</div>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#8A8886]" />
            </div>
          </div>
        )}
      </div>

      {/* 5. Record System Info FactBox */}
      <div className="bg-white">
        <button
          onClick={() => setAuditInfoOpen(!auditInfoOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#201F1E] bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#605E5C]" />
            <span>Record Information</span>
          </span>
          {auditInfoOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#605E5C]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#605E5C]" />}
        </button>

        {auditInfoOpen && (
          <div className="p-3 text-[11px] space-y-1.5 text-[#605E5C] bg-[#FAF9F8]">
            <div className="flex justify-between">
              <span>Table ID:</span>
              <span className="font-mono text-[#201F1E]">1003 (Job Planning Line)</span>
            </div>
            <div className="flex justify-between">
              <span>Created By:</span>
              <span className="text-[#201F1E]">USR-EST-01 (Rajesh Sharma)</span>
            </div>
            <div className="flex justify-between">
              <span>Created DateTime:</span>
              <span className="text-[#201F1E]">11-09-2026 10:15 AM</span>
            </div>
            <div className="flex justify-between">
              <span>System Row ID:</span>
              <span className="font-mono text-[#0F6CBD] text-[10px]">GUID &#123;426eda71&#125;</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
