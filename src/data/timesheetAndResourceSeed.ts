/**
 * Build Storys ERP - Timesheets, Resource Deployment & Project Tasks
 * All entries belong to PROJ-VILLA-253 (Villa 253, Karjat).
 * Source of truth: src/data/villa253OpsSeeds.ts
 */

import { TimesheetEntry, ResourceDeployment, ProjectTask } from '../types/erp';
import {
  VILLA253_RESOURCES,
  VILLA253_TIMESHEETS,
  VILLA253_DEPLOYMENTS,
  VILLA253_PROJECT_TASKS
} from './villa253OpsSeeds';

export interface ResourceMasterItem {
  id: string;
  name: string;
  type: 'EMPLOYEE' | 'EQUIPMENT';
  roleOrCategory: string;
  department?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  hourlyCostRate: number;
  hourlyBillableRate: number;
  skillsOrSpecs?: string[];
  status: 'AVAILABLE' | 'DEPLOYED' | 'MAINTENANCE';
}

export const DEMO_RESOURCE_ITEMS: ResourceMasterItem[] = VILLA253_RESOURCES;
export const INITIAL_TIMESHEETS: TimesheetEntry[] = VILLA253_TIMESHEETS;
export const INITIAL_RESOURCE_DEPLOYMENTS: ResourceDeployment[] = VILLA253_DEPLOYMENTS;
export const INITIAL_PROJECT_TASKS: ProjectTask[] = VILLA253_PROJECT_TASKS;
