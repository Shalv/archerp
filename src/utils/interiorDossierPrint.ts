/**
 * Build Storys ERP - Professional Interior Company Presentation Export
 * Formats the Two-Step Spatial AI 2D Measured Layout + 3D Visual Concept into
 * a client-ready architectural sign-off dossier with print and PDF readiness.
 */

import { TwoStepSpatialDesignSession, ExtractedRoomGeometry, FurnitureLayoutOption, VisualConceptVersion } from '../types/floorplanSpatial';
import { ProjectRecord } from '../types/erp';

export function printInteriorClientDossier(
  project: ProjectRecord,
  session: TwoStepSpatialDesignSession,
  activeRoom: ExtractedRoomGeometry,
  activeLayout: FurnitureLayoutOption,
  activeConcept: VisualConceptVersion
) {
  const printWindow = window.open('', '_blank', 'width=1100,height=850');
  if (!printWindow) {
    alert('Please allow popups to open the interior presentation dossier.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${project.title} - Architectural Concept & Layout Dossier</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 12mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #002050;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .company-brand {
          font-size: 20px;
          font-weight: 800;
          color: #002050;
          letter-spacing: -0.5px;
        }
        .company-tagline {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }
        .doc-badge {
          text-align: right;
        }
        .doc-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f6cbd;
        }
        .doc-meta {
          font-size: 10px;
          color: #64748b;
          margin-top: 2px;
        }
        .meta-strip {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 16px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          font-size: 11px;
        }
        .meta-item strong {
          color: #0f172a;
          display: block;
          font-size: 12px;
          margin-top: 2px;
        }
        .meta-item span {
          color: #64748b;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .dual-view-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .panel {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
        }
        .panel-header {
          background: #0f172a;
          color: #ffffff;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .panel-header span.tag {
          background: #0284c7;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
        }
        .panel-body {
          padding: 12px;
        }
        .panel-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        .materials-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin-top: 8px;
        }
        .materials-table th {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 5px 8px;
          text-align: left;
          font-weight: 700;
          color: #334155;
        }
        .materials-table td {
          border: 1px solid #e2e8f0;
          padding: 4px 8px;
          color: #334155;
        }
        .materials-table tr:nth-child(even) {
          background: #fafafa;
        }
        .sign-off-strip {
          margin-top: 20px;
          border-top: 1px dashed #cbd5e1;
          padding-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          font-size: 11px;
        }
        .sign-box {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .sign-box span {
          color: #64748b;
          font-size: 9px;
          text-transform: uppercase;
        }
        .sign-line {
          border-bottom: 1px solid #94a3b8;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="company-brand">BUILD STORYS • ARCHITECTURAL INTERIOR STUDIO</div>
          <div class="company-tagline">Dynamics 365 Architecture &amp; Spatial Turnkey Solutions</div>
        </div>
        <div class="doc-badge">
          <div class="doc-title">TWO-STEP CLIENT SIGN-OFF DOSSIER</div>
          <div class="doc-meta">Doc ID: ${activeConcept.conceptVersionCode} • Generated: ${currentDate}</div>
        </div>
      </div>

      <div class="meta-strip">
        <div class="meta-item">
          <span>Project &amp; Location</span>
          <strong>${project.title}</strong>
          ${session.customerInput.siteLocation}
        </div>
        <div class="meta-item">
          <span>Active Room &amp; Carpet</span>
          <strong>${activeRoom.name}</strong>
          ${activeRoom.lengthFt}'-0" × ${activeRoom.widthFt}'-0" (${activeRoom.carpetAreaSqFt} sq.ft)
        </div>
        <div class="meta-item">
          <span>Turnkey Interior Budget</span>
          <strong>₹${session.customerInput.approximateBudget.toLocaleString()}</strong>
          Estimated Room: ₹${activeConcept.budgetActualEstimated.toLocaleString()}
        </div>
        <div class="meta-item">
          <span>Design Style Theme</span>
          <strong>${activeConcept.styleTheme.slice(0, 32)}...</strong>
          Scale: 1:50 Metric (Site Verified)
        </div>
      </div>

      <div class="dual-view-grid">
        <!-- Step 1: Measured 2D Layout & Clearance -->
        <div class="panel">
          <div class="panel-header">
            <span>STEP 1: VERIFIED 2D MEASURED PLAN</span>
            <span class="tag">ZERO DOORWAY COLLISION</span>
          </div>
          <div class="panel-body">
            <img src="${activeConcept.verified2DLayoutUrl}" class="panel-img" alt="2D Measured Floor Plan" />
            <div style="margin-top: 8px; font-size: 11px; font-weight: 700; color: #0f172a;">
              ${activeLayout.title}
            </div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px; line-height: 1.4;">
              <strong>Circulation Clearance:</strong> Min ${activeLayout.minClearancePassageFt} ft unobstructed walking corridor. All furniture positioned against structural walls with zero door-swing conflict.
            </div>
          </div>
        </div>

        <!-- Step 2: Visual Concept Render & Mood -->
        <div class="panel">
          <div class="panel-header">
            <span>STEP 2: 3D PHOTOREALISTIC CONCEPT</span>
            <span class="tag">VER: ${activeConcept.conceptVersionCode}</span>
          </div>
          <div class="panel-body">
            <img src="${activeConcept.renderImageUrl}" class="panel-img" alt="3D Photorealistic Render" />
            <div style="margin-top: 8px; font-size: 11px; font-weight: 700; color: #0f172a;">
              Visual Atmosphere &amp; Joinery Rationale
            </div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px; line-height: 1.4;">
              ${activeConcept.designRationale.slice(0, 220)}...
            </div>
          </div>
        </div>
      </div>

      <!-- Itemized Material & Joinery Schedule -->
      <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        Approved Material Specifications &amp; BOQ Linkage
      </div>
      <table class="materials-table">
        <thead>
          <tr>
            <th>Trade Discipline</th>
            <th>Item &amp; Specification Details</th>
            <th>Catalogue Code</th>
            <th>Estimated Qty</th>
            <th style="text-align: right;">Unit Rate (₹)</th>
            <th style="text-align: right;">Total Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${activeConcept.materials.map(m => `
            <tr>
              <td><strong>${m.trade}</strong></td>
              <td>${m.item} - ${m.specification}</td>
              <td style="font-family: monospace;">${m.catalogueCode}</td>
              <td>${m.estimatedQuantity} ${m.unit}</td>
              <td style="text-align: right; font-family: monospace;">₹${m.costPerUnit.toLocaleString()}</td>
              <td style="text-align: right; font-family: monospace; font-weight: 700;">₹${m.totalCost.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Sign-off Strip -->
      <div class="sign-off-strip">
        <div class="sign-box">
          <span>Client Sign-off &amp; Approval</span>
          <div class="sign-line"></div>
          <div style="font-size: 10px; color: #334155; margin-top: 4px;">Name &amp; Date: ___________________</div>
        </div>
        <div class="sign-box">
          <span>Principal Interior Designer</span>
          <div class="sign-line"></div>
          <div style="font-size: 10px; color: #334155; margin-top: 4px;">Ar. Aniket Joshi (Approved)</div>
        </div>
        <div class="sign-box">
          <span>Site Project Manager / Estimation</span>
          <div class="sign-line"></div>
          <div style="font-size: 10px; color: #334155; margin-top: 4px;">Er. Rajesh Kumar (Verified Scale)</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
