import { describe, it, expect, vi } from "vitest";
import { ProductCard } from "@/components/product/ProductCard";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the sanity image module
vi.mock("@/lib/sanity/image", () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        url: () => "https://example.com/image.jpg",
      }),
    }),
  }),
}));

// Mock the currency context
vi.mock("@/app/contexts/CurrencyContext", () => ({
  useCurrency: () => ({
    currency: "USD",
    bcvRate: 36.5,
    toggleCurrency: vi.fn(),
    isLoading: false,
  }),
}));

const mockProduct = {
  _id: "123",
  name: "Test Product",
  slug: { current: "test-product" },
  price: 29.99,
  stock: 10,
  category: { name: "Electronics", slug: { current: "electronics" } },
  brand: "TestBrand",
  featured: false,
  createdAt: "2024-01-01T00:00:00Z",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(React.createElement(ProductCard, { product: mockProduct }));
    expect(screen.getByText("Test Product")).toBeTruthy();
  });

  it("renders product price in USD", () => {
    render(React.createElement(ProductCard, { product: mockProduct }));
    expect(screen.getByText("$29.99")).toBeTruthy();
  });

  it("renders category badge", () => {
    render(React.createElement(ProductCard, { product: mockProduct }));
    expect(screen.getByText("Electronics")).toBeTruthy();
  });

  it("renders brand name", () => {
    render(React.createElement(ProductCard, { product: mockProduct }));
    expect(screen.getByText("TestBrand")).toBeTruthy();
  });

  it("renders personalization badge when product is customizable", () => {
    const customizableProduct = { ...mockProduct, personalizationEnabled: true };
    render(React.createElement(ProductCard, { product: customizableProduct }));
    expect(screen.getByText("Personalizable")).toBeTruthy();
  });

  it("links to product detail page", () => {
    render(React.createElement(ProductCard, { product: mockProduct }));
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/products/test-product");
  });
});
