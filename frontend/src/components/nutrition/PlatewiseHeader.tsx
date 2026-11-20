import { Leaf, Sparkles } from "lucide-react";

export function PlatewiseHeader() {
  return (
    <header className="border-b border-border/70 bg-card/70">
      <div className="page-shell flex h-[4.5rem] items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Platewise home">
          <span className="brand-mark">
            <Leaf size={19} strokeWidth={2.2} />
          </span>
          <span className="text-lg font-bold">platewise</span>
        </a>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles size={14} className="text-primary" />
          <span>Food, made clearer</span>
        </div>
      </div>
    </header>
  );
}
