import type { UserRole } from "@/lib/demo-data";

export type DemoSession = {
  role: UserRole;
  name: string;
  signedInAt: string;
};

const SESSION_KEY = "gap-it-session";
const validRoles: UserRole[] = ["administrator", "qualityEngineer", "operator"];

function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[\s_-]/g, "").toLowerCase();
  if (normalized === "admin" || normalized === "administrator") return "administrator";
  if (normalized === "operator") return "operator";
  if (normalized === "inspector" || normalized === "qualityengineer") return "qualityEngineer";
  return null;
}

export function readDemoSession(): DemoSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      !value ||
      typeof value !== "object" ||
      !("role" in value) ||
      !("name" in value) ||
      !("signedInAt" in value) ||
      typeof value.name !== "string" ||
      typeof value.signedInAt !== "string"
    ) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const role = normalizeRole(value.role);
    if (!role || !validRoles.includes(role)) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return { role, name: value.name, signedInAt: value.signedInAt };
  } catch (error) {
    console.warn("Unable to read the demo session from browser storage.", error);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch (removeError) {
      console.warn("Unable to remove the invalid demo session from browser storage.", removeError);
    }
    return null;
  }
}

export function saveDemoSession(session: DemoSession): boolean {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.error("Unable to save the demo session to browser storage.", error);
    return false;
  }
}

export function clearDemoSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Unable to clear the demo session from browser storage.", error);
  }
}
