import { describe, it, expect } from "vitest";
import { verifyOwnership } from "../lib/ownership";

describe("verifyOwnership", () => {
  it("passes when caller owns the resume", () => {
    expect(() => verifyOwnership("user_1", "user_1")).not.toThrow();
  });

  it("throws Forbidden when the resume belongs to someone else", () => {
    expect(() => verifyOwnership("user_1", "user_2")).toThrow("Forbidden");
  });

  it("throws Unauthorized when there is no caller", () => {
    expect(() => verifyOwnership("user_1", null)).toThrow("Unauthorized");
    expect(() => verifyOwnership("user_1", undefined)).toThrow("Unauthorized");
    expect(() => verifyOwnership("user_1", "")).toThrow("Unauthorized");
  });

  it("throws Forbidden when the resume has no owner but caller is set", () => {
    expect(() => verifyOwnership(null, "user_1")).toThrow("Forbidden");
  });
});
