"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormData } from "@/lib/validation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Error al registrar usuario");
        return;
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed
        setError("Cuenta creada. Ahora puedes iniciar sesión.");
        router.push("/auth/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Error al registrar usuario. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre completo
        </label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Juan Pérez"
          aria-invalid={!!errors.name}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Correo electrónico
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="tu@ejemplo.com"
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        
        {/* Password strength indicator */}
        {password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {strengthLabels[passwordStrength]}
            </p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>La contraseña debe:</p>
          <ul className="list-disc list-inside">
            <li className={password.length >= 8 ? "text-green-600" : ""}>
              Tener al menos 8 caracteres
            </li>
            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
              Contener al menos una mayúscula
            </li>
            <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
              Contener al menos un número
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirmar contraseña
        </label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
          aria-invalid={!!errors.confirmPassword}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 rounded border-input"
          disabled={isLoading}
          required
        />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          Acepto los{" "}
          <a href="#" className="text-primary hover:underline">
            términos y condiciones
          </a>{" "}
          y la{" "}
          <a href="#" className="text-primary hover:underline">
            política de privacidad
          </a>
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>
    </form>
  );
}