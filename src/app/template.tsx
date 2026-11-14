import type { ReactNode } from "react";

export default function AppTemplate({ children }: { children: ReactNode }) {
  return <div className="app-route-transition">{children}</div>;
}
