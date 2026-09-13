import React, { useEffect, useState } from 'react';
import { History, X, Clock, User, FileText } from 'lucide-react';
import { AuditLogEntry } from '../types/erp';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/audit-logs')
        .then(async res => {
          if (!res.ok) return [];
          return res.json();
        })
        .then(data => {
          setLogs(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load audit logs:', err);
          setLogs([]);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-[#E5DFD7] bg-[#FAF8F5] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#2C3437] p-2 text-white">
              <History className="h-5 w-5 text-[#E0A96D]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1F2421]">Enterprise Audit Trail</h3>
              <p className="text-xs text-[#6B7280]">Traceable immutable record of AI and user operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#6B7280] hover:bg-[#EDE8E1] hover:text-[#1F2421]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#6B7280]">Loading audit records...</div>
          ) : safeLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6B7280]">No audit logs recorded yet.</div>
          ) : (
            <div className="space-y-2.5">
              {safeLogs.map(log => (
                <div key={log.id} className="rounded-lg border border-[#E3DBD0] bg-white p-3.5 transition hover:border-[#D0C6B8]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#EFE9DF] px-2 py-0.5 text-[11px] font-semibold text-[#4A4036]">
                        {log.action}
                      </span>
                      <span className="text-xs font-medium text-[#1F2421]">{log.entityType}: {log.entityId}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#78716C]">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#524D46]">{log.details}</p>
                  <div className="mt-2 flex items-center gap-3 border-t border-[#F1ECE4] pt-2 text-[11px] text-[#8C847B]">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <strong>{log.userName}</strong> ({log.userRole})
                    </span>
                    <span className="font-mono text-[10px] text-[#A8A29E]">ID: {log.userId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end border-t border-[#E8E2D9] pt-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2C3437] px-4 py-2 text-xs font-medium text-white hover:bg-[#1A2022]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
