import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { SearchBar } from "@/components/search/SearchBar";
import { CartHeader } from "@/components/cart/CartHeader";
import { AuthButton } from "@/components/auth/AuthButton";

const navLinks = [
  { href: "/products", label: "Productos" },
  { href: "/collections", label: "Colecciones" },
  { href: "/categories", label: "Categorías" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container mx-auto flex h-16 items-center px-4 gap-4">
        {/* Left: Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-6 shrink-0"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2"
          aria-label="Tienda Virtual - Inicio"
        >
          <span className="text-xl font-bold">Tienda Virtual</span>
        </Link>

        {/* Right: Search + Actions */}
        <div className="flex items-center space-x-4 ml-auto">
          <SearchBar />
          <CartHeader />
          <AuthButton />
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
