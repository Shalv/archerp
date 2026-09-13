/**
 * Comprehensive Data Registry for Customer Discovery, Sample Image Heads,
 * Professional Visual Information Pack, and AI Design Generator Options.
 */

export interface CustomerDiscoveryData {
  // A. Basic customer details
  customerName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  whatsapp: string;
  projectLocation: string;
  preferredCommunication: 'WHATSAPP' | 'PHONE' | 'EMAIL' | 'IN_PERSON';
  decisionMakers: string;
  expectedStartDate: string;
  expectedCompletionDate: string;

  // B. Project type (one or more)
  projectTypes: string[];

  // C. Property details
  plotSizeDimensions: string;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  numberOfFloors: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  balconyTerraceRequirements: string;
  constructionScope: 'NEW_CONSTRUCTION' | 'RENOVATION' | 'INTERIOR_ONLY' | 'ARCH_INTERIOR_COMBINED';
  directionFacing: 'NORTH' | 'EAST' | 'NORTH_EAST' | 'WEST' | 'SOUTH' | 'NOT_SPECIFIED';
  roadWidthAndApproach: string;
  parkingRequirements: string;
  localAuthorityOrSocietyRestrictions: string;
  existingDrawingsAvailable: boolean;

  // D. Space-wise requirements (Rooms)
  roomRequirements: {
    id: string;
    areaName: string;
    dimensions: string;
    requiredFurniture: string;
    storageRequirements: string;
    lightingRequirements: string;
    electricalPlumbingPoints: string;
    preferredMaterials: string;
    colourPreferences: string;
    specialNeeds: string;
    budgetPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];

  // Specific Kitchen Requirements
  kitchenDetails: {
    layoutType: 'PARALLEL' | 'L_SHAPED' | 'U_SHAPED' | 'ISLAND' | 'STRAIGHT';
    tallUnitRequired: boolean;
    chimneyAndHob: string;
    dishwasher: boolean;
    refrigeratorSize: string;
    pantryRequired: boolean;
    countertopMaterial: string;
    constructionType: 'MODULAR' | 'CIVIL_SEMI_MODULAR' | 'FULL_BESPOKE';
    storagePreference: string;
  };

  // E. Lifestyle and functional requirements
  familyMembersCount: number;
  hasChildrenOrElderly: string;
  workFromHomeRequirements: string;
  petRequirements: string;
  vastuPreference: 'STRICT' | 'MODERATE' | 'NOT_IMPORTANT';
  accessibilityRequirements: string;
  smartHomeRequirements: string;
  securityCctv: boolean;
  homeTheatre: boolean;
  prayerPoojaRoom: boolean;
  servantRoom: boolean;
  utilityLaundryArea: boolean;
  futureExpansionPlans: string;

  // F. Style preferences
  selectedStyles: string[];
  preferredColours: string[];
  coloursToAvoid: string[];
  preferredFlooring: string;
  woodFinishPreference: string;
  metalFinishPreference: string;
  glossOrMatte: 'MATTE' | 'GLOSSY' | 'SATIN_SEMI_GLOSS' | 'TEXTURED';
  openOrClosedSpaces: 'OPEN_CONCEPT' | 'CLOSED_COMPARTMENTALIZED' | 'HYBRID_FLEXIBLE';
  lightingInteriorAtmosphere: 'LIGHT_AIRY' | 'WARM_MOODY' | 'NEUTRAL_BALANCED';
  preferredBrands: string;

  // G. Budget and commercial details
  budgetTier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  overallBudgetINR: number;
  architectureBudgetINR: number;
  interiorBudgetINR: number;
  civilBudgetINR: number;
  furnitureBudgetINR: number;
  mepBudgetINR: number;
  kitchenWardrobeBudgetINR: number;
  preferredPaymentTerms: string;
  isGstIncluded: boolean;
  budgetFlexibility: 'STRICT_CAP' | 'MODERATE_10_PERCENT' | 'FLEXIBLE_FOR_QUALITY';
  financingLoanRequired: boolean;
  phaseWiseExecution: boolean;

  // H. Approvals, documentation & design references
  documentsAvailable: string[];
  clientPinterestInstagramLinks: string;
  preferredImagesCount: number;
  dislikedDesignsNotes: string;
}

export interface CategorySampleHead {
  id: string;
  category: 'ARCHITECTURE' | 'INTERIOR' | 'CONSTRUCTION' | 'MATERIALS';
  headName: string;
  description: string;
  imageUrl: string;
  sourceType: 'AI_GENERATED' | 'MANUAL_UPLOAD' | 'ARCHITECTURAL_LIBRARY';
  updatedAt: string;
  tags: string[];
  aspectRatio?: string;
}

