import React, { useState } from 'react';
import { Database, Download, Upload, Copy, Check, RotateCcw, X, AlertCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJSON, importDataJSON, resetToDefaultSeed, projects } = useProject();

  const [importText, setImportText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const data = exportDataJSON();
    navigator.clipboard.writeText(data).catch(()=>setImportError('Clipboard unavailable. Use Download instead.'));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const data = exportDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `archcrm-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError(null);
    if (!importText.trim()) {
      setImportError('Please paste valid JSON data.');
      return;
    }

    const success = importDataJSON(importText);
    if (success) {
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1500);
    } else {
      setImportError('Invalid JSON format or missing required CRM project fields.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Project Backup &amp; Portability</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          ArchCRM automatically saves all data to your browser&apos;s <strong>Local Storage</strong> on every edit. You can export complete project portfolios as JSON or restore previous snapshots.
        </p>

        {/* Export Section */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Export Portfolio ({projects.length} Customer Records)
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copySuccess ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download .json</span>
              </button>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-slate-800 block">
            Import Portfolio Snapshot
          </label>
          <textarea
            rows={4}
            placeholder="Paste your JSON backup data here..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          />

          {importError && (
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Snapshot successfully restored!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all customer projects to default showcase demonstration data?')) {
                  resetToDefaultSeed();
                  onClose();
                }
              }}
              className="text-slate-500 hover:text-slate-700 text-xs font-medium flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to Showcase Data</span>
            </button>

            <button
              type="button"
              onClick={handleImport}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Restore Snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
