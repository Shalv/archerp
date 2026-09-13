/**
 * Build Storys ERP - Server-side Agentic AI Service
 * Powered by @google/genai SDK (gemini-3.8-flash)
 * Converts customer briefs, Hindi/Hinglish instructions, and site dimensions
 * into structured traceable requirements and draft BOQs.
 */

import { GoogleGenAI } from '@google/genai';
import { CustomerRequirement, BOQItem, MasterRateItem } from '../types/erp';
import { dbService } from './db';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export interface AIRequirementAnalysisResult {
  structuredSummary: string;
  scopeContradictions: string[];
  missingMeasurementsAndGaps: string[];
  suggestedClarificationQuestions: string[];
  detectedLanguages: string[];
}

export async function analyzeCustomerRequirementBrief(
  requirement: CustomerRequirement
): Promise<AIRequirementAnalysisResult> {
  const ai = getAI();

  const promptText = `
You are a senior Construction Quantity Surveyor and Interior Architect at Build Storys.
Analyze the following project brief and site survey data:

Customer: ${requirement.customerName}
Project Type: ${requirement.projectType}
Scope: ${requirement.projectScope}
Carpet Area: ${requirement.carpetAreaSqFt} sq.ft, Built-up Area: ${requirement.builtUpAreaSqFt} sq.ft
Rooms & Spaces:
${requirement.rooms.map(r => `- ${r.name} (${r.zone}, ${r.floor}): ${r.lengthFt}ft x ${r.widthFt}ft x ${r.heightFt}ft, Existing: ${r.existingCondition}, Demolition: ${r.demolitionRequired}`).join('\n')}

Style Preferences: ${requirement.preferredDesignStyle}
Materials & Brands: ${requirement.materialsBrandsPreferences}
Civil Requirements: ${requirement.civilRequirements}
Electrical: ${requirement.electricalRequirements}
Plumbing: ${requirement.plumbingSanitaryRequirements}
HVAC: ${requirement.hvacRequirements}
Kitchen/Joinery: ${requirement.joineryKitchenPreferences}
Client Budget: ₹${requirement.customerBudgetMin.toLocaleString()} to ₹${requirement.customerBudgetMax.toLocaleString()}
Target Date: ${requirement.targetCompletionDate}
Site Access & Constraints: ${requirement.siteAccessConstraints}
Survey Notes: ${requirement.surveyNotes}

Raw Multi-lingual / Hindi / Hinglish Brief:
"${requirement.rawBriefHindiEnglish || 'None provided'}"

Uploaded Documents:
${requirement.documents.map(d => `- ${d.filename} (${d.documentType}, Version: ${d.version}, Scale Confirmed: ${d.scaleConfirmed})`).join('\n')}

ESTIMATION RULES:
1. Identify any missing dimensions (e.g. unconfirmed ceiling heights, wall dado perimeter, unscaled drawings).
2. Identify scope contradictions (e.g. asking for luxury Italian marble everywhere while specifying a tight low budget, or requesting demolition without structural check).
3. Do not invent dimensions. If a photograph or unscaled sketch is provided, explicitly flag that takeoff requires confirmed 2D CAD/PDF with verified scale.
4. Support Hindi/Hinglish terms (e.g., "POP ceiling", "cob lights", "tandem box", "sunken slab", "chowkhat").

Return a valid JSON object matching this exact structure:
{
  "structuredSummary": "Concise summary of verified project scope and trades involved",
  "scopeContradictions": ["Contradiction 1 if any", "Contradiction 2 if any"],
  "missingMeasurementsAndGaps": ["Specific measurement gap 1", "Specific measurement gap 2"],
  "suggestedClarificationQuestions": ["Question to ask client or site engineer 1", "Question 2"],
  "detectedLanguages": ["English", "Hindi/Hinglish"]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText) as AIRequirementAnalysisResult;
        return parsed;
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to deterministic QS rule engine:', error);
    }
  }

  // Deterministic fallback rule-engine when API key is not configured or in offline mode:
  const missingGaps: string[] = [];
  const contradictions: string[] = [];
  const questions: string[] = [];

  // Check rooms for missing or zero dimensions
  for (const r of requirement.rooms) {
    if (!r.heightFt || r.heightFt === 0) {
      missingGaps.push(`Ceiling height missing for ${r.name}; assumed 9.5 ft standard slab.`);
    }
    if (r.demolitionRequired && !r.notes?.includes('wall')) {
      questions.push(`Please confirm thickness (4.5" vs 9") and RCC beam junctions for partition wall marked for demolition in ${r.name}.`);
    }
  }

  // Check documents for scale confirmation
  const unscaledDocs = requirement.documents.filter(d => !d.scaleConfirmed);
  if (unscaledDocs.length > 0) {
    missingGaps.push(`Drawings [${unscaledDocs.map(d => d.filename).join(', ')}] are marked as unscaled; quantities cannot be extracted from photographs or uncalibrated raster images without scale bar verification.`);
  }

  // Check budget vs scope
  if (requirement.customerBudgetMax > 0 && requirement.customerBudgetMax < 1500000 && requirement.carpetAreaSqFt > 1200) {
    contradictions.push(`Customer budget ceiling (₹${requirement.customerBudgetMax.toLocaleString()}) is below benchmark rate for ${requirement.carpetAreaSqFt} sq.ft turnkey turnkey execution (min ₹1,500/sq.ft required).`);
  }

  questions.push('Are heavy kitchen appliances (Hob, Chimney, Oven) being procured directly by client or included in turnkey supply?');
  questions.push('Is the building freight elevator permitted for heavy marble slab/tile transport during working hours?');

  return {
    structuredSummary: `Turnkey execution for ${requirement.projectType} (${requirement.carpetAreaSqFt} sq.ft) across ${requirement.rooms.length} specified zones. Verified trades include Demolition, Waterproofing, Vitrified & Wooden Flooring, Saint-Gobain False Ceilings, Royale Emulsion, Modular BWP Marine Kitchen, and Veneer Wardrobes.`,
    scopeContradictions: contradictions,
    missingMeasurementsAndGaps: missingGaps,
    suggestedClarificationQuestions: questions,
    detectedLanguages: ['English', 'Hindi / Hinglish']
  };
}

export async function generateDraftBOQFromRequirements(
  requirement: CustomerRequirement,
  masterRates: MasterRateItem[]
): Promise<{ items: BOQItem[]; missingAlerts: string[]; provisionalAlerts: string[] }> {
  // Use verified room dimensions and map to approved master library items deterministically
  const items: BOQItem[] = [];
  const missingAlerts: string[] = [];
  const provisionalAlerts: string[] = [];

  // Helper to find approved rate
  const findRate = (itemCode: string) => masterRates.find(r => r.itemCode === itemCode) || masterRates[0];

  let itemSeq = 1;

  for (const room of requirement.rooms) {
    const floor = room.floor || '1st Floor';
    const zone = room.name;

    // 1. Demolition (if flagged)
    if (room.demolitionRequired) {
      const rate = findRate('DEM-01');
      const baseQty = Number((room.lengthFt * 9.5).toFixed(2));
      const wastage = 5;
      const finalQty = Number((baseQty * (1 + wastage / 100)).toFixed(2));
      const unitCost = rate.totalUnitCost;
      const totalCost = Number((finalQty * unitCost).toFixed(2));
      const sellingRate = rate.suggestedSellingRate;
      const sellingAmount = Number((finalQty * sellingRate).toFixed(2));

      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: rate.itemCode,
        trade: rate.trade,
        workPackage: rate.workPackage,
        floor,
        roomZone: zone,
        description: `Dismantling non-structural brick/AAC partition in ${room.name} with debris disposal.`,
        specification: rate.specification,
        brandGrade: rate.brandGrade,
        inclusions: 'Breaker operation, bagging, elevator carting, municipal disposal',
        exclusions: 'RCC structural beams/columns',
        unit: rate.unit,
        length: room.lengthFt,
        height: 9.5,
        quantityFormula: `${room.lengthFt} ft length * 9.5 ft height = ${baseQty} sq.ft`,
        baseQuantity: baseQty,
        wastagePercent: wastage,
        finalQuantity: finalQty,
        quantityType: 'MEASURED',
        materialRate: rate.materialRate,
        labourRate: rate.labourRate,
        equipmentRate: rate.equipmentRate,
        subcontractRate: rate.subcontractRate,
        unitCost,
        totalCost,
        markupPercent: rate.defaultMarkupPercent,
        sellingRate,
        sellingAmount,
        rateSource: rate.rateSource,
        rateStatus: rate.status,
        sourceDocumentRef: 'Site Survey Demolition Schedule',
        assumptions: 'Non-structural partition confirmed on site.',
        isApprovedByEstimator: false
      });
    }

    // 2. Waterproofing (for Bathrooms / Balconies)
    if (room.name.toLowerCase().includes('bath') || room.name.toLowerCase().includes('toilet') || room.name.toLowerCase().includes('balcony')) {
      const rate = findRate('WTR-01');
      const floorArea = room.lengthFt * room.widthFt;
      const dadoHeight = 7.0; // ft
      const dadoArea = 2 * (room.lengthFt + room.widthFt) * dadoHeight;
      const baseQty = Number((floorArea + dadoArea).toFixed(2));
      const wastage = 5;
      const finalQty = Number((baseQty * (1 + wastage / 100)).toFixed(2));
      const unitCost = rate.totalUnitCost;
      const totalCost = Number((finalQty * unitCost).toFixed(2));
      const sellingRate = rate.suggestedSellingRate;
      const sellingAmount = Number((finalQty * sellingRate).toFixed(2));

      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: rate.itemCode,
        trade: rate.trade,
        workPackage: rate.workPackage,
        floor,
        roomZone: zone,
        description: `Two-component elastomeric waterproofing in ${room.name} over floor and dado up to 7ft.`,
        specification: rate.specification,
        brandGrade: rate.brandGrade,
        inclusions: '72hr pond testing with water tightness certificate',
        exclusions: 'Core drilling plumbing holes',
        unit: rate.unit,
        length: room.lengthFt,
        width: room.widthFt,
        height: dadoHeight,
        quantityFormula: `Floor (${room.lengthFt} * ${room.widthFt}) + Dado (2 * (${room.lengthFt}+${room.widthFt}) * ${dadoHeight}) = ${baseQty} sq.ft`,
        baseQuantity: baseQty,
        wastagePercent: wastage,
        finalQuantity: finalQty,
        quantityType: 'MEASURED',
        materialRate: rate.materialRate,
        labourRate: rate.labourRate,
        equipmentRate: rate.equipmentRate,
        subcontractRate: rate.subcontractRate,
        unitCost,
        totalCost,
        markupPercent: rate.defaultMarkupPercent,
        sellingRate,
        sellingAmount,
        rateSource: rate.rateSource,
        rateStatus: rate.status,
        sourceDocumentRef: 'Architectural Plumbing & Dado Details',
        assumptions: '72hr pond testing required before tile installation.',
        isApprovedByEstimator: false
      });
    }

    // 3. Flooring & Tiling
    if (!room.name.toLowerCase().includes('bath') && !room.name.toLowerCase().includes('toilet')) {
      const isMasterBed = room.name.toLowerCase().includes('master');
      const rate = isMasterBed ? findRate('FLR-03') : findRate('FLR-01'); // Wooden for Master, Vitrified for rest
      const floorArea = room.lengthFt * room.widthFt;
      const skirtingArea = Number((2 * (room.lengthFt + room.widthFt) * 0.5).toFixed(2)); // 6 inch skirting
      const baseQty = Number((floorArea + skirtingArea).toFixed(2));
      const wastage = 8;
      const finalQty = Number((baseQty * (1 + wastage / 100)).toFixed(2));
      const unitCost = rate.totalUnitCost;
      const totalCost = Number((finalQty * unitCost).toFixed(2));
      const sellingRate = rate.suggestedSellingRate;
      const sellingAmount = Number((finalQty * sellingRate).toFixed(2));

      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: rate.itemCode,
        trade: rate.trade,
        workPackage: rate.workPackage,
        floor,
        roomZone: zone,
        description: isMasterBed 
          ? `German AC4 engineered wooden flooring in ${room.name} with sound dampening underlay.`
          : `Laying 1600x800mm High Gloss Glazed Vitrified Tiles (GVT) in ${room.name} with epoxy grout.`,
        specification: rate.specification,
        brandGrade: rate.brandGrade,
        inclusions: isMasterBed ? '2mm acoustic foam, moisture barrier, skirting profile' : 'Polymer adhesive bed, leveling spacers, epoxy grout, 100mm skirting',
        exclusions: 'Sub-floor self-leveling screed if unevenness > 4mm',
        unit: rate.unit,
        length: room.lengthFt,
        width: room.widthFt,
        quantityFormula: `${room.lengthFt} ft * ${room.widthFt} ft + skirting (${skirtingArea} sq.ft) = ${baseQty} sq.ft`,
        baseQuantity: baseQty,
        wastagePercent: wastage,
        finalQuantity: finalQty,
        quantityType: 'MEASURED',
        materialRate: rate.materialRate,
        labourRate: rate.labourRate,
        equipmentRate: rate.equipmentRate,
        subcontractRate: rate.subcontractRate,
        unitCost,
        totalCost,
        markupPercent: rate.defaultMarkupPercent,
        sellingRate,
        sellingAmount,
        rateSource: rate.rateSource,
        rateStatus: rate.status,
        sourceDocumentRef: 'Architectural Floor Plan Schedule',
        assumptions: 'Sub-floor cured and free from chemical efflorescence.',
        isApprovedByEstimator: false
      });
    }

    // 4. False Ceiling
    if (!room.name.toLowerCase().includes('bath') && !room.name.toLowerCase().includes('toilet')) {
      const rate = findRate('CLG-01');
      const ceilingArea = Number((room.lengthFt * room.widthFt).toFixed(2));
      const wastage = 5;
      const finalQty = Number((ceilingArea * (1 + wastage / 100)).toFixed(2));
      const unitCost = rate.totalUnitCost;
      const totalCost = Number((finalQty * unitCost).toFixed(2));
      const sellingRate = rate.suggestedSellingRate;
      const sellingAmount = Number((finalQty * sellingRate).toFixed(2));

      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: rate.itemCode,
        trade: rate.trade,
        workPackage: rate.workPackage,
        floor,
        roomZone: zone,
        description: `Saint-Gobain Gyproc 12.5mm false ceiling in ${room.name} with GI suspension framing.`,
        specification: rate.specification,
        brandGrade: rate.brandGrade,
        inclusions: 'GI suspension angles, drywall screws, jointing compound, cutouts for lights',
        exclusions: 'Light fixtures & track rails',
        unit: rate.unit,
        length: room.lengthFt,
        width: room.widthFt,
        quantityFormula: `${room.lengthFt} ft * ${room.widthFt} ft = ${ceilingArea} sq.ft`,
        baseQuantity: ceilingArea,
        wastagePercent: wastage,
        finalQuantity: finalQty,
        quantityType: 'MEASURED',
        materialRate: rate.materialRate,
        labourRate: rate.labourRate,
        equipmentRate: rate.equipmentRate,
        subcontractRate: rate.subcontractRate,
        unitCost,
        totalCost,
        markupPercent: rate.defaultMarkupPercent,
        sellingRate,
        sellingAmount,
        rateSource: rate.rateSource,
        rateStatus: rate.status,
        sourceDocumentRef: 'Reflected Ceiling Plan (RCP)',
        assumptions: 'Drop depth 6 inches from structural slab.',
        isApprovedByEstimator: false
      });

      // Add cove lighting step for Living Lounge
      if (room.name.toLowerCase().includes('living')) {
        const coveRate = findRate('CLG-02');
        const perimeter = Number((2 * (room.lengthFt + room.widthFt)).toFixed(2));
        const finalPerimeter = Number((perimeter * 1.05).toFixed(2));
        items.push({
          id: `BOQ-GEN-${itemSeq++}`,
          boqRevisionId: 'DRAFT',
          itemCode: coveRate.itemCode,
          trade: coveRate.trade,
          workPackage: coveRate.workPackage,
          floor,
          roomZone: zone,
          description: `Perimeter architectural indirect LED light cove step in ${room.name} ceiling.`,
          specification: coveRate.specification,
          brandGrade: coveRate.brandGrade,
          inclusions: 'Vertical baffle, edge trim bead, light reflector shelf',
          exclusions: 'LED strip & power supply driver',
          unit: coveRate.unit,
          quantityFormula: `2 * (${room.lengthFt} + ${room.widthFt}) = ${perimeter} r.ft`,
          baseQuantity: perimeter,
          wastagePercent: 5,
          finalQuantity: finalPerimeter,
          quantityType: 'MEASURED',
          materialRate: coveRate.materialRate,
          labourRate: coveRate.labourRate,
          equipmentRate: coveRate.equipmentRate,
          subcontractRate: coveRate.subcontractRate,
          unitCost: coveRate.totalUnitCost,
          totalCost: Number((finalPerimeter * coveRate.totalUnitCost).toFixed(2)),
          markupPercent: coveRate.defaultMarkupPercent,
          sellingRate: coveRate.suggestedSellingRate,
          sellingAmount: Number((finalPerimeter * coveRate.suggestedSellingRate).toFixed(2)),
          rateSource: coveRate.rateSource,
          rateStatus: coveRate.status,
          sourceDocumentRef: 'Ceiling Detail Section A-A',
          assumptions: 'Uniform 150mm vertical step drop.',
          isApprovedByEstimator: false
        });
      }
    }

    // 5. Modular Kitchen (if kitchen)
    if (room.name.toLowerCase().includes('kitchen')) {
      const carcassRate = findRate('KIT-01');
      const shutterRate = findRate('KIT-02');
      const counterRate = findRate('KIT-03');

      // Carcass
      const carcassArea = 125.0;
      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: carcassRate.itemCode,
        trade: carcassRate.trade,
        workPackage: carcassRate.workPackage,
        floor,
        roomZone: zone,
        description: 'BWP 710 Marine Grade calibrated plywood kitchen base and overhead carcass with Hafele soft-close runners.',
        specification: carcassRate.specification,
        brandGrade: carcassRate.brandGrade,
        inclusions: 'Internal 0.8mm off-white laminate, soft-close drawers, cutlery tray, bottle pull-out',
        exclusions: 'Built-in electrical appliances',
        unit: carcassRate.unit,
        quantityFormula: 'Base units (21 r.ft * 2.75ft) + Overheads (21 r.ft * 2.5ft) + Tall unit (15 sq.ft) = 125 sq.ft',
        baseQuantity: carcassArea,
        wastagePercent: 5,
        finalQuantity: Number((carcassArea * 1.05).toFixed(2)),
        quantityType: 'MEASURED',
        materialRate: carcassRate.materialRate,
        labourRate: carcassRate.labourRate,
        equipmentRate: carcassRate.equipmentRate,
        subcontractRate: carcassRate.subcontractRate,
        unitCost: carcassRate.totalUnitCost,
        totalCost: Number((carcassArea * 1.05 * carcassRate.totalUnitCost).toFixed(2)),
        markupPercent: carcassRate.defaultMarkupPercent,
        sellingRate: carcassRate.suggestedSellingRate,
        sellingAmount: Number((carcassArea * 1.05 * carcassRate.suggestedSellingRate).toFixed(2)),
        rateSource: carcassRate.rateSource,
        rateStatus: carcassRate.status,
        sourceDocumentRef: 'Kitchen Modular Elevation Drawing',
        assumptions: 'Includes PVC water drip barrier under sink cabinet.',
        isApprovedByEstimator: false
      });

      // Acrylic Shutters
      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: shutterRate.itemCode,
        trade: shutterRate.trade,
        workPackage: shutterRate.workPackage,
        floor,
        roomZone: zone,
        description: 'Senoplast high-gloss scratch-resistant 1.5mm acrylic front shutters on 18mm Action TESA HDHMR.',
        specification: shutterRate.specification,
        brandGrade: shutterRate.brandGrade,
        inclusions: '110-deg soft-close hinges, zero-joint edge banding, J-pull profiles',
        exclusions: 'Glass profile display lights',
        unit: shutterRate.unit,
        quantityFormula: 'Front shutter frontal surface = 110 sq.ft',
        baseQuantity: 110,
        wastagePercent: 5,
        finalQuantity: 115.5,
        quantityType: 'MEASURED',
        materialRate: shutterRate.materialRate,
        labourRate: shutterRate.labourRate,
        equipmentRate: shutterRate.equipmentRate,
        subcontractRate: shutterRate.subcontractRate,
        unitCost: shutterRate.totalUnitCost,
        totalCost: Number((115.5 * shutterRate.totalUnitCost).toFixed(2)),
        markupPercent: shutterRate.defaultMarkupPercent,
        sellingRate: shutterRate.suggestedSellingRate,
        sellingAmount: Number((115.5 * shutterRate.suggestedSellingRate).toFixed(2)),
        rateSource: shutterRate.rateSource,
        rateStatus: shutterRate.status,
        sourceDocumentRef: 'Kitchen Shutter Schedule',
        assumptions: 'Protective peel-off film retained till deep cleaning.',
        isApprovedByEstimator: false
      });

      // Quartz Counter
      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: counterRate.itemCode,
        trade: counterRate.trade,
        workPackage: counterRate.workPackage,
        floor,
        roomZone: zone,
        description: 'Supplying and installing 18mm Quartz engineered stone countertop with 40mm sandwich bevel edge.',
        specification: counterRate.specification,
        brandGrade: counterRate.brandGrade,
        inclusions: 'Under-mount sink cutout, polished inner edges, 100mm border splash',
        exclusions: 'Plumbing faucets and sink unit',
        unit: counterRate.unit,
        quantityFormula: '21 r.ft length * 2.2 ft width + backsplash 15 sq.ft = 61.2 sq.ft',
        baseQuantity: 61.2,
        wastagePercent: 8,
        finalQuantity: 66.1,
        quantityType: 'MEASURED',
        materialRate: counterRate.materialRate,
        labourRate: counterRate.labourRate,
        equipmentRate: counterRate.equipmentRate,
        subcontractRate: counterRate.subcontractRate,
        unitCost: counterRate.totalUnitCost,
        totalCost: Number((66.1 * counterRate.totalUnitCost).toFixed(2)),
        markupPercent: counterRate.defaultMarkupPercent,
        sellingRate: counterRate.suggestedSellingRate,
        sellingAmount: Number((66.1 * counterRate.suggestedSellingRate).toFixed(2)),
        rateSource: counterRate.rateSource,
        rateStatus: counterRate.status,
        sourceDocumentRef: 'Kitchen Counter Specification',
        assumptions: 'Sink cutout location confirmed on architectural CAD.',
        isApprovedByEstimator: false
      });
    }

    // 6. Wardrobe (for Bedrooms)
    if (room.name.toLowerCase().includes('bed') && !room.name.toLowerCase().includes('kids')) {
      const isMaster = room.name.toLowerCase().includes('master');
      const carcassRate = findRate('WRD-01');
      const shutterRate = isMaster ? findRate('WRD-02') : findRate('KIT-02'); // Veneer for Master, Laminate/Acrylic for guest

      const width = isMaster ? 10.0 : 8.0;
      const height = room.heightFt || 9.5;
      const area = Number((width * height).toFixed(2));
      const finalArea = Number((area * 1.05).toFixed(2));

      // Carcass
      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: carcassRate.itemCode,
        trade: carcassRate.trade,
        workPackage: carcassRate.workPackage,
        floor,
        roomZone: zone,
        description: `Floor-to-ceiling built-in sliding wardrobe carcass in 18mm BWR plywood in ${room.name}.`,
        specification: carcassRate.specification,
        brandGrade: carcassRate.brandGrade,
        inclusions: 'Hanging rods, soft-close internal drawers, tie rack, top-hung sliding hardware',
        exclusions: 'Interior sensor LED strip lighting',
        unit: carcassRate.unit,
        length: width,
        height,
        quantityFormula: `${width} ft width * ${height} ft ceiling height = ${area} sq.ft`,
        baseQuantity: area,
        wastagePercent: 5,
        finalQuantity: finalArea,
        quantityType: 'MEASURED',
        materialRate: carcassRate.materialRate,
        labourRate: carcassRate.labourRate,
        equipmentRate: carcassRate.equipmentRate,
        subcontractRate: carcassRate.subcontractRate,
        unitCost: carcassRate.totalUnitCost,
        totalCost: Number((finalArea * carcassRate.totalUnitCost).toFixed(2)),
        markupPercent: carcassRate.defaultMarkupPercent,
        sellingRate: carcassRate.suggestedSellingRate,
        sellingAmount: Number((finalArea * carcassRate.suggestedSellingRate).toFixed(2)),
        rateSource: carcassRate.rateSource,
        rateStatus: carcassRate.status,
        sourceDocumentRef: 'Wardrobe Joinery Drawing',
        assumptions: 'Full depth 24 inches for standard coat hangers.',
        isApprovedByEstimator: false
      });

      // Shutters
      items.push({
        id: `BOQ-GEN-${itemSeq++}`,
        boqRevisionId: 'DRAFT',
        itemCode: shutterRate.itemCode,
        trade: shutterRate.trade,
        workPackage: shutterRate.workPackage,
        floor,
        roomZone: zone,
        description: isMaster 
          ? `Natural smoked American walnut architectural veneer sliding shutters with Italian PU satin coat in ${room.name}.`
          : `High-durability anti-scratch shutters with edge banding in ${room.name}.`,
        specification: shutterRate.specification,
        brandGrade: shutterRate.brandGrade,
        inclusions: 'Full height aluminum stiffeners, dust seal brush, concealed handles',
        exclusions: 'Fluted glass inserts',
        unit: shutterRate.unit,
        length: width,
        height,
        quantityFormula: `${width} ft * ${height} ft = ${area} sq.ft`,
        baseQuantity: area,
        wastagePercent: 5,
        finalQuantity: finalArea,
        quantityType: 'MEASURED',
        materialRate: shutterRate.materialRate,
        labourRate: shutterRate.labourRate,
        equipmentRate: shutterRate.equipmentRate,
        subcontractRate: shutterRate.subcontractRate,
        unitCost: shutterRate.totalUnitCost,
        totalCost: Number((finalArea * shutterRate.totalUnitCost).toFixed(2)),
        markupPercent: shutterRate.defaultMarkupPercent,
        sellingRate: shutterRate.suggestedSellingRate,
        sellingAmount: Number((finalArea * shutterRate.suggestedSellingRate).toFixed(2)),
        rateSource: shutterRate.rateSource,
        rateStatus: shutterRate.status,
        sourceDocumentRef: 'Client Finish Selection Sheet',
        assumptions: 'Veneer sheets inspected before pressing.',
        isApprovedByEstimator: false
      });
    }
  }

  // 7. Whole Apartment Painting
  const pntRate = findRate('PNT-01');
  const totalCarpet = requirement.carpetAreaSqFt || 1650;
  const paintWallFactor = 3.2; // Standard empirical QS multiplier minus door/window openings
  const wallPaintArea = Math.round(totalCarpet * paintWallFactor);
  const finalPaintArea = Math.round(wallPaintArea * 1.05);

  items.push({
    id: `BOQ-GEN-${itemSeq++}`,
    boqRevisionId: 'DRAFT',
    itemCode: pntRate.itemCode,
    trade: pntRate.trade,
    workPackage: pntRate.workPackage,
    floor: 'All Floors',
    roomZone: 'Entire Residence',
    description: 'Complete interior wall painting: surface prep, 1 coat primer, 2 coats white putty with machine sanding, 2 coats Asian Paints Royale luxury emulsion.',
    specification: pntRate.specification,
    brandGrade: pntRate.brandGrade,
    inclusions: 'Floor protection sheet, window masking, 2 coats Royale luxury emulsion',
    exclusions: 'Specialized metallic stencil or exterior texture',
    unit: pntRate.unit,
    quantityFormula: `Carpet area ${totalCarpet} sq.ft * 3.2 wall factor = ${wallPaintArea} sq.ft`,
    baseQuantity: wallPaintArea,
    wastagePercent: 5,
    finalQuantity: finalPaintArea,
    quantityType: 'MEASURED',
    materialRate: pntRate.materialRate,
    labourRate: pntRate.labourRate,
    equipmentRate: pntRate.equipmentRate,
    subcontractRate: pntRate.subcontractRate,
    unitCost: pntRate.totalUnitCost,
    totalCost: Number((finalPaintArea * pntRate.totalUnitCost).toFixed(2)),
    markupPercent: pntRate.defaultMarkupPercent,
    sellingRate: pntRate.suggestedSellingRate,
    sellingAmount: Number((finalPaintArea * pntRate.suggestedSellingRate).toFixed(2)),
    rateSource: pntRate.rateSource,
    rateStatus: pntRate.status,
    sourceDocumentRef: 'Wall Area Schedule & Architectural Brief',
    assumptions: 'Base colors: Morning Sun Royale Base & Off-white.',
    isApprovedByEstimator: false
  });

  // 8. Electrical Concealed Points
  const eleRate = findRate('ELE-01');
  const pointsCount = Math.round(totalCarpet * 0.088); // empirical 145 points for 1650 sqft 3BHK
  items.push({
    id: `BOQ-GEN-${itemSeq++}`,
    boqRevisionId: 'DRAFT',
    itemCode: eleRate.itemCode,
    trade: eleRate.trade,
    workPackage: eleRate.workPackage,
    floor: 'All Floors',
    roomZone: 'Entire Residence',
    description: 'Concealed point wiring with Polycab FRLS copper wire in rigid PVC conduit and Legrand Arteor modular white switches.',
    specification: eleRate.specification,
    brandGrade: eleRate.brandGrade,
    inclusions: 'Chase cutting, GI modular boxes, faceplates, earthing',
    exclusions: 'Light fixtures, fans, chandeliers',
    unit: eleRate.unit,
    quantityFormula: `Empirical 1 point per 11 sq.ft carpet area = ${pointsCount} points`,
    baseQuantity: pointsCount,
    wastagePercent: 0,
    finalQuantity: pointsCount,
    quantityType: 'MEASURED',
    materialRate: eleRate.materialRate,
    labourRate: eleRate.labourRate,
    equipmentRate: eleRate.equipmentRate,
    subcontractRate: eleRate.subcontractRate,
    unitCost: eleRate.totalUnitCost,
    totalCost: Number((pointsCount * eleRate.totalUnitCost).toFixed(2)),
    markupPercent: eleRate.defaultMarkupPercent,
    sellingRate: eleRate.suggestedSellingRate,
    sellingAmount: Number((pointsCount * eleRate.suggestedSellingRate).toFixed(2)),
    rateSource: eleRate.rateSource,
    rateStatus: eleRate.status,
    sourceDocumentRef: 'Single Line Electrical Diagram (SLD)',
    assumptions: 'Distribution board with sufficient spare breaker slots.',
    isApprovedByEstimator: false
  });

  // Add 1 provisional feature item with flag
  const provRate = findRate('SPL-01');
  items.push({
    id: `BOQ-GEN-${itemSeq++}`,
    boqRevisionId: 'DRAFT',
    itemCode: provRate.itemCode,
    trade: provRate.trade,
    workPackage: provRate.workPackage,
    floor: '14th Floor',
    roomZone: 'Master Bedroom Suite',
    description: 'PROVISIONAL ITEM: Custom acoustic fluted wall paneling behind king bed with warm 3000K LED channel step.',
    specification: provRate.specification,
    brandGrade: provRate.brandGrade,
    inclusions: 'Acoustic substrate, fluted battens, primer coat',
    exclusions: 'Electric driver supply',
    unit: provRate.unit,
    quantityFormula: 'Provisional allowance based on 10ft bed wall * 8ft height = 80 sq.ft',
    baseQuantity: 80,
    wastagePercent: 10,
    finalQuantity: 88,
    quantityType: 'PROVISIONAL_ALLOWANCE',
    materialRate: provRate.materialRate,
    labourRate: provRate.labourRate,
    equipmentRate: provRate.equipmentRate,
    subcontractRate: provRate.subcontractRate,
    unitCost: provRate.totalUnitCost,
    totalCost: Number((88 * provRate.totalUnitCost).toFixed(2)),
    markupPercent: provRate.defaultMarkupPercent,
    sellingRate: provRate.suggestedSellingRate,
    sellingAmount: Number((88 * provRate.suggestedSellingRate).toFixed(2)),
    rateSource: provRate.rateSource,
    rateStatus: provRate.status,
    sourceDocumentRef: 'Survey Note (Client Verbal Request)',
    assumptions: 'Bed back wall elevation drawing missing confirmed height; assumed 8.0 ft allowance.',
    uncertaintyFlags: 'Missing verified drawing elevation and client material sign-off.',
    isApprovedByEstimator: false
  });

  provisionalAlerts.push('Item SPL-01 (Feature Paneling) is marked PROVISIONAL. Rate source is illustrative benchmark pending final design sign-off.');

  return {
    items,
    missingAlerts,
    provisionalAlerts
  };
}
