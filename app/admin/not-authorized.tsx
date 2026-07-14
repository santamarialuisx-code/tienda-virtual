import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function NotAuthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">Acceso No Autorizado</h1>
        
        <p className="text-muted-foreground">
          No tienes permisos para acceder a esta página. 
          Si crees que esto es un error, contacta al administrador.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
          <Link href="/account">
            <Button>Mi Cuenta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}