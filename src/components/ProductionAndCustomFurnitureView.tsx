/**
 * Build Storys ERP - Production & Custom Furniture Module (Module 6)
 * -----------------------------------------------------------------
 * Factory production engineering:
 * - CNC cutting lists with panel nesting & grain optimization
 * - Carcass specifications (18mm BWP Marine, 9mm back panel)
 * - Edge banding schedule (2mm PVC on shutters, 0.8mm internal)
 * - Hardware allocation (Blum, Hafele, Hettich)
 * - Assembly & installation instructions
 * Connected directly to Joinery Cases (FUR-WRD-001, FUR-BED-001, FUR-WRD-004)
 */

import React, { useState } from 'react';
import {
  Wrench,
  Download,
  Printer,
  CheckCircle2,
  Cpu,
  Package,
  Layers,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  FileText,
  Boxes
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';
import { SEED_FURNITURE_JOINERY_CASES } from '../data/technicalDrawingPackagesSeed';

interface Props {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

export const ProductionAndCustomFurnitureView: React.FC<Props> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string>('FUR-WRD-001');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCase = SEED_FURNITURE_JOINERY_CASES.find(c => c.furnitureId === selectedFurnitureId) || SEED_FURNITURE_JOINERY_CASES[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportGCode = () => {
    showToast(`Generated Homag / Biesse CNC G-Code for ${activeCase.itemCode}. Routing files ready.`);
  };

  const handleExportCutList = () => {
    showToast(`Exported Beam Saw Optimization Cutting List (.CSV) for ${activeCase.name}.`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#002050] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-blue-400/30 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                MODULE 6
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Production &amp; Custom Furniture Engineering
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded font-mono font-semibold border border-emerald-200">
                Factory CNC Ready
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#002050]" />
              Production &amp; Custom Furniture Hub
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl mt-0.5">
              Automated factory output: CNC panel cutting lists, 18mm BWP marine carcass joinery, edge-banding schedules,
              and millwork assembly instructions for precision off-site fabrication.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportGCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002050] hover:bg-[#003366] text-white text-xs font-semibold rounded shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-300" />
              <span>Export CNC G-Code</span>
            </button>
            <button
              onClick={handleExportCutList}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Cut List (.CSV)</span>
            </button>
            <button
              onClick={() => onNavigateTab?.('ai_drawings')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold rounded"
            >
              <span>View Technical CAD (Module 2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SEED_FURNITURE_JOINERY_CASES.map(fc => {
          const isSelected = selectedFurnitureId === fc.furnitureId;
          return (
            <button
              key={fc.furnitureId}
              onClick={() => setSelectedFurnitureId(fc.furnitureId)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-white border-[#002050] shadow-md ring-2 ring-[#002050]/20'
                  : 'bg-white/80 border-slate-300 hover:border-slate-400 hover:bg-white'
              }`}
            >
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                {fc.itemCode}
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{fc.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono">
                {fc.dimensionsMm.width}W × {fc.dimensionsMm.depth}D × {fc.dimensionsMm.height}H mm
              </p>
            </button>
          );
        })}
      </div>

      {/* Carcass Engineering & Materials Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Carcass Specification</span>
          <p className="text-xs font-bold text-slate-900">{activeCase.carcassSpecs.coreMaterial}</p>
          <p className="text-[11px] text-slate-600 mt-1">Balancing Laminate: {activeCase.carcassSpecs.innerLaminate}</p>
          <p className="text-[11px] text-slate-600">Back Panel: {activeCase.carcassSpecs.backPanel}</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Shutter &amp; Face Design</span>
          <p className="text-xs font-bold text-slate-900">{activeCase.shutterSpecs.material}</p>
          <p className="text-[11px] text-slate-600 mt-1">Mechanism: {activeCase.shutterSpecs.mechanism.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-slate-600">Track Hardware: {activeCase.shutterSpecs.hardware}</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Edge Banding Schedule</span>
          <p className="text-xs font-bold text-slate-900">{activeCase.carcassSpecs.edgeBanding}</p>
          <p className="text-[11px] text-slate-600 mt-1">Adhesive: PUR Waterproof Polyurethane Hot Melt</p>
          <p className="text-[11px] text-slate-600">Corner Radius: 2mm bevel buffed</p>
        </div>
      </div>

      {/* CNC Factory Cutting List Table */}
      <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>Factory CNC Panel Cutting List ({activeCase.cuttingListSummary.length} Panels)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Nesting Efficiency: 91.4% • Grain Direction: Lengthwise
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="p-2.5">Panel ID</th>
                <th className="p-2.5">Component / Part Name</th>
                <th className="p-2.5">Raw Material Core</th>
                <th className="p-2.5 text-right">Length (mm)</th>
                <th className="p-2.5 text-right">Width (mm)</th>
                <th className="p-2.5 text-right">Thickness</th>
                <th className="p-2.5 text-center">Quantity</th>
                <th className="p-2.5">Edge Banding Sides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {activeCase.cuttingListSummary.map(panel => (
                <tr key={panel.panelCode} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-blue-700">{panel.panelCode}</td>
                  <td className="p-2.5 font-sans font-medium text-slate-900">{panel.partName}</td>
                  <td className="p-2.5 text-slate-600">{panel.material}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900">{panel.lengthMm}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900">{panel.widthMm}</td>
                  <td className="p-2.5 text-right text-slate-600">{panel.thicknessMm} mm</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">{panel.qty}</td>
                  <td className="p-2.5 text-slate-700 font-sans">{panel.edgeBandingSides}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
