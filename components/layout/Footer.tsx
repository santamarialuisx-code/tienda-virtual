import Link from "next/link";

const footerLinks = {
  tienda: [
    { href: "/products", label: "Productos" },
    { href: "/categories", label: "Categorías" },
    { href: "/about", label: "Nosotros" },
  ],
  ayuda: [
    { href: "/contact", label: "Contacto" },
    { href: "/faq", label: "Preguntas Frecuentes" },
    { href: "/shipping", label: "Envíos" },
  ],
  legal: [
    { href: "/privacy", label: "Privacidad" },
    { href: "/terms", label: "Términos" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-bold">
              Tienda Virtual
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu tienda en línea con los mejores productos y precios en Venezuela.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Tienda</h3>
            <ul className="space-y-2">
              {footerLinks.tienda.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Ayuda</h3>
            <ul className="space-y-2">
              {footerLinks.ayuda.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tienda Virtual. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
