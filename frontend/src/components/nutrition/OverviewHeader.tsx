import { Calendar, Camera, Leaf, Search, Sliders } from "lucide-react";
import { ThemeToggleButton } from "@/lib/theme";

interface OverviewHeaderProps {
  currentDate?: string | undefined;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScanModal: () => void;
  onOpenSearchDialog: () => void;
  onOpenSettings?: (() => void) | undefined;
}

export function OverviewHeader({
  currentDate = "Fri, Nov 20",
  searchQuery,
  onSearchChange,
  onOpenScanModal,
  onOpenSearchDialog,
  onOpenSettings,
}: OverviewHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Brand & Page Context */}
      <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
        {/* Platewise Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs transition hover:bg-teal-700">
            <Leaf className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            platewise
          </span>
        </div>

        <div className="hidden h-5 w-px bg-neutral-300/70 dark:bg-neutral-800 sm:block" />

        {/* Overview heading & date pill */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            Overview
          </h1>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white px-3.5 py-1 text-xs font-medium text-neutral-700 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 sm:text-sm">
            <Calendar className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Search Input, Settings, Theme Toggle & Scan Meal Button */}
      <div className="flex flex-1 items-center justify-end gap-2.5 sm:gap-3 lg:max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClick={onOpenSearchDialog}
            placeholder="Search meals, recipes..."
            className="h-10 w-full rounded-xl border border-neutral-200/80 bg-white pl-9 pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-xs focus:border-neutral-400 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-700"
          />
          <button
            type="button"
            onClick={onOpenSearchDialog}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[11px] font-mono font-medium text-neutral-500 hover:bg-neutral-200/80 transition dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            ⌘K
          </button>
        </div>

        {/* Dark Mode / Light Mode Toggle Button */}
        <ThemeToggleButton />

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-neutral-200/90 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-xs transition hover:bg-neutral-50 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 active:scale-95"
            title="Targets & BMI Calculator"
            aria-label="Targets & BMI Calculator"
          >
            <Sliders className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenScanModal}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700"
        >
          <Camera className="h-4 w-4 text-orange-500 dark:text-orange-300" />
          <span className="hidden xs:inline">Scan Meal</span>
        </button>
      </div>
    </header>
  );
}
