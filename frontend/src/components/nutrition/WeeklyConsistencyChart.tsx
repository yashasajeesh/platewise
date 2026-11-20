import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { DayConsistency } from "./dashboard-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WeeklyConsistencyChartProps {
  data: DayConsistency[];
  targetCalories?: number;
}

export function WeeklyConsistencyChart({
  data,
  targetCalories = 2040,
}: WeeklyConsistencyChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 180;
  const paddingX = 35;
  const paddingTop = 25;
  const paddingBottom = 30;

  const minCal = 1200;
  const maxCal = 2600;

  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
  };

  const getY = (cal: number) => {
    const clamped = Math.min(Math.max(cal, minCal), maxCal);
    const normalized = (clamped - minCal) / (maxCal - minCal);
    return height - paddingBottom - normalized * (height - paddingTop - paddingBottom);
  };

  const targetY = getY(targetCalories);

  // Build smooth Bézier curve through points
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.calories) }));

  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0]!.x} ${pts[0]!.y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]!;
      const p1 = pts[i]!;
      const p2 = pts[i + 1]!;
      const p3 = pts[Math.min(pts.length - 1, i + 2)]!;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]!.x} ${
    height - paddingBottom
  } L ${points[0]!.x} ${height - paddingBottom} Z`;

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900 sm:text-lg">
          7-Day Metabolic & Calorie Consistency
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              aria-label="Chart options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>View 30-day trend</DropdownMenuItem>
            <DropdownMenuItem>Adjust target</DropdownMenuItem>
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Target indicator label */}
      <div className="mt-1 flex justify-end">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <div className="h-0.5 w-4 border-t-2 border-dashed border-neutral-400" />
          <span>Daily target</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative mt-2 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#0d9488" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Dotted Target Line */}
          <line
            x1={paddingX}
            y1={targetY}
            x2={width - paddingX}
            y2={targetY}
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Gradient Area Fill */}
          <path d={areaPath} fill="url(#waveGradient)" />

          {/* Wave Curve Line */}
          <path d={linePath} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            const item = data[idx]!;

            return (
              <g
                key={item.day}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Invisible hover target */}
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                {/* Point dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : item.isToday ? 4.5 : 3.5}
                  fill={isHovered ? "#0d9488" : item.isToday ? "#0f766e" : "#0d9488"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white shadow-md transition-all"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
            }}
          >
            {data[hoveredIndex].day}: {data[hoveredIndex].calories} kcal
          </div>
        )}
      </div>

      {/* X-Axis Days Labels */}
      <div className="flex justify-between px-2 pt-1 text-xs font-medium text-neutral-600">
        {data.map((item, idx) => (
          <div
            key={item.day}
            className={`cursor-pointer transition-colors ${
              hoveredIndex === idx
                ? "font-bold text-neutral-900"
                : item.isToday
                  ? "font-bold text-teal-700"
                  : "text-neutral-600"
            }`}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
}
