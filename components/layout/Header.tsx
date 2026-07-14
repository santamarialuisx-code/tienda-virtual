import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/categories", label: "Categorías" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Tienda Virtual</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link
            href="/account"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Mi cuenta"
          >
            <User className="h-5 w-5" />
          </Link>
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
