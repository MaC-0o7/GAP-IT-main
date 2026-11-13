"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/lib/demo-data";
import { readDemoSession } from "@/lib/auth/session";

export type PermissionModule =
  | "overview"
  | "liveMeasurements"
  | "instruments"
  | "spcAnalysis"
  | "spcReports"
  | "partsInspection"
  | "qualityEvents"
  | "traceability"
  | "measurementHistory"
  | "userAccounts"
  | "systemSettings";

export const WORKSPACE_SECTION_PERMISSIONS = {
  overview: "overview",
  "live-measurements": "liveMeasurements",
  "instrument-management": "instruments",
  "spc-analytics": "spcAnalysis",
  "spc-reports": "spcReports",
  "part-inspection-setup": "partsInspection",
  "alerts-quality-events": "qualityEvents",
  traceability: "traceability",
  "history-data-explorer": "measurementHistory",
  "users-permissions": "userAccounts",
  "system-settings": "systemSettings",
} as const satisfies Record<string, PermissionModule>;

export type WorkspaceSectionId = keyof typeof WORKSPACE_SECTION_PERMISSIONS;

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "resolve"
  | "start"
  | "pause"
  | "acknowledge"
  | "recordInspection"
  | "investigate";

type PermissionSet = Partial<Record<PermissionAction, true>>;
type PermissionMatrix = Record<UserRole, Partial<Record<PermissionModule, PermissionSet>>>;

const readOnly: PermissionSet = { view: true };
const viewExport: PermissionSet = { view: true, export: true };
const allAccess: PermissionSet = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  export: true,
  resolve: true,
  start: true,
  pause: true,
  acknowledge: true,
  recordInspection: true,
  investigate: true,
};
const adminUserAccounts: PermissionSet = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  export: true,
};
const allModules = {
  overview: allAccess,
  liveMeasurements: allAccess,
  instruments: allAccess,
  spcAnalysis: allAccess,
  spcReports: allAccess,
  partsInspection: allAccess,
  qualityEvents: allAccess,
  traceability: allAccess,
  measurementHistory: allAccess,
  userAccounts: adminUserAccounts,
  systemSettings: allAccess,
} satisfies Record<PermissionModule, PermissionSet>;

export const permissionMatrix: PermissionMatrix = {
  administrator: allModules,
  operator: {
    overview: readOnly,
    liveMeasurements: { view: true, start: true, pause: true, export: true },
    instruments: readOnly,
    partsInspection: { view: true, recordInspection: true },
    qualityEvents: { view: true, create: true, acknowledge: true },
    traceability: readOnly,
    measurementHistory: viewExport,
  },
  qualityEngineer: {
    overview: readOnly,
    liveMeasurements: { view: true, start: true, pause: true, export: true },
    instruments: readOnly,
    spcAnalysis: readOnly,
    spcReports: { view: true, create: true, export: true },
    partsInspection: { view: true, create: true, edit: true, recordInspection: true },
    qualityEvents: { view: true, create: true, acknowledge: true, investigate: true, resolve: true },
    traceability: readOnly,
    measurementHistory: viewExport,
  },
  viewer: {
    overview: readOnly,
    spcAnalysis: readOnly,
    spcReports: viewExport,
    traceability: readOnly,
    measurementHistory: viewExport,
  },
};

export function roleCan(
  role: UserRole | null,
  module: PermissionModule,
  action: PermissionAction,
): boolean {
  return role !== null && permissionMatrix[role][module]?.[action] === true;
}

export function usePermission(module: PermissionModule, action: PermissionAction): boolean {
  const [role, setRole] = useState<UserRole | null>(null);
  useEffect(() => {
    setRole(readDemoSession()?.role ?? null);
    const update = () => setRole(readDemoSession()?.role ?? null);
    window.addEventListener("storage", update);
    window.addEventListener("gap-it-session-change", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("gap-it-session-change", update);
    };
  }, []);
  return roleCan(role, module, action);
}
