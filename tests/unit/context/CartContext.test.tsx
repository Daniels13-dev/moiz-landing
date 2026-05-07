import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should initialize with an empty cart and totals to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart.length).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.finalPrice).toBe(0);
  });

  it("should correctly calculate prices when adding a standard product", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "p1", name: "Croquetas", price: 10000, image: "img.jpg" });
    });

    expect(result.current.cart[0].price).toBe(10000); 
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(10000);
  });

  it("should apply a 5% discount automatically for subscriptions", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "p1", name: "Croquetas", price: 10000, image: "" }, null, true);
    });

    expect(result.current.cart[0].price).toBe(9500); // 10000 * 0.95
    expect(result.current.cart[0].isSubscription).toBe(true);
  });

  it("should calculate finalPrice correctly after applying a global coupon", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "p1", name: "Juguete", price: 20000, image: "" });
    });

    act(() => {
      result.current.applyCoupon({ code: "MOIZ20", discountPercentage: 20 });
    });

    expect(result.current.totalPrice).toBe(20000);
    expect(result.current.discountAmount).toBe(4000); // 20%
    expect(result.current.finalPrice).toBe(16000);    // 20000 - 4000
  });

  it("should remove item completely if quantity reaches 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "p1", name: "Juguete", price: 100, image: "" });
    });
    expect(result.current.cart.length).toBe(1);

    act(() => {
      result.current.updateQuantity("p1", -1);
    });

    expect(result.current.cart.length).toBe(0);
  });
});
