import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .max(255, "El correo es demasiado largo"),
  phone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(15, "El teléfono es demasiado largo")
    .regex(/^[\d\s\-\+\(\)]+$/, "El teléfono solo debe contener números"),
  address: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(255, "La dirección es demasiado larga"),
  city: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad es demasiado larga"),
  state: z
    .string()
    .min(2, "El estado debe tener al menos 2 caracteres")
    .max(100, "El estado es demasiado largo"),
  notes: z.string().max(500, "Las notas son demasiado largas").optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const pagomovilSchema = z.object({
  bankName: z.string().min(1, "Selecciona un banco"),
  accountNumber: z
    .string()
    .min(16, "El número de cuenta debe tener 16 dígitos")
    .max(20, "El número de cuenta es demasiado largo")
    .regex(/^\d+$/, "El número de cuenta solo debe contener números"),
  phoneNumber: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(11, "El teléfono es demasiado largo")
    .regex(/^\d+$/, "El teléfono solo debe contener números"),
  reference: z
    .string()
    .min(6, "La referencia debe tener al menos 6 caracteres")
    .max(20, "La referencia es demasiado larga"),
});

export type PagoMovilFormData = z.infer<typeof pagomovilSchema>;

// Auth validation schemas
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .max(255, "El correo es demasiado largo"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .max(255, "El correo es demasiado largo"),
  password: z
    .string()
    .min(1, "La contraseña es requerida"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const venezuelanBanks = [
  "Banco de Venezuela",
  "Banco Mercantil",
  "Banco Provincial",
  "Banco Nacional de Crédito",
  "Banco Banesco",
  "Banco Santander",
  "Banco de Occidente",
  "Banco Caroni",
  "Banco Plaza",
  "Banco Venezzuela de Crédito",
  "Bancaribe",
  "Banco Exterior",
  "Banco del Tesoro",
  "Banco Fondo Común",
  "Banco Popular",
  "Banco Privado de Arrendamiento Mercantil",
];

// Customization text validation
export const customizationTextSchema = z
  .string()
  .max(100, "El texto no puede superar los 100 caracteres")
  .optional();

export type CustomizationText = z.infer<typeof customizationTextSchema>;
