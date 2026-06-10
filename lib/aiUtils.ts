export const MAX_INPUT_LENGTH = 200;

/**
 * Clamps and flattens user-controlled text before interpolating it into a
 * prompt: strips line breaks (limits prompt-injection surface) and caps length
 * (bounds token cost).
 */
export function sanitizeInput(value: string | undefined | null): string {
  return (value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

/** True when a Gemini error is an upstream quota / rate-limit (HTTP 429). */
export function isQuotaError(error: any): boolean {
  const status = error?.status ?? error?.code;
  const message = String(error?.message ?? "");
  return (
    status === 429 || /RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(message)
  );
}
