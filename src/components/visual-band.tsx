import type { ReactNode } from "react";

export type VisualBandItem = {
  title: string;
  caption: string;
  illustration: ReactNode;
};

export function VisualBand({ items }: { items: readonly VisualBandItem[] }) {
  return (
    <section aria-label="Illustrations" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]"
          key={item.title}
        >
          <div aria-hidden="true" className="overflow-hidden bg-[var(--surface)]">
            {item.illustration}
          </div>
          <figcaption className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.caption}</p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
