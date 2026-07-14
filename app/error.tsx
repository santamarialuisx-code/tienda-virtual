"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <span className="text-5xl">⚠️</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">Error del Servidor</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Algo salió mal de nuestro lado. Por favor, intenta de nuevo más tarde.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Volver al Inicio
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Intentar de Nuevo
        </button>
      </div>
    </div>
  );
}
