import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatUSD, formatBs, convertToBs, formatPrice } from "@/lib/currency";

describe("Currency Conversion", () => {
  describe("formatUSD", () => {
    it("formats a number as USD currency", () => {
      expect(formatUSD(10)).toBe("$10.00");
      expect(formatUSD(10.5)).toBe("$10.50");
      expect(formatUSD(1000)).toBe("$1,000.00");
      expect(formatUSD(0)).toBe("$0.00");
    });

    it("handles negative values", () => {
      expect(formatUSD(-5)).toBe("-$5.00");
    });

    it("handles decimal precision", () => {
      expect(formatUSD(9.99)).toBe("$9.99");
      expect(formatUSD(10.1)).toBe("$10.10");
    });
  });

  describe("formatBs", () => {
    it("formats a number as Bs. currency", () => {
      const result = formatBs(365);
      expect(result).toContain("365");
      expect(result).toContain("00");
    });
  });

  describe("convertToBs", () => {
    it("converts USD to Bs. using the given rate", () => {
      expect(convertToBs(10, 36.5)).toBe(365);
      expect(convertToBs(1, 36.5)).toBe(36.5);
      expect(convertToBs(0, 36.5)).toBe(0);
    });

    it("handles zero rate gracefully", () => {
      expect(convertToBs(10, 0)).toBe(0);
    });
  });

  describe("formatPrice", () => {
    it("formats USD when currency is USD", () => {
      expect(formatPrice(10, "USD")).toBe("$10.00");
    });

    it("formats Bs. when currency is Bs. and rate is provided", () => {
      const result = formatPrice(10, "Bs.", 36.5);
      expect(result).toContain("365");
    });

    it("falls back to USD when rate is not provided for Bs.", () => {
      expect(formatPrice(10, "Bs.")).toBe("$10.00");
    });
  });
});
