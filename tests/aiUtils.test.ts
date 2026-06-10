import { describe, it, expect } from "vitest";
import { sanitizeInput, isQuotaError, MAX_INPUT_LENGTH } from "../lib/aiUtils";

describe("sanitizeInput", () => {
  it("returns empty string for null/undefined", () => {
    expect(sanitizeInput(null)).toBe("");
    expect(sanitizeInput(undefined)).toBe("");
  });

  it("collapses newlines and whitespace into single spaces", () => {
    expect(sanitizeInput("Senior\n\nEngineer\t  Lead")).toBe(
      "Senior Engineer Lead"
    );
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizeInput("   Designer   ")).toBe("Designer");
  });

  it("caps length at MAX_INPUT_LENGTH", () => {
    const long = "a".repeat(MAX_INPUT_LENGTH + 50);
    expect(sanitizeInput(long)).toHaveLength(MAX_INPUT_LENGTH);
  });
});

describe("isQuotaError", () => {
  it("detects HTTP 429 via status", () => {
    expect(isQuotaError({ status: 429 })).toBe(true);
  });

  it("detects HTTP 429 via code", () => {
    expect(isQuotaError({ code: 429 })).toBe(true);
  });

  it("detects RESOURCE_EXHAUSTED / quota in message", () => {
    expect(isQuotaError({ message: "RESOURCE_EXHAUSTED" })).toBe(true);
    expect(isQuotaError({ message: "You exceeded your quota" })).toBe(true);
    expect(isQuotaError({ message: "rate limit hit" })).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isQuotaError({ status: 500, message: "boom" })).toBe(false);
    expect(isQuotaError(null)).toBe(false);
  });
});