export const INITIAL_CUSTOMER_DISCOVERY: CustomerDiscoveryData = {
  customerName: 'Vikram & Radhika Malhotra',
  contactPerson: 'Vikram Malhotra (Managing Director)',
  mobile: '+91 98201 44592',
  email: 'vikram.malhotra@skylineventures.in',
  whatsapp: '+91 98201 44592',
  projectLocation: 'Skyline Seaface Towers, Unit 1402, Worli, Mumbai',
  preferredCommunication: 'WHATSAPP',
  decisionMakers: 'Vikram Malhotra & Radhika Malhotra (Spouse)',
  expectedStartDate: '2026-04-01',
  expectedCompletionDate: '2026-08-30',

  projectTypes: ['Apartment', 'Interior-only project', 'Renovation/remodelling'],

  plotSizeDimensions: 'Tower Floor Plate: 45ft x 65ft',
  builtUpAreaSqFt: 3400,
  carpetAreaSqFt: 2850,
  numberOfFloors: 1,
  numberOfBedrooms: 4,
  numberOfBathrooms: 5,
  balconyTerraceRequirements: 'Wrap-around 180-degree Arabian Sea-facing deck with timber composite deck flooring and biophilic planter troughs.',
  constructionScope: 'INTERIOR_ONLY',
  directionFacing: 'NORTH_EAST',
  roadWidthAndApproach: '60ft Arterial Road, Basement 2 Dedicated Freight Loading Dock',
  parkingRequirements: '3 Covered Reserved Podium Slots with EV 11kW Wallbox Chargers',
  localAuthorityOrSocietyRestrictions: 'Working hours strictly 9:00 AM - 6:00 PM; no noisy civil demolition on Sundays. Society NOC required for lift wall alteration.',
  existingDrawingsAvailable: true,

  roomRequirements: [
    {
      id: 'room-1',
      areaName: 'Double-Height Living & Dining Forum',
      dimensions: '32ft x 22ft (704 sq.ft)',
      requiredFurniture: '10-seater formal dining with marble top, custom L-shaped modular sectional sofa, 2 accent swivel lounge chairs, fluted coffee table.',
      storageRequirements: 'Concealed bar cabinet with motorized pocket doors, floating credenza.',
      lightingRequirements: 'DALI magnetic architectural track lights 3000K, cove ambient lighting, bespoke dining pendant fixture.',
      electricalPlumbingPoints: 'Floor pop-up brass boxes for power/HDMI, automated motorized roller blind points.',
      preferredMaterials: 'Imported Botticino Classico Italian Marble, Natural Smoked Teak Veneer, Brushed Brass trims.',
      colourPreferences: 'Warm Ivory, Muted Champagne, Natural Walnut, Sage Green accents.',
      specialNeeds: 'Acoustic baffle ceiling to control seaface wind reverb.',
      budgetPriority: 'HIGH'
    },
    {
      id: 'room-2',
      areaName: 'Master Bedroom Ensuite & Walk-in Wardrobe',
      dimensions: '24ft x 18ft + 14ft x 10ft Dresser',
      requiredFurniture: 'King bed with upholstered leather headboard, dual floating nightstands with wireless charging, chaise lounge.',
      storageRequirements: '18 running feet floor-to-ceiling glass wardrobe with interior sensor LED strips and dehumidified jewelry drawers.',
      lightingRequirements: 'Warm indirect cove lights 2700K, directional reading sconces, dimmer switches.',
      electricalPlumbingPoints: 'Jacuzzi plumbing, wall-hung WC with sensor flush, automation touchpads on both bedside panels.',
      preferredMaterials: 'Engineered European Oak Herringbone parquet, acoustic fluted charcoal wall panelling.',
      colourPreferences: 'Warm Greige, Charcoal, Natural Oak.',
      specialNeeds: 'Blackout motorized double drapery track, zero noise AC ducting.',
      budgetPriority: 'HIGH'
    },
    {
      id: 'room-3',
      areaName: 'Executive Study / Work-from-Home Studio',
      dimensions: '16ft x 14ft (224 sq.ft)',
      requiredFurniture: 'Executive solid oak desk, Herman Miller ergonomic chair, client meeting loveseat, floor-to-ceiling bookshelves.',
      storageRequirements: 'Document safe with biometric lock, concealed printer pull-out tray.',
      lightingRequirements: 'Glare-free 4000K task lighting, zoom-call background wall wash.',
      electricalPlumbingPoints: 'Dedicated 2kVA online UPS line, Cat6A Gigabit LAN ports, acoustic isolation.',
      preferredMaterials: 'Fluted glass acoustic partitions, PU matte lacquered shelving.',
      colourPreferences: 'Deep Navy Blue, Warm Oak, Antique Brass.',
      specialNeeds: 'Double-glazed acoustic sliding door (42 STC rating) for noise-free video conferences.',
      budgetPriority: 'MEDIUM'
    },
    {
      id: 'room-4',
      areaName: 'Gourmet Modular Kitchen & Dry Pantry',
      dimensions: '18ft x 14ft (252 sq.ft)',
      requiredFurniture: 'Central 8ft island with waterfall quartz countertop and 4 barstools.',
      storageRequirements: 'Pantry larder unit with Blum motorized servo-drive pullouts, corner magic carousel, tandem drawers.',
      lightingRequirements: 'Under-cabinet continuous 3500K LED task lighting, recessed anti-glare downlights.',
      electricalPlumbingPoints: 'RO water purifier line, dishwasher inlet/outlet, heavy load points for induction and combi-steam oven.',
      preferredMaterials: 'Ultra-compact porcelain slab countertop (Neolith/Dekton), anti-fingerprint acrylic and PU matte shutters.',
      colourPreferences: 'Warm Cashmere Grey, Nero Marquina accents.',
      specialNeeds: 'Heavy-duty 1400 m³/hr ducted chimney, garbage disposal unit in sink.',
      budgetPriority: 'HIGH'
    }
  ],

  kitchenDetails: {
    layoutType: 'ISLAND',
    tallUnitRequired: true,
    chimneyAndHob: 'Faber/Elica 90cm 1400 m³/hr ducted chimney + 4-burner brass induction hybrid hob',
    dishwasher: true,
    refrigeratorSize: '650L French Door Inverter Refrigerator (Samsung/Bosch)',
    pantryRequired: true,
    countertopMaterial: 'Dekton 15mm Heat & Scratch Resistant Porcelain Slab',
    constructionType: 'MODULAR',
    storagePreference: 'Blum Tandembox antaro soft-close pullout drawers with cutlery trays and spice organizers'
  },

  familyMembersCount: 4,
  hasChildrenOrElderly: '2 teenage children (15 and 18 years); elderly parents visit quarterly (need step-free shower access).',
  workFromHomeRequirements: 'Dedicated soundproof executive study for daily international video calls.',
  petRequirements: '1 Golden Retriever; scratch-resistant low-porosity flooring and durable performance fabrics required.',
  vastuPreference: 'MODERATE',
  accessibilityRequirements: 'Wide door openings (minimum 36"), zero-threshold transitions between living and balcony deck.',
  smartHomeRequirements: 'Lutron / KNX lighting automation, smart motorized curtains, multi-zone Sonos architectural ceiling audio.',
  securityCctv: true,
  homeTheatre: true,
  prayerPoojaRoom: true,
  servantRoom: true,
  utilityLaundryArea: true,
  futureExpansionPlans: 'Provision for future IoT energy management sensors and battery backup expansion.',

  selectedStyles: ['Modern', 'Contemporary', 'Minimalist', 'Luxury', 'Biophilic'],
  preferredColours: ['Warm Ivory', 'Champagne Beige', 'Earthy Walnut', 'Subtle Sage Green', 'Soft Greige'],
  coloursToAvoid: ['Bright Yellow', 'Neon Shades', 'Heavy Gloss Crimson', 'Overpowering Dark Brown'],
  preferredFlooring: 'Italian Botticino Classico Marble (Living/Dining), Engineered Oak Herringbone (Bedrooms), Anti-skid Flamed Granite (Deck)',
  woodFinishPreference: 'Natural Smoked Teak Veneer with 5% Polyurethane Matte Topcoat',
  metalFinishPreference: 'PVD Coated Brushed Champagne Brass and Gunmetal',
  glossOrMatte: 'MATTE',
  openOrClosedSpaces: 'OPEN_CONCEPT',
  lightingInteriorAtmosphere: 'WARM_MOODY',
  preferredBrands: 'Saint-Gobain, Blum, Asian Paints Royale Aspire, Hafele, Kohler, Daikin VRV, Lutron, Dekton',

  budgetTier: 'LUXURY',
  overallBudgetINR: 9800000,
  architectureBudgetINR: 600000,
  interiorBudgetINR: 4800000,
  civilBudgetINR: 1200000,
  furnitureBudgetINR: 1800000,
  mepBudgetINR: 800000,
  kitchenWardrobeBudgetINR: 1600000,
  preferredPaymentTerms: 'Milestone-based (15% Advance, 25% Civil & MEP Completion, 30% Carpentry & Modular Delivery, 20% Finishes, 10% Handover)',
  isGstIncluded: true,
  budgetFlexibility: 'MODERATE_10_PERCENT',
  financingLoanRequired: false,
  phaseWiseExecution: false,

  documentsAvailable: [
    'Sale Deed & Allotment Letter',
    'Architectural Floor Plan CAD',
    'Society Interior Fit-out Guidelines & NOC',
    'Existing Electrical Single Line Diagram',
    'Site Photographs & 360 Video Walkthrough'
  ],
  clientPinterestInstagramLinks: 'https://pinterest.com/vikram_malhotra/penthouse-luxury-moodboard-2026',
  preferredImagesCount: 8,
  dislikedDesignsNotes: 'Dislike glossy plastic laminates, heavy ornate false ceilings with multi-colour RGB lights, and visible wall wires.'
};

