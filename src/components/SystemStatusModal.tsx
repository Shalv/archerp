import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  HelpCircle,
  RefreshCw,
  Layers
} from 'lucide-react';
import { SystemCapabilityReport } from '../types/erp';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<SystemCapabilityReport | null>(null);
  const [loading, setLoading] = useState(true);

  // MongoDB states
  const [isTestingMongo, setIsTestingMongo] = useState(false);
  const [isSyncingMongo, setIsSyncingMongo] = useState(false);
  const [mongoTestResult, setMongoTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [mongoSyncResult, setMongoSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStatus = () => {
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
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleTestMongoDB = async () => {
    setIsTestingMongo(true);
    setMongoTestResult(null);
    try {
      const res = await fetch('/api/system/mongodb/test', { method: 'POST' });
      const data = await res.json();
      setMongoTestResult({
        success: data.connected,
        message: data.message || (data.connected ? 'MongoDB Atlas connection active!' : 'Connection attempt failed.')
      });
      fetchStatus();
    } catch (err: any) {
      setMongoTestResult({
        success: false,
        message: err.message || 'Network request failed'
      });
    } finally {
      setIsTestingMongo(false);
    }
  };

  const handleSyncToMongoDB = async () => {
    setIsSyncingMongo(true);
    setMongoSyncResult(null);
    try {
      const res = await fetch('/api/system/mongodb/sync', { method: 'POST' });
      const data = await res.json();
      setMongoSyncResult({
        success: data.success,
        message: data.message || 'MongoDB Atlas sync complete.'
      });
      fetchStatus();
    } catch (err: any) {
      setMongoSyncResult({
        success: false,
        message: err.message || 'Sync failed.'
      });
    } finally {
      setIsSyncingMongo(false);
    }
  };

  if (!isOpen) return null;

  const mongo = report?.mongoDB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#E5DFD7] bg-[#FAF8F5] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-[#2C3437] p-2 text-white">
              <ShieldCheck className="h-5 w-5 text-[#E0A96D]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1F2421]">System Capabilities & Database Diagnostics</h3>
              <p className="text-xs text-[#6B7280]">Build Storys ERP • MongoDB Atlas Exclusive Cloud Database</p>
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
            
            {/* MongoDB Atlas Primary Card */}
            <div className="rounded-xl border border-[#00ED64]/40 bg-white p-4.5 shadow-xs ring-1 ring-[#00ED64]/10">
              <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#001E2B] text-[#00ED64] font-bold text-sm">
                    🍃
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#001E2B] flex items-center gap-1.5">
                      MongoDB Atlas Cloud Database
                      <span className="text-[11px] font-normal text-[#5C768D]">(Cluster0 • AWS)</span>
                    </h4>
                    <p className="text-xs text-[#5C768D]">
                      User: <code className="font-mono font-semibold text-[#001E2B]">coreenactsolutions_db_user</code> • Database: <code className="font-mono font-semibold text-[#001E2B]">{mongo?.database || 'buildstorys_erp'}</code>
                    </p>
                  </div>
                </div>

                {mongo?.connected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F8F0] px-3 py-1 text-xs font-semibold text-[#00684A] border border-[#00ED64]/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00ED64]" /> Connected Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#92400E]">
                    <AlertCircle className="h-3.5 w-3.5" /> Testing Connection
                  </span>
                )}
              </div>

              {/* Status Message */}
              <div className="mt-3 text-xs leading-relaxed text-[#334155]">
                {mongo?.message || 'MongoDB Atlas credentials provided and client initialized.'}
              </div>

              {!mongo?.connected && (
                <div className="mt-3 rounded-lg border border-[#FDE68A] bg-[#FEFDF7] p-3 text-xs text-[#78350F] space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-[#92400E]">
                    <span>Atlas Whitelist Required (1-Minute Fix):</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed text-[#92400E]">
                    <li>Open <strong>cloud.mongodb.com</strong> &gt; <strong>Network Access</strong> (under Security).</li>
                    <li>Click <strong>Add IP Address</strong> &gt; select <strong>Allow Access from Anywhere (0.0.0.0/0)</strong>.</li>
                    <li>Click <strong>Confirm</strong>. Wait ~30 seconds and click <strong>Ping MongoDB Atlas</strong> below!</li>
                  </ol>
                </div>
              )}

              {/* Cluster & Collections Details */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-[#F7FDF9] p-2.5 text-[11px] border border-[#D5EEDB]">
                <div>
                  <span className="text-[#5C768D] block">Cluster:</span>
                  <span className="font-mono font-medium text-[#001E2B] truncate block" title={mongo?.cluster}>{mongo?.cluster || 'cluster0.cabxpys.mongodb.net'}</span>
                </div>
                <div>
                  <span className="text-[#5C768D] block">Database:</span>
                  <span className="font-mono font-medium text-[#001E2B]">{mongo?.database || 'buildstorys_erp'}</span>
                </div>
                <div>
                  <span className="text-[#5C768D] block">Collections:</span>
                  <span className="font-mono font-medium text-[#001E2B]">{mongo?.collectionsCount ?? 0} active</span>
                </div>
                <div>
                  <span className="text-[#5C768D] block">Persistence Sync:</span>
                  <span className="font-mono font-medium text-[#00684A]">Automatic & Real-time</span>
                </div>
              </div>

              {/* MongoDB test and sync result banners */}
              {mongoTestResult && (
                <div className={`mt-3 rounded-lg p-2.5 text-xs flex items-start gap-2 ${mongoTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                  {mongoTestResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />}
                  <span>{mongoTestResult.message}</span>
                </div>
              )}

              {mongoSyncResult && (
                <div className={`mt-3 rounded-lg p-2.5 text-xs flex items-start gap-2 ${mongoSyncResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {mongoSyncResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />}
                  <span>{mongoSyncResult.message}</span>
                </div>
              )}

              {/* Action Buttons for MongoDB */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0ECE6]">
                <button
                  type="button"
                  onClick={handleTestMongoDB}
                  disabled={isTestingMongo}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#001E2B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#00344a] disabled:opacity-50 transition cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isTestingMongo ? 'animate-spin' : ''}`} />
                  {isTestingMongo ? 'Testing MongoDB...' : 'Ping MongoDB Atlas'}
                </button>

                <button
                  type="button"
                  onClick={handleSyncToMongoDB}
                  disabled={isSyncingMongo}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#00684A] bg-[#E7F8F0] px-3.5 py-1.5 text-xs font-semibold text-[#00684A] hover:bg-[#d0f3e2] disabled:opacity-50 transition cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5" />
                  {isSyncingMongo ? 'Syncing...' : 'Sync Full ERP Data to MongoDB'}
                </button>

                <div className="ml-auto text-[11px] text-[#5C768D]">
                  Every project save automatically syncs to MongoDB
                </div>
              </div>
            </div>

            {/* Grid of Other Capabilities */}
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

              {/* File Creation & Local Cache */}
              <div className="rounded-lg border border-[#E2DBD1] bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2E6B4E]" />
                    <span className="text-xs font-semibold text-[#1F2421]">Local Storage Engine</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F4EE] px-2 py-0.5 text-[11px] font-medium text-[#1E7348]">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555C61]">{report.fileCreationDetails}</p>
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
          </div>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-[#E8E2D9] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2C3437] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1A2022] cursor-pointer"
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>
  );
};
