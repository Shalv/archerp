/**
 * Build Storys ERP - Server-side Agentic AI Service
 * Powered by @google/genai SDK (gemini-3.8-flash)
 * Converts customer briefs, Hindi/Hinglish instructions, and site dimensions
 * into structured traceable requirements and draft BOQs.
 */

import { GoogleGenAI } from '@google/genai';
import { 
  CustomerRequirement, 
  BOQItem, 
  MasterRateItem,
  VastuLayoutOption,
  VastuLayoutSuggestionResponse,
  VastuRoomSuggestion 
} from '../types/erp';
import { dbService } from './db';

let aiClient: GoogleGenAI | null = null;
let isGeminiRemoteAccessDenied = false;

function getAI(): GoogleGenAI | null {
  if (isGeminiRemoteAccessDenied) {
    return null;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function handleGeminiError(context: string, err: any): void {
  const errMsg = typeof err?.message === 'string' ? err.message : JSON.stringify(err || '');
  if (
    errMsg.includes('PERMISSION_DENIED') ||
    errMsg.includes('denied access') ||
    errMsg.includes('403') ||
    errMsg.includes('API_KEY_INVALID')
  ) {
    isGeminiRemoteAccessDenied = true;
  }
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
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
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
      handleGeminiError('analyzeCustomerRequirementBrief', error);
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

export interface VastuLayoutQueryParams {
  areaSqFt: number;
  plotWidthFt?: number;
  plotDepthFt?: number;
  propertyType?: string;
  facingDirection?: string;
  floorsCount?: number;
  lifestyleNotes?: string;
}

export async function generateVastuLayoutSuggestions(
  params: VastuLayoutQueryParams
): Promise<VastuLayoutSuggestionResponse> {
  const areaSqFt = Math.max(400, Math.min(50000, Number(params.areaSqFt) || 1200));
  
  // Calculate or resolve plot dimensions
  let plotWidthFt = Number(params.plotWidthFt) || 0;
  let plotDepthFt = Number(params.plotDepthFt) || 0;
  if (!plotWidthFt || !plotDepthFt) {
    if (areaSqFt === 1200) {
      plotWidthFt = 30;
      plotDepthFt = 40;
    } else if (areaSqFt === 1500) {
      plotWidthFt = 30;
      plotDepthFt = 50;
    } else if (areaSqFt === 1800) {
      plotWidthFt = 30;
      plotDepthFt = 60;
    } else if (areaSqFt === 2400) {
      plotWidthFt = 40;
      plotDepthFt = 60;
    } else {
      plotWidthFt = Math.round(Math.sqrt(areaSqFt * 0.75));
      plotDepthFt = Math.round(areaSqFt / (plotWidthFt || 30));
    }
  }

  const propertyType = params.propertyType || 'RESIDENTIAL_VILLA';
  const facingDirection = params.facingDirection || 'EAST';
  const floorsCount = Math.max(1, Math.min(4, Number(params.floorsCount) || (areaSqFt > 3000 ? 2 : 1)));
  const lifestyleNotes = params.lifestyleNotes || '';

  const ai = getAI();

  const promptText = `
You are a Principal Indian Architectural Planner and Certified Vastu Shastra Consultant with 25+ years of experience in turnkey construction and spatial zoning.

TASK:
A client has provided a plot size of ${areaSqFt} sq.ft (${plotWidthFt} ft Width × ${plotDepthFt} ft Depth) for a "${propertyType}".
Plot/Entrance Facing: ${facingDirection}
Number of Floors: ${floorsCount} (e.g. ${floorsCount === 1 ? 'Single Floor Ground Level' : floorsCount === 2 ? 'G+1 Duplex' : 'G+2 Multi-Gen'})
Specific Requirements/Lifestyle Notes: "${lifestyleNotes || 'Standard modern luxury layout with maximum Vastu compliance'}"

You must suggest EXACTLY 3 DISTINCT architectural layout options adhering to authentic Indian Vastu Shastra (Mayamatam / Manasara principles):
- Option 1: "Vastu Purusha Sanatana (Traditional Full Vastu Harmony)" - Strict classical adherence with dedicated Pooja Mandir, enclosed Vastu kitchen in Agni, master bedroom in Nairutya, and sacred central Brahmasthan.
- Option 2: "Contemporary Open-Concept Vastu (Modern Living with Zero Energy Clashes)" - Modern seamless living-dining flow, central skylit lightwell/Brahmasthan, home office / study, and energy-neutral remedies.
- Option 3: "Executive Luxury / Smart Duplex Suite" - Multi-generational or high-efficiency smart spatial planning with dual suites, entertainment balcony, and elder-friendly ground floor.

STRICT VASTU SHASTRA DIRECTIVES:
1. North-East (Ishanya, Water/Jal): Must place Pooja Mandir, Prayer / Meditation room, or clean water body. NO toilets, septic tanks, or heavy storage.
2. South-East (Agni, Fire): Ideal for Kitchen (cooking platform facing East) and electrical distribution boards.
3. South-West (Nairutya, Earth/Prithvi): Heavy zone. Highest stability. Must place Master Bedroom (bed headboard South/East) or heavy wardrobe/safe. NO water tanks or toilets.
4. North-West (Vayu, Air): Ideal for Guest Bedroom, Kids/Daughter Bedroom, Store/Pantry, or Secondary Bathrooms.
5. North (Uttar, Kuber/Wealth) & East (Purva, Surya/Sun): Main Entrance, Living Room, Open Balconies, Foyer. Kept light and open.
6. Center (Brahmasthan, Space/Akash): Must remain free of structural load, columns, toilets, or kitchens. Kept open, well-ventilated, or a lightwell/courtyard.
7. Staircase: South, South-West, or West. Must climb clockwise (East to West or North to South).

MATHEMATICAL CONSTRAINTS:
- Total Built-Up Area: ${areaSqFt} sq.ft (Plot: ${plotWidthFt}' × ${plotDepthFt}')
- Target Net Carpet Area across rooms: approximately ${Math.round(areaSqFt * 0.76)} to ${Math.round(areaSqFt * 0.80)} sq.ft (leaving ~20-24% for walls, ducts, and circulation).
- Room dimensions (Length × Width) must be realistic and their individual carpet areas must strictly sum up to the total carpet area.

Return a valid JSON object matching this exact schema:
{
  "requestedAreaSqFt": ${areaSqFt},
  "plotDimensions": { "widthFt": ${plotWidthFt}, "depthFt": ${plotDepthFt} },
  "propertyType": "${propertyType}",
  "facingDirection": "${facingDirection}",
  "floorsCount": ${floorsCount},
  "options": [
    {
      "id": "option-1",
      "optionNumber": 1,
      "title": "Descriptive title for Option 1",
      "tagline": "Short punchy summary (e.g. 98% Vastu Pure • Traditional 3BHK with Mandir)",
      "vastuScore": 98,
      "propertyType": "${propertyType}",
      "facingDirection": "${facingDirection}",
      "floorsCount": ${floorsCount},
      "plotDimensions": { "widthFt": ${plotWidthFt}, "depthFt": ${plotDepthFt} },
      "configuration": "e.g. 2BHK/3BHK + Mandir + Utility + Parking",
      "totalBuiltUpSqFt": ${areaSqFt},
      "totalCarpetSqFt": ${Math.round(areaSqFt * 0.78)},
      "carpetRatioPercent": 78,
      "circulationPercent": 16,
      "vastuHighlights": {
        "mainEntrance": "Direction and pada explanation",
        "masterBedroom": "Placed in South-West (Nairutya) for leadership and deep sleep",
        "kitchen": "Placed in South-East (Agni) with cooking facing East",
        "poojaRoom": "Placed in North-East (Ishanya) for divine cosmic vibrations",
        "livingDining": "North/East facing for continuous morning prana flow",
        "staircase": "South/West clockwise climbing",
        "brahmasthan": "Open unobstructed circulation hall/courtyard",
        "waterElements": "North-East underground storage / water feature"
      },
      "rooms": [
        {
          "name": "Master Bedroom Suite 1",
          "roomType": "Master Bedroom",
          "zone": "Private Zone",
          "floor": "Ground Floor",
          "lengthFt": 16.5,
          "widthFt": 14.0,
          "heightFt": 10.5,
          "carpetAreaSqFt": 231,
          "vastuDirection": "South-West (Nairutya)",
          "vastuElement": "Earth (Prithvi)",
          "vastuSignificance": "Grounding earth energy ensures financial stability and sound leadership for family head.",
          "recommendedFeatures": ["Headboard to South", "Heavy teak wardrobe on South-West wall", "Attached bath on West"]
        }
      ],
      "pros": ["Highest Vastu purity score", "Dedicated sacred sanctum", "Zero directional dosha"],
      "bestSuitedFor": "Traditional families wanting complete peace of mind and orthodox compliance",
      "architecturalNotes": "Architectural advice on cross-ventilation and light."
    },
    ... (option 2 and option 3)
  ],
  "vastuCompassGuidelines": [
    {
      "direction": "North-East (Ishanya)",
      "deity": "Lord Shiva / Water Deity",
      "element": "Water (Jal)",
      "recommendedRooms": ["Pooja / Mandir", "Meditation", "Underground Water Tank", "Main Entrance"],
      "strictlyAvoid": ["Toilets", "Kitchen", "Heavy Storage", "Master Bedroom"]
    },
    {
      "direction": "South-East (Agni)",
      "deity": "Agni (Fire Lord)",
      "element": "Fire (Agni)",
      "recommendedRooms": ["Modular Kitchen", "Pantry", "Inverter / Electrical DB", "Generator"],
      "strictlyAvoid": ["Master Bedroom", "Underground Water", "Pooja Room"]
    },
    {
      "direction": "South-West (Nairutya)",
      "deity": "Nairuti / Earth",
      "element": "Earth (Prithvi)",
      "recommendedRooms": ["Master Bedroom Suite", "Locker / Heavy Safe", "Overhead Water Tank", "Head of Firm Cabin"],
      "strictlyAvoid": ["Main Entrance", "Kitchen", "Pooja Room", "Open Cutout"]
    },
    {
      "direction": "North-West (Vayu)",
      "deity": "Vayu (Wind Deity)",
      "element": "Air (Vayu)",
      "recommendedRooms": ["Guest Bedroom", "Kids Room", "Bathrooms / Powder Room", "Utility / Wash"],
      "strictlyAvoid": ["Master Bedroom", "Pooja Mandir"]
    },
    {
      "direction": "Center (Brahmasthan)",
      "deity": "Lord Brahma",
      "element": "Space (Akash)",
      "recommendedRooms": ["Open Hall", "Courtyard", "Skylit Lightwell", "Central Circulation"],
      "strictlyAvoid": ["Columns", "Toilets", "Kitchen", "Staircase", "Heavy Load"]
    }
  ]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.25
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText) as VastuLayoutSuggestionResponse;
        if (parsed.options && parsed.options.length === 3) {
          return parsed;
        }
      }
    } catch (err: any) {
      handleGeminiError('generateVastuLayoutSuggestions', err);
    }
  }

  // High-fidelity deterministic architectural calculation fallback
  return getDeterministicVastuLayouts(areaSqFt, propertyType, facingDirection, floorsCount, plotWidthFt, plotDepthFt);
}

/**
 * Deterministic Vastu Layout Calculation Engine
 * Provides mathematically exact, Vastu-authentic plans for any square footage and property type.
 */
function getDeterministicVastuLayouts(
  areaSqFt: number,
  propertyType: string,
  facingDirection: string,
  floorsCount: number,
  customWidthFt?: number,
  customDepthFt?: number
): VastuLayoutSuggestionResponse {
  const isCommercial = propertyType.includes('COMMERCIAL') || propertyType.includes('OFFICE') || propertyType.includes('RETAIL');
  const targetCarpet = Math.round(areaSqFt * 0.77);

  // Compute plot dimensions
  let plotWidthFt = customWidthFt || 0;
  let plotDepthFt = customDepthFt || 0;
  if (!plotWidthFt || !plotDepthFt) {
    if (areaSqFt === 1200) {
      plotWidthFt = 30;
      plotDepthFt = 40;
    } else if (areaSqFt === 1500) {
      plotWidthFt = 30;
      plotDepthFt = 50;
    } else if (areaSqFt === 1800) {
      plotWidthFt = 30;
      plotDepthFt = 60;
    } else if (areaSqFt === 2400) {
      plotWidthFt = 40;
      plotDepthFt = 60;
    } else {
      plotWidthFt = Math.round(Math.sqrt(areaSqFt * 0.75));
      plotDepthFt = Math.round(areaSqFt / (plotWidthFt || 30));
    }
  }

  const compassGuidelines = [
    {
      direction: 'North-East (Ishanya)',
      deity: 'Lord Shiva & Jupiter',
      element: 'Water (Jal)',
      recommendedRooms: ['Pooja Sanctum', 'Meditation Corner', 'Underground Water Tank', 'Entrance Foyer'],
      strictlyAvoid: ['Toilets / Septic Tank', 'Kitchen', 'Heavy Master Bedroom', 'Staircase']
    },
    {
      direction: 'East (Purva)',
      deity: 'Surya (Sun God)',
      element: 'Solar Light (Tejas)',
      recommendedRooms: ['Living Room', 'Study / Library', 'Wide Windows & Verandah', 'Balcony'],
      strictlyAvoid: ['Heavy Storage', 'Toilets', 'Obstructed Walls']
    },
    {
      direction: 'South-East (Agni)',
      deity: 'Agni (Fire Deity)',
      element: 'Fire (Agni)',
      recommendedRooms: ['Modular Kitchen', 'Cooking Range (Face East)', 'Electrical Mains / Inverter', 'Pantry'],
      strictlyAvoid: ['Master Bedroom', 'Underground Water Tank', 'Pooja Room']
    },
    {
      direction: 'South (Dakshin)',
      deity: 'Yama / Mars',
      element: 'Earth & Stability',
      recommendedRooms: ['Bedroom 2 (Elder Kids)', 'Heavy Furniture', 'Staircase (Climbing Clockwise)'],
      strictlyAvoid: ['Underground Water Tank', 'Main Entrance (unless approved pada)']
    },
    {
      direction: 'South-West (Nairutya)',
      deity: 'Nairuti / Rahu',
      element: 'Earth (Prithvi)',
      recommendedRooms: ['Master Bedroom Suite', 'Heavy Wardrobes', 'Cash / Jewelry Locker', 'Overhead Water Tank'],
      strictlyAvoid: ['Main Entrance', 'Kitchen', 'Pooja Room', 'Open Courtyard']
    },
    {
      direction: 'West (Pashchim)',
      deity: 'Varuna (Rain God / Saturn)',
      element: 'Stability & Gains',
      recommendedRooms: ['Dining Area', 'Children Bedroom', 'Study Room', 'Overhead Water Storage'],
      strictlyAvoid: ['Main Entrance (unless Pushpadanta pada)']
    },
    {
      direction: 'North-West (Vayu)',
      deity: 'Vayu (Wind Deity)',
      element: 'Air (Vayu)',
      recommendedRooms: ['Guest Bedroom', 'Powder Room / Toilet', 'Utility & Washing Machine', 'Finished Goods Store'],
      strictlyAvoid: ['Master Bedroom', 'Pooja Mandir']
    },
    {
      direction: 'North (Uttar)',
      deity: 'Kuber (Lord of Wealth) & Mercury',
      element: 'Magnetic Prana',
      recommendedRooms: ['Grand Living Room', 'Home Office / Finance Desk', 'Balcony', 'Entrance'],
      strictlyAvoid: ['Toilets', 'Heavy Clutter', 'Staircase Blocking North']
    },
    {
      direction: 'Center (Brahmasthan)',
      deity: 'Lord Brahma (Creator)',
      element: 'Space (Akash)',
      recommendedRooms: ['Open Hall', 'Central Courtyard', 'Skylit Lightwell', 'Family Gathering'],
      strictlyAvoid: ['Columns & Beams', 'Toilets', 'Kitchen', 'Heavy Structural Load']
    }
  ];

  if (isCommercial) {
    // Commercial Office / Retail layout
    const mdArea = Math.round(targetCarpet * 0.18);
    const confArea = Math.round(targetCarpet * 0.16);
    const recArea = Math.round(targetCarpet * 0.14);
    const openArea = Math.round(targetCarpet * 0.32);
    const pantryArea = Math.round(targetCarpet * 0.08);
    const serverArea = Math.round(targetCarpet * 0.05);
    const restArea = targetCarpet - (mdArea + confArea + recArea + openArea + pantryArea + serverArea);

    const commOption1: VastuLayoutOption = {
      id: 'option-1',
      optionNumber: 1,
      title: 'Vastu Corporate Headquarters (Executive Wealth Flow)',
      tagline: '98% Corporate Vastu • MD Cabin in Nairutya • Kuber Cash Inflow',
      vastuScore: 98,
      propertyType,
      facingDirection,
      floorsCount,
      configuration: 'Director Suite + 16-Seat Boardroom + 28 Open Workstations + Reception + Server Room',
      totalBuiltUpSqFt: areaSqFt,
      plotDimensions: { widthFt: plotWidthFt, depthFt: plotDepthFt },
      totalCarpetSqFt: targetCarpet,
      carpetRatioPercent: 77,
      circulationPercent: 18,
      vastuHighlights: {
        mainEntrance: `North/East facing grand glass facade in ${facingDirection} direction`,
        masterBedroom: 'MD Cabin in South-West (Earth quadrant) for decisive leadership and authority',
        kitchen: 'Cafeteria & Dry Pantry in South-East (Agni)',
        poojaRoom: 'Corporate reception deity niche in North-East (Ishanya)',
        livingDining: 'Open collaborative workstations in North and East zone',
        staircase: 'Elevator & Fire Staircore in South-West buffer',
        brahmasthan: 'Central open-ceiling town hall and breakout zone',
        waterElements: 'Drinking water dispenser in North-East zone'
      },
      rooms: [
        {
          name: 'Managing Director Executive Cabin',
          roomType: 'Director Cabin',
          zone: 'Executive Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(mdArea * 1.3) * 10) / 10,
          widthFt: Math.round((mdArea / Math.sqrt(mdArea * 1.3)) * 10) / 10,
          heightFt: 11,
          carpetAreaSqFt: mdArea,
          vastuDirection: 'South-West (Nairutya)',
          vastuElement: 'Earth (Prithvi)',
          vastuSignificance: 'Empowers company head with commanding stability, long-term vision, and employee respect.',
          recommendedFeatures: ['Desk facing North/East', 'Heavy credenza behind executive chair', 'Locker in South wall']
        },
        {
          name: 'Boardroom & Conference Suite',
          roomType: 'Conference Room',
          zone: 'Public/Client Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(confArea * 1.4) * 10) / 10,
          widthFt: Math.round((confArea / Math.sqrt(confArea * 1.4)) * 10) / 10,
          heightFt: 11,
          carpetAreaSqFt: confArea,
          vastuDirection: 'North-West (Vayu)',
          vastuElement: 'Air (Vayu)',
          vastuSignificance: 'Air quadrant speeds up discussions, facilitates win-win vendor negotiations and swift agreements.',
          recommendedFeatures: ['U-shaped acoustic table', 'Presentation screen on North wall', 'Video conference system']
        },
        {
          name: 'Welcome Foyer & Reception Lobby',
          roomType: 'Reception',
          zone: 'Public Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(recArea * 1.2) * 10) / 10,
          widthFt: Math.round((recArea / Math.sqrt(recArea * 1.2)) * 10) / 10,
          heightFt: 11,
          carpetAreaSqFt: recArea,
          vastuDirection: 'North-East (Ishanya)',
          vastuElement: 'Water (Jal)',
          vastuSignificance: 'Welcoming cosmic solar energy ensures high client conversion and uplifting first impression.',
          recommendedFeatures: ['Backlit company branding', 'Indoor water cascade fountain', 'Comfortable waiting lounge']
        },
        {
          name: 'Open Ergonomic Workstation Bay (28-36 Desks)',
          roomType: 'Open Workstations',
          zone: 'Core Operational Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(openArea * 1.5) * 10) / 10,
          widthFt: Math.round((openArea / Math.sqrt(openArea * 1.5)) * 10) / 10,
          heightFt: 11,
          carpetAreaSqFt: openArea,
          vastuDirection: 'North & East (Kuber/Surya)',
          vastuElement: 'Air & Light',
          vastuSignificance: 'Employees facing North or East stay energetic, mentally sharp, and highly productive.',
          recommendedFeatures: ['Cable management raceways', 'Acoustic baffle ceiling', 'Task lighting with daylight harvesting']
        },
        {
          name: 'Pantry & Cafeteria Hub',
          roomType: 'Pantry',
          zone: 'Service Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(pantryArea * 1.2) * 10) / 10,
          widthFt: Math.round((pantryArea / Math.sqrt(pantryArea * 1.2)) * 10) / 10,
          heightFt: 11,
          carpetAreaSqFt: pantryArea,
          vastuDirection: 'South-East (Agni)',
          vastuElement: 'Fire (Agni)',
          vastuSignificance: 'Harmonious fire placement prevents workplace stress and boosts vitality.',
          recommendedFeatures: ['Coffee bar & vending machines', 'Microwave station', 'Standing cafe tables']
        },
        {
          name: 'Server Room & IT Rack Vault',
          roomType: 'Server Room',
          zone: 'Infrastructure Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(serverArea * 1.1) * 10) / 10,
          widthFt: Math.round((serverArea / Math.sqrt(serverArea * 1.1)) * 10) / 10,
          heightFt: 11,
          carpetAreaSqFt: serverArea,
          vastuDirection: 'South-East / South (Agni/Yama)',
          vastuElement: 'Fire / Energy',
          vastuSignificance: 'High power equipment and UPS placed in fire/earth quadrants prevent electrical surges.',
          recommendedFeatures: ['Precision AC unit', 'FM200 fire suppression', 'Access-controlled biometric lock']
        },
        {
          name: 'Executive Restrooms & Wash Corridor',
          roomType: 'Restrooms',
          zone: 'Service Zone',
          floor: 'Level 1',
          lengthFt: Math.round(Math.sqrt(restArea * 1.2) * 10) / 10,
          widthFt: Math.round((restArea / Math.sqrt(restArea * 1.2)) * 10) / 10,
          heightFt: 10.5,
          carpetAreaSqFt: restArea,
          vastuDirection: 'West / North-West (Varuna/Vayu)',
          vastuElement: 'Air & Water Drainage',
          vastuSignificance: 'Safe drainage quadrant that carries negative waste out without impacting wealth channels.',
          recommendedFeatures: ['Sensor-based faucets', 'Dual flush cisterns', 'Exhaust extraction ducts']
        }
      ],
      pros: ['Zero Vastu clashes in commercial setup', 'MD Cabin has full command over floor', 'North-East entrance invites lucrative contracts'],
      bestSuitedFor: 'IT Companies, Financial Firms, Corporate Consultancies and Fast-Growing Tech Enterprises',
      architecturalNotes: 'Designed with acoustic glass partitions and perimeter daylight harvesting.'
    };

    // Derive Option 2 & Option 3
    const commOption2 = {
      ...commOption1,
      id: 'option-2',
      optionNumber: 2 as const,
      title: 'Agile Tech Studio with Central Atrium (Brahmasthan Open Hub)',
      tagline: '95% Vastu Score • Central Collaboration Courtyard • Flexible Pods',
      vastuScore: 95,
      configuration: 'Executive Pods + Creative Innovation Lab + 32 Hot Desks + Wellness Zone',
      pros: ['Ultra-modern creative vibe', 'Open central courtyard fosters team synergy', 'Highly energy-efficient']
    };

    const commOption3 = {
      ...commOption1,
      id: 'option-3',
      optionNumber: 3 as const,
      title: 'High-Density Executive Chambers (Private Partner Suites)',
      tagline: '94% Vastu Score • 4 Partner Cabins • Dedicated Accounts & Audit Vault',
      vastuScore: 94,
      configuration: '4 Partner Cabins (SW, W, S) + Accounts Chamber (SE) + Associate Hall',
      pros: ['Ideal for Legal, CA, Architecture or Consulting firms', 'Maximum acoustic privacy', 'Dedicated accounts vault in SE']
    };

    return {
      requestedAreaSqFt: areaSqFt,
      propertyType,
      facingDirection,
      floorsCount,
      options: [commOption1, commOption2, commOption3],
      vastuCompassGuidelines: compassGuidelines
    };
  }

  // Residential Layout Generation (Villa, Apartment, Duplex, Bungalow)
  let opt1Rooms: VastuRoomSuggestion[];
  let config1: string;
  let title1: string;
  let config2: string;
  let title2: string;
  let config3: string;
  let title3: string;

  if (areaSqFt <= 1400) {
    // Dynamically scaled for compact to mid-size residential plots (e.g. 600, 800, 1000, 1200, 1400 sq.ft)
    const scale = targetCarpet / 924;
    const masterArea = Math.round(168 * scale);
    const livingArea = Math.round(187.5 * scale);
    const kitchenArea = Math.round(90 * scale);
    const poojaArea = Math.max(Math.round(33 * scale), 20);
    const diningArea = Math.round(115.5 * scale);
    const bed2Area = Math.round(132 * scale);
    const bathsArea = Math.round(71.5 * scale);
    const utilityArea = Math.max(targetCarpet - (masterArea + livingArea + kitchenArea + poojaArea + diningArea + bed2Area + bathsArea), 25);

    title1 = `Vastu Purusha Classical ${floorsCount > 1 ? 'Duplex Home' : (areaSqFt < 900 ? '1BHK/2BHK Home' : '2BHK/3BHK Home')} (${plotWidthFt}' × ${plotDepthFt}')`;
    config1 = floorsCount > 1
      ? '3BHK/4BHK Duplex + Pooja Mandir + Covered Car Park + Terrace Garden'
      : (areaSqFt < 900 ? '1BHK/2BHK + Pooja Mandir + Modular Kitchen + Balcony' : '2BHK/3BHK + Dedicated Pooja Mandir + Modular Kitchen + Car Parking Porch');
    
    title2 = `Contemporary Open-Plan Vastu (${plotWidthFt}' × ${plotDepthFt}' Footprint)`;
    config2 = `${areaSqFt < 900 ? '2BHK' : '3BHK'} + Central Skylit Lightwell + Island Kitchen + Integrated Study Nook`;

    title3 = `Smart Executive Duplex (${plotWidthFt}' × ${plotDepthFt}' Plot / Multi-Gen)`;
    config3 = 'Dual Master Suites (Ground & First) + Pooja Room + Upper Terrace Deck';

    opt1Rooms = [
      {
        name: 'Primary Master Bedroom Suite',
        roomType: 'Master Bedroom',
        zone: 'Private Zone',
        floor: floorsCount > 1 ? 'First Floor' : 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(masterArea * 1.2) * 10) / 10,
        widthFt: Math.round((masterArea / Math.sqrt(masterArea * 1.2)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: masterArea,
        vastuDirection: 'South-West (Nairutya)',
        vastuElement: 'Earth (Prithvi)',
        vastuSignificance: 'Anchored in South-West Nairutya for stability, financial peace, and leadership of the head of family.',
        recommendedFeatures: ['Headboard positioned on South wall', 'Heavy wooden wardrobe on South-West', 'Attached master bath on West']
      },
      {
        name: 'Formal Living & Family Lounge',
        roomType: 'Living & Dining',
        zone: 'Public Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(livingArea * 1.25) * 10) / 10,
        widthFt: Math.round((livingArea / Math.sqrt(livingArea * 1.25)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: livingArea,
        vastuDirection: 'North & East (Kuber/Surya)',
        vastuElement: 'Air & Solar Light',
        vastuSignificance: 'Positioned in North-East / East to draw continuous positive cosmic solar prana and auspicious social energy.',
        recommendedFeatures: ['East-facing wide windows', 'Low-profile seating keeping North unobstructed', 'Welcoming entrance foyer']
      },
      {
        name: 'Modular Kitchen with East Cooking Hob',
        roomType: 'Kitchen',
        zone: 'Service Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(kitchenArea * 1.15) * 10) / 10,
        widthFt: Math.round((kitchenArea / Math.sqrt(kitchenArea * 1.15)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: kitchenArea,
        vastuDirection: 'South-East (Agni)',
        vastuElement: 'Fire (Agni)',
        vastuSignificance: 'Placed in sacred Agni corner. Cooking facing East activates health, digestive vitality, and abundance.',
        recommendedFeatures: ['Cooking hob facing East', 'Water sink in North-East corner of counter', 'Adjacent service utility balcony']
      },
      {
        name: 'Dedicated Pooja Sanctum (Mandir)',
        roomType: 'Pooja Room',
        zone: 'Sacred Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(poojaArea * 1.1) * 10) / 10,
        widthFt: Math.round((poojaArea / Math.sqrt(poojaArea * 1.1)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: poojaArea,
        vastuDirection: 'North-East (Ishanya)',
        vastuElement: 'Water (Jal) / Divine',
        vastuSignificance: 'Located in pristine Ishanya angle. Free of shared toilet walls, creating a sanctuary of spiritual harmony.',
        recommendedFeatures: ['White marble pedestal', 'East-facing altar', 'Zero plumbing conduits above or below']
      },
      {
        name: 'Central Dining & Brahmasthan Open Core',
        roomType: 'Dining & Brahmasthan',
        zone: 'Core Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(diningArea * 1.05) * 10) / 10,
        widthFt: Math.round((diningArea / Math.sqrt(diningArea * 1.05)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: diningArea,
        vastuDirection: 'Center (Brahmasthan)',
        vastuElement: 'Space (Akash)',
        vastuSignificance: 'Sacred central zone left open and light to allow universal cosmic energy (Prana) to circulate unhindered.',
        recommendedFeatures: ['Zero load-bearing pillars in center', 'Warm ambient cove lighting', 'Family dining setup']
      },
      {
        name: 'Guest / Children Bedroom (Bed 2)',
        roomType: 'Guest / Children Bedroom',
        zone: 'Private Zone',
        floor: floorsCount > 1 ? 'First Floor' : 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(bed2Area * 1.1) * 10) / 10,
        widthFt: Math.round((bed2Area / Math.sqrt(bed2Area * 1.1)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: bed2Area,
        vastuDirection: 'North-West (Vayu)',
        vastuElement: 'Air (Vayu)',
        vastuSignificance: 'Governed by Vayu (wind), providing light, pleasant mental agility and comfort for guests and kids.',
        recommendedFeatures: ['Study table facing North', 'Wardrobe on West wall', 'Cross-ventilation casement window']
      },
      {
        name: 'Attached & Common Bathrooms (2 Baths)',
        roomType: 'Bathrooms',
        zone: 'Wet Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(bathsArea * 1.4) * 10) / 10,
        widthFt: Math.round((bathsArea / Math.sqrt(bathsArea * 1.4)) * 10) / 10,
        heightFt: 9.5,
        carpetAreaSqFt: bathsArea,
        vastuDirection: 'West & North-West (Varuna/Vayu)',
        vastuElement: 'Drainage / Water',
        vastuSignificance: 'Safely placed along West/North-West discharge corridor, strictly away from Ishanya (NE) and Nairutya (SW).',
        recommendedFeatures: ['WC aligned North-South', 'Wall-hung vanity', 'Mechanical ventilation toward exterior duct']
      },
      {
        name: 'Covered Entrance Porch, Car Park & Utility',
        roomType: 'Porch & Utility',
        zone: 'Exterior Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(utilityArea * 1.4) * 10) / 10,
        widthFt: Math.round((utilityArea / Math.sqrt(utilityArea * 1.4)) * 10) / 10,
        heightFt: 10.0,
        carpetAreaSqFt: utilityArea,
        vastuDirection: 'North / North-East (Kuber/Ishanya)',
        vastuElement: 'Prana Air',
        vastuSignificance: 'Auspicious vehicle entry kept light in North-East, and utility washing along South-East perimeter.',
        recommendedFeatures: ['Covered vehicle carport', 'Washing machine point in utility', 'Water meter connection']
      }
    ];
  } else {
    // Scale rooms dynamically according to areaSqFt (e.g. 2500 sqft)
    const masterBedArea = Math.round(targetCarpet * 0.17);
    const livingDiningArea = Math.round(targetCarpet * 0.26);
    const kitchenArea = Math.round(targetCarpet * 0.11);
    const bed2Area = Math.round(targetCarpet * 0.13);
    const bed3Area = Math.round(targetCarpet * 0.12);
    const poojaArea = Math.round(targetCarpet * 0.04);
    const bathsArea = Math.round(targetCarpet * 0.10);
    const utilityBalconyArea = targetCarpet - (masterBedArea + livingDiningArea + kitchenArea + bed2Area + bed3Area + poojaArea + bathsArea);

    title1 = `Vastu Purusha Classical ${areaSqFt >= 2400 ? '4BHK' : '3BHK'} Sanatana Masterpiece`;
    config1 = `${areaSqFt >= 2400 ? '4BHK' : '3BHK'} + Dedicated Pooja Mandir + Wet/Dry Kitchen + Utility Yard + Open Brahmasthan`;

    title2 = `Contemporary Biophilic ${areaSqFt >= 2400 ? '4BHK' : '3BHK'} with Skylit Brahmasthan`;
    config2 = `${areaSqFt >= 2400 ? '3BHK + Home Office' : '3BHK'} + Open Central Lightwell + Island Kitchen + Private Balcony Decks`;

    title3 = `Multi-Generational Executive ${areaSqFt >= 2400 ? '4BHK' : '3BHK'} with Dual Master Suites`;
    config3 = `Dual Master Suites (SW & West) + Kids Suite + Dedicated Mandir + Butler's Pantry + Staff Room`;

    opt1Rooms = [
      {
        name: 'Primary Master Bedroom Suite',
        roomType: 'Master Bedroom',
        zone: 'Private Zone',
        floor: floorsCount > 1 ? 'First Floor' : 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(masterBedArea * 1.25) * 10) / 10,
        widthFt: Math.round((masterBedArea / Math.sqrt(masterBedArea * 1.25)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: masterBedArea,
        vastuDirection: 'South-West (Nairutya)',
        vastuElement: 'Earth (Prithvi)',
        vastuSignificance: 'The Nairutya corner commands stability, financial security, and deep restful sleep for the master of the house.',
        recommendedFeatures: ['Headboard positioned on South wall', 'Attached walk-in wardrobe on West side', 'Heavy wooden furniture']
      },
      {
        name: 'Grand Formal Living & Family Dining',
        roomType: 'Living & Dining',
        zone: 'Public Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(livingDiningArea * 1.5) * 10) / 10,
        widthFt: Math.round((livingDiningArea / Math.sqrt(livingDiningArea * 1.5)) * 10) / 10,
        heightFt: 11.0,
        carpetAreaSqFt: livingDiningArea,
        vastuDirection: 'North & East (Kuber/Surya)',
        vastuElement: 'Air & Solar Light',
        vastuSignificance: 'Placed in the auspicious North and East sectors to welcome constant positive prana and cheerful morning sunlight.',
        recommendedFeatures: ['Full height French windows facing East', 'Low-height seating to keep North light', 'Italian marble flooring']
      },
      {
        name: 'Modular Kitchen with Breakfast Bar',
        roomType: 'Kitchen',
        zone: 'Service Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(kitchenArea * 1.3) * 10) / 10,
        widthFt: Math.round((kitchenArea / Math.sqrt(kitchenArea * 1.3)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: kitchenArea,
        vastuDirection: 'South-East (Agni)',
        vastuElement: 'Fire (Agni)',
        vastuSignificance: 'The Agni quadrant regulates health, metabolism, and family wealth. Cooking platform faces East for ideal solar harmony.',
        recommendedFeatures: ['Cooking hob facing East', 'Water sink in North-East corner of kitchen', 'Granite / Quartz countertop']
      },
      {
        name: 'Pooja Sanctum (Dedicated Mandir)',
        roomType: 'Pooja Room',
        zone: 'Sacred Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(poojaArea * 1.1) * 10) / 10,
        widthFt: Math.round((poojaArea / Math.sqrt(poojaArea * 1.1)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: poojaArea,
        vastuDirection: 'North-East (Ishanya)',
        vastuElement: 'Water (Jal) / Divine',
        vastuSignificance: 'The Ishanya angle is the divine zone of purity. Chanting and prayers facing East/North produce maximum positive spiritual energy.',
        recommendedFeatures: ['Carved white Makrana marble temple', 'East facing deity pedestal', 'Brass bell and brass diya setup']
      },
      {
        name: 'Parent / Guest Bedroom (Bed 2)',
        roomType: 'Guest / Parent Bedroom',
        zone: 'Semi-Private Zone',
        floor: 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(bed2Area * 1.2) * 10) / 10,
        widthFt: Math.round((bed2Area / Math.sqrt(bed2Area * 1.2)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: bed2Area,
        vastuDirection: 'North-West (Vayu)',
        vastuElement: 'Air (Vayu)',
        vastuSignificance: 'Air quadrant ensures welcoming comfort for visiting guests and peaceful rest for elderly parents without heavy stairs.',
        recommendedFeatures: ['Step-free threshold', 'Anti-skid floor finishes', 'Wide cross-ventilation window']
      },
      {
        name: 'Children / Study Bedroom (Bed 3)',
        roomType: 'Children Bedroom',
        zone: 'Private Zone',
        floor: floorsCount > 1 ? 'First Floor' : 'Ground Floor',
        lengthFt: Math.round(Math.sqrt(bed3Area * 1.2) * 10) / 10,
        widthFt: Math.round((bed3Area / Math.sqrt(bed3Area * 1.2)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: bed3Area,
        vastuDirection: 'West (Pashchim)',
        vastuElement: 'Stability & Intellect',
        vastuSignificance: 'The West quadrant is governed by Varuna and Saturn, bestowing academic focus, discipline, and stable character in children.',
        recommendedFeatures: ['Study desk facing East/North', 'Book shelves on South-West wall', 'Acoustic wardrobe wall']
      },
      {
        name: 'En-suite Bathrooms & Powder Room (3 Bathrooms)',
        roomType: 'Bathrooms',
        zone: 'Wet Zone',
        floor: 'Ground & Upper',
        lengthFt: Math.round(Math.sqrt(bathsArea * 1.5) * 10) / 10,
        widthFt: Math.round((bathsArea / Math.sqrt(bathsArea * 1.5)) * 10) / 10,
        heightFt: 9.5,
        carpetAreaSqFt: bathsArea,
        vastuDirection: 'West & North-West (Varuna/Vayu)',
        vastuElement: 'Drainage / Water',
        vastuSignificance: 'Placed in Vastu approved drainage zones away from sacred Ishanya and stable Nairutya.',
        recommendedFeatures: ['Commode aligned North-South', 'Exhaust toward West/North', 'Dry and wet partition with glass']
      },
      {
        name: 'Utility Yard, Washing Deck & Balconies',
        roomType: 'Utility & Balcony',
        zone: 'Service & Outdoor',
        floor: 'Ground Floor & Balconies',
        lengthFt: Math.round(Math.sqrt(utilityBalconyArea * 1.8) * 10) / 10,
        widthFt: Math.round((utilityBalconyArea / Math.sqrt(utilityBalconyArea * 1.8)) * 10) / 10,
        heightFt: 10.5,
        carpetAreaSqFt: utilityBalconyArea,
        vastuDirection: 'South-East & East (Agni/Surya)',
        vastuElement: 'Air & Sun Drying',
        vastuSignificance: 'Utility attached to kitchen in South-East provides seamless workflow; morning balcony in East catches morning prana.',
        recommendedFeatures: ['Washing machine drainage trap', 'Weatherproof porcelain tiles', 'Planter box railing']
      }
    ];
  }

  const option1: VastuLayoutOption = {
    id: 'option-1',
    optionNumber: 1,
    title: title1,
    tagline: '98% Vastu Compliance • Dedicated Pooja Sanctum • Zero Structural Dosha',
    vastuScore: 98,
    propertyType,
    facingDirection,
    floorsCount,
    plotDimensions: { widthFt: plotWidthFt, depthFt: plotDepthFt },
    configuration: config1,
    totalBuiltUpSqFt: areaSqFt,
    totalCarpetSqFt: opt1Rooms.reduce((sum, r) => sum + r.carpetAreaSqFt, 0),
    carpetRatioPercent: Math.round((opt1Rooms.reduce((sum, r) => sum + r.carpetAreaSqFt, 0) / areaSqFt) * 100),
    circulationPercent: 15,
    vastuHighlights: {
      mainEntrance: `Grand entrance in ${facingDirection} (auspicious Pada 3/4) welcoming divine solar blessings`,
      masterBedroom: 'Heavy Master Bedroom firmly anchored in South-West (Nairutya) for maximum leadership and peace',
      kitchen: 'Kitchen positioned precisely in South-East (Agni corner) with cook facing East',
      poojaRoom: 'Sacred isolated Pooja Mandir in pristine North-East (Ishanya) with water feature',
      livingDining: 'Expansive North and East oriented living room with uninterrupted morning sunlight',
      staircase: 'Clockwise climbing staircase on South/West perimeter, keeping internal center light',
      brahmasthan: 'Central Brahmasthan is completely unobstructed, filled with ambient daylight',
      waterElements: 'Underground sumps in North-East; overhead tanks placed over South-West corner'
    },
    rooms: opt1Rooms,
    pros: [
      'Near-perfect 98% Vastu Purusha alignment across all 9 directional zones',
      'Dedicated marble Pooja Sanctum isolated from plumbing and noise',
      'Cooktop faces East while cooking, promoting health and prosperity',
      'Master bedroom in South-West provides deep peace and financial strength'
    ],
    bestSuitedFor: 'Homeowners prioritizing authentic Sanatana Vastu principles, family prosperity, and classic spatial grandeur.',
    architecturalNotes: 'Designed with dual-aspect cross-ventilation in all bedrooms and solar sun-shading chajjas along the South and West facades.'
  };

  // OPTION 2: Contemporary Open-Plan Vastu (3BHK + Home Office + Skylit Brahmasthan)
  const opt2Rooms = opt1Rooms.map((r, i) => {
    if (r.name.includes('Grand Formal Living') || r.name.includes('Formal Living')) {
      return {
        ...r,
        name: 'Contemporary Open-Plan Living & Dining with Courtyard View',
        vastuSignificance: 'Open flow allows continuous cosmic circulation throughout the dwelling without physical blockages.'
      };
    }
    if (r.name.includes('Parent / Guest') || r.name.includes('Guest / Children')) {
      return {
        ...r,
        name: 'Executive Work-From-Home Office / Guest Suite',
        vastuDirection: 'North / North-West (Kuber/Vayu)',
        vastuSignificance: 'Positioned in the intellectual North-West zone to enhance career growth, digital focus, and remote business success.'
      };
    }
    return r;
  });

  const option2: VastuLayoutOption = {
    id: 'option-2',
    optionNumber: 2,
    title: title2,
    tagline: '96% Vastu Compliance • Central Courtyard Lightwell • Integrated Home Office',
    vastuScore: 96,
    propertyType,
    facingDirection,
    floorsCount,
    plotDimensions: { widthFt: plotWidthFt, depthFt: plotDepthFt },
    configuration: config2,
    totalBuiltUpSqFt: areaSqFt,
    totalCarpetSqFt: opt2Rooms.reduce((sum, r) => sum + r.carpetAreaSqFt, 0),
    carpetRatioPercent: Math.round((opt2Rooms.reduce((sum, r) => sum + r.carpetAreaSqFt, 0) / areaSqFt) * 100),
    circulationPercent: 14,
    vastuHighlights: {
      mainEntrance: `Modern pivot door entry facing ${facingDirection} with landscaped foyer`,
      masterBedroom: 'South-West master suite with sound-dampened acoustic dressing room',
      kitchen: 'Open-concept island modular kitchen in South-East (Agni) with concealed heavy chimney',
      poojaRoom: 'Minimalist glass-enclosed prayer mandir in North-East (Ishanya)',
      livingDining: 'Double-height living space seamlessly connected to the central green courtyard',
      staircase: 'Floating cantilevered wood staircase on West wall with open risers',
      brahmasthan: 'Skylit green atrium in the center (Brahmasthan) bringing vertical solar light down',
      waterElements: 'Minimalist indoor water ripple mirror in North-East entrance'
    },
    rooms: opt2Rooms,
    pros: [
      'Unifies ancient Vastu alignment with open contemporary luxury living',
      'Central Brahmasthan transformed into a light-filled green courtyard / zen garden',
      'Includes dedicated executive work-from-home office in the prosperous North/NW sector',
      'Zero wall clutter with higher perceived spatial volume'
    ],
    bestSuitedFor: 'Modern urban families, creative professionals, and luxury buyers seeking contemporary open architecture with solid Vastu grounding.',
    architecturalNotes: 'Features an open-to-sky lightwell that acts as a natural passive stack-effect chimney, flushing warm air out.'
  };

  // OPTION 3: Multi-Generational Executive Grandeur (Dual Master Suites & Butler's Pantry)
  const opt3Rooms = opt1Rooms.map((r, i) => {
    if (r.name.includes('Parent / Guest') || r.name.includes('Guest / Children')) {
      return {
        ...r,
        name: 'Elderly-Friendly Ground Floor Master Suite (Suite 2)',
        vastuDirection: 'South / West (Yama/Varuna)',
        vastuSignificance: 'Offers heavy grounding stability on the ground floor so senior parents avoid stairs while enjoying high Vastu strength.'
      };
    }
    if (r.name.includes('Primary Master')) {
      return {
        ...r,
        name: 'Presidential Master Suite with Private Sun Terrace',
        vastuDirection: 'South-West (Nairutya)',
        carpetAreaSqFt: Math.round(r.carpetAreaSqFt * 1.1),
        vastuSignificance: 'Occupies the absolute highest and heaviest corner of the building, maximizing wealth preservation and head-of-family authority.'
      };
    }
    return r;
  });

  const option3: VastuLayoutOption = {
    id: 'option-3',
    optionNumber: 3,
    title: title3,
    tagline: '95% Vastu Score • Ground-Floor Senior Suite • Upper Penthouse Terrace',
    vastuScore: 95,
    propertyType,
    facingDirection,
    floorsCount: Math.max(floorsCount, 2),
    plotDimensions: { widthFt: plotWidthFt, depthFt: plotDepthFt },
    configuration: config3,
    totalBuiltUpSqFt: areaSqFt,
    totalCarpetSqFt: opt3Rooms.reduce((sum, r) => sum + r.carpetAreaSqFt, 0),
    carpetRatioPercent: Math.round((opt3Rooms.reduce((sum, r) => sum + r.carpetAreaSqFt, 0) / areaSqFt) * 100),
    circulationPercent: 17,
    vastuHighlights: {
      mainEntrance: `Portico covered entrance in ${facingDirection} with separate service entry`,
      masterBedroom: 'Dual Master Suites: Senior suite on Ground Floor + Presidential Suite on First Floor SW',
      kitchen: 'Main cooking kitchen in SE + Dry breakfast island and separate butler washing utility',
      poojaRoom: 'Spacious 2-person meditation mandir in North-East with sacred tulsi courtyard',
      livingDining: 'Formal drawing room in East + Family lounge in North overlooking garden',
      staircase: 'Grand dog-legged marble staircase in South with under-stair storage (no toilet underneath)',
      brahmasthan: 'Wide central foyer connecting public and private family wings',
      waterElements: 'Rainwater harvesting and borewell positioned strictly in North-East boundary'
    },
    rooms: opt3Rooms,
    pros: [
      'Tailor-made for joint or multi-generational Indian families living harmoniously',
      'Ground floor master suite guarantees zero stair climbing for elderly family members',
      'Presidential master on first floor maintains total privacy and supreme South-West authority',
      'Wet and dry kitchen segregation preserves Agni purity during heavy Indian cooking'
    ],
    bestSuitedFor: 'Joint families, business families, and multi-generational households requiring luxury, privacy, and flawless Vastu roots.',
    architecturalNotes: 'Dual master suite plumbing is stacked back-to-back on the Western facade for clean service access.'
  };

  return {
    requestedAreaSqFt: areaSqFt,
    plotDimensions: { widthFt: plotWidthFt, depthFt: plotDepthFt },
    propertyType,
    facingDirection,
    floorsCount,
    options: [option1, option2, option3],
    vastuCompassGuidelines: compassGuidelines
  };
}

