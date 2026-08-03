import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Local-only image picker. Files never leave the browser — a preview is
 * generated with an object URL purely for the mock experience.
 */
export function ImageUpload({
  label,
  hint,
  shape = "square",
  value,
  onChange,
  className,
}: {
  label: string;
  hint?: string;
  shape?: "square" | "circle";
  value?: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-xl border border-input bg-card/70 p-3">
        <span
          className={cn(
            "grid size-14 shrink-0 place-items-center overflow-hidden border border-dashed border-input bg-secondary/60 text-muted-foreground",
            shape === "circle" ? "rounded-full" : "rounded-xl",
          )}
        >
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-5" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              <Upload className="size-3.5" aria-hidden="true" />
              {value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setFileName(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" aria-hidden="true" /> Remove
              </button>
            )}
          </div>
          <p className="mt-1.5 truncate text-[11px] text-muted-foreground">
            {fileName ?? hint ?? "PNG or SVG, up to 2 MB. Stored locally in this demo."}
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        aria-label={label}
      />
    </div>
  );
}
