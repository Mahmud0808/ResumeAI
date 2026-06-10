/**
 * Pure ownership check, separated from DB/auth so it can be unit-tested.
 * Throws "Unauthorized" when there is no caller, "Forbidden" when the resume
 * belongs to someone else. Returns normally when the caller owns it.
 */
export function verifyOwnership(
  resumeUserId: string | null | undefined,
  callerUserId: string | null | undefined
): void {
  if (!callerUserId) {
    throw new Error("Unauthorized");
  }
  if (resumeUserId !== callerUserId) {
    throw new Error("Forbidden");
  }
}
