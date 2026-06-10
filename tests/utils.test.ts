import { describe, expect, it } from "vitest";
import { formatResumeDate, sanitizeNbsp } from "../lib/utils";

describe("formatResumeDate", () => {
  it("returns empty string for empty input", () => {
    expect(formatResumeDate("", "mmm-yyyy")).toBe("");
    expect(formatResumeDate(undefined, "mmm-yyyy")).toBe("");
    expect(formatResumeDate(null, "mmm-yyyy")).toBe("");
  });

  it("passes through with the default format", () => {
    expect(formatResumeDate("2023-07-05", "default")).toBe("2023-07-05");
    expect(formatResumeDate("2023-07-05", undefined)).toBe("2023-07-05");
  });

  it("passes through unparseable values", () => {
    expect(formatResumeDate("July 2023", "mmm-yyyy")).toBe("July 2023");
    expect(formatResumeDate("2023-13-05", "mmm-yyyy")).toBe("2023-13-05");
  });

  it("formats ISO dates per format id", () => {
    expect(formatResumeDate("2023-07-05", "mmm-yyyy")).toBe("Jul 2023");
    expect(formatResumeDate("2023-07-05", "mmmm-yyyy")).toBe("July 2023");
    expect(formatResumeDate("2023-07-05", "mm-yyyy")).toBe("07/2023");
    expect(formatResumeDate("2023-07-05", "mm-dot-yyyy")).toBe("07.2023");
    expect(formatResumeDate("2023-07-05", "yyyy")).toBe("2023");
    expect(formatResumeDate("2023-07-05", "dd-mmm-yyyy")).toBe("05 Jul 2023");
    expect(formatResumeDate("2023-07-05", "dd-mmmm-yyyy")).toBe("05 July 2023");
    expect(formatResumeDate("2023-07-05", "dd-mm-yyyy")).toBe("05/07/2023");
    expect(formatResumeDate("2023-07-05", "dd-dot-mm-yyyy")).toBe("05.07.2023");
    expect(formatResumeDate("2023-07-05", "mmm-dd-yyyy")).toBe("Jul 5, 2023");
    expect(formatResumeDate("2023-07-05", "mmmm-dd-yyyy")).toBe("July 5, 2023");
    expect(formatResumeDate("2023-07-05", "mm-dd-yyyy")).toBe("07/05/2023");
    expect(formatResumeDate("2023-07-05", "yyyy-mm-dd")).toBe("2023-07-05");
    expect(formatResumeDate("2023-07-05", "yyyy-slash-mm-dd")).toBe(
      "2023/07/05"
    );
  });
});

describe("sanitizeNbsp", () => {
  it("replaces &nbsp; entities and raw non-breaking spaces", () => {
    expect(sanitizeNbsp("a&nbsp;b")).toBe("a b");
    expect(sanitizeNbsp("a b")).toBe("a b");
    expect(sanitizeNbsp("a&nbsp;&nbsp;b")).toBe("a  b");
  });

  it("leaves regular text untouched", () => {
    expect(sanitizeNbsp("<p>hello world</p>")).toBe("<p>hello world</p>");
  });
});
