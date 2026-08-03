import { validatePasswordPolicy, checkRateLimit, validateFileUpload } from "@/lib/security";
import { assertPermission } from "@/integrations/supabase/auth-middleware";
import type { Permission } from "@/lib/auth/types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Security Test Failed: ${message}`);
  }
}

export function runSecurityTestSuite() {
  // Test 1: Password Policy Validation
  const weakRes = validatePasswordPolicy("simple");
  assert(weakRes.valid === false, "Weak password must be rejected");

  const strongRes = validatePasswordPolicy("Ofc@2026Secure!");
  assert(strongRes.valid === true, "Strong password must be accepted");

  // Test 2: Rate Limiting
  const id = "test-rate-limit-ip";
  assert(checkRateLimit(id, 60000, 2).allowed === true, "First request must be allowed");
  assert(checkRateLimit(id, 60000, 2).allowed === true, "Second request must be allowed");
  assert(checkRateLimit(id, 60000, 2).allowed === false, "Third request exceeding limit must be blocked");

  // Test 3: File Upload Sanitization
  const validFile = validateFileUpload("contract.pdf", 1024 * 1024, "application/pdf");
  assert(validFile.valid === true, "Valid PDF must be allowed");

  const invalidExt = validateFileUpload("malicious.sh", 500, "application/x-sh");
  assert(invalidExt.valid === false, "Executable extension must be rejected");

  // Test 4: Server Permission Assertion
  let permissionBlocked = false;
  try {
    assertPermission(["self:view"], "people:manage");
  } catch {
    permissionBlocked = true;
  }
  assert(permissionBlocked === true, "Lacking required permission must throw forbidden error");

  console.log("✅ All Security Test Suite assertions passed successfully.");
  return true;
}
