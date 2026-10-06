import { describe, expect, it } from "vitest";
import { formatYear, formatYearRange, yearsBetween } from "@/lib/years";

describe("formatYear", () => {
  it("formats BCE, CE and grouping", () => {
    expect(formatYear(-500)).toBe("500 a.C.");
    expect(formatYear(117)).toBe("117 d.C.");
    expect(formatYear(1969)).toBe("1969");
    expect(formatYear(-3500)).toBe("3500 a.C.");
    expect(formatYear(-300000)).toBe("300.000 a.C.");
    expect(formatYear(-10000)).toBe("10.000 a.C.");
  });
  it("throws on year 0", () => {
    expect(() => formatYear(0)).toThrow(RangeError);
  });
});

describe("formatYearRange", () => {
  it("handles each combination", () => {
    expect(formatYearRange(-3100, -1000)).toBe("3100 – 1000 a.C.");
    expect(formatYearRange(-27, 476)).toBe("27 a.C. – 476 d.C.");
    expect(formatYearRange(320, 550)).toBe("320 – 550 d.C.");
    expect(formatYearRange(1206, 1368)).toBe("1206 – 1368");
    expect(formatYearRange(600, 1200)).toBe("600 – 1200");
  });
  it("returns override", () => {
    expect(formatYearRange(-1, 1, "custom")).toBe("custom");
  });
});

describe("yearsBetween", () => {
  it("skips year 0", () => {
    expect(yearsBetween(-1, 1)).toBe(1);
    expect(yearsBetween(-100, 100)).toBe(199);
    expect(yearsBetween(100, 200)).toBe(100);
    expect(yearsBetween(-200, -100)).toBe(100);
  });
});
