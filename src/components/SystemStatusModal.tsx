import React, { useEffect, useState } from 'react';
import { ShieldCheck, Server, Database, Cloud, FileText, CheckCircle2, AlertCircle, X, HelpCircle } from 'lucide-react';
import { SystemCapabilityReport } from '../types/erp';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<SystemCapabilityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/system/status')
        .then(res => res.json())
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch status:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#E5DFD7] bg-[#FAF8F5] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#2C3437] p-2 text-white">
              <ShieldCheck className="h-5 w-5 text-[#E0A96D]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1F2421]">System Capabilities & Architectural Statement</h3>
              <p className="text-xs text-[#6B7280]">Build Storys ERP • Formal Operational Status Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#6B7280] hover:bg-[#EDE8E1] hover:text-[#1F2421]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#6B7280]">Loading capability parameters...</div>
        ) : report ? (
          <div className="mt-5 space-y-4">
            {/* Grid of Capabilities */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Code Execution */}
              <div className="rounded-lg border border-[#E2DBD1] bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-[#2E6B4E]" />
                    <span className="text-xs font-semibold text-[#1F2421]">Code Execution</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F4EE] px-2 py-0.5 text-[11px] font-medium text-[#1E7348]">
                    <CheckCircle2 className="h-3 w-3" /> Operational
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555C61]">{report.codeExecutionDetails}</p>
              </div>

              {/* File Creation */}
              <div className="rounded-lg border border-[#E2DBD1] bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2E6B4E]" />
                    <span className="text-xs font-semibold text-[#1F2421]">File Creation & Disk I/O</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F4EE] px-2 py-0.5 text-[11px] font-medium text-[#1E7348]">
                    <CheckCircle2 className="h-3 w-3" /> Operational
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555C61]">{report.fileCreationDetails}</p>
              </div>

              {/* Database */}
              <div className="rounded-lg border border-[#E2DBD1] bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-[#2E6B4E]" />
                    <span className="text-xs font-semibold text-[#1F2421]">Database & Persistence</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F4EE] px-2 py-0.5 text-[11px] font-medium text-[#1E7348]">
                    <CheckCircle2 className="h-3 w-3" /> Active Store
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555C61]">{report.databaseDetails}</p>
                <div className="mt-2 text-[11px] font-mono text-[#795548] bg-[#F7F3EE] p-1.5 rounded">
                  DDL Schema file: /schema.sql (PostgreSQL compliant)
                </div>
              </div>

              {/* Deployment */}
              <div className="rounded-lg border border-[#E2DBD1] bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-[#D97706]" />
                    <span className="text-xs font-semibold text-[#1F2421]">Cloud Production Deploy</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-medium text-[#92400E]">
                    <AlertCircle className="h-3 w-3" /> Container Dev
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555C61]">{report.cloudDeploymentDetails}</p>
              </div>
            </div>

            {/* Assumptions & Boundary Statement */}
            <div className="rounded-lg border border-[#E8DFC8] bg-[#FAF5EC] p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6228]">
                <HelpCircle className="h-4 w-4" />
                <span>Explicit Business Assumptions & Estimation Controls:</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-[#5D4E3A]">
                {(report.businessAssumptions || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#C48C46] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phasing Notice */}
            <div className="rounded-lg border border-[#D0DFE5] bg-[#F1F6F8] p-3 text-xs text-[#355361]">
              <span className="font-semibold">Implementation Phasing:</span> Phase 1 (CRM, Requirements, AI BOQ Takeoff, Deterministic Estimator Approval, 3-Tier Budgets & Quotation Export) is <strong>fully operational</strong>. Subsequent phases connect into the single unified data model and schema.
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-[#E8E2D9] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2C3437] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1A2022]"
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>
  );
};
