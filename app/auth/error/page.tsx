import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">Error de Autenticación</h1>
        
        <p className="text-muted-foreground">
          Ha ocurrido un error durante el proceso de autenticación. 
          Por favor, intenta de nuevo.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}