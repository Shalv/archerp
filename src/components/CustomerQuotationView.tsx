import React from 'react';
import { 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  FileText,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { CustomerQuotation, UserSession, BOQItem } from '../types/erp';

interface CustomerQuotationViewProps {
  quotation: CustomerQuotation | null;
  items: BOQItem[];
  currentUser: UserSession;
  onPrint: () => void;
}

export const CustomerQuotationView: React.FC<CustomerQuotationViewProps> = ({
  quotation,
  items,
  currentUser,
  onPrint
}) => {
  if (!quotation) {
    return (
      <div className="rounded-xl border border-[#E5DFD7] bg-white p-12 text-center text-xs text-[#6B7280]">
        No quotation has been generated for this project yet. Please go to the <strong>Budget & Options</strong> tab and click <strong>&quot;Generate Customer Quotation&quot;</strong>.
      </div>
    );
  }

  // Group items by Room / Zone for client-friendly presentation
  const groupedByZone = items.reduce((acc, item) => {
    const zone = item.roomZone || 'General / Entire Residence';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(item);
    return acc;
  }, {} as Record<string, BOQItem[]>);

  return (
    <div className="space-y-6">
      {/* Top Action Header (Hidden during browser print) */}
      <div className="flex items-center justify-between rounded-xl border border-[#E5DFD7] bg-white p-4 shadow-xs print:hidden">
        <div>
          <span className="rounded bg-[#E8F3ED] px-2 py-0.5 text-xs font-semibold text-[#1C7346]">
            Customer Presentation Document
          </span>
          <h2 className="mt-1 font-serif text-lg font-bold text-[#1F2421]">
            Commercial Works Quotation: {quotation.quotationNumber}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 rounded-lg border border-[#D5CCC0] bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-[#3C362F] hover:bg-[#F0EBE2] transition"
          >
            <Printer className="h-4 w-4 text-[#A86F37]" />
            <span>Print Formal Document / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Formal Quotation Sheet */}
      <div className="rounded-xl border border-[#E0D7CB] bg-white p-8 shadow-sm print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto space-y-8 font-sans text-xs text-[#2A2F33]">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-[#273034] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#273034] text-[#E0A96D]">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1F2421]">
                BUILD STORYS
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Architecture • Interiors • Turnkey Construction
            </p>
            <p className="text-[11px] text-[#7A7165]">
              New Delhi • Gurugram • Mumbai • Bengaluru
            </p>
          </div>

          <div className="text-right">
            <div className="font-serif text-base font-bold text-[#1F2421]">
              TURNKEY WORKS QUOTATION
            </div>
            <div className="font-mono text-xs font-semibold text-[#A86F37] mt-0.5">
              Ref: {quotation.quotationNumber}
            </div>
            <div className="mt-1 text-[11px] text-[#6B7280]">
              Date: <strong>{quotation.quotationDate}</strong>
            </div>
            <div className="text-[11px] text-[#6B7280]">
              Validity: <strong>{quotation.validityDays} Days</strong> (Expires: {quotation.expiryDate})
            </div>
          </div>
        </div>

        {/* Client & Project Information Box */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#FAF8F5] p-4 border border-[#EDE7DF]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C8275]">Prepared For</div>
            <div className="mt-1 text-sm font-bold text-[#1F2421]">{quotation.customerName}</div>
            <div className="text-xs text-[#5D5549] mt-0.5">{quotation.siteAddress}</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C8275]">Project Reference</div>
            <div className="mt-1 text-sm font-bold text-[#1F2421]">{quotation.projectTitle}</div>
            <div className="text-xs text-[#A86F37] font-semibold mt-0.5">
              Package Tier: {quotation.selectedPackageTier}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="font-serif text-sm font-bold text-[#1F2421] border-b border-[#E8E2D9] pb-1">
            Executive Summary of Works
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#4F473E]">
            Build Storys is pleased to present this comprehensive design-and-build turnkey execution proposal for <strong>{quotation.projectTitle}</strong>. 
            This quotation covers verified civil modifications, elastomeric waterproofing, high-durability floor finishes, false ceilings, 
            premium modular kitchen joinery, master wardrobe carpentry, architectural lighting points, and luxury Asian Paints Royale wall finishes.
          </p>
        </div>

        {/* Itemized Room-by-Room Schedule (Note: STRICTLY HIDES contractor cost and margins!) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-1">
            <h3 className="font-serif text-sm font-bold text-[#1F2421]">
              Schedule of Rates & Deliverables (Room-by-Room)
            </h3>
            <span className="text-[11px] text-[#6B7280]">{items.length} Scope Deliverables</span>
          </div>

          {(Object.entries(groupedByZone) as [string, BOQItem[]][]).map(([zone, zoneItems]) => {
            const zoneTotal = zoneItems.reduce((acc, i) => acc + i.sellingAmount, 0);
            return (
              <div key={zone} className="border border-[#EAE3DA] rounded-lg overflow-hidden">
                <div className="bg-[#F7F4EE] px-3 py-2 flex items-center justify-between font-semibold text-xs text-[#1F2421]">
                  <span>{zone}</span>
                  <span className="font-mono">Subtotal: ₹{zoneTotal.toLocaleString('en-IN')}</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#EAE3DA] bg-white text-[#7A7165]">
                      <th className="p-2 w-8">#</th>
                      <th className="p-2">Item & Specification</th>
                      <th className="p-2">Brand / Grade</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Unit</th>
                      <th className="p-2 text-right">Rate (₹)</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EDE5]">
                    {zoneItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FAF9F7]">
                        <td className="p-2 text-[#9CA3AF] font-mono">{idx + 1}</td>
                        <td className="p-2">
                          <div className="font-medium text-[#1F2421]">{item.description}</div>
                          {item.inclusions && (
                            <div className="text-[10px] text-[#78716C]">Inc: {item.inclusions}</div>
                          )}
                        </td>
                        <td className="p-2 text-[#5A5246]">{item.brandGrade}</td>
                        <td className="p-2 text-right font-mono font-semibold">{item.finalQuantity}</td>
                        <td className="p-2 text-right text-[#78716C]">{item.unit}</td>
                        <td className="p-2 text-right font-mono text-[#5A5246]">₹{item.sellingRate.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right font-mono font-bold text-[#1F2421]">₹{item.sellingAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Commercial Financial Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80 rounded-lg border border-[#E0D7CB] bg-[#FAF8F5] p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#5D5549]">
              <span>Subtotal (Turnkey Works):</span>
              <span className="font-mono font-bold text-[#1F2421]">
                ₹{quotation.subtotalSellingAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5D5549]">
              <span>Composite Works GST ({quotation.gstPercent}%):</span>
              <span className="font-mono font-bold text-[#1F2421]">
                ₹{quotation.gstAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[#E0D7CB] pt-2 text-sm font-bold text-[#1F2421]">
              <span>Total Contract Value:</span>
              <span className="font-mono text-[#A86F37]">
                ₹{quotation.totalQuotationAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Milestones Schedule */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#1F2421] border-b border-[#E8E2D9] pb-1">
            Measurable Site Payment Milestones Schedule
          </h3>
          <table className="w-full text-left text-[11px] border border-[#EAE3DA] rounded-lg overflow-hidden">
            <thead className="bg-[#FAF8F5] text-[#7A7165]">
              <tr className="border-b border-[#EAE3DA]">
                <th className="p-2.5">Milestone Stage</th>
                <th className="p-2.5">Measurable Site Completion Trigger</th>
                <th className="p-2.5 text-center">% Share</th>
                <th className="p-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE5]">
              {quotation.milestoneSchedule.map(ms => (
                <tr key={ms.id}>
                  <td className="p-2.5 font-semibold text-[#1F2421]">{ms.milestoneName}</td>
                  <td className="p-2.5 text-[#5D5549]">{ms.stageTrigger}</td>
                  <td className="p-2.5 text-center font-mono font-bold">{ms.percentage}%</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#1F2421]">
                    ₹{ms.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg border border-[#EDE7DF] bg-[#FAF8F5] p-3.5">
            <div className="font-bold text-[#1E7348] mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Standard Inclusions</span>
            </div>
            <ul className="space-y-1 text-[#4F473E] text-[11px]">
              {quotation.inclusions.map((inc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="font-bold text-[#1E7348]">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[#EDE7DF] bg-[#FAF8F5] p-3.5">
            <div className="font-bold text-[#B02A37] mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              <span>Explicit Exclusions & Customer Obligations</span>
            </div>
            <ul className="space-y-1 text-[#4F473E] text-[11px]">
              {quotation.exclusions.map((exc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="font-bold text-[#B02A37]">•</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="rounded-lg border border-[#EDE7DF] bg-[#FAF8F5] p-3.5 text-[11px] text-[#554E45] space-y-1">
          <div className="font-bold text-[#1F2421] mb-1">Contractual Terms & Warranty Support</div>
          {quotation.termsAndConditions.map((term, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="font-bold">•</span>
              <span>{term}</span>
            </div>
          ))}
        </div>

        {/* Acceptance Sign-off Block */}
        <div className="grid grid-cols-2 gap-8 border-t border-[#273034] pt-8">
          <div>
            <div className="h-12 border-b border-dashed border-[#A89E90]"></div>
            <div className="mt-1 text-xs font-semibold text-[#1F2421]">Client Acceptance & Signature</div>
            <div className="text-[10px] text-[#7A7165]">I hereby accept the scope, specifications, and milestones.</div>
          </div>

          <div className="text-right">
            <div className="h-12 border-b border-dashed border-[#A89E90] flex items-end justify-end pb-1 font-serif italic text-xs text-[#A86F37]">
              Authorized Signatory
            </div>
            <div className="mt-1 text-xs font-semibold text-[#1F2421]">For Build Storys Turnkey Private Limited</div>
            <div className="text-[10px] text-[#7A7165]">Managing Director / Lead Quantity Surveyor</div>
          </div>
        </div>
      </div>
    </div>
  );
};
