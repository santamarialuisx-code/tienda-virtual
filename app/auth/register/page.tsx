import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Regístrate para empezar a comprar
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Cargando...</div>}>
          <RegisterForm />
        </Suspense>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
          <Link href="/auth/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}