export const INITIAL_CATEGORY_SAMPLE_HEADS: CategorySampleHead[] = [
  // 1. Architecture Sample Images (14 Heads)
  {
    id: 'arch-front-elevation',
    category: 'ARCHITECTURE',
    headName: 'Front Elevation & Façade',
    description: 'Contemporary double-height architectural entrance façade with vertical louvers and warm linear wash.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-01',
    tags: ['Façade', 'Louvers', 'Modern', 'Entrance']
  },
  {
    id: 'arch-rear-elevation',
    category: 'ARCHITECTURE',
    headName: 'Rear Elevation & Private Courtyard',
    description: 'Full-height structural glazing opening into landscaped private courtyard and pool deck.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Courtyard', 'Rear', 'Glazing', 'Deck']
  },
  {
    id: 'arch-side-elevation',
    category: 'ARCHITECTURE',
    headName: 'Side Elevation & Service Core',
    description: 'Acoustic louvered service ducts, rainwater harvesting downspouts and cantilevered shading fins.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Elevation', 'Service Core', 'Shading', 'Section']
  },
  {
    id: 'arch-boundary-gate',
    category: 'ARCHITECTURE',
    headName: 'Gate & Boundary Wall',
    description: 'CNC cut Corten steel automated sliding gate with integrated video intercom and granite bollards.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Gate', 'Boundary', 'Security', 'Automation']
  },
  {
    id: 'arch-entrance-facade',
    category: 'ARCHITECTURE',
    headName: 'Entrance Portico & Foyer Façade',
    description: 'Bespoke floating canopy with integrated warm LED profile rings and double pivot brass entrance door.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Canopy', 'Foyer', 'Pivot Door', 'Portico']
  },
  {
    id: 'arch-balcony-design',
    category: 'ARCHITECTURE',
    headName: 'Cantilever Balcony & Railing',
    description: 'Seamless laminated toughened glass balustrade with concealed drainage trough and composite deck.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Balcony', 'Glass Railing', 'Deck', 'Outdoor']
  },
  {
    id: 'arch-terrace-design',
    category: 'ARCHITECTURE',
    headName: 'Rooftop Terrace & Pergola',
    description: 'Motorized louvered bioclimatic aluminum pergola with outdoor bar counter and perimeter planters.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Terrace', 'Pergola', 'Bioclimatic', 'Rooftop']
  },
  {
    id: 'arch-night-view',
    category: 'ARCHITECTURE',
    headName: 'Night-View Architectural Lighting',
    description: '3000K architectural grazing illumination highlighting stone textures, cantilever massing and trees.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['Night View', 'Lighting', 'Illumination', 'Façade']
  },
  {
    id: 'arch-landscape-garden',
    category: 'ARCHITECTURE',
    headName: 'Landscape Architecture & Garden',
    description: 'Native xeriscape tropical vegetation with basalt stone stepping pavers and concealed drip irrigation.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['Landscape', 'Garden', 'Pavers', 'Water']
  },
  {
    id: 'arch-modern-villa',
    category: 'ARCHITECTURE',
    headName: 'Modern Luxury Villa Concept',
    description: 'Massing volumes with clean interlocking white stucco cubes, dark metal trims and continuous waterbody.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Villa', 'Modern', 'Massing', 'Luxury']
  },
  {
    id: 'arch-traditional-house',
    category: 'ARCHITECTURE',
    headName: 'Traditional Heritage House / Courtyard',
    description: 'Sloped clay Mangalore tiled roof with central Brahmastanam open-to-sky courtyard and carved stone pillars.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Heritage', 'Courtyard', 'Stone Pillars', 'Vernacular']
  },
  {
    id: 'arch-commercial-facade',
    category: 'ARCHITECTURE',
    headName: 'Commercial Façade & Retail Display',
    description: 'Double-height structural silicone curtain wall with high-transmittance low-e solar control glazing.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Commercial', 'Curtain Wall', 'Low-E', 'Retail']
  },
  {
    id: 'arch-farmhouse',
    category: 'ARCHITECTURE',
    headName: 'Countryside Farmhouse Retreat',
    description: 'Low-slung rammed earth and exposed brick architecture integrated with mature canopy trees.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Farmhouse', 'Earth', 'Brick', 'Nature']
  },
  {
    id: 'arch-apartment-elevation',
    category: 'ARCHITECTURE',
    headName: 'Apartment Tower Elevation & Lobby',
    description: 'Multi-tiered luxury residential tower elevation with staggered green sky-gardens and triple-height drop-off.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-08',
    tags: ['Apartment', 'Tower', 'Sky Garden', 'Urban']
  },

  // 2. Interior Sample Images (20 Heads)
  {
    id: 'int-living-room',
    category: 'INTERIOR',
    headName: 'Living Room Formal Lounge',
    description: 'Continuous Botticino marble flooring with Italian curved sofa, brass floor lamps, and sea-view vista.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-01',
    tags: ['Living Room', 'Marble', 'Lounge', 'Luxury']
  },
  {
    id: 'int-drawing-room',
    category: 'INTERIOR',
    headName: 'Drawing Room & Guest Salon',
    description: 'Neo-classical wall wainscoting with brushed gold accents, plush velvet armchairs, and coffered ceiling.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-01',
    tags: ['Drawing Room', 'Neo-Classical', 'Velvet', 'Wainscot']
  },
  {
    id: 'int-dining-area',
    category: 'INTERIOR',
    headName: 'Dining Room & Bar Credenza',
    description: 'Solid marble monolithic 10-seater dining table with bespoke sculptural acoustic pendant and illuminated bar.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Dining', 'Bar', 'Lighting', 'Marble Table']
  },
  {
    id: 'int-master-bedroom',
    category: 'INTERIOR',
    headName: 'Master Bedroom Suite',
    description: 'European white oak herringbone flooring with suede upholstered wall panelling and warm 2700K ambient cove.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Master Bedroom', 'Oak Parquet', 'Panelling', 'Cove']
  },
  {
    id: 'int-kids-bedroom',
    category: 'INTERIOR',
    headName: 'Kids’ Bedroom & Study Hub',
    description: 'Multi-functional bunk unit with integrated study desk, whiteboard wall, and playful acoustic felt pinboards.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Kids Room', 'Study', 'Storage', 'Modern']
  },
  {
    id: 'int-guest-bedroom',
    category: 'INTERIOR',
    headName: 'Guest Bedroom & Luggage Bench',
    description: 'Serene minimalist palette with concealed storage wardrobe, upholstered daybed, and luggage drop zone.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Guest Room', 'Minimalist', 'Luggage', 'Warm']
  },
  {
    id: 'int-modular-kitchen',
    category: 'INTERIOR',
    headName: 'Gourmet Modular Kitchen & Island',
    description: 'Dekton porcelain waterfall island with Blum motorized servo-drive drawers, induction cooktop, and ducted hood.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Kitchen', 'Island', 'Dekton', 'Blum']
  },
  {
    id: 'int-walk-in-wardrobe',
    category: 'INTERIOR',
    headName: 'Walk-in Wardrobe & Dressing Room',
    description: 'Fluted glass tinted wardrobe shutters with concealed vertical LED channels and central accessory island.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Wardrobe', 'Walk-in', 'LED', 'Glass']
  },
  {
    id: 'int-tv-wall',
    category: 'INTERIOR',
    headName: 'Feature TV Wall & Media Console',
    description: 'Bookmatched Italian travertine slab with acoustic wooden fluted slats and floating cantilevered credenza.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['TV Wall', 'Travertine', 'Acoustic', 'Media']
  },
  {
    id: 'int-home-office',
    category: 'INTERIOR',
    headName: 'Executive Home Office & Library',
    description: 'Acoustic double-glazed partition with bespoke walnut executive desk and floor-to-ceiling library display.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['Home Office', 'Library', 'Desk', 'Acoustic']
  },
  {
    id: 'int-pooja-room',
    category: 'INTERIOR',
    headName: 'Sacred Pooja Room & Mandir',
    description: 'Carved white Makrana marble sanctum with backlit brass jaali fretwork and floating drawer storage.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Pooja Room', 'Mandir', 'Marble', 'Jaali']
  },
  {
    id: 'int-bathroom',
    category: 'INTERIOR',
    headName: 'Master Bathroom Spa Ensuite',
    description: 'Bookmatched porcelain wall slabs with freestanding solid-surface soaking tub, rain shower, and double vanity.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Bathroom', 'Ensuite', 'Tub', 'Vanity']
  },
  {
    id: 'int-staircase',
    category: 'INTERIOR',
    headName: 'Architectural Floating Staircase',
    description: 'Cantilevered solid teak treads anchored to hidden steel stringer with frameless structural glass balustrade.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Staircase', 'Cantilever', 'Teak', 'Glass']
  },
  {
    id: 'int-lobby',
    category: 'INTERIOR',
    headName: 'Private Entrance Foyer & Lobby',
    description: 'Bespoke entryway console table with backlit fluted marble wall niche and sculptural bronze mirror.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Foyer', 'Lobby', 'Mirror', 'Entryway']
  },
  {
    id: 'int-balcony-deck',
    category: 'INTERIOR',
    headName: 'Balcony Deck & Sit-out Lounge',
    description: 'All-weather rattan outdoor lounge with micro-irrigation planter troughs and anti-skid timber composite tiles.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Balcony', 'Deck', 'Outdoor', 'Rattan']
  },
  {
    id: 'int-utility-area',
    category: 'INTERIOR',
    headName: 'Utility, Scullery & Laundry Station',
    description: 'Ergonomic front-load washer-dryer stack with quartz counter, deep soaking sink, and concealed laundry pullouts.',
    imageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-08',
    tags: ['Utility', 'Laundry', 'Storage', 'Sink']
  },
  {
    id: 'int-home-theatre',
    category: 'INTERIOR',
    headName: 'Private Acoustic Home Cinema',
    description: '150" 4K laser projection with Dolby Atmos 9.2.4 architectural in-wall speakers and motorized leather recliners.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-08',
    tags: ['Home Theatre', 'Cinema', 'Acoustic', 'Dolby']
  },
  {
    id: 'int-restaurant-interior',
    category: 'INTERIOR',
    headName: 'Hospitality & Fine Dine Restaurant',
    description: 'Layered mood lighting with curved banquette leather seating, exposed brick arches, and artisanal bar gantry.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-08',
    tags: ['Hospitality', 'Restaurant', 'Banquette', 'Bar']
  },
  {
    id: 'int-office-interior',
    category: 'INTERIOR',
    headName: 'Corporate Office & Collaboration Zone',
    description: 'Biophilic open workstations with acoustic ceiling baffles, phone privacy pods, and touch-screen boardrooms.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-09',
    tags: ['Office', 'Corporate', 'Acoustic', 'Workstations']
  },
  {
    id: 'int-retail-showroom',
    category: 'INTERIOR',
    headName: 'Luxury Retail Flagship Showroom',
    description: 'Architectural display plinths with CRI 98+ magnetic track lighting and interactive digital mirrors.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-09',
    tags: ['Retail', 'Showroom', 'Display', 'Luxury']
  },

  // 3. Construction and Execution Images (13 Heads)
  {
    id: 'const-site-prep',
    category: 'CONSTRUCTION',
    headName: 'Site Preparation & Demolition Protection',
    description: 'Dust barrier zip-walls, floor protection corflute sheets, and structural survey benchmarks.',
    imageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-01',
    tags: ['Site Prep', 'Demolition', 'Protection', 'Safety']
  },
  {
    id: 'const-foundation',
    category: 'CONSTRUCTION',
    headName: 'Foundation & Raft Reinforcement',
    description: 'TMT bar grid reinforcement inspection with cover blocks and anti-termite chemical spray.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Foundation', 'Raft', 'RCC', 'Steel']
  },
  {
    id: 'const-rcc-structure',
    category: 'CONSTRUCTION',
    headName: 'RCC Column & Slab Formwork',
    description: 'Plywood formwork with heavy-duty steel props, laser level slab casting, and cube test cube sampling.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['RCC', 'Slab', 'Formwork', 'Concrete']
  },
  {
    id: 'const-brickwork',
    category: 'CONSTRUCTION',
    headName: 'Masonry Brickwork & Lintels',
    description: 'AAC lightweight blockwork with polymer joint mortar and reinforced lintel band beams.',
    imageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Brickwork', 'Masonry', 'AAC Blocks', 'Lintel']
  },
  {
    id: 'const-plumbing',
    category: 'CONSTRUCTION',
    headName: 'Sanitary Plumbing & Hydrostatic Testing',
    description: 'Multi-layer CPVC / UPVC piping with acoustic sewage pipe insulation and 10 bar pressure testing.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Plumbing', 'Piping', 'Pressure Test', 'Sanitary']
  },
  {
    id: 'const-electrical',
    category: 'CONSTRUCTION',
    headName: 'Concealed Electrical Conduit Chasing',
    description: 'FR-LSH copper wiring routed through heavy-duty PVC conduits with laser aligned switch boxes.',
    imageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Electrical', 'Conduit', 'Wiring', 'Chasing']
  },
  {
    id: 'const-waterproofing',
    category: 'CONSTRUCTION',
    headName: 'Multi-Coat Waterproofing & Ponding Test',
    description: 'Polyurethane elastomeric waterproofing with fiber-mesh corners and 72-hour stagnant ponding test.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Waterproofing', 'Ponding Test', 'Polyurethane', 'Leakproof']
  },
  {
    id: 'const-flooring-install',
    category: 'CONSTRUCTION',
    headName: 'Marble Dry-Lay & Crystallization',
    description: 'Factory numbered marble slab dry-lay mock-up followed by white cement adhesive screed and diamond polishing.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['Flooring', 'Marble Dry-lay', 'Polishing', 'Installation']
  },
  {
    id: 'const-false-ceiling',
    category: 'CONSTRUCTION',
    headName: 'False Ceiling Framework & Gypsum Board',
    description: 'GI perimeter channels, cross tees with moisture-resistant Saint-Gobain Gyproc boards and expansion joints.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['False Ceiling', 'Gypsum', 'GI Channels', 'Cove']
  },
  {
    id: 'const-painting',
    category: 'CONSTRUCTION',
    headName: 'Wall Putty, Primer & Airless Spray Painting',
    description: 'Multi-coat acrylic wall putty with laser sanded finish, alkali primer, and zero-VOC luxury emulsion.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Painting', 'Putty', 'Airless Spray', 'Emulsion']
  },
  {
    id: 'const-modular-install',
    category: 'CONSTRUCTION',
    headName: 'Modular Kitchen & Millwork Assembly',
    description: 'Laser-levelled base cabinet installation with Blum drawer adjustment and concealed cable routing.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Modular Assembly', 'Carpentry', 'Cabinets', 'Hardware']
  },
  {
    id: 'const-handover',
    category: 'CONSTRUCTION',
    headName: 'Final Deep Cleaning & Snagging Inspection',
    description: 'Industrial HEPA extraction, silicone seam sealing, appliance testing, and 240-point snag checklist signoff.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Handover', 'Snagging', 'Deep Clean', 'Quality']
  },
  {
    id: 'const-before-after',
    category: 'CONSTRUCTION',
    headName: 'Before & After Transformation Showcase',
    description: 'Side-by-side comparative documentation showing bare concrete shell transformed into luxury finished penthouse.',
    imageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Before After', 'Transformation', 'Showcase', 'Portfolio']
  },

  // 4. Material and Finish Images (17 Heads)
  {
    id: 'mat-flooring-samples',
    category: 'MATERIALS',
    headName: 'Flooring Samples & Texture Boards',
    description: 'Engineered oak planks, microtopping cement swatches, flamed granite, and vitrified tiles.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-01',
    tags: ['Flooring', 'Samples', 'Oak', 'Granite']
  },
  {
    id: 'mat-marble-granite',
    category: 'MATERIALS',
    headName: 'Imported Marble & Exotic Quartzite',
    description: 'Botticino Classico, Statuario White, Grigio Orobico, and Brazilian Patagonia quartzite slabs.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-01',
    tags: ['Marble', 'Granite', 'Quartzite', 'Statuario']
  },
  {
    id: 'mat-tiles',
    category: 'MATERIALS',
    headName: 'Large-Format Porcelain Tiles & Slabs',
    description: '1200x2400mm continuous porcelain slabs with bookmatched veins and anti-slip R10 slip rating.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Tiles', 'Porcelain', 'Large Format', 'Slabs']
  },
  {
    id: 'mat-veneer',
    category: 'MATERIALS',
    headName: 'Natural Wood Veneer & Smoked Teak',
    description: 'Smoked Teak, American Walnut, White Ash, and quarter-cut European Oak natural sheets.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-02',
    tags: ['Veneer', 'Teak', 'Walnut', 'Wood']
  },
  {
    id: 'mat-laminate',
    category: 'MATERIALS',
    headName: 'High-Pressure & Anti-Fingerprint Laminate',
    description: '1.2mm zero-reflection super-matte laminates with thermal healing surface technology.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Laminate', 'HPL', 'Anti-Fingerprint', 'Matte']
  },
  {
    id: 'mat-acrylic-finish',
    category: 'MATERIALS',
    headName: 'High-Gloss Acrylic Finishes',
    description: '2mm UV-resistant acrylic sheets with mirror reflection for modular wardrobe and kitchen shutters.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-03',
    tags: ['Acrylic', 'Gloss', 'UV Resistant', 'Shutters']
  },
  {
    id: 'mat-pu-finish',
    category: 'MATERIALS',
    headName: 'Polyurethane (PU) Lacquer Finishes',
    description: 'Italian ICA/Milesi pigmented PU lacquer in dead matte, satin, and high-gloss metallic hues.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['PU Finish', 'Lacquer', 'Italian', 'Matte']
  },
  {
    id: 'mat-glass',
    category: 'MATERIALS',
    headName: 'Architectural Fluted & Tinted Glass',
    description: 'Moru fluted glass, grey-tinted reflective glass, dichroic art glass, and acoustic laminated panels.',
    imageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-04',
    tags: ['Glass', 'Fluted', 'Tinted', 'Acoustic']
  },
  {
    id: 'mat-wallpaper',
    category: 'MATERIALS',
    headName: 'Textured Wallpaper & Wall Coverings',
    description: 'Natural woven grasscloth, embossed vinyl fabric, and custom bespoke botanical wall murals.',
    imageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['Wallpaper', 'Grasscloth', 'Mural', 'Wall Covering']
  },
  {
    id: 'mat-paint-shades',
    category: 'MATERIALS',
    headName: 'Luxury Paint Shades & Limewash Textures',
    description: 'Zero-VOC mineral lime plaster, velvet touch luxury emulsions, and Stucco Veneziano metallics.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-05',
    tags: ['Paint', 'Limewash', 'Stucco', 'Texture']
  },
  {
    id: 'mat-false-ceiling-designs',
    category: 'MATERIALS',
    headName: 'Ceiling Design Details & Wood Rafts',
    description: 'Concealed magnetic track channels, acoustic wooden louvers, and indirect perimeter cove details.',
    imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Ceiling', 'Wooden Rafts', 'Cove', 'Acoustic']
  },
  {
    id: 'mat-lighting-fixtures',
    category: 'MATERIALS',
    headName: 'Architectural Lighting Fixtures & Pendants',
    description: 'Anti-glare magnetic track spots, deep recess architectural downlights, and blown-glass dining chandeliers.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-06',
    tags: ['Lighting', 'Pendants', 'Track Lights', 'Downlights']
  },
  {
    id: 'mat-door-handles',
    category: 'MATERIALS',
    headName: 'Door Handles, Hardware & Mortise Locks',
    description: 'Solid brass knurled handles by Buster + Punch, concealed 3D adjustable hinges, and magnetic locks.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Door Handles', 'Brass', 'Hardware', 'Hinges']
  },
  {
    id: 'mat-sanitary-fittings',
    category: 'MATERIALS',
    headName: 'Sanitary Fittings & Faucets',
    description: 'Brushed rose gold thermostatic diverters, ceiling rainfall showers, and rimless wall-hung smart toilets.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-07',
    tags: ['Sanitary', 'Faucets', 'Showers', 'Smart Toilet']
  },
  {
    id: 'mat-kitchen-hardware',
    category: 'MATERIALS',
    headName: 'Kitchen Hardware & Organizational Pull-outs',
    description: 'Blum Tandembox, motorized servo-drive lift systems, corner carousels, and integrated waste sorters.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-08',
    tags: ['Kitchen Hardware', 'Blum', 'Servo-drive', 'Storage']
  },
  {
    id: 'mat-wardrobe-accessories',
    category: 'MATERIALS',
    headName: 'Wardrobe Organizers & Leather Trays',
    description: 'Velvet jewelry pullouts, motorized drop-down trouser racks, tie organizers, and sensor LED profiles.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-08',
    tags: ['Wardrobe', 'Accessories', 'Jewelry Trays', 'Lighting']
  },
  {
    id: 'mat-furniture-fabrics',
    category: 'MATERIALS',
    headName: 'Upholstery Fabrics, Velvets & Leather',
    description: 'High-rub test bouclé, stain-resistant Crypton performance weaves, top-grain Italian aniline leathers.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    sourceType: 'ARCHITECTURAL_LIBRARY',
    updatedAt: '2026-03-09',
    tags: ['Fabrics', 'Leather', 'Boucle', 'Upholstery']
  }
];

