import { ShieldCheck, Info, Sliders } from "lucide-react";
import type { MicroGoals, MicrosConsumed } from "./dashboard-types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DailyMicrosCardProps {
  micros: MicrosConsumed;
  goals: MicroGoals;
  onEditGoals?: (() => void) | undefined;
}

export function DailyMicrosCard({ micros, goals, onEditGoals }: DailyMicrosCardProps) {
  const microItems = [
    {
      name: "Dietary Fiber",
      amount: micros.fiber,
      target: goals.fiber,
      unit: "g",
      color: "#0d9488", // teal
      barColor: "bg-teal-600",
      status: micros.fiber >= goals.fiber * 0.8 ? "Optimal" : "Needs attention",
      statusColor: "bg-teal-50 text-teal-700 border-teal-200",
      info: "Supports digestive health, prebiotic gut microbiota, and steady glucose absorption.",
    },
    {
      name: "Sodium",
      amount: micros.sodium,
      target: goals.sodium,
      unit: "mg",
      color: "#0284c7", // sky
      barColor: "bg-sky-600",
      isLimit: true,
      status: micros.sodium <= goals.sodium ? "Under Limit" : "Exceeded",
      statusColor:
        micros.sodium <= goals.sodium
          ? "bg-sky-50 text-sky-700 border-sky-200"
          : "bg-rose-50 text-rose-700 border-rose-200",
      info: "Essential electrolyte; daily intake recommended under 2,300 mg for cardiovascular health.",
    },
    {
      name: "Potassium",
      amount: micros.potassium,
      target: goals.potassium,
      unit: "mg",
      color: "#6366f1", // indigo
      barColor: "bg-indigo-600",
      status: micros.potassium >= goals.potassium * 0.7 ? "On Track" : "Low",
      statusColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      info: "Balances sodium, supports muscle contraction, and regulates blood pressure.",
    },
    {
      name: "Calcium",
      amount: micros.calcium,
      target: goals.calcium,
      unit: "mg",
      color: "#f59e0b", // amber
      barColor: "bg-amber-500",
      status: micros.calcium >= goals.calcium * 0.7 ? "Good" : "Needs attention",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
      info: "Essential for bone density, cellular signaling, and muscle function.",
    },
    {
      name: "Iron",
      amount: micros.iron,
      target: goals.iron,
      unit: "mg",
      color: "#ec4899", // pink
      barColor: "bg-pink-600",
      status: micros.iron >= goals.iron * 0.7 ? "Good" : "Needs attention",
      statusColor: "bg-pink-50 text-pink-700 border-pink-200",
      info: "Core component of hemoglobin for oxygen transport and cellular energy.",
    },
    {
      name: "Vitamin C",
      amount: micros.vitaminC,
      target: goals.vitaminC,
      unit: "mg",
      color: "#f97316", // orange
      barColor: "bg-orange-500",
      status: micros.vitaminC >= goals.vitaminC * 0.7 ? "Optimal" : "Low",
      statusColor: "bg-orange-50 text-orange-700 border-orange-200",
      info: "Key antioxidant for immune function, collagen synthesis, and iron absorption.",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
              Daily Micronutrients & Minerals
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5 dark:text-neutral-400">
              Essential vitamins and minerals tracked against recommended daily intake (DRI)
            </p>
          </div>
          {onEditGoals ? (
            <button
              type="button"
              onClick={onEditGoals}
              className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100/70 transition dark:border-teal-900/60 dark:bg-teal-950/50 dark:text-teal-300 dark:hover:bg-teal-900/40"
              title="Edit micronutrient goals"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Micros Tracked</span>
              <Sliders className="h-3 w-3 text-teal-600 opacity-70 group-hover:opacity-100 transition dark:text-teal-400" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/50 dark:text-teal-300">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Micros Tracked</span>
            </div>
          )}
        </div>

        {/* Micronutrients Grid */}
        <TooltipProvider delayDuration={150}>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {microItems.map((item) => {
              const percent = Math.min(Math.round((item.amount / item.target) * 100), 100);

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 transition hover:bg-neutral-50 hover:shadow-2xs dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                            aria-label={`${item.name} info`}
                          >
                            <Info className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-xs">
                          {item.info}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="font-extrabold text-neutral-900 dark:text-neutral-100">
                      {item.amount.toLocaleString()} {item.unit}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                      {item.isLimit ? "Max" : "Goal"} {item.target.toLocaleString()} {item.unit}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/70 dark:bg-neutral-700">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${item.barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Summary Footer Pill */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-100/80 px-4 py-2.5 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-teal-500" />
          <span className="font-medium">
            Micronutrient adherence: <strong className="text-neutral-900 dark:text-neutral-100">88%</strong>
          </span>
        </div>
        <span className="text-[11px] text-neutral-600 dark:text-neutral-400">All major biomarkers in optimal range</span>
      </div>
    </div>
  );
}
