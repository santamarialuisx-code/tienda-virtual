"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { User, LogOut, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="p-2">
        <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/auth/register" className="hidden sm:block">
          <Button size="sm">Registrarse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {session.user.name || session.user.email}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              <p className="truncate">{session.user.email}</p>
              <p className="text-xs text-muted-foreground">
                {session.user.role === "admin" ? "Administrador" : "Usuario"}
              </p>
            </div>
            <div className="h-px bg-muted my-1" />
            <Link
              href="/account"
              className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Mi Cuenta
            </Link>
            <Link
              href="/account/orders"
              className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Package className="mr-2 h-4 w-4" />
              Mis Pedidos
            </Link>
            <div className="h-px bg-muted my-1" />
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}