export const COMPANY_PROFILE_DATA = {
  companyName: 'BuildStorys Design & Infra Tech Pvt. Ltd.',
  brandTagline: 'Engineering Architectural Masterpieces with Digital Precision',
  about: 'BuildStorys is an award-winning turnkey architecture, interior design, and EPC construction firm headquartered in Mumbai with regional studios in Bengaluru and Delhi NCR. We merge world-class bespoke design sensibilities with enterprise ERP governance, real-time quantity takeoff, and photorealistic AI visualization to deliver luxury residences, boutique hospitality, and high-performance commercial spaces.',
  stats: [
    { label: 'Years of Excellence', value: '14+' },
    { label: 'Completed Projects', value: '450+' },
    { label: 'Design & Engineering Team', value: '65+' },
    { label: 'Client Retention Rate', value: '98.4%' },
    { label: 'Sq.Ft Designed & Executed', value: '2.8M+' }
  ],
  registrations: [
    'Council of Architecture (COA) Registered Architects',
    'Institute of Indian Interior Designers (IIID) Fellow Member',
    'Indian Green Building Council (IGBC) Accredited AP',
    'ISO 9001:2015 Quality Management Certified',
    'RERA Compliant Engineering Contractor'
  ],
  leadership: [
    { name: 'Ar. Sanjay Puri', role: 'Principal Architect & Founder', qual: 'B.Arch (Hons), M.Arch (Columbia Univ)' },
    { name: 'Meera Rao', role: 'Director of Interior Design & Visualisation', qual: 'B.Des (NID), Master of Interior Architecture' },
    { name: 'Eng. K. N. Rao', role: 'Chief of MEP & Structural Engineering', qual: 'M.Tech Structures, IIT Bombay' }
  ],
  testimonials: [
    {
      client: 'Sunil & Gayatri Piramal',
      project: 'Piramal Mahalaxmi Luxury Duplex (5,200 sq.ft)',
      text: 'BuildStorys transformed our duplex with immaculate attention to detail. Their AI-driven option presentations allowed us to visualize the exact Italian marble veining and lighting before breaking ground. Delivered within budget and 2 weeks ahead of schedule.'
    },
    {
      client: 'Horizon Tech Park Ltd',
      project: 'Ecospace Office Tower Fit-out (42,000 sq.ft)',
      text: 'The transparency of their BOQ tracking, live site survey logs, and multi-disciplinary CAD coordination prevented dozens of site rework issues. A truly enterprise-grade turnkey experience.'
    }
  ]
};

