import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <span className="text-5xl">🔍</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">Página No Encontrada</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Volver al Inicio
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    </div>
  );
}
