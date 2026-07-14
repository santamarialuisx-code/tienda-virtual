import { describe, it, expect } from "vitest";
import { checkoutFormSchema, pagomovilSchema } from "@/lib/validation";

describe("Checkout Validation", () => {
  describe("checkoutFormSchema", () => {
    const validData = {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      phone: "+58 412 1234567",
      address: "Av. Principal, Edif. 123, Piso 4, Apto 8",
      city: "Caracas",
      state: "Distrito Capital",
    };

    it("validates correct data", () => {
      const result = checkoutFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects short name", () => {
      const result = checkoutFormSchema.safeParse({
        ...validData,
        name: "J",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = checkoutFormSchema.safeParse({
        ...validData,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short phone", () => {
      const result = checkoutFormSchema.safeParse({
        ...validData,
        phone: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short address", () => {
      const result = checkoutFormSchema.safeParse({
        ...validData,
        address: "Calle 1",
      });
      expect(result.success).toBe(false);
    });

    it("allows optional notes", () => {
      const result = checkoutFormSchema.safeParse({
        ...validData,
        notes: "Entregar en la puerta",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("pagomovilSchema", () => {
    const validData = {
      bankName: "Banco de Venezuela",
      accountNumber: "01020000000000000000",
      phoneNumber: "04120000000",
      reference: "123456",
    };

    it("validates correct data", () => {
      const result = pagomovilSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects empty bank name", () => {
      const result = pagomovilSchema.safeParse({
        ...validData,
        bankName: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short account number", () => {
      const result = pagomovilSchema.safeParse({
        ...validData,
        accountNumber: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-numeric account number", () => {
      const result = pagomovilSchema.safeParse({
        ...validData,
        accountNumber: "abc123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short reference", () => {
      const result = pagomovilSchema.safeParse({
        ...validData,
        reference: "123",
      });
      expect(result.success).toBe(false);
    });
  });
});
