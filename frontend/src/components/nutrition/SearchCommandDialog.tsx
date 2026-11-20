import { useEffect } from "react";
import { Camera, Utensils, PlusCircle, Sparkles, Flame } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import type { LoggedMeal } from "./dashboard-types";

interface SearchCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meals: LoggedMeal[];
  onSelectMeal: (meal: LoggedMeal) => void;
  onOpenScanModal: () => void;
  onLogEveningSuggestion: () => void;
}

export function SearchCommandDialog({
  isOpen,
  onClose,
  meals,
  onSelectMeal,
  onOpenScanModal,
  onLogEveningSuggestion,
}: SearchCommandDialogProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput placeholder="Search meals, recipes, or type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              onClose();
              onOpenScanModal();
            }}
          >
            <Camera className="mr-2 h-4 w-4 text-orange-500" />
            <span>Scan Meal with AI Vision</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onClose();
              onLogEveningSuggestion();
            }}
          >
            <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
            <span>Log AI Evening Suggestion (Herb Chicken & Sweet Potato)</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Today's Logged Meals">
          {meals.map((meal) => (
            <CommandItem
              key={meal.id}
              onSelect={() => {
                onSelectMeal(meal);
                onClose();
              }}
            >
              <Utensils className="mr-2 h-4 w-4 text-neutral-500" />
              <div className="flex flex-1 items-center justify-between">
                <span>
                  {meal.slot}: {meal.name}
                </span>
                <span className="text-xs font-semibold text-neutral-500">{meal.calories} kcal</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Popular Healthy Dishes">
          <CommandItem
            onSelect={() => {
              onClose();
              onOpenScanModal();
            }}
          >
            <Flame className="mr-2 h-4 w-4 text-rose-500" />
            <span>Salmon Quinoa Bowl (540 kcal)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onClose();
              onOpenScanModal();
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-sky-500" />
            <span>Traditional Indian Thali (650 kcal)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
