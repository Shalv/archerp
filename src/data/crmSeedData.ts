/**
 * Build Storys ERP - CRM Seed Data
 * The pipeline for the Villa 253 demo. The WON lead is the live project
 * PROJ-VILLA-253; the other four leads are the real pipeline around it.
 * Source of truth: src/data/villa253DemoSeeds.ts
 */

import { CrmLeadExtended } from '../types/crm';
import { VILLA253_CRM_LEADS } from './villa253DemoSeeds';

export const SEED_CRM_LEADS: CrmLeadExtended[] = VILLA253_CRM_LEADS;
