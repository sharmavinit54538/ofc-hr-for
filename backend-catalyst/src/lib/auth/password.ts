export interface PasswordRequirement {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: "length", label: "At least 10 characters", test: (v) => v.length >= 10 },
  { id: "case", label: "Upper and lowercase letters", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { id: "number", label: "At least one number", test: (v) => /\d/.test(v) },
  { id: "symbol", label: "At least one symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
  { id: "spaces", label: "No leading or trailing spaces", test: (v) => v.length > 0 && v.trim() === v },
];

export type StrengthLevel = "Very weak" | "Weak" | "Fair" | "Good" | "Strong";

export interface PasswordStrengthResult {
  score: number;
  max: number;
  level: StrengthLevel;
  met: string[];
  unmet: string[];
}

export function evaluatePassword(value: string): PasswordStrengthResult {
  const met = PASSWORD_REQUIREMENTS.filter((r) => r.test(value)).map((r) => r.id);
  const unmet = PASSWORD_REQUIREMENTS.filter((r) => !r.test(value)).map((r) => r.id);
  const score = value.length === 0 ? 0 : met.length;
  const levels: StrengthLevel[] = ["Very weak", "Very weak", "Weak", "Fair", "Good", "Strong"];
  return {
    score,
    max: PASSWORD_REQUIREMENTS.length,
    level: levels[score] ?? "Very weak",
    met,
    unmet,
  };
}

export function isPasswordAcceptable(value: string): boolean {
  return evaluatePassword(value).score >= PASSWORD_REQUIREMENTS.length;
}