export const SERVICE_CATALOGUE_DATA = [
  {
    category: 'Architecture Services',
    description: 'Comprehensive architectural master planning, exterior façade design, structural engineering, and statutory approval coordination.',
    services: [
      'Site Analysis & Sun-Path / Micro-Climate Studies',
      'Concept Planning & Vastu-Compliant Massing',
      'Space Planning & Circulation Hierarchy',
      'Measured 2D CAD Floor Plans & Working Drawings',
      'Elevation Design & 3D Exterior Walkthroughs',
      'Structural Engineering Coordination & Raft Design',
      'Electrical, Plumbing & HVAC (MEP) Layouts',
      'Municipal Sanction & Society Approval Drawings',
      'Landscape Architecture & Biophilic Planning',
      'Periodic Site Supervision & Structural Certification'
    ]
  },
  {
    category: 'Interior Design Services',
    description: 'Bespoke residential, corporate, and retail interior styling, space planning, modular furniture, and custom finish detailing.',
    services: [
      'Detailed Space Planning & Zoning Strategy',
      'Acoustic False Ceiling & Cove Lighting Details',
      'Imported Italian Marble, Parquet & Tile Flooring',
      'Fluted Wood, Stone Veneer & Stucco Wall Treatments',
      'Gourmet Modular Kitchen & Island Engineering',
      'Custom Walk-in Wardrobes & Dressing Sanctuaries',
      'Feature TV Consoles & Motorized Media Units',
      'Custom Bespoke Furniture Design & Procurement',
      'Architectural DALI Lighting Design & Dimmers',
      'Curtains, Motorized Blinds & Soft Furnishing Décor',
      'Luxury Spa Bathrooms with Concealed Plumbing',
      'Curated Material Palette Boards & Swatch Selection'
    ]
  },
  {
    category: 'Construction & Turnkey Execution Services',
    description: 'End-to-end EPC execution, civil masonry, MEP installations, quality control benchmarks, and guaranteed timeline delivery.',
    services: [
      'Civil Demolition & Core Structural Retrofitting',
      'RCC Foundation, Columns & Slab Casting',
      'Multi-coat Waterproofing with 10-Year Guarantee',
      'Factory Diamond Marble Polishing & Crystallization',
      'Airless Spray Painting & Zero-VOC Emulsions',
      'Complete Plumbing, Sanitary & Hydrostatic Testing',
      'Electrical SLD, Conduiting & Smart Automation',
      'Custom Architectural Metal & Glass Fabrication',
      'High-Performance Thermal Windows & Double Glazing',
      'Turnkey Project Management with Daily Digital Logs',
      '240-Point Pre-Handover Snagging Inspection',
      'Post-Handover Warranty, Maintenance & As-Built Manuals'
    ]
  }
];

