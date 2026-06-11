export const MAX_INPUT_LENGTH = 200;

/** Fence markers used to delimit untrusted user data inside a prompt. */
export const USER_DATA_OPEN = "<<USER_DATA>>";
export const USER_DATA_CLOSE = "<<END_USER_DATA>>";

/**
 * Clamps and flattens user-controlled text before it goes into a prompt:
 *  - strips line breaks (kills multi-line "ignore previous instructions" tricks)
 *  - removes angle-bracket runs so the input cannot forge the data fences above
 *  - caps length (bounds token cost)
 * Defense in depth — the data is ALSO passed as fenced content with a system
 * instruction telling the model to treat it as literal data, not commands.
 */
export function sanitizeInput(value: string | undefined | null): string {
  return (value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[<>]{2,}/g, " ")
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
