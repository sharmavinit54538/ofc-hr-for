import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  invalid = false,
  autoFocus = true,
  label = "One-time passcode",
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  label?: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digit || " ";
    onChange(chars.join("").replace(/\s/g, " ").trimEnd().replace(/\s/g, ""));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[index] = digit;
    const joined = next.join("").slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      event.preventDefault();
      setDigit(index - 1, "");
      const next = value.split("");
      next[index - 1] = "";
      onChange(next.join(""));
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div role="group" aria-label={label} className="flex justify-between gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid}
          value={value[index] ?? ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "h-14 w-full min-w-0 rounded-xl border bg-card/70 text-center font-display text-xl font-bold outline-none transition-all duration-300",
            "focus:border-ring focus:shadow-glow disabled:opacity-60",
            invalid ? "border-destructive/60" : "border-input",
          )}
        />
      ))}
    </div>
  );
}