export const DESIGN_PROCESS_STEPS = [
  { step: 1, title: 'Initial Consultation', desc: 'Understanding client aspirations, lifestyle, project scope, and initial vision.' },
  { step: 2, title: 'Structured Requirement Collection', desc: 'Comprehensive discovery intake (room requirements, style preferences, budgets).' },
  { step: 3, title: 'Site Visit & LiDAR Measurement', desc: 'Accurate laser measurements, as-built CAD mapping, site photo & video logs.' },
  { step: 4, title: 'Budget Alignment & Scope Locking', desc: 'Defining commercial limits across Civil, Interior, MEP, and Modular items.' },
  { step: 5, title: 'AI Concept Design Options', desc: 'Generating 4–5 tailored architectural concepts with distinct themes and layouts.' },
  { step: 6, title: 'Physical Moodboard & Swatch Curation', desc: 'Curating tactile marble, timber, fabrics, and hardware finishes.' },
  { step: 7, title: '2D Layout Space-Planning Options', desc: 'Measured space-planning iterations for optimal flow and storage.' },
  { step: 8, title: '4K Photorealistic 3D Renders', desc: 'Ultra-high-definition perspective interior and exterior visualizations.' },
  { step: 9, title: 'Customer Review & Sign-Off', desc: 'Presenting visual discovery pack; locking the chosen design option.' },
  { step: 10, title: 'GFC Working Drawings Issuance', desc: 'Releasing Good-For-Construction drawings (Arch, MEP, Carpentry, Ceiling).' },
  { step: 11, title: 'Itemized BOQ & Detailed Quotation', desc: 'Zero-hidden-cost Bill of Quantities mapped to master rate benchmarks.' },
  { step: 12, title: 'Material Finalization & Sourcing', desc: 'Factory visits, direct quarry marble selection, hardware ordering.' },
  { step: 13, title: 'Execution Planning & CPM Schedule', desc: 'Bar chart milestone scheduling, site safety setup, and team mobilization.' },
  { step: 14, title: 'Turnkey Site Execution', desc: 'Daily project manager oversight, certified measurement book entries.' },
  { step: 15, title: 'Quality Audits & Snag Checklist', desc: 'Rigorous 240-point quality audit, hydrostatic and electrical testing.' },
  { step: 16, title: 'Handover & Warranty Documentation', desc: 'Key handover ceremony, as-built manual, warranty certificates.' }
];

