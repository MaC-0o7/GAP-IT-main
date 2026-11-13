import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[480px] overflow-hidden">
      <div className="absolute inset-0 hidden md:block">
        <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />
      </div>
      <div className="absolute inset-0 md:hidden">
        <BackgroundRippleEffect rows={9} cols={9} cellSize={44} />
      </div>
    </div>
  );
}
