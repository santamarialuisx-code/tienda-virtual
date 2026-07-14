import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

describe("Auth Validation", () => {
  describe("registerSchema", () => {
    const validData = {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      password: "Password123",
      confirmPassword: "Password123",
    };

    it("validates correct registration data", () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects short name", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "J",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        ...validData,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("rejects weak password (no uppercase)", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects weak password (no number)", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "Password",
        confirmPassword: "Password",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "Pass1",
        confirmPassword: "Pass1",
      });
      expect(result.success).toBe(false);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        ...validData,
        confirmPassword: "Different123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("validates correct login data", () => {
      const result = loginSchema.safeParse({
        email: "juan@ejemplo.com",
        password: "password",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "password",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "juan@ejemplo.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("Password Hashing", () => {
  it("hashes password correctly", async () => {
    const password = "MySecurePassword123";
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it("verifies password correctly", async () => {
    const password = "MySecurePassword123";
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const password = "MySecurePassword123";
    const wrongPassword = "WrongPassword456";
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    
    const isValid = await bcrypt.compare(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});