export const PRE_START_DOCUMENTS_CHECKLIST = [
  { code: 'DOC-01', title: 'Company Credentials & Profile Brochure', status: 'READY', desc: 'Detailed brochure highlighting 14+ years experience and 450+ completed portfolio projects.' },
  { code: 'DOC-02', title: 'Service Catalogue & Scope of Work Matrix', status: 'READY', desc: 'Transparent boundaries defining architectural, interior, and MEP deliverable lines.' },
  { code: 'DOC-03', title: 'Curated Sample Image & Design Portfolio', status: 'READY', desc: 'Classified visual album with 64+ curated heads across Architecture, Interior, and Execution.' },
  { code: 'DOC-04', title: '16-Step Design & Project Execution Methodology', status: 'READY', desc: 'Clear timeline from discovery consultation to final key handover.' },
  { code: 'DOC-05', title: 'Sample Itemized Bill of Quantities (BOQ)', status: 'READY', desc: 'Standardized rate card showing material brand tiers, quantities, and labour lines.' },
  { code: 'DOC-06', title: 'Milestone Payment Schedule & Terms', status: 'READY', desc: 'Progress-linked stage payments (Advance, Civil, Modular, Finishes, Handover).' },
  { code: 'DOC-07', title: '10-Year Waterproofing & Material Warranty Card', status: 'READY', desc: 'Manufacturer warranties backed by BuildStorys turnkey performance bond.' },
  { code: 'DOC-08', title: 'Change Request & Variation Policy Guidelines', status: 'READY', desc: 'Written SOP ensuring no unplanned budget overruns without signed variation approvals.' },
  { code: 'DOC-09', title: 'Site Supervision & Responsibility Matrix', status: 'READY', desc: 'Dedicated Project Manager and Quality Safety Engineer assigned to the site.' },
  { code: 'DOC-10', title: 'Sample Turnkey EPC Client Agreement', status: 'READY', desc: 'Fair, transparent contract detailing arbitration, timelines, and force majeure.' }
];
