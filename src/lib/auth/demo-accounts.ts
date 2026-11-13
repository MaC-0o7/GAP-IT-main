import type { UserRole } from "@/lib/demo-data";

export type DemoAccount = {
  username: string;
  password: string;
  name: string;
  role: UserRole;
};

export const demoAccounts: readonly DemoAccount[] = [
  { username: "admin", password: "admin123", name: "Demo Admin", role: "administrator" },
  { username: "operator", password: "operator123", name: "Demo Operator", role: "operator" },
  { username: "inspector", password: "inspector123", name: "Demo Inspector", role: "qualityEngineer" },
];

export function authenticateDemoAccount(username: string, password: string) {
  return demoAccounts.find(
    (account) =>
      account.username === username.trim().toLowerCase() &&
      account.password === password,
  ) ?? null;
}
