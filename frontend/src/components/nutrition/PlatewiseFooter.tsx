import { Leaf } from "lucide-react";

export function PlatewiseFooter() {
  return (
    <footer className="mt-5 flex flex-col gap-2 border-t border-border/70 pt-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span className="inline-flex items-center gap-1.5">
        <Leaf size={13} className="text-primary" /> Made for meals with many little parts.
      </span>
      <span>Estimates are for general information, not medical advice.</span>
    </footer>
  );
}
