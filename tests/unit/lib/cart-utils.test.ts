import { CartUtils } from "@/lib/cart-utils";
import { BUSINESS_CONFIG } from "@/config/business";

describe("CartUtils", () => {
  describe("parsePrice", () => {
    it("should return the same number if input is a number", () => {
      expect(CartUtils.parsePrice(120000)).toBe(120000);
    });

    it("should parse a formatted string to a number", () => {
      expect(CartUtils.parsePrice("$1.200.000")).toBe(1200000);
      expect(CartUtils.parsePrice("400.000")).toBe(400000);
    });

    it("should return 0 for invalid inputs", () => {
      expect(CartUtils.parsePrice("")).toBe(0);
      expect(CartUtils.parsePrice("abc")).toBe(0);
    });
  });

  describe("calculateItemPrice", () => {
    const basePrice = 100000;

    it("should return base price when no variant or subscription", () => {
      expect(CartUtils.calculateItemPrice(basePrice)).toBe(100000);
    });

    it("should use variant price if provided", () => {
      expect(CartUtils.calculateItemPrice(basePrice, 90000)).toBe(90000);
    });

    it("should apply subscription discount correctly", () => {
      const expected = Math.round(basePrice * (1 - BUSINESS_CONFIG.subscriptions.discountRate));
      expect(CartUtils.calculateItemPrice(basePrice, null, true)).toBe(expected);
    });

    it("should apply subscription discount to variant price", () => {
      const variantPrice = 80000;
      const expected = Math.round(variantPrice * (1 - BUSINESS_CONFIG.subscriptions.discountRate));
      expect(CartUtils.calculateItemPrice(basePrice, variantPrice, true)).toBe(expected);
    });
  });

  describe("generateCartItemId", () => {
    it("should generate a simple ID for base product", () => {
      expect(CartUtils.generateCartItemId("prod1")).toBe("prod1");
    });

    it("should include variant ID if provided", () => {
      expect(CartUtils.generateCartItemId("prod1", "var1")).toBe("prod1-var1");
    });

    it("should include sub suffix for subscriptions", () => {
      expect(CartUtils.generateCartItemId("prod1", undefined, true)).toBe("prod1-sub");
      expect(CartUtils.generateCartItemId("prod1", "var1", true)).toBe("prod1-var1-sub");
    });
  });

  describe("calculateSummary", () => {
    const cart = [
      { id: "1", price: 10000, quantity: 2 },
      { id: "2", price: 20000, quantity: 1 },
    ];

    it("should calculate totals correctly without discount", () => {
      const summary = CartUtils.calculateSummary(cart);
      expect(summary.totalItems).toBe(3);
      expect(summary.totalPrice).toBe(40000);
      expect(summary.discountAmount).toBe(0);
      expect(summary.finalPrice).toBe(40000);
    });

    it("should apply percentage discount correctly", () => {
      const summary = CartUtils.calculateSummary(cart, 10); // 10% discount
      expect(summary.totalPrice).toBe(40000);
      expect(summary.discountAmount).toBe(4000);
      expect(summary.finalPrice).toBe(36000);
    });

    it("should handle empty cart", () => {
      const summary = CartUtils.calculateSummary([]);
      expect(summary.totalItems).toBe(0);
      expect(summary.totalPrice).toBe(0);
      expect(summary.finalPrice).toBe(0);
    });
  });
});
