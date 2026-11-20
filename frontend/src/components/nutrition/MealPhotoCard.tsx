import { useRef, type ChangeEvent, type DragEvent } from "react";
import {
  Activity,
  AlertCircle,
  ChevronRight,
  FileImage,
  LoaderCircle,
  Sparkles,
  Upload,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Photo } from "./types";

export type MealPhotoCardProps = {
  photo: Photo;
  isAnalyzing: boolean;
  error: string;
  isDragging: boolean;
  onSelectPhoto: (file: File | undefined) => void;
  onAnalyze: () => void;
  setIsDragging: (dragging: boolean) => void;
};

export function MealPhotoCard({
  photo,
  isAnalyzing,
  error,
  isDragging,
  onSelectPhoto,
  onAnalyze,
  setIsDragging,
}: MealPhotoCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectPhoto(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onSelectPhoto(event.dataTransfer.files[0]);
  };

  return (
    <section
      className="overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5"
      aria-label="Meal photo"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Your meal</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A clear photo helps with portion estimates.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
          <Utensils size={13} />
          Single dish or thali
        </span>
      </div>

      <div
        className={`image-frame ${isDragging ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <img
          src={photo.src}
          alt={
            photo.isSample
              ? "An example Indian thali with dal, palak paneer, rice, roti, raita and sides"
              : "Selected meal photo"
          }
          width={1024}
          height={1024}
        />
        <span className="photo-badge">
          <FileImage size={14} />
          {photo.isSample ? "Example thali" : "Your photo"}
        </span>
        {isDragging && (
          <div className="absolute inset-0 grid place-items-center bg-background/85 text-sm font-semibold text-primary">
            Drop your meal photo
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Choose a food photo"
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" onClick={() => inputRef.current?.click()} className="h-11 flex-1">
          <Upload size={16} />
          Choose a photo
        </Button>
        <Button onClick={onAnalyze} disabled={isAnalyzing} className="h-11 flex-1">
          {isAnalyzing ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {isAnalyzing ? "Reading your plate…" : "Analyze this meal"}
          {!isAnalyzing && <ChevronRight size={16} />}
        </Button>
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        JPG, PNG or WebP · Your photo is analyzed securely and not saved
      </p>

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isAnalyzing && (
        <div
          className="scan-skeleton mt-4 flex items-center gap-3 rounded-md bg-secondary/70 p-3 text-sm text-secondary-foreground"
          role="status"
        >
          <Activity size={17} className="text-primary" />
          <span>Looking for each dish and estimating serving sizes…</span>
        </div>
      )}
    </section>
  );
}
