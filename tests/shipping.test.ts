import { describe, it, expect } from "vitest";
import {
  calculateShipping,
  calculateTax,
  getShippingInfo,
  getOrderTotal,
} from "@/lib/shipping";

describe("Shipping and Tax Calculation", () => {
  describe("calculateShipping", () => {
    it("returns 0 for free shipping threshold", () => {
      expect(calculateShipping(50)).toBe(0);
      expect(calculateShipping(60)).toBe(0);
      expect(calculateShipping(100)).toBe(0);
    });

    it("returns flat rate for orders under threshold", () => {
      expect(calculateShipping(0)).toBe(5);
      expect(calculateShipping(25)).toBe(5);
      expect(calculateShipping(49.99)).toBe(5);
    });
  });

  describe("calculateTax", () => {
    it("returns 0 for all amounts (Venezuela has no tax)", () => {
      expect(calculateTax(0)).toBe(0);
      expect(calculateTax(100)).toBe(0);
      expect(calculateTax(1000)).toBe(0);
    });
  });

  describe("getShippingInfo", () => {
    it("returns free shipping message when eligible", () => {
      const info = getShippingInfo(50);
      expect(info.cost).toBe(0);
      expect(info.isFree).toBe(true);
      expect(info.message).toContain("gratis");
    });

    it("returns shipping cost and remaining amount when not eligible", () => {
      const info = getShippingInfo(30);
      expect(info.cost).toBe(5);
      expect(info.isFree).toBe(false);
      expect(info.message).toContain("$5.00");
      expect(info.message).toContain("$20.00");
    });
  });

  describe("getOrderTotal", () => {
    it("calculates total correctly", () => {
      expect(getOrderTotal(100, 5, 0)).toBe(105);
      expect(getOrderTotal(50, 0, 0)).toBe(50);
      expect(getOrderTotal(0, 0, 0)).toBe(0);
    });
  });
});
