/**
 * Security Engine for OFC HR Workforce Platform
 * - Password Policy Enforcement
 * - Brute-Force Rate Limiting
 * - File Upload MIME & Size Sanitization
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordPolicy(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// In-memory sliding window rate limiter
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  windowMs: number = 60000, // 1 minute window
  maxRequests: number = 10 // Max 10 requests per minute
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetMs: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetMs: entry.resetAt - now };
}

// File Upload Security Validator
export const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateFileUpload(
  fileName: string,
  fileSizeBytes: number,
  mimeType: string
): { valid: boolean; error?: string } {
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File size exceeds max limit of 5 MB (Current: ${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB)` };
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    return { valid: false, error: `File type '${mimeType}' is not allowed for security reasons.` };
  }

  // Check file extension mismatch prevention
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "exe" || ext === "sh" || ext === "bat" || ext === "cmd" || ext === "vbs" || ext === "js" || ext === "html") {
    return { valid: false, error: "Executable or script files are strictly prohibited." };
  }

  return { valid: true };
}
